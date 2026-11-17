import React from 'react';
import { 
  FileText, 
  Globe, 
  Database, 
  Cpu, 
  Plus, 
  ChevronRight,
  Settings2,
  FolderKanban
} from 'lucide-react';
import { Item, HealthInfo } from '../types';
import { TuriumLogo } from './TuriumLogo';

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
    <aside className="w-64 bg-[#08090d] border-r border-[#191c26] flex flex-col h-screen select-none">
      {/* Brand Header */}
      <div className="h-14 px-4 border-b border-[#191c26] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[#6100ff]/10 border border-[#6100ff]/25 flex items-center justify-center">
            <TuriumLogo size={16} />
          </div>
          <div>
            <div className="text-xs font-semibold text-white tracking-tight flex items-center gap-1.5">
              <span>Knowledge Inbox</span>
            </div>
            <p className="text-[10px] text-[#71717a] font-medium tracking-wide">
              Turium Enterprise AI
            </p>
          </div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="p-3 grid grid-cols-2 gap-2 border-b border-[#191c26]">
        <button
          onClick={onOpenAddNote}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#6100ff] hover:bg-[#5200db] text-white rounded-md transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Note</span>
        </button>
        <button
          onClick={onOpenAddUrl}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#141722] hover:bg-[#1a1e2d] text-[#e4e4e7] rounded-md border border-[#232736] transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-[#a1a1aa]" />
          <span>Link</span>
        </button>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="px-3 pt-3 pb-2 space-y-0.5">
        <div className="text-[10px] uppercase font-semibold text-[#52525b] px-2 py-1 tracking-wider">
          Library
        </div>
        <button
          onClick={() => onFilterChange('all')}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md font-medium transition-colors ${
            activeFilter === 'all'
              ? 'bg-[#181a24] text-white border border-[#2c3042]'
              : 'text-[#a1a1aa] hover:text-white hover:bg-[#12141c]'
          }`}
        >
          <div className="flex items-center gap-2">
            <FolderKanban className="w-3.5 h-3.5 text-[#71717a]" />
            <span>All Documents</span>
          </div>
          <span className="text-[10px] font-mono text-[#71717a]">
            {items.length}
          </span>
        </button>

        <button
          onClick={() => onFilterChange('note')}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md font-medium transition-colors ${
            activeFilter === 'note'
              ? 'bg-[#181a24] text-white border border-[#2c3042]'
              : 'text-[#a1a1aa] hover:text-white hover:bg-[#12141c]'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-[#9d66ff]" />
            <span>Notes</span>
          </div>
          <span className="text-[10px] font-mono text-[#71717a]">
            {noteCount}
          </span>
        </button>

        <button
          onClick={() => onFilterChange('url')}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md font-medium transition-colors ${
            activeFilter === 'url'
              ? 'bg-[#181a24] text-white border border-[#2c3042]'
              : 'text-[#a1a1aa] hover:text-white hover:bg-[#12141c]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Web Links</span>
          </div>
          <span className="text-[10px] font-mono text-[#71717a]">
            {urlCount}
          </span>
        </button>
      </div>

      {/* Saved Items Explorer */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5">
        <div className="text-[10px] uppercase font-semibold text-[#52525b] px-2 py-1 tracking-wider">
          Recent Items
        </div>
        {items.length === 0 ? (
          <div className="px-2 py-6 text-center">
            <p className="text-xs text-[#52525b]">No items indexed.</p>
          </div>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-[#12141c] group transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2 min-w-0 pr-1">
                {item.source_type === 'note' ? (
                  <FileText className="w-3 h-3 text-[#9d66ff] flex-shrink-0" />
                ) : (
                  <Globe className="w-3 h-3 text-[#38bdf8] flex-shrink-0" />
                )}
                <span className="text-xs text-[#d4d4d8] truncate group-hover:text-white">
                  {item.title}
                </span>
              </div>
              <ChevronRight className="w-3 h-3 text-[#52525b] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </button>
          ))
        )}
      </div>

      {/* System Status Footer */}
      <div className="p-3 border-t border-[#191c26] bg-[#050608] space-y-1.5 text-xs">
        <div className="flex items-center justify-between text-[11px] text-[#71717a]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            <Database className="w-3 h-3 text-[#71717a]" />
            <span>SQLite Vectors</span>
          </span>
          <span className="font-mono text-[#a1a1aa]">{totalChunks} chunks</span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#71717a]">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-[#71717a]" />
            <span>Model Engine</span>
          </span>
          <span className="text-[10px] font-mono text-[#d4d4d8]">
            {healthInfo?.ai.provider === 'openai' ? 'OpenAI' : 'Local'}
          </span>
        </div>

        <button
          onClick={onOpenHealth}
          className="w-full mt-1 flex items-center justify-center gap-1.5 py-1 text-[11px] text-[#71717a] hover:text-[#d4d4d8] hover:bg-[#12141c] rounded transition-colors"
        >
          <Settings2 className="w-3 h-3" />
          <span>System Information</span>
        </button>
      </div>
    </aside>
  );
};
