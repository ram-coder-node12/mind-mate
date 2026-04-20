# MindMate

MindMate is a burnout-aware study planner for students who need to manage academic work without ignoring wellbeing. It combines task planning, daily check-ins, burnout risk scoring, personalized recommendations, and analytics in one authenticated React application.

## Problem Statement

Students often plan assignments separately from their sleep, stress, mood, and energy. That creates a blind spot: a student can appear productive while moving toward burnout. MindMate helps students track both academic workload and wellbeing signals so they can make better daily decisions before stress becomes unmanageable.

## Target Users

- College and school students managing assignments, exams, and deadlines.
- Students who want simple wellbeing tracking without using a separate health app.
- Mentors or evaluators reviewing whether a student project solves a real user problem with React and Firebase.

## Core Features

- Email/password and Google authentication with Firebase Auth.
- Protected dashboard routes for authenticated users only.
- Task CRUD with status, subject, deadline, priority, and estimated hours.
- Daily wellbeing check-ins with mood, stress, energy, sleep, study hours, and notes.
- Burnout risk score based on workload and wellbeing metrics.
- Personalized recommendations for rest, sleep, stress, and study balance.
- Analytics charts for wellbeing trends, sleep vs. study balance, stress intensity, and task distribution.
- Responsive sidebar layout for desktop and mobile.

## Tech Stack

- React 19 with Vite
- React Router
- Context API
- Firebase Auth
- Cloud Firestore
- Recharts
- Lucide React icons
- CSS with responsive media queries

## React Concepts Demonstrated

- Functional components and component composition
- Props and reusable UI components
- `useState` for local UI and form state
- `useEffect` for auth and Firestore subscriptions
- Controlled components for task and check-in forms
- Conditional rendering for loading, empty, error, modal, and edit states
- Lists and keys for tasks, check-ins, recommendations, and charts
- Lifting state through context-backed app data
- React Router routing and protected routes
- Context API for auth and persistent app data
- `useMemo` for burnout scoring, recommendations, and chart data
- `useCallback` for stable event handlers
- `useRef` for form input references and modal autofocus
- `React.lazy` and `Suspense` for lazy-loaded analytics

## Project Structure

```text
src/
  components/   Reusable UI components and route guards
  context/      Auth and app data providers
  hooks/        Custom hooks for scoring, recommendations, and toasts
  pages/        Route-level screens
  services/     Firebase setup and Firestore CRUD services
```

## Setup Instructions

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file from `.env.example` and add your Firebase web app values:

   ```bash
   cp .env.example .env
   ```

3. In Firebase Console, enable Authentication providers:

   - Email/Password
   - Google

4. Create a Cloud Firestore database with collections for `users`, `tasks`, and `checkins`.

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Create a production build:

   ```bash
   npm run build
   ```

## Demo Video Guide

In a 3-5 minute demo, cover:

- The student burnout and workload problem.
- Signup/login and protected routes.
- Creating, updating, filtering, and deleting tasks.
- Adding and editing wellbeing check-ins.
- Dashboard burnout score, recommendations, and analytics.
- Why Firebase, Context API, custom hooks, and lazy loading were used.

## Deployment

The app can be deployed on Vercel or Netlify. Add the same Firebase environment variables in the hosting provider settings before deploying.
