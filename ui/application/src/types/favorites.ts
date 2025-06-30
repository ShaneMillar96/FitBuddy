export interface WorkoutFavorite {
  id: number;
  memberId: number;
  workoutId: number;
  createdDate: string;
  workout: {
    id: number;
    name: string;
    description?: string;
    estimatedDurationMinutes?: number;
    workoutType: {
      id: number;
      name: string;
    };
    category?: {
      id: number;
      name: string;
    };
    createdBy: {
      id: number;
      username: string;
      firstName?: string;
      lastName?: string;
    };
  };
}

export interface ToggleFavoriteResult {
  isFavorited: boolean;
  totalFavorites: number;
}

export interface FavoriteStatus {
  isFavorited: boolean;
}

export interface FavoriteCount {
  count: number;
}

// API request/response types
export interface ToggleFavoriteRequest {
  workoutId: number;
}

export interface GetFavoritesParams {
  page?: number;
  limit?: number;
}