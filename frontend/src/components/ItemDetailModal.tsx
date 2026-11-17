import React from 'react';
import { X, FileText, Globe, Layers, ExternalLink } from 'lucide-react';
import { Item } from '../types';

interface ItemDetailModalProps {
  item: Item | null;
  onClose: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const formatDate = (isoStr: string) => {
    try {
      return new Date(isoStr).toLocaleString();
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-[#11141d] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0e1017]">
          <div className="flex items-center gap-2.5 min-w-0 pr-4">
            <div className={`p-2 rounded-lg ${
              item.source_type === 'note' 
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
            }`}>
              {item.source_type === 'note' ? (
                <FileText className="w-4 h-4" />
              ) : (
                <Globe className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-white truncate">{item.title}</h2>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5 font-mono">
                <span>{item.source_type.toUpperCase()}</span>
                <span>•</span>
                <span>{item.chunk_count} Chunks</span>
                <span>•</span>
                <span>{formatDate(item.created_at)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {item.source_url && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-xs">
              <span className="text-cyan-300 font-mono truncate mr-2">
                {item.source_url}
              </span>
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-200 transition-colors flex-shrink-0"
              >
                <span>Visit Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Raw Extracted Content
              </h3>
              <span className="text-[11px] font-mono text-slate-500">
                {item.raw_content.length} characters
              </span>
            </div>
            <div className="p-4 rounded-lg bg-black/30 border border-white/5 text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap select-text">
              {item.raw_content}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10 text-xs text-indigo-300/90 space-y-1">
            <div className="flex items-center gap-1.5 font-medium">
              <Layers className="w-3.5 h-3.5" />
              <span>Storage & Vector Indexing Architecture</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              This content is segmented into {item.chunk_count} separate semantic chunks in SQLite, each 
              with its corresponding vector embedding generated and ready for real-time cosine similarity search.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-white/5 bg-[#0e1017]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
