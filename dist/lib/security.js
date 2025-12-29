"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.security = exports.SecurityManager = void 0;
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const KEYSTORE_PATH = path_1.default.join(process.cwd(), 'keystore.json');
class SecurityManager {
    // Save encrypted mnemonic
    saveMnemonic(mnemonic, password) {
        const salt = crypto_1.default.randomBytes(16);
        // Key derivation: 100,000 iterations, 32-byte key (256-bit), sha256
        const key = crypto_1.default.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
        const iv = crypto_1.default.randomBytes(16); // Initialization vector
        const cipher = crypto_1.default.createCipheriv('aes-256-gcm', key, iv);
        let encrypted = cipher.update(mnemonic, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag().toString('hex');
        const data = {
            iv: iv.toString('hex'),
            content: encrypted,
            salt: salt.toString('hex'),
            authTag: authTag
        };
        fs_1.default.writeFileSync(KEYSTORE_PATH, JSON.stringify(data, null, 2));
    }
    // Load and decrypt mnemonic
    loadMnemonic(password) {
        if (!fs_1.default.existsSync(KEYSTORE_PATH)) {
            return null;
        }
        try {
            const data = JSON.parse(fs_1.default.readFileSync(KEYSTORE_PATH, 'utf-8'));
            const salt = Buffer.from(data.salt, 'hex');
            const iv = Buffer.from(data.iv, 'hex');
            const authTag = Buffer.from(data.authTag, 'hex');
            const encryptedText = data.content;
            const key = crypto_1.default.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
            const decipher = crypto_1.default.createDecipheriv('aes-256-gcm', key, iv);
            decipher.setAuthTag(authTag);
            let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        }
        catch (error) {
            // Decryption failed (likely wrong password)
            return null;
        }
    }
    hasKeystore() {
        return fs_1.default.existsSync(KEYSTORE_PATH);
    }
}
exports.SecurityManager = SecurityManager;
exports.security = new SecurityManager();
