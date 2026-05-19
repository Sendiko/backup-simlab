"use client";

import { Save } from "lucide-react";
import { useState } from "react";

export type LogEntry = {
  id: string;
  kodeLab: string;
  pergerakan: string;
  pengambil: string;
  namaDosen: string;
  timestamp: Date;
};

interface SimpanDataCardProps {
  onSave: (data: Omit<LogEntry, "id" | "timestamp">) => void;
}

export function SimpanDataCard({ onSave }: SimpanDataCardProps) {
  const [kodeLab, setKodeLab] = useState("");
  const [pergerakan, setPergerakan] = useState("Peminjaman");
  const [pengambil, setPengambil] = useState("Asprak");
  const [namaDosen, setNamaDosen] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kodeLab || !namaDosen) return;
    onSave({ kodeLab, pergerakan, pengambil, namaDosen });
    setKodeLab("");
    setNamaDosen("");
    // Keep dropdowns as they are, typical for repetitive entry
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 sm:p-8 w-full">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="bg-blue-50 text-blue-600 p-2 rounded-md">
          <Save className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Simpan Data</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="kodeLab" className="text-sm font-medium text-gray-700">
            Kode Laboratorium
          </label>
          <input
            id="kodeLab"
            type="text"
            placeholder="01/02/03"
            value={kodeLab}
            onChange={(e) => setKodeLab(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="pergerakan" className="text-sm font-medium text-gray-700">
            Pergerakan Kunci
          </label>
          <select
            id="pergerakan"
            value={pergerakan}
            onChange={(e) => setPergerakan(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
          >
            <option value="Peminjaman">Peminjaman</option>
            <option value="Pengembalian">Pengembalian</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="pengambil" className="text-sm font-medium text-gray-700">
            Pengambil Kunci
          </label>
          <select
            id="pengambil"
            value={pengambil}
            onChange={(e) => setPengambil(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
          >
            <option value="Asprak">Asprak</option>
            <option value="Dosen">Dosen</option>
            <option value="Laboran">Laboran</option>
            <option value="Mahasiswa">Mahasiswa</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="namaDosen" className="text-sm font-medium text-gray-700">
            Nama / Kode Dosen
          </label>
          <input
            id="namaDosen"
            type="text"
            placeholder="John D."
            value={namaDosen}
            onChange={(e) => setNamaDosen(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md shadow-sm transition-all active:scale-[0.98]"
        >
          SIMPAN
        </button>
      </form>
    </div>
  );
}
