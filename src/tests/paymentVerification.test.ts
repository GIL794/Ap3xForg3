import { describe, it, expect, beforeEach } from 'vitest';
import { 
  verifyPaymentTransaction, 
  isTransactionAlreadyRedeemed, 
  getVerifiedReceipts,
  clearMemoryLedger
} from '../logic/paymentVerification';

describe('Payment Verification Engine (ISO/IEC 25010 & 27001)', () => {
  beforeEach(() => {
    clearMemoryLedger();
  });

  it('rejects invalid or too short transaction reference', async () => {
    const res = await verifyPaymentTransaction({
      transactionId: 'short',
      payerEmail: 'athlete@roma.it',
      athleteName: 'Marcus Aurelius',
      tier: 'emperor_lifetime',
    });

    expect(res.success).toBe(false);
    expect(res.errorCode).toBe('INVALID_FORMAT');
  });

  it('rejects obvious mock/test transaction references', async () => {
    const res = await verifyPaymentTransaction({
      transactionId: 'TEST1234',
      payerEmail: 'athlete@roma.it',
      athleteName: 'Marcus Aurelius',
      tier: 'emperor_lifetime',
    });

    expect(res.success).toBe(false);
    expect(res.errorCode).toBe('INVALID_FORMAT');
  });

  it('rejects invalid email format', async () => {
    const res = await verifyPaymentTransaction({
      transactionId: 'ATM-8839-2049',
      payerEmail: 'invalid-email-no-domain',
      athleteName: 'Marcus Aurelius',
      tier: 'emperor_lifetime',
    });

    expect(res.success).toBe(false);
    expect(res.errorCode).toBe('INVALID_EMAIL');
  });

  it('verifies a valid transaction, computes SHA-256 seal and stores receipt', async () => {
    const res = await verifyPaymentTransaction({
      transactionId: 'ATM-9482-7102-ROMA',
      payerEmail: 'gladiator@colosseum.it',
      athleteName: 'Maximus Decimus',
      tier: 'emperor_lifetime',
    });

    expect(res.success).toBe(true);
    expect(res.receipt).toBeDefined();
    expect(res.receipt?.receiptId).toMatch(/^IMP-REC-/);
    expect(res.receipt?.cryptographicSignature).toBeDefined();
    expect(res.receipt?.amount).toBe(99.99);

    // Ledger check
    const receipts = getVerifiedReceipts();
    expect(receipts.length).toBe(1);
    expect(receipts[0].transactionId).toBe('ATM-9482-7102-ROMA');
  });

  it('detects and rejects duplicate transaction attempts (Anti-Replay Security)', async () => {
    const txId = 'ATM-5511-9922-SECURE';

    // First attempt succeeds
    const firstAttempt = await verifyPaymentTransaction({
      transactionId: txId,
      payerEmail: 'first@roma.it',
      athleteName: 'Caesar',
      tier: 'centurion',
    });
    expect(firstAttempt.success).toBe(true);
    expect(isTransactionAlreadyRedeemed(txId)).toBe(true);

    // Second attempt with same txId must fail
    const secondAttempt = await verifyPaymentTransaction({
      transactionId: txId,
      payerEmail: 'fraudster@fake.com',
      athleteName: 'Impostor',
      tier: 'emperor_lifetime',
    });

    expect(secondAttempt.success).toBe(false);
    expect(secondAttempt.errorCode).toBe('DUPLICATE_TRANSACTION');
  });
});
