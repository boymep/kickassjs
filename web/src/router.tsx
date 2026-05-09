import { createBrowserRouter, Navigate, useParams } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import TopicLayout from './components/layout/TopicNav';
import HomePage from './components/home/HomePage';
import LessonPage from './components/lesson/LessonPage';
import PracticePage from './components/practice/PracticePage';
import ProblemView from './components/practice/ProblemView';
import PatternGamePage from './components/pattern-game/PatternGamePage';
import CheatsheetPage from './components/cheatsheet/CheatsheetPage';
import JsPitfallsPage from './components/js-pitfalls/JsPitfallsPage';
import BugHuntPage from './components/bug-hunt/BugHuntPage';

/** Redirects /topic/:slug/<legacy> → /topic/:slug{#hash}, preserving the slug param. */
function LegacyTopicRedirect({ hash }: { hash?: string }) {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/topic/${slug ?? ''}${hash ?? ''}`} replace />;
}

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <HomePage /> },
      {
        path: '/topic/:slug',
        element: <TopicLayout />,
        children: [
          { index: true, element: <LessonPage /> },
          { path: 'theory', element: <LegacyTopicRedirect /> },
          { path: 'quiz', element: <LegacyTopicRedirect hash="#final-quiz" /> },
          { path: 'flashcards', element: <LegacyTopicRedirect hash="#flashcards" /> },
          { path: 'practice', element: <PracticePage /> },
          { path: 'practice/:problemId', element: <ProblemView /> },
        ],
      },
      { path: '/pattern-game', element: <PatternGamePage /> },
      { path: '/cheatsheet', element: <CheatsheetPage /> },
      { path: '/js-pitfalls', element: <JsPitfallsPage /> },
      { path: '/bug-hunt', element: <BugHuntPage /> },
    ],
  },
]);
