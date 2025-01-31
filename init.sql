-- Create Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(36) PRIMARY KEY NOT NULL,  -- Assuming UUID, adjust if needed
    name VARCHAR(255) NOT NULL,           -- Adjust length if necessary
    createdAt INT NOT NULL,               -- UNIX timestamp (INT)
    updatedAt INT NOT NULL                -- UNIX timestamp (INT)
) ENGINE=InnoDB;

-- Create Documents Table
CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(36) PRIMARY KEY NOT NULL,  -- Assuming UUID, adjust if needed
    title VARCHAR(255) NOT NULL,          -- Adjust length if necessary
    value TEXT NOT NULL,                  -- For larger text content
    subjectId VARCHAR(36) NOT NULL,       -- Foreign key to subjects
    createdAt INT NOT NULL,               -- UNIX timestamp (INT)
    updatedAt INT NOT NULL,               -- UNIX timestamp (INT)
    FOREIGN KEY (subjectId) REFERENCES subjects (id)
        ON DELETE CASCADE                 -- If subject is deleted, delete related documents
        ON UPDATE CASCADE                 -- If subject ID is updated, update the reference
) ENGINE=InnoDB;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subjects_name ON subjects (name);
CREATE INDEX IF NOT EXISTS idx_documents_subjectId ON documents (subjectId);
