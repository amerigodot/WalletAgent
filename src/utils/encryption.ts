import * as sodium from 'libsodium-wrappers';
import * as argon2 from 'argon2';

/**
 * Service for military-grade encryption using Argon2id for KDF 
 * and XChaCha20-Poly1305 for symmetric encryption.
 */
export class EncryptionService {
    private static isReady = false;

    static async init() {
        if (!this.isReady) {
            await sodium.ready;
            this.isReady = true;
        }
    }

    /**
     * Derives a 32-byte key from a password using Argon2id.
     * This makes brute-force attacks significantly harder.
     */
    private static async deriveKey(password: string, salt: Uint8Array): Promise<Uint8Array> {
        // Use argon2 directly for robust KDF
        // We use the raw hash as the key
        const key = await argon2.hash(password, {
            type: argon2.argon2id,
            raw: true,
            salt: Buffer.from(salt), // argon2 expects Buffer or Buffer-like
            hashLength: 32, // 256-bit key
            timeCost: 3,
            memoryCost: 65536, // 64 MB
            parallelism: 4
        });
        return new Uint8Array(key);
    }

    /**
     * Encrypts plaintext using XSalsa20-Poly1305 (crypto_secretbox_easy).
     * Generates a random salt for KDF and a random nonce for encryption.
     * Returns a structured JSON string containing all necessary components.
     */
    static async encrypt(plaintext: string, password: string): Promise<string> {
        await this.init();

        // 1. Generate Salt for KDF
        const salt = sodium.randombytes_buf(16);

        // 2. Derive Key
        const key = await this.deriveKey(password, salt);

        // 3. Generate Nonce for XSalsa20
        const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);

        // 4. Encrypt
        const messageBytes = sodium.from_string(plaintext);
        const ciphertext = sodium.crypto_secretbox_easy(messageBytes, nonce, key);

        // 5. Serialize
        return JSON.stringify({
            ciphertext: sodium.to_hex(ciphertext),
            nonce: sodium.to_hex(nonce),
            salt: sodium.to_hex(salt)
        });
    }

    /**
     * Decrypts the structured JSON string using the provided password.
     */
    static async decrypt(encryptedData: string, password: string): Promise<string> {
        await this.init();

        const data = JSON.parse(encryptedData);
        const ciphertext = sodium.from_hex(data.ciphertext);
        const nonce = sodium.from_hex(data.nonce);
        const salt = sodium.from_hex(data.salt);

        // 1. Re-derive Key
        const key = await this.deriveKey(password, salt);

        // 2. Decrypt
        try {
            const decryptedBytes = sodium.crypto_secretbox_open_easy(ciphertext, nonce, key);
            return sodium.to_string(decryptedBytes);
        } catch (error) {
            throw new Error('Decryption failed. Incorrect password or corrupted data.');
        }
    }
}
