import React, { useState } from 'react';
import { Sparkles, Loader2, ArrowUp, ArrowRight } from 'lucide-react';
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

  // Derive quick inquiries only from actual saved documents
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
        <label className="text-xs font-semibold uppercase tracking-wider text-[#39383c] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#6100ff]" />
          <span>Ask Natural-Language Question</span>
        </label>
        <span className="text-[11px] text-[#78757d] font-mono">
          Semantic Retrieval • Grounded Citations
        </span>
      </div>

      {/* Query Search Capsule */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center bg-white border border-[#ddd9d1] focus-within:border-[#6100ff] rounded-xl transition-all duration-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#6100ff]/15 shadow-xs p-1">
          <div className="pl-3 pr-1 text-[#78757d] group-focus-within:text-[#6100ff] transition-colors">
            <Sparkles className="w-4 h-4" />
          </div>

          <input
            type="text"
            placeholder={
              hasSavedItems
                ? 'Ask anything across your saved notes and web links...'
                : 'Save notes or URLs to begin asking questions...'
            }
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isQuerying}
            className="w-full py-2.5 pl-2 pr-16 text-sm bg-transparent text-[#111114] placeholder-[#8c8880] focus:outline-none font-medium"
          />

          {/* Submit Button */}
          <div className="absolute right-1.5 flex items-center">
            <button
              type="submit"
              disabled={isQuerying || !question.trim()}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 active:scale-95 ${
                question.trim() && !isQuerying
                  ? 'bg-[#6100ff] text-white hover:bg-[#5200db]'
                  : 'bg-[#f0eee6] text-[#a7a5aa] cursor-not-allowed'
              }`}
              title="Submit Query (Enter)"
            >
              {isQuerying ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#6100ff]" />
              ) : (
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Clean Loading State */}
      {isQuerying && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-[#f8f7f4] border border-[#e8e4dd] text-xs text-[#555359]">
          <Loader2 className="w-4 h-4 animate-spin text-[#6100ff] flex-shrink-0" />
          <span>Searching vector database, retrieving relevant context, and synthesizing answer...</span>
        </div>
      )}

      {/* Dynamic Suggestions based exclusively on real saved documents */}
      {contextualSuggestions.length > 0 && !isQuerying && (
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <span className="text-[11px] text-[#78757d] font-semibold uppercase tracking-wider">
            Quick Inquiries:
          </span>
          {contextualSuggestions.map((queryText, i) => (
            <button
              key={i}
              onClick={() => handleSelectSuggestion(queryText)}
              disabled={isQuerying}
              className="text-xs px-2.5 py-1 rounded-md bg-[#f8f7f4] hover:bg-[#f5f0ff] border border-[#e8e4dd] hover:border-[#d9c6ff] text-[#39383c] hover:text-[#6100ff] transition-colors flex items-center gap-1.5 disabled:opacity-50 font-medium"
            >
              <span className="truncate max-w-[240px]">{queryText}</span>
              <ArrowRight className="w-3 h-3 text-[#78757d]" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
