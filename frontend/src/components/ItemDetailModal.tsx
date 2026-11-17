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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-white border border-[#e8e4dd] rounded-xl shadow-dropdown overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e4dd] bg-[#fcfbf9]">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className={`p-1.5 rounded-md ${
              item.source_type === 'note' 
                ? 'bg-[#f5f0ff] text-[#6100ff] border border-[#d9c6ff]' 
                : 'bg-sky-50 text-sky-600 border border-sky-200'
            }`}>
              {item.source_type === 'note' ? (
                <FileText className="w-4 h-4" />
              ) : (
                <Globe className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-[#111114] truncate">{item.title}</h2>
              <div className="flex items-center gap-2 text-[11px] text-[#78757d] mt-0.5 font-mono">
                <span className="uppercase font-semibold">{item.source_type}</span>
                <span>•</span>
                <span>{item.chunk_count} Chunks</span>
                <span>•</span>
                <span>{formatDate(item.created_at)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#78757d] hover:text-[#111114] hover:bg-[#f0eee6] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {item.source_url && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#f8f7f4] border border-[#e8e4dd] text-xs">
              <span className="text-[#555359] font-mono truncate mr-2">
                {item.source_url}
              </span>
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#0284c7] hover:underline transition-colors flex-shrink-0 font-medium"
              >
                <span>Open URL</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#111114] uppercase tracking-wider">
                Extracted Text Content
              </h3>
              <span className="text-[11px] font-mono text-[#78757d]">
                {item.raw_content.length} characters
              </span>
            </div>
            <div className="p-4 rounded-lg bg-[#fcfbf9] border border-[#e8e4dd] text-xs text-[#39383c] leading-relaxed font-sans whitespace-pre-wrap select-text">
              {sanitizeDisplay(item.raw_content)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-[#e8e4dd] bg-[#fcfbf9]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-[#555359] hover:text-[#111114] bg-white hover:bg-[#f8f7f4] rounded-lg border border-[#ddd9d1] transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
