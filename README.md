#React Lair: An Interactive React Learning App

Welcome to React Lair! This is a kid-friendly, interactive application designed to make learning the core concepts of React fun and intuitive. Instead of just reading, you learn by doing—playing with interactive labs that visualize complex ideas.

This project is built using React (with Vite), TailwindCSS, and Lucide Icons. All application logic is contained within a single file (src/App.jsx) to demonstrate how a complex app can be built from components. It also features a backend serverless function (/api/explain.js) that connects to the Gemini API for an AI-powered tutor.

Core Features
Gamified Labs: Each core React concept has its own interactive page or "lab".
AI Tutor: Click any concept to get a simple, kid-friendly explanation from an AI tutor powered by the Gemini API.
Tutor Bot: An on-screen bot that gives you a live, behind-the-scenes explanation of what React is "thinking" as you perform actions.
Page-Specific Context: The Tutor Bot's messages are isolated to each page, demonstrating how useContext can create separate "channels".
Visual State: See a live-updating "Master Blueprint" (the global state) as you build your house.
Light/Dark Mode: A theme-toggling button that demonstrates a simple useContext implementation.

Interactive Learning Labs

1. The House (Global State)
   Concepts: useContext + useReducer (as a "Master Blueprint"), Props, Components.
   What it is: A "blueprint" page where you can add, remove, and edit components like walls, windows, doors, and lamps.

How it Teaches:
Components: Each item (Wall, Roof, Lamp) is a self-contained React component.
Props: Double-click any component to open a modal and change its props (like color or label). You see the component update instantly.
Global State: The "Master Blueprint" panel shows the entire global state object, which updates in real-time as you make changes, showing how useReducer manages a central store.

Tutor Bot: The bot explains what happens when you add a block (e.g., "You dispatched an 'ADD_BLOCK' action...") or edit a prop.

2. The Garden (Local State & Hooks)
   Concepts: useReducer (for local state), useEffect, useEffect Cleanup, useRef, useMemo.
   What it is: A garden where you can plant, remove, and water flowers.

How it Teaches:
useReducer: The garden's state (which plots have flowers) is managed by its own reducer, separate from the global blueprint.
useEffect: When you plant a flower, a useEffect hook starts a "sunshine" timer. The Tutor Bot narrates this, explaining that a "side effect" has been triggered.
useEffect Cleanup: When you remove the flower, the useEffect's cleanup function runs to stop the timer. The Tutor Bot explains that this prevents memory leaks.
useRef: A "Focus Shovel" button uses useRef to directly focus the first flower plot, which the Tutor Bot explains.
useMemo: A "Total Flowers" counter uses useMemo to prevent a "slow calculation" from running every time the theme changes, demonstrating optimization.

3. The VDOM Lab (Diffing & Reconciliation)
   Concepts: Virtual DOM, Diffing Algorithm, Reconciliation.
   What it is: A split-screen lab that visualizes what React does when state changes.
   How it Teaches:
   You click a button to change state (e.g., "Change Text").
   Diffing: The app shows the "Previous VDOM" and "New VDOM" trees. It highlights the one node that changed (diffing).
   Patching: It then highlights the "Real DOM" to show that React only "patched" or updated that one specific part of the page, not the whole thing.
   The Tutor Bot narrates this entire process step-by-step.

4. The Hooks Lab (Rules of Hooks)
   Concepts: What Hooks are, "Rules of Hooks" (Top-Level only).
   What it is: A drag-and-drop game where you give a "blueprint" component super-powers.

How it Teaches:
You drag "tools" (like useState) from a "Tool Belt".
Rule #1: If you drop the hook in the correct "Top-Level" dropzone, it snaps into place, and the component preview gains new powers (like memory).
Invalid Placement: If you try to drop the hook inside a "Bad Drop Zone" (an if block), it's rejected, and the Tutor Bot explains why this isn't allowed (Hooks must be called in the same order).

Local Development

Prerequisites
Node.js (v18+)
npm
Vercel CLI (Recommended for running the API locally)

Installation
Clone the repository (or create the files locally).

Install dependencies:
npm install lucide-react nanoid

(Note: react-redux and @reduxjs/toolkit are not used, as state is managed by useContext and useReducer).

Running the App
This command runs the Vite server and the serverless function in the /api folder, simulating the production environment perfectly.
(One time) Link your project: vercel link
Run the dev server:
vercel dev

This will start your app on a local URL (like http://localhost:3000).

Deployment
Push your code to GitHub.
Import the project on Vercel.
Add your Gemini API key as an Environment Variable in the Vercel project settings:
Name: GEMINI_API_KEY
Value: your_secret_api_key_here
Vercel will automatically build and deploy the site.
