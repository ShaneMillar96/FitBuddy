import cv2
import mediapipe as mp
import numpy as np
from flask import Flask, request, jsonify
import os
import logging
from typing import Set

# Configure logging
logging.basicConfig(level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s")

app = Flask(__name__)

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

# Exercise type definitions
EXERCISE_TYPES = {
    "Squat": 1,
    "SquatSnatch": 2,
    "SquatClean": 3,
    "Deadlift": 4
}

class SquatFormAnalyzer:
    def __init__(self):
        self.feedback_set: Set[str] = set()

    def _calculate_squat_depth(self, landmarks) -> float:
        """Calculate squat depth."""
        left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y
        right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y
        left_knee = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y
        right_knee = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y
        return (left_hip + right_hip) / 2 - (left_knee + right_knee) / 2

    def _check_knee_position(self, landmarks) -> bool:
        """Check if knees are too far forward or collapsing inward."""
        left_foot_x = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x
        left_knee_x = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x
        right_foot_x = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x
        right_knee_x = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x
        return abs(left_knee_x - left_foot_x) > 0.25 or abs(right_knee_x - right_foot_x) > 0.25

    def _check_back_angle(self, landmarks) -> bool:
        """Check if back is excessively rounded."""
        shoulder_y = (landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y + 
                      landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y) / 2
        hip_y = (landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y + 
                 landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y) / 2
        return shoulder_y > hip_y + 0.1

    def analyze_squat_form(self, landmarks) -> Set[str]:
        """Analyze squat form and provide coaching feedback."""
        self.feedback_set.clear()
        depth = self._calculate_squat_depth(landmarks)

        # Depth feedback
        if depth < 0.05:
            self.feedback_set.add("Sink your hips lower—aim for knees level with hips for full depth.")
        elif depth > 0.08:
            self.feedback_set.add("Nice depth! Maintain control to protect your knees.")

        # Knee position feedback
        if self._check_knee_position(landmarks):
            self.feedback_set.add("Keep knees in line with your feet—don’t let them drift too far forward or inward.")

        # Back angle feedback
        if self._check_back_angle(landmarks):
            self.feedback_set.add("Straighten your back more—chest up to avoid rounding.")

        return self.feedback_set if self.feedback_set else {"Good squat form—keep it up!"}

class SquatSnatchFormAnalyzer:
    def __init__(self):
        self.feedback_set: Set[str] = set()

    def _calculate_depth(self, landmarks) -> float:
        """Calculate squat depth for snatch."""
        left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y
        right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y
        left_knee = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y
        right_knee = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y
        return (left_hip + right_hip) / 2 - (left_knee + right_knee) / 2

    def _check_overhead_position(self, landmarks) -> bool:
        """Check if arms are locked out overhead."""
        left_elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y
        right_elbow = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y
        left_wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y
        right_wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y
        return left_wrist < left_elbow and right_wrist < right_elbow

    def _check_shoulder_position(self, landmarks) -> bool:
        """Check if shoulders are over or behind bar."""
        shoulder_x = (landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x + 
                      landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x) / 2
        foot_x = (landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x + 
                  landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x) / 2
        return abs(shoulder_x - foot_x) > 0.15  # Shoulders too far forward/back

    def analyze_squat_snatch_form(self, landmarks) -> Set[str]:
        """Analyze squat snatch form and provide coaching feedback."""
        self.feedback_set.clear()
        depth = self._calculate_depth(landmarks)

        # Depth feedback
        if depth < 0.05:
            self.feedback_set.add("Drop deeper into the squat to catch the bar securely.")
        elif depth > 0.08:
            self.feedback_set.add("Solid squat depth—maintain stability overhead.")

        # Overhead position feedback
        if not self._check_overhead_position(landmarks):
            self.feedback_set.add("Lock your elbows fully overhead—don’t let them bend.")

        # Shoulder position feedback
        if self._check_shoulder_position(landmarks):
            self.feedback_set.add("Keep shoulders closer to over the bar—don’t lean too far forward or back.")

        return self.feedback_set if self.feedback_set else {"Great squat snatch form—stay tight!"}

class SquatCleanFormAnalyzer:
    def __init__(self):
        self.feedback_set: Set[str] = set()

    def _calculate_depth(self, landmarks) -> float:
        """Calculate squat depth for clean."""
        left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y
        right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y
        left_knee = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y
        right_knee = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y
        return (left_hip + right_hip) / 2 - (left_knee + right_knee) / 2

    def _check_rack_position(self, landmarks) -> bool:
        """Check if bar is racked properly on shoulders."""
        left_wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y
        right_wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y
        left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y
        right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y
        return abs(left_wrist - left_shoulder) < 0.1 and abs(right_wrist - right_shoulder) < 0.1

    def _check_elbow_position(self, landmarks) -> bool:
        """Check if elbows are high during rack."""
        left_elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y
        right_elbow = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y
        chest_y = (landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y + 
                   landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y) / 2
        return left_elbow < chest_y and right_elbow < chest_y

    def analyze_squat_clean_form(self, landmarks) -> Set[str]:
        """Analyze squat clean form and provide coaching feedback."""
        self.feedback_set.clear()
        depth = self._calculate_depth(landmarks)

        # Depth feedback
        if depth < 0.05:
            self.feedback_set.add("Squat lower to catch the bar—hips should drop more.")
        elif depth > 0.08:
            self.feedback_set.add("Good depth—keep your core braced.")

        # Rack position feedback
        if not self._check_rack_position(landmarks):
            self.feedback_set.add("Rack the bar on your shoulders—keep wrists closer to your body.")

        # Elbow position feedback
        if not self._check_elbow_position(landmarks):
            self.feedback_set.add("Lift your elbows higher to secure the bar in the rack position.")

        return self.feedback_set if self.feedback_set else {"Solid squat clean form—nice work!"}

class DeadliftFormAnalyzer:
    def __init__(self):
        self.feedback_set: Set[str] = set()

    def _calculate_hip_height(self, landmarks) -> float:
        """Track hip height for deadlift."""
        left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y
        right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y
        return (left_hip + right_hip) / 2

    def _check_back_angle(self, landmarks) -> bool:
        """Check if back is excessively rounded."""
        shoulder_y = (landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y + 
                      landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y) / 2
        hip_y = self._calculate_hip_height(landmarks)
        return shoulder_y > hip_y + 0.1

    def _check_hip_position(self, landmarks) -> bool:
        """Check if hips are too high or too low."""
        hip_y = self._calculate_hip_height(landmarks)
        knee_y = (landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y + 
                  landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y) / 2
        return hip_y < knee_y - 0.15 or hip_y > knee_y + 0.15  # Hips too high or too low

    def _check_shoulder_position(self, landmarks) -> bool:
        """Check if shoulders are too far forward."""
        shoulder_x = (landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x + 
                      landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x) / 2
        foot_x = (landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x + 
                  landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x) / 2
        return abs(shoulder_x - foot_x) > 0.2

    def analyze_deadlift_form(self, landmarks) -> Set[str]:
        """Analyze deadlift form and provide coaching feedback."""
        self.feedback_set.clear()

        # Back angle feedback
        if self._check_back_angle(landmarks):
            self.feedback_set.add("Keep your back flat—lift your chest to avoid rounding.")

        # Hip position feedback
        if self._check_hip_position(landmarks):
            self.feedback_set.add("Adjust your hips—keep them between your knees and shoulders for optimal leverage.")

        # Shoulder position feedback
        if self._check_shoulder_position(landmarks):
            self.feedback_set.add("Pull your shoulders back—keep them over the bar.")

        return self.feedback_set if self.feedback_set else {"Great deadlift form—stay strong!"}

def analyze_video(video_path, exercise_type_id: int):
    cap = cv2.VideoCapture(video_path)
    final_feedback = set()
    frame_count = 0

    # Initialize appropriate form analyzer
    if exercise_type_id == EXERCISE_TYPES["Squat"]:
        analyzer = SquatFormAnalyzer()
        analyze_func = analyzer.analyze_squat_form
    elif exercise_type_id == EXERCISE_TYPES["SquatSnatch"]:
        analyzer = SquatSnatchFormAnalyzer()
        analyze_func = analyzer.analyze_squat_snatch_form
    elif exercise_type_id == EXERCISE_TYPES["SquatClean"]:
        analyzer = SquatCleanFormAnalyzer()
        analyze_func = analyzer.analyze_squat_clean_form
    elif exercise_type_id == EXERCISE_TYPES["Deadlift"]:
        analyzer = DeadliftFormAnalyzer()
        analyze_func = analyzer.analyze_deadlift_form
    else:
        return {"feedback": ["Invalid exercise type!"]}

    exercise_name = {v: k for k, v in EXERCISE_TYPES.items()}[exercise_type_id]

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image)

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
            logging.debug(f"Processing frame {frame_count} for {exercise_name}")
            feedback = analyze_func(landmarks)
            final_feedback.update(feedback)

    cap.release()

    # If no issues detected across all frames, provide positive feedback
    if not final_feedback:
        final_feedback.add(f"Excellent {exercise_name.lower()} form throughout—well done!")

    return {"feedback": list(final_feedback)}

@app.route('/analyze', methods=['POST'])
def analyze():
    file = request.files['video']
    exercise_type_id = int(request.form['exercise_type'])
    file_path = os.path.join("/tmp", file.filename)
    file.save(file_path)

    logging.info(f"Received video: {file.filename}, Exercise Type ID: {exercise_type_id}")
    result = analyze_video(file_path, exercise_type_id)
    os.remove(file_path)

    logging.info(f"Returning analysis result: {result}")
    return jsonify(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)