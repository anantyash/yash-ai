import path from "path";
import { fileURLToPath } from "url";
import { ingestionService } from "../src/services/rag/ingestion.service.js";
import { logger } from "../src/utils/logger.js";
import { pool } from "../src/db/client.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const knowledgeDir = path.resolve(__dirname, "../../knowledge");
  try {
    const result =
      await ingestionService.ingestKnowledgeDirectory(knowledgeDir);
    logger.info(result, "✨ Ingestion pipeline finished successfully");
  } catch (error) {
    logger.error({ err: error }, "Ingestion pipeline failed");
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
