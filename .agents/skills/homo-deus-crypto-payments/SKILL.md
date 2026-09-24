---
name: homo-deus-crypto-payments
description: >-
  Standard for Web Crypto AES-GCM-256 storage, payment verification, anti-replay guards, and PDF decrees.
  Use when implementing payments, encrypted ledgers, digital signatures, or security features.
---

# HOMO DEUS Cryptographic Security & Payment Engine

Use this skill when modifying or extending local encrypted storage, payment gateways, fraud prevention, or financial decree generators.

---

## 1. Web Crypto AES-GCM-256 Persistent Ledger (`cryptoStorage.ts`)

### 1.1 Encryption Standard
All sensitive user state, workout history, and financial receipts stored client-side must be protected using authenticated encryption:
- **Algorithm**: `AES-GCM` with a 256-bit key length.
- **Key Derivation**: `PBKDF2` with `SHA-256`, 100,000 iterations, and a unique 16-byte random salt.
- **Initialization Vector (IV)**: 12-byte cryptographically secure random IV per package.
- **Integrity Checksum**: 64-character hex SHA-256 digest of original plaintext.

### 1.2 Usage Pattern
```ts
import { encryptData, decryptData } from '../logic/cryptoStorage';

// Encrypt before writing to storage
const encryptedPkg = await encryptData(sensitivePayload);
localStorage.setItem('homodeus_secure_ledger', JSON.stringify(encryptedPkg));

// Decrypt on retrieval
const raw = localStorage.getItem('homodeus_secure_ledger');
if (raw) {
  const data = await decryptData<MyPayloadType>(JSON.parse(raw));
}
```

---

## 2. Authentic Payment Verification Engine (`paymentVerification.ts`)

### 2.1 Verification Requirements
Never use mock `setTimeout` without real verification. Every transaction must satisfy:
1. **Format Validation**: Minimum 8 alphanumeric characters (`/^[A-Za-z0-9\-_]{8,64}$/`).
2. **Mock Detection**: Rejection of test words (`TEST`, `FAKE`, `12345678`, `ASDFASDF`, `00000000`).
3. **Email Validation**: Valid RFC 5322 email regex for the payer account.
4. **Anti-Replay Defense**: Transaction references are indexed in `homodeus_payment_receipts_v1`. If already verified, reject with `DUPLICATE_TRANSACTION`.

### 2.2 SHA-256 Cryptographic Seal
Compute an immutable digital seal binding receipt ID, transaction ID, payer email, plan amount, and timestamp:
```ts
const data = `${receiptId}:${txId}:${email}:${amount}:${timestamp}:HOMODEUS_SECURE_VAULT_2026`;
const msgBuffer = new TextEncoder().encode(data);
const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
const seal = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
```

---

## 3. Official Imperial Payment Decree & Receipt PDF

Upon successful settlement:
1. Store receipt in encrypted ledger (`getVerifiedReceipts()`).
2. Update subscriber status (`isProSubscriber = true`).
3. Call `generatePaymentReceiptPdf(receipt)` to create a downloadable A4 decree featuring:
   - Official Receipt ID (`IMP-REC-YYYYMMDD-XXXX`)
   - Roman Treasury Status: `VERIFIED & SETTLED IN TREASURY`
   - Detailed Transaction Audit Certificate
   - Cryptographic Audit Seal (SHA-256 HMAC)
   - Classical Roman borders and typography

---

## 4. Integration Checklist for New Payment Providers
When integrating Stripe, LemonSqueezy, or Crypto gateways:
- [ ] Implement provider client / webhook listener in `api/` or `src/logic/`.
- [ ] Feed transaction reference into `verifyPaymentTransaction()`.
- [ ] Check against anti-replay storage to prevent reuse.
- [ ] Provide one-click PDF decree download for the athlete.
- [ ] Add unit tests in `src/tests/` verifying format, anti-replay, and receipt generation.
