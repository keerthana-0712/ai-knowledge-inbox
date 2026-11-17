import { Item, IngestNotePayload, IngestUrlPayload, QueryResult, HealthInfo } from '../types';

const API_BASE = '/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.error || (data.details ? JSON.stringify(data.details) : `Request failed with status ${res.status}`);
    throw new ApiError(res.status, errorMsg);
  }
  return data.data !== undefined ? data.data : data;
}

export const api = {
  async getItems(): Promise<Item[]> {
    const res = await fetch(`${API_BASE}/items`);
    return handleResponse<Item[]>(res);
  },

  async getItemById(id: string): Promise<Item> {
    const res = await fetch(`${API_BASE}/items/${encodeURIComponent(id)}`);
    return handleResponse<Item>(res);
  },

  async ingestNote(payload: IngestNotePayload): Promise<{ item: Item; chunksCreated: number }> {
    const res = await fetch(`${API_BASE}/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<{ item: Item; chunksCreated: number }>(res);
  },

  async ingestUrl(payload: IngestUrlPayload): Promise<{ item: Item; chunksCreated: number }> {
    const res = await fetch(`${API_BASE}/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<{ item: Item; chunksCreated: number }>(res);
  },

  async deleteItem(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/items/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    await handleResponse<{ success: boolean }>(res);
  },

  async queryRAG(question: string, topK?: number): Promise<QueryResult> {
    const res = await fetch(`${API_BASE}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, topK }),
    });
    return handleResponse<QueryResult>(res);
  },

  async getHealth(): Promise<HealthInfo> {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse<HealthInfo>(res);
  },
};
