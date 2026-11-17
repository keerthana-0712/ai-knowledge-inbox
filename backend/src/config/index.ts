import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
dotenv.config();

const isTest = process.env.NODE_ENV === 'test' || process.env.VITEST === 'true';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.resolve(__dirname, '..', '..');

// When running tests, strictly isolate database to avoid polluting development state
const resolvedDbPath = isTest
  ? path.join(backendDir, 'data', 'test_sandbox.db')
  : (process.env.DATABASE_PATH ? path.resolve(backendDir, process.env.DATABASE_PATH) : path.join(backendDir, 'data', 'knowledge_inbox.db'));

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  databasePath: resolvedDbPath,

  // AI Configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    embeddingModel: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
    chatModel: process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini',
  },

  // Chunking and Retrieval Configuration
  chunking: {
    chunkSize: parseInt(process.env.CHUNK_SIZE || '600', 10),
    chunkOverlap: parseInt(process.env.CHUNK_OVERLAP || '100', 10),
    maxRetrievalChunks: parseInt(process.env.MAX_RETRIEVAL_CHUNKS || '5', 10),
    minSimilarityThreshold: parseFloat(process.env.MIN_SIMILARITY_THRESHOLD || '0.15'),
  },
};
