import Database from 'better-sqlite3';
import path from 'path';

// Define the shape of our LogEntry
export interface LogEntry {
  id: string;
  pergerakan: string;
  kodeLab: string;
  pengambil: string;
  namaDosen: string;
  timestamp: string; // Stored as ISO string in SQLite
}

// Ensure the DB is saved in the root directory
const dbPath = path.join(process.cwd(), 'database.db');

// Initialize the database
const db = new Database(dbPath);

// Create the table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS logs (
    id TEXT PRIMARY KEY,
    pergerakan TEXT NOT NULL,
    kodeLab TEXT NOT NULL,
    pengambil TEXT NOT NULL,
    namaDosen TEXT NOT NULL,
    timestamp TEXT NOT NULL
  )
`);

export default db;
