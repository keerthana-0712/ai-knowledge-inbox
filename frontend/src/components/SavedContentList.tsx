import React, { useState } from 'react';
import { 
  FileText, 
  Globe, 
  Trash2, 
  Eye, 
  Search, 
  ExternalLink, 
  Layers, 
  Calendar,
  Loader2,
  FolderOpen
} from 'lucide-react';
import { Item } from '../types';
import { sanitizeDisplay } from '../utils/text';

interface SavedContentListProps {
  items: Item[];
  activeFilter: 'all' | 'note' | 'url';
  onFilterChange: (filter: 'all' | 'note' | 'url') => void;
  onViewItem: (item: Item) => void;
  onDeleteItem: (id: string) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

export const SavedContentList: React.FC<SavedContentListProps> = ({
  items,
  activeFilter,
  onFilterChange,
  onViewItem,
  onDeleteItem,
  isLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredItems = items
    .filter((item) => {
      if (activeFilter === 'all') return true;
      return item.source_type === activeFilter;
    })
    .filter((item) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.raw_content.toLowerCase().includes(q) ||
        (item.source_url && item.source_url.toLowerCase().includes(q))
      );
    });

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Delete "${title}" and all its indexed vector chunks?`)) {
      setDeletingId(id);
      try {
        await onDeleteItem(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-[#1c1f2b]">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">
            Saved Knowledge
          </h2>
          <span className="text-[11px] bg-[#141722] px-2 py-0.5 rounded text-[#71717a] font-mono border border-[#202433]">
            {filteredItems.length}
          </span>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#71717a] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 text-xs bg-[#0d0f15] border border-[#202433] rounded-md text-white placeholder-[#52525b] focus:outline-none focus:border-[#6100ff] w-40 sm:w-52"
            />
          </div>

          {/* Type Tabs */}
          <div className="flex items-center bg-[#0d0f15] p-0.5 rounded-md border border-[#202433] text-xs">
            <button
              onClick={() => onFilterChange('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeFilter === 'all'
                  ? 'bg-[#1e2230] text-white font-medium'
                  : 'text-[#71717a] hover:text-[#d4d4d8]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onFilterChange('note')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeFilter === 'note'
                  ? 'bg-[#1e2230] text-white font-medium'
                  : 'text-[#71717a] hover:text-[#d4d4d8]'
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => onFilterChange('url')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeFilter === 'url'
                  ? 'bg-[#1e2230] text-white font-medium'
                  : 'text-[#71717a] hover:text-[#d4d4d8]'
              }`}
            >
              Links
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Items */}
      {isLoading ? (
        <div className="p-8 text-center space-y-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#8b3dff] mx-auto" />
          <p className="text-xs text-[#71717a]">Loading saved items...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-10 rounded-lg border border-dashed border-[#202433] text-center space-y-1.5 bg-[#08090d]">
          <FolderOpen className="w-6 h-6 text-[#52525b] mx-auto" />
          <h3 className="text-xs font-medium text-[#a1a1aa]">No items found</h3>
          <p className="text-[11px] text-[#52525b]">
            {searchQuery
              ? `No items matching "${searchQuery}".`
              : 'Add your first note or URL to start building your index.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {filteredItems.map((item) => {
            const isDeleting = deletingId === item.id;

            return (
              <div
                key={item.id}
                className="group flex flex-col justify-between p-3.5 rounded-lg border border-[#1e222f] bg-[#0c0e14] hover:bg-[#10121b] hover:border-[#272b3b] transition-colors"
              >
                <div className="space-y-2">
                  {/* Title & Type Icon */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {item.source_type === 'note' ? (
                        <div className="p-1 rounded bg-[#6100ff]/10 text-[#9d66ff] border border-[#6100ff]/20 flex-shrink-0">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="p-1 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 flex-shrink-0">
                          <Globe className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <h4 className="text-xs font-medium text-white truncate group-hover:text-[#a855f7] transition-colors">
                        {item.title}
                      </h4>
                    </div>

                    {item.source_url && (
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#52525b] hover:text-[#38bdf8] transition-colors flex-shrink-0"
                        title="Open external link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {/* Sanitized Text Preview */}
                  <p className="text-xs text-[#8e929f] line-clamp-2 leading-relaxed">
                    {sanitizeDisplay(item.raw_content)}
                  </p>
                </div>

                {/* Footer Meta */}
                <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-[#181a24] text-[11px] text-[#52525b]">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-mono text-[#71717a]">
                      <Layers className="w-3 h-3 text-[#71717a]" />
                      <span>{item.chunk_count} {item.chunk_count === 1 ? 'chunk' : 'chunks'}</span>
                    </span>

                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(item.created_at)}</span>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onViewItem(item)}
                      className="p-1 rounded text-[#71717a] hover:text-white hover:bg-[#1a1d28] transition-colors"
                      title="Inspect full text"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      disabled={isDeleting}
                      className="p-1 rounded text-[#71717a] hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                      title="Delete item"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
