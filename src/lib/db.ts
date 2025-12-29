import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'agent_wallet.db');

export interface AuditLog {
    id: number;
    timestamp: string;
    action: string;
    details: string;
    tx_hash?: string;
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
}

class AuditDB {
    private db: Database.Database;

    constructor() {
        this.db = new Database(DB_PATH);
        this.init();
    }

    private init() {
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

    log(action: string, details: object, status: 'PENDING' | 'SUCCESS' | 'FAILED' = 'PENDING'): number {
        const stmt = this.db.prepare('INSERT INTO audit_log (action, details, status) VALUES (?, ?, ?)');
        const info = stmt.run(action, JSON.stringify(details), status);
        return info.lastInsertRowid as number;
    }

    updateStatus(id: number, status: 'SUCCESS' | 'FAILED', txHash?: string) {
        const stmt = this.db.prepare('UPDATE audit_log SET status = ?, tx_hash = ? WHERE id = ?');
        stmt.run(status, txHash || null, id);
    }

    getLogs(limit: number = 50): AuditLog[] {
        const stmt = this.db.prepare('SELECT * FROM audit_log ORDER BY id DESC LIMIT ?');
        return stmt.all(limit) as AuditLog[];
    }
}

export const db = new AuditDB();
