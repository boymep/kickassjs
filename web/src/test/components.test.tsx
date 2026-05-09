import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../components/home/HomePage';
import PracticePage from '../components/practice/PracticePage';
import LessonPage from '../components/lesson/LessonPage';
import CodeBlock from '../components/theory/CodeBlock';
import { ProgressProvider } from '../hooks/useProgress';

function renderWithRouter(ui: React.ReactElement, initialEntries: string[] = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ProgressProvider>{ui}</ProgressProvider>
    </MemoryRouter>,
  );
}

describe('HomePage', () => {
  it('renders all 6 algorithm topic cards', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText('Бинарный поиск')).toBeInTheDocument();
    expect(screen.getByText('Два указателя')).toBeInTheDocument();
    expect(screen.getByText('Скользящее окно')).toBeInTheDocument();
    expect(screen.getByText('Хеш-таблицы')).toBeInTheDocument();
    expect(screen.getByText('Стеки и очереди')).toBeInTheDocument();
    expect(screen.getByText('Обход деревьев')).toBeInTheDocument();
  });

  it('renders System Design section', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText('System Design')).toBeInTheDocument();
    expect(screen.getByText('Стратегии рендеринга')).toBeInTheDocument();
  });

  it('renders extra tool sections', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText('Определи паттерн')).toBeInTheDocument();
    expect(screen.getByText('Шпаргалка для собеса')).toBeInTheDocument();
    expect(screen.getByText('JS-ловушки')).toBeInTheDocument();
  });
});

describe('CodeBlock', () => {
  it('renders code with syntax highlighting', () => {
    render(<CodeBlock code="const x = 1;" />);
    expect(screen.getByText('const')).toBeInTheDocument();
    expect(screen.getByText('x')).toBeInTheDocument();
  });

  it('renders inside a pre element', () => {
    const { container } = render(<CodeBlock code="const x = 42;" />);
    const pre = container.querySelector('pre');
    expect(pre).toBeInTheDocument();
  });
});

describe('LessonPage', () => {
  it('renders fallback when topic slug is unknown', () => {
    render(
      <MemoryRouter initialEntries={['/topic/nonexistent']}>
        <ProgressProvider>
          <Routes>
            <Route path="/topic/:slug" element={<LessonPage />} />
          </Routes>
        </ProgressProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText('Тема не найдена')).toBeInTheDocument();
  });
});

describe('PracticePage', () => {
  it('renders fallback when problems not found', () => {
    renderWithRouter(<PracticePage />, ['/topic/unknown/practice']);
    expect(screen.getByText('Задачи не найдены')).toBeInTheDocument();
  });
});
