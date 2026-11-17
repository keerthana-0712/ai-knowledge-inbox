import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';
import { config } from '../config/index.js';
import { SCHEMA_SQL } from './schema.js';
import { logger } from '../utils/logger.js';
import { Item, Chunk } from '../types/index.js';

let dbInstance: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (dbInstance) {
    return dbInstance;
  }

  const dbPath = config.databasePath;
  const dbDir = path.dirname(dbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    logger.info(`Created database directory at: ${dbDir}`);
  }

  logger.info(`Connecting to SQLite database at: ${dbPath}`);
  dbInstance = new DatabaseSync(dbPath);

  // Initialize schema
  dbInstance.exec(SCHEMA_SQL);
  logger.info('Database schema initialized successfully.');

  return dbInstance;
}

// Data access operations for Items and Chunks

export const dbService = {
  // Items
  insertItem(item: {
    id: string;
    title: string;
    source_type: string;
    source_url: string | null;
    raw_content: string;
    created_at: string;
  }): void {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO items (id, title, source_type, source_url, raw_content, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      item.id,
      item.title,
      item.source_type,
      item.source_url,
      item.raw_content,
      item.created_at
    );
  },

  getAllItems(): Item[] {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT 
        i.id,
        i.title,
        i.source_type,
        i.source_url,
        i.raw_content,
        i.created_at,
        COUNT(c.id) as chunk_count
      FROM items i
      LEFT JOIN chunks c ON i.id = c.item_id
      GROUP BY i.id
      ORDER BY i.created_at DESC
    `);
    const rows = stmt.all() as any[];
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      source_type: r.source_type,
      source_url: r.source_url,
      raw_content: r.raw_content,
      created_at: r.created_at,
      chunk_count: Number(r.chunk_count || 0),
    }));
  },

  getItemById(id: string): Item | null {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT 
        i.id,
        i.title,
        i.source_type,
        i.source_url,
        i.raw_content,
        i.created_at,
        COUNT(c.id) as chunk_count
      FROM items i
      LEFT JOIN chunks c ON i.id = c.item_id
      WHERE i.id = ?
      GROUP BY i.id
    `);
    const row = stmt.get(id) as any;
    if (!row) return null;
    return {
      id: row.id,
      title: row.title,
      source_type: row.source_type,
      source_url: row.source_url,
      raw_content: row.raw_content,
      created_at: row.created_at,
      chunk_count: Number(row.chunk_count || 0),
    };
  },

  deleteItem(id: string): boolean {
    const db = getDatabase();
    // Foreign key with CASCADE will clean up chunks automatically
    const stmt = db.prepare('DELETE FROM items WHERE id = ?');
    const result = stmt.run(id);
    return (result as any)?.changes > 0;
  },

  // Chunks
  insertChunks(
    chunks: Array<{
      id: string;
      item_id: string;
      chunk_index: number;
      chunk_content: string;
      embedding: number[];
      created_at: string;
    }>
  ): void {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO chunks (id, item_id, chunk_index, chunk_content, embedding, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    // Run in a transaction for fast bulk insert
    db.exec('BEGIN TRANSACTION;');
    try {
      for (const c of chunks) {
        stmt.run(
          c.id,
          c.item_id,
          c.chunk_index,
          c.chunk_content,
          JSON.stringify(c.embedding),
          c.created_at
        );
      }
      db.exec('COMMIT;');
    } catch (err) {
      db.exec('ROLLBACK;');
      throw err;
    }
  },

  getAllChunksWithEmbeddings(): Array<{
    id: string;
    item_id: string;
    chunk_index: number;
    chunk_content: string;
    embedding: number[];
    item_title: string;
    source_type: 'note' | 'url';
    source_url: string | null;
  }> {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT 
        c.id,
        c.item_id,
        c.chunk_index,
        c.chunk_content,
        c.embedding,
        i.title as item_title,
        i.source_type,
        i.source_url
      FROM chunks c
      JOIN items i ON c.item_id = i.id
      ORDER BY c.created_at ASC
    `);
    const rows = stmt.all() as any[];
    return rows.map((r) => ({
      id: r.id,
      item_id: r.item_id,
      chunk_index: r.chunk_index,
      chunk_content: r.chunk_content,
      embedding: JSON.parse(r.embedding),
      item_title: r.item_title,
      source_type: r.source_type,
      source_url: r.source_url,
    }));
  },

  getStats(): { itemsCount: number; chunksCount: number } {
    const db = getDatabase();
    const itemCountRow = db.prepare('SELECT COUNT(*) as count FROM items').get() as any;
    const chunkCountRow = db.prepare('SELECT COUNT(*) as count FROM chunks').get() as any;
    return {
      itemsCount: Number(itemCountRow?.count || 0),
      chunksCount: Number(chunkCountRow?.count || 0),
    };
  },
};
