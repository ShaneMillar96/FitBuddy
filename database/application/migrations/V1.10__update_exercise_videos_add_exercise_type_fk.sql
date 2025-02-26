ALTER TABLE exercise_videos
    ADD COLUMN exercise_type_id INTEGER REFERENCES exercise_types(id);