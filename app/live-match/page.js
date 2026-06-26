import { fetchChampionDetail } from "../lib/champions";
import LiveMatchClient from "./LiveMatchClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Canlı Maç Ekranı | Blitz v2",
  description: "Canlı maç yardımcısı ikinci ekran gösterge paneli.",
};

export default async function LiveMatchPage({ searchParams }) {
  const params = await searchParams;
  const myChampId = params.myChamp;
  const myRole = params.myRole || "Mid";
  
  const enemyIds = [
    params.e1,
    params.e2,
    params.e3,
    params.e4,
    params.e5
  ].filter(Boolean);

  if (!myChampId) {
    return (
      <div className="min-h-screen bg-[#030308] text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold mb-4">Şampiyon seçimi eksik.</h2>
        <a href="/match-setup" className="px-4 py-2 rounded bg-amber-500 text-black">Kuruluma Git</a>
      </div>
    );
  }

  // Fetch Player Champion Detail
  const myChampion = await fetchChampionDetail(myChampId);
  
  // Fetch Enemy Champion Details
  const enemies = await Promise.all(
    enemyIds.map(id => fetchChampionDetail(id))
  );

  return (
    <LiveMatchClient 
      myChampion={myChampion} 
      myRole={myRole} 
      enemies={enemies.filter(Boolean)} 
      version={myChampion?.version || "14.3.1"}
    />
  );
}
