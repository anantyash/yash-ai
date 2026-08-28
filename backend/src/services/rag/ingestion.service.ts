import fs from "fs";
import path from "path";
import { vectorRepository } from "../../repositories/vector.repository.js";
import { openaiService } from "../ai/openai.service.js";
import { logger } from "../../utils/logger.js";

export interface KnowledgeDocument {
  id: string;
  title: string;
  slug: string;
  category: string;
  filePath: string;
  content: string;
}

export class IngestionService {
  private chunkMarkdown(content: string, maxChunkLength = 700): string[] {
    const rawSections = content.split(/\n(?=#{1,3}\s)/g);
    const mergedSections: string[] = [];

    // Merge short heading-only sections with the following section
    for (let i = 0; i < rawSections.length; i++) {
      const current = rawSections[i].trim();
      if (!current) continue;

      if (current.length < 80 && i + 1 < rawSections.length) {
        rawSections[i + 1] = `${current}\n\n${rawSections[i + 1].trim()}`;
      } else {
        mergedSections.push(current);
      }
    }

    const chunks: string[] = [];

    for (const section of mergedSections) {
      if (section.length <= maxChunkLength) {
        chunks.push(section);
      } else {
        // Sub-chunk by paragraphs
        const paragraphs = section.split(/\n\n+/);
        let currentChunk = "";

        for (const p of paragraphs) {
          if (
            (currentChunk + "\n\n" + p).length > maxChunkLength &&
            currentChunk.length > 0
          ) {
            chunks.push(currentChunk.trim());
            currentChunk = p;
          } else {
            currentChunk = currentChunk ? currentChunk + "\n\n" + p : p;
          }
        }

        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim());
        }
      }
    }

    return chunks.filter((c) => c.length >= 30);
  }

  async ingestKnowledgeDirectory(
    knowledgeDir: string,
  ): Promise<{ documents: number; chunks: number }> {
    logger.info({ knowledgeDir }, "Starting knowledge ingestion pipeline...");

    const readFilesRecursively = (dir: string): string[] => {
      let results: string[] = [];
      const list = fs.readdirSync(dir);
      for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          results = results.concat(readFilesRecursively(fullPath));
        } else if (file.endsWith(".md")) {
          results.push(fullPath);
        }
      }
      return results;
    };

    const files = readFilesRecursively(knowledgeDir);
    let totalChunks = 0;

    for (const filePath of files) {
      const rawContent = fs.readFileSync(filePath, "utf8");
      const relativePath = path
        .relative(knowledgeDir, filePath)
        .replace(/\\/g, "/");
      const slug = relativePath.replace(/\.md$/, "").replace(/\//g, "-");
      const filename = path.basename(filePath, ".md");
      const title = filename
        .split("-")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
      const category = relativePath.includes("/")
        ? relativePath.split("/")[0]
        : "general";

      const docId = `doc_${slug}`;

      logger.info(
        { docId, slug, title, filePath: relativePath },
        "Ingesting document",
      );

      // 1. Upsert document in Postgres
      await vectorRepository.upsertDocument(
        docId,
        title,
        slug,
        category,
        relativePath,
        {
          importedAt: new Date().toISOString(),
        },
      );

      // 2. Remove old chunks for this document
      await vectorRepository.deleteDocumentChunks(docId);

      // 3. Chunk content
      const chunks = this.chunkMarkdown(rawContent);

      // 4. Generate embeddings with document context and insert chunks
      for (let i = 0; i < chunks.length; i++) {
        const chunkContent = chunks[i];
        logger.info({ docId, chunkIndex: i }, "Generating embedding for chunk");

        // Embed enriched text with title and category for high semantic recall
        const textToEmbed = `${title} (${category}):\n${chunkContent}`;
        const embedding = await openaiService.generateEmbedding(textToEmbed);

        await vectorRepository.insertChunk(docId, chunkContent, i, embedding, {
          title,
          source: relativePath,
          category,
        });

        totalChunks++;
      }
    }

    logger.info(
      { totalDocuments: files.length, totalChunks },
      "Knowledge ingestion completed successfully",
    );
    return { documents: files.length, chunks: totalChunks };
  }
}

export const ingestionService = new IngestionService();
