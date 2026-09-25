import { describe, it, expect, beforeEach } from 'vitest';
import { verifyEmperorPasscode, isPasscodeUnlocked, revokeProAccess } from '../logic/auth';

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
});
