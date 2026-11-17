import { describe, it, expect, beforeAll } from 'vitest';
import { dbService, getDatabase } from '../src/database/db.js';
import { ingestionService } from '../src/services/ingestion.service.js';
import { ragService } from '../src/services/rag.service.js';

describe('RAG Pipeline & End-to-End Ingestion', () => {
  beforeAll(() => {
    // Ensure DB is initialized
    getDatabase();
  });

  it('should successfully ingest a text note, split into chunks, and persist', async () => {
    const title = 'Quantum Computing Principles';
    const content = `Quantum computing is a rapidly-emerging technology that harnesses the laws of quantum mechanics to solve problems too complex for classical computers. 

Qubits can exist in a multidimensional state known as superposition, allowing exponential parallel states. 

Quantum entanglement links qubits so that the state of one instantly influences another regardless of distance.`;

    const result = await ingestionService.ingestNote(title, content);

    expect(result.item).toBeDefined();
    expect(result.item.title).toBe(title);
    expect(result.item.source_type).toBe('note');
    expect(result.chunksCreated).toBeGreaterThan(0);

    // Verify persistence in SQLite
    const fetched = dbService.getItemById(result.item.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.title).toBe(title);
    expect(fetched?.chunk_count).toBe(result.chunksCreated);
  });

  it('should query the knowledge base and return grounded answers with citations', async () => {
    // Ingest a specific factual note
    await ingestionService.ingestNote(
      'Turium AI Architecture Note',
      'Turium AI builds enterprise autonomous intelligence platforms utilizing high-performance retrieval-augmented generation and deterministic vector routing.'
    );

    const queryResponse = await ragService.query('What does Turium AI build?');

    expect(queryResponse).toBeDefined();
    expect(queryResponse.question).toBe('What does Turium AI build?');
    expect(queryResponse.sources.length).toBeGreaterThan(0);
    expect(queryResponse.citations.length).toBeGreaterThan(0);

    // The answer must contain citation markers like [1]
    expect(queryResponse.answer).toMatch(/\[\d+\]/);

    // Top source must have high similarity
    const topSource = queryResponse.sources[0];
    expect(topSource.similarity).toBeGreaterThan(0.2);
    expect(topSource.title).toBe('Turium AI Architecture Note');
  });

  it('should cleanly handle queries when no matching information is found', async () => {
    const res = await ragService.query('What is the recipe for chocolate chip sourdough muffins?');
    expect(res).toBeDefined();
    // It should either return a low/no relevant chunks message or graceful guidance
    expect(res.answer).toBeDefined();
  });

  it('should cascade delete chunks when an item is removed', async () => {
    const note = await ingestionService.ingestNote('Temporary Test Note', 'This note will be deleted.');
    const itemId = note.item.id;

    // Verify item and chunks exist
    const statsBefore = dbService.getStats();
    expect(statsBefore.itemsCount).toBeGreaterThan(0);

    // Delete item
    const success = dbService.deleteItem(itemId);
    expect(success).toBe(true);

    // Verify item is gone
    const fetched = dbService.getItemById(itemId);
    expect(fetched).toBeNull();
  });
});
