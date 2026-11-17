import React, { useState } from 'react';
import { Search, Loader2, ArrowRight, CornerDownLeft } from 'lucide-react';
import { Item } from '../types';

interface AskAISectionProps {
  onAsk: (question: string) => void;
  isQuerying: boolean;
  hasSavedItems: boolean;
  items?: Item[];
}

export const AskAISection: React.FC<AskAISectionProps> = ({
  onAsk,
  isQuerying,
  hasSavedItems,
  items = [],
}) => {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isQuerying) return;
    onAsk(question.trim());
  };

  const handleSelectSuggestion = (suggestedQuery: string) => {
    setQuestion(suggestedQuery);
    onAsk(suggestedQuery);
  };

  // Dynamically derive contextual suggestions only from the user's actual saved documents
  const contextualSuggestions = React.useMemo(() => {
    if (!items || items.length === 0) return [];

    const suggestions: string[] = [];
    const recent = items.slice(0, 3);

    for (const item of recent) {
      const cleanTitle = item.title.trim();
      if (cleanTitle) {
        suggestions.push(`Summarize "${cleanTitle}"`);
      }
    }

    return suggestions.slice(0, 3);
  }, [items]);

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#39383c]">
          Ask Natural-Language Question
        </label>
        <span className="text-[11px] text-[#78757d] font-mono">
          Semantic Cosine Retrieval • Anti-Hallucination RAG
        </span>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center bg-[#fcfbf9] border border-[#ddd9d1] focus-within:border-[#6100ff] focus-within:bg-white rounded-lg transition-all overflow-hidden focus-within:ring-2 focus-within:ring-[#6100ff]/15 shadow-xs">
          <div className="pl-3.5 text-[#78757d]">
            <Search className="w-4 h-4" />
          </div>

          <input
            type="text"
            placeholder={
              hasSavedItems
                ? 'Ask anything across your saved notes and web links...'
                : 'Save notes or URLs to ask questions across your library...'
            }
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isQuerying}
            className="w-full py-3 pl-3 pr-28 text-xs sm:text-sm bg-transparent text-[#111114] placeholder-[#a7a5aa] focus:outline-none"
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            <button
              type="submit"
              disabled={isQuerying || !question.trim()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-[#6100ff] hover:bg-[#5200db] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-md transition-colors shadow-sm"
            >
              {isQuerying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span>Ask</span>
                  <CornerDownLeft className="w-3 h-3 text-white/80" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Dynamic Suggestions based exclusively on real saved documents */}
      {contextualSuggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[11px] text-[#78757d] font-medium mr-1">Suggestions:</span>
          {contextualSuggestions.map((queryText, i) => (
            <button
              key={i}
              onClick={() => handleSelectSuggestion(queryText)}
              disabled={isQuerying}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-[#f5f0ff] border border-[#e8e4dd] hover:border-[#d9c6ff] text-[#39383c] hover:text-[#6100ff] transition-all flex items-center gap-1 disabled:opacity-50 shadow-xs"
            >
              <span className="truncate max-w-[240px]">{queryText}</span>
              <ArrowRight className="w-2.5 h-2.5 text-[#78757d]" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
