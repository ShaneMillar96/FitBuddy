import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { API_ROUTES } from "@/constants/api-routes";
import axios from "@shared/integration/instance";
import { WorkoutCategory, WorkoutSubType } from "@/interfaces/categories";

export const useCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES,
    queryFn: async (): Promise<WorkoutCategory[]> => {
      const response = await axios.get(API_ROUTES.CATEGORIES);
      return response.data;
    },
  });
};

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES, id],
    queryFn: async (): Promise<WorkoutCategory> => {
      const response = await axios.get(`${API_ROUTES.CATEGORIES}/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useSubTypes = (categoryId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SUB_TYPES, categoryId],
    queryFn: async (): Promise<WorkoutSubType[]> => {
      const response = await axios.get(`${API_ROUTES.CATEGORIES}/${categoryId}/sub-types`);
      return response.data;
    },
    enabled: !!categoryId,
  });
};