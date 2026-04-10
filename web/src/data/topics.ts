import type { TopicMeta } from '../types/topic';

export const topics: TopicMeta[] = [
  {
    id: 'binary-search',
    slug: 'binary-search',
    title: 'Бинарный поиск',
    description: 'Поиск в отсортированном массиве за O(log n)',
    icon: 'Search',
    complexity: 'O(log n)',
  },
  {
    id: 'two-pointers',
    slug: 'two-pointers',
    title: 'Два указателя',
    description: 'Два указателя навстречу или в одном направлении',
    icon: 'CompareArrows',
    complexity: 'O(n)',
  },
  {
    id: 'sliding-window',
    slug: 'sliding-window',
    title: 'Скользящее окно',
    description: 'Оптимизация работы с подмассивами и подстроками',
    icon: 'ViewColumn',
    complexity: 'O(n)',
  },
  {
    id: 'hash-map',
    slug: 'hash-map',
    title: 'Хеш-таблицы',
    description: 'Быстрый поиск, подсчёт частот, группировка',
    icon: 'Tag',
    complexity: 'O(1) lookup',
  },
  {
    id: 'stacks-queues',
    slug: 'stacks-queues',
    title: 'Стеки и очереди',
    description: 'LIFO/FIFO структуры для обработки последовательностей',
    icon: 'Layers',
    complexity: 'O(n)',
  },
  {
    id: 'trees',
    slug: 'trees',
    title: 'Обход деревьев',
    description: 'DFS/BFS, рекурсия, работа с вложенными структурами',
    icon: 'AccountTree',
    complexity: 'O(n)',
  },
];
