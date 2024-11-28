// test/cipher.test.js

const { encrypt, decrypt } = require('../src');

describe('Cipher Tests', () => {
    test('should return an empty string when no message or key is passed to encrypt', () => {
        expect(encrypt()).toBe('');
        expect(encrypt('message')).toBe('');
        expect(encrypt('message', '')).toBe('');
    });

    test('should return an empty string when no ciphertext or key is passed to decrypt', () => {
        expect(decrypt()).toBe('');
        expect(decrypt('ciphertext')).toBe('');
        expect(decrypt('ciphertext', '')).toBe('');
    });

    test('should encrypt and decrypt a message correctly', () => {
        const message = "Hello, World!";
        const key = "Hstu@5200";

        const encryptedMessage = encrypt(message, key);
        expect(encryptedMessage).not.toBe(message);

        const decryptedMessage = decrypt(encryptedMessage, key);
        expect(decryptedMessage).toBe(message);
    });

    test('should handle padding characters correctly in encryption', () => {
        const message = "Hajee Mohammad Danesh Science and Technology University";
        const key = "sazzadhossainsaju@5200";

        const encryptedMessage = encrypt(message, key);
        expect(encryptedMessage).not.toBe(message);

        const decryptedMessage = decrypt(encryptedMessage, key);
        expect(decryptedMessage).toBe(message);
    });
});
