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
    <div className="rounded-lg border border-[#1e222f] bg-[#0c0e14] p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="space-y-1.5 max-w-xl">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
            Knowledge Inbox
          </h1>
          <p className="text-xs sm:text-sm text-[#8e929f] leading-relaxed">
            Ingest text notes and web links into your workspace, index their contents into semantic vectors, 
            and retrieve grounded answers with direct source citations.
          </p>
          <div className="flex items-center gap-3 pt-1 text-xs text-[#5a5e6d] font-mono">
            <span>{itemCount} Saved Items</span>
            <span>•</span>
            <span>{chunkCount} Indexed Chunks</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            onClick={onAddNote}
            className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-[#6100ff] hover:bg-[#5200db] text-white text-xs font-medium transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Note</span>
          </button>

          <button
            onClick={onAddUrl}
            className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-[#131620] hover:bg-[#1a1e2b] text-[#e4e4e7] border border-[#242838] text-xs font-medium transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Add URL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
