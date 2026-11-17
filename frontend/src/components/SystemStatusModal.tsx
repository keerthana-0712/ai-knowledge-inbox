import React from 'react';
import { X, Database, CheckCircle2 } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-xl bg-[#11141d] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0e1017]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">System Architecture & Health</h2>
              <p className="text-xs text-slate-400">Technical recruitment assignment verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Health Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-lg border border-white/5 bg-[#141722] space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-semibold text-slate-300">SQLite Database</span>
                <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>WAL Active</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Items: <span className="font-mono text-white">{healthInfo?.database.itemsCount ?? 0}</span> | 
                Chunks: <span className="font-mono text-white">{healthInfo?.database.chunksCount ?? 0}</span>
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-white/5 bg-[#141722] space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-semibold text-slate-300">AI Provider</span>
                <span className="text-indigo-400 font-mono text-[11px]">
                  {healthInfo?.ai.provider === 'openai' ? 'OpenAI Live' : 'Deterministic RAG'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {healthInfo?.ai.embeddingModel}
              </p>
            </div>
          </div>

          {/* Architecture Details */}
          <div className="space-y-3 pt-2">
            <h3 className="font-semibold uppercase tracking-wider text-slate-400 text-[11px]">
              Design & Architecture Specifications
            </h3>

            <div className="space-y-2 text-slate-300">
              <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1">
                <span className="font-semibold text-indigo-300">1. Vector Search via SQLite & Cosine Similarity</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Embeddings are stored in SQLite and evaluated with pure in-memory cosine similarity (dot product over normalized vectors). This completely avoids the operational overhead, latency, and costs of dedicated external vector databases for single-user scale.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1">
                <span className="font-semibold text-cyan-300">2. Paragraph-Aware Recursive Chunking</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Target size: ~600 characters with 100-character overlap. Prioritizes natural paragraph boundaries (\n\n) and sentence boundaries (.!?) to ensure discrete semantic coherence.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1">
                <span className="font-semibold text-emerald-300">3. SSRF-Protected Ingestion</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Webpage fetching rejects loopback (127.0.0.1, localhost), private IP subnets (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), and cloud metadata endpoints (169.254.169.254).
                </p>
              </div>

              <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1">
                <span className="font-semibold text-amber-300">4. Grounded Citations & Anti-Hallucination</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Answers are strictly bounded by retrieved context chunks with corresponding bracketed citation badges [1], [2]. If knowledge is absent, the system explicitly acknowledges lack of data.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-white/5 bg-[#0e1017]">
          <span className="text-[10px] text-slate-500 font-mono">Turium AI Technical Recruitment Assessment</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
