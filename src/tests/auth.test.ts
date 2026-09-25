import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  verifyEmperorPasscode, 
  isPasscodeUnlocked, 
  revokeProAccess,
  checkRemoteEntitlement,
  verifyEmperorPasscodeOnline 
} from '../logic/auth';
import { UserAccount } from '../types';

// In-memory localStorage mock for Node test environment
const memoryStore = new Map<string, string>();
const localStorageMock = {
  getItem: (key: string) => memoryStore.get(key) ?? null,
  setItem: (key: string, value: string) => { memoryStore.set(key, String(value)); },
  removeItem: (key: string) => { memoryStore.delete(key); },
  clear: () => { memoryStore.clear(); },
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('Auth & Emperor Passcode Logic', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('rejects all retired legacy codes', () => {
    const retiredCodes = [
      'IMPERATOR2026',
      'OLYMPIAN',
      'HOMODEUS',
      'HOMODEVS',
      'EMPEROR',
      'IMPERATOR',
      'GABRIELE',
      'GELLA94',
      'VIP',
      'PRO',
      'ADMIN',
    ];

    for (const code of retiredCodes) {
      expect(verifyEmperorPasscode(code)).toBe(false);
      expect(isPasscodeUnlocked()).toBe(false);
    }
  });

  it('accepts the new official code C0D3T0UNL0CK (case-insensitive & trimmed)', () => {
    expect(isPasscodeUnlocked()).toBe(false);
    expect(verifyEmperorPasscode('  C0D3T0UNL0CK  ')).toBe(true);
    expect(isPasscodeUnlocked()).toBe(true);

    // Also works with lowercase
    localStorage.clear();
    expect(verifyEmperorPasscode('c0d3t0unl0ck')).toBe(true);
    expect(isPasscodeUnlocked()).toBe(true);
  });

  it('revokes pro access cleanly via revokeProAccess', () => {
    verifyEmperorPasscode('C0D3T0UNL0CK');
    expect(isPasscodeUnlocked()).toBe(true);

    const testUserId = 'test_athlete_123';
    localStorage.setItem(`homodevs_user_state_${testUserId}`, JSON.stringify({ isProSubscriber: true }));

    revokeProAccess(testUserId);
    expect(isPasscodeUnlocked()).toBe(false);

    const userState = JSON.parse(localStorage.getItem(`homodevs_user_state_${testUserId}`) || '{}');
    expect(userState.isProSubscriber).toBe(false);
  });

  it('remotely revokes Pro if /api/verify-license returns revoked', async () => {
    const user: UserAccount = {
      id: 'athlete_revoked_test',
      name: 'Blacklisted User',
      email: 'bad@actor.com',
      createdAt: new Date().toISOString(),
      isGuest: false,
    };

    localStorage.setItem('homodevs_vip_passcode_unlocked', 'true');
    localStorage.setItem(`homodevs_user_state_${user.id}`, JSON.stringify({ isProSubscriber: true }));

    // Mock fetch to simulate remote revocation signal from Vercel edge
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'ok', valid: false, revoked: true, reason: 'Revoked by admin' }),
    }));

    const result = await checkRemoteEntitlement(user);
    expect(result.revoked).toBe(true);
    expect(result.valid).toBe(false);

    // Check that local Pro access was wiped
    expect(isPasscodeUnlocked()).toBe(false);
    const userState = JSON.parse(localStorage.getItem(`homodevs_user_state_${user.id}`) || '{}');
    expect(userState.isProSubscriber).toBe(false);
  });

  it('verifies passcode via online authority with offline fallback', async () => {
    const user: UserAccount = {
      id: 'athlete_valid_test',
      name: 'Marcus',
      createdAt: new Date().toISOString(),
      isGuest: false,
    };

    // Server says yes
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'ok', success: true, message: 'Verified by server' }),
    }));

    const res = await verifyEmperorPasscodeOnline('C0D3T0UNL0CK', user);
    expect(res.success).toBe(true);
    expect(isPasscodeUnlocked()).toBe(true);
  });
});
