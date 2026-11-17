import React, { useState } from 'react';
import { X, FileText, Loader2 } from 'lucide-react';
import { api } from '../services/api';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddNoteModal: React.FC<AddNoteModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Please provide both a title and content.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await api.ingestNote({
        type: 'note',
        title: title.trim(),
        content: content.trim(),
      });
      setTitle('');
      setContent('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save note.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg bg-white border border-[#e8e4dd] rounded-xl shadow-dropdown overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e4dd] bg-[#fcfbf9]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-[#f5f0ff] text-[#6100ff] border border-[#d9c6ff]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#111114]">Add Note</h2>
              <p className="text-[11px] text-[#78757d]">Index plain text with paragraph-aware chunking</p>
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
              Title <span className="text-[#6100ff]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Enterprise Architecture Guidelines"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3.5 py-2 text-xs bg-[#fcfbf9] border border-[#ddd9d1] rounded-lg text-[#111114] placeholder-[#a7a5aa] focus:outline-none focus:border-[#6100ff] focus:bg-white transition-all shadow-xs"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#111114]">
                Content <span className="text-[#6100ff]">*</span>
              </label>
              <span className="text-[11px] text-[#78757d] font-mono">
                {content.length} chars
              </span>
            </div>
            <textarea
              placeholder="Enter your notes or research here..."
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 text-xs bg-[#fcfbf9] border border-[#ddd9d1] rounded-lg text-[#111114] placeholder-[#a7a5aa] focus:outline-none focus:border-[#6100ff] focus:bg-white transition-all resize-y shadow-xs"
            />
          </div>

          <div className="p-3 rounded-lg bg-[#f8f7f4] border border-[#e8e4dd] text-[11px] text-[#555359]">
            <p className="font-semibold text-[#111114]">Chunking & Embedding Pipeline</p>
            <p className="mt-0.5 leading-relaxed">
              Notes are split at paragraph boundaries (~600 chars with 100 char overlap) and stored in SQLite with vector embeddings for cosine similarity retrieval.
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
                  <span>Indexing...</span>
                </>
              ) : (
                <span>Save Note</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
