import { fetchChampionDetail } from "../../lib/champions";
import ChampionDetailClient from "./ChampionDetailClient";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const champion = await fetchChampionDetail(id);

  if (!champion) {
    return { title: "Şampiyon Bulunamadı - Blitz v2" };
  }

  return {
    title: `${champion.name} - ${champion.title} | Blitz v2`,
    description: champion.lore.substring(0, 160) + "...",
  };
}

export default async function ChampionPage({ params }) {
  const { id } = await params;
  const champion = await fetchChampionDetail(id);

  if (!champion) {
    notFound();
  }

  return <ChampionDetailClient champion={champion} />;
}
