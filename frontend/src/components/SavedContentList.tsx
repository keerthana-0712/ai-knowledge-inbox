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
    <div className="space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e8e4dd]">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#111114]">
            Saved Knowledge
          </h2>
          <span className="text-[11px] bg-[#f0eee6] px-2 py-0.5 rounded-full text-[#555359] font-mono border border-[#e4e0d7] font-semibold">
            {filteredItems.length}
          </span>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#78757d] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-[#fcfbf9] border border-[#ddd9d1] rounded-md text-[#111114] placeholder-[#a7a5aa] focus:outline-none focus:border-[#6100ff] focus:bg-white w-40 sm:w-52 transition-all shadow-xs"
            />
          </div>

          {/* Type Tabs */}
          <div className="flex items-center bg-[#f0eee6] p-0.5 rounded-lg border border-[#e8e4dd] text-xs">
            <button
              onClick={() => onFilterChange('all')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeFilter === 'all'
                  ? 'bg-white text-[#111114] font-semibold shadow-card'
                  : 'text-[#555359] hover:text-[#111114]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onFilterChange('note')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeFilter === 'note'
                  ? 'bg-white text-[#111114] font-semibold shadow-card'
                  : 'text-[#555359] hover:text-[#111114]'
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => onFilterChange('url')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeFilter === 'url'
                  ? 'bg-white text-[#111114] font-semibold shadow-card'
                  : 'text-[#555359] hover:text-[#111114]'
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
          <Loader2 className="w-5 h-5 animate-spin text-[#6100ff] mx-auto" />
          <p className="text-xs text-[#78757d]">Loading saved items...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-10 rounded-xl border border-dashed border-[#ddd9d1] text-center space-y-2 bg-[#fcfbf9]">
          <FolderOpen className="w-7 h-7 text-[#78757d] mx-auto" />
          <h3 className="text-xs font-semibold text-[#111114]">No items found</h3>
          <p className="text-xs text-[#78757d]">
            {searchQuery
              ? `No items matching "${searchQuery}".`
              : 'Add your first note or URL to start building your knowledge base.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredItems.map((item) => {
            const isDeleting = deletingId === item.id;

            return (
              <div
                key={item.id}
                className="group flex flex-col justify-between p-4 rounded-xl border border-[#e8e4dd] bg-white hover:border-[#ddd9d1] hover:shadow-card-hover transition-all shadow-card"
              >
                <div className="space-y-2.5">
                  {/* Title & Type Icon */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {item.source_type === 'note' ? (
                        <div className="p-1.5 rounded-md bg-[#f5f0ff] text-[#6100ff] border border-[#d9c6ff] flex-shrink-0">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="p-1.5 rounded-md bg-sky-50 text-sky-600 border border-sky-200 flex-shrink-0">
                          <Globe className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <h4 className="text-xs font-semibold text-[#111114] truncate group-hover:text-[#6100ff] transition-colors">
                        {item.title}
                      </h4>
                    </div>

                    {item.source_url && (
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#78757d] hover:text-[#0284c7] transition-colors flex-shrink-0"
                        title="Open external link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {/* Sanitized Text Preview */}
                  <p className="text-xs text-[#555359] line-clamp-2 leading-relaxed">
                    {sanitizeDisplay(item.raw_content)}
                  </p>
                </div>

                {/* Footer Meta */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#f0eee6] text-[11px] text-[#78757d]">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-mono text-[#555359]">
                      <Layers className="w-3 h-3 text-[#78757d]" />
                      <span>{item.chunk_count} {item.chunk_count === 1 ? 'chunk' : 'chunks'}</span>
                    </span>

                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#78757d]" />
                      <span>{formatDate(item.created_at)}</span>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onViewItem(item)}
                      className="p-1.5 rounded text-[#78757d] hover:text-[#111114] hover:bg-[#f0eee6] transition-colors"
                      title="Inspect full text"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      disabled={isDeleting}
                      className="p-1.5 rounded text-[#78757d] hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
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
