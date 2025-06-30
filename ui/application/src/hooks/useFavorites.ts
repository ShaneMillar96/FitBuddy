import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@shared/integration/instance';
import { API_ROUTES } from '../constants/api-routes';
import { 
  WorkoutFavorite, 
  ToggleFavoriteResult, 
  FavoriteStatus, 
  FavoriteCount 
} from '../types/favorites';

// API functions
const favoritesAPI = {
  toggle: async (workoutId: number): Promise<ToggleFavoriteResult> => {
    const { data } = await axiosInstance.post(`${API_ROUTES.FAVORITES}/${workoutId}`);
    return data;
  },

  getStatus: async (workoutId: number): Promise<FavoriteStatus> => {
    const { data } = await axiosInstance.get(`${API_ROUTES.FAVORITES}/${workoutId}/status`);
    return data;
  },

  getUserFavorites: async (): Promise<WorkoutFavorite[]> => {
    const { data } = await axiosInstance.get(`${API_ROUTES.FAVORITES}`);
    return data;
  },

  getWorkoutFavoriteCount: async (workoutId: number): Promise<FavoriteCount> => {
    const { data } = await axiosInstance.get(`${API_ROUTES.FAVORITES}/${workoutId}/count`);
    return data;
  },

  getUserFavoriteCount: async (): Promise<FavoriteCount> => {
    const { data } = await axiosInstance.get(`${API_ROUTES.FAVORITES}/my-count`);
    return data;
  }
};

// Hook for toggling favorites
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: favoritesAPI.toggle,
    onSuccess: (data, workoutId) => {
      // Update the specific workout's favorite status
      queryClient.setQueryData(['favoriteStatus', workoutId], { 
        isFavorited: data.isFavorited 
      });
      
      // Update the workout's favorite count
      queryClient.setQueryData(['workoutFavoriteCount', workoutId], {
        count: data.totalFavorites
      });
      
      // Invalidate user favorites list to refresh
      queryClient.invalidateQueries({ queryKey: ['userFavorites'] });
      queryClient.invalidateQueries({ queryKey: ['userFavoriteCount'] });
    }
  });
};

// Hook for getting favorite status of a workout
export const useFavoriteStatus = (workoutId: number) => {
  return useQuery({
    queryKey: ['favoriteStatus', workoutId],
    queryFn: () => favoritesAPI.getStatus(workoutId),
    enabled: !!workoutId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for getting user's favorite workouts
export const useUserFavorites = () => {
  return useQuery({
    queryKey: ['userFavorites'],
    queryFn: favoritesAPI.getUserFavorites,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook for getting favorite count of a specific workout
export const useWorkoutFavoriteCount = (workoutId: number) => {
  return useQuery({
    queryKey: ['workoutFavoriteCount', workoutId],
    queryFn: () => favoritesAPI.getWorkoutFavoriteCount(workoutId),
    enabled: !!workoutId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for getting user's total favorite count
export const useUserFavoriteCount = () => {
  return useQuery({
    queryKey: ['userFavoriteCount'],
    queryFn: favoritesAPI.getUserFavoriteCount,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Custom hook for managing favorite state with optimistic updates
export const useWorkoutFavorite = (workoutId: number) => {
  const [optimisticState, setOptimisticState] = useState<{
    isFavorited: boolean;
    totalFavorites: number;
  } | null>(null);

  const { data: statusData, isLoading: statusLoading } = useFavoriteStatus(workoutId);
  const { data: countData, isLoading: countLoading } = useWorkoutFavoriteCount(workoutId);
  const toggleMutation = useToggleFavorite();

  const currentState = optimisticState || {
    isFavorited: statusData?.isFavorited || false,
    totalFavorites: countData?.count || 0
  };

  const toggleFavorite = async () => {
    // Optimistic update
    setOptimisticState({
      isFavorited: !currentState.isFavorited,
      totalFavorites: currentState.isFavorited 
        ? currentState.totalFavorites - 1 
        : currentState.totalFavorites + 1
    });

    try {
      const result = await toggleMutation.mutateAsync(workoutId);
      // Clear optimistic state - real data will come from cache
      setOptimisticState(null);
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticState(null);
      throw error;
    }
  };

  return {
    isFavorited: currentState.isFavorited,
    totalFavorites: currentState.totalFavorites,
    isLoading: statusLoading || countLoading,
    isToggling: toggleMutation.isPending,
    toggleFavorite,
    error: toggleMutation.error
  };
};