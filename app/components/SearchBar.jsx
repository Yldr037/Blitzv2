"use client";

import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";

function SearchBar({ value, onChange }) {
  const [localValue, setLocalValue] = useState(value);

  // Sync external changes (e.g., when filters are reset)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce parent state updates to prevent search input lag
  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(localValue);
    }, 150);

    return () => clearTimeout(handler);
  }, [localValue, onChange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-2xl mx-auto relative"
    >
      {/* Outer glow */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 blur-xl opacity-60 pointer-events-none" />

      <div className="relative">
        {/* Search icon */}
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-400/70 z-10">
          <Search size={22} strokeWidth={2.5} />
        </div>

        {/* Input */}
        <input
          id="champion-search"
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder="Şampiyon ara..."
          autoComplete="off"
          className="
            w-full h-16 pl-14 pr-14
            bg-[rgba(18,18,30,0.85)] backdrop-blur-xl
            border border-amber-500/20
            rounded-2xl
            text-lg text-white placeholder:text-white/30
            outline-none
            transition-all duration-300
            focus:border-amber-400/50
            focus:shadow-[0_0_40px_rgba(200,155,60,0.15)]
            hover:border-amber-400/30
          "
        />

        {/* Sparkle icon */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-amber-400/40">
          <Sparkles size={18} />
        </div>
      </div>
    </motion.div>
  );
}

export default memo(SearchBar);
