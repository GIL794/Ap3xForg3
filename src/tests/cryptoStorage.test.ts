import { describe, it, expect } from 'vitest';
import { encryptData, decryptData, computeSha256 } from '../logic/cryptoStorage';

describe('ISO/IEC 27001 Cryptographic Ledger Engine', () => {
  const testPayload = {
    athlete: 'Gabriele',
    sessionDate: '2026-09-24',
    totalTonnageKg: 5400,
    exercises: [
      { name: 'Barbell Bench Press', weightKg: 100, reps: 8, sets: 4 },
      { name: 'Overhead Press', weightKg: 60, reps: 10, sets: 3 },
    ],
  };

  it('computes a consistent 64-character SHA-256 hex digest', async () => {
    const hash = await computeSha256('HOMO_DEVS_AUTHENTICATION');
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('encrypts arbitrary payload into AES-GCM-256 package with salt, IV, and SHA-256 seal', async () => {
    const pkg = await encryptData(testPayload);

    expect(pkg.algorithm).toBe('AES-GCM-256');
    expect(pkg.ciphertext).toBeDefined();
    expect(pkg.iv).toBeDefined();
    expect(pkg.salt).toBeDefined();
    expect(pkg.sha256Checksum).toHaveLength(64);
    expect(pkg.version).toBe('1.0.0');
  });

  it('decrypts package and faithfully reconstructs the original dataset', async () => {
    const pkg = await encryptData(testPayload);
    const decrypted = await decryptData<typeof testPayload>(pkg);

    expect(decrypted.athlete).toBe(testPayload.athlete);
    expect(decrypted.totalTonnageKg).toBe(5400);
    expect(decrypted.exercises).toHaveLength(2);
    expect(decrypted.exercises[0].weightKg).toBe(100);
  });

  it('throws an ISO 8000 integrity violation when ciphertext or checksum is tampered with', async () => {
    const pkg = await encryptData(testPayload);
    
    // Tamper with checksum
    const tamperedPkg = {
      ...pkg,
      sha256Checksum: '0000000000000000000000000000000000000000000000000000000000000000',
    };

    await expect(decryptData(tamperedPkg)).rejects.toThrow(/Integrity Violation/);
  });
});
