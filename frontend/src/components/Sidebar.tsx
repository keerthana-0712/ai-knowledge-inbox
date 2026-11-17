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
    <aside className="w-64 bg-[#f8f7f4] border-r border-[#e8e4dd] flex flex-col h-screen select-none">
      {/* Brand Header */}
      <div className="h-14 px-4 border-b border-[#e8e4dd] flex items-center justify-between bg-white">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[#f5f0ff] border border-[#d9c6ff] flex items-center justify-center">
            <TuriumLogo size={16} />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#111114] tracking-tight">
              Knowledge Inbox
            </div>
            <p className="text-[10px] text-[#78757d] font-medium tracking-wide">
              Turium Enterprise AI
            </p>
          </div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="p-3 grid grid-cols-2 gap-2 border-b border-[#e8e4dd] bg-[#f8f7f4]">
        <button
          onClick={onOpenAddNote}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#6100ff] hover:bg-[#5200db] text-white rounded-md transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Note</span>
        </button>
        <button
          onClick={onOpenAddUrl}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white hover:bg-[#f0eee6] text-[#111114] rounded-md border border-[#ddd9d1] transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 text-[#555359]" />
          <span>Link</span>
        </button>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="px-3 pt-3 pb-2 space-y-0.5">
        <div className="text-[10px] uppercase font-semibold text-[#78757d] px-2 py-1 tracking-wider">
          Library
        </div>
        <button
          onClick={() => onFilterChange('all')}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md font-medium transition-colors ${
            activeFilter === 'all'
              ? 'bg-white text-[#111114] border border-[#ddd9d1] shadow-card font-semibold'
              : 'text-[#39383c] hover:text-[#111114] hover:bg-[#f0eee6]'
          }`}
        >
          <div className="flex items-center gap-2">
            <FolderKanban className="w-3.5 h-3.5 text-[#555359]" />
            <span>All Documents</span>
          </div>
          <span className="text-[10px] font-mono text-[#78757d] bg-[#f0eee6] px-1.5 py-0.2 rounded">
            {items.length}
          </span>
        </button>

        <button
          onClick={() => onFilterChange('note')}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md font-medium transition-colors ${
            activeFilter === 'note'
              ? 'bg-white text-[#111114] border border-[#ddd9d1] shadow-card font-semibold'
              : 'text-[#39383c] hover:text-[#111114] hover:bg-[#f0eee6]'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-[#6100ff]" />
            <span>Notes</span>
          </div>
          <span className="text-[10px] font-mono text-[#78757d] bg-[#f0eee6] px-1.5 py-0.2 rounded">
            {noteCount}
          </span>
        </button>

        <button
          onClick={() => onFilterChange('url')}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md font-medium transition-colors ${
            activeFilter === 'url'
              ? 'bg-white text-[#111114] border border-[#ddd9d1] shadow-card font-semibold'
              : 'text-[#39383c] hover:text-[#111114] hover:bg-[#f0eee6]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>Web Links</span>
          </div>
          <span className="text-[10px] font-mono text-[#78757d] bg-[#f0eee6] px-1.5 py-0.2 rounded">
            {urlCount}
          </span>
        </button>
      </div>

      {/* Saved Items Explorer */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5">
        <div className="text-[10px] uppercase font-semibold text-[#78757d] px-2 py-1 tracking-wider">
          Recent Items
        </div>
        {items.length === 0 ? (
          <div className="px-2 py-6 text-center">
            <p className="text-xs text-[#78757d]">No items indexed.</p>
          </div>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-[#f0eee6] group transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2 min-w-0 pr-1">
                {item.source_type === 'note' ? (
                  <FileText className="w-3 h-3 text-[#6100ff] flex-shrink-0" />
                ) : (
                  <Globe className="w-3 h-3 text-[#0284c7] flex-shrink-0" />
                )}
                <span className="text-xs text-[#39383c] truncate group-hover:text-[#111114] font-medium">
                  {item.title}
                </span>
              </div>
              <ChevronRight className="w-3 h-3 text-[#78757d] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </button>
          ))
        )}
      </div>

      {/* System Status Footer */}
      <div className="p-3 border-t border-[#e8e4dd] bg-white space-y-1.5 text-xs">
        <div className="flex items-center justify-between text-[11px] text-[#555359]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            <Database className="w-3 h-3 text-[#78757d]" />
            <span>SQLite Vectors</span>
          </span>
          <span className="font-mono text-[#111114] font-medium">{totalChunks} chunks</span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#555359]">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-[#78757d]" />
            <span>Model Engine</span>
          </span>
          <span className="text-[10px] font-mono text-[#6100ff] font-medium bg-[#f5f0ff] px-1.5 py-0.2 rounded border border-[#d9c6ff]">
            {healthInfo?.ai.provider === 'openai' ? 'OpenAI' : 'Local 256D'}
          </span>
        </div>

        <button
          onClick={onOpenHealth}
          className="w-full mt-1 flex items-center justify-center gap-1.5 py-1 text-[11px] text-[#555359] hover:text-[#111114] hover:bg-[#f8f7f4] rounded border border-transparent hover:border-[#e8e4dd] transition-colors"
        >
          <Settings2 className="w-3 h-3" />
          <span>System Information</span>
        </button>
      </div>
    </aside>
  );
};
