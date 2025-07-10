export interface WorkoutCategory {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  createdDate?: string;
  subTypes: WorkoutSubType[];
}

export interface WorkoutSubType {
  id: number;
  categoryId: number;
  name: string;
  description?: string;
  createdDate?: string;
}

export interface CreateWorkoutCategory {
  name: string;
  description?: string;
  icon?: string;
}

export interface Exercise {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  description?: string;
  instructions?: string;
  createdDate?: string;
}

export interface CreateExercise {
  name: string;
  categoryId: number;
  description?: string;
  instructions?: string;
}

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
  exercise: Exercise;
}

export interface CreateWorkoutExercise {
  exerciseId: number;
  orderInWorkout: number;
  sets?: number;
  reps?: number;
  timeSeconds?: number;
  restSeconds?: number;
  notes?: string;
  name?: string; // Add for display purposes
}

export const CROSSFIT_CATEGORY_ID = 2;

export const CROSSFIT_SUB_TYPES = {
  EMOM: 7,
  AMRAP: 8,
  FOR_TIME: 9,
  TABATA: 10
} as const;

// Simplified constants for CrossFit-only workouts
export const CATEGORY_ICONS = {
  [CROSSFIT_CATEGORY_ID]: '🔥'
};

export const WORKOUT_CATEGORIES = [{
  id: CROSSFIT_CATEGORY_ID,
  name: 'CrossFit WOD',
  icon: '🔥'
}];