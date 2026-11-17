import React from 'react';
import { Plus, Globe, Sparkles } from 'lucide-react';
import { TuriumLogo } from './TuriumLogo';

interface WelcomeBannerProps {
  onAddNote: () => void;
  onAddUrl: () => void;
  itemCount: number;
  chunkCount: number;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  onAddNote,
  onAddUrl,
  itemCount,
  chunkCount,
}) => {
  // Welcoming greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#e8e4dd] bg-gradient-to-br from-white via-white to-[#fbf9ff] p-6 sm:p-7 shadow-card transition-all duration-300 hover:shadow-card-hover animate-welcome-1">
      {/* Decorative ambient background blur */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#6100ff]/5 blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative z-10">
        <div className="space-y-2.5 max-w-xl">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f5f0ff] border border-[#d9c6ff] text-[10.5px] font-bold text-[#6100ff] tracking-wide uppercase">
              <Sparkles className="w-3 h-3 text-[#6100ff]" />
              <span>{getGreeting()} • Turium Intelligence</span>
            </div>
            <span className="text-[11px] text-[#78757d] font-mono">v2.4 Core</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#111114]">
            Your knowledge,{' '}
            <span className="bg-gradient-to-r from-[#111114] via-[#3a1a78] to-[#6100ff] bg-clip-text text-transparent">
              one conversation away.
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-[#555359] leading-relaxed">
            Ingest text notes and live website URLs into your local vector database. Ask natural-language questions and receive answers strictly verified with source citations.
          </p>

          <div className="flex items-center gap-3 pt-1 text-xs text-[#78757d]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f8f7f4] border border-[#e8e4dd] font-mono text-[11px] text-[#39383c] transition-colors hover:border-[#ddd9d1]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6100ff]" />
              {itemCount} Saved {itemCount === 1 ? 'Item' : 'Items'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f8f7f4] border border-[#e8e4dd] font-mono text-[11px] text-[#39383c] transition-colors hover:border-[#ddd9d1]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {chunkCount} Indexed Chunks
            </span>
          </div>
        </div>

        {/* Action Buttons & Brand Prism */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
          <div className="hidden lg:flex items-center justify-center p-2 rounded-xl bg-gradient-to-b from-white to-[#f7f2ff] border border-[#d9c6ff]/60 shadow-xs mr-2">
            <TuriumLogo size={36} glow={true} />
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onAddNote}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#6100ff] hover:bg-[#5200db] active:scale-98 text-white text-xs font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Note</span>
            </button>

            <button
              onClick={onAddUrl}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#f8f7f4] active:scale-98 text-[#111114] border border-[#ddd9d1] text-xs font-bold transition-all shadow-card hover:shadow hover:-translate-y-0.5"
            >
              <Globe className="w-3.5 h-3.5 text-[#0284c7]" />
              <span>Add URL</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
