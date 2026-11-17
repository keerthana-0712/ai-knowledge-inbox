import React, { useState, useEffect } from 'react';
import { TuriumLogo } from './TuriumLogo';
import { ArrowRight, Sparkles, Database, ShieldCheck, Zap } from 'lucide-react';

interface WelcomeIntroProps {
  onComplete: () => void;
  isOpen: boolean;
}

export const WelcomeIntro: React.FC<WelcomeIntroProps> = ({ onComplete, isOpen }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
      return;
    }

    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 3);
    }, 2400);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => {
      onComplete();
      setIsClosing(false);
    }, 450);
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xl transition-all duration-500 ${
        isClosing ? 'opacity-0 backdrop-blur-none pointer-events-none' : 'opacity-100'
      }`}
    >
      <div 
        className={`w-full max-w-xl bg-white/95 backdrop-blur-2xl border border-white/70 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] p-8 sm:p-10 relative overflow-hidden transition-all duration-500 transform ${
          isClosing ? 'scale-95 translate-y-4 opacity-0 filter blur-sm' : 'scale-100 translate-y-0 opacity-100'
        }`}
      >
        {/* Apple Intelligence Radiant Aura Background */}
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-gradient-to-br from-[#6100ff]/20 via-[#9d4edd]/15 to-transparent blur-3xl pointer-events-none animate-orb-pulse" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-gradient-to-tr from-[#3b82f6]/15 via-[#00d2ff]/10 to-transparent blur-3xl pointer-events-none animate-orb-pulse" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          {/* ChatGPT Intelligence Orb + Apple Hardware Prism */}
          <div className="relative flex items-center justify-center pt-2">
            {/* Concentric Breathing Halo Rings */}
            <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-[#6100ff]/25 to-[#00d2ff]/25 blur-xl animate-orb-pulse pointer-events-none" />
            <div className="absolute w-20 h-20 rounded-full border border-[#6100ff]/30 animate-ping opacity-40 pointer-events-none" />

            {/* Floating Glass Orb Container */}
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-b from-white/90 via-[#fcfaff] to-[#f2eaff] border border-white/80 shadow-[0_10px_25px_-5px_rgba(97,0,255,0.25)] flex items-center justify-center p-3 transition-transform duration-500 animate-orb-float">
              <TuriumLogo size={44} glow={true} />
            </div>
          </div>

          {/* Apple Kinetic Typography */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5f0ff] border border-[#d9c6ff] text-[11px] font-bold text-[#6100ff] tracking-[0.16em] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#6100ff] animate-pulse" />
              <span>Turium Enterprise AI</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display animate-text-shimmer leading-tight">
              Hello.
            </h1>

            <p className="text-sm sm:text-base text-[#39383c] max-w-md mx-auto leading-relaxed font-sans font-medium">
              Your personal AI knowledge inbox is ready. Ingest notes, extract URLs, and retrieve answers with grounded citations.
            </p>
          </div>

          {/* ChatGPT-Style Dynamic Capability Cards */}
          <div className="grid grid-cols-3 gap-2.5 w-full pt-1">
            <div className={`p-3 rounded-2xl border transition-all duration-300 text-left ${
              activeTab === 0 
                ? 'bg-gradient-to-b from-white to-[#fbf8ff] border-[#6100ff] shadow-md ring-2 ring-[#6100ff]/15 -translate-y-1' 
                : 'bg-white/60 border-[#e8e4dd] hover:bg-white'
            }`}>
              <div className="w-7 h-7 rounded-lg bg-[#f5f0ff] text-[#6100ff] border border-[#d9c6ff] flex items-center justify-center mb-1.5">
                <Database className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-[11px] font-bold text-[#111114]">Vector SQLite</h4>
              <p className="text-[10px] text-[#78757d] leading-tight mt-0.5">Embeddings & Cosine Retrieval</p>
            </div>

            <div className={`p-3 rounded-2xl border transition-all duration-300 text-left ${
              activeTab === 1 
                ? 'bg-gradient-to-b from-white to-[#fbf8ff] border-[#6100ff] shadow-md ring-2 ring-[#6100ff]/15 -translate-y-1' 
                : 'bg-white/60 border-[#e8e4dd] hover:bg-white'
            }`}>
              <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center mb-1.5">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-[11px] font-bold text-[#111114]">Clean Scraping</h4>
              <p className="text-[10px] text-[#78757d] leading-tight mt-0.5">Noise, Script & Tag Stripping</p>
            </div>

            <div className={`p-3 rounded-2xl border transition-all duration-300 text-left ${
              activeTab === 2 
                ? 'bg-gradient-to-b from-white to-[#fbf8ff] border-[#6100ff] shadow-md ring-2 ring-[#6100ff]/15 -translate-y-1' 
                : 'bg-white/60 border-[#e8e4dd] hover:bg-white'
            }`}>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-[11px] font-bold text-[#111114]">Anti-Hallucination</h4>
              <p className="text-[10px] text-[#78757d] leading-tight mt-0.5">Clickable Grounded Citations</p>
            </div>
          </div>

          {/* Apple-Style Primary Action Capsule */}
          <div className="w-full pt-2 flex flex-col items-center gap-2.5">
            <button
              onClick={handleDismiss}
              className="group flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-2xl bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-bold tracking-tight shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(97,0,255,0.4)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.98]"
            >
              <span>Open Knowledge Workspace</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <span className="text-[11px] text-[#78757d] font-mono">Press anywhere to continue</span>
          </div>
        </div>
      </div>
    </div>
  );
};
