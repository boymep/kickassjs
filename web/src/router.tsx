import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import TopicLayout from './components/layout/TopicNav';
import HomePage from './components/home/HomePage';
import TheoryPage from './components/theory/TheoryPage';
import QuizPage from './components/quiz/QuizPage';
import PracticePage from './components/practice/PracticePage';
import ProblemView from './components/practice/ProblemView';
import PatternGamePage from './components/pattern-game/PatternGamePage';
import CheatsheetPage from './components/cheatsheet/CheatsheetPage';
import JsPitfallsPage from './components/js-pitfalls/JsPitfallsPage';
import FlashcardsPage from './components/flashcards/FlashcardsPage';
import BugHuntPage from './components/bug-hunt/BugHuntPage';

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <HomePage /> },
      {
        path: '/topic/:slug',
        element: <TopicLayout />,
        children: [
          { index: true, element: <Navigate to="theory" replace /> },
          { path: 'theory', element: <TheoryPage /> },
          { path: 'quiz', element: <QuizPage /> },
          { path: 'practice', element: <PracticePage /> },
          { path: 'practice/:problemId', element: <ProblemView /> },
          { path: 'flashcards', element: <FlashcardsPage /> },
        ],
      },
      { path: '/pattern-game', element: <PatternGamePage /> },
      { path: '/cheatsheet', element: <CheatsheetPage /> },
      { path: '/js-pitfalls', element: <JsPitfallsPage /> },
      { path: '/bug-hunt', element: <BugHuntPage /> },
    ],
  },
]);
