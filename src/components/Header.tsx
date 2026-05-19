import { Key } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center gap-3 py-6">
      <div className="bg-primary text-white p-2 rounded-lg shadow-sm">
        <Key className="w-6 h-6" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
        Backup SIMLAB Admin 2
      </h1>
    </header>
  );
}
