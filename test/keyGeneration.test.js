// tests/keyGeneration.test.js

const { keyGeneration } = require('../src/cipher');
const { mulberry32, xmur3 } = require('../src/utils');

describe('keyGeneration Tests', () => {
    let state;

    beforeEach(() => {
        state = { rand: null, max: null };
    });

    test('should generate subkeys for the given key and message length', () => {
        const key = 'Lynkto@1200';
        const Mlength = 16;

        const { subkey1, subkey2 } = keyGeneration(Mlength, key, state);

        expect(subkey1).toBeDefined();
        expect(subkey2).toBeDefined(); 
        expect(subkey1.length).toBeGreaterThan(0);
        expect(subkey2.length).toBeGreaterThan(0);
    });

    test('should generate consistent subkeys for the same key and message length', () => {
        const key = 'saju.cse@hstu';
        const Mlength = 16;

        const { subkey1: subkey1a, subkey2: subkey2a } = keyGeneration(Mlength, key, state);
        const { subkey1: subkey1b, subkey2: subkey2b } = keyGeneration(Mlength, key, state);

        expect(subkey1a).toBe(subkey1b);
        expect(subkey2a).toBe(subkey2b);
    });

    test('should handle key length smaller than message length', () => {
        const key = 'cse16';
        const Mlength = 16;

        const { subkey1, subkey2 } = keyGeneration(Mlength, key, state);

        expect(subkey1).toBeDefined();
        expect(subkey2).toBeDefined();
        expect(subkey1.length).toBeGreaterThan(0);
        expect(subkey2.length).toBeGreaterThan(0);
    });

    test('should handle key length larger than message length', () => {
        const key = 'saju.cse.hstu@lynkto.net';
        const Mlength = 10;

        const { subkey1, subkey2 } = keyGeneration(Mlength, key, state);

        expect(subkey1).toBeDefined();
        expect(subkey2).toBeDefined();
        expect(subkey1.length).toBeGreaterThan(0);
        expect(subkey2.length).toBeGreaterThan(0);
    });

    test('should handle empty key gracefully', () => {
        const key = '';
        const Mlength = 16;
    
        // Expecting an error to be thrown when key is empty
        expect(() => keyGeneration(Mlength, key, state)).toThrow('Key cannot be empty');
    });

    test('should apply length enhancement correctly (subkey2 length should be multiple of 8)', () => {
        const key = 'saju@1932';
        const Mlength = 20;

        const { subkey2 } = keyGeneration(Mlength, key, state);

        expect(subkey2.length % 8).toBe(0);
    });

    test('should handle random-indexing and produce different subkey1 for different inputs', () => {
        const key1 = 'BSK-Online';
        const key2 = 'cipher-bsk';
        const Mlength = 16;

        const { subkey1: subkey1a } = keyGeneration(Mlength, key1, state);
        const { subkey1: subkey1b } = keyGeneration(Mlength, key2, state);

        expect(subkey1a).not.toBe(subkey1b);  // Ensure subkey1 is different for different keys
    });

    test('should handle random-indexing correctly with varying message length', () => {
        const key = 'Hstu@5200';
        const Mlength1 = 16;
        const Mlength2 = 20;

        const { subkey1: subkey1a } = keyGeneration(Mlength1, key, state);
        const { subkey1: subkey1b } = keyGeneration(Mlength2, key, state);

        expect(subkey1a).not.toBe(subkey1b);  // Ensure subkey1 is different for different message lengths
    });
});
