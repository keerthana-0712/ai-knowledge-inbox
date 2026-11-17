import { describe, it, expect } from 'vitest';
import { chunkText } from '../src/utils/chunker.js';

describe('Text Chunking Strategy', () => {
  it('should return an empty array for empty or whitespace-only input', () => {
    expect(chunkText('')).toEqual([]);
    expect(chunkText('   \n\t  ')).toEqual([]);
  });

  it('should return a single chunk if text is smaller than chunk size', () => {
    const text = 'This is a brief knowledge note about artificial intelligence.';
    const chunks = chunkText(text, 600, 100);
    expect(chunks).toHaveLength(1);
    expect(chunks[0].index).toBe(0);
    expect(chunks[0].content).toBe(text);
    expect(chunks[0].charStart).toBe(0);
    expect(chunks[0].charEnd).toBe(text.length);
  });

  it('should preserve paragraph boundaries when splitting long text', () => {
    const para1 = 'First paragraph discussing retrieval-augmented generation and vector databases in modern LLM architectures.';
    const para2 = 'Second paragraph detailing how SQLite with cosine similarity provides a lightweight vector store for single-user knowledge bases.';
    const text = `${para1}\n\n${para2}`;

    // With a small chunk size of 120 chars, it should split at the paragraph boundary
    const chunks = chunkText(text, 130, 20);
    expect(chunks.length).toBeGreaterThanOrEqual(2);
    expect(chunks[0].content).toContain('First paragraph');
    expect(chunks[1].content).toContain('Second paragraph');
  });

  it('should maintain overlap between consecutive chunks', () => {
    const text = 'Paragraph A contains foundation information. '.repeat(10);
    const chunks = chunkText(text, 200, 50);

    expect(chunks.length).toBeGreaterThan(1);
    // Ensure contiguous indexing
    for (let i = 0; i < chunks.length; i++) {
      expect(chunks[i].index).toBe(i);
      expect(chunks[i].content.length).toBeGreaterThan(0);
    }
  });
});
