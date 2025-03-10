-- Add PasswordHash column to members table
ALTER TABLE members ADD COLUMN password_hash TEXT NOT NULL;
