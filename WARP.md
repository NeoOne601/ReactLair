# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is an interactive React learning application that teaches React concepts through hands-on visualizations. The app uses analogies (LEGO blocks, gardens, blueprints) to help beginners understand React hooks, state management, Virtual DOM, and component architecture.

**Tech Stack:**
- **Frontend:** React 18 with Vite as the build tool
- **State Management:** Context API + useReducer (custom implementation mimicking Redux patterns)
- **Styling:** TailwindCSS with dark mode support
- **Backend:** Vercel serverless function for AI explanations (Google Gemini API)
- **Icons:** lucide-react
- **Deployment:** Vercel

## Development Commands

### Local Development

**Option 1: Frontend Only (Fast, but API won't work)**
```bash
npm run dev
```
Runs Vite dev server on http://localhost:5173 (default). The `/api/explain` endpoint will not work.

**Option 2: Fullstack with Vercel Dev (Recommended)**
```bash
vercel dev
```
Runs both Vite and serverless functions locally. Required for testing AI explanations feature. Typically runs on http://localhost:3000.

First-time setup: Run `vercel link` once to link your project.

### Build & Preview
```bash
npm run build    # Production build
npm run preview  # Preview production build locally
```

### Linting
```bash
npm run lint     # ESLint with React plugins
```

**Note:** There are no test scripts configured in this project.

## Environment Variables

The application requires a Google Gemini API key for AI explanations:

**For local development (Vercel Dev):**
- Add to `.env` file in project root:
  ```
  GEMINI_API_KEY=your_key_here
  ```
  (Do NOT prefix with `VITE_` for serverless functions)

**For Vercel deployment:**
- Add `GEMINI_API_KEY` (without VITE_ prefix) in the Vercel project settings

## Architecture Overview

### State Management Pattern

This app uses a **custom "Master Blueprint" pattern** that combines Context API and useReducer to simulate Redux-style global state management for educational purposes. This is NOT Redux Toolkit, even though `src/store/` exists—it's a teaching tool.

**Key architectural components:**

1. **Global State Provider** (`HouseProvider` in `App.jsx`)
   - Uses `useReducer` with `houseReducer` to manage global state
   - Provides state via `HouseStateContext` and dispatch via `HouseDispatchContext`
   - State shape: `{ blocks: [], explanation: '', isLoading: false, error: null }`
   - Accessible via custom hooks: `useHouseState()` and `useHouseDispatch()`

2. **Page-Specific State Provider** (`TutorProvider` in `App.jsx`)
   - Each page (House, Garden, VDOM Lab, Hooks Lab) gets its own `TutorProvider` instance
   - Manages educational messages/explanations shown to users
   - **Important:** This is intentionally scoped per-page to avoid message "bleeding" between pages
   - Accessible via `useTutor()` hook

3. **Theme Context** (Global)
   - Separate context for light/dark mode toggle
   - Managed at the `AppWrapper` level
   - Accessible via `useTheme()` hook

### Component Organization

**Monolithic Architecture:** Unlike typical React projects, this app is intentionally structured with ALL components in a single `src/App.jsx` file (~1400 lines). This is a pedagogical choice to show students the entire application flow in one place.

**Component hierarchy:**
```
AppWrapper (Theme + HouseProvider)
└── App (Main router & layout)
    ├── Header (Navigation)
    ├── Sidebar (Concept buttons + MasterBlueprint display)
    └── Main Content (Current page)
        ├── HousePage (TutorProvider wrapper)
        ├── GardenPage (TutorProvider wrapper)
        ├── VirtualDomLab (TutorProvider wrapper)
        └── HooksLabPage (TutorProvider wrapper)
```

**Routing:** Uses simple state-based routing (`page` state in `App`) instead of React Router. Changes to the `page` state trigger a useEffect that shows a "routing toast" notification.

### API Integration

**Serverless Function:** `api/explain.js`
- Handles POST requests from frontend
- Proxies requests to Google Gemini API (`gemini-2.5-flash-preview-09-2025` model)
- Securely stores API key server-side
- Returns generated explanations as JSON: `{ text: string }`
- Error handling for missing keys, failed API calls, and empty responses

**Frontend Integration:** The `generateExplanation` async function in `App.jsx` dispatches actions to manage loading/success/error states:
- `GENERATION_PENDING` → set loading
- `GENERATION_FULFILLED` → set explanation text
- `GENERATION_REJECTED` → set error message

### Static Data

- `src/data/concepts.js` - Concept metadata for the learning panel sidebar
- `src/data/blockTypes.js` - Block type definitions for the "building blocks" feature (colors, costs, names)

**Note:** These are used by older/legacy components. The main app redefines concepts inline in `App.jsx`.

### Styling Approach

**TailwindCSS with JIT:**
- Dark mode enabled via `class` strategy (see `tailwind.config.js`)
- Custom animations defined: `flash`, `flash-blueprint`
- Utility-first approach with conditional classes for dark mode
- Backdrop blur effects used extensively for modern glass-morphism UI

## Key Development Patterns

### Adding New Interactive Pages

When creating a new educational page:

1. Create the page component (e.g., `NewPageContent`)
2. Wrap it in a `TutorProvider` for isolated messaging:
   ```jsx
   function NewPage() {
     return (
       <TutorProvider>
         <NewPageContent />
       </TutorProvider>
     );
   }
   ```
3. Add routing logic in the `App` component's conditional rendering
4. Add a navigation button in the header
5. Use `useTutor()` hook to call `addMessage()` when teaching concepts

### Working with the "Master Blueprint" State

**To read state:**
```jsx
const { blocks, explanation, isLoading, error } = useHouseState();
```

**To update state:**
```jsx
const dispatch = useHouseDispatch();
dispatch({ type: 'ADD_BLOCK', payload: { type: 'WALL' } });
```

**Supported action types:**
- `ADD_BLOCK` - Adds a new block with auto-generated ID and default props
- `UPDATE_BLOCK_PROPS` - Updates props of existing block by ID
- `REMOVE_BLOCK` - Removes block by ID
- `CLEAR_EXPLANATION` - Clears AI explanation modal
- `GENERATION_PENDING/FULFILLED/REJECTED` - AI generation states

### Dark Mode

The app automatically detects system preference on load (`ThemeContext.jsx`). Toggle between light/dark using:
```jsx
const { theme, setTheme } = useTheme();
setTheme(theme === 'light' ? 'dark' : 'light');
```

## Important Implementation Details

### Block Components (LEGO Analogy)

Each block type (Wall, Window, Lamp, Door, Roof) is a separate component with:
- `onEdit` handler (opens PropEditorModal for editable props)
- `onRemove` handler (removes from state)
- Double-click to edit props
- Hover reveals edit/delete buttons

**Lamp component:** Demonstrates `useState` with internal `isLit` state separate from global state.

### Educational Features

**TutorBot component:** Shows the most recent educational message with concept-specific color coding.

**EventLog component:** Displays chronological log of all messages (last 10) with auto-scroll.

**Interactive demos:**
- House Page: Add/edit/remove building blocks (teaches Components, Props, useState, Context)
- Garden Page: Plant/remove flowers with timers (teaches useEffect, useEffect cleanup, useReducer, useMemo, useRef)
- VDOM Lab: Visualize Virtual DOM diffing algorithm with 3-panel comparison
- Hooks Lab: Drag-and-drop exercise teaching Rules of Hooks

## Common Pitfalls

1. **Don't accidentally import from `src/store/`**: The Redux-like files there (`store.js`, `houseSlice.js`) are legacy/unused. The actual state management is in `App.jsx` using Context + useReducer.

2. **TutorProvider scope**: Each page needs its own `TutorProvider` instance. Don't move it to the global `AppWrapper` level or messages will bleed between pages.

3. **API key naming**: Server-side environment variables should NOT have the `VITE_` prefix. Only client-side variables need that prefix.

4. **Vercel Dev required for API**: Standard `npm run dev` won't run the serverless function. Use `vercel dev` to test AI explanations.

5. **Dark mode classes**: Tailwind dark mode requires explicit `dark:` prefixed classes. The `dark` class is toggled on `document.documentElement` by `ThemeContext`.

## Deployment Notes

- Deployed on Vercel with automatic builds from Git pushes
- `vercel.json` configures rewrites for `/api/*` routes
- Environment variable `GEMINI_API_KEY` must be set in Vercel dashboard
- No build-time secrets needed; all sensitive data handled server-side
