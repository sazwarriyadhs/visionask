-- Database schema for the VisionAsk application
-- Creates the 'visionask' database if it doesn't exist.
CREATE DATABASE IF NOT EXISTS visionask;

-- Use the 'visionask' database.
USE visionask;

-- Table to store information about uploaded documents.
CREATE TABLE IF NOT EXISTS documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    file_size_bytes BIGINT,
    preview_url VARCHAR(2048),
    extracted_text LONGTEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table to store questions asked about a document and the corresponding answers.
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    document_id INT NOT NULL,
    question_text TEXT NOT NULL,
    answer_text LONGTEXT,
    asked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

-- Index to speed up queries for questions related to a specific document.
CREATE INDEX idx_document_id ON questions(document_id);
