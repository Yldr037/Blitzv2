import { fetchAllChampions } from "../lib/champions";
import MatchSetupClient from "./MatchSetupClient";

export const metadata = {
  title: "Maç Kurulumu | Blitz v2",
  description: "Canlı maç yardımcısı için şampiyonunuzu ve rakipleri seçin.",
};

export default async function MatchSetupPage() {
  const { champions, version } = await fetchAllChampions();
  return <MatchSetupClient champions={champions} version={version} />;
}
