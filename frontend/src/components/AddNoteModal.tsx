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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div 
        className="w-full max-w-lg bg-[#0e1017] border border-[#222636] rounded-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1c1f2b] bg-[#0a0c12]">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-[#6100ff]/10 text-[#9d66ff] border border-[#6100ff]/20">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-white">Add Note</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#71717a] hover:text-white hover:bg-[#1a1d28] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {error && (
            <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-[#d4d4d8]">
              Title <span className="text-[#8b3dff]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Engineering Ethics Notes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-1.5 text-xs bg-[#08090d] border border-[#202433] rounded-md text-white placeholder-[#52525b] focus:outline-none focus:border-[#6100ff] transition-colors"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#d4d4d8]">
                Content <span className="text-[#8b3dff]">*</span>
              </label>
              <span className="text-[10px] text-[#52525b] font-mono">
                {content.length} chars
              </span>
            </div>
            <textarea
              rows={7}
              placeholder="Enter your plain-text or markdown notes here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 text-xs bg-[#08090d] border border-[#202433] rounded-md text-white placeholder-[#52525b] focus:outline-none focus:border-[#6100ff] transition-colors resize-none font-sans leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1c1f2b]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3 py-1.5 text-xs font-medium text-[#71717a] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-[#6100ff] hover:bg-[#5200db] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-md transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
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
