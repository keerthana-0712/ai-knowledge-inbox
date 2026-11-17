/**
 * Strict content sanitizer:
 * Ensures all extracted web content and notes are strictly human-readable prose
 * and standard markdown. Strips all HTML/XML/JSX code tags, component wrappers,
 * CSS artifacts, attributes, and unrendered framework code so the user NEVER sees
 * code from links.
 */
export function cleanExtractedText(raw: string): string {
  if (!raw) return '';

  let text = raw;

  // 1. Decode HTML entities
  text = text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');

  // 2. Remove script, style, and iframe blocks completely
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  text = text.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

  // 3. Remove citations / file references like <FileCite .../>
  text = text.replace(/<FileCite[^>]*\/>/gi, '');
  text = text.replace(/<FileCite[^>]*>.*?<\/FileCite>/gi, '');

  // 4. Convert UI badge elements: <badge color="...">Completed</badge> -> [Completed]
  text = text.replace(/<badge[^>]*>(.*?)<\/badge>/gi, '[$1]');

  // 5. Convert formatted text wrapper tags: <text ...>content</text> -> content
  text = text.replace(/<text[^>]*>(.*?)<\/text>/gi, '$1');

  // 6. Convert structural breaks and paragraphs to clean line breaks
  text = text.replace(/<\/?(br|p|div|tr|hr|divider)\s*\/?>/gi, '\n');
  text = text.replace(/<\/?(h[1-6])\s*>/gi, '\n\n');
  text = text.replace(/<li\s*>/gi, '\n• ');

  // 7. Convert links <a href="...">text</a> to text
  text = text.replace(/<a\b[^>]*>(.*?)<\/a>/gi, '$1');

  // 8. STRIP ALL REMAINING HTML / XML / JSX / COMPONENT TAGS
  // Matches any <tag>, </tag>, <tag attr="val">, <tag attr={val} />
  text = text.replace(/<\/?[a-zA-Z][a-zA-Z0-9_\-:]*(?:\s+[^>]*?)?\/?>/g, '');

  // 9. Remove any JSX attribute artifacts like padding={3} gap={3} clip
  text = text.replace(/padding=\{[^}]*\}|gap=\{[^}]*\}|radius=\{[^}]*\}|color=\{[^}]*\}|clip/gi, '');

  // 10. Remove empty brackets []
  text = text.replace(/\[\s*\]/g, '');

  // 11. Clean up line indentation and empty spaces left by stripped tags
  const lines = text.split('\n').map((line) => line.trim());

  // Deduplicate excessive empty lines
  const cleanedLines: string[] = [];
  for (const line of lines) {
    if (!line && cleanedLines.length > 0 && !cleanedLines[cleanedLines.length - 1]) {
      continue;
    }
    cleanedLines.push(line);
  }

  text = cleanedLines.join('\n');
  text = text.replace(/\n{3,}/g, '\n\n').trim();

  return text;
}
