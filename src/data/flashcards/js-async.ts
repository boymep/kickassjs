import type { TopicFlashcards } from '../../types/flashcard';

export const jsAsyncFlashcards: TopicFlashcards = {
  topicId: 'js-async',
  cards: [
    {
      id: 'jsa-f1',
      question: 'Что такое Promise? Опишите три состояния и переходы между ними.',
      answer:
        'Promise — объект-обёртка над асинхронной операцией. Состояния: pending (ожидание), fulfilled (успех), rejected (ошибка). Переход из pending — необратим: промис либо выполнен, либо отклонён навсегда.',
      keyPoints: [
        'pending → fulfilled через resolve(value)',
        'pending → rejected через reject(error) или throw',
        'Нельзя перейти из fulfilled/rejected в другое состояние',
        '.then() всегда возвращает новый Promise (chaining)',
      ],
    },
    {
      id: 'jsa-f2',
      question: 'В чём разница Promise.all, Promise.allSettled, Promise.race и Promise.any?',
      answer:
        'Четыре метода параллельного запуска промисов с разной семантикой: all — все или ошибка, allSettled — все с результатами, race — первый завершившийся, any — первый успешный.',
      keyPoints: [
        'Promise.all: первый rejected → общий reject. Используйте когда нужны все результаты',
        'Promise.allSettled: всегда ждёт всех, возвращает [{status, value/reason}]',
        'Promise.race: первый resolved или rejected — победитель',
        'Promise.any: первый fulfilled. AggregateError если все rejected',
      ],
      code: `const [a, b, c] = await Promise.all([p1, p2, p3]);

const results = await Promise.allSettled([p1, p2, p3]);
results.forEach(r => {
  if (r.status === 'fulfilled') use(r.value);
  else log(r.reason);
});`,
    },
    {
      id: 'jsa-f3',
      question: 'Почему async/await внутри forEach не работает как ожидается?',
      answer:
        'forEach не является async-aware — он не ждёт промисы, которые возвращают callback-и. Все итерации запускаются параллельно и forEach немедленно возвращает undefined.',
      keyPoints: [
        'forEach игнорирует возвращаемый Promise из async callback',
        'Для последовательного выполнения — for...of с await',
        'Для параллельного с ожиданием — Promise.all + map',
        'reduce с async также ненадёжен без явного await',
      ],
      code: `// ❌ forEach не ждёт
items.forEach(async (x) => {
  await process(x); // запускаются все сразу
});
console.log('done'); // выводится немедленно!

// ✅ Последовательно:
for (const x of items) await process(x);

// ✅ Параллельно с ожиданием:
await Promise.all(items.map(x => process(x)));`,
    },
    {
      id: 'jsa-f4',
      question: 'Как правильно обрабатывать ошибки в async/await?',
      answer:
        'try/catch с await ловит ошибки промисов — это надёжный способ. Главный нюанс: ошибки в колбэках (не обёрнутых в промис) try/catch не поймает.',
      keyPoints: [
        'try/catch работает только если await находится внутри try',
        'Ошибки в setTimeout/обычных callback не ловятся через try/catch снаружи',
        'Необработанный rejection в Node.js 15+ завершает процесс',
        'Можно использовать .catch() как альтернативу try/catch',
      ],
      code: `// ✅ Правильно:
async function load() {
  try {
    const data = await fetchData();
    return data;
  } catch (err) {
    console.error(err); // ловит reject от fetchData
  }
}

// ❌ Ошибка в setTimeout не поймается:
try {
  setTimeout(() => { throw new Error('!'); }, 0);
} catch (e) { /* никогда */ }`,
    },
    {
      id: 'jsa-f5',
      question: 'Что такое promisify? Когда и зачем он нужен?',
      answer:
        'Promisify превращает функцию в Node.js callback-стиле (err, result) => {} в Promise. Нужен для работы со старым Node.js API через async/await.',
      keyPoints: [
        'Node.js util.promisify — встроенная реализация',
        'Соглашение: первый аргумент callback — ошибка (err-first)',
        'fs.promises — современный способ, promisify не нужен',
        'Нельзя применить к функциям с нестандартным callback',
      ],
      code: `const { promisify } = require('util');
const readFile = promisify(require('fs').readFile);

const data = await readFile('file.txt', 'utf8');
// Вместо: fs.readFile('file.txt', (err, d) => {})`,
    },
    {
      id: 'jsa-f6',
      question: 'Как ограничить параллелизм промисов? Зачем это нужно?',
      answer:
        'Запуск тысячи промисов одновременно перегрузит сервер/API. Ограниченный параллелизм позволяет запускать не более N промисов одновременно, ожидая завершения одного перед стартом следующего.',
      keyPoints: [
        'Promise.all с полным массивом — без ограничений (опасно для больших данных)',
        'Паттерн: pool с Set, Promise.race(executing) для освобождения слота',
        'Готовые решения: p-limit, bottleneck npm пакеты',
        'Применяется при batch-запросах к API, БД, обработке файлов',
      ],
      code: `async function limitConcurrency(fns, limit) {
  const executing = new Set();
  for (const fn of fns) {
    const p = fn().finally(() => executing.delete(p));
    executing.add(p);
    if (executing.size >= limit)
      await Promise.race(executing);
  }
  return Promise.all([...executing]);
}`,
    },
  ],
};
