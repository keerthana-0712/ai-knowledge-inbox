import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createApp } from '../src/app.js';
import { getDatabase } from '../src/database/db.js';
import { Server } from 'http';

describe('End-to-End REST API Endpoints', () => {
  let server: Server;
  let baseUrl: string;
  let createdItemId: string;

  beforeAll(async () => {
    getDatabase();
    const app = createApp();
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address() as any;
        baseUrl = `http://localhost:${address.port}`;
        resolve();
      });
    });
  });

  afterAll((done) => {
    server.close();
  });

  it('GET /health - returns healthy status and system stats', async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.status).toBe('healthy');
    expect(data.database.status).toBe('connected');
    expect(typeof data.database.itemsCount).toBe('number');
    expect(typeof data.database.chunksCount).toBe('number');
  });

  it('POST /ingest - rejects invalid empty payloads', async () => {
    const res = await fetch(`${baseUrl}/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'note', title: '', content: '' }),
    });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
  });

  it('POST /ingest - rejects unsafe SSRF URL target (localhost)', async () => {
    const res = await fetch(`${baseUrl}/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'url', url: 'http://localhost:8080/secret' }),
    });
    expect(res.status).toBe(500); // Caught by error middleware
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('blocked for security');
  });

  it('POST /ingest - ingests valid text note, generates chunks, and stores in SQLite', async () => {
    const res = await fetch(`${baseUrl}/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'note',
        title: 'Turium AI Technical Overview',
        content:
          'Turium AI is an enterprise AI company specializing in autonomous agents, high-precision retrieval augmented generation, and private enterprise search workflows.',
      }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.item.title).toBe('Turium AI Technical Overview');
    expect(body.data.chunksCreated).toBeGreaterThan(0);

    createdItemId = body.data.item.id;
  });

  it('GET /items - lists saved items with chunk counts', async () => {
    const res = await fetch(`${baseUrl}/items`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.some((i: any) => i.id === createdItemId)).toBe(true);
  });

  it('POST /query - executes RAG pipeline and returns answer with citations', async () => {
    const res = await fetch(`${baseUrl}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: 'What does Turium AI specialize in?',
      }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.answer).toBeDefined();
    expect(body.data.sources.length).toBeGreaterThan(0);
    expect(body.data.citations.length).toBeGreaterThan(0);
    expect(body.data.citations[0].citationNumber).toBe(1);
    expect(body.data.sources.some((s: any) => s.title.includes('Turium AI'))).toBe(true);
  });

  it('DELETE /items/:id - removes item and cascades to vector chunks', async () => {
    const res = await fetch(`${baseUrl}/items/${createdItemId}`, {
      method: 'DELETE',
    });
    expect(res.status).toBe(200);

    const getRes = await fetch(`${baseUrl}/items/${createdItemId}`);
    expect(getRes.status).toBe(404);
  });
});
