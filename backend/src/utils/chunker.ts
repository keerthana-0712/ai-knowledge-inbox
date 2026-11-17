export interface TextChunk {
  index: number;
  content: string;
  charStart: number;
  charEnd: number;
}

/**
 * Splits input text into overlapping chunks, respecting paragraph and sentence boundaries.
 */
export function chunkText(
  text: string,
  chunkSize: number = 600,
  chunkOverlap: number = 100
): TextChunk[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // Normalize line breaks and remove excessive blank lines
  const normalizedText = text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

  // If text is within chunk size, return as a single chunk
  if (normalizedText.length <= chunkSize) {
    return [
      {
        index: 0,
        content: normalizedText,
        charStart: 0,
        charEnd: normalizedText.length,
      },
    ];
  }

  // Split into paragraphs first
  const paragraphs = normalizedText.split(/\n\s*\n/);
  const chunks: TextChunk[] = [];
  let currentChunk = '';
  let chunkIndex = 0;
  let runningOffset = 0;

  for (const para of paragraphs) {
    const trimmedPara = para.trim();
    if (!trimmedPara) continue;

    // If paragraph itself exceeds chunkSize, split by sentences or sliding window
    if (trimmedPara.length > chunkSize) {
      // Flush current accumulated chunk if not empty
      if (currentChunk.trim().length > 0) {
        const start = runningOffset;
        const end = start + currentChunk.length;
        chunks.push({
          index: chunkIndex++,
          content: currentChunk.trim(),
          charStart: start,
          charEnd: end,
        });
        // Carry over overlap
        const overlapSlice = currentChunk.slice(-chunkOverlap);
        runningOffset += currentChunk.length - overlapSlice.length;
        currentChunk = overlapSlice + ' ';
      }

      // Split large paragraph by sentence terminators (.!?)
      const sentences = trimmedPara.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [trimmedPara];
      for (const sentence of sentences) {
        if ((currentChunk + sentence).length > chunkSize && currentChunk.trim().length > 0) {
          const start = runningOffset;
          const end = start + currentChunk.length;
          chunks.push({
            index: chunkIndex++,
            content: currentChunk.trim(),
            charStart: start,
            charEnd: end,
          });
          const overlapSlice = currentChunk.slice(-chunkOverlap);
          runningOffset += currentChunk.length - overlapSlice.length;
          currentChunk = overlapSlice + ' ' + sentence;
        } else {
          currentChunk += (currentChunk.length > 0 ? ' ' : '') + sentence;
        }
      }
    } else {
      // If adding this paragraph exceeds chunkSize, flush
      if ((currentChunk + '\n\n' + trimmedPara).length > chunkSize && currentChunk.trim().length > 0) {
        const start = runningOffset;
        const end = start + currentChunk.length;
        chunks.push({
          index: chunkIndex++,
          content: currentChunk.trim(),
          charStart: start,
          charEnd: end,
        });
        const overlapSlice = currentChunk.slice(-chunkOverlap);
        runningOffset += currentChunk.length - overlapSlice.length;
        currentChunk = overlapSlice + '\n\n' + trimmedPara;
      } else {
        currentChunk += (currentChunk.length > 0 ? '\n\n' : '') + trimmedPara;
      }
    }
  }

  // Flush any remaining content
  if (currentChunk.trim().length > 0) {
    const start = runningOffset;
    const end = start + currentChunk.length;
    chunks.push({
      index: chunkIndex++,
      content: currentChunk.trim(),
      charStart: start,
      charEnd: end,
    });
  }

  return chunks;
}
