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
    setExpandedSnippets((prev) => ({ ...prev, [citationNum]: true }));

    const el = document.getElementById(`source-card-${citationNum}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    setTimeout(() => setHighlightedCitation(null), 2500);
  };

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
            title={`View Source [${citationNum}]`}
            className={`citation-pill ${
              isHighlighted
                ? 'ring-2 ring-[#6100ff] bg-[#6100ff]/30 text-white'
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
    <div className="space-y-4 rounded-lg border border-[#1e222f] bg-[#0c0e14] p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1c1f2b]">
        <div>
          <span className="text-[10px] uppercase font-semibold text-[#8b3dff] tracking-wider">
            Generated Answer
          </span>
          <h3 className="text-sm font-semibold text-white mt-0.5">
            "{result.question}"
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#71717a]">
          <span className="flex items-center gap-1 font-mono text-[11px] bg-[#141722] px-2 py-0.5 rounded border border-[#232736]">
            <Clock className="w-3 h-3 text-[#71717a]" />
            <span>{result.processingTimeMs}ms</span>
          </span>

          <span className="text-[11px] font-mono text-[#a1a1aa] bg-[#141722] px-2 py-0.5 rounded border border-[#232736]">
            {result.model}
          </span>

          <button
            onClick={handleCopy}
            className="p-1 rounded text-[#71717a] hover:text-white hover:bg-[#141722] transition-colors"
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
      <div className="text-sm leading-relaxed text-[#d4d4d8] whitespace-pre-line py-1 font-sans">
        {renderGroundedAnswer(result.answer)}
      </div>

      {/* Source References */}
      <div className="pt-3 border-t border-[#1c1f2b] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">
              Sources ({result.sources.length})
            </h4>
            <span className="text-[10px] text-[#52525b]">
              Ranked by vector cosine similarity
            </span>
          </div>

          <button
            onClick={onClear}
            className="text-[11px] text-[#71717a] hover:text-[#d4d4d8] transition-colors"
          >
            Dismiss
          </button>
        </div>

        {result.sources.length === 0 ? (
          <div className="p-3 rounded bg-[#131620] text-xs text-[#71717a] text-center border border-[#1e222f]">
            No context snippets were retrieved for this query.
          </div>
        ) : (
          <div className="space-y-2">
            {result.sources.map((source) => {
              const isExpanded = expandedSnippets[source.citationNumber];
              const isHighlighted = highlightedCitation === source.citationNumber;
              const matchPercentage = Math.round(source.similarity * 100);

              return (
                <div
                  id={`source-card-${source.citationNumber}`}
                  key={source.chunkId}
                  className={`rounded-md border p-3 transition-colors ${
                    isHighlighted
                      ? 'border-[#6100ff] bg-[#141224]'
                      : 'border-[#1e222f] bg-[#0f1118] hover:border-[#2a2f40]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex-shrink-0 w-4 h-4 rounded bg-[#6100ff]/20 text-[#a855f7] font-mono text-[10px] font-bold flex items-center justify-center">
                        {source.citationNumber}
                      </span>

                      <div className="flex items-center gap-1.5 min-w-0">
                        {source.sourceType === 'note' ? (
                          <FileText className="w-3.5 h-3.5 text-[#9d66ff] flex-shrink-0" />
                        ) : (
                          <Globe className="w-3.5 h-3.5 text-[#38bdf8] flex-shrink-0" />
                        )}
                        <span className="text-xs font-medium text-[#e4e4e7] truncate">
                          {source.title}
                        </span>
                      </div>

                      {source.sourceUrl && (
                        <a
                          href={source.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#71717a] hover:text-white transition-colors"
                          title="Open original link"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium flex items-center gap-0.5">
                        <Percent className="w-2.5 h-2.5" />
                        <span>{matchPercentage}% Match</span>
                      </span>

                      <button
                        onClick={() => toggleSnippet(source.citationNumber)}
                        className="text-[#71717a] hover:text-white p-0.5 transition-colors"
                        title={isExpanded ? 'Collapse' : 'Expand full snippet'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Sanitized Text Content */}
                  <div className="mt-2 text-xs text-[#a1a1aa] leading-relaxed bg-[#08090d] p-2.5 rounded border border-[#181a24]">
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
