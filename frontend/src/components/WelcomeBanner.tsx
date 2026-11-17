import React from 'react';
import { Plus, Globe, Sparkles } from 'lucide-react';

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
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-indigo-950/20 via-[#10131d] to-[#0c0e14] p-6 shadow-2xl">
      {/* Decorative accent glow */}
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Semantic Vector RAG Pipeline Active</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Your knowledge, one conversation away.
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed">
            Ingest text notes or website URLs into your private SQLite vector store. 
            Ask natural-language questions to retrieve relevant context with cosine similarity and 
            receive grounded AI answers backed by verifiable source citations.
          </p>

          <div className="flex items-center gap-4 pt-1 text-xs text-slate-500 font-mono">
            <span>{itemCount} Saved Items</span>
            <span>•</span>
            <span>{chunkCount} Indexed Chunks</span>
            <span>•</span>
            <span>Zero External Vector DB Overhead</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={onAddNote}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Note</span>
          </button>

          <button
            onClick={onAddUrl}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Add URL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
