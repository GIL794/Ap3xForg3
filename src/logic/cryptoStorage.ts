/**
 * HOMO DEVS — Cryptographic Ledger Engine (ISO/IEC 27001 & ISO 8000 Integrity)
 * 
 * Provides client-side AES-GCM 256-bit encryption with PBKDF2 key derivation
 * and SHA-256 digital provenance sealing using the standard Web Crypto API.
 */

const ENCRYPTED_LEDGER_KEY = 'homodeus_encrypted_ledger_v1';
const DEFAULT_SALT_KEY = 'homodeus_ledger_salt_v1';
const DEFAULT_KEY_PHRASE = 'HOMO_DEVS_AES_256_GLADIATOR_LEDGER_MASTER_KEY';

export interface EncryptedPackage {
  algorithm: 'AES-GCM-256';
  ciphertext: string; // Base64 encoded
  iv: string;         // Base64 encoded (12 bytes initialization vector)
  salt: string;       // Base64 encoded (16 bytes PBKDF2 salt)
  sha256Checksum: string; // Hexadecimal SHA-256 integrity digest
  timestamp: string;
  version: '1.0.0';
}

export interface SecurityAuditReport {
  isEncrypted: boolean;
  cipher: string;
  keyLength: number;
  hashAlgorithm: string;
  lastChecksum: string;
  payloadBytes: number;
  lastSealedAt: string;
}

// Convert BufferSource to Base64
function bufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert Base64 to ArrayBuffer
function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Compute SHA-256 Hex Digest of string
export async function computeSha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Derive AES-GCM-256 Key via PBKDF2
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as any,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts arbitrary JavaScript data into an AES-GCM-256 authenticated package.
 */
export async function encryptData(data: unknown, passphrase = DEFAULT_KEY_PHRASE): Promise<EncryptedPackage> {
  const jsonString = JSON.stringify(data);
  const sha256Checksum = await computeSha256(jsonString);

  // Generate cryptographic salt and IV
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKey(passphrase, salt);
  const encodedPayload = new TextEncoder().encode(jsonString);

  const cipherBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encodedPayload
  );

  return {
    algorithm: 'AES-GCM-256',
    ciphertext: bufferToBase64(cipherBuffer),
    iv: bufferToBase64(iv.buffer),
    salt: bufferToBase64(salt.buffer),
    sha256Checksum,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  };
}

/**
 * Decrypts an authenticated AES-GCM-256 package and verifies SHA-256 checksum integrity.
 */
export async function decryptData<T = unknown>(
  pkg: EncryptedPackage,
  passphrase = DEFAULT_KEY_PHRASE
): Promise<T> {
  const salt = new Uint8Array(base64ToBuffer(pkg.salt));
  const iv = new Uint8Array(base64ToBuffer(pkg.iv));
  const ciphertextBuffer = base64ToBuffer(pkg.ciphertext);

  const key = await deriveKey(passphrase, salt);

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    ciphertextBuffer
  );

  const decryptedJson = new TextDecoder().decode(decryptedBuffer);

  // Verify SHA-256 digest to prevent tampering
  const currentChecksum = await computeSha256(decryptedJson);
  if (currentChecksum !== pkg.sha256Checksum) {
    throw new Error('ISO 8000 Integrity Violation: SHA-256 Checksum mismatch. The ledger payload has been modified or corrupted.');
  }

  return JSON.parse(decryptedJson) as T;
}

/**
 * Saves arbitrary data directly into the Encrypted Local Ledger partition.
 */
export async function saveToEncryptedLedger(data: unknown, passphrase = DEFAULT_KEY_PHRASE): Promise<EncryptedPackage> {
  const encryptedPkg = await encryptData(data, passphrase);
  try {
    localStorage.setItem(ENCRYPTED_LEDGER_KEY, JSON.stringify(encryptedPkg));
  } catch (err) {
    console.error('Failed to write to encrypted ledger partition:', err);
  }
  return encryptedPkg;
}

/**
 * Reads and decrypts data from the Encrypted Local Ledger partition.
 */
export async function readFromEncryptedLedger<T = unknown>(passphrase = DEFAULT_KEY_PHRASE): Promise<T | null> {
  try {
    const raw = localStorage.getItem(ENCRYPTED_LEDGER_KEY);
    if (!raw) return null;
    const pkg: EncryptedPackage = JSON.parse(raw);
    return await decryptData<T>(pkg, passphrase);
  } catch (err) {
    console.error('Failed to read or decrypt ledger:', err);
    return null;
  }
}

/**
 * Returns security and cryptographic audit metrics of the current ledger.
 */
export function getLedgerSecurityAudit(): SecurityAuditReport {
  try {
    const raw = localStorage.getItem(ENCRYPTED_LEDGER_KEY);
    if (!raw) {
      return {
        isEncrypted: false,
        cipher: 'AES-GCM-256 (Pending Seal)',
        keyLength: 256,
        hashAlgorithm: 'SHA-256',
        lastChecksum: 'NONE',
        payloadBytes: 0,
        lastSealedAt: 'Never',
      };
    }

    const pkg: EncryptedPackage = JSON.parse(raw);
    return {
      isEncrypted: true,
      cipher: pkg.algorithm,
      keyLength: 256,
      hashAlgorithm: 'SHA-256',
      lastChecksum: pkg.sha256Checksum,
      payloadBytes: raw.length,
      lastSealedAt: pkg.timestamp,
    };
  } catch {
    return {
      isEncrypted: false,
      cipher: 'Unknown',
      keyLength: 0,
      hashAlgorithm: 'SHA-256',
      lastChecksum: 'ERROR',
      payloadBytes: 0,
      lastSealedAt: 'Error',
    };
  }
}

/**
 * Exports the encrypted ledger as a cryptographically sealed JSON file.
 */
export async function exportEncryptedLedgerFile(): Promise<void> {
  const raw = localStorage.getItem(ENCRYPTED_LEDGER_KEY);
  let pkg: EncryptedPackage;

  if (!raw) {
    // If no ledger exists yet, pack current workout history and profile into one
    const historyRaw = localStorage.getItem('homodevs_workout_history_v1') || '[]';
    const profileRaw = localStorage.getItem('homodeus_user_profile_v1') || '{}';
    const bundle = {
      history: JSON.parse(historyRaw),
      profile: JSON.parse(profileRaw),
      exportedAt: new Date().toISOString(),
    };
    pkg = await saveToEncryptedLedger(bundle);
  } else {
    pkg = JSON.parse(raw);
  }

  const blob = new Blob([JSON.stringify(pkg, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `HOMODEUS_ENCRYPTED_LEDGER_${new Date().toISOString().split('T')[0]}.enc.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
