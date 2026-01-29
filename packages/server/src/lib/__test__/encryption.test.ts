import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { decrypt, encrypt } from '../encryption.js';
import { EncryptionError } from '../encryption-errors.js';

const validKey = randomBytes(32); // AES-256 requires 32-byte key

function expectEncryptionError(fn: () => unknown, expectedMessage: string): void {
  try {
    fn();
    expect.fail('Should have thrown EncryptionError');
  } catch (error) {
    expect(error).toBeInstanceOf(EncryptionError);
    expect((error as EncryptionError).message).toBe(expectedMessage);
  }
}

describe('encrypt', () => {
  describe('successful encryption', () => {
    it('encrypts a simple string', () => {
      const plaintext = 'hello world';
      const result = encrypt(plaintext, validKey);

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns base64 encoded output', () => {
      const result = encrypt('test', validKey);
      const base64Regex = /^[A-Za-z0-9+/]+=*$/;

      expect(base64Regex.test(result)).toBe(true);
    });

    it('produces different ciphertext for same plaintext (random IV)', () => {
      const plaintext = 'same message';
      const result1 = encrypt(plaintext, validKey);
      const result2 = encrypt(plaintext, validKey);

      expect(result1).not.toBe(result2);
    });

    it('encrypts empty string', () => {
      const result = encrypt('', validKey);

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('encrypts unicode characters', () => {
      const plaintext = '你好世界 🔐 émojis';
      const result = encrypt(plaintext, validKey);

      expect(typeof result).toBe('string');
    });

    it('encrypts string with newlines and special chars', () => {
      const plaintext = 'line1\nline2\ttab\r\nwindows';
      const result = encrypt(plaintext, validKey);

      expect(typeof result).toBe('string');
    });

    it('encrypts very long string', () => {
      const plaintext = 'a'.repeat(100000);
      const result = encrypt(plaintext, validKey);

      expect(typeof result).toBe('string');
    });

    it('encrypts JSON content', () => {
      const plaintext = JSON.stringify({ secret: 'value', nested: { data: [1, 2, 3] } });
      const result = encrypt(plaintext, validKey);

      expect(typeof result).toBe('string');
    });
  });

  describe('error handling', () => {
    it('throws EncryptionError with invalid key size (too short)', () => {
      const shortKey = randomBytes(16);
      expectEncryptionError(() => encrypt('test', shortKey), 'Failed to encrypt content');
    });

    it('throws EncryptionError with invalid key size (too long)', () => {
      const longKey = randomBytes(64);
      expectEncryptionError(() => encrypt('test', longKey), 'Failed to encrypt content');
    });

    it('throws EncryptionError with empty key', () => {
      const emptyKey = Buffer.alloc(0);
      expectEncryptionError(() => encrypt('test', emptyKey), 'Failed to encrypt content');
    });

    it('preserves original error as cause', () => {
      const shortKey = randomBytes(16);

      try {
        encrypt('test', shortKey);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(EncryptionError);
        expect((error as EncryptionError).cause).toBeDefined();
      }
    });
  });
});

describe('decrypt', () => {
  describe('successful decryption', () => {
    it('decrypts to original plaintext', () => {
      const plaintext = 'hello world';
      const ciphertext = encrypt(plaintext, validKey);
      const result = decrypt(ciphertext, validKey);

      expect(result).toBe(plaintext);
    });

    it('decrypts empty string', () => {
      const plaintext = '';
      const ciphertext = encrypt(plaintext, validKey);
      const result = decrypt(ciphertext, validKey);

      expect(result).toBe(plaintext);
    });

    it('decrypts unicode characters', () => {
      const plaintext = '你好世界 🔐 émojis';
      const ciphertext = encrypt(plaintext, validKey);
      const result = decrypt(ciphertext, validKey);

      expect(result).toBe(plaintext);
    });

    it('decrypts string with newlines and special chars', () => {
      const plaintext = 'line1\nline2\ttab\r\nwindows';
      const ciphertext = encrypt(plaintext, validKey);
      const result = decrypt(ciphertext, validKey);

      expect(result).toBe(plaintext);
    });

    it('decrypts very long string', () => {
      const plaintext = 'a'.repeat(100000);
      const ciphertext = encrypt(plaintext, validKey);
      const result = decrypt(ciphertext, validKey);

      expect(result).toBe(plaintext);
    });

    it('decrypts JSON content preserving structure', () => {
      const original = { secret: 'value', nested: { data: [1, 2, 3] } };
      const plaintext = JSON.stringify(original);
      const ciphertext = encrypt(plaintext, validKey);
      const result = decrypt(ciphertext, validKey);

      expect(JSON.parse(result)).toEqual(original);
    });
  });

  describe('invalid ciphertext format', () => {
    it('throws EncryptionError for empty string', () => {
      expectEncryptionError(() => decrypt('', validKey), 'Invalid ciphertext payload');
    });

    it('throws EncryptionError for too short payload (just IV)', () => {
      const shortPayload = randomBytes(12).toString('base64');
      expectEncryptionError(() => decrypt(shortPayload, validKey), 'Invalid ciphertext payload');
    });

    it('throws EncryptionError for too short payload (IV + partial auth tag)', () => {
      const shortPayload = randomBytes(20).toString('base64');
      expectEncryptionError(() => decrypt(shortPayload, validKey), 'Invalid ciphertext payload');
    });

    it('throws EncryptionError for payload one byte less than minimum (IV + auth tag)', () => {
      const tooShortPayload = randomBytes(27).toString('base64'); // 12 + 16 - 1 = 27
      expectEncryptionError(() => decrypt(tooShortPayload, validKey), 'Invalid ciphertext payload');
    });

    it('throws EncryptionError for non-base64 string', () => {
      expectEncryptionError(() => decrypt('not valid base64!!!', validKey), 'Invalid ciphertext payload');
    });

    it('throws EncryptionError for random garbage base64', () => {
      const garbage = randomBytes(100).toString('base64');
      expectEncryptionError(() => decrypt(garbage, validKey), 'Failed to decrypt content');
    });
  });

  describe('tampering detection', () => {
    it('throws EncryptionError when ciphertext is modified', () => {
      const ciphertext = encrypt('secret data', validKey);
      const payload = Buffer.from(ciphertext, 'base64');
      payload[30] = payload[30] ^ 0xff; // Modify encrypted portion (after IV + auth tag)
      const tamperedCiphertext = payload.toString('base64');

      expectEncryptionError(() => decrypt(tamperedCiphertext, validKey), 'Failed to decrypt content');
    });

    it('throws EncryptionError when auth tag is modified', () => {
      const ciphertext = encrypt('secret data', validKey);
      const payload = Buffer.from(ciphertext, 'base64');
      payload[15] = payload[15] ^ 0xff; // Modify auth tag portion (bytes 12-27)
      const tamperedCiphertext = payload.toString('base64');

      expectEncryptionError(() => decrypt(tamperedCiphertext, validKey), 'Failed to decrypt content');
    });

    it('throws EncryptionError when IV is modified', () => {
      const ciphertext = encrypt('secret data', validKey);
      const payload = Buffer.from(ciphertext, 'base64');
      payload[0] = payload[0] ^ 0xff; // Modify IV portion (first 12 bytes)
      const tamperedCiphertext = payload.toString('base64');

      expectEncryptionError(() => decrypt(tamperedCiphertext, validKey), 'Failed to decrypt content');
    });
  });

  describe('wrong key', () => {
    it('throws EncryptionError when using different key', () => {
      const anotherKey = randomBytes(32);
      const ciphertext = encrypt('secret', validKey);

      expectEncryptionError(() => decrypt(ciphertext, anotherKey), 'Failed to decrypt content');
    });

    it('throws EncryptionError with invalid key size', () => {
      const ciphertext = encrypt('test', validKey);
      const shortKey = randomBytes(16);

      expectEncryptionError(() => decrypt(ciphertext, shortKey), 'Failed to decrypt content');
    });

    it('throws EncryptionError with empty key', () => {
      const ciphertext = encrypt('test', validKey);
      const emptyKey = Buffer.alloc(0);

      expectEncryptionError(() => decrypt(ciphertext, emptyKey), 'Failed to decrypt content');
    });
  });

  describe('error cause preservation', () => {
    it('preserves original error as cause for crypto failures', () => {
      const garbage = randomBytes(100).toString('base64');

      try {
        decrypt(garbage, validKey);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(EncryptionError);
        expect((error as EncryptionError).cause).toBeDefined();
      }
    });

    it('does not wrap EncryptionError in another EncryptionError', () => {
      const shortPayload = randomBytes(10).toString('base64');

      try {
        decrypt(shortPayload, validKey);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(EncryptionError);
        expect((error as EncryptionError).message).toBe('Invalid ciphertext payload');
        // Should not have a cause since it's directly thrown
        expect((error as EncryptionError).cause).toBeUndefined();
      }
    });
  });
});

describe('encrypt/decrypt roundtrip', () => {
  it('handles multiple sequential operations with same key', () => {
    const messages = ['first', 'second', 'third'];
    const ciphertexts = messages.map((m) => encrypt(m, validKey));
    const decrypted = ciphertexts.map((c) => decrypt(c, validKey));

    expect(decrypted).toEqual(messages);
  });

  it('each message encrypted independently', () => {
    const key1 = randomBytes(32);
    const key2 = randomBytes(32);

    const cipher1 = encrypt('message1', key1);
    const cipher2 = encrypt('message2', key2);

    expect(decrypt(cipher1, key1)).toBe('message1');
    expect(decrypt(cipher2, key2)).toBe('message2');

    // Cross-decryption should fail
    expectEncryptionError(() => decrypt(cipher1, key2), 'Failed to decrypt content');
    expectEncryptionError(() => decrypt(cipher2, key1), 'Failed to decrypt content');
  });

  it('handles binary-like content in string form', () => {
    const plaintext = '\x00\x01\x02\xff\xfe\xfd';
    const ciphertext = encrypt(plaintext, validKey);
    const result = decrypt(ciphertext, validKey);

    expect(result).toBe(plaintext);
  });

  it('handles string with null bytes', () => {
    const plaintext = 'before\x00after';
    const ciphertext = encrypt(plaintext, validKey);
    const result = decrypt(ciphertext, validKey);

    expect(result).toBe(plaintext);
  });
});
