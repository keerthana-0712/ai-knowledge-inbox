import React, { useState } from 'react';
import { X, Globe, Loader2, ShieldCheck } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg bg-white border border-[#e8e4dd] rounded-xl shadow-dropdown overflow-hidden animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e4dd] bg-[#fcfbf9]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-sky-50 text-sky-600 border border-sky-200">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#111114]">Ingest Webpage URL</h2>
              <p className="text-[11px] text-[#78757d]">Server-side fetch, noise stripping, and vector indexing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#78757d] hover:text-[#111114] hover:bg-[#f0eee6] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#111114]">
              Target URL <span className="text-[#6100ff]">*</span>
            </label>
            <input
              type="url"
              placeholder="https://example.com/documentation-or-article"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3.5 py-2 text-xs bg-[#fcfbf9] border border-[#ddd9d1] rounded-lg text-[#111114] placeholder-[#a7a5aa] focus:outline-none focus:border-[#6100ff] focus:bg-white font-mono transition-all shadow-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#111114]">
              Custom Title <span className="text-[11px] font-normal text-[#78757d]">(Optional, extracted from page if blank)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Turium Architecture Whitepaper"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3.5 py-2 text-xs bg-[#fcfbf9] border border-[#ddd9d1] rounded-lg text-[#111114] placeholder-[#a7a5aa] focus:outline-none focus:border-[#6100ff] focus:bg-white transition-all shadow-xs"
            />
          </div>

          <div className="p-3 rounded-lg bg-[#f8f7f4] border border-[#e8e4dd] space-y-1 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-[#111114] text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>SSRF Protected & Clean Readability Parsing</span>
            </div>
            <p className="text-[11px] text-[#555359] leading-relaxed">
              The server securely fetches the page (blocking loopback and private subnets), removes boilerplate/scripts, extracts clean article text, chunks at paragraph bounds, and embeds into SQLite.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-[#555359] hover:text-[#111114] bg-white hover:bg-[#f8f7f4] rounded-lg border border-[#ddd9d1] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#6100ff] hover:bg-[#5200db] disabled:opacity-50 text-white rounded-lg transition-colors shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Fetching & Indexing...</span>
                </>
              ) : (
                <span>Fetch & Ingest</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
