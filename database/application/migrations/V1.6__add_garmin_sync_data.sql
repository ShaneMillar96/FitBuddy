ALTER TABLE workout_results
    ADD COLUMN duration INTEGER,           
    ADD COLUMN avg_heart_rate INTEGER,    
    ADD COLUMN calories_burned INTEGER,    
    ADD COLUMN garmin_activity_id VARCHAR(50); 