"use client";

import Link from "next/link";
import { memo } from "react";
import Image from "next/image";
import { tagColors, laneInfo, getDifficultyCategory, difficultyLabels } from "../lib/champions";

function ChampionCard({ champion }) {
  const glowColor = champion.color || "#c89b3c";
  const diffCat = getDifficultyCategory(champion.difficulty);
  const diffInfo = difficultyLabels[diffCat];

  return (
    <Link href={`/champion/${champion.id}`}>
      <div
        className="group relative cursor-pointer card-enter h-full"
        style={{ "--glow": glowColor }}
      >
      {/* Glow effect behind card - optimized radial gradient, no blur filter */}
      <div
        className="absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${glowColor}33 0%, ${glowColor}0a 45%, transparent 70%)`,
        }}
      />

      {/* Card body */}
      <div className="champion-card relative overflow-hidden rounded-2xl bg-[#12121e] border border-white/[0.06] group-hover:border-white/[0.12] transition-all duration-300 group-hover:-translate-y-3 group-hover:shadow-[0_8px_40px_var(--glow-shadow)]"
        style={{
          "--glow-shadow": `${glowColor}25`,
        }}
      >
        {/* Champion splash image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={champion.splash}
            alt={champion.name}
            fill
            unoptimized
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            loading="lazy"
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-110"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#12121e] via-[#12121e]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

          {/* Top colored accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            style={{
              background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`,
            }}
          />

          {/* Lane badges - top left */}
          {champion.lanes.length > 0 && (
            <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap gap-1">
              {champion.lanes.map((lane) => (
                <span
                  key={lane}
                  className="px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border border-white/10"
                  style={{
                    background: "rgba(18, 18, 30, 0.85)",
                    borderColor: `${laneInfo[lane]?.color || "#888"}30`,
                    color: laneInfo[lane]?.color || "#888",
                  }}
                >
                  {laneInfo[lane]?.label || lane}
                </span>
              ))}
            </div>
          )}

          {/* Role tags - top right */}
          <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1 items-end">
            {champion.tags.map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider border border-white/10"
                style={{
                  background: "rgba(18, 18, 30, 0.85)",
                  borderColor: `${tagColors[tag] || "#c89b3c"}30`,
                  color: tagColors[tag] || "#c89b3c",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Champion info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3.5 z-10">
            {/* Difficulty bar */}
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex gap-[3px]">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="w-[4px] h-[4px] rounded-full"
                    style={{
                      background:
                        i < champion.difficulty
                          ? diffInfo.color
                          : "rgba(255,255,255,0.08)",
                    }}
                  />
                ))}
              </div>
              <span
                className="text-[9px] font-medium tracking-wider"
                style={{ color: `${diffInfo.color}99` }}
              >
                {diffInfo.label}
              </span>
            </div>

            <h3 className="text-base font-bold text-white tracking-wide leading-tight">
              {champion.name}
            </h3>
            <p
              className="text-[11px] mt-0.5 font-medium tracking-wide opacity-60 group-hover:opacity-80 transition-opacity duration-300 line-clamp-1"
              style={{ color: glowColor }}
            >
              {champion.title}
            </p>
          </div>
        </div>
      </div>
      </div>
    </Link>
  );
}

export default memo(ChampionCard);
