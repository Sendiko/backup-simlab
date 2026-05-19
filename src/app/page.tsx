import { Dashboard } from "@/components/Dashboard";
import { fetchLogs } from "@/app/actions";

export default async function Home() {
  const initialLogs = await fetchLogs();

  return (
    <Dashboard initialLogs={initialLogs} />
  );
}
