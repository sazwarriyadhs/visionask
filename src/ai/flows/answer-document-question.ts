'use server';

/**
 * @fileOverview Implements the Genkit flow for answering questions about the content of a document.
 *
 * - answerDocumentQuestion - A function that handles the question answering process.
 * - AnswerDocumentQuestionInput - The input type for the answerDocumentQuestion function.
 * - AnswerDocumentQuestionOutput - The return type for the answerDocumentQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerDocumentQuestionInputSchema = z.object({
  ocrText: z.string().describe('The OCR extracted text from the document.'),
  question: z.string().describe('The question about the document content.'),
});
export type AnswerDocumentQuestionInput = z.infer<typeof AnswerDocumentQuestionInputSchema>;

const AnswerDocumentQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the question based on the document content.'),
});
export type AnswerDocumentQuestionOutput = z.infer<typeof AnswerDocumentQuestionOutputSchema>;

export async function answerDocumentQuestion(input: AnswerDocumentQuestionInput): Promise<AnswerDocumentQuestionOutput> {
  return answerDocumentQuestionFlow(input);
}

const answerDocumentQuestionPrompt = ai.definePrompt({
  name: 'answerDocumentQuestionPrompt',
  input: {schema: AnswerDocumentQuestionInputSchema},
  output: {schema: AnswerDocumentQuestionOutputSchema},
  prompt: `You are an expert at answering questions based on document content.\n\nDocument Content: {{{ocrText}}}\n\nQuestion: {{{question}}}\n\nAnswer: `,
});

const answerDocumentQuestionFlow = ai.defineFlow(
  {
    name: 'answerDocumentQuestionFlow',
    inputSchema: AnswerDocumentQuestionInputSchema,
    outputSchema: AnswerDocumentQuestionOutputSchema,
  },
  async input => {
    const {output} = await answerDocumentQuestionPrompt(input);
    return output!;
  }
);
