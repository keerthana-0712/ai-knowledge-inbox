/**
 * Frontend display sanitizer:
 * Ensures all displayed knowledge previews, full note text, and RAG answer snippets
 * render strictly as human-readable prose without any raw HTML/XML/JSX code tags.
 */
export function sanitizeDisplay(raw: string): string {
  if (!raw) return '';

  let text = raw;

  // 1. Remove any unparsed <...tag...> fragments
  text = text.replace(/<\/?[a-zA-Z][a-zA-Z0-9_\-:]*(?:\s+[^>]*?)?\/?>/g, '');

  // 2. Remove FileCite or custom XML tags
  text = text.replace(/<[a-zA-Z0-9_\-:]+[^>]*\/>/g, '');

  // 3. Remove leftover pseudo-code attributes
  text = text.replace(/padding=\{[^}]*\}|gap=\{[^}]*\}|radius=\{[^}]*\}|color=\{[^}]*\}|clip/gi, '');

  // 4. Decode common HTML entities if escaped
  text = text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');

  return text.trim();
}
