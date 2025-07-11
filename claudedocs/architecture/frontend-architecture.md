# Frontend Architecture

## 🎨 React + TypeScript Frontend Structure

The FitBuddy frontend is built using React 19 with TypeScript, following modern React patterns and best practices for a maintainable and scalable application.

## 📁 Project Structure

```
ui/application/src/
├── components/                   # Reusable UI components
│   ├── layout/                  # Layout components
│   ├── workout/                 # Workout-specific components
│   ├── dashboard/               # Dashboard components
│   └── common/                  # Common UI components
├── pages/                       # Route components
│   ├── auth/                    # Authentication pages
│   ├── workouts/                # Workout pages
│   ├── dashboard/               # Dashboard pages
│   └── profile/                 # User profile pages
├── hooks/                       # Custom React hooks
├── interfaces/                  # TypeScript interfaces
├── constants/                   # Application constants
├── utils/                       # Utility functions
├── assets/                      # Static assets
└── styles/                      # Global styles
```

## 🏗️ Architecture Patterns

### 1. Component Architecture

**Component Hierarchy**:
```
App
├── Router
│   ├── AuthLayout
│   │   ├── Login
│   │   └── Register
│   └── MainLayout
│       ├── WorkoutList
│       ├── WorkoutSession
│       ├── Dashboard
│       └── Profile
└── GlobalProviders
    ├── ReactQueryProvider
    ├── AuthProvider
    └── ThemeProvider
```

### 2. State Management Strategy

**State Categories**:
- **Server State**: React Query (API data, caching)
- **Client State**: React useState/useContext (UI state)
- **Form State**: React Hook Form (form handling)
- **URL State**: React Router (navigation state)

### 3. Component Patterns

**Compound Components**:
```typescript
// WorkoutCard compound component
const WorkoutCard = ({ workout, onPreview, onShare }) => {
  return (
    <div className="workout-card">
      <WorkoutCard.Header workout={workout} />
      <WorkoutCard.Content workout={workout} />
      <WorkoutCard.Actions onPreview={onPreview} onShare={onShare} />
    </div>
  );
};

WorkoutCard.Header = ({ workout }) => (
  <div className="workout-card-header">
    <h3>{workout.name}</h3>
    <span>{workout.workoutTypeName}</span>
  </div>
);
```

## 🔧 Key Technologies

### Core Framework
- **React 19**: Latest React features and concurrent rendering
- **TypeScript**: Type-safe JavaScript development
- **Vite**: Fast build tool and development server

### UI Framework
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for smooth transitions
- **React Icons**: Icon library for consistent iconography

### State Management
- **React Query**: Server state management and caching
- **React Hook Form**: Form state management
- **React Context**: Global client state

### Routing & Navigation
- **React Router v6**: Client-side routing
- **Private Routes**: Protected route components

## 🎯 Component Design System

### 1. Layout Components

**MainLayout**:
```typescript
interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};
```

**Header Component**:
```typescript
const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Logo onClick={() => navigate('/')} />
          <Navigation />
          <UserMenu user={user} onLogout={logout} />
        </div>
      </div>
    </header>
  );
};
```

### 2. Feature Components

**WorkoutCard**:
```typescript
interface WorkoutCardProps {
  workout: Workout;
  viewMode: 'grid' | 'list';
  onPreview: (workout: Workout) => void;
  onShare: (workout: Workout) => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ 
  workout, 
  viewMode, 
  onPreview, 
  onShare 
}) => {
  return (
    <motion.div
      className={`workout-card ${viewMode === 'grid' ? 'grid-view' : 'list-view'}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <WorkoutCard.Header workout={workout} />
      <WorkoutCard.Content workout={workout} />
      <WorkoutCard.Actions 
        onPreview={() => onPreview(workout)}
        onShare={() => onShare(workout)}
      />
    </motion.div>
  );
};
```

## 🔌 API Integration

### 1. React Query Setup

**Query Client Configuration**:
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});
```

### 2. Custom Hooks Pattern

**useWorkouts Hook**:
```typescript
interface UseWorkoutsProps {
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
  search?: string;
}

export const useWorkouts = ({
  pageSize = 10,
  sortBy = "",
  sortDirection = "asc",
  search = "",
}: UseWorkoutsProps = {}) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.WORKOUTS, pageSize, sortBy, sortDirection, search],
    queryFn: ({ pageParam = 1 }) =>
      getWorkouts({ 
        pageSize, 
        pageNumber: pageParam, 
        sortBy, 
        sortDirection, 
        search
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((acc, page) => acc + page.data.length, 0);
      return totalFetched < lastPage.totalCount ? allPages.length + 1 : undefined;
    },
    placeholderData: (previousData) => previousData,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};
```

**useWorkoutMutations Hook**:
```typescript
export const useWorkoutMutations = () => {
  const queryClient = useQueryClient();

  const createWorkout = useMutation({
    mutationFn: createWorkoutApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKOUTS] });
    },
  });

  const updateWorkout = useMutation({
    mutationFn: ({ id, workout }: { id: number; workout: UpdateWorkout }) =>
      updateWorkoutApi(id, workout),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKOUTS] });
    },
  });

  return {
    createWorkout,
    updateWorkout,
  };
};
```

## 🎨 UI Patterns & Styling

### 1. Tailwind CSS Configuration

**Design Tokens**:
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        secondary: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          600: '#0284c7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
};
```

### 2. Animation Patterns

**Framer Motion Configurations**:
```typescript
// Page transitions
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

// Card animations
const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  hover: { scale: 1.05 },
};
```

### 3. Responsive Design

**Breakpoint Strategy**:
```typescript
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
};

// Usage in components
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {workouts.map(workout => (
    <WorkoutCard key={workout.id} workout={workout} />
  ))}
</div>
```

## 🔄 State Management

### 1. React Query for Server State

**Query Keys Strategy**:
```typescript
export const QUERY_KEYS = {
  WORKOUTS: 'workouts',
  WORKOUT_DETAILS: 'workout-details',
  WORKOUT_TYPES: 'workout-types',
  USER_PROFILE: 'user-profile',
  DASHBOARD_STATS: 'dashboard-stats',
  COMMENTS: 'comments',
  FAVORITES: 'favorites',
} as const;
```

### 2. Context for Global State

**Auth Context**:
```typescript
interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (credentials: LoginCredentials) => {
    const response = await authApi.login(credentials);
    setUser(response.user);
    localStorage.setItem('token', response.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## 📱 Routing & Navigation

### 1. Route Configuration

**Router Setup**:
```typescript
const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="workouts" element={<WorkoutList />} />
          <Route path="workouts/:id" element={<WorkoutDetails />} />
          <Route path="workouts/:id/session" element={<WorkoutSession />} />
          <Route path="create-workout" element={<CreateWorkout />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
```

### 2. Protected Routes

**PrivateRoute Component**:
```typescript
interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
```

## 🎯 Performance Optimization

### 1. Code Splitting

**Lazy Loading**:
```typescript
const WorkoutList = lazy(() => import('./pages/workouts/WorkoutList'));
const WorkoutSession = lazy(() => import('./pages/workouts/WorkoutSession'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));

const App: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AppRouter />
    </Suspense>
  );
};
```

### 2. Memoization

**React.memo and useMemo**:
```typescript
const WorkoutCard = React.memo<WorkoutCardProps>(({ workout, onPreview, onShare }) => {
  const formattedDate = useMemo(() => 
    formatDate(workout.createdDate), [workout.createdDate]
  );

  const handlePreview = useCallback(() => {
    onPreview(workout);
  }, [workout, onPreview]);

  return (
    <div className="workout-card">
      <h3>{workout.name}</h3>
      <p>{formattedDate}</p>
      <button onClick={handlePreview}>Preview</button>
    </div>
  );
});
```

### 3. Image Optimization

**Lazy Loading Images**:
```typescript
const LazyImage: React.FC<{ src: string; alt: string; className?: string }> = ({ 
  src, 
  alt, 
  className 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={className}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};
```

## 🧪 Testing Strategy

### 1. Component Testing

**Testing Library Setup**:
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = createTestQueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// Test example
describe('WorkoutCard', () => {
  it('renders workout information correctly', () => {
    const mockWorkout = {
      id: 1,
      name: 'Test Workout',
      workoutTypeName: 'AMRAP',
      createdBy: 'Test User',
      createdDate: new Date(),
    };

    render(
      <WorkoutCard 
        workout={mockWorkout} 
        viewMode="grid"
        onPreview={jest.fn()}
        onShare={jest.fn()}
      />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('Test Workout')).toBeInTheDocument();
    expect(screen.getByText('AMRAP')).toBeInTheDocument();
  });
});
```

### 2. Hook Testing

**Custom Hook Testing**:
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useWorkouts } from '../hooks/useWorkouts';

describe('useWorkouts', () => {
  it('fetches workouts successfully', async () => {
    const { result } = renderHook(() => useWorkouts(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });
});
```

## 📊 Development Tools

### 1. Development Server

**Vite Configuration**:
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:5051',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
});
```

### 2. TypeScript Configuration

**tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["../shared/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

*This document provides a comprehensive overview of the frontend architecture. For specific implementation details, refer to the component source code and related documentation.*