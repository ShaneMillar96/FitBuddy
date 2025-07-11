# FitBuddy Documentation

Welcome to the FitBuddy comprehensive documentation. This directory contains detailed documentation for all aspects of the FitBuddy CrossFit application.

## 📖 Documentation Overview

FitBuddy is a CrossFit-focused fitness application that enables gym members to share workouts, track results, and engage with their fitness community. The application has been simplified to focus exclusively on CrossFit-style workouts.

## 🏗️ Architecture Documentation

- **[System Overview](architecture/system-overview.md)** - High-level architecture and component relationships
- **[Backend Architecture](architecture/backend-architecture.md)** - .NET Core API structure and patterns
- **[Frontend Architecture](architecture/frontend-architecture.md)** - React + TypeScript application structure
- **[Database Design](architecture/database-design.md)** - PostgreSQL schema and data relationships

## 🚀 Features Documentation

- **[Authentication](features/authentication.md)** - User registration, login, and JWT authentication
- **[Workout Management](features/workout-management.md)** - Creating, editing, and managing CrossFit workouts
- **[Workout Sessions](features/workout-sessions.md)** - Real-time workout tracking and timer functionality
- **[Results Tracking](features/results-tracking.md)** - Performance logging and personal records
- **[Dashboard Analytics](features/dashboard-analytics.md)** - User performance metrics and visualizations
- **[Comments System](features/comments-system.md)** - Member interaction and workout discussions
- **[Favorites System](features/favorites-system.md)** - Workout bookmarking and personal collections
- **[AI Exercise Analysis](features/ai-exercise-analysis.md)** - Video analysis and form correction

## 🔌 API Documentation

- **[API Overview](api/api-overview.md)** - REST API structure and conventions
- **[Workouts API](api/workouts-api.md)** - Workout CRUD operations and endpoints
- **[Authentication API](api/authentication-api.md)** - Login, registration, and token management
- **[Members API](api/members-api.md)** - User profile and member management
- **[Analysis API](api/analysis-api.md)** - Exercise video analysis endpoints

## 🎨 Frontend Documentation

- **[Components Library](frontend/components-library.md)** - Reusable UI components and patterns
- **[Pages & Routing](frontend/pages-routing.md)** - Application routing and page structure
- **[Hooks & State](frontend/hooks-state.md)** - Custom hooks and state management patterns
- **[UI Patterns](frontend/ui-patterns.md)** - Design system and UI conventions

## 🗃️ Database Documentation

- **[Schema Overview](database/schema-overview.md)** - Complete database schema reference
- **[Table Relationships](database/table-relationships.md)** - Entity relationships and foreign keys
- **[Data Flow](database/data-flow.md)** - How data moves through the application

## 🔧 Infrastructure Documentation

- **[Docker Setup](infrastructure/docker-setup.md)** - Development environment configuration
- **[AI Service](infrastructure/ai-service.md)** - Exercise analysis service integration
- **[Deployment](infrastructure/deployment.md)** - Production deployment procedures

## 👩‍💻 Development Documentation

- **[Getting Started](development/getting-started.md)** - Development environment setup
- **[Workflows](development/workflows.md)** - Development processes and best practices
- **[Troubleshooting](development/troubleshooting.md)** - Common issues and solutions

## 🏃‍♂️ Quick Start

1. **New to FitBuddy?** Start with [System Overview](architecture/system-overview.md)
2. **Setting up development?** Check [Getting Started](development/getting-started.md)
3. **Working with the API?** See [API Overview](api/api-overview.md)
4. **Building UI components?** Review [Components Library](frontend/components-library.md)
5. **Database questions?** Check [Schema Overview](database/schema-overview.md)

## 📋 Recent Updates

- **Database Simplification**: Streamlined schema to focus on CrossFit-only functionality
- **UI Redesign**: Simplified workout list and session interfaces
- **API Streamlining**: Removed complex filtering in favor of search-based functionality
- **CrossFit Focus**: Removed multi-category support to focus exclusively on CrossFit workouts

## 📝 Documentation Maintenance

This documentation is maintained alongside the codebase. When implementing new features or making changes:

1. Update relevant documentation files
2. Add new features to the appropriate section
3. Update this README if new documentation categories are added
4. Keep code examples current with the actual implementation

## 🤝 Contributing

When contributing to FitBuddy:

1. Read the relevant documentation first
2. Follow the patterns and conventions described
3. Update documentation when making changes
4. Add new documentation for new features

---

*Last Updated: January 2025*
*Version: 2.0 (CrossFit-Only Simplified)*