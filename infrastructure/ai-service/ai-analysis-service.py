import cv2
import mediapipe as mp
import numpy as np
from flask import Flask, request, jsonify
import os

app = Flask(__name__)
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

def analyze_video(video_path, exercise_type):
    cap = cv2.VideoCapture(video_path)
    feedback_set = set()  
    squat_detected = False
    deep_squat_threshold = 0.01  

    max_squat_depth = 0.0  

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image)

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
            hip_y = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y
            knee_y = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y

            # Debug print (optional, remove in production)
            print(f"Hip Y: {hip_y}, Knee Y: {knee_y}")

            # Only check squat depth in a squatting position (hip below knee)
            if hip_y > knee_y:
                depth_diff = hip_y - knee_y  # Positive when hip is below knee
                max_squat_depth = max(max_squat_depth, depth_diff)

                if not squat_detected:
                    # Mark as shallow only if depth is consistently very low
                    if depth_diff < deep_squat_threshold:
                        feedback_set.add("Increase squat depth: hips should go lower than knees.")
                    else:
                        squat_detected = True  # Mark as deep squat if depth is sufficient
            elif hip_y < knee_y and squat_detected:
                squat_detected = False  # Reset after standing up

    # Final check: If max depth indicates a deep squat, clear shallow feedback
    if max_squat_depth >= 0.03:  # Lowered threshold to 0.03 for your deep squat data (0.063)
        feedback_set.clear()
        feedback_set.add("Good form detected!")

    cap.release()
    
    feedback = list(feedback_set) if feedback_set else ["Good form detected!"]
    return {"feedback": feedback}

@app.route('/analyze', methods=['POST'])
def analyze():
    file = request.files['video']
    exercise_type = request.form['exercise_type']
    file_path = os.path.join("/tmp", file.filename)
    file.save(file_path)
    result = analyze_video(file_path, exercise_type)
    os.remove(file_path)  # Clean up
    return jsonify(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)