// Workout Type specific exercise interfaces
// Each workout type has its own structure and requirements

export interface BaseWorkoutExercise {
  exerciseId: number;
  orderInWorkout: number;
  weightDescription?: string;
  notes?: string;
  name?: string; // For display purposes
}

// EMOM (Every Minute on the Minute)
// Users define a pattern of exercises per round, then specify how many rounds to repeat
export interface EMOMExercise extends BaseWorkoutExercise {
  roundPosition: number;      // Position within the round (1, 2, 3, 4, 5, 6)
  reps: number;               // Reps to complete for this exercise
  restBetweenExercises?: number; // Optional rest between exercises in seconds
}

export interface EMOMWorkoutData {
  roundCount: number;         // Number of rounds to repeat the pattern
  exercisesPerRound: number;  // Number of exercises in each round (calculated)
  totalMinutes: number;       // Total workout duration (calculated: exercisesPerRound × roundCount)
  exercises: EMOMExercise[];  // Exercise pattern that repeats each round
}

// AMRAP (As Many Rounds As Possible)
// Users define one round, complete as many rounds as possible in time cap
export interface AMRAPExercise extends BaseWorkoutExercise {
  reps: number;               // Reps per round
  roundPosition: number;      // Order within the round
}

export interface AMRAPWorkoutData {
  timeCapMinutes: number;     // Total workout duration
  exercises: AMRAPExercise[]; // Exercises that make up one round
}

// For Time
// Complete specified exercises/rounds as fast as possible
export interface ForTimeExercise extends BaseWorkoutExercise {
  reps: number;               // Total reps to complete
  rounds?: number;            // If it's multiple rounds (optional)
}

export interface ForTimeWorkoutData {
  totalRounds?: number;       // Number of rounds (if applicable)
  exercises: ForTimeExercise[]; // Sequential exercises
}

// Tabata
// High-intensity intervals with work/rest periods
export interface TabataExercise extends BaseWorkoutExercise {
  workTimeSeconds: number;    // Work interval (usually 20s)
  restTimeSeconds: number;    // Rest interval (usually 10s)
  rounds: number;             // Number of Tabata rounds (usually 8)
  exercisePosition: number;   // Order if multiple exercises
}

export interface TabataWorkoutData {
  totalRounds: number;        // Total Tabata rounds
  exercises: TabataExercise[]; // Exercises in the Tabata
}

// Ladder
// Increasing or decreasing rep schemes
export interface LadderExercise extends BaseWorkoutExercise {
  ladderType: 'ascending' | 'descending' | 'pyramid';
  startReps: number;          // Starting number
  endReps: number;            // Ending number
  increment: number;          // Step size (usually 1)
  ladderPosition: number;     // Order in ladder sequence
}

export interface LadderWorkoutData {
  ladderType: 'ascending' | 'descending' | 'pyramid';
  exercises: LadderExercise[]; // Exercises that follow the ladder pattern
}

// Union type for all workout exercise types
export type WorkoutTypeExercise = EMOMExercise | AMRAPExercise | ForTimeExercise | TabataExercise | LadderExercise;

// Workout type data union
export type WorkoutTypeData = EMOMWorkoutData | AMRAPWorkoutData | ForTimeWorkoutData | TabataWorkoutData | LadderWorkoutData;

// Workout type constants - matching actual database workout types API
export const WORKOUT_TYPES = {
  EMOM: 1,
  AMRAP: 2,
  FOR_TIME: 3,
  TABATA: 4,
  LADDER: 5
} as const;

export type WorkoutTypeId = typeof WORKOUT_TYPES[keyof typeof WORKOUT_TYPES];

// Helper type guards
export const isEMOMExercise = (exercise: WorkoutTypeExercise): exercise is EMOMExercise => {
  return 'roundPosition' in exercise;
};

export const isAMRAPExercise = (exercise: WorkoutTypeExercise): exercise is AMRAPExercise => {
  return 'roundPosition' in exercise;
};

export const isForTimeExercise = (exercise: WorkoutTypeExercise): exercise is ForTimeExercise => {
  return 'reps' in exercise && !('roundPosition' in exercise) && !('workTimeSeconds' in exercise) && !('ladderType' in exercise);
};

export const isTabataExercise = (exercise: WorkoutTypeExercise): exercise is TabataExercise => {
  return 'workTimeSeconds' in exercise && 'restTimeSeconds' in exercise;
};

export const isLadderExercise = (exercise: WorkoutTypeExercise): exercise is LadderExercise => {
  return 'ladderType' in exercise && 'startReps' in exercise && 'endReps' in exercise;
};

// Workout type metadata
export const WORKOUT_TYPE_INFO = {
  [WORKOUT_TYPES.EMOM]: {
    name: 'EMOM',
    fullName: 'Every Minute on the Minute',
    description: 'Complete specified exercise pattern, repeating each round on the minute',
    icon: '⏰',
    fields: ['roundPosition', 'reps', 'weight', 'notes']
  },
  [WORKOUT_TYPES.AMRAP]: {
    name: 'AMRAP',
    fullName: 'As Many Rounds As Possible',
    description: 'Complete as many rounds as possible within the time cap',
    icon: '🔄',
    fields: ['reps', 'weight', 'notes']
  },
  [WORKOUT_TYPES.FOR_TIME]: {
    name: 'For Time',
    fullName: 'For Time',
    description: 'Complete all exercises as fast as possible',
    icon: '⚡',
    fields: ['reps', 'rounds', 'weight', 'notes']
  },
  [WORKOUT_TYPES.TABATA]: {
    name: 'Tabata',
    fullName: 'Tabata Protocol',
    description: 'High-intensity intervals with work and rest periods',
    icon: '🔥',
    fields: ['workTime', 'restTime', 'rounds', 'weight', 'notes']
  },
  [WORKOUT_TYPES.LADDER]: {
    name: 'Ladder',
    fullName: 'Ladder Workout',
    description: 'Increasing or decreasing rep schemes',
    icon: '📈',
    fields: ['ladderType', 'startReps', 'endReps', 'increment', 'weight', 'notes']
  }
} as const;