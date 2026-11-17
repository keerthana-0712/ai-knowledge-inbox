import React, { useState } from 'react';
import { 
  ExternalLink, 
  FileText, 
  Globe, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Copy,
  Check,
  Percent
} from 'lucide-react';
import { QueryResult } from '../types';
import { sanitizeDisplay } from '../utils/text';

interface AnswerDisplayProps {
  result: QueryResult;
  onClear: () => void;
}

export const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ result, onClear }) => {
  const [copied, setCopied] = useState(false);
  const [highlightedCitation, setHighlightedCitation] = useState<number | null>(null);
  const [expandedSnippets, setExpandedSnippets] = useState<Record<number, boolean>>({});

  const handleCopy = () => {
    navigator.clipboard.writeText(result.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSnippet = (citationNum: number) => {
    setExpandedSnippets((prev) => ({
      ...prev,
      [citationNum]: !prev[citationNum],
    }));
  };

  const handleCitationClick = (citationNum: number) => {
    setHighlightedCitation(citationNum);
    // Expand the corresponding source card
    setExpandedSnippets((prev) => ({ ...prev, [citationNum]: true }));

    // Scroll to source card
    const el = document.getElementById(`source-card-${citationNum}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    setTimeout(() => setHighlightedCitation(null), 2500);
  };

  /**
   * Parses the text and renders [1], [2], [1][2] as interactive clickable citation badges.
   */
  const renderGroundedAnswer = (text: string) => {
    const parts = text.split(/(\[\d+\])/g);

    return parts.map((part, index) => {
      const match = part.match(/^\[(\d+)\]$/);
      if (match) {
        const citationNum = parseInt(match[1], 10);
        const isHighlighted = highlightedCitation === citationNum;
        return (
          <button
            key={index}
            onClick={() => handleCitationClick(citationNum)}
            title={`Jump to Source [${citationNum}]`}
            className={`citation-pill ${
              isHighlighted
                ? 'ring-2 ring-indigo-400 bg-indigo-500/40 text-white scale-110'
                : ''
            }`}
          >
            [{citationNum}]
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="space-y-4 rounded-xl border border-white/10 bg-[#0f121a] p-6 shadow-2xl animate-fade-in">
      {/* Question Header & Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/5">
        <div>
          <span className="text-[10px] uppercase font-semibold text-indigo-400 tracking-wider">
            Grounded Answer
          </span>
          <h3 className="text-base font-semibold text-white mt-0.5">
            "{result.question}"
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1 font-mono text-[11px] bg-white/5 px-2 py-0.5 rounded border border-white/5">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{result.processingTimeMs}ms</span>
          </span>

          <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
            {result.model}
          </span>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors p-1"
            title="Copy answer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Answer Body */}
      <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-line py-1 font-sans">
        {renderGroundedAnswer(result.answer)}
      </div>

      {/* Verifiable Citations and Source Snippets Section */}
      <div className="pt-4 border-t border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Retrieved Source Snippets ({result.sources.length})
            </h4>
            <span className="text-[10px] text-slate-500">
              Ranked by vector cosine similarity
            </span>
          </div>

          <button
            onClick={onClear}
            className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
          >
            Dismiss Answer
          </button>
        </div>

        {result.sources.length === 0 ? (
          <div className="p-4 rounded-lg bg-white/5 text-xs text-slate-400 text-center">
            No source chunks were retrieved for this query.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {result.sources.map((source) => {
              const isExpanded = expandedSnippets[source.citationNumber];
              const isHighlighted = highlightedCitation === source.citationNumber;
              const matchPercentage = Math.round(source.similarity * 100);

              return (
                <div
                  id={`source-card-${source.citationNumber}`}
                  key={source.chunkId}
                  className={`rounded-lg border transition-all p-3.5 ${
                    isHighlighted
                      ? 'border-indigo-500/80 bg-indigo-950/30 ring-1 ring-indigo-500/50 shadow-lg'
                      : 'border-white/5 bg-[#141722]/60 hover:bg-[#141722] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex-shrink-0 w-5 h-5 rounded bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold flex items-center justify-center">
                        {source.citationNumber}
                      </span>

                      <div className="flex items-center gap-1.5 min-w-0">
                        {source.sourceType === 'note' ? (
                          <FileText className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                        ) : (
                          <Globe className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        )}
                        <span className="text-xs font-medium text-slate-200 truncate">
                          {source.title}
                        </span>
                      </div>

                      {source.sourceUrl && (
                        <a
                          href={source.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-cyan-400 transition-colors"
                          title="Open original webpage"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Similarity Score Badge */}
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium flex items-center gap-0.5">
                        <Percent className="w-2.5 h-2.5" />
                        <span>{matchPercentage}% Match</span>
                      </span>

                      <button
                        onClick={() => toggleSnippet(source.citationNumber)}
                        className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/5 transition-colors"
                        title={isExpanded ? 'Collapse' : 'Expand full chunk'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Snippet Content */}
                  <div className="mt-2.5 text-xs text-slate-300 leading-relaxed font-sans bg-black/20 p-2.5 rounded border border-white/5">
                    {isExpanded ? (
                      <p className="whitespace-pre-wrap">{sanitizeDisplay(source.content)}</p>
                    ) : (
                      <p className="line-clamp-2">
                        {sanitizeDisplay(source.content)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
