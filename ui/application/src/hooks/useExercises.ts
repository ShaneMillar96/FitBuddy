import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { API_ROUTES } from "@/constants/api-routes";
import axios from "@shared/integration/instance";
import { Exercise } from "@/interfaces/categories";
import { PaginatedResponse } from "@/interfaces/api";

interface ExerciseFilters {
  categoryId?: number;
  muscleGroup?: string;
  equipment?: string;
  searchTerm?: string;
}

export const useExercises = (page: number = 1, pageSize: number = 20, filters: ExerciseFilters = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.EXERCISES, page, pageSize, filters],
    queryFn: async (): Promise<PaginatedResponse<Exercise>> => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (filters.categoryId) params.append('categoryId', filters.categoryId.toString());
      if (filters.muscleGroup) params.append('muscleGroup', filters.muscleGroup);
      if (filters.equipment) params.append('equipment', filters.equipment);

      const response = await axios.get(`${API_ROUTES.EXERCISES}?${params}`);
      return response.data;
    },
  });
};

export const useExercise = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.EXERCISES, id],
    queryFn: async (): Promise<Exercise> => {
      const response = await axios.get(`${API_ROUTES.EXERCISES}/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useExercisesByCategory = (categoryId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.EXERCISES, 'category', categoryId],
    queryFn: async (): Promise<Exercise[]> => {
      const response = await axios.get(`${API_ROUTES.EXERCISES}/category/${categoryId}`);
      return response.data;
    },
    enabled: !!categoryId,
  });
};

export const useSearchExercises = (searchTerm: string, categoryId?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.EXERCISES, 'search', searchTerm, categoryId],
    queryFn: async (): Promise<Exercise[]> => {
      const params = new URLSearchParams({ searchTerm });
      if (categoryId) params.append('categoryId', categoryId.toString());
      
      const response = await axios.get(`${API_ROUTES.EXERCISES}/search?${params}`);
      return response.data;
    },
    enabled: !!searchTerm && searchTerm.length >= 2,
  });
};

export const useMuscleGroups = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.MUSCLE_GROUPS],
    queryFn: async (): Promise<string[]> => {
      const response = await axios.get(`${API_ROUTES.EXERCISES}/muscle-groups`);
      return response.data;
    },
  });
};

export const useEquipmentTypes = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.EQUIPMENT_TYPES],
    queryFn: async (): Promise<string[]> => {
      const response = await axios.get(`${API_ROUTES.EXERCISES}/equipment-types`);
      return response.data;
    },
  });
};