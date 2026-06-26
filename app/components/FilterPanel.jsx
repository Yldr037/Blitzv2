"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Sword,
  Wand2,
  Crosshair,
  Target,
  Shield,
  Heart,
  SlidersHorizontal,
  X,
  Map,
  Gauge,
  Tags,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import { useState, memo } from "react";
import { laneInfo, tagColors, difficultyLabels } from "../lib/champions";

// Lane icons
const laneIcons = {
  Top: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M3 3h7v2H5v14h2v-7h2v9H3V3zm12 18h-2V5h6v16h-4zm2-14h-2v12h2V7z" />
    </svg>
  ),
  Jungle: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  ),
  Mid: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M3 3h18v2H5v2l14 10v4H3v-2h14v-2L3 7V3z" />
    </svg>
  ),
  Bot: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M21 21H3v-7h2v5h14V5h-2V3h4v18zM7 3h2v16H3V3h4zm2 14H5V5h4v12z" />
    </svg>
  ),
  Support: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
};

// Role tag icons
const tagIcons = {
  Fighter: Sword,
  Mage: Wand2,
  Assassin: Crosshair,
  Marksman: Target,
  Tank: Shield,
  Support: Heart,
};

function FilterPanel({
  activeLanes,
  onLanesChange,
  activeTags,
  onTagsChange,
  activeDifficulty,
  onDifficultyChange,
  totalCount,
  filteredCount,
  onReset,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters =
    activeLanes.length > 0 || activeTags.length > 0 || activeDifficulty !== null;

  const toggleLane = (lane) => {
    if (activeLanes.includes(lane)) {
      onLanesChange(activeLanes.filter((l) => l !== lane));
    } else {
      onLanesChange([...activeLanes, lane]);
    }
  };

  const toggleTag = (tag) => {
    if (activeTags.includes(tag)) {
      onTagsChange(activeTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...activeTags, tag]);
    }
  };

  const toggleDifficulty = (diff) => {
    onDifficultyChange(activeDifficulty === diff ? null : diff);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full max-w-5xl mx-auto mt-6"
    >
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors cursor-pointer text-sm"
        >
          <SlidersHorizontal size={14} />
          <span className="font-medium">Filtreler</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={14} />
          </motion.div>
        </button>

        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-amber-400/60 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>Temizle</span>
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="bg-[rgba(18,18,30,0.6)] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-5 space-y-5">
              {/* Lane Filter */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Map size={13} className="text-white/30" />
                  <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                    Koridor
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(laneInfo).map(([lane, info]) => {
                    const isActive = activeLanes.includes(lane);
                    const LaneIcon = laneIcons[lane];

                    return (
                      <motion.button
                        key={lane}
                        onClick={() => toggleLane(lane)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                          flex items-center gap-1.5
                          px-3.5 py-2 rounded-xl
                          text-xs font-medium tracking-wide
                          border transition-all duration-300
                          cursor-pointer
                          ${
                            isActive
                              ? "border-white/20 text-white"
                              : "border-white/[0.06] text-white/35 hover:text-white/60 hover:border-white/10"
                          }
                        `}
                        style={{
                          background: isActive
                            ? `${info.color}18`
                            : "rgba(18, 18, 30, 0.4)",
                          ...(isActive && {
                            boxShadow: `0 0 15px ${info.color}12`,
                          }),
                        }}
                      >
                        <span
                          style={{ color: isActive ? info.color : undefined }}
                          className={!isActive ? "opacity-40" : ""}
                        >
                          <LaneIcon />
                        </span>
                        <span>{info.label}</span>
                        {isActive && (
                          <X size={10} className="ml-0.5 opacity-50" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/[0.04]" />

              {/* Role/Tag Filter */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Tags size={13} className="text-white/30" />
                  <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                    Sınıf
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(tagColors).map(([tag, color]) => {
                    const isActive = activeTags.includes(tag);
                    const Icon = tagIcons[tag];
                    const tagLabels = {
                      Fighter: "Dövüşçü",
                      Mage: "Büyücü",
                      Assassin: "Suikastçı",
                      Marksman: "Nişancı",
                      Tank: "Tank",
                      Support: "Destek",
                    };

                    return (
                      <motion.button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                          flex items-center gap-1.5
                          px-3.5 py-2 rounded-xl
                          text-xs font-medium tracking-wide
                          border transition-all duration-300
                          cursor-pointer
                          ${
                            isActive
                              ? "border-white/20 text-white"
                              : "border-white/[0.06] text-white/35 hover:text-white/60 hover:border-white/10"
                          }
                        `}
                        style={{
                          background: isActive
                            ? `${color}18`
                            : "rgba(18, 18, 30, 0.4)",
                          ...(isActive && {
                            boxShadow: `0 0 15px ${color}12`,
                          }),
                        }}
                      >
                        {Icon && (
                          <Icon
                            size={13}
                            style={{ color: isActive ? color : undefined }}
                            className={!isActive ? "opacity-40" : ""}
                          />
                        )}
                        <span>{tagLabels[tag] || tag}</span>
                        {isActive && (
                          <X size={10} className="ml-0.5 opacity-50" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/[0.04]" />

              {/* Difficulty Filter */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Gauge size={13} className="text-white/30" />
                  <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                    Zorluk
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(difficultyLabels).map(([key, info]) => {
                    const isActive = activeDifficulty === key;

                    return (
                      <motion.button
                        key={key}
                        onClick={() => toggleDifficulty(key)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                          flex items-center gap-2
                          px-3.5 py-2 rounded-xl
                          text-xs font-medium tracking-wide
                          border transition-all duration-300
                          cursor-pointer
                          ${
                            isActive
                              ? "border-white/20 text-white"
                              : "border-white/[0.06] text-white/35 hover:text-white/60 hover:border-white/10"
                          }
                        `}
                        style={{
                          background: isActive
                            ? `${info.color}18`
                            : "rgba(18, 18, 30, 0.4)",
                          ...(isActive && {
                            boxShadow: `0 0 15px ${info.color}12`,
                          }),
                        }}
                      >
                        {/* Difficulty dots */}
                        <div className="flex gap-0.5">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full transition-colors"
                              style={{
                                background:
                                  i < (key === "easy" ? 1 : key === "medium" ? 2 : 3)
                                    ? isActive
                                      ? info.color
                                      : "rgba(255,255,255,0.2)"
                                    : "rgba(255,255,255,0.06)",
                              }}
                            />
                          ))}
                        </div>
                        <span>{info.label}</span>
                        <span className="text-[10px] opacity-40">
                          ({info.range[0]}-{info.range[1]})
                        </span>
                        {isActive && (
                          <X size={10} className="ml-0.5 opacity-50" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default memo(FilterPanel);
