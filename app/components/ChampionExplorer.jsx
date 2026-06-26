"use client";

import { useState, useMemo, useDeferredValue, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown, Users, Wifi, Gamepad2 } from "lucide-react";
import Link from "next/link";
import SearchBar from "./SearchBar";
import ChampionCard from "./ChampionCard";
import FilterPanel from "./FilterPanel";
import { getDifficultyCategory, difficultyLabels } from "../lib/champions";

export default function ChampionExplorer({ champions, version }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLanes, setActiveLanes] = useState([]);
  const [activeTags, setActiveTags] = useState([]);
  const [activeDifficulty, setActiveDifficulty] = useState(null);
  const [visibleCount, setVisibleCount] = useState(24);

  // Defer the search value so typing stays responsive
  const deferredSearch = useDeferredValue(searchQuery);
  const isStale = deferredSearch !== searchQuery;

  // Reset pagination when search query or filters change
  useEffect(() => {
    setVisibleCount(24);
  }, [deferredSearch, activeLanes, activeTags, activeDifficulty]);

  const filteredChampions = useMemo(() => {
    return champions.filter((champion) => {
      // Search filter
      const q = deferredSearch.toLowerCase();
      const matchesSearch =
        !q ||
        champion.name.toLowerCase().includes(q) ||
        champion.title.toLowerCase().includes(q);

      // Lane filter
      const matchesLane =
        activeLanes.length === 0 ||
        activeLanes.some((lane) => champion.lanes.includes(lane));

      // Tag/Role filter
      const matchesTags =
        activeTags.length === 0 ||
        activeTags.some((tag) => champion.tags.includes(tag));

      // Difficulty filter
      let matchesDifficulty = true;
      if (activeDifficulty) {
        const range = difficultyLabels[activeDifficulty]?.range;
        if (range) {
          matchesDifficulty =
            champion.difficulty >= range[0] && champion.difficulty <= range[1];
        }
      }

      return matchesSearch && matchesLane && matchesTags && matchesDifficulty;
    });
  }, [deferredSearch, activeLanes, activeTags, activeDifficulty, champions]);

  const resetFilters = useCallback(() => {
    setActiveLanes([]);
    setActiveTags([]);
    setActiveDifficulty(null);
    setSearchQuery("");
  }, []);

  return (
    <main className="relative min-h-screen px-4 sm:px-6 lg:px-8 pb-20">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full" 
          style={{ background: "radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%)" }}
        />
        <div 
          className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full" 
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.04) 0%, transparent 70%)" }}
        />
        <div 
          className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full" 
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.03) 0%, transparent 70%)" }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 pt-12 sm:pt-20 pb-6 sm:pb-8">
        {/* Logo / Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-8 sm:mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <motion.div
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
            >
              <Crown size={36} className="text-amber-400" strokeWidth={1.5} />
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                Blitz
              </span>
              <span className="text-white/80 ml-2">v2</span>
            </h1>
          </div>
          <p className="text-white/30 text-sm sm:text-base max-w-md mx-auto">
            Tüm League of Legends şampiyonlarını keşfet
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-2 text-white/15 text-[11px] mb-6">
            <Wifi size={10} />
            <span>Data Dragon v{version}</span>
            <span className="mx-1">•</span>
            <span>{champions.length} şampiyon</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center"
          >
            <Link
              href="/match-setup"
              className="group relative overflow-hidden isolate flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 hover:from-amber-500/20 hover:to-yellow-500/20 border border-amber-500/30 hover:border-amber-400/60 text-amber-400 font-bold text-sm tracking-wide shadow-[0_0_15px_rgba(245,158,11,0.05)] hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all duration-300 cursor-pointer"
            >
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-out" />
              <Gamepad2 size={16} className="group-hover:scale-110 transition-transform duration-300" />
              <span>MAÇ BAŞLAT (CANLI YARDIMCI)</span>
              <span className="relative flex h-2 w-2 ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Search Bar */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {/* Filter Panel */}
        <FilterPanel
          activeLanes={activeLanes}
          onLanesChange={setActiveLanes}
          activeTags={activeTags}
          onTagsChange={setActiveTags}
          activeDifficulty={activeDifficulty}
          onDifficultyChange={setActiveDifficulty}
          totalCount={champions.length}
          filteredCount={filteredChampions.length}
          onReset={resetFilters}
        />

        {/* Results counter */}
        <div className="flex items-center justify-center gap-2 mt-5 text-white/20 text-sm">
          <Users size={14} />
          <span>
            <span className="text-amber-400/50 font-medium">
              {filteredChampions.length}
            </span>{" "}
            / {champions.length} şampiyon
            {deferredSearch && (
              <span className="text-amber-400/40 ml-1">
                &quot;{deferredSearch}&quot;
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Champions Grid */}
      <div
        className="relative z-10 max-w-7xl mx-auto transition-opacity duration-200"
        style={{ opacity: isStale ? 0.7 : 1 }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
          {filteredChampions.slice(0, visibleCount).map((champion) => (
            <ChampionCard key={champion.id} champion={champion} />
          ))}
        </div>

        {filteredChampions.length > visibleCount && (
          <div className="flex justify-center mt-12 relative z-20">
            <button
              onClick={() => setVisibleCount((prev) => prev + 24)}
              className="group relative px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 hover:from-amber-500/20 hover:to-yellow-500/20 border border-amber-500/20 hover:border-amber-400/50 text-amber-400 font-bold text-sm tracking-wide transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.02)]"
            >
              Daha Fazla Göster
            </button>
          </div>
        )}

        {/* Empty state */}
        {filteredChampions.length === 0 && (
          <div className="text-center py-24 animate-fade-in">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white/40">
              Şampiyon bulunamadı
            </h3>
            <p className="text-white/20 mt-2 text-sm">
              Farklı bir arama terimi veya filtre kombinasyonu deneyin
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400/70 text-sm cursor-pointer hover:bg-amber-500/15 transition-colors"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
