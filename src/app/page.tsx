"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { SimpanDataCard, type LogEntry } from "@/components/SimpanDataCard";
import { LogAktivitasCard } from "@/components/LogAktivitasCard";
import { BatchImportCard } from "@/components/BatchImportCard";

export default function Home() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const handleSave = (data: Omit<LogEntry, "id" | "timestamp">) => {
    const newLog: LogEntry = {
      ...data,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleClearAll = () => {
    setLogs([]);
  };

  const handleExport = () => {
    if (logs.length === 0) return;

    const textContent = logs
      .map(
        (log) =>
          `${log.pergerakan} Laboratorium ${log.kodeLab} oleh ${log.pengambil} ${log.namaDosen}`
      )
      .join("\n");

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup_simlab_logs_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (text: string) => {
    const lines = text.split("\n");
    const newLogs: LogEntry[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Basic parser for "Peminjaman Laboratorium 01/02/03 oleh Asprak John D."
      const match = trimmed.match(
        /^(Peminjaman|Pengembalian)\s+Laboratorium\s+(.*?)\s+oleh\s+(Asprak|Dosen|Laboran|Mahasiswa)\s+(.*)$/i
      );

      if (match) {
        newLogs.push({
          id: crypto.randomUUID(),
          pergerakan: match[1],
          kodeLab: match[2],
          pengambil: match[3],
          namaDosen: match[4],
          timestamp: new Date(),
        });
      }
    });

    if (newLogs.length > 0) {
      setLogs((prev) => [...newLogs, ...prev]);
    } else {
      alert("Tidak ada data yang valid ditemukan untuk diimport. Pastikan format sesuai.");
    }
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-8">
      <Header />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5">
          <SimpanDataCard onSave={handleSave} />
        </div>
        
        <div className="lg:col-span-7 flex flex-col h-full">
          <LogAktivitasCard
            logs={logs}
            onClearAll={handleClearAll}
            onExport={handleExport}
          />
          <BatchImportCard onImport={handleImport} />
        </div>
      </div>
    </main>
  );
}
