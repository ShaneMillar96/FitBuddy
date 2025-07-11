export interface WorkoutExercise {
  id: number;
  workoutId: number;
  exerciseId: number;
  orderInWorkout: number;
  sets?: number;
  reps?: number;
  timeSeconds?: number;
  restSeconds?: number;
  notes?: string;
}

export interface CreateWorkoutExercise {
  exerciseId: number;
  orderInWorkout: number;
  sets?: number;
  reps?: number;
  timeSeconds?: number;
  restSeconds?: number;
  weightDescription?: string;
  notes?: string;
  name?: string; // Add for display purposes
}

export const CROSSFIT_SUB_TYPES = {
  EMOM: 7,
  AMRAP: 8,
  FOR_TIME: 9,
  TABATA: 10
} as const;