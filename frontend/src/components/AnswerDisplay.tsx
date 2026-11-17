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
                ? 'ring-2 ring-[#6100ff] bg-[#6100ff] text-white'
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
    <div className="space-y-5 rounded-xl border border-[#e8e4dd] bg-white p-6 shadow-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-[#e8e4dd]">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#6100ff] tracking-wider">
            Synthesized Answer
          </span>
          <h3 className="text-sm font-semibold text-[#111114] mt-0.5">
            "{result.question}"
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#555359]">
          <span className="flex items-center gap-1 font-mono text-[11px] bg-[#f8f7f4] px-2 py-0.5 rounded-md border border-[#e8e4dd]">
            <Clock className="w-3 h-3 text-[#78757d]" />
            <span>{result.processingTimeMs}ms</span>
          </span>

          <span className="text-[11px] font-mono text-[#555359] bg-[#f8f7f4] px-2 py-0.5 rounded-md border border-[#e8e4dd]">
            {result.model}
          </span>

          <button
            onClick={handleCopy}
            className="p-1 rounded text-[#78757d] hover:text-[#111114] hover:bg-[#f0eee6] transition-colors"
            title="Copy answer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Answer Body */}
      <div className="text-[13px] sm:text-[14px] leading-relaxed text-[#222226] whitespace-pre-line py-1 font-sans">
        {renderGroundedAnswer(result.answer)}
      </div>

      {/* Source References */}
      <div className="pt-4 border-t border-[#e8e4dd] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-[#111114] uppercase tracking-wider">
              Supporting Sources ({result.sources.length})
            </h4>
            <span className="text-[11px] text-[#78757d]">
              Ranked by cosine similarity
            </span>
          </div>

          <button
            onClick={onClear}
            className="text-[11px] text-[#78757d] hover:text-[#111114] transition-colors"
          >
            Dismiss
          </button>
        </div>

        {result.sources.length === 0 ? (
          <div className="p-3.5 rounded-lg bg-[#f8f7f4] text-xs text-[#78757d] text-center border border-[#e8e4dd]">
            No context snippets were retrieved for this query.
          </div>
        ) : (
          <div className="space-y-2.5">
            {result.sources.map((source) => {
              const isExpanded = expandedSnippets[source.citationNumber];
              const isHighlighted = highlightedCitation === source.citationNumber;
              const matchPercentage = Math.round(source.similarity * 100);

              return (
                <div
                  id={`source-card-${source.citationNumber}`}
                  key={source.chunkId}
                  className={`rounded-lg border p-3.5 transition-all ${
                    isHighlighted
                      ? 'border-[#6100ff] bg-[#f5f0ff] ring-2 ring-[#6100ff]/20'
                      : 'border-[#e8e4dd] bg-[#fcfbf9] hover:bg-white hover:border-[#ddd9d1] shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#f5f0ff] border border-[#d9c6ff] text-[#6100ff] font-mono text-[10px] font-bold flex items-center justify-center">
                        {source.citationNumber}
                      </span>

                      <div className="flex items-center gap-1.5 min-w-0">
                        {source.sourceType === 'note' ? (
                          <FileText className="w-3.5 h-3.5 text-[#6100ff] flex-shrink-0" />
                        ) : (
                          <Globe className="w-3.5 h-3.5 text-[#0284c7] flex-shrink-0" />
                        )}
                        <span className="text-xs font-semibold text-[#111114] truncate">
                          {source.title}
                        </span>
                      </div>

                      {source.sourceUrl && (
                        <a
                          href={source.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#78757d] hover:text-[#0284c7] transition-colors"
                          title="Open original URL"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold flex items-center gap-0.5">
                        <Percent className="w-2.5 h-2.5" />
                        <span>{matchPercentage}% Match</span>
                      </span>

                      <button
                        onClick={() => toggleSnippet(source.citationNumber)}
                        className="text-[#78757d] hover:text-[#111114] p-0.5 transition-colors"
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

                  {/* Sanitized Text Content (Zero Code Tags) */}
                  <div className="mt-2.5 text-xs text-[#555359] leading-relaxed bg-white p-3 rounded-md border border-[#e8e4dd]">
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
