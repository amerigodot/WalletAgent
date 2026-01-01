import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const KEYSTORE_PATH = path.join(process.cwd(), 'keystore.json');

interface EncryptedData {
  iv: string;
  content: string;
  salt: string;
  authTag: string;
}

export class SecurityManager {
  // Save encrypted mnemonic
  saveMnemonic(mnemonic: string, password: string): void {
    const salt = crypto.randomBytes(16);
    // Key derivation: 100,000 iterations, 32-byte key (256-bit), sha256
    const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
    const iv = crypto.randomBytes(16); // Initialization vector

    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let encrypted = cipher.update(mnemonic, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    const data: EncryptedData = {
      iv: iv.toString('hex'),
      content: encrypted,
      salt: salt.toString('hex'),
      authTag: authTag,
    };

    fs.writeFileSync(KEYSTORE_PATH, JSON.stringify(data, null, 2));
  }

  // Load and decrypt mnemonic
  loadMnemonic(password: string): string | null {
    if (!fs.existsSync(KEYSTORE_PATH)) {
      return null;
    }

    try {
      const data: EncryptedData = JSON.parse(fs.readFileSync(KEYSTORE_PATH, 'utf-8'));

      const salt = Buffer.from(data.salt, 'hex');
      const iv = Buffer.from(data.iv, 'hex');
      const authTag = Buffer.from(data.authTag, 'hex');
      const encryptedText = data.content;

      const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');

      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch {
      // Decryption failed (likely wrong password)
      return null;
    }
  }

  hasKeystore(): boolean {
    return fs.existsSync(KEYSTORE_PATH);
  }
}

export const security = new SecurityManager();
