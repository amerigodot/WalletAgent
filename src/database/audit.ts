import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'agent_wallet.db');

export class AuditService {
  private db: Database.Database;

  constructor() {
    this.db = new Database(DB_PATH);
    this.initSchema();
  }

  private initSchema() {
    // Create audit_log table if it doesn't exist
    const schema = `
            CREATE TABLE IF NOT EXISTS audit_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                event_type TEXT NOT NULL,
                status TEXT NOT NULL,
                payload JSON,
                tx_hash TEXT,
                error TEXT
            );
        `;
    this.db.exec(schema);
  }

  log(
    eventType: string,
    status: 'PENDING' | 'SUBMITTED' | 'SUCCESS' | 'FAILED',
    payload: any,
    txHash?: string,
    error?: string,
  ) {
    const stmt = this.db.prepare(`
            INSERT INTO audit_log (event_type, status, payload, tx_hash, error)
            VALUES (?, ?, ?, ?, ?)
        `);

    stmt.run(eventType, status, JSON.stringify(payload), txHash || null, error || null);
  }

  getRecentLogs(limit: number = 10) {
    const stmt = this.db.prepare('SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT ?');
    return stmt.all(limit);
  }
}
