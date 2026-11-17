/**
 * Cleans extracted web content and pseudo-JSX/XML tags (e.g. from ChatGPT shared chats,
 * documentation frameworks, or CMS systems) so that content represents pure, readable text
 * and standard markdown exactly as seen by a user in their browser.
 */
export function cleanExtractedText(raw: string): string {
  if (!raw) return '';

  let text = raw;

  // 1. Remove citations / file references like <FileCite ref_id="..."/>
  text = text.replace(/<FileCite[^>]*\/>/gi, '');
  text = text.replace(/<FileCite[^>]*>.*?<\/FileCite>/gi, '');

  // 2. Convert UI badge elements: <badge color="...">Completed</badge> -> [Completed]
  text = text.replace(/<badge[^>]*>(.*?)<\/badge>/gi, '[$1]');

  // 3. Convert formatted text wrapper tags: <text ...>content</text> -> content
  text = text.replace(/<text[^>]*>(.*?)<\/text>/gi, '$1');

  // 4. Remove structural pseudo-JSX layout tags: <box ...>, </box>, <row ...>, </row>, <column ...>, </column>
  text = text.replace(/<\/?(box|row|col|column)[^>]*>/gi, '');

  // 5. Convert divider tags: <divider .../> -> ---
  text = text.replace(/<divider[^>]*\/?>/gi, '\n---\n');

  // 6. Strip any remaining non-standard HTML / XML tags with attributes (e.g. <custom-tag prop="val">)
  text = text.replace(/<([a-zA-Z0-9_-]+)(?:\s+[^>]*)?>/g, (match, tagName) => {
    // Keep basic semantic HTML formatting tags if needed, otherwise strip
    if (/^(b|strong|i|em|u|code|pre|a|p|br|hr|h[1-6])$/i.test(tagName)) {
      return match;
    }
    return '';
  });
  text = text.replace(/<\/([a-zA-Z0-9_-]+)>/g, (match, tagName) => {
    if (/^(b|strong|i|em|u|code|pre|a|p|h[1-6])$/i.test(tagName)) {
      return match;
    }
    return '';
  });

  // 7. Remove empty markdown badges or orphaned brackets
  text = text.replace(/\[\s*\]/g, '');

  // 8. Clean up indentation artifacts left behind by stripped layout tags
  const lines = text.split('\n').map((line) => {
    // If line had leading spaces that were just indentation for JSX tags, trim if not a code block or list item
    if (/^\s{2,}([-*+]|\d+\.|\#|[A-Z])/.test(line)) {
      return line.trim();
    }
    return line;
  });

  text = lines.join('\n');

  // 9. Normalize multiple consecutive blank lines
  text = text.replace(/\n{3,}/g, '\n\n').trim();

  return text;
}
