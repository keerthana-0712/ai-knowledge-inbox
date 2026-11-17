import { describe, it, expect } from 'vitest';
import { dotProduct, magnitude, cosineSimilarity } from '../src/utils/similarity.js';

describe('Vector Mathematics & Cosine Similarity', () => {
  it('should compute dot product accurately', () => {
    const a = [1, 2, 3];
    const b = [4, -5, 6];
    // 1*4 + 2*(-5) + 3*6 = 4 - 10 + 18 = 12
    expect(dotProduct(a, b)).toBe(12);
  });

  it('should compute vector magnitude accurately', () => {
    const v = [3, 4];
    // sqrt(9 + 16) = 5
    expect(magnitude(v)).toBe(5);
  });

  it('should return 1.0 for identical non-zero vectors', () => {
    const a = [0.2, 0.5, 0.8];
    const b = [0.2, 0.5, 0.8];
    expect(cosineSimilarity(a, b)).toBeCloseTo(1.0, 5);
  });

  it('should return 0.0 for orthogonal vectors', () => {
    const a = [1, 0, 0];
    const b = [0, 1, 0];
    expect(cosineSimilarity(a, b)).toBe(0);
  });

  it('should return -1.0 for diametrically opposite vectors', () => {
    const a = [1, 2, 3];
    const b = [-1, -2, -3];
    expect(cosineSimilarity(a, b)).toBeCloseTo(-1.0, 5);
  });

  it('should return 0 when comparing against a zero vector', () => {
    const a = [1, 2, 3];
    const zero = [0, 0, 0];
    expect(cosineSimilarity(a, zero)).toBe(0);
  });

  it('should handle dimension mismatch gracefully', () => {
    const a = [1, 2];
    const b = [1, 2, 3];
    expect(cosineSimilarity(a, b)).toBe(0);
  });
});
