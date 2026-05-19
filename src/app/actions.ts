"use server";

import db, { LogEntry } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Type returned to the client (we can convert timestamp string back to Date if we want, or keep it string)
export type ClientLogEntry = Omit<LogEntry, "timestamp"> & {
  timestamp: Date;
};

export async function fetchLogs(): Promise<ClientLogEntry[]> {
  const stmt = db.prepare("SELECT * FROM logs ORDER BY timestamp DESC");
  const rows = stmt.all() as LogEntry[];
  
  return rows.map(row => ({
    ...row,
    timestamp: new Date(row.timestamp)
  }));
}

export async function saveLog(data: Omit<ClientLogEntry, "id" | "timestamp">) {
  const id = crypto.randomUUID();
  const timestamp = new Date().toISOString();
  
  const stmt = db.prepare(`
    INSERT INTO logs (id, pergerakan, kodeLab, pengambil, namaDosen, timestamp)
    VALUES (@id, @pergerakan, @kodeLab, @pengambil, @namaDosen, @timestamp)
  `);
  
  stmt.run({
    id,
    pergerakan: data.pergerakan,
    kodeLab: data.kodeLab,
    pengambil: data.pengambil,
    namaDosen: data.namaDosen,
    timestamp
  });
  
  revalidatePath("/");
  
  return {
    id,
    ...data,
    timestamp: new Date(timestamp)
  };
}

export async function clearAllLogs() {
  const stmt = db.prepare("DELETE FROM logs");
  stmt.run();
  revalidatePath("/");
}

export async function importLogs(logs: Omit<ClientLogEntry, "id" | "timestamp">[]) {
  const insert = db.prepare(`
    INSERT INTO logs (id, pergerakan, kodeLab, pengambil, namaDosen, timestamp)
    VALUES (@id, @pergerakan, @kodeLab, @pengambil, @namaDosen, @timestamp)
  `);
  
  const insertMany = db.transaction((entries: any[]) => {
    for (const entry of entries) {
      insert.run(entry);
    }
  });
  
  const formattedLogs = logs.map(log => ({
    id: crypto.randomUUID(),
    pergerakan: log.pergerakan,
    kodeLab: log.kodeLab,
    pengambil: log.pengambil,
    namaDosen: log.namaDosen,
    timestamp: new Date().toISOString()
  }));
  
  insertMany(formattedLogs);
  revalidatePath("/");
}
