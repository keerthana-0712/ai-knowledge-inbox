import React from 'react';
import { X, FileText, Globe, ExternalLink } from 'lucide-react';
import { Item } from '../types';
import { sanitizeDisplay } from '../utils/text';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div 
        className="w-full max-w-2xl bg-[#0e1017] border border-[#222636] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1c1f2b] bg-[#0a0c12]">
          <div className="flex items-center gap-2.5 min-w-0 pr-4">
            <div className={`p-1.5 rounded ${
              item.source_type === 'note' 
                ? 'bg-[#6100ff]/10 text-[#9d66ff] border border-[#6100ff]/20' 
                : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
            }`}>
              {item.source_type === 'note' ? (
                <FileText className="w-3.5 h-3.5" />
              ) : (
                <Globe className="w-3.5 h-3.5" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-semibold text-white truncate">{item.title}</h2>
              <div className="flex items-center gap-2 text-[11px] text-[#71717a] mt-0.5 font-mono">
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
            className="p-1 rounded text-[#71717a] hover:text-white hover:bg-[#1a1d28] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {item.source_url && (
            <div className="flex items-center justify-between p-2.5 rounded bg-[#131620] border border-[#202433] text-xs">
              <span className="text-[#a1a1aa] font-mono truncate mr-2">
                {item.source_url}
              </span>
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#38bdf8] hover:text-white transition-colors flex-shrink-0"
              >
                <span>Open URL</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium text-[#71717a] uppercase tracking-wider">
                Extracted Content
              </h3>
              <span className="text-[11px] font-mono text-[#52525b]">
                {item.raw_content.length} characters
              </span>
            </div>
            <div className="p-3.5 rounded bg-[#08090d] border border-[#181a24] text-xs text-[#d4d4d8] leading-relaxed font-sans whitespace-pre-wrap select-text">
              {sanitizeDisplay(item.raw_content)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-5 py-2.5 border-t border-[#1c1f2b] bg-[#0a0c12]">
          <button
            onClick={onClose}
            className="px-3.5 py-1 text-xs font-medium text-[#a1a1aa] hover:text-white bg-[#141722] hover:bg-[#1c2030] rounded border border-[#202433] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
