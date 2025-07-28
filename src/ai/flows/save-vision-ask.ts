'use server';

/**
 * @fileOverview Saves the document text, question, and answer to the database.
 * 
 * - saveVisionAsk - A function that handles saving the vision ask data.
 * - SaveVisionAskInput - The input type for the saveVisionAsk function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

export const SaveVisionAskInputSchema = z.object({
  fileName: z.string().describe('The name of the uploaded file.'),
  ocrText: z.string().describe('The OCR extracted text from the document.'),
  question: z.string().describe('The question about the document content.'),
  answer: z.string().describe('The answer to the question based on the document content.'),
});
export type SaveVisionAskInput = z.infer<typeof SaveVisionAskInputSchema>;

export async function saveVisionAsk(input: SaveVisionAskInput): Promise<void> {
    return saveVisionAskFlow(input);
}

const saveVisionAskFlow = ai.defineFlow(
  {
    name: 'saveVisionAskFlow',
    inputSchema: SaveVisionAskInputSchema,
    outputSchema: z.void(),
  },
  async (input) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const docRes = await client.query(
        'INSERT INTO documents (file_name, ocr_text, created_at) VALUES ($1, $2, NOW()) RETURNING id',
        [input.fileName, input.ocrText]
      );
      const documentId = docRes.rows[0].id;

      await client.query(
        'INSERT INTO interactions (document_id, question, answer, created_at) VALUES ($1, $2, $3, NOW())',
        [documentId, input.question, input.answer]
      );
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
);
