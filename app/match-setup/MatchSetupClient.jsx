"use client";

import { useState, useMemo, useEffect, useDeferredValue } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  Gamepad2, 
  Search, 
  X, 
  Sword, 
  Compass, 
  Flame, 
  Shield, 
  Heart, 
  Plus, 
  HelpCircle,
  AlertCircle
} from "lucide-react";

const laneDetails = [
  { id: "Top", label: "Üst Koridor", color: "from-red-500/20 to-red-600/5", borderColor: "border-red-500/30", icon: Sword },
  { id: "Jungle", label: "Orman", color: "from-emerald-500/20 to-emerald-600/5", borderColor: "border-emerald-500/30", icon: Compass },
  { id: "Mid", label: "Orta Koridor", color: "from-blue-500/20 to-blue-600/5", borderColor: "border-blue-500/30", icon: Flame },
  { id: "Bot", label: "Alt Koridor (ADC)", color: "from-amber-500/20 to-amber-600/5", borderColor: "border-amber-500/30", icon: Shield },
  { id: "Support", label: "Destek", color: "from-purple-500/20 to-purple-600/5", borderColor: "border-purple-500/30", icon: Heart },
];

export default function MatchSetupClient({ champions, version }) {
  const router = useRouter();

  // Setup state
  const [myChampion, setMyChampion] = useState(null);
  const [myRole, setMyRole] = useState("");
  const [enemies, setEnemies] = useState([null, null, null, null, null]);

  // Modal control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState(null); // 'me' or 0, 1, 2, 3, 4 for enemy indices
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Filtered champions in modal
  const filteredChampions = useMemo(() => {
    const q = deferredSearchQuery.toLowerCase().trim();
    if (!q) return champions;
    return champions.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q)
    );
  }, [champions, deferredSearchQuery]);

  // Open modal for a specific slot
  const openSelector = (slot) => {
    setActiveSlot(slot);
    setSearchQuery("");
    setIsModalOpen(true);
  };

  // Select champion for the active slot
  const selectChampion = (champ) => {
    if (activeSlot === "me") {
      setMyChampion(champ);
      // Auto-suggest lane if mapping exists
      if (champ.lanes && champ.lanes.length > 0) {
        setMyRole(champ.lanes[0]);
      }
    } else {
      const updated = [...enemies];
      updated[activeSlot] = champ;
      setEnemies(updated);
    }
    setIsModalOpen(false);
  };

  // Clear slot
  const clearSlot = (slot, e) => {
    e.stopPropagation();
    if (slot === "me") {
      setMyChampion(null);
      setMyRole("");
    } else {
      const updated = [...enemies];
      updated[slot] = null;
      setEnemies(updated);
    }
  };

  // Form validation
  const isValid = useMemo(() => {
    return myChampion !== null && myRole !== "" && enemies.every((e) => e !== null);
  }, [myChampion, myRole, enemies]);

  // Get missing items list
  const missingRequirements = useMemo(() => {
    const missing = [];
    if (!myChampion) missing.push("Şampiyonunuz");
    if (!myRole) missing.push("Koridorunuz");
    const emptyEnemies = enemies.filter(e => e === null).length;
    if (emptyEnemies > 0) missing.push(`${emptyEnemies} Rakip Şampiyon`);
    return missing;
  }, [myChampion, myRole, enemies]);

  // Start Match! Navigate with query string
  const handleStartMatch = () => {
    if (!isValid) return;
    const params = new URLSearchParams();
    params.set("myChamp", myChampion.id);
    params.set("myRole", myRole);
    enemies.forEach((enemy, idx) => {
      params.set(`e${idx + 1}`, enemy.id);
    });
    router.push(`/live-match?${params.toString()}`);
  };

  return (
    <main className="relative min-h-screen bg-[#030308] text-white px-4 sm:px-6 lg:px-8 py-10 overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-amber-500/[0.02] blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/[0.02] blur-[130px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group text-sm font-semibold"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Ana Sayfaya Dön
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/2 border border-white/5 text-[11px] text-white/40">
            <span>DDragon v{version}</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4"
          >
            <Gamepad2 size={32} />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
            CANLI MAÇ YARDIMCISI KURULUMU
          </h1>
          <p className="text-white/40 text-sm mt-2 max-w-xl mx-auto">
            Kendi şampiyonunuzu, koridorunuzu ve 5 rakip şampiyonu seçerek ikinci ekranınız için özel hazırlanmış canlı analiz ekranını başlatın.
          </p>
        </div>

        {/* Selection Interface */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* PLAYER CHAMPION SELECTION (Left - 5 columns) */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <h2 className="text-lg font-bold text-white/80 flex items-center gap-2 border-b border-white/5 pb-2">
              <span className="w-1.5 h-4 rounded bg-amber-400" />
              Sizin Seçiminiz
            </h2>

            {/* Select Slot */}
            <div 
              onClick={() => openSelector("me")}
              className={`group relative h-72 rounded-2xl border cursor-pointer overflow-hidden transition-all duration-500 flex flex-col items-center justify-center bg-gradient-to-b ${
                myChampion 
                  ? "border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]" 
                  : "border-white/5 bg-[#0a0a12] hover:border-amber-500/30"
              }`}
            >
              {myChampion ? (
                <>
                  <Image 
                    src={myChampion.splash} 
                    alt={myChampion.name}
                    fill
                    priority
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.4]"
                  />
                  <button 
                    onClick={(e) => clearSlot("me", e)}
                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 border border-white/10 hover:border-white/30 flex items-center justify-center text-white/60 hover:text-white transition-all cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-left">
                    <p className="text-xs font-bold tracking-widest text-amber-400 uppercase mb-1">
                      {myRole ? laneDetails.find(l => l.id === myRole)?.label : "Koridor Seçilmedi"}
                    </p>
                    <h3 className="text-2xl font-black text-white leading-tight">
                      {myChampion.name}
                    </h3>
                    <p className="text-xs text-white/50 capitalize font-medium">
                      {myChampion.title}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-center p-6">
                  <div className="w-12 h-12 rounded-full border border-dashed border-white/10 group-hover:border-amber-400/40 flex items-center justify-center text-white/30 group-hover:text-amber-400 transition-colors mb-4">
                    <Plus size={20} />
                  </div>
                  <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">
                    ŞAMPİYON SEÇİN
                  </span>
                  <span className="text-[11px] text-white/20 mt-1 max-w-[200px]">
                    Canlı rehberini göreceğiniz kendi karakteriniz
                  </span>
                </div>
              )}
            </div>

            {/* Lane selection */}
            {myChampion && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3"
              >
                <p className="text-xs font-bold text-white/40 uppercase tracking-wider">Koridor / Rol Seçin:</p>
                <div className="grid grid-cols-5 gap-2">
                  {laneDetails.map((lane) => {
                    const Icon = lane.icon;
                    const isSelected = myRole === lane.id;
                    return (
                      <button
                        key={lane.id}
                        onClick={() => setMyRole(lane.id)}
                        className={`flex flex-col items-center justify-center py-2.5 rounded-xl border text-[10px] font-bold transition-all duration-300 cursor-pointer ${
                          isSelected 
                            ? `bg-gradient-to-b ${lane.color} border-amber-500/70 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.1)]`
                            : "bg-[#0b0b14] border-white/5 text-white/40 hover:border-white/15 hover:text-white/70"
                        }`}
                      >
                        <Icon size={16} className="mb-1" />
                        <span>{lane.id === "Bot" ? "ADC" : lane.id === "Jungle" ? "Orman" : lane.id === "Support" ? "Destek" : lane.id}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* ENEMY CHAMPIONS SELECTION (Right - 7 columns) */}
          <div className="md:col-span-7 flex flex-col gap-6">
            <h2 className="text-lg font-bold text-white/80 flex items-center gap-2 border-b border-white/5 pb-2">
              <span className="w-1.5 h-4 rounded bg-purple-500" />
              Rakip Takım (5 Şampiyon)
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-5 gap-3">
              {enemies.map((enemy, idx) => (
                <div
                  key={idx}
                  onClick={() => openSelector(idx)}
                  className={`group relative aspect-[3/4] rounded-xl border cursor-pointer overflow-hidden transition-all duration-300 flex flex-col items-center justify-center bg-[#07070d] ${
                    enemy
                      ? "border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                      : "border-white/5 hover:border-purple-500/20"
                  }`}
                >
                  {enemy ? (
                    <>
                      <Image
                        src={enemy.splash}
                        alt={enemy.name}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 30vw, 120px"
                        className="object-cover brightness-[0.5] group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        onClick={(e) => clearSlot(idx, e)}
                        className="absolute top-2 right-2 z-20 w-6 h-6 rounded-full bg-black/60 border border-white/10 hover:border-white/30 flex items-center justify-center text-white/60 hover:text-white transition-all cursor-pointer"
                      >
                        <X size={10} />
                      </button>
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 text-left">
                        <p className="text-[10px] font-bold text-purple-400 uppercase">RAKİP {idx + 1}</p>
                        <h4 className="text-xs font-bold text-white truncate">{enemy.name}</h4>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-center p-3">
                      <div className="w-8 h-8 rounded-full border border-dashed border-white/5 group-hover:border-purple-500/30 flex items-center justify-center text-white/20 group-hover:text-purple-400 transition-colors mb-2">
                        <Plus size={14} />
                      </div>
                      <span className="text-[9px] font-bold text-white/40 group-hover:text-white transition-colors">
                        RAKİP {idx + 1}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Helper Infobox */}
            <div className="p-4 rounded-xl bg-white/2 border border-white/5 flex gap-3 text-xs text-white/40 items-start">
              <HelpCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-white/60">Nasıl çalışır?</p>
                <p>Şampiyonları seçip maçı başlattığınızda sistem, rakip takımdaki hasar tiplerini (AP/AD), iyileştirme gücünü, kitle kontrolü (CC) ve suikastçı tehdidini analiz edecek. Kendi şampiyonunuza en uygun karşı durumsal savunma ve saldırı eşyalarını size özel gerekçelerle sunacaktır.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Start Button Panel */}
        <div className="flex flex-col items-center gap-4 pt-4 border-t border-white/5">
          <AnimatePresence mode="wait">
            {!isValid ? (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2 text-xs text-amber-500/80 bg-amber-500/5 px-4 py-2 rounded-lg border border-amber-500/10"
              >
                <AlertCircle size={14} />
                <span>Maçı başlatmak için eksikler: <span className="font-bold">{missingRequirements.join(", ")}</span></span>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <button
            onClick={handleStartMatch}
            disabled={!isValid}
            className={`group relative overflow-hidden isolate flex items-center gap-3 px-12 py-4 rounded-xl font-bold text-base tracking-wider transition-all duration-500 ${
              isValid
                ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-[0_0_30px_rgba(245,158,11,0.25)] hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] cursor-pointer active:scale-98"
                : "bg-white/5 border border-white/5 text-white/20 cursor-not-allowed"
            }`}
          >
            {isValid && (
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-out" />
            )}
            <Gamepad2 size={20} className={isValid ? "animate-pulse" : ""} />
            <span>MAÇI BAŞLAT</span>
          </button>
        </div>

      </div>

      {/* CHAMPION SELECTOR DIALOG (MODAL) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-2xl h-[80vh] flex flex-col rounded-2xl border border-white/10 bg-[#08080f] shadow-2xl overflow-hidden z-10"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Şampiyon ara... (örn: Ahri, Yasuo)"
                    autoFocus
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/2 border border-white/5 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none text-white text-sm font-semibold transition-all"
                  />
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-xl bg-white/2 hover:bg-white/5 border border-white/5 hover:border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Champions Grid */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/5 hover:scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {filteredChampions.map((champ) => {
                    // Check if already selected in another slot
                    const isMyselfSelected = myChampion?.id === champ.id;
                    const isEnemySelected = enemies.some(e => e?.id === champ.id);
                    const isAlreadySelected = isMyselfSelected || isEnemySelected;

                    return (
                      <button
                        key={champ.id}
                        disabled={isAlreadySelected}
                        onClick={() => selectChampion(champ)}
                        className={`group relative flex flex-col items-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          isAlreadySelected
                            ? "bg-white/1 border-transparent opacity-30 cursor-not-allowed"
                            : "bg-[#0b0b14] border-white/5 hover:border-amber-500/30 hover:bg-white/2"
                        }`}
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 mb-2">
                          <Image
                            src={champ.icon}
                            alt={champ.name}
                            fill
                            unoptimized
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <span className="text-xs font-bold text-white/80 group-hover:text-white truncate max-w-full">
                          {champ.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {filteredChampions.length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-sm text-white/30">Hiçbir şampiyon bulunamadı.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}
