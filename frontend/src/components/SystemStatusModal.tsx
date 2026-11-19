import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Server, Terminal, RefreshCw, Cpu, Database, Zap } from 'lucide-react';
import { HealthInfo } from '../types';
import { api } from '../services/api';

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
  const [activeTab, setActiveTab] = useState<'architecture' | 'logs'>('logs'); // Default to logs so user immediately sees Structured Logging
  const [logs, setLogs] = useState<Array<{ timestamp: string; level: string; message: string; meta?: any }>>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLogs = async () => {
    setIsRefreshing(true);
    try {
      const data = await api.getLogs();
      setLogs(data);
    } catch {
      // Fallback
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
      const interval = setInterval(fetchLogs, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="w-full max-w-2xl bg-white border border-[#e8e4dd] rounded-2xl shadow-dropdown overflow-hidden flex flex-col max-h-[88vh] animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e4dd] bg-[#fcfbf9]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#f5f0ff] text-[#6100ff] border border-[#d9c6ff]">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#111114]">System Diagnostics & Logging</h2>
              <p className="text-[11px] text-[#78757d]">Real-time structured telemetry & architecture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#78757d] hover:text-[#111114] hover:bg-[#f0eee6] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#e8e4dd] bg-[#fcfbf9]">
          <button
            onClick={() => setActiveTab('logs')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'border-[#6100ff] text-[#6100ff]'
                : 'border-transparent text-[#78757d] hover:text-[#111114]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Structured Logs ({logs.length})</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'border-[#6100ff] text-[#6100ff]'
                : 'border-transparent text-[#78757d] hover:text-[#111114]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Architecture & Specifications</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          
          {/* TAB 1: Real-Time Structured Logs Console */}
          {activeTab === 'logs' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#555359]">
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-[#111114] font-bold">Log Format:</span>
                  <code className="bg-[#f0eee6] px-1.5 py-0.5 rounded text-[10px] text-[#6100ff]">
                    [ISO-Timestamp] [Level] Message [Meta]
                  </code>
                </div>

                <button
                  onClick={fetchLogs}
                  disabled={isRefreshing}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#e8e4dd] text-[11px] font-semibold text-[#555359] hover:text-[#111114] hover:bg-[#f8f7f4] transition-all shadow-xs active:scale-95"
                >
                  <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-[#6100ff]' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {/* Terminal Dark Window for Structured Logs */}
              <div className="rounded-xl border border-neutral-800 bg-[#0d0d12] p-4 font-mono text-[11px] leading-relaxed text-neutral-300 shadow-inner max-h-[380px] overflow-y-auto space-y-1.5 select-text">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800/80 text-[10px] text-neutral-500 uppercase tracking-wider">
                  <span>Terminal Output • AI Knowledge Inbox Logger</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE TELEMETRY
                  </span>
                </div>

                {logs.length === 0 ? (
                  <div className="text-neutral-500 italic py-6 text-center">
                    Awaiting request logs... (Make a query or save a note to generate logs)
                  </div>
                ) : (
                  logs.slice().reverse().map((log, index) => {
                    const isError = log.level === 'ERROR';
                    const isWarn = log.level === 'WARN';

                    return (
                      <div key={index} className="flex items-start gap-2 hover:bg-white/5 p-1 rounded transition-colors">
                        <span className="text-neutral-500 text-[10px] whitespace-nowrap">
                          {log.timestamp.slice(11, 23)}
                        </span>
                        
                        <span className={`px-1.5 py-0.2 rounded text-[9.5px] font-bold tracking-wider ${
                          isError ? 'bg-rose-950/80 text-rose-400 border border-rose-800/60' :
                          isWarn ? 'bg-amber-950/80 text-amber-400 border border-amber-800/60' :
                          'bg-indigo-950/80 text-indigo-300 border border-indigo-800/60'
                        }`}>
                          {log.level}
                        </span>

                        <span className={`flex-1 break-all ${
                          isError ? 'text-rose-300 font-semibold' : 
                          log.message.includes('200') || log.message.includes('201') ? 'text-emerald-300' :
                          log.message.includes('VectorService') || log.message.includes('RAGService') ? 'text-cyan-300' :
                          'text-neutral-200'
                        }`}>
                          {log.message}
                          {log.meta && (
                            <span className="text-neutral-400 ml-2">
                              {typeof log.meta === 'object' ? JSON.stringify(log.meta) : String(log.meta)}
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Architecture Highlights */}
          {activeTab === 'architecture' && (
            <div className="space-y-4">
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
                    <span className="font-semibold text-[#111114]">Embedding Model</span>
                    <span className="text-[#6100ff] font-mono text-[10px] font-semibold bg-[#f5f0ff] px-1.5 py-0.2 rounded border border-[#d9c6ff]">
                      {healthInfo?.ai?.configured ? `${healthInfo.ai.embeddingModel} (1536D)` : 'Not Configured'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#555359] truncate font-mono">
                    {healthInfo?.ai?.configured ? `Chat: ${healthInfo?.ai.chatModel}` : 'Local Fallback Engine'}
                  </p>
                </div>
              </div>

              {/* Architecture Specifications */}
              <div className="space-y-2 pt-1 text-[#39383c]">
                <div className="p-3 rounded-lg bg-[#f8f7f4] border border-[#e8e4dd] space-y-0.5">
                  <span className="font-semibold text-[#6100ff] text-[11px] flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" />
                    1. Vector Search via SQLite & Cosine Similarity
                  </span>
                  <p className="text-[#555359] text-[11px] leading-relaxed">
                    Embeddings are stored in SQLite and evaluated with in-memory cosine similarity (dot product over normalized vectors), providing sub-millisecond retrieval without introducing external cloud vector infrastructure.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#f8f7f4] border border-[#e8e4dd] space-y-0.5">
                  <span className="font-semibold text-[#0284c7] text-[11px] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    2. Paragraph-Aware Recursive Chunking
                  </span>
                  <p className="text-[#555359] text-[11px] leading-relaxed">
                    Target size: ~600 characters with 100-character overlap. Prioritizes natural paragraph boundaries (\n\n) and sentence breaks for discrete semantic coherence.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#f8f7f4] border border-[#e8e4dd] space-y-0.5">
                  <span className="font-semibold text-emerald-700 text-[11px] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    3. SSRF-Protected Web Ingestion & Noise Stripping
                  </span>
                  <p className="text-[#555359] text-[11px] leading-relaxed">
                    Webpage fetching strictly validates target hostnames against loopback, private IPv4 subnets, and cloud instance metadata endpoints. Content extraction strips boilerplates, scripts, and navigation.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
