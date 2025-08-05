-- Add asked_by column to sessions table to track who asked the question
ALTER TABLE sessions 
ADD COLUMN asked_by TEXT;