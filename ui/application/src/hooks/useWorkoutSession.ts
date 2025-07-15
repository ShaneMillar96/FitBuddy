import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// Session Types
interface WorkoutSession {
  id: string;
  workoutId: number;
  memberId: number;
  status: 'Active' | 'Paused' | 'Completed' | 'Abandoned';
  startTime: string;
  endTime?: string;
  currentExerciseIndex: number;
  totalPausedTimeSeconds: number;
  workout: any;
  exerciseProgress: SessionExerciseProgress[];
  createdDate: string;
  modifiedDate?: string;
}

interface SessionExerciseProgress {
  exerciseId: number;
  exercise: any;
  orderInWorkout: number;
  status: 'NotStarted' | 'InProgress' | 'Completed' | 'Skipped';
  startTime?: string;
  endTime?: string;
  totalTimeSeconds?: number;
  plannedSets?: number;
  plannedReps?: number;
  plannedWeightKg?: number;
  plannedDistanceMeters?: number;
  plannedDurationSeconds?: number;
  plannedRestSeconds?: number;
  sets: SessionSetProgress[];
}

interface SessionSetProgress {
  setNumber: number;
  status: 'NotStarted' | 'InProgress' | 'Completed';
  startTime?: string;
  endTime?: string;
  actualReps?: number;
  actualWeightKg?: number;
  actualDistanceMeters?: number;
  actualDurationSeconds?: number;
  actualRestSeconds?: number;
  restStartTime?: string;
  restEndTime?: string;
}

interface CreateWorkoutSessionRequest {
  id: string;
  workoutId: number;
  exerciseProgress: {
    exerciseId: number;
    orderInWorkout: number;
    plannedSets?: number;
    plannedReps?: number;
    plannedWeightKg?: number;
    plannedDistanceMeters?: number;
    plannedDurationSeconds?: number;
    plannedRestSeconds?: number;
  }[];
}

interface CompleteWorkoutSessionRequest {
  sessionId: string;
  workoutResult: {
    result: string;
    duration?: number;
    avgHeartRate?: number;
    caloriesBurned?: number;
    completionTimeSeconds?: number;
    difficultyRating?: number;
    workoutRating?: number;
    rpeRating?: number;
    notes?: string;
    isPersonalRecord?: boolean;
  };
}

interface UpdateSessionExerciseProgressRequest {
  actualReps?: number;
  actualWeightKg?: number;
  actualDistanceMeters?: number;
  actualDurationSeconds?: number;
  notes?: string;
}

interface UpdateSessionSetProgressRequest {
  actualReps?: number;
  actualWeightKg?: number;
  actualDistanceMeters?: number;
  actualDurationSeconds?: number;
  actualRestSeconds?: number;
}

// API Functions
const sessionApi = {
  // Start a new workout session
  startSession: async (request: CreateWorkoutSessionRequest): Promise<string> => {
    const response = await fetch('/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to start session: ${error}`);
    }

    return response.text(); // Session ID
  },

  // Get session details
  getSession: async (sessionId: string): Promise<WorkoutSession> => {
    const response = await fetch(`/api/sessions/${sessionId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch session');
    }

    return response.json();
  },

  // Get active session for current member
  getActiveSession: async (): Promise<WorkoutSession | null> => {
    const response = await fetch('/api/sessions/active');

    if (response.status === 404) {
      return null; // No active session
    }

    if (!response.ok) {
      throw new Error('Failed to fetch active session');
    }

    return response.json();
  },

  // Pause session
  pauseSession: async (sessionId: string): Promise<boolean> => {
    const response = await fetch(`/api/sessions/${sessionId}/pause`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to pause session');
    }

    return response.json();
  },

  // Resume session
  resumeSession: async (sessionId: string): Promise<boolean> => {
    const response = await fetch(`/api/sessions/${sessionId}/resume`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to resume session');
    }

    return response.json();
  },

  // Complete session
  completeSession: async (request: CompleteWorkoutSessionRequest): Promise<number> => {
    const response = await fetch('/api/sessions/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to complete session: ${error}`);
    }

    return response.json(); // Workout result ID
  },

  // Abandon session
  abandonSession: async (sessionId: string): Promise<boolean> => {
    const response = await fetch(`/api/sessions/${sessionId}/abandon`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to abandon session');
    }

    return response.json();
  },

  // Exercise progress management
  startExercise: async (sessionId: string, exerciseId: number): Promise<boolean> => {
    const response = await fetch(`/api/sessions/${sessionId}/exercises/${exerciseId}/start`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to start exercise');
    }

    return response.json();
  },

  completeExercise: async (sessionId: string, exerciseId: number): Promise<boolean> => {
    const response = await fetch(`/api/sessions/${sessionId}/exercises/${exerciseId}/complete`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to complete exercise');
    }

    return response.json();
  },

  skipExercise: async (sessionId: string, exerciseId: number): Promise<boolean> => {
    const response = await fetch(`/api/sessions/${sessionId}/exercises/${exerciseId}/skip`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to skip exercise');
    }

    return response.json();
  },

  updateExerciseProgress: async (
    sessionId: string,
    exerciseId: number,
    progress: UpdateSessionExerciseProgressRequest
  ): Promise<boolean> => {
    const response = await fetch(`/api/sessions/${sessionId}/exercises/${exerciseId}/progress`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(progress),
    });

    if (!response.ok) {
      throw new Error('Failed to update exercise progress');
    }

    return response.json();
  },

  // Set progress management
  startSet: async (sessionId: string, exerciseId: number, setNumber: number): Promise<boolean> => {
    const response = await fetch(`/api/sessions/${sessionId}/exercises/${exerciseId}/sets/${setNumber}/start`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to start set');
    }

    return response.json();
  },

  completeSet: async (
    sessionId: string,
    exerciseId: number,
    setNumber: number,
    setData: UpdateSessionSetProgressRequest
  ): Promise<boolean> => {
    const response = await fetch(`/api/sessions/${sessionId}/exercises/${exerciseId}/sets/${setNumber}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(setData),
    });

    if (!response.ok) {
      throw new Error('Failed to complete set');
    }

    return response.json();
  },

  updateSetProgress: async (
    sessionId: string,
    exerciseId: number,
    setNumber: number,
    setData: UpdateSessionSetProgressRequest
  ): Promise<boolean> => {
    const response = await fetch(`/api/sessions/${sessionId}/exercises/${exerciseId}/sets/${setNumber}/progress`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(setData),
    });

    if (!response.ok) {
      throw new Error('Failed to update set progress');
    }

    return response.json();
  },
};

// React Query Hooks
export const useStartSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sessionApi.startSession,
    onSuccess: (sessionId) => {
      toast.success('Workout session started!');
      queryClient.invalidateQueries({ queryKey: ['activeSession'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to start session: ${error.message}`);
    },
  });
};

export const useGetSession = (sessionId: string | undefined) => {
  return useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => sessionApi.getSession(sessionId!),
    enabled: !!sessionId,
    staleTime: 30000, // 30 seconds
    refetchInterval: 5000, // Refetch every 5 seconds for live updates
  });
};

export const useGetActiveSession = () => {
  return useQuery({
    queryKey: ['activeSession'],
    queryFn: sessionApi.getActiveSession,
    staleTime: 30000, // 30 seconds
    refetchInterval: 10000, // Refetch every 10 seconds
  });
};

export const usePauseSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sessionApi.pauseSession,
    onSuccess: (_, sessionId) => {
      toast.success('Session paused');
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['activeSession'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to pause session: ${error.message}`);
    },
  });
};

export const useResumeSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sessionApi.resumeSession,
    onSuccess: (_, sessionId) => {
      toast.success('Session resumed');
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['activeSession'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to resume session: ${error.message}`);
    },
  });
};

export const useCompleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sessionApi.completeSession,
    onSuccess: (resultId) => {
      toast.success('Workout completed successfully!');
      queryClient.invalidateQueries({ queryKey: ['activeSession'] });
      queryClient.invalidateQueries({ queryKey: ['workoutResults'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to complete session: ${error.message}`);
    },
  });
};

export const useAbandonSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sessionApi.abandonSession,
    onSuccess: () => {
      toast.success('Session abandoned');
      queryClient.invalidateQueries({ queryKey: ['activeSession'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to abandon session: ${error.message}`);
    },
  });
};

export const useStartExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, exerciseId }: { sessionId: string; exerciseId: number }) =>
      sessionApi.startExercise(sessionId, exerciseId),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to start exercise: ${error.message}`);
    },
  });
};

export const useCompleteExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, exerciseId }: { sessionId: string; exerciseId: number }) =>
      sessionApi.completeExercise(sessionId, exerciseId),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to complete exercise: ${error.message}`);
    },
  });
};

export const useSkipExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, exerciseId }: { sessionId: string; exerciseId: number }) =>
      sessionApi.skipExercise(sessionId, exerciseId),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to skip exercise: ${error.message}`);
    },
  });
};

export const useUpdateExerciseProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      exerciseId,
      progress,
    }: {
      sessionId: string;
      exerciseId: number;
      progress: UpdateSessionExerciseProgressRequest;
    }) => sessionApi.updateExerciseProgress(sessionId, exerciseId, progress),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update exercise progress: ${error.message}`);
    },
  });
};

export const useStartSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      exerciseId,
      setNumber,
    }: {
      sessionId: string;
      exerciseId: number;
      setNumber: number;
    }) => sessionApi.startSet(sessionId, exerciseId, setNumber),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to start set: ${error.message}`);
    },
  });
};

export const useCompleteSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      exerciseId,
      setNumber,
      setData,
    }: {
      sessionId: string;
      exerciseId: number;
      setNumber: number;
      setData: UpdateSessionSetProgressRequest;
    }) => sessionApi.completeSet(sessionId, exerciseId, setNumber, setData),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to complete set: ${error.message}`);
    },
  });
};

export const useUpdateSetProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      exerciseId,
      setNumber,
      setData,
    }: {
      sessionId: string;
      exerciseId: number;
      setNumber: number;
      setData: UpdateSessionSetProgressRequest;
    }) => sessionApi.updateSetProgress(sessionId, exerciseId, setNumber, setData),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update set progress: ${error.message}`);
    },
  });
};

// Export types for use in components
export type {
  WorkoutSession,
  SessionExerciseProgress,
  SessionSetProgress,
  CreateWorkoutSessionRequest,
  CompleteWorkoutSessionRequest,
  UpdateSessionExerciseProgressRequest,
  UpdateSessionSetProgressRequest,
};