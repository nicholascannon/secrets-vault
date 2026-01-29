import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { EncryptionError } from './encryption-errors.js';

const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const ALGORITHM = 'aes-256-gcm';

export function encrypt(plaintext: string, key: Buffer): string {
  try {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf-8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return Buffer.concat([iv, authTag, encrypted]).toString('base64');
  } catch (error: unknown) {
    throw new EncryptionError('Failed to encrypt content', { cause: error });
  }
}

export function decrypt(ciphertext: string, key: Buffer): string {
  try {
    const payload = Buffer.from(ciphertext, 'base64');
    if (payload.length < IV_LENGTH + AUTH_TAG_LENGTH) {
      throw new EncryptionError('Invalid ciphertext payload');
    }

    const iv = payload.subarray(0, IV_LENGTH);
    const authTag = payload.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const encrypted = payload.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf-8');
  } catch (error: unknown) {
    if (error instanceof EncryptionError) {
      throw error;
    }
    throw new EncryptionError('Failed to decrypt content', { cause: error });
  }
}
