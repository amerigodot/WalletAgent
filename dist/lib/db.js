"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const DB_PATH = path_1.default.join(process.cwd(), 'agent_wallet.db');
class AuditDB {
    db;
    constructor() {
        this.db = new better_sqlite3_1.default(DB_PATH);
        this.init();
    }
    init() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS audit_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                action TEXT NOT NULL,
                details TEXT NOT NULL,
                tx_hash TEXT,
                status TEXT DEFAULT 'PENDING'
            )
        `);
    }
    log(action, details, status = 'PENDING') {
        const stmt = this.db.prepare('INSERT INTO audit_log (action, details, status) VALUES (?, ?, ?)');
        const info = stmt.run(action, JSON.stringify(details), status);
        return info.lastInsertRowid;
    }
    updateStatus(id, status, txHash) {
        const stmt = this.db.prepare('UPDATE audit_log SET status = ?, tx_hash = ? WHERE id = ?');
        stmt.run(status, txHash || null, id);
    }
    getLogs(limit = 50) {
        const stmt = this.db.prepare('SELECT * FROM audit_log ORDER BY id DESC LIMIT ?');
        return stmt.all(limit);
    }
}
exports.db = new AuditDB();
