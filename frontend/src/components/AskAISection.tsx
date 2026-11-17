import React, { useState } from 'react';
import { Search, Loader2, ArrowRight, CornerDownLeft } from 'lucide-react';

interface AskAISectionProps {
  onAsk: (question: string) => void;
  isQuerying: boolean;
  hasSavedItems: boolean;
}

const EXAMPLE_QUESTIONS = [
  'What are the key points in Unit 1?',
  'What does Turium AI specialize in?',
  'Explain the four elements of negligence',
  'Summarize recent engineering ethics notes',
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
        <label className="text-xs font-medium text-[#d4d4d8]">
          Ask a question
        </label>
        <span className="text-[11px] text-[#71717a] font-mono">
          Semantic Search • Grounded Citations
        </span>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center bg-[#0d0f15] border border-[#202433] focus-within:border-[#6100ff] rounded-lg transition-colors overflow-hidden focus-within:ring-1 focus-within:ring-[#6100ff]/30">
          <div className="pl-3.5 text-[#71717a]">
            <Search className="w-4 h-4" />
          </div>

          <input
            type="text"
            placeholder={
              hasSavedItems
                ? 'Ask anything across your saved notes and web links...'
                : 'Save notes or URLs to ask questions...'
            }
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isQuerying}
            className="w-full py-3 pl-3 pr-28 text-xs sm:text-sm bg-transparent text-white placeholder-[#52525b] focus:outline-none"
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            <button
              type="submit"
              disabled={isQuerying || !question.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#6100ff] hover:bg-[#5200db] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-md transition-colors"
            >
              {isQuerying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span>Ask</span>
                  <CornerDownLeft className="w-3 h-3 text-[#d4d4d8]" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Suggested Query Chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        <span className="text-[11px] text-[#71717a] font-medium mr-1">Suggestions:</span>
        {EXAMPLE_QUESTIONS.map((example, i) => (
          <button
            key={i}
            onClick={() => handleSelectExample(example)}
            disabled={isQuerying}
            className="text-[11px] px-2 py-0.5 rounded bg-[#131620] hover:bg-[#1a1e2b] border border-[#232736] text-[#a1a1aa] hover:text-white transition-colors flex items-center gap-1 disabled:opacity-50"
          >
            <span>{example}</span>
            <ArrowRight className="w-2.5 h-2.5 text-[#71717a]" />
          </button>
        ))}
      </div>
    </div>
  );
};
