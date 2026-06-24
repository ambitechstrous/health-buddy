# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Health-Buddy** is a cross-platform meal planning application that uses Claude AI to generate personalized nutrition recommendations and optimal meal plans based on user anthropometric data and fitness goals.

**Tech Stack**:
- **Frontend**: React Native + Expo (iOS, Android, Web)
- **Backend**: Go with Chi HTTP router + Model Context Protocol (MCP)
- **AI Integration**: Anthropic SDK (Claude API)

---

## Repository Structure

```
health-buddy/
├── frontend/                 # React Native + Expo app
│   ├── app/                 # Expo Router pages (file-based routing)
│   ├── components/          # UI components (MealPlanScreen, NavBar)
│   ├── models/              # TypeScript domain types
│   ├── package.json         # Dependencies: Zustand, TanStack Query, Zod
│   ├── tsconfig.json        # TypeScript config (extends expo/tsconfig.base)
│   └── README.md            # Frontend-specific docs
│
├── backend/                  # Go backend
│   ├── cmd/
│   │   ├── server/          # HTTP API server (port 8080)
│   │   └── mcp/             # MCP server for Claude tool integration
│   ├── internal/
│   │   ├── handlers/        # HTTP request handlers (IHandler interface)
│   │   └── mcptools/        # MCP tool implementations
│   ├── go.mod               # Go 1.25.0, depends on anthropic-sdk-go, chi/v5, go-sdk (MCP)
│   └── README.md            # Backend architecture notes
│
├── ai-recipes/              # Placeholder for LLM prompt templates/recipes
└── README.md                # Project overview

```

---

## Common Commands

### Frontend (Expo + React Native)

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (interactive menu)
npm start

# Run on platforms
npm run web          # Browser
npm run ios          # iOS simulator
npm run android      # Android emulator

# Quality checks
npm run type-check   # TypeScript
npm run lint         # ESLint
npm test             # Jest

# Watch mode for tests
npm test -- --watch
```

**Environment**:
- Create `frontend/.env` with `EXPO_PUBLIC_API_URL=http://localhost:3000/api` (or point to backend)
- Backend currently runs on `:8080`; frontend expects `/api` prefix (integration needed)

### Backend (Go)

```bash
cd backend

# Build HTTP server binary
go build -o server ./cmd/server

# Run HTTP server (listens on :8080)
go run ./cmd/server

# Build MCP server binary
go build -o mcp ./cmd/mcp

# Run MCP server
go run ./cmd/mcp

# Run all tests
go test ./...

# Run specific package tests with verbose output
go test -v ./internal/handlers

# Format all Go files
go fmt ./...

# Run linter (requires golangci-lint)
golangci-lint run ./...

# Download/update dependencies
go mod download
go mod tidy
```

**Environment**:
- Backend loads `.env` via `godotenv` (required for MCP server; HTTP server doesn't currently use it)
- `TEST=true` env var enables mock responses in nutrition_requirements MCP tool

---

## Architecture & Design

### Frontend Architecture

**Key Patterns**:
- **State Management**: Zustand stores for client state (households, meal plans)
- **Server State**: TanStack Query v5 for async API data
- **Validation**: Zod schemas for runtime type safety
- **Navigation**: Expo Router with file-based routing and bottom tab navigator
- **Styling**: React Native StyleSheet with centralized theme constants

**Domain Types** (`models/meals.ts`):
- `HouseholdMember` - User profile with weight (kg), height (cm), age, biological sex, activity level, dietary restrictions
- `Meal` - Name, type (breakfast/lunch/dinner/snack), ingredients with ratios, nutrition facts, prep/cook times
- `WeeklyPlan` - 7-day meal schedule with per-day aggregated nutrition
- `NutritionFacts` - Macros (calories, protein, carbs, fat, fiber, sugar) + micros (sodium, calcium, iron, vitamins, potassium)

**Nutrition Utilities** (`models/nutrition.ts`):
- `computeBMR()` / `computeTDEE()` - Harris-Benedict equation for daily calorie needs
- `computeNutritionForRatio()` - Scale ingredient nutrition by quantity (supports g, kg, oz, lb, ml, l, tsp, tbsp, cup, piece, serving)
- `sumNutrition()`, `getMacroPctOfCalories()` - Aggregation helpers
- Unit-to-grams conversion via `toGrams()`

**Current UI State**:
- Mock meal data hardcoded in `MealPlanScreen.tsx` (7 days of breakfast/lunch/dinner)
- NavBar with 3 tabs (Meal Plan, Saved, Profile); tab switching not yet wired
- TODO: Connect to real backend `/meals` endpoint

### Backend Architecture

**HTTP Server** (`cmd/server/main.go`):
- Chi v5 router on `:8080`
- Single endpoint: `GET /meals` - currently returns "hello world"
- TODO: Integrate with MCP tools and database for real meal plan generation

**MCP Server** (`cmd/mcp/main.go`):
- Registers Claude as MCP client
- Exposes tools that Claude can call to compute nutrition and generate meal plans
- Uses `godotenv` to load API keys (e.g., `ANTHROPIC_API_KEY`)

**MCP Tools** (`internal/mcptools/nutrition_requirements.go`):
- `nutrition_requirements` tool: Takes `weight` (lbs) and `goals` (text), returns JSON with calories, protein, carbs, fat, fiber
- Uses Claude Sonnet 4.5 (TODO: upgrade to Opus)
- Prompts Claude with system instruction: "You are an expert nutritionist. Please give recommendations..."
- Mock mode when `TEST=true` (avoids token spend during debugging)
- **Status**: Incomplete - handler doesn't return computed response, needs error handling

**Request Handlers** (`internal/handlers/handler.go`):
- Interface-based design: `IHandler` interface + `Handler` struct
- Dependency injection via `NewHandler()` factory
- TODO: Add database client (SQL), HTTP client for external APIs

**Dependencies**:
- `anthropics/anthropic-sdk-go` v1.51.1 - Claude API
- `modelcontextprotocol/go-sdk` v1.6.1 - MCP protocol
- `joho/godotenv` - .env file loading
- `go-chi/chi/v5` - HTTP router

---

## Key Implementation Notes

### Frontend-Backend Integration
- Frontend currently calls backend at `http://localhost:8080` (configurable via `EXPO_PUBLIC_API_URL`)
- API response format: JSON with meal plans, nutrition per meal, per-day aggregates
- TanStack Query will handle caching and refetching
- TODO: Implement actual API client in frontend (currently uses mock data)

### Nutrition Computation
- BMR uses Mifflin-St Jeor equation (revised Harris-Benedict)
- TDEE = BMR × activity multiplier (sedentary: 1.2, extra_active: 1.9)
- Ingredient nutrition stored per 100g; scaled by unit conversions
- Volumetric units (ml, l, tsp, tbsp, cup) lack density data—requires ingredient density lookup

### MCP Integration
- Backend acts as MCP server; Claude CLI connects to it
- Tools are registered with name, description, and handler function
- Tool responses returned as `mcp.CallToolResult` with success/error
- Useful for: nutrition calculation, meal suggestion, grocery list generation

### Database
- Not yet integrated; handlers have TODO comments
- Will need SQL client setup (Postgres likely, based on patterns)
- Should mirror domain types: households, members, meals, ingredients, plans

---

## Development Workflow

1. **Make code changes** in frontend or backend
2. **Frontend**: `npm run type-check && npm run lint` then `npm start` to test on device/simulator
3. **Backend**: `go fmt ./...` then `go run ./cmd/server` (or `./cmd/mcp`) to test locally
4. **Integration**: Run both servers in separate terminals, hit `http://localhost:8080/meals` from frontend
5. **MCP Testing**: Run `go run ./cmd/mcp` and test tools via Claude CLI or local client

---

## Known Limitations & TODOs

- **Frontend**: UI is mock-only; no real backend integration yet
- **Backend HTTP Server**: Only `/meals` endpoint; returns hardcoded "hello world"
- **MCP Handler**: `nutrition_requirements` handler incomplete (missing response formatting, error handling)
- **Database**: Not implemented; no persistence
- **Env Config**: Backend loads .env but HTTP server doesn't use it; MCP server requires `ANTHROPIC_API_KEY`
- **API URL Mismatch**: Frontend expects `/api` prefix; backend serves from root (`.../meals` not `.../api/meals`)

---

## References

- **Frontend README**: `frontend/README.md` (Expo setup, stack details, project structure)
- **Backend README**: `backend/README.md` (Architecture overview, MCP/Claude integration goals)
- **Anthropic SDK**: https://github.com/anthropics/anthropic-sdk-go
- **MCP Spec**: https://modelcontextprotocol.io/
