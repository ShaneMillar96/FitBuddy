-- V1.14: Add workout favorites table to track user favorite workouts
-- This migration creates the workout_favorites table for proper favorites functionality

-- Create workout_favorites table
CREATE TABLE workout_favorites (
    id SERIAL PRIMARY KEY,
    member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    workout_id INTEGER NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    created_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(member_id, workout_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_workout_favorites_member_id ON workout_favorites(member_id);
CREATE INDEX idx_workout_favorites_workout_id ON workout_favorites(workout_id);
CREATE INDEX idx_workout_favorites_created_date ON workout_favorites(created_date);

-- Add comments for documentation
COMMENT ON TABLE workout_favorites IS 'Stores favorite workout relationships between members and workouts';
COMMENT ON COLUMN workout_favorites.id IS 'Primary key for the workout favorite entry';
COMMENT ON COLUMN workout_favorites.member_id IS 'Foreign key to members table - who favorited the workout';
COMMENT ON COLUMN workout_favorites.workout_id IS 'Foreign key to workouts table - which workout was favorited';
COMMENT ON COLUMN workout_favorites.created_date IS 'When the workout was favorited';