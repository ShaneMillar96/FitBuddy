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
- Frontend: `http://localhost:5173`
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
If `http://localhost:5173` shows "connection refused":
1. Check if Vite process is running: `ps aux | grep vite`
2. Kill existing processes: `pkill -f vite`
3. Restart with background process: `cd ui/application && nohup npm run dev > /tmp/vite.log 2>&1 &`
4. Wait 3-5 seconds then test: `curl -I http://localhost:5173`

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