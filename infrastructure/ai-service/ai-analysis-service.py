import cv2
import mediapipe as mp
import numpy as np
from flask import Flask, request, jsonify
import os

app = Flask(__name__)
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

def analyze_video(video_path, exercise_type):
    cap = cv2.VideoCapture(video_path)
    feedback_set = set()  # Use a set to store unique feedback messages

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Convert to RGB for MediaPipe
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image)

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
            if exercise_type.lower() == "squat":
                hip_y = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y
                knee_y = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y
                if hip_y < knee_y + 0.1:  # Shallow squat detected
                    feedback_set.add("Increase squat depth: hips should go lower than knees.")
                # Add more conditions here (e.g., back angle)
            # Add more exercise types here (e.g., "snatch", "jerk")

    cap.release()
    
    # Convert set to list for JSON response
    feedback = list(feedback_set) if feedback_set else ["Good form detected!"]
    return {"feedback": feedback}

@app.route('/analyze', methods=['POST'])
def analyze():
    file = request.files['video']
    exercise_type = request.form['exercise_type']
    file_path = os.path.join("/tmp", file.filename)
    file.save(file_path)
    result = analyze_video(file_path, exercise_type)
    os.remove(file_path) 
    return jsonify(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)