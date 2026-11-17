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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div 
        className="w-full max-w-lg bg-[#0e1017] border border-[#222636] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1c1f2b] bg-[#0a0c12]">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-[#6100ff]/10 text-[#9d66ff] border border-[#6100ff]/20">
              <Server className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-white">System Architecture & Health</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#71717a] hover:text-white hover:bg-[#1a1d28] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs">
          {/* Health Summary Cards */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded border border-[#1e222f] bg-[#0c0e14] space-y-1">
              <div className="flex items-center justify-between text-[#71717a]">
                <span className="font-medium text-[#d4d4d8]">Database</span>
                <span className="flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>SQLite WAL</span>
                </span>
              </div>
              <p className="text-[11px] text-[#71717a]">
                Items: <span className="font-mono text-white">{healthInfo?.database.itemsCount ?? 0}</span> | 
                Chunks: <span className="font-mono text-white">{healthInfo?.database.chunksCount ?? 0}</span>
              </p>
            </div>

            <div className="p-3 rounded border border-[#1e222f] bg-[#0c0e14] space-y-1">
              <div className="flex items-center justify-between text-[#71717a]">
                <span className="font-medium text-[#d4d4d8]">AI Engine</span>
                <span className="text-[#8b3dff] font-mono text-[10px]">
                  {healthInfo?.ai.provider === 'openai' ? 'OpenAI GPT-4o' : 'Local Vectorizer'}
                </span>
              </div>
              <p className="text-[11px] text-[#71717a] truncate font-mono">
                {healthInfo?.ai.embeddingModel}
              </p>
            </div>
          </div>

          {/* Architecture Specifications */}
          <div className="space-y-2 pt-1">
            <h3 className="font-medium uppercase tracking-wider text-[#71717a] text-[10px]">
              Core Pipeline Specifications
            </h3>

            <div className="space-y-1.5 text-[#d4d4d8]">
              <div className="p-2.5 rounded bg-[#08090d] border border-[#181a24] space-y-0.5">
                <span className="font-medium text-[#c084fc] text-[11px]">1. Vector Search via SQLite & Cosine Similarity</span>
                <p className="text-[#71717a] text-[11px] leading-relaxed">
                  Embeddings are stored in SQLite and evaluated with in-memory cosine similarity (dot product over normalized vectors), providing low-latency retrieval without external vector infrastructure.
                </p>
              </div>

              <div className="p-2.5 rounded bg-[#08090d] border border-[#181a24] space-y-0.5">
                <span className="font-medium text-sky-400 text-[11px]">2. Paragraph-Aware Recursive Chunking</span>
                <p className="text-[#71717a] text-[11px] leading-relaxed">
                  Target size: ~600 characters with 100-character overlap. Prioritizes natural paragraph boundaries (\n\n) and sentence breaks (.!?) for discrete semantic coherence.
                </p>
              </div>

              <div className="p-2.5 rounded bg-[#08090d] border border-[#181a24] space-y-0.5">
                <span className="font-medium text-emerald-400 text-[11px]">3. SSRF-Protected Web Ingestion</span>
                <p className="text-[#71717a] text-[11px] leading-relaxed">
                  Webpage fetching strictly validates target hostnames and blocks loopback, private IPv4 subnets, and cloud instance metadata endpoints.
                </p>
              </div>

              <div className="p-2.5 rounded bg-[#08090d] border border-[#181a24] space-y-0.5">
                <span className="font-medium text-amber-400 text-[11px]">4. Grounded Citations & Anti-Hallucination</span>
                <p className="text-[#71717a] text-[11px] leading-relaxed">
                  LLM responses are strictly bounded by retrieved context chunks with corresponding bracketed citation badges [1], [2]. If knowledge is absent, the system explicitly indicates insufficient context.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-[#1c1f2b] bg-[#0a0c12]">
          <span className="text-[10px] text-[#52525b] font-mono">Turium AI Architecture</span>
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
