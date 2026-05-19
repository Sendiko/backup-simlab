"use client";

import { Activity, Download, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { LogEntry } from "./SimpanDataCard";

interface LogAktivitasCardProps {
  logs: LogEntry[];
  onClearAll: () => void;
  onExport: () => void;
}

export function LogAktivitasCard({ logs, onClearAll, onExport }: LogAktivitasCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 sm:p-8 w-full flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 text-indigo-600 p-2 rounded-md">
            <Activity className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Log Aktivitas Laboratorium</h2>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            onClick={onClearAll}
            disabled={logs.length === 0}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            Hapus Semua
          </button>
          <button
            onClick={onExport}
            disabled={logs.length === 0}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-200 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export .txt
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-[200px] bg-gray-50 rounded-md border border-gray-100 p-4 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm font-medium italic">
            Belum ada log aktivitas.
          </div>
        ) : (
          <ul className="flex flex-col gap-2 font-mono text-sm">
            <AnimatePresence initial={false}>
              {logs.map((log) => (
                <motion.li
                  key={log.id}
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, scale: 0.95, height: 0, transition: { duration: 0.2 } }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="bg-white px-4 py-3 rounded border border-gray-100 shadow-sm text-gray-700 break-words"
                >
                  <span className="text-blue-600 font-semibold">{log.pergerakan}</span>{" "}
                  Laboratorium <span className="font-semibold">{log.kodeLab}</span> oleh{" "}
                  <span className="text-gray-900 font-semibold">{log.pengambil}</span>{" "}
                  {log.namaDosen}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
}
