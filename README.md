# AI Knowledge Inbox

> **Enterprise-grade, lightweight personal AI knowledge management application powered by Semantic Search and Retrieval-Augmented Generation (RAG).**
>
> Developed for the **Turium AI (Enterprise AI) Full Stack Developer Technical Assessment**.

---

## 1. Project Overview

**AI Knowledge Inbox** is a full-stack, single-user knowledge management application designed to ingest, index, search, and interact with personal notes and web articles using Artificial Intelligence.

Instead of relying on complex multi-container infrastructure or external vector databases, the application implements an efficient **in-engine RAG architecture**.

### How It Works

- **Content Ingestion:** Extracts raw text from notes and HTML web pages using server-side processing with SSRF protection.
- **Semantic Chunking:** Splits content using a paragraph-aware recursive chunking algorithm with contextual overlap.
- **Vector Embeddings:** Generates and stores normalized embedding vectors directly in SQLite.
- **Semantic Retrieval:** Performs in-memory cosine similarity searches to identify the most relevant content.
- **Grounded AI Responses:** Constructs context-bounded prompts and generates answers using retrieved information.
- **Source Citations:** Provides clickable inline citations (`[1]`, `[2]`) linked to supporting source snippets.

The application supports two operating modes:

1. **Local Mode:** Uses deterministic local vectorization and extractive grounding without requiring an external AI API key.
2. **OpenAI Mode:** Integrates OpenAI `text-embedding-3-small` and `gpt-4o-mini` when an `OPENAI_API_KEY` is configured.

---

## 2. Problem Statement

Modern knowledge workers collect notes, documentation, articles, and research across multiple disconnected platforms.

Traditional keyword-based search methods, such as `Ctrl + F` or SQL `LIKE` queries, often fail when users search using different terminology from the original content.

For example, a user searching for:

"How do qubits achieve parallel states?"

may not find relevant information in a document discussing:

"Quantum Superposition."

Additionally, traditional LLM chat interfaces can produce hallucinations, rely on outdated knowledge, and fail to provide citations from a user's personal sources.

### Proposed Solution

AI Knowledge Inbox addresses these challenges through:

1. **Unified Ingestion:** Save personal notes and web URLs in one centralized application.
2. **Semantic Search:** Retrieve information based on meaning rather than exact keyword matches.
3. **Grounded RAG:** Generate answers using retrieved source content rather than relying entirely on the model's internal knowledge.
4. **Source Citations:** Provide verifiable references linked directly to the original content.
5. **Lightweight Architecture:** Use SQLite for persistent storage without requiring Docker or an external vector database.

---

## 3. Key Features

### Knowledge Management
- Save plain-text and Markdown notes with titles and timestamps.
- Ingest web articles through URLs.
- View and manage saved knowledge.
- Delete saved items with automatic associated chunk cleanup.

### Intelligent Content Processing
- Server-side URL fetching and HTML parsing using Cheerio.
- Removes irrelevant HTML elements such as navigation, scripts, styles, and footers.
- Extracts meaningful article content.
- Implements SSRF protection against localhost, private network addresses, and cloud metadata endpoints.
- Uses paragraph-aware recursive chunking with contextual overlap.

### Semantic Search and RAG
- Generates vector embeddings using OpenAI or a deterministic local fallback.
- Stores serialized embeddings in SQLite.
- Performs cosine similarity-based semantic retrieval.
- Retrieves the most relevant content chunks.
- Constructs bounded context for grounded AI responses.
- Supports numbered citations linked to original source snippets.

### User Interface
- Minimalist SaaS-inspired dark interface.
- Responsive React and Tailwind CSS layout.
- Interactive source citations.
- Expandable source snippets.
- Match-percentage indicators.
- Knowledge management sidebar and quick actions.

### Reliability and Testing
- Zod-based request validation.
- Centralized error handling.
- Structured request logging.
- SQLite foreign-key constraints and WAL mode.
- Automated unit and integration tests.

---

## 4. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 | Component-based UI |
| Language | TypeScript | Type safety |
| Build Tool | Vite | Fast development and HMR |
| Styling | Tailwind CSS | Responsive UI |
| Icons | Lucide React | Lightweight icons |
| Backend | Node.js | Server-side runtime |
| Framework | Express.js | REST API development |
| Database | SQLite (`node:sqlite`) | Persistent storage |
| Validation | Zod | Runtime request validation |
| Web Scraping | Cheerio | HTML parsing and extraction |
| AI Embeddings | OpenAI `text-embedding-3-small` | Semantic vector generation |
| AI Generation | OpenAI `gpt-4o-mini` | Grounded answer generation |
| Fallback Engine | 256-dimensional deterministic vectorizer | Local semantic retrieval |
| Testing | Vitest | Unit and integration testing |

---

## 5. System Architecture

The application follows a modular client-server architecture.

```text
                 +--------------------------------+
                 |         Browser Client         |
                 |   React + TypeScript + Vite    |
                 +---------------+----------------+
                                 |
                           REST HTTP / JSON
                                 |
                                 v
                 +--------------------------------+
                 |        Express Backend         |
                 |       TypeScript REST API      |
                 +---------------+----------------+
                                 |
          +----------------------+----------------------+
          |                      |                      |
          v                      v                      v
 +----------------+    +----------------+    +----------------+
 | Ingestion Svc  |    | Vector Engine  |    | RAG Pipeline   |
 |                |    |                |    |                |
 | Cheerio        |    | Cosine Similarity|   | Context Build  |
 | SSRF Protection|    | Top-K Ranking  |    | OpenAI LLM     |
 | Text Chunking  |    | Vector Retrieval|   | Citations      |
 +-------+--------+    +-------+--------+    +-------+--------+
         |                     |                     |
         +---------------------+---------------------+
                               |
                               v
                 +--------------------------------+
                 |         SQLite Database        |
                 |                                |
                 |  items: Notes and URLs         |
                 |  chunks: Text and Embeddings   |
                 |  WAL Mode                      |
                 +--------------------------------+
```

---

## 6. RAG (Retrieval-Augmented Generation) Workflow

The application uses Retrieval-Augmented Generation to answer questions based on the user's saved knowledge.

### Processing Flow

```text
       [ User Enters a Question ]
                   |
                   v
           [ POST /query ]
                   |
                   v
       [ Generate Query Embedding ]
                   |
          +--------+--------+
          |                 |
          v                 v
      OpenAI API       Local Vectorizer
          |                 |
          +--------+--------+
                   |
                   v
       [ Cosine Similarity Search ]
                   |
                   v
          [ Retrieve Top-K Chunks ]
                   |
                   v
           [ Context Assembly ]
                   |
                   v
          [ Grounded LLM Prompt ]
                   |
                   v
          [ Generate AI Answer ]
                   |
                   v
          [ Attach Source Citations ]
                   |
                   v
          [ Display Interactive UI ]
```

### RAG Processing Steps

**Step 1: Query Embedding**

The user's question is converted into a numerical vector using OpenAI embeddings or the local fallback vectorizer.

**Step 2: Semantic Retrieval**

The generated query vector is compared with stored content embeddings using cosine similarity.

**Step 3: Top-K Selection**

The most relevant chunks are selected based on similarity scores and retrieval limits.

**Step 4: Context Construction**

Retrieved chunks are organized into numbered source references and passed to the generation layer.

**Step 5: Grounded Generation**

The LLM receives instructions to answer exclusively from the supplied context and avoid unsupported assumptions.

**Step 6: Citation Rendering**

The generated response includes numbered citations such as `[1]` and `[2]`, which users can click to inspect supporting content.

### Cosine Similarity Formula

\[
\text{Similarity}(A,B)=
\frac{A\cdot B}{\|A\|\|B\|}
\]

This measures the similarity between two vectors based on their directional alignment.

---

## 7. Database Schema

The application uses SQLite for persistent storage.

The database is configured with:

- Write-Ahead Logging (WAL).
- Foreign-key constraints.
- Automatic cascade deletion.
- Indexes for efficient lookups.

### Items Table

Stores original notes and ingested web pages.

```sql
CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    source_type TEXT NOT NULL
        CHECK(source_type IN ('note', 'url')),
    source_url TEXT,
    raw_content TEXT NOT NULL,
    created_at TEXT NOT NULL
);
```

### Chunks Table

Stores individual content chunks and their serialized embedding vectors.

```sql
CREATE TABLE IF NOT EXISTS chunks (
    id TEXT PRIMARY KEY,
    item_id TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    chunk_content TEXT NOT NULL,
    embedding TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (item_id)
        REFERENCES items(id)
        ON DELETE CASCADE
);
```

### Database Configuration

```sql
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

CREATE INDEX IF NOT EXISTS idx_chunks_item_id
ON chunks(item_id);

CREATE INDEX IF NOT EXISTS idx_items_created_at
ON items(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_items_source_type
ON items(source_type);
```

---

## 8. REST API Documentation

**Base URL:** `http://localhost:5000`

The frontend communicates with the backend through REST APIs, using the Vite development proxy where configured.

### 8.1 GET /health

Returns backend health information, database status, item and chunk counts, and active AI configuration.

### 8.2 POST /ingest

Ingests a text note or website URL, processes its content, generates embeddings, and stores the result in SQLite.

**Example: Adding a Note**

```json
{
  "type": "note",
  "title": "Turium AI Architecture Note",
  "content": "Enterprise AI knowledge management using RAG."
}
```

**Example: Adding a URL**

```json
{
  "type": "url",
  "url": "https://en.wikipedia.org/wiki/Artificial_intelligence",
  "title": "Artificial Intelligence"
}
```

### 8.3 GET /items

Retrieves all saved notes and URLs, including their metadata and chunk counts.

### 8.4 POST /query

Performs semantic retrieval and generates a grounded response with source citations.

**Example Request**

```json
{
  "question": "What does Turium AI build?",
  "topK": 5
}
```

**Example Response**

```json
{
  "success": true,
  "data": {
    "question": "What does Turium AI build?",
    "answer": "The answer based on retrieved knowledge [1].",
    "citations": [
      {
        "citationNumber": 1,
        "chunkId": "example-chunk-id",
        "itemId": "example-item-id",
        "title": "Architecture Note",
        "sourceType": "note",
        "sourceUrl": null
      }
    ],
    "sources": [],
    "model": "gpt-4o-mini",
    "processingTimeMs": 285
  }
}
```

*The above is an illustrative response structure.*

### 8.5 DELETE /items/:id

Deletes a saved item and automatically removes its associated chunks through SQLite foreign-key cascade constraints.

---

## 9. Project Folder Structure

```text
ai-knowledge-inbox/
|
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- database/
|   |   |   |-- schema.ts
|   |   |   |-- db.ts
|   |   |-- services/
|   |   |   |-- ingestion.service.ts
|   |   |   |-- embedding.service.ts
|   |   |   |-- vector.service.ts
|   |   |   |-- rag.service.ts
|   |   |-- controllers/
|   |   |-- routes/
|   |   |-- middleware/
|   |   |-- utils/
|   |   |-- types/
|   |   |-- app.ts
|   |   |-- server.ts
|   |
|   |-- tests/
|   |-- package.json
|   |-- tsconfig.json
|   |-- .env.example
|
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- hooks/
|   |   |-- services/
|   |   |-- types/
|   |   |-- App.tsx
|   |   |-- main.tsx
|   |   |-- index.css
|   |
|   |-- index.html
|   |-- package.json
|   |-- vite.config.ts
|   |-- tailwind.config.js
|
|-- package.json
|-- .gitignore
|-- .env.example
|-- README.md
```

---

## 10. Installation and Setup

### Prerequisites

- Node.js 22 or a compatible version supporting `node:sqlite`.
- npm 9 or higher.
- Git.

### Step 1: Clone the Repository

```bash
git clone https://github.com/keerthana-0712/ai-knowledge-inbox.git

cd ai-knowledge-inbox
```

### Step 2: Install Dependencies

From the project root:

```bash
npm run install:all
```

Alternatively, install dependencies separately inside the backend and frontend directories.

### Step 3: Configure Environment Variables

Copy the example environment file:

```bash
cp backend/.env.example backend/.env
```

Configure the environment variables in `backend/.env`:

```env
PORT=5000
NODE_ENV=development

CORS_ORIGIN=http://localhost:5173

DATABASE_PATH=./data/knowledge_inbox.db

# Optional OpenAI configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1

OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_CHAT_MODEL=gpt-4o-mini

CHUNK_SIZE=600
CHUNK_OVERLAP=100

MAX_RETRIEVAL_CHUNKS=5
MIN_SIMILARITY_THRESHOLD=0.15
```

**Note:** OpenAI configuration is optional. Without an API key, the application uses its local fallback engine.

Never commit actual API keys or private environment files to GitHub.

---

## 11. Running the Application

### Option A: Run Both Services Together

From the root directory:

```bash
npm run dev
```

Expected development addresses:

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |

### Option B: Run Services Individually

**Terminal 1 – Backend**

```bash
cd backend
npm run dev
```

**Terminal 2 – Frontend**

```bash
cd frontend
npm run dev
```

Open the application:

http://localhost:5173

---

## 12. Automated Testing

The project includes a test suite covering the main application logic and REST API functionality.

The documented test coverage includes:

| Test Suite | Coverage |
|---|---|
| similarity.test.ts | Vector mathematics and cosine similarity |
| chunker.test.ts | Text chunking and contextual overlap |
| ssrf.test.ts | URL validation and SSRF protection |
| rag.test.ts | Ingestion, retrieval, grounding and deletion |
| api.test.ts | REST API integration tests |

**Documented test count:** 27 tests across 5 test suites.

Run the tests:

```bash
npm test
```

Or:

```bash
cd backend
npm test
```

*Verify the actual test output before reporting that all 27 tests pass.*

---

## 13. Technical Decisions and Trade-Offs

### 13.1 Why SQLite?

SQLite was selected to keep the application lightweight and self-contained.

Advantages:

- No external database server required.
- No Docker infrastructure required.
- ACID-compliant transactions.
- Foreign-key constraints and cascade deletion.
- Portable file-based storage.
- WAL mode for improved read/write concurrency.

It is appropriate for the single-user scope and relatively small knowledge collections targeted by this assessment.

### 13.2 Why Paragraph-Aware Chunking?

The application uses a target chunk size of approximately 600 characters with 100-character overlap.

The strategy:

- Preserves paragraph boundaries wherever possible.
- Respects sentence boundaries.
- Maintains contextual continuity between adjacent chunks.
- Reduces loss of important information during retrieval.

### 13.3 Why Cosine Similarity?

Cosine similarity measures the directional similarity between query and document embeddings.

For a single-user knowledge inbox containing a relatively small number of chunks, an in-memory similarity scan avoids the operational complexity of an external vector database.

### 13.4 Why Not Use an External Vector Database?

External systems such as Pinecone, Qdrant, Milvus, and Weaviate introduce additional infrastructure, network communication, authentication, and operational overhead.

For the scope of this application, SQLite provides:

- Local vector storage.
- Consistent metadata and embedding management.
- No additional network dependency.
- Simplified backups and deployment.

---

## 14. What Breaks at Scale and the Production Path

The current architecture is intentionally optimized for a lightweight, single-user application.

However, several limitations would appear as the system grows.

### Potential Scaling Bottlenecks

1. **Vector Retrieval:** Exhaustive in-memory similarity scans become more expensive as the number of chunks increases.
2. **Memory Consumption:** Loading large embedding collections into memory increases process memory usage.
3. **Single-Node Storage:** A local SQLite database is not designed for unrestricted horizontal scaling across multiple independent application instances.

### Proposed Production Improvements

**1. PostgreSQL with pgvector**

- Migrate persistent storage to PostgreSQL.
- Use vector indexing strategies such as HNSW or IVFFlat.
- Support efficient approximate nearest-neighbor retrieval.

**2. Background Processing**

- Introduce BullMQ and Redis for asynchronous ingestion.
- Move expensive URL processing and embedding generation into background workers.
- Provide processing status through Server-Sent Events or WebSockets.

**3. Embedding Caching**

- Cache content hashes and generated embeddings.
- Avoid unnecessary embedding generation for duplicate content.

**4. Authentication and Multi-Tenancy**

- Introduce JWT or OAuth-based authentication.
- Isolate user data.
- Implement appropriate tenant-level authorization.

**5. Rate Limiting and Token Budgeting**

- Introduce API rate limiting.
- Track token consumption.
- Control AI API usage per user.

**6. Observability**

- Integrate OpenTelemetry.
- Monitor retrieval performance.
- Track generation latency and token usage.
- Improve debugging and production monitoring.

---

## 15. Known Limitations

1. **Single-User Application:** Authentication, user accounts, and multi-tenant authorization are outside the current implementation scope.
2. **JavaScript-Rendered Websites:** The scraper uses native HTTP fetching and Cheerio. Websites requiring client-side JavaScript execution may not return complete article content.
3. **Paywalled Content:** Websites requiring authentication or protected access may prevent successful extraction.
4. **Local Vector Search:** In-memory exhaustive vector scanning is not intended for very large datasets.

---

## 16. Future Improvements

Potential enhancements include:

- **Hybrid Search:** Combine keyword-based BM25 search with vector similarity using Reciprocal Rank Fusion.
- **Document Ingestion:** Support PDF and DOCX uploads.
- **Reranking:** Add cross-encoder reranking to improve retrieval relevance.
- **Conversation History:** Support multi-turn conversations using previous queries and retrieved context.
- **Advanced Retrieval:** Explore metadata filtering and more efficient vector indexing.

---

## 17. Assessment Requirement Verification

The following checklist reflects the documented implementation scope.

- [x] Single-user personal knowledge inbox.
- [x] Add and save text notes.
- [x] Ingest website URLs.
- [x] Server-side HTML extraction.
- [x] SSRF protection.
- [x] Paragraph-aware text chunking.
- [x] Contextual chunk overlap.
- [x] OpenAI embedding integration.
- [x] Local embedding fallback.
- [x] SQLite vector storage.
- [x] Cosine similarity retrieval.
- [x] Top-K semantic search.
- [x] Grounded RAG pipeline.
- [x] Numbered source citations.
- [x] Interactive source snippets.
- [x] REST API implementation.
- [x] React and TypeScript frontend.
- [x] Responsive user interface.
- [x] Automated test coverage.
- [x] Technical architecture and trade-off documentation.

---

## 18. Repository

**GitHub:** https://github.com/keerthana-0712/ai-knowledge-inbox

---

**Built with pride for Turium AI (Enterprise AI).**
