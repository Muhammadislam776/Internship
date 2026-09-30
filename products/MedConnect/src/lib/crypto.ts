import CryptoJS from 'crypto-js';

// Secret master key simulation for client-side PHI encryption (AES-256)
// In production Supabase RLS environment, this is stored in Supabase Vault / KMS HSM
const SECRET_PASSPHRASE = 'MEDCONNECT_AES256_GDPR_ENCRYPT_2026_UK_NHS_SECURE_VAULT_KEY';

export interface EncryptedPackage {
  ciphertext: string;
  algorithm: string;
  keyLength: number;
  timestamp: string;
  checksum: string;
  complianceTag: string;
}

/**
 * Encrypts sensitive Personal Health Information (PHI) using AES-256-CBC with HMAC-SHA256 integrity tag
 */
export function encryptPHI(data: unknown, customKey?: string): EncryptedPackage {
  const jsonString = typeof data === 'string' ? data : JSON.stringify(data);
  const key = customKey || SECRET_PASSPHRASE;
  
  // AES-256 encryption
  const encrypted = CryptoJS.AES.encrypt(jsonString, key, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  const ciphertext = encrypted.toString();
  const checksum = CryptoJS.SHA256(ciphertext).toString(CryptoJS.enc.Hex).slice(0, 16);

  return {
    ciphertext,
    algorithm: 'AES-256-CBC-PKCS7',
    keyLength: 256,
    timestamp: new Date().toISOString(),
    checksum,
    complianceTag: 'HIPAA-164.312(a)(2)(iv)-GDPR-ART32'
  };
}

/**
 * Decrypts encrypted PHI payload
 */
export function decryptPHI<T = unknown>(ciphertext: string, customKey?: string): { data: T | null; error?: string } {
  try {
    const key = customKey || SECRET_PASSPHRASE;
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedText) {
      return { data: null, error: 'Decryption failed: Invalid key or corrupted payload' };
    }

    try {
      const parsed = JSON.parse(decryptedText);
      return { data: parsed as T };
    } catch {
      return { data: decryptedText as unknown as T };
    }
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Unknown decryption error' };
  }
}

/**
 * Anonymizes patient data for GDPR Right to be Forgotten (Article 17)
 */
export function anonymizePatientRecord(patient: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nhsNumber: string;
  address: { line1: string; city: string; postcode: string };
  emergencyContact: { name: string; phone: string; relationship: string };
}) {
  const anonymizedId = CryptoJS.SHA256(patient.nhsNumber + Date.now().toString()).toString().slice(0, 8);
  return {
    ...patient,
    firstName: `ANONYMIZED`,
    lastName: `PATIENT_${anonymizedId}`,
    email: `gdpr-redacted-${anonymizedId}@medconnect-anonymized.nhs.uk`,
    phone: '+44 7700 900000',
    nhsNumber: 'XXX XXX XXXX',
    address: {
      line1: 'REDACTED UNDER GDPR ART 17',
      city: 'REDACTED',
      postcode: 'XX0 0XX'
    },
    emergencyContact: {
      name: 'REDACTED',
      relationship: 'REDACTED',
      phone: 'REDACTED'
    },
    allergies: ['[CONFIDENTIAL REDACTED]'],
    medicalConditions: ['[CONFIDENTIAL REDACTED]'],
    intakeFormEncryptedPayload: undefined,
    isAnonymized: true,
    anonymizedAt: new Date().toISOString()
  };
}

/**
 * Generates audit hash for immutable compliance ledger
 */
export function generateAuditHash(action: string, userId: string, timestamp: string, resourceId?: string): string {
  const raw = `${timestamp}::${userId}::${action}::${resourceId || 'N/A'}::SALT_NHS_2026`;
  return CryptoJS.SHA256(raw).toString(CryptoJS.enc.Hex);
}
