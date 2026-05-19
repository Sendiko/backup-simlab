"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { SimpanDataCard, type LogEntry } from "@/components/SimpanDataCard";
import { LogAktivitasCard } from "@/components/LogAktivitasCard";
import { BatchImportCard } from "@/components/BatchImportCard";
import { ClientLogEntry, saveLog, clearAllLogs, importLogs } from "@/app/actions";

interface DashboardProps {
  initialLogs: ClientLogEntry[];
}

export function Dashboard({ initialLogs }: DashboardProps) {
  // We maintain local state for immediate UI feedback (Optimistic updates)
  const [logs, setLogs] = useState<ClientLogEntry[]>(initialLogs);

  // Sync state if initialLogs change from server revalidation
  useEffect(() => {
    setLogs(initialLogs);
  }, [initialLogs]);

  const handleSave = async (data: Omit<LogEntry, "id" | "timestamp">) => {
    // 1. Optimistic Update
    const optimisticLog: ClientLogEntry = {
      ...data,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    setLogs((prev) => [optimisticLog, ...prev]);

    // 2. Server Action
    try {
      await saveLog(data);
    } catch (error) {
      console.error("Failed to save log:", error);
      // Revert if failed
      setLogs(initialLogs);
    }
  };

  const handleClearAll = async () => {
    // 1. Optimistic Update
    setLogs([]);

    // 2. Server Action
    try {
      await clearAllLogs();
    } catch (error) {
      console.error("Failed to clear logs:", error);
      setLogs(initialLogs);
    }
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

  const handleImport = async (text: string) => {
    const lines = text.split("\n");
    const newLogs: Omit<ClientLogEntry, "id" | "timestamp">[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      const match = trimmed.match(
        /^(Peminjaman|Pengembalian)\s+Laboratorium\s+(.*?)\s+oleh\s+(Asprak|Dosen|Laboran|Mahasiswa)\s+(.*)$/i
      );

      if (match) {
        newLogs.push({
          pergerakan: match[1],
          kodeLab: match[2],
          pengambil: match[3],
          namaDosen: match[4],
        });
      }
    });

    if (newLogs.length > 0) {
      // 1. Optimistic Update
      const optimisticEntries = newLogs.map(log => ({
        ...log,
        id: crypto.randomUUID(),
        timestamp: new Date()
      }));
      setLogs((prev) => [...optimisticEntries, ...prev]);

      // 2. Server Action
      try {
        await importLogs(newLogs);
      } catch (error) {
        console.error("Failed to import logs:", error);
        setLogs(initialLogs);
        alert("Terjadi kesalahan saat menyimpan data import ke database.");
      }
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
