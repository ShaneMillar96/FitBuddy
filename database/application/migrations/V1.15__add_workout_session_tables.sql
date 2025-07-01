-- Create workout session tables for tracking active workout sessions

-- Create enum types for session management
CREATE TYPE session_status AS ENUM ('not_started', 'active', 'paused', 'completed', 'abandoned');
CREATE TYPE exercise_status AS ENUM ('not_started', 'in_progress', 'completed', 'skipped');
CREATE TYPE set_status AS ENUM ('not_started', 'in_progress', 'completed', 'skipped');

-- Main workout session table
CREATE TABLE workout_sessions (
    id VARCHAR(50) PRIMARY KEY,
    workout_id INTEGER NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    status session_status NOT NULL DEFAULT 'not_started',
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    paused_at TIMESTAMP WITH TIME ZONE,
    total_paused_time_seconds INTEGER NOT NULL DEFAULT 0,
    current_exercise_index INTEGER NOT NULL DEFAULT 0,
    session_notes TEXT,
    created_by_id INTEGER NOT NULL REFERENCES members(id),
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by_id INTEGER REFERENCES members(id),
    modified_date TIMESTAMP WITH TIME ZONE
);

-- Exercise progress tracking within a session
CREATE TABLE session_exercise_progress (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(50) NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
    exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    order_in_workout INTEGER NOT NULL,
    status exercise_status NOT NULL DEFAULT 'not_started',
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    total_time_seconds INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    
    -- Planned values from workout design
    planned_sets INTEGER,
    planned_reps INTEGER,
    planned_weight_kg DECIMAL(6,2),
    planned_distance_meters INTEGER,
    planned_duration_seconds INTEGER,
    planned_rest_seconds INTEGER,
    
    UNIQUE(session_id, exercise_id),
    UNIQUE(session_id, order_in_workout)
);

-- Set progress tracking for each exercise
CREATE TABLE session_set_progress (
    id SERIAL PRIMARY KEY,
    exercise_progress_id INTEGER NOT NULL REFERENCES session_exercise_progress(id) ON DELETE CASCADE,
    set_number INTEGER NOT NULL,
    status set_status NOT NULL DEFAULT 'not_started',
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    
    -- Actual achieved values
    actual_reps INTEGER,
    actual_weight_kg DECIMAL(6,2),
    actual_distance_meters INTEGER,
    actual_duration_seconds INTEGER,
    
    -- Rest period tracking
    rest_start_time TIMESTAMP WITH TIME ZONE,
    rest_end_time TIMESTAMP WITH TIME ZONE,
    actual_rest_seconds INTEGER,
    
    notes TEXT,
    rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10), -- Rate of Perceived Exertion
    
    UNIQUE(exercise_progress_id, set_number)
);

-- Create indexes for performance
CREATE INDEX idx_workout_sessions_member_status ON workout_sessions(member_id, status);
CREATE INDEX idx_workout_sessions_workout_id ON workout_sessions(workout_id);
CREATE INDEX idx_workout_sessions_created_date ON workout_sessions(created_date);
CREATE INDEX idx_session_exercise_progress_session_id ON session_exercise_progress(session_id);
CREATE INDEX idx_session_exercise_progress_exercise_id ON session_exercise_progress(exercise_id);
CREATE INDEX idx_session_set_progress_exercise_progress_id ON session_set_progress(exercise_progress_id);

-- Add constraints
ALTER TABLE workout_sessions ADD CONSTRAINT chk_session_times 
    CHECK (start_time IS NULL OR end_time IS NULL OR start_time <= end_time);

ALTER TABLE session_exercise_progress ADD CONSTRAINT chk_exercise_times 
    CHECK (start_time IS NULL OR end_time IS NULL OR start_time <= end_time);

ALTER TABLE session_set_progress ADD CONSTRAINT chk_set_times 
    CHECK (start_time IS NULL OR end_time IS NULL OR start_time <= end_time);

ALTER TABLE session_set_progress ADD CONSTRAINT chk_rest_times 
    CHECK (rest_start_time IS NULL OR rest_end_time IS NULL OR rest_start_time <= rest_end_time);

-- Add check constraint to ensure only one active session per member
CREATE UNIQUE INDEX idx_one_active_session_per_member 
    ON workout_sessions(member_id) 
    WHERE status IN ('active', 'paused');

-- Comments for documentation
COMMENT ON TABLE workout_sessions IS 'Tracks active and completed workout sessions for real-time workout execution';
COMMENT ON TABLE session_exercise_progress IS 'Tracks progress of individual exercises within a workout session';
COMMENT ON TABLE session_set_progress IS 'Tracks progress of individual sets within each exercise during a session';

COMMENT ON COLUMN workout_sessions.total_paused_time_seconds IS 'Total time the session was paused, used to calculate accurate workout duration';
COMMENT ON COLUMN workout_sessions.current_exercise_index IS 'Index of the exercise currently being performed in the session';
COMMENT ON COLUMN session_exercise_progress.order_in_workout IS 'Order in which this exercise appears in the workout';
COMMENT ON COLUMN session_set_progress.rpe IS 'Rate of Perceived Exertion on a scale of 1-10';