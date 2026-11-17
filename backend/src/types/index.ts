export type SourceType = 'note' | 'url';

export interface Item {
  id: string;
  title: string;
  source_type: SourceType;
  source_url: string | null;
  raw_content: string;
  created_at: string;
  chunk_count?: number;
}

export interface Chunk {
  id: string;
  item_id: string;
  chunk_index: number;
  chunk_content: string;
  embedding: number[];
  created_at?: string;
}

export interface IngestNoteInput {
  type: 'note';
  title: string;
  content: string;
}

export interface IngestUrlInput {
  type: 'url';
  url: string;
  title?: string;
}

export type IngestInput = IngestNoteInput | IngestUrlInput;

export interface IngestResult {
  item: Item;
  chunksCreated: number;
  message: string;
}

export interface QueryRequest {
  question: string;
  topK?: number;
}

export interface Citation {
  citationNumber: number;
  chunkId: string;
  itemId: string;
  title: string;
  sourceType: SourceType;
  sourceUrl: string | null;
}

export interface SourceSnippet {
  citationNumber: number;
  chunkId: string;
  itemId: string;
  chunkIndex: number;
  title: string;
  sourceType: SourceType;
  sourceUrl: string | null;
  content: string;
  similarity: number;
}

export interface QueryResponse {
  question: string;
  answer: string;
  citations: Citation[];
  sources: SourceSnippet[];
  model: string;
  processingTimeMs: number;
}

export interface HealthResponse {
  status: 'healthy' | 'degraded';
  timestamp: string;
  database: {
    status: 'connected' | 'disconnected';
    itemsCount: number;
    chunksCount: number;
  };
  ai: {
    provider: 'openai' | 'local-fallback';
    configured: boolean;
    embeddingModel: string;
    chatModel: string;
  };
}
