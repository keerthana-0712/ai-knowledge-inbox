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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-[#39383c] flex items-center gap-1.5 font-display">
          <Sparkles className="w-3.5 h-3.5 text-[#6100ff]" />
          <span>Ask Natural-Language Question</span>
        </label>
        <span className="text-[11px] text-[#78757d] font-mono">
          Semantic Retrieval • Grounded Citations
        </span>
      </div>

      {/* ChatGPT-Style Floating Search Capsule */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center bg-white border border-[#e4dfd4] focus-within:border-[#6100ff] rounded-2xl transition-all duration-300 overflow-hidden focus-within:ring-4 focus-within:ring-[#6100ff]/10 shadow-card hover:shadow-card-hover focus-within:shadow-[0_12px_32px_rgba(97,0,255,0.14)] p-1.5">
          <div className="pl-3.5 pr-1 text-[#78757d] group-focus-within:text-[#6100ff] transition-colors">
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
            className="w-full py-3 pl-2 pr-20 text-sm sm:text-[15px] bg-transparent text-[#111114] placeholder-[#8c8880] focus:outline-none font-sans font-medium"
          />

          {/* ChatGPT-Style Illuminated Send Button */}
          <div className="absolute right-2 flex items-center gap-2">
            <button
              type="submit"
              disabled={isQuerying || !question.trim()}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 active:scale-95 ${
                question.trim() && !isQuerying
                  ? 'bg-[#6100ff] text-white shadow-md hover:bg-[#5200db] hover:scale-105'
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

      {/* Dynamic Suggestions based exclusively on real saved documents */}
      {contextualSuggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <span className="text-[11px] text-[#78757d] font-bold font-display uppercase tracking-wider">
            Quick Inquiries:
          </span>
          {contextualSuggestions.map((queryText, i) => (
            <button
              key={i}
              onClick={() => handleSelectSuggestion(queryText)}
              disabled={isQuerying}
              className="text-xs px-3 py-1.5 rounded-full bg-white hover:bg-[#f5f0ff] border border-[#e8e4dd] hover:border-[#d9c6ff] text-[#39383c] hover:text-[#6100ff] transition-all duration-200 flex items-center gap-1.5 disabled:opacity-50 shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:scale-95 font-medium"
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
