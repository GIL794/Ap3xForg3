// Vercel Serverless Function: /api/verify-license
// Provides remote revocation authority and secure server-side passcode verification
// Prevents secrets and revocation lists from being exposed to the client bundle

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Comma-separated list of revoked athlete IDs, emails, or transaction IDs
  // e.g. "athlete_123,fraud@gmail.com,ATM-8839-2049"
  const rawRevoked = process.env.REVOKED_ATHLETES || '';
  const revokedList = rawRevoked
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  // Server-side active passcode (defaulting to C0D3T0UNL0CK if not configured in env)
  const serverPasscode = (process.env.SERVER_PRO_PASSCODE || process.env.VITE_LIFETIME_PRO_CODE || 'C0D3T0UNL0CK')
    .toUpperCase()
    .trim();

  // Global killswitch flag: if set to "true", all non-founder access is revoked
  const isGlobalRevoked = process.env.GLOBAL_PRO_REVOKED === 'true';

  // Helper to check if an identity is blacklisted
  const isIdentityRevoked = (userId, email, receiptId) => {
    if (isGlobalRevoked) return true;
    const checks = [
      userId ? String(userId).trim().toLowerCase() : '',
      email ? String(email).trim().toLowerCase() : '',
      receiptId ? String(receiptId).trim().toLowerCase() : '',
    ].filter(Boolean);

    return checks.some(val => revokedList.includes(val));
  };

  // 1. GET: Remote Heartbeat & Revocation Status Check
  if (req.method === 'GET') {
    const { userId, email, receiptId } = req.query;

    if (isIdentityRevoked(userId, email, receiptId)) {
      return res.status(200).json({
        status: 'ok',
        valid: false,
        revoked: true,
        reason: 'Access has been revoked by the system administrator.',
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(200).json({
      status: 'ok',
      valid: true,
      revoked: false,
      timestamp: new Date().toISOString(),
    });
  }

  // 2. POST: Secure Server-Side Passcode Verification
  if (req.method === 'POST') {
    const { passcode, userId, email } = req.body || {};

    if (isIdentityRevoked(userId, email)) {
      return res.status(403).json({
        status: 'error',
        success: false,
        revoked: true,
        message: 'This account has been revoked by the system administrator.',
      });
    }

    const cleanInput = (passcode || '').toUpperCase().trim();
    if (!cleanInput) {
      return res.status(400).json({
        status: 'error',
        success: false,
        message: 'Passcode is required.',
      });
    }

    const isMatch = cleanInput === serverPasscode;

    if (isMatch) {
      return res.status(200).json({
        status: 'ok',
        success: true,
        message: 'Emperor Passcode verified by central authority.',
        timestamp: new Date().toISOString(),
      });
    } else {
      return res.status(200).json({
        status: 'ok',
        success: false,
        message: 'Invalid Emperor Passcode.',
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
