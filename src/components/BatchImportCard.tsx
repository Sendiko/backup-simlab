"use client";

import { FileDown, UploadCloud } from "lucide-react";
import { useState } from "react";

interface BatchImportCardProps {
  onImport: (text: string) => void;
}

export function BatchImportCard({ onImport }: BatchImportCardProps) {
  const [text, setText] = useState("");

  const handleImport = () => {
    if (!text.trim()) return;
    onImport(text);
    setText("");
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 sm:p-8 w-full mt-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="bg-emerald-50 text-emerald-600 p-2 rounded-md">
          <UploadCloud className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Batch Import</h2>
      </div>

      <div className="flex flex-col gap-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Import data teks..."
          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm resize-none transition-colors"
        />
        <button
          onClick={handleImport}
          disabled={!text.trim()}
          className="flex items-center gap-2 self-end px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-md shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileDown className="w-4 h-4" />
          Import Data
        </button>
      </div>
    </div>
  );
}
