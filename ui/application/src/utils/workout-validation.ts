import {
  WorkoutTypeData,
  EMOMWorkoutData,
  AMRAPWorkoutData,
  ForTimeWorkoutData,
  TabataWorkoutData,
  LadderWorkoutData,
  WORKOUT_TYPES,
  WorkoutTypeId,
  isEMOMExercise,
  isAMRAPExercise,
  isForTimeExercise,
  isTabataExercise,
  isLadderExercise
} from "@/interfaces/workout-types";

export interface ValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// Base validation for all workout types
const validateBaseWorkout = (workoutData: WorkoutTypeData): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!workoutData.exercises || workoutData.exercises.length === 0) {
    errors.push({
      field: 'exercises',
      message: 'At least one exercise is required',
      type: 'error'
    });
  }

  // Validate each exercise has required fields
  workoutData.exercises.forEach((exercise, index) => {
    if (!exercise.exerciseId) {
      errors.push({
        field: `exercises.${index}.exerciseId`,
        message: `Exercise ${index + 1}: Exercise ID is required`,
        type: 'error'
      });
    }

    if (!exercise.orderInWorkout || exercise.orderInWorkout < 1) {
      errors.push({
        field: `exercises.${index}.orderInWorkout`,
        message: `Exercise ${index + 1}: Valid order is required`,
        type: 'error'
      });
    }
  });

  return errors;
};

// EMOM specific validation
const validateEMOMWorkout = (workoutData: EMOMWorkoutData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Validate total minutes
  if (!workoutData.totalMinutes || workoutData.totalMinutes < 1) {
    errors.push({
      field: 'totalMinutes',
      message: 'Total minutes must be at least 1',
      type: 'error'
    });
  } else if (workoutData.totalMinutes > 60) {
    errors.push({
      field: 'totalMinutes',
      message: 'EMOM workouts longer than 60 minutes may be impractical',
      type: 'warning'
    });
  }

  // Validate exercises
  workoutData.exercises.forEach((exercise, index) => {
    if (!isEMOMExercise(exercise)) {
      errors.push({
        field: `exercises.${index}`,
        message: `Exercise ${index + 1}: Invalid EMOM exercise structure`,
        type: 'error'
      });
      return;
    }

    if (!exercise.minute || exercise.minute < 1) {
      errors.push({
        field: `exercises.${index}.minute`,
        message: `Exercise ${index + 1}: Valid minute number is required`,
        type: 'error'
      });
    } else if (exercise.minute > workoutData.totalMinutes) {
      errors.push({
        field: `exercises.${index}.minute`,
        message: `Exercise ${index + 1}: Minute ${exercise.minute} exceeds total workout minutes`,
        type: 'error'
      });
    }

    if (!exercise.reps || exercise.reps < 1) {
      errors.push({
        field: `exercises.${index}.reps`,
        message: `Exercise ${index + 1}: Reps must be at least 1`,
        type: 'error'
      });
    } else if (exercise.reps > 100) {
      errors.push({
        field: `exercises.${index}.reps`,
        message: `Exercise ${index + 1}: ${exercise.reps} reps may be difficult to complete in one minute`,
        type: 'warning'
      });
    }
  });

  return errors;
};

// AMRAP specific validation
const validateAMRAPWorkout = (workoutData: AMRAPWorkoutData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Validate time cap
  if (!workoutData.timeCapMinutes || workoutData.timeCapMinutes < 1) {
    errors.push({
      field: 'timeCapMinutes',
      message: 'Time cap must be at least 1 minute',
      type: 'error'
    });
  } else if (workoutData.timeCapMinutes > 60) {
    errors.push({
      field: 'timeCapMinutes',
      message: 'AMRAP workouts longer than 60 minutes may be impractical',
      type: 'warning'
    });
  }

  // Validate exercises
  workoutData.exercises.forEach((exercise, index) => {
    if (!isAMRAPExercise(exercise)) {
      errors.push({
        field: `exercises.${index}`,
        message: `Exercise ${index + 1}: Invalid AMRAP exercise structure`,
        type: 'error'
      });
      return;
    }

    if (!exercise.reps || exercise.reps < 1) {
      errors.push({
        field: `exercises.${index}.reps`,
        message: `Exercise ${index + 1}: Reps must be at least 1`,
        type: 'error'
      });
    }

    if (!exercise.roundPosition || exercise.roundPosition < 1) {
      errors.push({
        field: `exercises.${index}.roundPosition`,
        message: `Exercise ${index + 1}: Valid round position is required`,
        type: 'error'
      });
    }
  });

  // Check for duplicate round positions
  const positions = workoutData.exercises.map(ex => ex.roundPosition);
  const duplicates = positions.filter((pos, index) => positions.indexOf(pos) !== index);
  if (duplicates.length > 0) {
    errors.push({
      field: 'exercises',
      message: 'Duplicate round positions found. Each exercise should have a unique position in the round.',
      type: 'error'
    });
  }

  return errors;
};

// For Time specific validation
const validateForTimeWorkout = (workoutData: ForTimeWorkoutData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Validate rounds
  if (workoutData.totalRounds && workoutData.totalRounds < 1) {
    errors.push({
      field: 'totalRounds',
      message: 'Total rounds must be at least 1',
      type: 'error'
    });
  } else if (workoutData.totalRounds && workoutData.totalRounds > 50) {
    errors.push({
      field: 'totalRounds',
      message: 'For Time workouts with more than 50 rounds may be impractical',
      type: 'warning'
    });
  }

  // Validate exercises
  workoutData.exercises.forEach((exercise, index) => {
    if (!isForTimeExercise(exercise)) {
      errors.push({
        field: `exercises.${index}`,
        message: `Exercise ${index + 1}: Invalid For Time exercise structure`,
        type: 'error'
      });
      return;
    }

    if (!exercise.reps || exercise.reps < 1) {
      errors.push({
        field: `exercises.${index}.reps`,
        message: `Exercise ${index + 1}: Reps must be at least 1`,
        type: 'error'
      });
    }
  });

  // Calculate total volume warning
  const totalReps = workoutData.exercises.reduce((sum, ex) => sum + ex.reps, 0) * (workoutData.totalRounds || 1);
  if (totalReps > 1000) {
    errors.push({
      field: 'totalVolume',
      message: `Total volume of ${totalReps} reps may be very challenging`,
      type: 'warning'
    });
  }

  return errors;
};

// Tabata specific validation
const validateTabataWorkout = (workoutData: TabataWorkoutData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Validate total rounds
  if (!workoutData.totalRounds || workoutData.totalRounds < 1) {
    errors.push({
      field: 'totalRounds',
      message: 'Total rounds must be at least 1',
      type: 'error'
    });
  }

  // Validate exercises
  workoutData.exercises.forEach((exercise, index) => {
    if (!isTabataExercise(exercise)) {
      errors.push({
        field: `exercises.${index}`,
        message: `Exercise ${index + 1}: Invalid Tabata exercise structure`,
        type: 'error'
      });
      return;
    }

    if (!exercise.workTimeSeconds || exercise.workTimeSeconds < 5) {
      errors.push({
        field: `exercises.${index}.workTimeSeconds`,
        message: `Exercise ${index + 1}: Work time must be at least 5 seconds`,
        type: 'error'
      });
    } else if (exercise.workTimeSeconds > 300) {
      errors.push({
        field: `exercises.${index}.workTimeSeconds`,
        message: `Exercise ${index + 1}: Work intervals longer than 5 minutes are not typical for Tabata`,
        type: 'warning'
      });
    }

    if (!exercise.restTimeSeconds || exercise.restTimeSeconds < 5) {
      errors.push({
        field: `exercises.${index}.restTimeSeconds`,
        message: `Exercise ${index + 1}: Rest time must be at least 5 seconds`,
        type: 'error'
      });
    }

    if (!exercise.rounds || exercise.rounds < 1) {
      errors.push({
        field: `exercises.${index}.rounds`,
        message: `Exercise ${index + 1}: Rounds must be at least 1`,
        type: 'error'
      });
    } else if (exercise.rounds > 20) {
      errors.push({
        field: `exercises.${index}.rounds`,
        message: `Exercise ${index + 1}: More than 20 Tabata rounds may be excessive`,
        type: 'warning'
      });
    }

    if (!exercise.exercisePosition || exercise.exercisePosition < 1) {
      errors.push({
        field: `exercises.${index}.exercisePosition`,
        message: `Exercise ${index + 1}: Valid exercise position is required`,
        type: 'error'
      });
    }

    // Warn about classic Tabata timing
    if (exercise.workTimeSeconds !== 20 || exercise.restTimeSeconds !== 10 || exercise.rounds !== 8) {
      errors.push({
        field: `exercises.${index}.timing`,
        message: `Exercise ${index + 1}: Classic Tabata protocol is 20s work, 10s rest for 8 rounds`,
        type: 'warning'
      });
    }
  });

  return errors;
};

// Ladder specific validation
const validateLadderWorkout = (workoutData: LadderWorkoutData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Validate ladder type
  if (!workoutData.ladderType || !['ascending', 'descending', 'pyramid'].includes(workoutData.ladderType)) {
    errors.push({
      field: 'ladderType',
      message: 'Valid ladder type is required (ascending, descending, or pyramid)',
      type: 'error'
    });
  }

  // Validate exercises
  workoutData.exercises.forEach((exercise, index) => {
    if (!isLadderExercise(exercise)) {
      errors.push({
        field: `exercises.${index}`,
        message: `Exercise ${index + 1}: Invalid Ladder exercise structure`,
        type: 'error'
      });
      return;
    }

    if (!exercise.startReps || exercise.startReps < 1) {
      errors.push({
        field: `exercises.${index}.startReps`,
        message: `Exercise ${index + 1}: Start reps must be at least 1`,
        type: 'error'
      });
    }

    if (!exercise.endReps || exercise.endReps < 1) {
      errors.push({
        field: `exercises.${index}.endReps`,
        message: `Exercise ${index + 1}: End reps must be at least 1`,
        type: 'error'
      });
    }

    if (!exercise.increment || exercise.increment < 1) {
      errors.push({
        field: `exercises.${index}.increment`,
        message: `Exercise ${index + 1}: Increment must be at least 1`,
        type: 'error'
      });
    }

    // Validate ladder progression makes sense
    if (exercise.ladderType === 'ascending' && exercise.startReps >= exercise.endReps) {
      errors.push({
        field: `exercises.${index}.progression`,
        message: `Exercise ${index + 1}: Ascending ladder should start lower than it ends`,
        type: 'error'
      });
    } else if (exercise.ladderType === 'descending' && exercise.startReps <= exercise.endReps) {
      errors.push({
        field: `exercises.${index}.progression`,
        message: `Exercise ${index + 1}: Descending ladder should start higher than it ends`,
        type: 'error'
      });
    }

    // Calculate total reps and warn if excessive
    const range = Math.abs(exercise.endReps - exercise.startReps);
    const steps = Math.floor(range / exercise.increment) + 1;
    const totalReps = exercise.ladderType === 'pyramid' 
      ? (steps * 2 - 1) * (exercise.startReps + exercise.endReps) / 2
      : steps * (exercise.startReps + exercise.endReps) / 2;
    
    if (totalReps > 500) {
      errors.push({
        field: `exercises.${index}.volume`,
        message: `Exercise ${index + 1}: Total volume of ${Math.round(totalReps)} reps may be excessive`,
        type: 'warning'
      });
    }
  });

  return errors;
};

// Main validation function
export const validateWorkout = (workoutTypeId: WorkoutTypeId, workoutData: WorkoutTypeData): ValidationResult => {
  let errors: ValidationError[] = [];

  // Add base validation
  errors = errors.concat(validateBaseWorkout(workoutData));

  // Add workout-type specific validation
  switch (workoutTypeId) {
    case WORKOUT_TYPES.EMOM:
      errors = errors.concat(validateEMOMWorkout(workoutData as EMOMWorkoutData));
      break;
    case WORKOUT_TYPES.AMRAP:
      errors = errors.concat(validateAMRAPWorkout(workoutData as AMRAPWorkoutData));
      break;
    case WORKOUT_TYPES.FOR_TIME:
      errors = errors.concat(validateForTimeWorkout(workoutData as ForTimeWorkoutData));
      break;
    case WORKOUT_TYPES.TABATA:
      errors = errors.concat(validateTabataWorkout(workoutData as TabataWorkoutData));
      break;
    case WORKOUT_TYPES.LADDER:
      errors = errors.concat(validateLadderWorkout(workoutData as LadderWorkoutData));
      break;
    default:
      errors.push({
        field: 'workoutType',
        message: 'Invalid workout type',
        type: 'error'
      });
  }

  // Separate errors and warnings
  const actualErrors = errors.filter(e => e.type === 'error');
  const warnings = errors.filter(e => e.type === 'warning');

  return {
    isValid: actualErrors.length === 0,
    errors: actualErrors,
    warnings: warnings
  };
};

// Helper function to get workout type specific requirements
export const getWorkoutTypeRequirements = (workoutTypeId: WorkoutTypeId): string[] => {
  switch (workoutTypeId) {
    case WORKOUT_TYPES.EMOM:
      return [
        'Total workout duration in minutes',
        'Exercise assignment to specific minutes',
        'Rep count for each exercise per minute'
      ];
    case WORKOUT_TYPES.AMRAP:
      return [
        'Time cap for the workout',
        'Round definition with exercises and reps',
        'Sequential order of exercises within round'
      ];
    case WORKOUT_TYPES.FOR_TIME:
      return [
        'Number of rounds (if applicable)',
        'Exercise sequence with rep counts',
        'Clear completion criteria'
      ];
    case WORKOUT_TYPES.TABATA:
      return [
        'Work and rest intervals for each exercise',
        'Number of rounds per exercise',
        'Exercise sequence and timing'
      ];
    case WORKOUT_TYPES.LADDER:
      return [
        'Ladder type (ascending, descending, or pyramid)',
        'Starting and ending rep counts',
        'Increment step size'
      ];
    default:
      return ['Basic exercise information'];
  }
};

// Helper function to get validation tips
export const getValidationTips = (workoutTypeId: WorkoutTypeId): string[] => {
  switch (workoutTypeId) {
    case WORKOUT_TYPES.EMOM:
      return [
        'Keep rep counts manageable to allow for rest within each minute',
        'Consider workout scaling for different fitness levels',
        'Distribute exercises across minutes to avoid overloading specific minutes'
      ];
    case WORKOUT_TYPES.AMRAP:
      return [
        'Design rounds that can be completed in 3-8 minutes',
        'Balance high and low intensity exercises',
        'Include clear rep counts for consistent scoring'
      ];
    case WORKOUT_TYPES.FOR_TIME:
      return [
        'Consider total volume when setting rep counts',
        'Balance speed with safety for movement selection',
        'Set realistic time caps for completion'
      ];
    case WORKOUT_TYPES.TABATA:
      return [
        'Classic Tabata: 20s work, 10s rest for 8 rounds',
        'Choose exercises that can maintain high intensity',
        'Consider exercise transitions between intervals'
      ];
    case WORKOUT_TYPES.LADDER:
      return [
        'Ensure progression makes logical sense',
        'Consider total volume accumulation',
        'Choose appropriate increment sizes for the exercise'
      ];
    default:
      return [];
  }
};