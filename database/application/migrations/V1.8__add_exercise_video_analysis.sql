CREATE TABLE exercise_videos (
     id SERIAL PRIMARY KEY,
     member_id INT NOT NULL,
     file_path TEXT NOT NULL, 
     analysis_result TEXT,
     created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (member_id) REFERENCES members(id)
);