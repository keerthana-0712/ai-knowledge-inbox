import React, { useState } from 'react';
import { Search, Sparkles, Loader2, ArrowRight, CornerDownLeft } from 'lucide-react';

interface AskAISectionProps {
  onAsk: (question: string) => void;
  isQuerying: boolean;
  hasSavedItems: boolean;
}

const EXAMPLE_QUESTIONS = [
  'What does Turium AI build?',
  'Explain quantum superposition from my saved notes',
  'What are the trade-offs of using SQLite for vector search?',
  'Summarize key takeaways from my saved articles',
];

export const AskAISection: React.FC<AskAISectionProps> = ({
  onAsk,
  isQuerying,
  hasSavedItems,
}) => {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isQuerying) return;
    onAsk(question.trim());
  };

  const handleSelectExample = (example: string) => {
    setQuestion(example);
    onAsk(example);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Ask AI Across Your Saved Knowledge</span>
        </label>
        <span className="text-[11px] text-slate-500 font-mono">
          RAG • Cosine Similarity • Verifiable Citations
        </span>
      </div>

      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center bg-[#10131c] border border-white/10 group-focus-within:border-indigo-500/50 rounded-xl shadow-xl transition-all overflow-hidden group-focus-within:ring-2 group-focus-within:ring-indigo-500/20">
          <div className="pl-4 text-slate-400">
            <Search className="w-4 h-4 text-slate-400" />
          </div>

          <input
            type="text"
            placeholder={
              hasSavedItems
                ? 'Ask a natural language question over your saved notes and web content...'
                : 'Save notes or URLs above first, then ask questions here...'
            }
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isQuerying}
            className="w-full py-4 pl-3 pr-28 text-sm bg-transparent text-white placeholder-slate-500 focus:outline-none"
          />

          <div className="absolute right-2 flex items-center gap-2">
            <button
              type="submit"
              disabled={isQuerying || !question.trim()}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg shadow-md transition-all active:scale-95"
            >
              {isQuerying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span>Ask AI</span>
                  <CornerDownLeft className="w-3 h-3 text-indigo-200" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Example Prompt Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-[11px] text-slate-500 font-medium">Try asking:</span>
        {EXAMPLE_QUESTIONS.map((example, i) => (
          <button
            key={i}
            onClick={() => handleSelectExample(example)}
            disabled={isQuerying}
            className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 disabled:opacity-50"
          >
            <span>{example}</span>
            <ArrowRight className="w-2.5 h-2.5 opacity-60" />
          </button>
        ))}
      </div>
    </div>
  );
};
