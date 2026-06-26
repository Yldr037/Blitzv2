"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  Shield, 
  Sword, 
  Zap, 
  Sparkles, 
  Clock, 
  Compass, 
  BookOpen, 
  Flame,
  Coins,
  TrendingUp,
  X,
  ExternalLink
} from "lucide-react";
import { tagColors, laneInfo } from "../../lib/champions";
import { getBuildRecommendation, RUNES } from "../../lib/buildRecommendations";

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
  Bot: "Alt Koridor",
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

// Reusable component to render individual recommended items with click pop-ups and dynamic details
function ShopItemCard({ item, itemsMap, championVersion, onItemClick }) {
  const itemId = item.id;
  const resolvedName = itemsMap?.[itemId]?.name || item.name || `Eşya #${itemId}`;
  const resolvedCost = itemsMap?.[itemId]?.gold?.total || item.cost || 0;
  const resolvedDescription = itemsMap?.[itemId]?.description || "Eşya bilgisi yükleniyor...";

  const [imgSrc, setImgSrc] = useState(`https://ddragon.leagueoflegends.com/cdn/${championVersion}/img/item/${itemId}.png`);

  useEffect(() => {
    setImgSrc(`https://ddragon.leagueoflegends.com/cdn/${championVersion}/img/item/${itemId}.png`);
  }, [itemId, championVersion]);

  return (
    <button 
      onClick={() => onItemClick({
        id: itemId,
        name: resolvedName,
        cost: resolvedCost,
        description: resolvedDescription,
        imgSrc: imgSrc
      })}
      className="flex items-center gap-3 p-2 rounded-xl bg-white/2 border border-white/5 hover:border-amber-400/25 hover:bg-white/5 transition-all duration-300 cursor-pointer text-left w-full focus:outline-none focus:ring-1 focus:ring-amber-400/50"
    >
      <div className="relative w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden border border-white/10">
        <Image
          src={imgSrc}
          alt={resolvedName}
          fill
          unoptimized
          sizes="40px"
          className="object-cover"
          onError={() => {
            // Fallback to a default generic item like Health Potion if item is missing on old CDN versions
            const fallback = `https://ddragon.leagueoflegends.com/cdn/${championVersion}/img/item/2003.png`;
            if (imgSrc !== fallback) {
              setImgSrc(fallback);
            }
          }}
        />
      </div>
      <div className="overflow-hidden">
        <p className="text-xs font-bold truncate text-white/90">{resolvedName}</p>
        <p className="text-[10px] text-amber-400 font-semibold flex items-center gap-1 mt-0.5">
          <Coins size={10} /> {resolvedCost}
        </p>
      </div>
    </button>
  );
}

function SkillOrderGrid({ skillOrder, abilities }) {
  if (!skillOrder || skillOrder.length === 0) return null;
  const skillKeys = ["Q", "W", "E", "R"];
  
  return (
    <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
      <div className="min-w-[620px] flex flex-col gap-2 mt-4 text-[10px]">
        {/* Header row with level numbers */}
        <div className="flex items-center gap-1.5 pl-10">
          {Array.from({ length: 18 }).map((_, idx) => (
            <div key={idx} className="w-6 text-center font-bold text-white/40">
              {idx + 1}
            </div>
          ))}
        </div>
        
        {/* Rows for Q, W, E, R */}
        {skillKeys.map((key) => {
          const keyNum = key === "Q" ? 1 : key === "W" ? 2 : key === "E" ? 3 : 4;
          const ability = abilities.find(a => a.key === key);
          
          return (
            <div key={key} className="flex items-center gap-2">
              {/* Row title with small icon and letter */}
              <div className="w-10 flex items-center gap-1 font-bold text-amber-400">
                {ability ? (
                  <div className="relative w-4 h-4 rounded overflow-hidden border border-white/10 flex-shrink-0">
                    <Image
                      src={ability.icon}
                      alt={key}
                      fill
                      unoptimized
                      sizes="16px"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <span>{key}</span>
              </div>
              
              {/* Grid cells */}
              <div className="flex gap-1.5 flex-1">
                {Array.from({ length: 18 }).map((_, idx) => {
                  const isLeveled = skillOrder[idx] === keyNum;
                  
                  return (
                    <div 
                      key={idx} 
                      className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-300 border ${
                        isLeveled 
                          ? "bg-amber-400/20 border-amber-400 text-amber-400 font-bold shadow-[0_0_8px_rgba(200,155,60,0.2)]" 
                          : "bg-white/2 border-white/5 text-white/10"
                      }`}
                    >
                      {isLeveled ? key : ""}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ChampionDetailClient({ champion, isModal = false }) {
  // Construct the list of abilities (Passive + Spells)
  const abilities = [
    {
      id: "passive",
      key: "Pasif",
      name: champion.passive.name,
      description: champion.passive.description,
      icon: champion.passive.icon,
    },
    ...champion.spells,
  ];

  const [activeAbility, setActiveAbility] = useState(abilities[0]);

  const glowColor = champion.color || "#c89b3c";

  // Translate champion tags
  const translatedTags = champion.tags.map(tag => roleTranslations[tag] || tag);

  // State for active lane in guide (default to primary lane)
  const [activeLane, setActiveLane] = useState(champion.lanes[0] || "Mid");

  // Fetch build recommendations based on this champion's details and active lane (fallback)
  const build = getBuildRecommendation(champion, activeLane);

  // Fetch full item details from Riot Data Dragon for interactive popups
  const [itemsMap, setItemsMap] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [videoError, setVideoError] = useState(false);
  const [isExpandedVideo, setIsExpandedVideo] = useState(false);

  // Mobalytics dynamically fetched data states
  const [mobaBuild, setMobaBuild] = useState(null);
  const [mobaTier, setMobaTier] = useState(null);
  const [runesData, setRunesData] = useState(null);
  const [isBuildLoading, setIsBuildLoading] = useState(true);
  const [buildError, setBuildError] = useState(false);

  // Fetch Items Map
  useEffect(() => {
    fetch(`https://ddragon.leagueoflegends.com/cdn/${champion.version}/data/tr_TR/item.json`)
      .then((res) => res.json())
      .then((data) => {
        setItemsMap(data.data);
      })
      .catch((err) => console.error("Failed to fetch items map:", err));
  }, [champion.version]);

  // Fetch Runes Reforged data from Riot
  useEffect(() => {
    fetch(`https://ddragon.leagueoflegends.com/cdn/${champion.version}/data/tr_TR/runesReforged.json`)
      .then(res => res.json())
      .then(data => setRunesData(data))
      .catch(err => console.error("Failed to fetch runes data:", err));
  }, [champion.version]);

  // Fetch build from Mobalytics API on lane change
  useEffect(() => {
    setIsBuildLoading(true);
    setBuildError(false);

    const mobaRole = activeLane === "Bot" ? "ADC" : activeLane.toUpperCase();
    const mobaSlug = getMobalyticsSlug(champion.id);

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
      .then(res => res.json())
      .then(resData => {
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
      .catch(err => {
        console.error("Failed to fetch Mobalytics build:", err);
        setMobaBuild(null);
        setBuildError(true);
        setIsBuildLoading(false);
      });
  }, [champion.id, activeLane]);

  // Video Preview calculation
  const paddedChampKey = String(champion.key).padStart(4, "0");
  const spellKey = activeAbility.key === "Pasif" ? "P" : activeAbility.key;
  const webmVideoUrl = `https://d28xe8vt774jo5.cloudfront.net/champion-abilities/${paddedChampKey}/ability_${paddedChampKey}_${spellKey}1.webm`;
  const mp4VideoUrl = `https://d28xe8vt774jo5.cloudfront.net/champion-abilities/${paddedChampKey}/ability_${paddedChampKey}_${spellKey}1.mp4`;

  useEffect(() => {
    setVideoError(false);
    setIsExpandedVideo(false);
  }, [activeAbility.id]);

  // Clean XML-like tags from Riot's item descriptions and convert to styled HTML elements
  const cleanItemDescription = (html) => {
    if (!html) return "";
    return html
      .replace(/<mainText>/g, '<div class="space-y-1.5 text-white/80">')
      .replace(/<\/mainText>/g, '</div>')
      .replace(/<stats>/g, '<div class="text-emerald-400 font-medium my-1">')
      .replace(/<\/stats>/g, '</div>')
      .replace(/<attention>/g, '<span class="text-amber-400 font-semibold">')
      .replace(/<\/attention>/g, '</span>')
      .replace(/<active>/g, '<span class="text-purple-400 font-bold">Aktif: </span>')
      .replace(/<\/active>/g, '')
      .replace(/<passive>/g, '<span class="text-sky-400 font-bold">Pasif: </span>')
      .replace(/<\/passive>/g, '')
      .replace(/<rules>/g, '<span class="text-white/45 italic text-[11px]">')
      .replace(/<\/rules>/g, '</span>')
      .replace(/<scaleAP>/g, '<span class="text-sky-400 font-medium">')
      .replace(/<\/scaleAP>/g, '</span>')
      .replace(/<scaleAD>/g, '<span class="text-orange-400 font-medium">')
      .replace(/<\/scaleAD>/g, '</span>')
      .replace(/<font color='#(.*?)'>/g, '<span style="color: #$1">')
      .replace(/<\/font>/g, '</span>')
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

  // Construct resolved build properties:
  let resolvedBuild = null;
  
  if (mobaBuild && runesData) {
    // 1. Resolve Runes:
    const keystoneRune = findRuneById(mobaBuild.perks.IDs[0]);
    let localRune = null;
    if (keystoneRune) {
      const localKey = mapRiotKeyToLocalRuneKey(keystoneRune.key);
      localRune = RUNES[localKey] || {
        name: keystoneRune.name,
        icon: keystoneRune.icon,
        path: keystoneRune.pathName,
        description: "Bu şampiyon için en yüksek tercih edilme oranına sahip anahtar rün."
      };
    } else {
      localRune = build.runes;
    }

    // 2. Resolve Items:
    const startersList = mobaBuild.items.find(i => i.type === "Starter")?.items || [];
    const starters = startersList.map(id => ({ id: id.toString() }));
    
    const coreList = mobaBuild.items.find(i => i.type === "Core")?.items || [];
    const core = coreList.map(id => ({ id: id.toString() }));

    const situationalList = [
      ...(mobaBuild.items.find(i => i.type === "FullBuild")?.items || []),
      ...(mobaBuild.items.find(i => i.type === "Situational")?.items || [])
    ];
    const situational = [...new Set(situationalList)].map(id => ({ id: id.toString() }));

    // 3. Resolve Skills Max Order
    const skillMaxOrder = mobaBuild.skillMaxOrder.map(k => ["", "Q", "W", "E", "R"][k]).join(" ➔ ");
    const skillMaxReason = `${champion.name} için canlı Mobalytics verilerine göre en yüksek kazanma oranına sahip yetenek geliştirme sırası: ${skillMaxOrder}. Genellikle hasar yeteneğinizi ilk olarak fullemeniz koridor kontrolü için önemlidir.`;

    resolvedBuild = {
      skillMaxOrder,
      skillMaxReason,
      skillOrder: mobaBuild.skillOrder,
      runes: localRune,
      starters,
      core,
      situational
    };
  } else {
    resolvedBuild = {
      ...build,
      skillOrder: null
    };
  }

  // Map the skill order string to actual ability objects to show their icons
  const skillKeys = resolvedBuild.skillMaxOrder.split(" ➔ ");
  const skillSequence = skillKeys.map(key => {
    return abilities.find(a => a.key === key);
  }).filter(Boolean);

  return (
    <main className="relative min-h-screen bg-[#06060c] text-white overflow-x-hidden">
      {/* Back Button */}
      {!isModal && (
        <Link
          href="/"
          className="fixed top-6 left-6 z-50 flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/55 backdrop-blur-xl border border-white/10 hover:border-amber-400/40 hover:bg-black/80 transition-all duration-300 text-sm font-medium text-white/90 hover:text-amber-400 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
        >
          <ArrowLeft size={16} />
          <span>Geri Dön</span>
        </Link>
      )}

      {/* Hero Splash Image Section */}
      <div className={`relative w-full overflow-hidden ${isModal ? "h-[45vh]" : "h-[75vh] md:h-[90vh]"}`}>
        {/* Background Splash art */}
        <div className="absolute inset-0">
          <Image
            src={champion.splash}
            alt={champion.name}
            fill
            priority
            unoptimized
            className="object-cover object-top scale-102"
            sizes="100vw"
          />
        </div>
        
        {/* Multi-layered cinematic gradient overlays for perfect text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06060c] via-[#06060c]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06060c] via-[#06060c]/40 to-transparent" />
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />

        {/* Champion Intro Details */}
        <div className={`absolute bottom-0 left-0 w-full p-6 ${isModal ? "md:p-8 pb-10 md:pb-10" : "md:p-16 lg:px-24 pb-20 md:pb-24"}`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            {/* Metadata (Lanes and Roles) separated and stylized */}
            <div className="flex flex-wrap items-center gap-6 mb-6">
              {/* Koridorlar */}
              {champion.lanes.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/50">Koridor:</span>
                  <div className="flex gap-1.5">
                    {champion.lanes.map((lane) => (
                      <span
                        key={lane}
                        className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md border border-white/10"
                        style={{
                          background: `${laneInfo[lane]?.color || "#888"}20`,
                          color: laneInfo[lane]?.color || "#888",
                          borderColor: `${laneInfo[lane]?.color || "#888"}30`,
                        }}
                      >
                        {laneTranslations[lane] || lane}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Roller */}
              {champion.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/50">Rol:</span>
                  <div className="flex gap-1.5">
                    {champion.tags.map((tag, idx) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md border border-white/10"
                        style={{
                          background: `${tagColors[tag] || glowColor}20`,
                          color: tagColors[tag] || glowColor,
                          borderColor: `${tagColors[tag] || glowColor}30`,
                        }}
                      >
                        {translatedTags[idx]}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <h2
              className="text-lg md:text-xl font-bold tracking-widest uppercase mb-2 drop-shadow-md"
              style={{ color: glowColor, textShadow: `0 0 10px ${glowColor}30` }}
            >
              {champion.title}
            </h2>
            
            <h1 className={`font-extrabold tracking-tighter mb-4 uppercase drop-shadow-2xl ${isModal ? "text-4xl md:text-6xl" : "text-6xl md:text-8xl"}`}>
              {champion.name}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className={`relative z-10 max-w-6xl mx-auto px-6 md:px-12 pb-32 flex flex-col gap-20 ${isModal ? "-mt-8" : "-mt-16"}`}>
        
        {/* LORE & STATS SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 bg-[#0e0e1a]/85 backdrop-blur-xl border border-white/5 p-8 md:p-10 rounded-2xl shadow-2xl">
          {/* Lore */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <BookOpen size={20} className="text-amber-400" />
                <h3 className="text-xl font-bold uppercase tracking-wider text-amber-400">Şampiyon Hikayesi</h3>
              </div>
              <p className="text-white/80 text-base md:text-lg leading-relaxed font-light whitespace-pre-line">
                {champion.lore}
              </p>
            </div>
            
            {champion.partype && (
              <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-2 text-white/50 text-sm">
                <span className="font-semibold text-white/80">Kaynak Türü:</span>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/90 text-xs">
                  {champion.partype}
                </span>
              </div>
            )}
          </div>

          {/* Vertical Divider for desktop */}
          <div className="hidden lg:block lg:col-span-1 w-px h-full bg-white/5 justify-self-center" />

          {/* Stats Dashboard */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Sparkles size={20} className="text-amber-400" />
                <h3 className="text-xl font-bold uppercase tracking-wider text-amber-400">Yetenek Seviyeleri</h3>
              </div>
              
              <div className="flex flex-col gap-5">
                {/* Attack */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">
                    <span className="flex items-center gap-1.5"><Sword size={12} className="text-[#ef5350]" /> Saldırı Gücü</span>
                    <span className="text-white">{champion.info.attack} / 10</span>
                  </div>
                  <div className="h-2 w-full bg-[#1b1b2f] rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-[#e53935] to-[#ef5350] rounded-full shadow-[0_0_8px_rgba(239,83,80,0.5)] transition-all duration-1000"
                      style={{ width: `${champion.info.attack * 10}%` }}
                    />
                  </div>
                </div>

                {/* Defense */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">
                    <span className="flex items-center gap-1.5"><Shield size={12} className="text-[#66bb6a]" /> Savunma</span>
                    <span className="text-white">{champion.info.defense} / 10</span>
                  </div>
                  <div className="h-2 w-full bg-[#1b1b2f] rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-[#43a047] to-[#66bb6a] rounded-full shadow-[0_0_8px_rgba(102,187,106,0.5)] transition-all duration-1000"
                      style={{ width: `${champion.info.defense * 10}%` }}
                    />
                  </div>
                </div>

                {/* Magic */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">
                    <span className="flex items-center gap-1.5"><Zap size={12} className="text-[#42a5f5]" /> Büyü Gücü</span>
                    <span className="text-white">{champion.info.magic} / 10</span>
                  </div>
                  <div className="h-2 w-full bg-[#1b1b2f] rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-[#1e88e5] to-[#42a5f5] rounded-full shadow-[0_0_8px_rgba(66,165,245,0.5)] transition-all duration-1000"
                      style={{ width: `${champion.info.magic * 10}%` }}
                    />
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">
                    <span className="flex items-center gap-1.5"><Flame size={12} className="text-amber-400" /> Zorluk</span>
                    <span className="text-white">{champion.info.difficulty} / 10</span>
                  </div>
                  <div className="h-2 w-full bg-[#1b1b2f] rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-[#ffb300] to-[#ffd740] rounded-full shadow-[0_0_8px_rgba(255,215,64,0.5)] transition-all duration-1000"
                      style={{ width: `${champion.info.difficulty * 10}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE ABILITIES SECTION */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-bold uppercase tracking-wider text-amber-400">Yetenekler</h3>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Ability Tabs buttons */}
            <div className="lg:col-span-5 flex lg:flex-col flex-wrap gap-3">
              {abilities.map((ability) => {
                const isActive = activeAbility.id === ability.id;
                return (
                  <button
                    key={ability.id}
                    onClick={() => setActiveAbility(ability)}
                    className={`flex items-center gap-4 p-3.5 rounded-xl border text-left w-full transition-all duration-300 ${
                      isActive 
                        ? "bg-[#121224] border-amber-400 shadow-[0_0_15px_rgba(200,155,60,0.15)] text-white scale-102"
                        : "bg-[#0b0b14] border-white/5 hover:border-white/20 text-white/60 hover:text-white/90"
                    }`}
                  >
                    {/* Circle Icon wrapper with border glow */}
                    <div className={`relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${
                      isActive ? "border-amber-400 shadow-[0_0_8px_rgba(200,155,60,0.6)]" : "border-white/20"
                    }`}>
                      <Image
                        src={ability.icon}
                        alt={ability.name}
                        fill
                        unoptimized
                        sizes="48px"
                        className="object-cover scale-105"
                      />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-widest text-amber-400/90 mb-0.5">
                        {ability.key}
                      </div>
                      <div className="text-sm font-semibold truncate max-w-[200px] lg:max-w-xs">
                        {ability.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Ability Details Panel */}
            <div className="lg:col-span-7 h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeAbility.id}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#0e0e1a]/85 backdrop-blur-xl border border-white/5 rounded-2xl p-6 md:p-8 min-h-[340px] shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/2 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start h-full">
                    {/* Left Panel: Text Info */}
                    <div className="md:col-span-7 flex flex-col justify-between h-full min-h-[240px]">
                      <div>
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                              {activeAbility.key} Yeteneği
                            </span>
                            <h4 className="font-extrabold text-xl text-white mt-1">
                              {activeAbility.name}
                            </h4>
                          </div>
                          <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-white/80 tracking-widest uppercase">
                            {activeAbility.key}
                          </span>
                        </div>

                        {/* Stats Line */}
                        {(activeAbility.cooldown || activeAbility.cost) && (
                          <div className="flex flex-wrap items-center gap-4 text-xs text-white/60 mb-4">
                            {activeAbility.cooldown && activeAbility.cooldown !== "0" && (
                              <div className="flex items-center gap-1.5">
                                <Clock size={12} className="text-amber-400/80" />
                                <span><strong className="text-white/80">Bekleme:</strong> {activeAbility.cooldown}sn</span>
                              </div>
                            )}
                            {activeAbility.cost && activeAbility.cost !== "0" && (
                              <div className="flex items-center gap-1.5">
                                <Sparkles size={12} className="text-amber-400/80" />
                                <span><strong className="text-white/80">Bedel:</strong> {activeAbility.cost} {champion.partype}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Description */}
                        <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line font-light">
                          {activeAbility.description}
                        </p>
                      </div>

                      {/* Official Champion Site Link */}
                      <div className="mt-6 pt-4 border-t border-white/5">
                        <Link
                          href={`https://www.leagueoflegends.com/tr-tr/champions/${champion.id.toLowerCase()}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-amber-400/80 hover:text-amber-400 hover:underline uppercase transition-colors"
                        >
                          <span>Resmi Şampiyon Sayfası</span>
                          <ExternalLink size={12} />
                        </Link>
                      </div>
                    </div>

                    {/* Right Panel: Video Preview */}
                    <div className="md:col-span-5 w-full flex flex-col gap-2">
                      <div 
                        onClick={() => !videoError && setIsExpandedVideo(true)}
                        className={`relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/45 shadow-inner flex items-center justify-center group ${
                          !videoError ? "cursor-zoom-in hover:border-amber-400/35 transition-all duration-300" : ""
                        }`}
                      >
                        {!videoError ? (
                          <>
                            <video
                              key={activeAbility.id} // Force reload video component
                              autoPlay
                              loop
                              muted
                              playsInline
                              onError={() => setVideoError(true)}
                              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                            >
                              <source src={webmVideoUrl} type="video/webm" />
                              <source src={mp4VideoUrl} type="video/mp4" />
                              Tarayıcınız video oynatmayı desteklemiyor.
                            </video>
                            
                            {/* Hover overlay with expand hint */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-opacity duration-300">
                              <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-lg backdrop-blur-sm">
                                <ExternalLink size={16} />
                              </div>
                              <span className="text-[9px] font-black uppercase tracking-widest text-amber-400">Videoyu Büyüt</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-4 text-center text-white/40 gap-2">
                            <Sparkles size={20} className="opacity-40" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Video Önizlemesi Yok</span>
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-white/40 italic text-center">
                        Büyütmek için videoya tıklayın
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* MOBALYTICS DYNAMIC LIVE REHBER PANELİ */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <h3 className="text-2xl font-bold uppercase tracking-wider text-amber-400">
                Oynanış & Alışveriş Rehberi (Mobalytics Canlı)
              </h3>
              <div className="hidden lg:block flex-1 h-px bg-white/10" />
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              {/* Koridor Seçici (Lane Selector) */}
              {champion.lanes.length > 1 && (
                <div className="flex bg-[#0b0b14] p-1 rounded-xl border border-white/5 shadow-inner">
                  {champion.lanes.map((lane) => {
                    const isSelected = activeLane === lane;
                    return (
                      <button
                        key={lane}
                        onClick={() => setActiveLane(lane)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border ${
                          isSelected 
                            ? "bg-amber-400/10 text-amber-400 border-amber-400/20"
                            : "text-white/50 hover:text-white/90 border-transparent"
                        }`}
                      >
                        {laneTranslations[lane] || lane}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {isBuildLoading ? (
            /* Premium Loading State */
            <div className="relative w-full min-h-[500px] bg-[#0e0e1a]/85 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl p-8 flex flex-col justify-center items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-amber-400/10 border-t-amber-400 animate-spin" />
              <p className="text-xs text-white/50 font-semibold uppercase tracking-wider">Mobalytics Canlı Build Verileri Yükleniyor...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* LEFT COLUMN: Skill Order and Runes */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Skill Max Order Card */}
                <div className="bg-[#0e0e1a]/85 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-white/5">
                      <TrendingUp size={18} className="text-amber-400" />
                      <h4 className="text-sm font-bold uppercase tracking-wider text-white">Yetenek Geliştirme Sırası</h4>
                    </div>
                    
                    {/* Skill sequence icons */}
                    <div className="flex items-center gap-4 mb-5">
                      {skillSequence.map((skill, index) => (
                        <div key={skill.id} className="flex items-center gap-3">
                          {index > 0 && <span className="text-amber-400/50 text-base font-bold">➔</span>}
                          <div className="flex flex-col items-center gap-1.5">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-amber-400/40 shadow-[0_0_12px_rgba(200,155,60,0.1)]">
                              <Image
                                src={skill.icon}
                                alt={skill.name}
                                fill
                                unoptimized
                                sizes="48px"
                                className="object-cover scale-102"
                              />
                              {/* Key indicator inside icon */}
                              <div className="absolute bottom-0 right-0 bg-black/80 px-1 py-0.5 text-[9px] font-black rounded-tl-md text-amber-400">
                                {skill.key}
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{skill.key} Max</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="text-white/70 text-sm leading-relaxed font-light">
                      {resolvedBuild.skillMaxReason}
                    </p>

                    {/* Level by level skill leveling grid */}
                    {resolvedBuild.skillOrder && (
                      <div className="mt-6 pt-5 border-t border-white/5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">Seviye Seviye Yetenek Dağılımı</p>
                        <SkillOrderGrid skillOrder={resolvedBuild.skillOrder} abilities={abilities} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Recommended Rune Card */}
                <div className="bg-[#0e0e1a]/85 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
                  <div className="flex items-center gap-4 pb-3 border-b border-white/5">
                    <div className="relative w-14 h-14 flex-shrink-0 bg-black/55 rounded-xl border border-white/10 flex items-center justify-center p-1.5">
                      <Image
                        src={`https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/${resolvedBuild.runes.icon}`}
                        alt={resolvedBuild.runes.name}
                        width={44}
                        height={44}
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">Tavsiye Edilen Anahtar Rün (Canlı)</span>
                      <h4 className="text-lg font-extrabold text-white mt-0.5">{resolvedBuild.runes.name}</h4>
                      <span className="text-xs text-white/50 font-medium">Yol: {resolvedBuild.runes.path}</span>
                    </div>
                  </div>
                  {resolvedBuild.runes.description && (
                    <div className="text-xs text-white/70 leading-relaxed font-light">
                      <p className="font-semibold text-amber-400/90 mb-1">Rün Açıklaması ve Etkisi:</p>
                      <p>{resolvedBuild.runes.description}</p>
                    </div>
                  )}
                </div>

              </div>

              {/* RIGHT COLUMN: Shop Items Guide */}
              <div className="lg:col-span-7 bg-[#0e0e1a]/85 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl flex flex-col justify-between gap-6">
                
                <div>
                  <div className="flex items-center gap-2.5 pb-3 border-b border-white/5 mb-6">
                    <Coins size={18} className="text-amber-400" />
                    <h4 className="text-sm font-bold uppercase tracking-wider text-white">Alışveriş / Eşya Rehberi</h4>
                  </div>

                  {/* Item Lists Grid */}
                  <div className="flex flex-col gap-6">
                    
                    {/* Starting Items */}
                    {resolvedBuild.starters.filter(Boolean).length > 0 && (
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">Başlangıç Eşyaları</h5>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {resolvedBuild.starters.filter(Boolean).map((item, idx) => (
                            <ShopItemCard
                              key={idx}
                              item={item}
                              itemsMap={itemsMap}
                              championVersion={champion.version}
                              onItemClick={setActiveItem}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Core Items */}
                    {resolvedBuild.core.filter(Boolean).length > 0 && (
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">Çekirdek Eşyalar (Core)</h5>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {resolvedBuild.core.filter(Boolean).map((item, idx) => (
                            <ShopItemCard
                              key={idx}
                              item={item}
                              itemsMap={itemsMap}
                              championVersion={champion.version}
                              onItemClick={setActiveItem}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Situational Items */}
                    {resolvedBuild.situational.filter(Boolean).length > 0 && (
                      <div>
                        <h5 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">Durumsal / Son Eşyalar</h5>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {resolvedBuild.situational.filter(Boolean).map((item, idx) => (
                            <ShopItemCard
                              key={idx}
                              item={item}
                              itemsMap={itemsMap}
                              championVersion={champion.version}
                              onItemClick={setActiveItem}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* Beginner Purchase Priority Guide */}
                <div className="mt-4 pt-6 border-t border-white/5 flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-amber-400">
                    <BookOpen size={16} />
                    <h5 className="text-xs font-bold uppercase tracking-wider">Yeni Başlayanlar İçin Satın Alma Önceliği (Nasıl Alınır?)</h5>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] leading-relaxed">
                    <div className="flex gap-2.5 items-start">
                      <div className="px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 font-bold border border-amber-400/20 text-[9px] mt-0.5">1</div>
                      <div>
                        <p className="font-bold text-white/90">Oyun Başlangıcı</p>
                        <p className="text-white/50 font-light mt-0.5">Minyonlar gelmeden önce ilk altınlarınızla <strong>Başlangıç Eşyalarını</strong> alın ve koridora çıkın.</p>
                      </div>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <div className="px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 font-bold border border-amber-400/20 text-[9px] mt-0.5">2</div>
                      <div>
                        <p className="font-bold text-white/90">İlk Geri Dönüş (Recall)</p>
                        <p className="text-white/50 font-light mt-0.5">1000-1300 altın biriktirince üsse dönüp <strong>Çekirdek Eşyaların alt parçalarını</strong> (örn: Tanrıça Asası, Kayıp Cilt) ve temel ayakkabıyı alın.</p>
                      </div>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <div className="px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 font-bold border border-amber-400/20 text-[9px] mt-0.5">3</div>
                      <div>
                        <p className="font-bold text-white/90">Çekirdek Güç (Core)</p>
                        <p className="text-white/50 font-light mt-0.5">Listelenen <strong>3 Çekirdek Eşyayı</strong> sırasıyla tamamlayın. Bu eşyalar bittiğinde şampiyonunuz asıl gücüne kavuşacaktır.</p>
                      </div>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <div className="px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 font-bold border border-amber-400/20 text-[9px] mt-0.5">4</div>
                      <div>
                        <p className="font-bold text-white/90">Geç Oyun (Durumsal Seçimler)</p>
                        <p className="text-white/50 font-light mt-0.5">Çekirdek eşyalardan sonra, oyundaki duruma göre (örn: hayatta kalmak için <strong>Zhonya</strong>, rakipleri eritmek için <strong>Rabadon</strong>) <strong>Durumsal Eşyalar</strong> arasından seçim yapın.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}
        </section>

        {/* GAMEPLAY STRATEGIES & TIPS SECTION */}
        {(champion.tips.ally.length > 0 || champion.tips.enemy.length > 0) && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ally Tips */}
            {champion.tips.ally.length > 0 && (
              <div className="bg-[#0e0e1a]/55 border border-white/5 p-6 md:p-8 rounded-2xl shadow-xl flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#43a047]/10 rounded-lg text-[#66bb6a] border border-[#43a047]/20">
                    <Shield size={18} />
                  </div>
                  <h4 className="text-lg font-bold text-white uppercase tracking-wider">Nasıl Oynanır?</h4>
                </div>
                <ul className="flex flex-col gap-3">
                  {champion.tips.ally.map((tip, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-white/70 leading-relaxed font-light items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#66bb6a] mt-2 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Enemy Tips */}
            {champion.tips.enemy.length > 0 && (
              <div className="bg-[#0e0e1a]/55 border border-white/5 p-6 md:p-8 rounded-2xl shadow-xl flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#e53935]/10 rounded-lg text-[#ef5350] border border-[#e53935]/20">
                    <Sword size={18} />
                  </div>
                  <h4 className="text-lg font-bold text-white uppercase tracking-wider">Nasıl Karşı Oynanır?</h4>
                </div>
                <ul className="flex flex-col gap-3">
                  {champion.tips.enemy.map((tip, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-white/70 leading-relaxed font-light items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ef5350] mt-2 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

      </div>

      {/* Item Details Modal */}
      <AnimatePresence>
        {activeItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveItem(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm cursor-pointer"
            />
            
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative z-10 w-full max-w-md bg-[#0b0b14]/98 border border-amber-400/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(200,155,60,0.15)] text-left overflow-hidden flex flex-col"
            >
              {/* Decorative background glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
              
              {/* Close button */}
              <button 
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 text-white/40 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div className="flex items-center gap-4 pb-4 border-b border-white/10 mb-4">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                  <Image
                    src={activeItem.imgSrc}
                    alt={activeItem.name}
                    fill
                    unoptimized
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-amber-400">{activeItem.name}</h4>
                  <span className="text-xs text-amber-400 font-bold flex items-center gap-1.5 mt-1">
                    <Coins size={14} /> {activeItem.cost} Altın
                  </span>
                </div>
              </div>

              {/* Body (Description) */}
              <div 
                className="text-xs text-white/70 leading-relaxed max-h-72 overflow-y-auto scrollbar-thin pr-1 space-y-2 font-light"
                dangerouslySetInnerHTML={{ __html: cleanItemDescription(activeItem.description) }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Expanded Video Preview Modal */}
      <AnimatePresence>
        {isExpandedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpandedVideo(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative z-10 w-full max-w-4xl bg-black border border-amber-400/30 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(200,155,60,0.25)] flex flex-col"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsExpandedVideo(false)}
                className="absolute top-4 right-4 z-20 text-white/50 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Video Player */}
              <div className="relative w-full aspect-video bg-black flex items-center justify-center">
                <video
                  autoPlay
                  loop
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                >
                  <source src={webmVideoUrl} type="video/webm" />
                  <source src={mp4VideoUrl} type="video/mp4" />
                  Tarayıcınız video oynatmayı desteklemiyor.
                </video>
              </div>

              {/* Caption */}
              <div className="p-4 bg-[#0e0e1a] border-t border-white/10 flex justify-between items-center text-left">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                    {champion.name} ➔ {activeAbility.key} Yeteneği
                  </span>
                  <h4 className="font-extrabold text-base text-white mt-0.5">{activeAbility.name}</h4>
                </div>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-white/80 tracking-widest uppercase">
                  {activeAbility.key}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

