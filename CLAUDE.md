# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FitBuddy is a fitness application that prevents gym-goers from falling into repetitive workout routines by enabling members to share and participate in workouts within their affiliate gyms. The platform includes member registration, workout creation/sharing, results tracking, commenting, and exercise video analysis with AI.

## Architecture

This is a full-stack application with the following components:

### Backend (.NET Core)
- **FitBuddy.Api**: Web API controllers and endpoints (`server/src/FitBuddy.Api/`)
- **FitBuddy.Services**: Business logic and service layer (`server/src/FitBuddy.Services/`)
- **FitBuddy.Dal**: Data Access Layer with Entity Framework (`server/src/FitBuddy.Dal/`)
- **FitBuddy.Infrastructure**: Infrastructure and DI configuration (`server/src/FitBuddy.Infrastructure/`)

### Frontend (React + TypeScript)
- **UI Application**: React app with Vite, TypeScript, Tailwind CSS (`ui/application/`)
- **Shared Components**: Reusable components and utilities (`ui/shared/`)

### AI Service (Python Flask)
- **Exercise Analysis**: Python service for exercise video analysis using OpenCV and MediaPipe (`infrastructure/ai-service/`)

### Database
- **PostgreSQL**: Primary database with Flyway migrations (`database/`)
- Migrations are organized in `database/application/migrations/`

## Starting the Project

### Quick Start (Full Stack)
```bash
# 1. Start Docker services (database, AI service, migrations)
docker compose --profile dev up -d

# 2. Start backend API (from server/src/FitBuddy.Api/)
cd server/src/FitBuddy.Api && dotnet run

# 3. Start frontend (from ui/application/) - run in background
cd ui/application && nohup npm run dev > /tmp/vite.log 2>&1 &
```

**Access Points:**
- Frontend: `http://localhost:5174` (Note: Port may change if 5173 is in use)
- Backend API: `http://localhost:5051`
- Database: `localhost:5432`
- AI Service: `http://localhost:5001`

### Individual Service Commands

#### Database & Docker Services
```bash
# Start all services (database, flyway migrations, AI service)
docker compose --profile dev up -d

# Stop all services
docker compose --profile dev down

# View service status
docker compose ps

# Note: Makefile commands may have formatting issues, use docker compose directly
```

#### Frontend (from ui/application/)
```bash
# Development server
npm run dev

# Development server in background (recommended for CLI usage)
nohup npm run dev > /tmp/vite.log 2>&1 &

# Build production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

#### Backend (from server/)
```bash
# Build solution
dotnet build

# Run tests
dotnet test

# Run API (from server/src/FitBuddy.Api/)
cd server/src/FitBuddy.Api && dotnet run

# Run API in background
cd server/src/FitBuddy.Api && nohup dotnet run > /tmp/api.log 2>&1 &
```

#### AI Service (from infrastructure/ai-service/)
```bash
# Install dependencies
pip install -r requirements.txt

# Run Flask service
python ai-analysis-service.py
```

## Key Technologies

- **Backend**: .NET Core, Entity Framework, AutoMapper, PostgreSQL
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, React Query, Chart.js
- **AI**: Python Flask, OpenCV, MediaPipe
- **Database**: PostgreSQL with Flyway migrations
- **Containerization**: Docker Compose for local development

## Troubleshooting

### Frontend Not Accessible
If `http://localhost:5174` shows "connection refused":
1. Check if Vite process is running: `ps aux | grep vite`
2. Kill existing processes: `pkill -f vite`
3. Restart with background process: `cd ui/application && nohup npm run dev > /tmp/vite.log 2>&1 &`
4. Wait 3-5 seconds then test: `curl -I http://localhost:5174`
5. Note: Vite automatically uses next available port if 5173 is occupied

### Backend Issues
- Backend warnings about nullable references are normal and don't prevent startup
- Backend runs on `http://localhost:5051`
- Check process: `lsof -i :5051`

### Docker Issues
- Use `docker compose` instead of `docker-compose` (newer syntax)
- Ensure Docker Desktop is running
- Images may take time to download on first run

## Code Organization

### Backend Patterns
- Controllers in `FitBuddy.Api/Controllers/` follow REST conventions
- Services implement business logic and are injected via DI
- DTOs separate internal models from API contracts
- Specifications pattern used for complex queries
- AutoMapper profiles handle object mapping

### Frontend Patterns
- Custom hooks in `src/hooks/` for API calls and state management
- React Query for server state management
- Components organized by feature (`components/workout/`, `components/layout/`)
- TypeScript interfaces in `src/interfaces/`
- Route protection via `utils/private-route.tsx`

### Database
- Flyway versioned migrations with descriptive names
- Separate schemas for application and affiliate management
- Models follow EF Core conventions with proper relationships

## Enhanced Workout System (Recent Implementation)

### Workout Categories & Classification
The application now features a comprehensive workout categorization system:

**Categories Available:**
- **CrossFit WOD** (ID: 1): High-intensity functional fitness workouts
- **Hyrox** (ID: 2): Hybrid fitness race training combining running and functional movements
- **Running Intervals** (ID: 3): Running-based cardio and interval training
- **Stretching** (ID: 4): Flexibility, mobility, and recovery sessions
- **Swimming** (ID: 5): Pool and open water swimming workouts
- **Weight Session** (ID: 6): Traditional bodybuilding and strength training workouts

### Dynamic Workout Type System (Latest Implementation)
The application now features a revolutionary dynamic workout creation system that provides workout-type specific interfaces:

**Workout Types with Specialized Interfaces:**
- **EMOM** (ID: 1): Every Minute on the Minute - Minute-by-minute exercise assignment with visual timeline
- **AMRAP** (ID: 2): As Many Rounds As Possible - Round definition with time cap and exercise ordering
- **For Time** (ID: 3): Complete as fast as possible - Sequential exercises with optional rounds
- **Tabata** (ID: 4): High-intensity intervals - Work/rest period configuration with preset timings
- **Ladder** (ID: 5): Rep progression patterns - Ascending/descending/pyramid rep schemes

**Key Features:**
- **Dynamic UI Rendering**: Each workout type renders a completely different interface
- **Type-Specific Validation**: Custom validation rules for each workout style
- **Visual Feedback**: Color-coded themes and real-time calculations
- **Data Flexibility**: JSONB storage for workout-type specific configurations

### Enhanced Database Schema
**New Tables:**
- `workout_categories`: Primary workout classification
- `workout_sub_types`: Specific variations within each category
- `exercises`: Comprehensive exercise database
- `workout_exercises`: Junction table linking workouts to exercises

**Enhanced Existing Tables:**
- `workouts`: Added category_id, sub_type_id, difficulty_level, estimated_duration_minutes, equipment_needed (nullable array), workout_structure (JSONB)
- `exercises`: Added muscle_groups (nullable array), equipment_needed (nullable array), difficulty_level, is_compound
- `workout_exercises`: Added workout_type_data (JSONB), minute_number, round_number, sequence_position for workout-type specific data

### AutoMapper Configuration Lessons Learned
When adding new models and DTOs, ensure all mapping layers are configured:

1. **Services Layer** (`/src/FitBuddy.Services/Profiles/`):
   - Domain models ↔ DTOs
   - Handle nullable arrays with proper mapping
   - Set CreatedDate for new entities

2. **API Layer** (`/src/FitBuddy.Api/Profiles/`):
   - DTOs ↔ ViewModels  
   - RequestModels ↔ DTOs
   - **Critical**: Map collection types (e.g., `CreateWorkoutExerciseRequestModel[]` → `CreateWorkoutExerciseDto[]`)

3. **Common AutoMapper Issues Fixed:**
   - Missing `CreateWorkoutExerciseRequestModel` → `CreateWorkoutExerciseDto` mapping
   - Nullable array handling for `equipment_needed` and `muscle_groups`
   - Complex navigation property mappings (e.g., `Exercise.Category.Name` → `ExerciseDto.CategoryName`)

### Service Registration Requirements
New services must be registered in `Program.cs`:
```csharp
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IExerciseService, ExerciseService>();
```

### Dynamic Workout Type Components (Latest)
**Component Architecture:**
- `WorkoutBuilder.tsx`: Main orchestrator that dynamically renders workout-type specific builders
- `EMOMBuilder.tsx`: Blue-themed minute-by-minute interface with visual timeline
- `AMRAPBuilder.tsx`: Orange-themed round definition with time cap and exercise ordering
- `ForTimeBuilder.tsx`: Yellow-themed sequential exercises with optional rounds
- `TabataBuilder.tsx`: Red-themed work/rest intervals with preset timing options
- `LadderBuilder.tsx`: Purple-themed rep progression with pattern visualization
- `ExercisePicker.tsx`: Shared exercise selection modal with search functionality

**State Management:**
- Workout type data initialization based on selected type
- Real-time validation with type-specific rules
- Data transformation for API submission
- Backward compatibility with legacy workout creation

**UI/UX Features:**
- Color-coded themes for each workout type
- Drag-and-drop exercise reordering
- Real-time calculations (duration, volume, rounds)
- Preset configuration buttons
- Visual progression indicators
- Responsive design with mobile optimization

### Frontend Integration Notes
**Removed Duplicate UI Elements:**
- Eliminated redundant "CrossFit Workout Type" section when CrossFit WOD category is selected
- Streamlined workout creation flow to use category-based selection

**Key Components:**
- `CategorySelector`: Handles workout category and sub-type selection
- `WorkoutBuilder`: Dynamic exercise selection based on category
- Enhanced create-workout page with category-driven workflow

### Database Troubleshooting
**Nullable Array Columns:**
- Changed `string[]` to `string[]?` in domain models for equipment_needed and muscle_groups
- Prevents `InvalidCastException` when database contains null values
- Critical for backward compatibility with existing data

**Service Dependencies:**
- Categories and exercises services must be registered before workout service
- AutoMapper profiles must cover all DTO/ViewModel mappings used in controllers
- Database must contain seed data for categories before testing workout creation

### Development Workflow Improvements
**Starting from Fresh State:**
1. Restart Docker services: `docker compose --profile dev up -d`
2. Kill existing backend: `pkill -f "dotnet run"`
3. Start backend: `cd src/FitBuddy.Api && dotnet run > /tmp/backend.log 2>&1 &`
4. Frontend auto-restarts via Vite HMR

**Testing New Endpoints:**
- Categories: `GET /categories`
- Exercises by category: `GET /exercises/category/{categoryId}`
- Enhanced workout creation: `POST /workouts` with category and exercise data

### Performance Considerations
- Use Entity Framework Include() for eager loading of related data
- Category and exercise data can be cached on frontend for better UX
- Consider pagination for large exercise lists within categories

## Enhanced Workout Filtering System (Latest Implementation)

### Server-Side Filtering Architecture
The workout filtering system has been completely overhauled to use server-side filtering with proper OR logic for categories:

**Backend Changes:**
- Updated `WorkoutsController.GetWorkouts()` to accept: `categoryIds[]`, `minDifficultyLevel`, `maxDifficultyLevel`, `minDuration`, `maxDuration`, `equipmentNeeded[]`
- Implemented server-side OR logic for multiple category selection
- Added new `/workouts/equipment` endpoint that returns actual equipment from database
- Removed client-side filtering dependencies that broke with server-side pagination

**Frontend Changes:**
- Updated `useWorkouts` hook to support new filter parameters
- Removed Creator section from filter panel per user requirements
- Fixed active filter display to show duration filters and support individual filter removal
- Equipment list now loads dynamically from database instead of hardcoded values
- All filtering now happens server-side for better performance with pagination

**Key Fixes Applied:**
- Categories work with OR logic (selecting Hyrox + Swimming shows workouts from EITHER category)
- Duration filters work properly with server-side range filtering
- Equipment filters use actual database equipment values
- Active filters display duration and allow individual removal via 'x' buttons
- Filter count badge includes all active filter types

### Important Development Guidelines
- **DO NOT run build commands** (`npm run build`, `dotnet build`, `docker compose up`) - user handles these manually
- Focus on code implementation and logical fixes
- Test compilation errors can be fixed, but avoid running the actual build/test commands

## Recent Implementation Updates

### CrossFit-Only Simplification (Latest)
- **Simplified Database Schema**: Removed complex migration files V1.2-V1.16, replaced with single V1.2__simplified_crossfit_schema.sql
- **Streamlined Tables**: Reduced from 16+ tables to 9 core tables focused on CrossFit functionality
- **Removed Filtering**: Eliminated complex filtering from workout list interface, replaced with simple search and sort
- **UI Redesign**: Simplified workout-list.tsx and workout-session.tsx for CrossFit-only focus
- **Backend API**: Removed category filtering endpoints, streamlined WorkoutsController for basic pagination

### Database Schema Redesign
**New Simplified Schema (9 tables)**:
- `members` - User accounts with authentication
- `workout_types` - CrossFit types (EMOM, AMRAP, For Time, Tabata, Ladder)
- `workouts` - Workout definitions with CrossFit-specific fields
- `exercises` - Library of 24 essential CrossFit movements
- `workout_exercises` - Junction table for workout composition
- `workout_results` - Enhanced performance tracking
- `comments` - Member comments on workouts
- `score_types` - Scoring methods (Time, Rounds, Weight, etc.)
- `workout_favorites` - Member favorites functionality

### CrossFit Exercise Library
**Essential CrossFit Movements**:
- Bodyweight: Burpees, Push-ups, Pull-ups, Air Squats, Mountain Climbers
- Weighted: Thrusters, Deadlifts, Kettlebell Swings, Wall Balls, Box Jumps
- Olympic: Clean and Jerk, Snatch
- Gymnastic: Muscle-ups, Handstand Push-ups, Toes-to-Bar
- Cardio: Rowing, Running, Bike/Assault Bike

### UI Simplification
- **Workout List**: Removed complex filtering, kept search and sort only
- **Workout Session**: Redesigned to match CrossFit session interface with orange gradient header, circular timer, 2x2 stats grid
- **Preview Modal**: Replaced exercises preview with leaderboard placeholder
- **CrossFit Branding**: Red/orange color scheme throughout application

### Dynamic Workout Type System Troubleshooting
**Common Issues and Solutions:**

1. **Workout Type ID Mismatch**:
   - Problem: Selected workout type shows default builder instead of type-specific interface
   - Cause: WORKOUT_TYPES constants don't match database API IDs
   - Solution: Ensure WORKOUT_TYPES in `workout-types.ts` match `/workouts/types` endpoint IDs (1-5, not 7-11)

2. **Type-Specific Data Not Saving**:
   - Problem: Workout type data isn't included in API submission
   - Cause: Missing `onWorkoutTypeDataChange` prop or state management
   - Solution: Verify WorkoutBuilder receives both `workoutTypeId` and `onWorkoutTypeDataChange` props

3. **Component Not Rendering**:
   - Problem: Builder component shows loading or blank state
   - Cause: Missing imports or incorrect type checking
   - Solution: Check all builder imports in WorkoutBuilder.tsx and verify type guards

4. **Validation Errors**:
   - Problem: Type-specific validation rules not working
   - Cause: Validation utilities not imported or called
   - Solution: Import `validateWorkout` in create-workout.tsx and call in form validation

### Code Quality Improvements
- **Fixed syntax error** in CommentProfile.cs (removed double semicolon)
- **Implemented file cleanup** in AnalysisService.cs for uploaded exercise videos
- Added configurable cleanup option with proper error handling
- All outstanding TODOs have been implemented or resolved
- **Dynamic Workout Type System**: Complete implementation with type-safe validation and responsive UI

### Dynamic Workout Creation Summary
The dynamic workout type system now provides:
- ✅ **EMOM**: Minute-by-minute exercise assignment with visual timeline
- ✅ **AMRAP**: Round definition with time cap and exercise ordering
- ✅ **For Time**: Sequential exercises with optional rounds and volume tracking
- ✅ **Tabata**: Work/rest intervals with preset timing options
- ✅ **Ladder**: Rep progression patterns with visual sequence preview
- ✅ **Validation**: Type-specific validation rules with warnings and errors
- ✅ **Responsive UI**: Color-coded themes and mobile optimization

## Documentation

### Comprehensive Documentation System
- **claudedocs Directory**: Created comprehensive documentation system with organized structure
- **Architecture Docs**: System overview, backend architecture, frontend architecture, database design
- **Feature Docs**: Detailed documentation for workout management, authentication, dynamic workout types, and other core features
- **API Docs**: Complete API reference and usage examples
- **Development Docs**: Setup guides, workflows, and troubleshooting

### Latest Documentation Updates
- **Dynamic Workout Types**: Comprehensive documentation of the new workout-type specific interface system
- **Component Architecture**: Detailed breakdown of builder components and state management
- **Validation System**: Type-specific validation rules and error handling
- **UI/UX Patterns**: Color-coding, responsive design, and user interaction patterns

**Documentation Structure**:
```
claudedocs/
├── README.md (Overview and navigation)
├── architecture/ (System design and component relationships)
├── features/ (Feature-specific documentation)
├── api/ (API documentation and examples)
├── frontend/ (Component library and patterns)
├── database/ (Schema and data relationships)
├── infrastructure/ (Docker, AI service, deployment)
└── development/ (Setup, workflows, troubleshooting)
```

**Documentation Maintenance**:
- Update relevant documentation when implementing new features
- Keep CLAUDE.md updated with references to new documentation
- Include code examples and implementation details in feature docs
- Maintain architecture diagrams and relationship mappings