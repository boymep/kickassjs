// =====================================================
// 5 популярных React задач на собеседование Frontend
// =====================================================
// Вставить в локальный Vite проект или https://codesandbox.io

import { useState, useEffect, useRef, useCallback } from 'react';


// =====================================================
// ЗАДАЧА 1: useDebounce — кастомный хук
// =====================================================
// Реализуйте хук useDebounce(value, delay).
// Возвращает debounced-значение: обновляется только через delay мс
// после того, как value перестало меняться.
//
// Зачем: не отправлять fetch на каждый keystroke в поиске.
//
// Вопросы на собесе:
//   - Почему важно очищать setTimeout в cleanup функции useEffect?
//   - Чем отличается от debounce на уровне обработчика события?
//
// Пример:
//   const [query, setQuery] = useState('');
//   const debouncedQuery = useDebounce(query, 500);
//   useEffect(() => { fetch('/search?q=' + debouncedQuery); }, [debouncedQuery]);

function useDebounce<T>(value: T, delay: number): T {
  // ваш код
}

// Компонент для проверки: раскомментируйте и экспортируйте
// function SearchBox() {
//   const [query, setQuery] = useState('');
//   const debouncedQuery = useDebounce(query, 400);
//
//   useEffect(() => {
//     if (debouncedQuery) console.log('fetch:', debouncedQuery);
//   }, [debouncedQuery]);
//
//   return (
//     <input
//       value={query}
//       onChange={(e) => setQuery(e.target.value)}
//       placeholder="Поиск..."
//     />
//   );
// }


// =====================================================
// ЗАДАЧА 2: useFetch — хук для загрузки данных
// =====================================================
// Реализуйте хук useFetch<T>(url: string).
// Возвращает { data, loading, error }.
// При смене url — отменяет предыдущий запрос через AbortController.
//
// Вопросы на собесе:
//   - Почему нужен AbortController? Что будет без него?
//   - Как обработать race condition (старый ответ приходит позже нового)?
//   - Когда использовать React Query вместо useFetch?

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function useFetch<T>(url: string): FetchState<T> {
  // ваш код
}

// Компонент для проверки:
// function UserList() {
//   const { data, loading, error } = useFetch<{ id: number; name: string }[]>(
//     'https://jsonplaceholder.typicode.com/users',
//   );
//
//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;
//   return <ul>{data?.map((u) => <li key={u.id}>{u.name}</li>)}</ul>;
// }


// =====================================================
// ЗАДАЧА 3: useLocalStorage — хук синхронизации с localStorage
// =====================================================
// Реализуйте хук useLocalStorage<T>(key, initialValue).
// API идентично useState, но значение персистится в localStorage.
//
// Вопросы на собесе:
//   - Что если JSON.parse выбросит ошибку?
//   - Как синхронизировать между вкладками? (событие storage)
//   - Как работать с SSR (Next.js)? window недоступен на сервере.
//
// Пример:
//   const [theme, setTheme] = useLocalStorage('theme', 'light');
//   setTheme('dark'); // → сохранится между сессиями

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // ваш код
}

// Компонент для проверки:
// function ThemeToggle() {
//   const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
//   return (
//     <button onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}>
//       Тема: {theme}
//     </button>
//   );
// }


// =====================================================
// ЗАДАЧА 4: Виртуальный список (Virtual List)
// =====================================================
// Реализуйте компонент VirtualList, который рендерит только
// видимые строки из большого массива (10 000+ элементов).
//
// Props:
//   items: T[]              — полный список данных
//   itemHeight: number      — высота одной строки в px (фиксированная)
//   containerHeight: number — высота скроллируемого контейнера
//   renderItem: (item: T, index: number) => React.ReactNode
//
// Вопросы на собесе:
//   - Что такое overscan и зачем он нужен?
//   - Как работать с переменной высотой строк?
//   - Когда использовать react-virtual / react-window?

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

function VirtualList<T>({ items, itemHeight, containerHeight, renderItem }: VirtualListProps<T>) {
  // ваш код
}

// Пример использования:
// const ITEMS = Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` }));
//
// function App() {
//   return (
//     <VirtualList
//       items={ITEMS}
//       itemHeight={40}
//       containerHeight={400}
//       renderItem={(item) => (
//         <div style={{ padding: '0 12px', lineHeight: '40px', borderBottom: '1px solid #eee' }}>
//           {item.name}
//         </div>
//       )}
//     />
//   );
// }


// =====================================================
// ЗАДАЧА 5: useIntersectionObserver — infinite scroll
// =====================================================
// Реализуйте хук useIntersectionObserver(ref, options).
// Возвращает isIntersecting: boolean.
// Используется для infinite scroll или lazy-loading изображений.
//
// Вопросы на собесе:
//   - Чем IntersectionObserver лучше обработчика scroll?
//   - Что такое threshold и rootMargin?
//   - Почему важно вызывать observer.disconnect() в cleanup?
//
// Пример:
//   const bottomRef = useRef<HTMLDivElement>(null);
//   const isVisible = useIntersectionObserver(bottomRef, { threshold: 0.1 });
//   useEffect(() => { if (isVisible) loadMore(); }, [isVisible]);

function useIntersectionObserver(
  ref: React.RefObject<Element | null>,
  options: IntersectionObserverInit = {},
): boolean {
  // ваш код
}

// Компонент для проверки:
// function InfiniteList() {
//   const [items, setItems] = useState(() => Array.from({ length: 20 }, (_, i) => i));
//   const [loading, setLoading] = useState(false);
//   const bottomRef = useRef<HTMLDivElement>(null);
//   const isVisible = useIntersectionObserver(bottomRef, { threshold: 0.1 });
//
//   useEffect(() => {
//     if (!isVisible || loading) return;
//     setLoading(true);
//     setTimeout(() => {
//       setItems((prev) => [...prev, ...Array.from({ length: 20 }, (_, i) => prev.length + i)]);
//       setLoading(false);
//     }, 800);
//   }, [isVisible]);
//
//   return (
//     <div style={{ height: 400, overflowY: 'auto' }}>
//       {items.map((n) => (
//         <div key={n} style={{ padding: 16, borderBottom: '1px solid #eee' }}>Item {n}</div>
//       ))}
//       <div ref={bottomRef}>{loading ? 'Loading...' : ''}</div>
//     </div>
//   );
// }
