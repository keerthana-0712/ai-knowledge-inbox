import React from 'react';
import { 
  Inbox, 
  FileText, 
  Globe, 
  Database, 
  Cpu, 
  Plus, 
  ChevronRight,
  Info
} from 'lucide-react';
import { Item, HealthInfo } from '../types';

interface SidebarProps {
  items: Item[];
  activeFilter: 'all' | 'note' | 'url';
  onFilterChange: (filter: 'all' | 'note' | 'url') => void;
  onOpenAddNote: () => void;
  onOpenAddUrl: () => void;
  onSelectItem: (item: Item) => void;
  onOpenHealth: () => void;
  healthInfo: HealthInfo | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeFilter,
  onFilterChange,
  onOpenAddNote,
  onOpenAddUrl,
  onSelectItem,
  onOpenHealth,
  healthInfo,
}) => {
  const noteCount = items.filter((i) => i.source_type === 'note').length;
  const urlCount = items.filter((i) => i.source_type === 'url').length;
  const totalChunks = items.reduce((acc, i) => acc + (i.chunk_count || 0), 0);

  return (
    <aside className="w-72 bg-[#090b10] border-r border-white/5 flex flex-col h-screen select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Inbox className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-100 tracking-tight flex items-center gap-1.5">
              AI Knowledge Inbox
            </h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
              Turium AI Assessment
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-3 grid grid-cols-2 gap-2 border-b border-white/5">
        <button
          onClick={onOpenAddNote}
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-200 rounded-md border border-white/10 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-indigo-400" />
          <span>Note</span>
        </button>
        <button
          onClick={onOpenAddUrl}
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-200 rounded-md border border-white/10 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-cyan-400" />
          <span>URL</span>
        </button>
      </div>

      {/* Navigation & Filters */}
      <div className="p-3 space-y-1">
        <div className="text-[10px] uppercase font-semibold text-slate-500 px-2 py-1 tracking-wider">
          Views
        </div>
        <button
          onClick={() => onFilterChange('all')}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md font-medium transition-colors ${
            activeFilter === 'all'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-2">
            <Inbox className="w-3.5 h-3.5" />
            <span>All Knowledge</span>
          </div>
          <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-slate-400">
            {items.length}
          </span>
        </button>

        <button
          onClick={() => onFilterChange('note')}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md font-medium transition-colors ${
            activeFilter === 'note'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Notes</span>
          </div>
          <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-slate-400">
            {noteCount}
          </span>
        </button>

        <button
          onClick={() => onFilterChange('url')}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md font-medium transition-colors ${
            activeFilter === 'url'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Saved URLs</span>
          </div>
          <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-slate-400">
            {urlCount}
          </span>
        </button>
      </div>

      {/* Saved Knowledge List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <div className="text-[10px] uppercase font-semibold text-slate-500 px-2 py-1 tracking-wider">
          Saved Items ({items.length})
        </div>
        {items.length === 0 ? (
          <div className="px-2 py-4 text-center">
            <p className="text-xs text-slate-500">No saved items yet.</p>
            <p className="text-[10px] text-slate-600 mt-1">Add a note or URL to begin.</p>
          </div>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="w-full text-left px-2.5 py-2 rounded-md hover:bg-white/5 group transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2 min-w-0 pr-2">
                {item.source_type === 'note' ? (
                  <FileText className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                ) : (
                  <Globe className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                )}
                <span className="text-xs text-slate-300 truncate group-hover:text-white">
                  {item.title}
                </span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </button>
          ))
        )}
      </div>

      {/* System Stats & Architecture Info */}
      <div className="p-3 border-t border-white/5 bg-[#07080c] space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>SQLite Vectors</span>
          </span>
          <span className="font-mono text-slate-300">{totalChunks} chunks</span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Engine</span>
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-300 font-mono">
            {healthInfo?.ai.provider === 'openai' ? 'OpenAI GPT' : 'Local RAG'}
          </span>
        </div>

        <button
          onClick={onOpenHealth}
          className="w-full mt-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded transition-colors"
        >
          <Info className="w-3 h-3" />
          <span>Architecture & Health</span>
        </button>
      </div>
    </aside>
  );
};
