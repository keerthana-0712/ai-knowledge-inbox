import React, { useState } from 'react';
import { X, Globe, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { api } from '../services/api';

interface AddUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddUrlModal: React.FC<AddUrlModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please provide a target URL.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await api.ingestUrl({
        type: 'url',
        url: url.trim(),
        title: title.trim() || undefined,
      });
      setUrl('');
      setTitle('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to ingest URL.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-xl bg-[#11141d] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0e1017]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Ingest Webpage URL</h2>
              <p className="text-xs text-slate-400">Extract readable content, chunk, and index into vectors</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Target URL <span className="text-cyan-400">*</span>
            </label>
            <input
              type="url"
              placeholder="https://example.com/article-or-documentation"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3.5 py-2 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Custom Title <span className="text-slate-500 text-[10px]">(Optional, auto-extracted from page if blank)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. OpenAI Technical Overview"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3.5 py-2 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            />
          </div>

          <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10 text-[11px] text-cyan-300/80 space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-cyan-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SSRF Protected & Clean Readability Parsing</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              The server securely fetches the page (blocking localhost and private networks), strips scripts, 
              styles, and navigation, extracts core article text, generates paragraph chunks, and stores embeddings in SQLite.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !url.trim()}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg shadow-lg shadow-cyan-600/20 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Fetching & Vectorizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Fetch & Index URL</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
