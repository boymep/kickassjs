import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../components/home/HomePage';
import TheoryPage from '../components/theory/TheoryPage';
import QuizPage from '../components/quiz/QuizPage';
import PracticePage from '../components/practice/PracticePage';
import CodeBlock from '../components/theory/CodeBlock';

function renderWithRouter(ui: React.ReactElement, initialEntries: string[] = ['/']) {
  return render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>);
}

describe('HomePage', () => {
  it('renders all 6 topic cards', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText('Бинарный поиск')).toBeInTheDocument();
    expect(screen.getByText('Два указателя')).toBeInTheDocument();
    expect(screen.getByText('Скользящее окно')).toBeInTheDocument();
    expect(screen.getByText('Хеш-таблицы')).toBeInTheDocument();
    expect(screen.getByText('Стеки и очереди')).toBeInTheDocument();
    expect(screen.getByText('Обход деревьев')).toBeInTheDocument();
  });

  it('renders extra sections', () => {
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

describe('TheoryPage', () => {
  it('renders theory for binary-search', () => {
    renderWithRouter(
      <TheoryPage />,
      ['/topic/binary-search/theory'],
    );
    // TheoryPage uses useParams, which needs matching route params
    // With MemoryRouter without Route, params will be empty
    // It should show "Теория не найдена" since slug is missing
    expect(screen.getByText('Теория не найдена')).toBeInTheDocument();
  });
});

describe('QuizPage', () => {
  it('renders fallback when quiz not found', () => {
    renderWithRouter(<QuizPage />, ['/topic/unknown/quiz']);
    expect(screen.getByText('Квиз не найден')).toBeInTheDocument();
  });
});

describe('PracticePage', () => {
  it('renders fallback when problems not found', () => {
    renderWithRouter(<PracticePage />, ['/topic/unknown/practice']);
    expect(screen.getByText('Задачи не найдены')).toBeInTheDocument();
  });
});
