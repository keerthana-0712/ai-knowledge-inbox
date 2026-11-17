import React from 'react';
import { X, CheckCircle2, Server } from 'lucide-react';
import { HealthInfo } from '../types';

interface SystemStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  healthInfo: HealthInfo | null;
}

export const SystemStatusModal: React.FC<SystemStatusModalProps> = ({
  isOpen,
  onClose,
  healthInfo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg bg-white border border-[#e8e4dd] rounded-xl shadow-dropdown overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e4dd] bg-[#fcfbf9]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-[#f5f0ff] text-[#6100ff] border border-[#d9c6ff]">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#111114]">System Architecture & Health</h2>
              <p className="text-[11px] text-[#78757d]">Engine specifications and database statistics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#78757d] hover:text-[#111114] hover:bg-[#f0eee6] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Health Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-[#e8e4dd] bg-[#fcfbf9] space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-[#555359]">
                <span className="font-semibold text-[#111114]">Vector Database</span>
                <span className="flex items-center gap-1 text-emerald-700 font-mono text-[10px] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>SQLite WAL</span>
                </span>
              </div>
              <p className="text-[11px] text-[#555359]">
                Items: <span className="font-mono font-semibold text-[#111114]">{healthInfo?.database.itemsCount ?? 0}</span> | 
                Chunks: <span className="font-mono font-semibold text-[#111114]">{healthInfo?.database.chunksCount ?? 0}</span>
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-[#e8e4dd] bg-[#fcfbf9] space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-[#555359]">
                <span className="font-semibold text-[#111114]">AI Engine</span>
                <span className="text-[#6100ff] font-mono text-[10px] font-semibold bg-[#f5f0ff] px-1.5 py-0.2 rounded border border-[#d9c6ff]">
                  {healthInfo?.ai.provider === 'openai' ? 'OpenAI GPT-4o' : 'Local 256D'}
                </span>
              </div>
              <p className="text-[11px] text-[#555359] truncate font-mono">
                {healthInfo?.ai.embeddingModel}
              </p>
            </div>
          </div>

          {/* Architecture Specifications */}
          <div className="space-y-2 pt-1">
            <h3 className="font-bold uppercase tracking-wider text-[#78757d] text-[10px]">
              Engine Architecture Highlights
            </h3>

            <div className="space-y-2 text-[#39383c]">
              <div className="p-3 rounded-lg bg-[#f8f7f4] border border-[#e8e4dd] space-y-0.5">
                <span className="font-semibold text-[#6100ff] text-[11px]">1. Vector Search via SQLite & Cosine Similarity</span>
                <p className="text-[#555359] text-[11px] leading-relaxed">
                  Embeddings are stored in SQLite and evaluated with in-memory cosine similarity (dot product over normalized vectors), providing sub-millisecond retrieval without introducing external cloud vector infrastructure.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#f8f7f4] border border-[#e8e4dd] space-y-0.5">
                <span className="font-semibold text-[#0284c7] text-[11px]">2. Paragraph-Aware Recursive Chunking</span>
                <p className="text-[#555359] text-[11px] leading-relaxed">
                  Target size: ~600 characters with 100-character overlap. Prioritizes natural paragraph boundaries (\n\n) and sentence breaks for discrete semantic coherence.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#f8f7f4] border border-[#e8e4dd] space-y-0.5">
                <span className="font-semibold text-emerald-700 text-[11px]">3. SSRF-Protected Web Ingestion & Noise Stripping</span>
                <p className="text-[#555359] text-[11px] leading-relaxed">
                  Webpage fetching strictly validates target hostnames against loopback, private IPv4 subnets, and cloud instance metadata endpoints. Content extraction strips boilerplates, scripts, and navigation.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#f8f7f4] border border-[#e8e4dd] space-y-0.5">
                <span className="font-semibold text-[#b45309] text-[11px]">4. Anti-Hallucination Prompt Bounds</span>
                <p className="text-[#555359] text-[11px] leading-relaxed">
                  The generation engine is strictly bound to retrieved context. Answers cite corresponding source items using bracketed notation ([1], [2]) with interactive UI inspection.
                </p>
              </div>
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
