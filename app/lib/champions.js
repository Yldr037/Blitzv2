import laneMapping from "../data/laneMapping";

const DDRAGON_VERSION_URL = "https://ddragon.leagueoflegends.com/api/versions.json";
const DDRAGON_CHAMPIONS_URL = (version) =>
  `https://ddragon.leagueoflegends.com/cdn/${version}/data/tr_TR/champion.json`;
const DDRAGON_CHAMPION_DETAIL_URL = (version, id) =>
  `https://ddragon.leagueoflegends.com/cdn/${version}/data/tr_TR/champion/${id}.json`;

async function getLatestVersion() {
  const res = await fetch(DDRAGON_VERSION_URL, { next: { revalidate: 3600 } });
  const versions = await res.json();
  return versions[0];
}

// Strip HTML tags from Data Dragon descriptions
function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/\{\{.*?\}\}/g, "")
    .trim();
}

export async function fetchChampionDetail(championId) {
  try {
    const version = await getLatestVersion();

    const res = await fetch(DDRAGON_CHAMPION_DETAIL_URL(version, championId), {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    const champ = data.data[championId];

    if (!champ) return null;

    const lanes = laneMapping[champ.id] || [];

    return {
      id: champ.id,
      key: champ.key,
      name: champ.name,
      title: champ.title,
      lore: champ.lore,
      tags: champ.tags || [],
      partype: champ.partype,
      info: champ.info,
      stats: champ.stats,
      lanes,
      color: getChampionColor(champ.tags),
      splash: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ.id}_0.jpg`,
      loadingScreen: `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champ.id}_0.jpg`,
      icon: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champ.image.full}`,
      passive: {
        name: champ.passive.name,
        description: stripHtml(champ.passive.description),
        icon: `https://ddragon.leagueoflegends.com/cdn/${version}/img/passive/${champ.passive.image.full}`,
      },
      spells: champ.spells.map((spell, i) => ({
        id: spell.id,
        name: spell.name,
        description: stripHtml(spell.description),
        key: ["Q", "W", "E", "R"][i],
        icon: `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spell.image.full}`,
        cooldown: spell.cooldownBurn,
        cost: spell.costBurn,
        range: spell.rangeBurn,
      })),
      skins: champ.skins
        ?.filter((s) => s.name !== "default")
        .map((s) => ({
          id: s.id,
          name: s.name,
          num: s.num,
          splash: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ.id}_${s.num}.jpg`,
        })),
      tips: {
        ally: champ.allytips || [],
        enemy: champ.enemytips || [],
      },
      version,
    };
  } catch (error) {
    console.error("Failed to fetch champion detail:", error);
    return null;
  }
}

// Theme colors per role tag
export const tagColors = {
  Fighter: "#ef5350",
  Mage: "#42a5f5",
  Assassin: "#66bb6a",
  Marksman: "#ffd740",
  Tank: "#78909c",
  Support: "#ab47bc",
};

// Lane icons and colors
export const laneInfo = {
  Top: { color: "#ef5350", label: "Top" },
  Jungle: { color: "#66bb6a", label: "Orman" },
  Mid: { color: "#42a5f5", label: "Mid" },
  Bot: { color: "#ffd740", label: "Bot" },
  Support: { color: "#ab47bc", label: "Destek" },
};

// Difficulty labels
export const difficultyLabels = {
  easy: { label: "Kolay", range: [1, 4], color: "#66bb6a" },
  medium: { label: "Orta", range: [5, 7], color: "#ffa726" },
  hard: { label: "Zor", range: [8, 10], color: "#ef5350" },
};

export function getDifficultyCategory(difficulty) {
  if (difficulty <= 4) return "easy";
  if (difficulty <= 7) return "medium";
  return "hard";
}

// Color mapping for champions based on their primary tag
function getChampionColor(tags) {
  const primaryTag = tags?.[0];
  return tagColors[primaryTag] || "#c89b3c";
}

export async function fetchAllChampions() {
  try {
    // 1. Get latest version
    const versionsRes = await fetch(DDRAGON_VERSION_URL, { next: { revalidate: 3600 } });
    const versions = await versionsRes.json();
    const latestVersion = versions[0];

    // 2. Fetch all champions data (Turkish)
    const champRes = await fetch(DDRAGON_CHAMPIONS_URL(latestVersion), {
      next: { revalidate: 3600 },
    });
    const champData = await champRes.json();

    // 3. Transform data
    const champions = Object.values(champData.data).map((champ) => {
      const lanes = laneMapping[champ.id] || [];

      return {
        id: champ.id,
        key: champ.key,
        name: champ.name,
        title: champ.title,
        tags: champ.tags || [],
        difficulty: champ.info?.difficulty || 0,
        attack: champ.info?.attack || 0,
        defense: champ.info?.defense || 0,
        magic: champ.info?.magic || 0,
        lanes: lanes,
        color: getChampionColor(champ.tags),
        icon: `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${champ.image.full}`,
        splash: `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champ.id}_0.jpg`,
      };
    });

    // Sort alphabetically
    champions.sort((a, b) => a.name.localeCompare(b.name, "tr"));

    return { champions, version: latestVersion };
  } catch (error) {
    console.error("Failed to fetch champions:", error);
    return { champions: [], version: "unknown" };
  }
}
