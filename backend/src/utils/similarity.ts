/**
 * Mathematical utilities for vector operations and cosine similarity.
 */

/**
 * Computes the dot product of two numerical vectors.
 */
export function dotProduct(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error(`Vector dimension mismatch: ${a.length} vs ${b.length}`);
  }
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

/**
 * Computes Euclidean norm (L2 magnitude) of a vector.
 */
export function magnitude(v: number[]): number {
  let sum = 0;
  for (let i = 0; i < v.length; i++) {
    sum += v[i] * v[i];
  }
  return Math.sqrt(sum);
}

/**
 * Calculates Cosine Similarity between two vectors:
 * cos(theta) = (A . B) / (||A|| * ||B||)
 * 
 * Returns a value between -1.0 and 1.0 (typically 0.0 to 1.0 for positive/text embedding spaces).
 * Returns 0 if either vector has zero magnitude or if lengths do not match.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length === 0 || b.length === 0 || a.length !== b.length) {
    return 0;
  }

  const dot = dotProduct(a, b);
  const magA = magnitude(a);
  const magB = magnitude(b);

  if (magA === 0 || magB === 0) {
    return 0;
  }

  const similarity = dot / (magA * magB);
  
  // Guard against slight floating point inaccuracies exceeding [-1, 1]
  if (similarity > 1) return 1;
  if (similarity < -1) return -1;
  return similarity;
}
