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
  muscleGroups: string[];
  equipmentNeeded: string[];
  description?: string;
  instructions?: string;
  difficultyLevel?: number;
  isCompound: boolean;
  createdDate?: string;
}

export interface CreateExercise {
  name: string;
  categoryId: number;
  muscleGroups: string[];
  equipmentNeeded: string[];
  description?: string;
  instructions?: string;
  difficultyLevel?: number;
  isCompound: boolean;
}

export interface WorkoutExercise {
  id: number;
  workoutId: number;
  exerciseId: number;
  orderInWorkout: number;
  sets?: number;
  reps?: number;
  weightKg?: number;
  distanceMeters?: number;
  durationSeconds?: number;
  restSeconds?: number;
  notes?: string;
  exercise: Exercise;
}

export interface CreateWorkoutExercise {
  exerciseId: number;
  orderInWorkout: number;
  sets?: number;
  reps?: number;
  weightKg?: number;
  distanceMeters?: number;
  durationSeconds?: number;
  restSeconds?: number;
  notes?: string;
}

export const WORKOUT_CATEGORIES = {
  WEIGHT_SESSION: 1,
  CROSSFIT_WOD: 2,
  RUNNING_INTERVALS: 3,
  SWIMMING: 4,
  HYROX: 5,
  STRETCHING: 6
} as const;

export const CATEGORY_ICONS = {
  [WORKOUT_CATEGORIES.WEIGHT_SESSION]: '🏋️',
  [WORKOUT_CATEGORIES.CROSSFIT_WOD]: '🔥',
  [WORKOUT_CATEGORIES.RUNNING_INTERVALS]: '🏃',
  [WORKOUT_CATEGORIES.SWIMMING]: '🏊',
  [WORKOUT_CATEGORIES.HYROX]: '⚡',
  [WORKOUT_CATEGORIES.STRETCHING]: '🧘'
} as const;