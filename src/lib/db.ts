import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'agent_wallet.db');

export interface AuditLog {
  id: number;
  timestamp: string;
  event_type: string;
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
                event_type TEXT NOT NULL DEFAULT 'UNKNOWN',
                details TEXT NOT NULL DEFAULT '{}',
                tx_hash TEXT,
                status TEXT DEFAULT 'PENDING'
            )
        `);

    // Schema Migration Check
    const columns = this.db.pragma('table_info(audit_log)') as { name: string }[];
    const columnNames = columns.map((c) => c.name);

    if (!columnNames.includes('event_type')) {
      console.log('🔧 Migrating database: Adding "event_type" column...');
      this.db.exec("ALTER TABLE audit_log ADD COLUMN event_type TEXT NOT NULL DEFAULT 'UNKNOWN'");
    }

    if (!columnNames.includes('details')) {
      console.log('🔧 Migrating database: Adding "details" column...');
      this.db.exec("ALTER TABLE audit_log ADD COLUMN details TEXT NOT NULL DEFAULT '{}'");
    }

    if (!columnNames.includes('status')) {
      console.log('🔧 Migrating database: Adding "status" column...');
      this.db.exec("ALTER TABLE audit_log ADD COLUMN status TEXT DEFAULT 'PENDING'");
    }
  }

  log(
    event_type: string,
    details: object,
    status: 'PENDING' | 'SUCCESS' | 'FAILED' = 'PENDING',
  ): number {
    const stmt = this.db.prepare(
      'INSERT INTO audit_log (event_type, details, status) VALUES (?, ?, ?)',
    );
    const info = stmt.run(event_type, JSON.stringify(details), status);
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
