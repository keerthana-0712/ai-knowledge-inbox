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
    if (window.confirm(`Are you sure you want to delete "${title}"? This will also remove all its indexed vector chunks.`)) {
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
        year: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Saved Knowledge
          </h2>
          <span className="text-xs bg-white/5 px-2 py-0.5 rounded text-slate-400 font-mono">
            {filteredItems.length}
          </span>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex items-center gap-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter saved items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-44 sm:w-56"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center bg-white/5 p-0.5 rounded-lg border border-white/10 text-xs">
            <button
              onClick={() => onFilterChange('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeFilter === 'all'
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onFilterChange('note')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeFilter === 'note'
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => onFilterChange('url')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeFilter === 'url'
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              URLs
            </button>
          </div>
        </div>
      </div>

      {/* Items List */}
      {isLoading ? (
        <div className="p-12 text-center space-y-3">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-400 mx-auto" />
          <p className="text-xs text-slate-400">Loading your knowledge base...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-12 rounded-xl border border-dashed border-white/10 text-center space-y-2 bg-[#0e1017]">
          <FolderOpen className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-medium text-slate-300">No knowledge items found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? `No items matching "${searchQuery}". Try a different filter.`
              : 'Add your first note or URL using the buttons above to build your vector knowledge base.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredItems.map((item) => {
            const isDeleting = deletingId === item.id;

            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between p-4 rounded-xl border border-white/5 bg-[#12151f]/80 hover:bg-[#151926] hover:border-white/10 transition-all shadow-md"
              >
                <div className="space-y-2.5">
                  {/* Item Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {item.source_type === 'note' ? (
                        <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex-shrink-0">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="p-1.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex-shrink-0">
                          <Globe className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <h4 className="text-xs font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                        {item.title}
                      </h4>
                    </div>

                    {/* Source URL if applicable */}
                    {item.source_url && (
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-cyan-400 transition-colors flex-shrink-0"
                        title="Open external source"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {/* Content Preview */}
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {sanitizeDisplay(item.raw_content)}
                  </p>
                </div>

                {/* Footer Meta & Actions */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5 text-[11px] text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-mono text-slate-400">
                      <Layers className="w-3 h-3 text-indigo-400" />
                      <span>{item.chunk_count} {item.chunk_count === 1 ? 'chunk' : 'chunks'}</span>
                    </span>

                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{formatDate(item.created_at)}</span>
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onViewItem(item)}
                      className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors"
                      title="Inspect full text & chunks"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      disabled={isDeleting}
                      className="p-1.5 rounded hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
                      title="Delete item and chunks"
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
