import cv2
import mediapipe as mp
import numpy as np
from flask import Flask, request, jsonify
import os
import logging
from typing import Set, Optional

# Configure logging
logging.basicConfig(level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s")

app = Flask(__name__)

mp_pose = mp.solutions.pose
pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

EXERCISE_TYPES = {
    "Squat": 1,
    "SquatSnatch": 2,
    "SquatClean": 3,
    "Deadlift": 4
}

class SquatTracker:
    def __init__(self):
        self.is_squatting = False  # Tracks whether a squat is in progress
        self.reps = 0  # Count completed squats
        self.lowest_hip_position = None  # Track deepest hip position in current squat
        self.feedback_set: Set[str] = set()  # Store unique feedback messages
        self.previous_hip_knee_diff = 0.0  # Track previous depth for smoother transitions
        self.squat_phase = "standing"  # Track phase: "standing", "descending", "ascending"
        self.frame_count = 0  # Track frames for timing and stability
        self.min_frames_per_rep = 15  # Minimum frames for a valid rep (adjust for video FPS, e.g., 30 FPS)

    def _calculate_squat_depth(self, landmarks) -> float:
        """Calculate average squat depth using both left and right sides for robustness."""
        left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y
        left_knee = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y
        left_ankle = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y

        right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y
        right_knee = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y
        right_ankle = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y

        # Average positions for symmetry and robustness
        avg_hip = (left_hip + right_hip) / 2
        avg_knee = (left_knee + right_knee) / 2
        avg_ankle = (left_ankle + right_ankle) / 2

        # Depth is positive when hips are below knees
        depth = avg_hip - avg_knee
        return depth

    def _check_knee_position(self, landmarks) -> bool:
        """Check if knees are tracking correctly (not excessively forward or collapsing)."""
        left_foot_x = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x
        left_knee_x = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x
        right_foot_x = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x
        right_knee_x = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x

        left_knee_deviation = abs(left_knee_x - left_foot_x)
        right_knee_deviation = abs(right_knee_x - right_foot_x)

        # Threshold for excessive forward knee travel (normalized 0-1, adjust based on testing)
        return left_knee_deviation > 0.25 or right_knee_deviation > 0.25

    def _check_full_extension(self, depth: float) -> bool:
        """Check if user is fully standing up (hips above knees by a small margin)."""
        return depth < -0.05  # Hips slightly above knees for full extension

    def analyze_squat(self, landmarks) -> Optional[Set[str]]:
        """
        Tracks squat movement with improved rep counting and detailed feedback.
        Returns feedback when a rep is completed or None if still in progress.
        """
        self.frame_count += 1
        depth = self._calculate_squat_depth(landmarks)
        is_fully_extended = self._check_full_extension(depth)

        logging.debug(f"Frame {self.frame_count}: Hip-Knee Depth = {depth}, Phase = {self.squat_phase}")

        # State machine for squat phases
        if self.squat_phase == "standing":
            if depth > 0.03:  # Start descending if hips drop below knees significantly
                self.squat_phase = "descending"
                self.is_squatting = True
                self.lowest_hip_position = depth
                self.feedback_set.clear()
                logging.info("Squat detected: descending started.")
            return None

        elif self.squat_phase == "descending":
            if depth > self.lowest_hip_position:  # Track deepest point
                self.lowest_hip_position = depth
            if depth < 0.03 and self.frame_count > self.min_frames_per_rep:  # Start ascending (reversal point)
                self.squat_phase = "ascending"
                logging.info("Squat detected: ascending started.")

        elif self.squat_phase == "ascending":
            if is_fully_extended and self.frame_count > self.min_frames_per_rep:
                # Rep completed: reset state and provide feedback
                self.is_squatting = False
                self.reps += 1
                self.squat_phase = "standing"
                self.frame_count = 0  # Reset frame count for next rep

                logging.info(f"Squat rep {self.reps} completed. Generating feedback.")

                # Depth feedback (consistent and realistic)
                if self.lowest_hip_position > 0.08:  # Deep squat threshold (adjust based on testing)
                    self.feedback_set.add("Excellent squat depth!")
                elif self.lowest_hip_position > 0.05:  # Moderate depth
                    self.feedback_set.add("Good squat depth, but try to go slightly lower for optimal form.")
                else:
                    self.feedback_set.add("Increase squat depth: hips should go lower than knees for better form.")

                # Knee position feedback
                if self._check_knee_position(landmarks):
                    self.feedback_set.add("Avoid excessive forward knee travel to protect your joints.")

                # Full extension feedback
                if not is_fully_extended:
                    self.feedback_set.add("Ensure you stand up fully between reps for proper recovery.")

                # Consistency check to avoid contradictions
                if "Excellent squat depth!" in self.feedback_set and "Increase squat depth" in self.feedback_set:
                    self.feedback_set.remove("Increase squat depth")
                if "Good squat depth" in self.feedback_set and "Increase squat depth" in self.feedback_set:
                    self.feedback_set.remove("Increase squat depth")

                return self.feedback_set

        self.previous_hip_knee_diff = depth
        return None  # No feedback until rep is completed

def analyze_video(video_path, exercise_type_id: int):
    """
    Processes the video and applies the appropriate exercise analysis based on exercise_type_id.
    """
    cap = cv2.VideoCapture(video_path)
    squat_tracker = SquatTracker()  # Track squats over the whole video
    final_feedback = set()
    total_reps = 0
    frame_count = 0

    # Map exercise_type_id to name for logging
    exercise_type_name = {v: k for k, v in EXERCISE_TYPES.items()}[exercise_type_id]

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image)

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
            logging.debug(f"Processing frame {frame_count} for {exercise_type_name}")

            if exercise_type_id == EXERCISE_TYPES["Squat"]:
                squat_feedback = squat_tracker.analyze_squat(landmarks)
                if squat_feedback:
                    final_feedback.update(squat_feedback)
                    total_reps = squat_tracker.reps  # Update total reps from tracker

    cap.release()

    # Final feedback compilation
    if total_reps > 0:
        final_feedback.add(f"Completed {total_reps} squat rep{'s' if total_reps > 1 else ''}.")
        if total_reps < 3:  # Suggest more reps for a workout (adjust based on goal)
            final_feedback.add("Consider completing more reps for a full workout (e.g., 8-12 reps).")
    else:
        final_feedback.add("No complete squats detected. Please ensure proper squat form and depth.")

    # Ensure feedback is consistent and realistic
    if "Excellent squat depth!" in final_feedback and "Increase squat depth" in final_feedback:
        final_feedback.remove("Increase squat depth")
    if "Good squat depth" in final_feedback and "Increase squat depth" in final_feedback:
        final_feedback.remove("Increase squat depth")

    logging.info(f"Final Feedback for {exercise_type_name}: {final_feedback}")

    feedback = list(final_feedback) if final_feedback else ["Good form detected!"]
    return {"feedback": feedback, "reps": total_reps}  # Include rep count in response

@app.route('/analyze', methods=['POST'])
def analyze():
    file = request.files['video']
    exercise_type_id = int(request.form['exercise_type'])  # Ensure it's an integer
    file_path = os.path.join("/tmp", file.filename)
    file.save(file_path)

    logging.info(f"Received video: {file.filename}, Exercise Type ID: {exercise_type_id}")

    result = analyze_video(file_path, exercise_type_id)
    os.remove(file_path)  # Clean up

    logging.info(f"Returning analysis result: {result}")

    return jsonify(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)