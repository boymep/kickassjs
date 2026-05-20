import type { TopicFlashcards } from '../../types/flashcard';

export const nodeOptimizationFlashcards: TopicFlashcards = {
  topicId: 'node-optimization',
  cards: [
    {
      id: 'nodeop-f1',
      question: 'Что такое LRU Cache? Как реализовать O(1) get и put?',
      answer:
        'LRU (Least Recently Used) — кеш, вытесняющий наименее недавно использованный элемент. Реализация через Map: он сохраняет порядок вставки, а delete+set перемещает элемент в конец.',
      keyPoints: [
        'Map сохраняет порядок вставки → первый элемент — самый старый',
        'get(key): delete + set переставляет элемент в конец (как свежий)',
        'put(key): если полный — удалить map.keys().next().value (самый старый)',
        'Все операции O(1): Map.has, Map.delete, Map.set, Map.keys().next()',
      ],
      code: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val); // в конец
    return val;
  }
  put(key, val) {
    this.cache.delete(key);
    if (this.cache.size >= this.capacity)
      this.cache.delete(this.cache.keys().next().value);
    this.cache.set(key, val);
  }
}`,
    },
    {
      id: 'nodeop-f2',
      question: 'Что такое мемоизация с TTL? Как реализовать истечение кеша?',
      answer:
        'Мемоизация с TTL хранит вместе с результатом время его создания. При запросе проверяет: не истёк ли TTL. Если истёк — вычисляет заново.',
      keyPoints: [
        'Без TTL кеш растёт бесконечно и возвращает устаревшие данные',
        'Ключ = JSON.stringify(args) для простых аргументов',
        'Date.now() — для проверки TTL (достаточная точность)',
        'Для production: отдельно инвалидация по событию (cache invalidation)',
      ],
      code: `function memoizeWithTTL(fn, ttlMs) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    if (cached && Date.now() - cached.time < ttlMs) {
      return cached.value;
    }
    const value = fn(...args);
    cache.set(key, { value, time: Date.now() });
    return value;
  };
}`,
    },
    {
      id: 'nodeop-f3',
      question: 'Что такое N+1 проблема? Как её решает DataLoader / батчинг?',
      answer:
        'N+1: при загрузке N записей с дочерними данными делается N дополнительных запросов к БД. DataLoader батчирует индивидуальные запросы за один тик event loop в один SELECT WHERE id IN (...).',
      keyPoints: [
        'N+1 — частая проблема GraphQL resolvers и ORM с lazy loading',
        'DataLoader накапливает запросы за один «тик» через process.nextTick',
        'Один batch запрос вместо N: 100 запросов → 1',
        'Также DataLoader кеширует результаты в рамках одного request',
      ],
    },
    {
      id: 'nodeop-f4',
      question: 'Что такое Connection Pool? Почему нельзя создавать соединение на каждый запрос?',
      answer:
        'TCP-соединение + аутентификация к БД занимает 50-100ms. Pool держит N готовых соединений — запросы берут свободное за <1ms. Создание соединения на каждый HTTP-запрос = +100ms latency.',
      keyPoints: [
        'Рекомендуемый размер пула: CPU_count × 2-4',
        'Слишком большой пул нагружает БД',
        'Слишком маленький — запросы встают в очередь',
        'Всегда освобождать соединение в finally: client.release()',
      ],
    },
    {
      id: 'nodeop-f5',
      question: 'Как найти утечку памяти в Node.js приложении?',
      answer:
        'Утечка памяти — объекты накапливаются в heap и не собираются GC. Для диагностики: heap snapshot до/после операции, сравнение retained objects.',
      keyPoints: [
        'Симптом: heapUsed растёт при мониторинге process.memoryUsage()',
        'Инструменты: Chrome DevTools (--inspect), clinic heapprofiler, heapdump',
        'Частые причины: забытые EventEmitter, глобальные кеши без TTL, closure-ловушки',
        'Heap snapshot: снять до операции, снять после, найти новые удержанные объекты',
      ],
      code: `// Мониторинг:
setInterval(() => {
  const { heapUsed } = process.memoryUsage();
  console.log((heapUsed / 1024 / 1024).toFixed(1), 'MB');
}, 5000);
// Если значение постоянно растёт — утечка`,
    },
    {
      id: 'nodeop-f6',
      question: 'Что такое Circuit Breaker? Как реализовать паттерн OPEN/CLOSED/HALF-OPEN?',
      answer:
        'Circuit Breaker останавливает попытки обратиться к сервису после серии ошибок. Три состояния: CLOSED (работает), OPEN (блокирует), HALF-OPEN (тестовый вызов после таймаута).',
      keyPoints: [
        'OPEN → немедленный throw без сетевого вызова (fail-fast)',
        'Через timeout: OPEN → HALF-OPEN → один тестовый запрос',
        'Успех → CLOSED (сброс счётчика), ошибка → обратно в OPEN',
        'Снижает нагрузку на деградирующий сервис',
      ],
    },
  ],
};
