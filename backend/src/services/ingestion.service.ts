import * as cheerio from 'cheerio';
import { randomUUID } from 'crypto';
import { dbService } from '../database/db.js';
import { chunkText } from '../utils/chunker.js';
import { embeddingService } from './embedding.service.js';
import { validateSafeUrl } from '../utils/ssrf.js';
import { logger } from '../utils/logger.js';
import { Item, IngestResult } from '../types/index.js';
import { config } from '../config/index.js';

class IngestionService {
  /**
   * Ingests a plain-text note.
   */
  async ingestNote(title: string, content: string): Promise<IngestResult> {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      throw new Error('Note title cannot be empty.');
    }
    if (!trimmedContent) {
      throw new Error('Note content cannot be empty.');
    }

    const itemId = randomUUID();
    const now = new Date().toISOString();

    // 1. Chunk content
    const textChunks = chunkText(
      trimmedContent,
      config.chunking.chunkSize,
      config.chunking.chunkOverlap
    );

    if (textChunks.length === 0) {
      throw new Error('Unable to extract meaningful text chunks from note content.');
    }

    // 2. Generate embeddings for chunks
    logger.info(`[IngestionService] Generating embeddings for ${textChunks.length} note chunks...`);
    const chunkContents = textChunks.map((c) => c.content);
    const embeddings = await embeddingService.generateEmbeddings(chunkContents);

    // 3. Persist item to database
    const item: Item = {
      id: itemId,
      title: trimmedTitle,
      source_type: 'note',
      source_url: null,
      raw_content: trimmedContent,
      created_at: now,
    };

    dbService.insertItem(item);

    // 4. Persist chunks to database
    const dbChunks = textChunks.map((c, i) => ({
      id: randomUUID(),
      item_id: itemId,
      chunk_index: c.index,
      chunk_content: c.content,
      embedding: embeddings[i],
      created_at: now,
    }));

    dbService.insertChunks(dbChunks);

    logger.info(`[IngestionService] Successfully ingested note '${trimmedTitle}' (${textChunks.length} chunks).`);

    return {
      item: { ...item, chunk_count: textChunks.length },
      chunksCreated: textChunks.length,
      message: `Note '${trimmedTitle}' saved and indexed successfully.`,
    };
  }

  /**
   * Ingests a web page via URL.
   */
  async ingestUrl(url: string, customTitle?: string): Promise<IngestResult> {
    const trimmedUrl = url.trim();

    // 1. SSRF and URL validation
    const validation = validateSafeUrl(trimmedUrl);
    if (!validation.isValid) {
      throw new Error(`Invalid or unsafe URL: ${validation.error}`);
    }

    logger.info(`[IngestionService] Fetching URL: ${trimmedUrl}`);

    // 2. Fetch page content with timeout and user-agent
    let response: Response;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12-second timeout

    try {
      response = await fetch(trimmedUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AI-Knowledge-Inbox/1.0 (+https://turium.ai)',
          Accept: 'text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8',
        },
      });
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error('Connection timed out while fetching webpage.');
      }
      throw new Error(`Failed to fetch webpage: ${err.message}`);
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw new Error(`Webpage returned HTTP status ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    const rawHtml = await response.text();

    if (!rawHtml || rawHtml.trim().length === 0) {
      throw new Error('The target webpage returned empty content.');
    }

    // 3. Extract readable text using Cheerio
    const $ = cheerio.load(rawHtml);

    // Remove noise elements
    $(
      'script, style, nav, footer, header, aside, noscript, svg, iframe, form, button, [aria-hidden="true"]'
    ).remove();

    // Determine title
    let pageTitle = customTitle?.trim() || '';
    if (!pageTitle) {
      pageTitle =
        $('meta[property="og:title"]').attr('content') ||
        $('meta[name="twitter:title"]').attr('content') ||
        $('title').text().trim() ||
        $('h1').first().text().trim() ||
        new URL(trimmedUrl).hostname;
    }

    // Extract main text content
    // Prefer article or main tags if present
    let contentSelector = 'article, main, [role="main"], .content, #content';
    let extractedText = '';

    if ($(contentSelector).length > 0) {
      extractedText = $(contentSelector).text();
    }
    if (!extractedText || extractedText.trim().length < 50) {
      extractedText = $('body').text();
    }

    // Clean whitespace
    const cleanedContent = extractedText
      .replace(/\t/g, ' ')
      .replace(/[ ]{2,}/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();

    if (cleanedContent.length < 30) {
      throw new Error(
        'Could not extract sufficient readable text content from the provided webpage.'
      );
    }

    const itemId = randomUUID();
    const now = new Date().toISOString();

    // 4. Chunk extracted text
    const textChunks = chunkText(
      cleanedContent,
      config.chunking.chunkSize,
      config.chunking.chunkOverlap
    );

    if (textChunks.length === 0) {
      throw new Error('Unable to generate chunks from the extracted web content.');
    }

    // 5. Generate embeddings
    logger.info(`[IngestionService] Generating embeddings for ${textChunks.length} URL chunks...`);
    const chunkContents = textChunks.map((c) => c.content);
    const embeddings = await embeddingService.generateEmbeddings(chunkContents);

    // 6. Persist item to database
    const item: Item = {
      id: itemId,
      title: pageTitle.slice(0, 200),
      source_type: 'url',
      source_url: trimmedUrl,
      raw_content: cleanedContent,
      created_at: now,
    };

    dbService.insertItem(item);

    // 7. Persist chunks
    const dbChunks = textChunks.map((c, i) => ({
      id: randomUUID(),
      item_id: itemId,
      chunk_index: c.index,
      chunk_content: c.content,
      embedding: embeddings[i],
      created_at: now,
    }));

    dbService.insertChunks(dbChunks);

    logger.info(`[IngestionService] Successfully ingested URL '${trimmedUrl}' (${textChunks.length} chunks).`);

    return {
      item: { ...item, chunk_count: textChunks.length },
      chunksCreated: textChunks.length,
      message: `Webpage '${pageTitle}' saved and indexed successfully.`,
    };
  }
}

export const ingestionService = new IngestionService();
