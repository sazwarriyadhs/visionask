# VisionAsk Features

This document outlines the core features of the VisionAsk application.

## 1. Document Upload
- Users can upload documents in various formats, including PDF, JPG, and PNG.
- A simple and intuitive interface allows for easy file selection.

## 2. Text Extraction (OCR)
- The application uses advanced Optical Character Recognition (OCR) to extract text from the uploaded documents.
- The extracted text is displayed to the user for verification and review.

## 3. Intelligent Question Answering
- Users can ask questions in natural language about the content of the document.
- An AI model analyzes the extracted text to provide relevant and accurate answers.

## 4. Interaction History
- Each interaction, including the uploaded document's name, the extracted text, the user's question, and the AI's answer, is saved to a database.
- This allows for future analysis and potential feature enhancements.

## Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS, ShadCN UI
- **Backend/AI:** Genkit, Google Gemini
- **Database:** PostgreSQL
