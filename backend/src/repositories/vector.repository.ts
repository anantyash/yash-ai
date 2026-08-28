import { pool } from "../db/client.js";
import { v4 as uuidv4 } from "uuid";

export interface RetrievedChunk {
  chunkId: string;
  documentId: string;
  title: string;
  source: string;
  category: string;
  content: string;
  chunkIndex: number;
  score: number; // 0.0 - 1.0 similarity score
}

export class VectorRepository {
  async upsertDocument(
    id: string,
    title: string,
    slug: string,
    category: string,
    source: string,
    metadata: Record<string, any> = {},
  ): Promise<void> {
    const query = `
      INSERT INTO documents (id, title, slug, category, source, metadata, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        slug = EXCLUDED.slug,
        category = EXCLUDED.category,
        source = EXCLUDED.source,
        metadata = EXCLUDED.metadata,
        updated_at = NOW();
    `;
    await pool.query(query, [
      id,
      title,
      slug,
      category,
      source,
      JSON.stringify(metadata),
    ]);
  }

  async deleteDocumentChunks(documentId: string): Promise<void> {
    await pool.query("DELETE FROM document_chunks WHERE document_id = $1;", [
      documentId,
    ]);
  }

  async insertChunk(
    documentId: string,
    content: string,
    chunkIndex: number,
    embedding: number[],
    metadata: Record<string, any> = {},
  ): Promise<void> {
    const query = `
      INSERT INTO document_chunks (id, document_id, content, chunk_index, embedding, metadata)
      VALUES ($1, $2, $3, $4, $5, $6);
    `;
    // Format embedding array for pgvector literal e.g. '[0.1, 0.2, ...]'
    const vectorLiteral = `[${embedding.join(",")}]`;
    await pool.query(query, [
      uuidv4(),
      documentId,
      content,
      chunkIndex,
      vectorLiteral,
      JSON.stringify(metadata),
    ]);
  }

  async searchSimilarChunks(
    queryEmbedding: number[],
    topK = 4,
    threshold = 0.65,
  ): Promise<RetrievedChunk[]> {
    const vectorLiteral = `[${queryEmbedding.join(",")}]`;
    const query = `
      SELECT 
        c.id AS chunk_id,
        c.document_id,
        d.title,
        d.source,
        d.category,
        c.content,
        c.chunk_index,
        1 - (c.embedding <=> $1::vector) AS score
      FROM document_chunks c
      JOIN documents d ON c.document_id = d.id
      WHERE 1 - (c.embedding <=> $1::vector) >= $2
      ORDER BY c.embedding <=> $1::vector ASC
      LIMIT $3;
    `;

    const { rows } = await pool.query(query, [vectorLiteral, threshold, topK]);

    return rows.map((row) => ({
      chunkId: row.chunk_id,
      documentId: row.document_id,
      title: row.title,
      source: row.source,
      category: row.category,
      content: row.content,
      chunkIndex: row.chunk_index,
      score: parseFloat(row.score.toFixed(4)),
    }));
  }
}

export const vectorRepository = new VectorRepository();
