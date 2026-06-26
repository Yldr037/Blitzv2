import { fetchAllChampions } from "./lib/champions";
import ChampionExplorer from "./components/ChampionExplorer";

export default async function Home() {
  const { champions, version } = await fetchAllChampions();

  return <ChampionExplorer champions={champions} version={version} />;
}
