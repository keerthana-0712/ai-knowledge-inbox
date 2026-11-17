import * as cheerio from 'cheerio';
import { randomUUID } from 'crypto';
import { dbService } from '../database/db.js';
import { chunkText } from '../utils/chunker.js';
import { cleanExtractedText } from '../utils/cleaner.js';
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

    return this.indexIngestedContent({
      title: trimmedTitle,
      sourceType: 'note',
      sourceUrl: null,
      content: trimmedContent,
    });
  }

  /**
   * Ingests a web page via URL.
   */
  async ingestUrl(url: string, customTitle?: string): Promise<IngestResult> {
    const trimmedUrl = url.trim();

    const validation = validateSafeUrl(trimmedUrl);
    if (!validation.isValid) {
      throw new Error(`Invalid or unsafe URL: ${validation.error}`);
    }

    logger.info(`[IngestionService] Fetching URL: ${trimmedUrl}`);

    // Check for ChatGPT shared chat link (Single Page App with public JSON backend)
    const chatGptMatch = trimmedUrl.match(/chatgpt\.com\/share\/([a-zA-Z0-9-]+)/);
    if (chatGptMatch) {
      const shareId = chatGptMatch[1];
      try {
        const apiUrl = `https://chatgpt.com/backend-api/share/${shareId}`;
        const chatGptRes = await fetch(apiUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AI-Knowledge-Inbox/1.0 (+https://turium.ai)',
            Accept: 'application/json',
          },
        });

        if (chatGptRes.ok) {
          const chatData: any = await chatGptRes.json();
          const autoTitle = chatData.title || 'ChatGPT Shared Conversation';
          const parts: string[] = [];

          // Use true chronological conversation flow if available
          const messageList: any[] = Array.isArray(chatData.linear_conversation)
            ? chatData.linear_conversation
            : Object.values(chatData.mapping || {});

          for (const item of messageList) {
            const msg = item.message;
            if (msg && msg.content && Array.isArray(msg.content.parts)) {
              const role =
                msg.author?.role === 'user'
                  ? 'User'
                  : msg.author?.role === 'assistant'
                  ? 'Assistant'
                  : null;

              if (role) {
                const textParts = msg.content.parts.filter(
                  (p: any) =>
                    typeof p === 'string' &&
                    p.trim().length > 0 &&
                    !p.includes('The output of this plugin was redacted')
                );

                if (textParts.length > 0) {
                  const rawTurn = textParts.join('\n\n');
                  const cleanedTurn = cleanExtractedText(rawTurn);
                  if (cleanedTurn.length > 0) {
                    parts.push(`**${role}:**\n\n${cleanedTurn}`);
                  }
                }
              }
            }
          }

          if (parts.length > 0) {
            const conversationText = parts.join('\n\n---\n\n');
            const pageTitle = customTitle?.trim() || autoTitle;
            return this.indexIngestedContent({
              title: pageTitle,
              sourceType: 'url',
              sourceUrl: trimmedUrl,
              content: conversationText,
            });
          }
        }
      } catch (err) {
        logger.warn('[IngestionService] Failed to extract via ChatGPT backend API, falling back to standard HTML parsing', err);
      }
    }

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
        'Could not extract sufficient readable text content from the provided webpage. This page may require client-side JavaScript execution or is protected by a login or captcha. Tip: You can copy and paste the text into an "Add Note" to index it immediately!'
      );
    }

    return this.indexIngestedContent({
      title: pageTitle.slice(0, 200),
      sourceType: 'url',
      sourceUrl: trimmedUrl,
      content: cleanedContent,
    });
  }

  /**
   * Helper method to chunk, vectorize, and persist extracted content into SQLite.
   */
  private async indexIngestedContent(params: {
    title: string;
    sourceType: 'note' | 'url';
    sourceUrl: string | null;
    content: string;
  }): Promise<IngestResult> {
    const { title, sourceType, sourceUrl, content } = params;
    const sanitizedContent = cleanExtractedText(content);
    const itemId = randomUUID();
    const now = new Date().toISOString();

    const textChunks = chunkText(
      sanitizedContent,
      config.chunking.chunkSize,
      config.chunking.chunkOverlap
    );

    if (textChunks.length === 0) {
      throw new Error('Unable to generate semantic chunks from the content.');
    }

    logger.info(`[IngestionService] Generating embeddings for ${textChunks.length} chunks...`);
    const chunkContents = textChunks.map((c) => c.content);
    const embeddings = await embeddingService.generateEmbeddings(chunkContents);

    const item: Item = {
      id: itemId,
      title: title.slice(0, 200),
      source_type: sourceType,
      source_url: sourceUrl,
      raw_content: sanitizedContent,
      created_at: now,
    };

    dbService.insertItem(item);

    const dbChunks = textChunks.map((c, i) => ({
      id: randomUUID(),
      item_id: itemId,
      chunk_index: c.index,
      chunk_content: c.content,
      embedding: embeddings[i],
      created_at: now,
    }));

    dbService.insertChunks(dbChunks);

    logger.info(`[IngestionService] Successfully ingested ${sourceType} '${title}' (${textChunks.length} chunks).`);

    return {
      item: { ...item, chunk_count: textChunks.length },
      chunksCreated: textChunks.length,
      message: `${sourceType === 'note' ? 'Note' : 'Webpage'} '${title}' saved and indexed successfully.`,
    };
  }
}

export const ingestionService = new IngestionService();
