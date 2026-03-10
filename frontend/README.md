# Health Buddy — Frontend

Cross-platform meal planner app (iOS, Android, Web) built with **Expo + React Native + TypeScript**.

## Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 51 + Expo Router v3 |
| Language | TypeScript (strict) |
| State | Zustand |
| Server state | TanStack Query v5 |
| Validation | Zod |
| Styling | React Native StyleSheet + theme constants |
| Navigation | Expo Router (file-based) |

## Project Structure

```
frontend/
├── app/                  # Expo Router pages (file-based routing)
│   ├── _layout.tsx       # Root layout
│   ├── +not-found.tsx    # 404 screen
│   └── (tabs)/           # Bottom tab navigator
│       ├── index.tsx     # Dashboard
│       ├── planner.tsx   # Meal planner
│       ├── household.tsx # Household members
│       └── nutrition.tsx # Nutrition overview
├── components/
│   ├── ui/               # Reusable primitives (Button, Card, etc.)
│   ├── meals/            # Meal-specific components
│   └── nutrition/        # Nutrition chart components
├── constants/
│   └── theme.ts          # Colors, spacing, typography, shadows
├── hooks/
│   ├── useColorScheme.ts # Theme-aware color hook
│   └── useHousehold.ts   # Household state hook
├── lib/
│   ├── api.ts            # Base API client (fetch wrapper)
│   └── nutrition.ts      # BMR/TDEE, macro, unit utilities
├── store/
│   └── index.ts          # Zustand stores (household, meal plan)
└── types/
    └── index.ts          # All TypeScript domain types
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- For mobile: Expo Go app on your phone

### Install

```bash
cd frontend
npm install
```

### Run

| Target | Command |
|---|---|
| Interactive menu | `npm start` |
| Web browser | `npm run web` |
| iOS simulator | `npm run ios` |
| Android emulator | `npm run android` |

### Other scripts

```bash
npm run type-check   # TypeScript validation
npm run lint         # ESLint
npm test             # Jest
```

## Environment

Create a `.env` file at `frontend/.env`:

```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

The API base URL defaults to `http://localhost:3000/api` if not set.
