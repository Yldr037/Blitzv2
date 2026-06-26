"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  Shield, 
  Sword, 
  Zap, 
  Sparkles, 
  Coins, 
  X,
  ShieldAlert,
  Flame,
  Plus,
  Tv,
  HelpCircle,
  RotateCcw,
  Home,
  ExternalLink
} from "lucide-react";
import { getBuildRecommendation, RUNES } from "../lib/buildRecommendations";
import { getSituationalRecommendations, getMatchupTips, getChampionDamageType, getSingleEnemyRecommendations, getCombinedEnemyRecommendations } from "../lib/liveMatchEngine";
import ChampionDetailClient from "../champion/[id]/ChampionDetailClient";

const roleTranslations = {
  Fighter: "Dövüşçü",
  Mage: "Büyücü",
  Assassin: "Suikastçı",
  Marksman: "Nişancı",
  Tank: "Tank",
  Support: "Destek",
};

const laneTranslations = {
  Top: "Üst Koridor",
  Jungle: "Orman",
  Mid: "Orta Koridor",
  Bot: "Alt Koridor (ADC)",
  Support: "Destek",
};

const getMobalyticsSlug = (championId) => {
  const overrides = {
    MonkeyKing: "wukong",
    JarvanIV: "jarvan-iv",
    DrMundo: "dr-mundo",
    MissFortune: "miss-fortune",
    MasterYi: "master-yi",
    LeeSin: "lee-sin",
    KogMaw: "kog-maw",
    RekSai: "rek-sai",
    TahmKench: "tahm-kench",
    TwistedFate: "twisted-fate",
    XinZhao: "xin-zhao",
    AurelionSol: "aurelion-sol",
    ChoGath: "cho-gath",
    KaiSa: "kai-sa",
    BelVeth: "bel-veth",
    KSante: "k-sante",
    VelKoz: "vel-koz",
    Renata: "renata-glasc",
  };
  
  if (overrides[championId]) {
    return overrides[championId];
  }
  
  return championId
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/['.]/g, '')
    .replace(/\s+/g, '-');
};

export default function LiveMatchClient({ myChampion, myRole, enemies, version }) {
  const [itemsMap, setItemsMap] = useState(null);
  const [runesData, setRunesData] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [activeRune, setActiveRune] = useState(null);
  const [selectedEnemies, setSelectedEnemies] = useState([]);
  const [activeDetailChamp, setActiveDetailChamp] = useState(null);

  const handleEnemyClick = (enemy) => {
    const isBotOrSupport = myRole === "Bot" || myRole === "Support";
    if (isBotOrSupport) {
      setSelectedEnemies((prev) => {
        const exists = prev.some((e) => e.id === enemy.id);
        if (exists) {
          return prev.filter((e) => e.id !== enemy.id);
        } else {
          return prev.length >= 2 ? [prev[1], enemy] : [...prev, enemy];
        }
      });
    } else {
      setSelectedEnemies((prev) => {
        const exists = prev.some((e) => e.id === enemy.id);
        return exists ? [] : [enemy];
      });
    }
  };

  // Mobalytics build fetching states
  const [mobaBuild, setMobaBuild] = useState(null);
  const [mobaTier, setMobaTier] = useState("A");
  const [isBuildLoading, setIsBuildLoading] = useState(true);
  const [buildError, setBuildError] = useState(false);

  // Fetch Items Map from Data Dragon
  useEffect(() => {
    fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/tr_TR/item.json`)
      .then((res) => res.json())
      .then((data) => setItemsMap(data.data))
      .catch((err) => console.error("Failed to fetch items map:", err));
  }, [version]);

  // Fetch Runes Reforged data from Data Dragon
  useEffect(() => {
    fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/tr_TR/runesReforged.json`)
      .then((res) => res.json())
      .then((data) => setRunesData(data))
      .catch((err) => console.error("Failed to fetch runes data:", err));
  }, [version]);

  // Fetch Live Mobalytics Build
  useEffect(() => {
    setIsBuildLoading(true);
    setBuildError(false);

    const mobaRole = myRole === "Bot" ? "ADC" : myRole.toUpperCase();
    const mobaSlug = getMobalyticsSlug(myChampion.id);

    const query = `
      query LolChampionWidgetDynamicQuery(
        $champion: String!
        $role: Rolename
        $gameMode: GameMode!
      ) {
        lol {
          champion(filters: { slug: $champion, role: $role, gameMode: $gameMode }) {
            build {
              id
              type
              name
              role
              patch
              championSlug
              spells
              skillOrder
              skillMaxOrder
              items {
                type
                items
              }
              perks {
                IDs
                style
                subStyle
              }
            }
            stats {
              tier
            }
          }
        }
      }
    `;

    fetch("https://extwidget.mobalytics.gg/lol-gql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Bearer 2bd985cc-dc15-4cad-bea7-0c9669751e08"
      },
      body: JSON.stringify({
        query,
        variables: {
          champion: mobaSlug,
          role: mobaRole,
          gameMode: "SUMMONER_RIFT"
        }
      })
    })
      .then((res) => res.json())
      .then((resData) => {
        const champData = resData?.data?.lol?.champion;
        if (champData?.build) {
          setMobaBuild(champData.build);
          setMobaTier(champData.stats?.tier || "A");
        } else {
          setMobaBuild(null);
          setBuildError(true);
        }
        setIsBuildLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch Mobalytics build:", err);
        setMobaBuild(null);
        setBuildError(true);
        setIsBuildLoading(false);
      });
  }, [myChampion.id, myRole]);

  // Clean XML tags from item descriptions
  const cleanItemDescription = (html) => {
    if (!html) return "";
    return html
      .replace(/<mainText>/g, '<div class="space-y-1.5 text-white/80">')
      .replace(/<\/mainText>/g, "</div>")
      .replace(/<stats>/g, '<div class="text-emerald-400 font-medium my-1">')
      .replace(/<\/stats>/g, "</div>")
      .replace(/<attention>/g, '<span class="text-amber-400 font-semibold">')
      .replace(/<\/attention>/g, "</span>")
      .replace(/<active>/g, '<span class="text-purple-400 font-bold">Aktif: </span>')
      .replace(/<\/active>/g, "")
      .replace(/<passive>/g, '<span class="text-sky-400 font-bold">Pasif: </span>')
      .replace(/<\/passive>/g, "")
      .replace(/<rules>/g, '<span class="text-white/45 italic text-[11px]">')
      .replace(/<\/rules>/g, "</span>")
      .replace(/<scaleAP>/g, '<span class="text-sky-400 font-medium">')
      .replace(/<\/scaleAP>/g, "</span>")
      .replace(/<scaleAD>/g, '<span class="text-orange-400 font-medium">')
      .replace(/<\/scaleAD>/g, "</span>")
      .replace(/<font color='#(.*?)'>/g, '<span style="color: #$1">')
      .replace(/<\/font>/g, "</span>")
      .replace(/<br\s*\/?>/gi, "<br/>");
  };

  // Helper to map Riot's rune key to our local RUNES keys
  const mapRiotKeyToLocalRuneKey = (riotKey) => {
    const mapping = {
      Electrocute: "electrocute",
      DarkHarvest: "darkHarvest",
      SummonAery: "aery",
      ArcaneComet: "comet",
      PhaseRush: "phaseRush",
      Conqueror: "conqueror",
      LethalTempo: "lethalTempo",
      FleetFootwork: "fleetFootwork",
      PressTheAttack: "pressTheAttack",
      GraspOfTheUndying: "grasp",
      Aftershock: "aftershock",
      GlacialAugment: "glacial",
      FirstStrike: "firstStrike",
    };
    return mapping[riotKey] || riotKey.toLowerCase();
  };

  // Find Riot's rune details by its ID
  const findRuneById = (runeId) => {
    if (!runesData) return null;
    for (const path of runesData) {
      for (const slot of path.slots) {
        for (const rune of slot.runes) {
          if (rune.id === runeId) {
            return {
              ...rune,
              pathName: path.name,
              pathIcon: path.icon,
            };
          }
        }
      }
    }
    return null;
  };

  // Resolve player's active build
  const resolvedBuild = useMemo(() => {
    const fallbackBuild = getBuildRecommendation(myChampion, myRole);
    
    if (mobaBuild && runesData) {
      // 1. Resolve Runes
      const keystoneRune = findRuneById(mobaBuild.perks.IDs[0]);
      let localRune = null;
      if (keystoneRune) {
        const localKey = mapRiotKeyToLocalRuneKey(keystoneRune.key);
        localRune = RUNES[localKey] || {
          name: keystoneRune.name,
          icon: keystoneRune.icon,
          path: keystoneRune.pathName,
          description: "Mobalytics canlı verilerinden alınan anahtar rün."
        };
      } else {
        localRune = fallbackBuild.runes;
      }

      // 2. Resolve Items
      const startersList = mobaBuild.items.find(i => i.type === "Starter")?.items || [];
      const starters = startersList.map(id => ({ id: id.toString() }));
      
      const coreList = mobaBuild.items.find(i => i.type === "Core")?.items || [];
      const core = coreList.map(id => ({ id: id.toString() }));

      const situationalList = [
        ...(mobaBuild.items.find(i => i.type === "FullBuild")?.items || []),
        ...(mobaBuild.items.find(i => i.type === "Situational")?.items || [])
      ];
      const situational = [...new Set(situationalList)].map(id => ({ id: id.toString() }));

      const skillMaxOrder = mobaBuild.skillMaxOrder.map(k => ["", "Q", "W", "E", "R"][k]).join(" ➔ ");

      return {
        skillMaxOrder,
        skillOrder: mobaBuild.skillOrder,
        runes: localRune,
        starters,
        core,
        situational
      };
    }

    return fallbackBuild;
  }, [mobaBuild, runesData, myChampion, myRole]);

  // Calculate Threat Stats & Recommendations
  const enemyAnalysis = useMemo(() => {
    // 1. AP vs AD damage counts
    let apCount = 0;
    let adCount = 0;
    let mixedCount = 0;
    let healingThreat = false;
    let ccThreat = false;
    let burstThreat = false;
    let tankThreat = false;

    enemies.forEach(e => {
      const dmg = getChampionDamageType(e);
      if (dmg === "AP") apCount++;
      else if (dmg === "AD") adCount++;
      else mixedCount++;

      // Check lists for threats
      const healList = ["Aatrox", "Briar", "DrMundo", "Fiddlesticks", "Illaoi", "Irelia", "Kayn", "Nami", "Olaf", "Renekton", "Senna", "Sona", "Soraka", "Swain", "Sylas", "Taric", "Trundle", "Vladimir", "Volibear", "Warwick", "Yuumi", "Zac", "Darius", "Hecarim"];
      const burstList = ["Akali", "Diana", "Ekko", "Evelynn", "Fizz", "Kassadin", "Katarina", "KhaZix", "Leblanc", "Naafiri", "Nocturne", "Pyke", "Qiyana", "Rengar", "Shaco", "Syndra", "Talon", "Veigar", "Zed", "Zoe", "MasterYi"];
      const ccList = ["Alistar", "Amumu", "Ashe", "Bard", "Blitzcrank", "Braum", "Galio", "Gragas", "Leona", "Lissandra", "Lux", "Malzahar", "Maokai", "Morgana", "Nautilus", "Pyke", "Rell", "Sejuani", "Skarner", "Thresh", "Veigar", "Zac", "Zyra", "Seraphine", "Syndra", "Jax"];

      if (healList.includes(e.id) || healList.includes(e.name)) healingThreat = true;
      if (burstList.includes(e.id) || burstList.includes(e.name)) burstThreat = true;
      if (ccList.includes(e.id) || ccList.includes(e.name)) ccThreat = true;
      if (e.tags?.includes("Tank")) tankThreat = true;
    });

    const total = apCount + adCount + mixedCount;
    const apPercentage = total > 0 ? Math.round(((apCount + mixedCount*0.5) / total) * 100) : 0;
    const adPercentage = total > 0 ? 100 - apPercentage : 0;

    // 2. Situational item recommendations
    const situationalRecs = getSituationalRecommendations(enemies, myChampion, myRole);
    
    // 3. Matchup tips
    const tips = getMatchupTips(enemies);

    return {
      apPercentage,
      adPercentage,
      healingThreat,
      ccThreat,
      burstThreat,
      tankThreat,
      situationalRecs,
      tips
    };
  }, [enemies, myChampion, myRole]);

  const combinedRecommendations = useMemo(() => {
    if (selectedEnemies.length === 0) return [];
    return getCombinedEnemyRecommendations(selectedEnemies, myChampion, myRole);
  }, [selectedEnemies, myChampion, myRole]);

  const filteredTips = useMemo(() => {
    if (selectedEnemies.length === 0) return enemyAnalysis.tips;
    return enemyAnalysis.tips.filter(tip => 
      selectedEnemies.some(e => e.name === tip.championName)
    );
  }, [enemyAnalysis.tips, selectedEnemies]);

  return (
    <main className="min-h-screen bg-[#020206] text-white flex flex-col overflow-hidden relative">
      {/* Background Decorative Gradient */}
      <div className="absolute top-[-30%] left-[-20%] w-[800px] h-[800px] rounded-full bg-amber-500/[0.01] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-30%] right-[-20%] w-[800px] h-[800px] rounded-full bg-purple-500/[0.01] blur-[150px] pointer-events-none" />

       {/* HEADER SECTION */}
      <header className="flex-shrink-0 bg-[#07070d]/60 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between z-10">
        <div
          onClick={() => setActiveDetailChamp(myChampion)}
          className="flex items-center gap-4 group/champ cursor-pointer hover:opacity-90 transition-opacity"
          title={`${myChampion.name} Detaylarını Gör (Popup)`}
        >
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-amber-500/30 group-hover/champ:border-amber-400 transition-colors">
            <Image
              src={myChampion.icon}
              alt={myChampion.name}
              fill
              unoptimized
              sizes="48px"
              className="object-cover group-hover/champ:scale-105 transition-transform duration-300"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-wide group-hover/champ:text-amber-400 transition-colors">{myChampion.name}</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold uppercase tracking-wider">
                {laneTranslations[myRole] || myRole}
              </span>
              <span className="text-[10px] text-white/30 font-medium">v{version}</span>
            </div>
            <p className="text-xs text-white/45 italic capitalize mt-0.5">{myChampion.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/2 border border-white/5 text-xs text-white/40">
            <Tv size={14} className="text-amber-400" />
            <span>2. Ekran Modu Aktif</span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/2 border border-white/5 hover:border-white/20 text-xs font-bold text-white/70 hover:text-white transition-all cursor-pointer"
          >
            <Home size={13} className="text-amber-400" />
            <span>ANA MENÜ</span>
          </Link>

          <Link
            href="/match-setup"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/2 border border-white/5 hover:border-white/20 text-xs font-bold text-white/70 hover:text-white transition-all cursor-pointer"
          >
            <RotateCcw size={13} className="text-purple-400" />
            <span>YENİ MAÇ</span>
          </Link>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex-1 overflow-y-auto lg:overflow-hidden grid grid-cols-1 lg:grid-cols-12 p-6 gap-6 z-10 min-h-0">
        
        {/* COLUMN 1: PLAYER BUILD (Left Panel - 5 Columns) */}
        <section className="lg:col-span-5 bg-[#05050a]/60 backdrop-blur-md rounded-2xl border border-white/5 p-5 flex flex-col gap-5 overflow-y-auto scrollbar-thin scrollbar-thumb-white/5">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h2 className="text-sm font-black tracking-widest text-amber-400 flex items-center gap-2 uppercase">
              <span className="w-1 h-3.5 rounded bg-amber-400" />
              Canlı Mobalytics Build
            </h2>
            {isBuildLoading ? (
              <span className="text-xs text-white/45 flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Mobalytics verisi çekiliyor...
              </span>
            ) : buildError ? (
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 font-semibold">
                Yerel Yedek Build Yüklendi
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/40 font-medium">Patch {mobaBuild?.patch || "Live"}</span>
                <span className="text-xs font-black bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-md border border-amber-500/25">
                  Tier {mobaTier}
                </span>
              </div>
            )}
          </div>

          {/* Core Build Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Eşya Satın Alma Düzeni:</h3>
            
            {/* Starter items */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Başlangıç:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {resolvedBuild.starters?.filter(Boolean).map((item, idx) => {
                  const details = itemsMap?.[item.id];
                  const name = details?.name || `Eşya #${item.id}`;
                  const cost = details?.gold?.total || 0;
                  const img = `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.id}.png`;

                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveItem({ id: item.id, name, cost, description: details?.description, imgSrc: img })}
                      className="flex items-center gap-2 p-1.5 rounded-lg bg-white/2 border border-white/5 hover:border-amber-500/20 hover:bg-white/4 transition text-left cursor-pointer truncate"
                    >
                      <div className="relative w-8 h-8 rounded overflow-hidden flex-shrink-0 border border-white/10">
                        <Image src={img} alt={name} fill unoptimized sizes="32px" className="object-cover" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-white/95 truncate">{name}</p>
                        <p className="text-[9px] text-amber-400/90 font-semibold">{cost} g</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Core items */}
            <div className="space-y-1.5 pt-1.5">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Çekirdek Eşyalar (Core):</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {resolvedBuild.core?.filter(Boolean).map((item, idx) => {
                  const details = itemsMap?.[item.id];
                  const name = details?.name || `Eşya #${item.id}`;
                  const cost = details?.gold?.total || 0;
                  const img = `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.id}.png`;

                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveItem({ id: item.id, name, cost, description: details?.description, imgSrc: img })}
                      className="flex items-center gap-2 p-2 rounded-lg bg-white/2 border border-white/5 hover:border-amber-500/20 hover:bg-white/4 transition text-left cursor-pointer truncate"
                    >
                      <div className="relative w-9 h-9 rounded overflow-hidden flex-shrink-0 border border-white/10">
                        <Image src={img} alt={name} fill unoptimized sizes="36px" className="object-cover" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-white/95 truncate">{name}</p>
                        <p className="text-[9px] text-amber-400/90 font-semibold">{cost} g</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Full build / situational items */}
            <div className="space-y-1.5 pt-1.5">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Olası Diğer Eşyalar:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {resolvedBuild.situational?.filter(Boolean).map((item, idx) => {
                  const details = itemsMap?.[item.id];
                  const name = details?.name || `Eşya #${item.id}`;
                  const cost = details?.gold?.total || 0;
                  const img = `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.id}.png`;

                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveItem({ id: item.id, name, cost, description: details?.description, imgSrc: img })}
                      className="flex items-center gap-2 p-2 rounded-lg bg-white/2 border border-white/5 hover:border-amber-500/20 hover:bg-white/4 transition text-left cursor-pointer truncate"
                    >
                      <div className="relative w-9 h-9 rounded overflow-hidden flex-shrink-0 border border-white/10">
                        <Image src={img} alt={name} fill unoptimized sizes="36px" className="object-cover" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-white/95 truncate">{name}</p>
                        <p className="text-[9px] text-amber-400/90 font-semibold">{cost} g</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Runes Reforged Section */}
          <div className="space-y-3 pt-2 border-t border-white/5">
            <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Tavsiye Edilen Anahtar Rün:</h3>
            {resolvedBuild.runes ? (
              <div className="flex items-start gap-4 p-3.5 rounded-xl bg-white/2 border border-white/5 hover:border-amber-500/20 transition-all">
                <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-black/40 border border-white/10 p-1">
                  <Image
                    src={`https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/${resolvedBuild.runes.icon}`}
                    alt={resolvedBuild.runes.name}
                    width={40}
                    height={40}
                    unoptimized
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-amber-400">{resolvedBuild.runes.name}</p>
                    <span className="text-[9px] font-bold text-white/30 uppercase px-1.5 py-0.5 rounded bg-white/5">
                      {resolvedBuild.runes.path}
                    </span>
                  </div>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">
                    {resolvedBuild.runes.description}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-white/30">Rün bilgisi alınamadı.</p>
            )}
          </div>

          {/* Skill order max/grid section */}
          <div className="space-y-3 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Maksimum Yetenek Sırası:</h3>
              {resolvedBuild.skillMaxOrder && (
                <span className="text-[11px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/25">
                  {resolvedBuild.skillMaxOrder}
                </span>
              )}
            </div>
            
            {/* Detailed Skill grid (Truncated visual flow for second monitor) */}
            {resolvedBuild.skillOrder ? (
              <div className="w-full overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-white/5">
                <div className="min-w-[480px] flex flex-col gap-1.5 text-[9px]">
                  {/* Grid index numbers */}
                  <div className="flex items-center gap-1 pl-6">
                    {Array.from({ length: 18 }).map((_, idx) => (
                      <div key={idx} className="w-5 text-center font-bold text-white/30">
                        {idx + 1}
                      </div>
                    ))}
                  </div>
                  {/* Rows for Q, W, E, R */}
                  {["Q", "W", "E", "R"].map((key) => {
                    const keyNum = key === "Q" ? 1 : key === "W" ? 2 : key === "E" ? 3 : 4;
                    return (
                      <div key={key} className="flex items-center gap-1.5">
                        <div className="w-4 font-black text-amber-400">{key}</div>
                        <div className="flex gap-1 flex-1">
                          {Array.from({ length: 18 }).map((_, idx) => {
                            const isLeveled = resolvedBuild.skillOrder[idx] === keyNum;
                            return (
                              <div
                                key={idx}
                                className={`w-5 h-5 rounded flex items-center justify-center border ${
                                  isLeveled
                                    ? "bg-amber-500/20 border-amber-500 text-amber-400 font-bold"
                                    : "bg-white/2 border-white/5 text-transparent"
                                }`}
                              >
                                {key}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

        </section>

        {/* COLUMN 2: ENEMY ANALYSIS & DYNAMIC REC (Right Panel - 7 Columns) */}
        <section className="lg:col-span-7 flex flex-col gap-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/5 min-h-0 pr-1">
          
          {/* Section 1: Enemy Portrait and Damage Type list */}
          <div className="bg-[#05050a]/60 backdrop-blur-md rounded-2xl border border-white/5 p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest">
                {selectedEnemies.length > 0 
                  ? `${selectedEnemies.map(e => e.name).join(" ve ")} Odaklı Analiz` 
                  : "Rakip Kadro Hasar ve Rol Analizi"}
              </h3>
              {selectedEnemies.length > 0 && (
                <button 
                  onClick={() => setSelectedEnemies([])}
                  className="text-[10px] text-amber-400 hover:text-amber-300 font-bold uppercase transition-colors cursor-pointer"
                >
                  Tüm Takım Gösterimine Dön
                </button>
              )}
            </div>
            <div className="grid grid-cols-5 gap-3">
              {enemies.map((enemy, idx) => {
                const dmgType = getChampionDamageType(enemy);
                const role = enemy.tags?.[0] || "Unknown";
                const isSelected = selectedEnemies.some(e => e?.id === enemy.id);

                return (
                  <button
                    key={idx}
                    onClick={() => handleEnemyClick(enemy)}
                    className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all duration-300 cursor-pointer focus:outline-none ${
                      isSelected 
                        ? "bg-amber-500/10 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)] scale-102"
                        : "bg-white/2 border-white/5 hover:border-amber-500/30"
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 mb-2 group/portrait">
                      <Image
                        src={enemy.icon}
                        alt={enemy.name}
                        fill
                        unoptimized
                        sizes="48px"
                        className="object-cover"
                      />
                      {/* View Details Overlay Button */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent selection toggle
                          setActiveDetailChamp(enemy);
                        }}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover/portrait:opacity-100 flex items-center justify-center transition-opacity duration-200"
                        title={`${enemy.name} Detaylarını Gör (Popup)`}
                      >
                        <ExternalLink size={14} className="text-amber-400 hover:scale-115 transition-transform duration-200" />
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-white truncate max-w-full mb-1">{enemy.name}</span>
                    
                    {/* Badges */}
                    <div className="flex flex-col gap-1 w-full">
                      <span className={`text-[8px] font-extrabold px-1 py-0.5 rounded text-center border ${
                        dmgType === "AP" 
                          ? "bg-blue-500/10 border-blue-500/30 text-blue-400" 
                          : dmgType === "AD" 
                            ? "bg-red-500/10 border-red-500/30 text-red-400"
                            : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                      }`}>
                        {dmgType} Hasarı
                      </span>
                      <span className="text-[8px] text-white/30 font-bold bg-white/4 py-0.5 rounded truncate">
                        {roleTranslations[role] || role}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Composition Threat Gauge Analysis */}
          <div className="bg-[#05050a]/60 backdrop-blur-md rounded-2xl border border-white/5 p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: AP vs AD ratio chart */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-amber-400" />
                Hasar Dağılım Oranı
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold px-1">
                  <span className="text-red-400">AD: %{enemyAnalysis.adPercentage}</span>
                  <span className="text-blue-400">AP: %{enemyAnalysis.apPercentage}</span>
                </div>
                {/* Visual bar */}
                <div className="h-3 rounded-full bg-white/5 border border-white/5 overflow-hidden flex">
                  <div className="bg-red-500" style={{ width: `${enemyAnalysis.adPercentage}%` }} />
                  <div className="bg-blue-500 flex-1" />
                </div>
                <p className="text-[10px] text-white/30 italic">
                  {enemyAnalysis.adPercentage > enemyAnalysis.apPercentage 
                    ? "Zırh (Armor) eşyalarına öncelik verin." 
                    : enemyAnalysis.apPercentage > enemyAnalysis.adPercentage 
                      ? "Büyü Direnci (Magic Resist) eşyalarına öncelik verin." 
                      : "Dirençleri dengeli kasmaya çalışın."
                  }
                </p>
              </div>
            </div>

            {/* Right: Specific Hazard Indicators */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest">Önemli Tehdit Türleri</h4>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                
                {/* Healing threat badge */}
                <div className={`p-2 rounded-lg border flex items-center gap-2 ${
                  enemyAnalysis.healingThreat 
                    ? "bg-red-500/10 border-red-500/25 text-red-400" 
                    : "bg-white/2 border-white/5 text-white/30"
                }`}>
                  <Flame size={12} />
                  <span>Ağır Yara Gerekli</span>
                </div>

                {/* CC threat badge */}
                <div className={`p-2 rounded-lg border flex items-center gap-2 ${
                  enemyAnalysis.ccThreat 
                    ? "bg-blue-500/10 border-blue-500/25 text-blue-400" 
                    : "bg-white/2 border-white/5 text-white/30"
                }`}>
                  <Shield size={12} />
                  <span>Sıvışma Gerekli</span>
                </div>

                {/* Burst threat badge */}
                <div className={`p-2 rounded-lg border flex items-center gap-2 ${
                  enemyAnalysis.burstThreat 
                    ? "bg-purple-500/10 border-purple-500/25 text-purple-400" 
                    : "bg-white/2 border-white/5 text-white/30"
                }`}>
                  <Zap size={12} />
                  <span>Burst / Anlık Hasar</span>
                </div>

                {/* Tank threat badge */}
                <div className={`p-2 rounded-lg border flex items-center gap-2 ${
                  enemyAnalysis.tankThreat 
                    ? "bg-amber-500/10 border-amber-500/25 text-amber-400" 
                    : "bg-white/2 border-white/5 text-white/30"
                }`}>
                  <ShieldAlert size={12} />
                  <span>Zırh/Büyü Delme</span>
                </div>

              </div>
            </div>

          </div>

          {/* Section 3: Dynamic Situational Item recommendations */}
          <div className="bg-[#05050a]/60 backdrop-blur-md rounded-2xl border border-white/5 p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black tracking-widest text-amber-400 flex items-center gap-2 uppercase">
                <span className="w-1 h-3.5 rounded bg-amber-400" />
                {selectedEnemies.length > 0 
                  ? `${selectedEnemies.map(e => e.name).join(" + ")} Karşıtı Özel Eşyalar` 
                  : "Rakip Takıma Karşı Durumsal Eşya Tavsiyeleri"
                }
              </h3>
              {selectedEnemies.length > 0 && (
                <span className="text-[10px] text-amber-400/60 font-semibold italic">
                  {selectedEnemies.length === 2 ? "2v2 Koridor Analizi" : "Hedef Karşı Önlem Aktif"}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {(selectedEnemies.length > 0 ? combinedRecommendations : enemyAnalysis.situationalRecs).map((rec, idx) => {
                const details = itemsMap?.[rec.id];
                const img = `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${rec.id}.png`;

                return (
                  <div
                    key={idx}
                    onClick={() => setActiveItem({ id: rec.id, name: rec.name, cost: rec.cost, description: details?.description, imgSrc: img })}
                    className="group flex gap-4 p-3 rounded-xl bg-white/2 border border-white/5 hover:border-amber-500/30 hover:bg-white/4 transition-all duration-300 cursor-pointer"
                  >
                    <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border border-white/10 group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src={img}
                        alt={rec.name}
                        fill
                        unoptimized
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-sm font-bold text-white/95 group-hover:text-amber-400 transition-colors leading-tight">
                          {rec.name}
                        </h4>
                        <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                          <Coins size={10} /> {rec.cost} Gold
                        </span>
                      </div>
                      
                      {selectedEnemies.length > 0 ? (
                        <div className="space-y-2 mt-1">
                          {rec.targets.map((target, tIdx) => (
                            <div key={tIdx} className="text-xs text-white/50 leading-relaxed pl-2.5 border-l-2 border-amber-500/25">
                              <span className="font-bold text-amber-400/80 mr-1">{target.championName} Karşı:</span>
                              {target.reason}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-white/50 mt-1 leading-relaxed">
                          {rec.reason}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              {(selectedEnemies.length > 0 ? combinedRecommendations : enemyAnalysis.situationalRecs).length === 0 && (
                <p className="text-xs text-white/30 text-center py-6">Bu kriterler altında özel bir durumsal eşyaya gerek duyulmadı.</p>
              )}
            </div>

            {/* Explanation box on how recommendations work (Eşya Öneri Kriterleri) */}
            <div className="mt-2 pt-4 border-t border-white/5 space-y-2">
              <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <HelpCircle size={12} className="text-amber-400" />
                Eşya Karşılaştırma & Öneri Kriterleri
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] text-white/40 leading-relaxed font-light">
                <div>
                  <p className="font-semibold text-white/60 mb-0.5">• Büyü Hasarı (AP):</p>
                  <p>Rakip AP ise yetenek kalkanları ve MR eşyaları (Banshee, Kutluyas Rukern, Malmortius) önerilir.</p>
                </div>
                <div>
                  <p className="font-semibold text-white/60 mb-0.5">• Fiziksel Hasar (AD):</p>
                  <p>Rakip AD/Kritik ise zırh ve saldırı hızı yavaşlatma (Zhonya, Randuin'in Alameti, Donmuş Yürek) önerilir.</p>
                </div>
                <div>
                  <p className="font-semibold text-white/60 mb-0.5">• İyileştirme / Can Çalma:</p>
                  <p>Rakipte yüksek iyileşme varsa can yenilemeyi %40 azaltan Ağır Yara eşyaları (Morello, Çivili Zırh, Ölüm Hatırası) önerilir.</p>
                </div>
                <div>
                  <p className="font-semibold text-white/60 mb-0.5">• Tank & Direnç:</p>
                  <p>Rakip yüksek zırh/büyü direnci kastığında zırh/büyü delme eşyaları (Dominik Efendi, Kara Balta, Boşluk Değneği) önerilir.</p>
                </div>
                <div>
                  <p className="font-semibold text-white/60 mb-0.5">• Anlık Hasar (Burst):</p>
                  <p>Suikastçıların tek atmasını önlemek için can kalkanı veya altın mod (Zhonya, Sterak'ın Güvencesi, Koruyucu Melek) önerilir.</p>
                </div>
                <div>
                  <p className="font-semibold text-white/60 mb-0.5">• Kitle Kontrolü (CC):</p>
                  <p>Yoğun sersemletme sürelerini kısaltmak için Sıvışma sağlayan Merkür'ün Adımları önerilir.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Section 4: Matchup / Counter Tips */}
          {filteredTips.length > 0 && (
            <div className="bg-[#05050a]/60 backdrop-blur-md rounded-2xl border border-white/5 p-5 flex flex-col gap-4">
              <h3 className="text-xs font-black tracking-widest text-purple-400 flex items-center gap-2 uppercase">
                <span className="w-1 h-3.5 rounded bg-purple-400" />
                Kritik Karşılaşma İpuçları (Taktikler)
              </h3>
              
              <div className="flex flex-col gap-4">
                {filteredTips.map((tip, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white/2 border border-white/5 space-y-2">
                    <div 
                      onClick={() => {
                        const enemyObj = enemies.find(e => e.id === tip.championId);
                        if (enemyObj) {
                          setActiveDetailChamp(enemyObj);
                        }
                      }}
                      className="flex items-center gap-2.5 group/tip cursor-pointer hover:opacity-90 transition-opacity"
                      title={`${tip.championName} Detaylarını Gör (Popup)`}
                    >
                      <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 group-hover/tip:border-purple-400/40 transition-colors">
                        <Image
                          src={tip.icon}
                          alt={tip.championName}
                          fill
                          unoptimized
                          sizes="28px"
                          className="object-cover group-hover/tip:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-xs font-bold text-purple-400 group-hover/tip:text-purple-300 transition-colors flex items-center gap-1">
                        {tip.championName} Karşılaşması
                        <ExternalLink size={10} className="opacity-45 group-hover/tip:opacity-100 transition-opacity duration-200" />
                      </span>
                    </div>
                    <ul className="list-disc pl-5 text-xs text-white/50 space-y-1.5 leading-relaxed">
                      {tip.notes.map((note, nIdx) => (
                        <li key={nIdx}>{note}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>

      </div>

      {/* POPUP MODALS FOR DETAILED VIEW */}
      
      {/* 1. Item Details Modal */}
      <AnimatePresence>
        {activeItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveItem(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md p-6 rounded-2xl border border-white/10 bg-[#08080f] shadow-2xl z-10 space-y-4"
            >
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/10">
                  <Image src={activeItem.imgSrc} alt={activeItem.name} fill unoptimized sizes="56px" className="object-cover" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{activeItem.name}</h3>
                  <p className="text-xs text-amber-400 font-bold flex items-center gap-1 mt-0.5">
                    <Coins size={12} /> {activeItem.cost} Gold
                  </p>
                </div>
              </div>

              <div 
                className="text-xs text-white/75 space-y-1.5 border-t border-white/5 pt-4 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10"
                dangerouslySetInnerHTML={{ __html: cleanItemDescription(activeItem.description) }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Rune Details Modal */}
      <AnimatePresence>
        {activeRune && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveRune(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md p-6 rounded-2xl border border-white/10 bg-[#08080f] shadow-2xl z-10 space-y-4"
            >
              <button
                onClick={() => setActiveRune(null)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-black/40 border border-white/10 p-2 flex items-center justify-center">
                  <Image
                    src={`https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/${activeRune.icon}`}
                    alt={activeRune.name}
                    width={40}
                    height={40}
                    unoptimized
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-base font-black text-amber-400">{activeRune.name}</h3>
                  <span className="text-[10px] font-bold text-white/30 uppercase px-2 py-0.5 rounded bg-white/5 mt-1 inline-block">
                    {activeRune.path}
                  </span>
                </div>
              </div>

              <p className="text-xs text-white/70 leading-relaxed border-t border-white/5 pt-4">
                {activeRune.description}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Champion Details Modal (covers 90% of screen) */}
      <AnimatePresence>
        {activeDetailChamp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDetailChamp(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />
            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-[95vw] md:w-[90vw] h-[90vh] rounded-2xl border border-white/10 bg-[#06060c] shadow-2xl overflow-hidden z-10 flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveDetailChamp(null)}
                className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/70 border border-white/10 hover:border-red-500/40 text-white/60 hover:text-red-500 transition-all cursor-pointer shadow-lg hover:bg-black"
                title="Kapat"
              >
                <X size={20} />
              </button>
              
              {/* Scrollable Container */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <ChampionDetailClient champion={activeDetailChamp} isModal={true} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}
