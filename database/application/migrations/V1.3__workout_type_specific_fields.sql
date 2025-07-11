-- Add workout-type specific fields to workout_exercises table
-- This allows for flexible exercise data based on workout type (EMOM, AMRAP, etc.)

ALTER TABLE workout_exercises ADD COLUMN workout_type_data JSONB;
ALTER TABLE workout_exercises ADD COLUMN minute_number INT;
ALTER TABLE workout_exercises ADD COLUMN round_number INT;
ALTER TABLE workout_exercises ADD COLUMN sequence_position INT;

-- Add indexes for performance
CREATE INDEX idx_workout_exercises_minute_number ON workout_exercises(minute_number);
CREATE INDEX idx_workout_exercises_round_number ON workout_exercises(round_number);
CREATE INDEX idx_workout_exercises_sequence_position ON workout_exercises(sequence_position);
CREATE INDEX idx_workout_exercises_workout_type_data ON workout_exercises USING GIN(workout_type_data);

-- Add comments for documentation
COMMENT ON COLUMN workout_exercises.workout_type_data IS 'JSONB field containing workout-type specific data (EMOM intervals, Tabata work/rest, etc.)';
COMMENT ON COLUMN workout_exercises.minute_number IS 'For EMOM workouts - which minute this exercise occurs in';
COMMENT ON COLUMN workout_exercises.round_number IS 'For round-based workouts - which round this exercise belongs to';
COMMENT ON COLUMN workout_exercises.sequence_position IS 'Position within a sequence for ordered workouts';