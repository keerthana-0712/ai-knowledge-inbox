import React from 'react';
import { Plus, Globe } from 'lucide-react';

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
  return (
    <div className="rounded-xl border border-[#e8e4dd] bg-white p-6 sm:p-7 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f5f0ff] border border-[#d9c6ff] text-[11px] font-semibold text-[#6100ff] tracking-wide uppercase">
            <span>Turium Knowledge Engine</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111114]">
            Your knowledge, one conversation away.
          </h1>

          <p className="text-xs sm:text-sm text-[#555359] leading-relaxed">
            Ingest notes and web links into your local vector database. Query your saved knowledge in plain English and retrieve answers strictly grounded with clickable citations.
          </p>

          <div className="flex items-center gap-3 pt-1 text-xs text-[#78757d]">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#f8f7f4] border border-[#e8e4dd] font-mono text-[11px] text-[#39383c]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6100ff]" />
              {itemCount} Saved {itemCount === 1 ? 'Item' : 'Items'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#f8f7f4] border border-[#e8e4dd] font-mono text-[11px] text-[#39383c]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {chunkCount} Vector Chunks
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            onClick={onAddNote}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6100ff] hover:bg-[#5200db] text-white text-xs font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Note</span>
          </button>

          <button
            onClick={onAddUrl}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-[#f8f7f4] text-[#111114] border border-[#ddd9d1] text-xs font-semibold transition-colors shadow-card"
          >
            <Globe className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>Add URL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
