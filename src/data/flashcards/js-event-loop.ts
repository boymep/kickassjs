import type { TopicFlashcards } from '../../types/flashcard';

export const jsEventLoopFlashcards: TopicFlashcards = {
  topicId: 'js-event-loop',
  cards: [
    {
      id: 'jsel-f1',
      question: 'Что такое Event Loop и как он работает?',
      answer:
        'Event Loop — механизм, позволяющий JavaScript быть асинхронным оставаясь однопоточным. Он непрерывно проверяет: пуст ли Call Stack? Если да — берёт задачи из очередей и помещает в стек для выполнения.',
      keyPoints: [
        'JavaScript однопоточен — один Call Stack',
        'Асинхронные операции (I/O, таймеры) выполняются вне стека (Web APIs / libuv)',
        'Сначала все микрозадачи (Promise), затем одна макрозадача (setTimeout)',
        'После каждой макрозадачи — снова все микрозадачи',
      ],
      code: `console.log('1'); // sync
setTimeout(() => console.log('3'), 0); // macro
Promise.resolve().then(() => console.log('2')); // micro
// Вывод: 1 → 2 → 3`,
    },
    {
      id: 'jsel-f2',
      question: 'Чем микрозадача отличается от макрозадачи? Назови примеры.',
      answer:
        'Микрозадачи выполняются сразу после текущей операции, до следующей макрозадачи. Event Loop полностью очищает очередь микрозадач перед тем, как взять следующую макрозадачу.',
      keyPoints: [
        'Микрозадачи: Promise.then/catch/finally, queueMicrotask, MutationObserver',
        'Макрозадачи: setTimeout, setInterval, setImmediate, события ввода, I/O',
        'Новые микрозадачи, добавленные во время обработки — тоже выполняются сразу',
        'Бесконечная очередь микрозадач заблокирует макрозадачи',
      ],
    },
    {
      id: 'jsel-f3',
      question: 'Что делает await под капотом? Как он связан с Promise?',
      answer:
        'await — синтаксический сахар над .then(). Он приостанавливает выполнение async-функции и добавляет продолжение (код после await) в очередь микрозадач как только промис резолвится.',
      keyPoints: [
        'async функция возвращает Promise',
        'await expr эквивалентен expr.then(continuation)',
        'Код после await — микрозадача, не синхронный код',
        'Каждый await = минимум одна микрозадача в очереди',
      ],
      code: `async function foo() {
  console.log('A');
  await Promise.resolve();
  console.log('B'); // микрозадача
}
console.log('C');
foo();
console.log('D');
// C → A → D → B`,
    },
    {
      id: 'jsel-f4',
      question: 'Почему setTimeout(fn, 0) не значит «немедленно»?',
      answer:
        'setTimeout регистрирует макрозадачу. Даже с задержкой 0 она выполнится только после: 1) текущего синхронного кода, 2) всех микрозадач. Плюс браузер накладывает минимум ~4ms для вложенных таймеров.',
      keyPoints: [
        'setTimeout всегда после микрозадач (Promise.then)',
        'Минимальная задержка в браузере: ~4ms (вложенные), ~1ms в Node.js',
        'Используется для «отложить до следующего тика», но Promise.resolve() быстрее',
        'Для «после рендера» — requestAnimationFrame, не setTimeout',
      ],
    },
    {
      id: 'jsel-f5',
      question: 'Что такое debounce и throttle? В чём разница?',
      answer:
        'Оба ограничивают частоту вызова функции. Debounce откладывает вызов до паузы в событиях. Throttle гарантирует вызов не чаще N раз в период времени.',
      keyPoints: [
        'Debounce: ждёт окончания «шторма» событий. Пример: поиск при вводе',
        'Throttle: вызывает равномерно. Пример: обработка скролла',
        'Оба реализуются через замыкание + setTimeout/clearTimeout',
        'Debounce: clearTimeout при каждом вызове, запуск в конце паузы',
      ],
      code: `function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}`,
    },
    {
      id: 'jsel-f6',
      question: 'Как не заблокировать Event Loop при тяжёлых вычислениях?',
      answer:
        'Синхронный CPU-код блокирует стек целиком — UI замерзает, запросы не обрабатываются. Решения: разбить работу на чанки через setTimeout/setImmediate, или вынести в Web Worker / Worker Thread.',
      keyPoints: [
        'Чанкование: обрабатываем N элементов, возвращаем управление через setImmediate',
        'Web Workers (браузер): отдельный поток без доступа к DOM',
        'Worker Threads (Node.js): отдельный поток для CPU-intensive задач',
        'requestIdleCallback (браузер): выполнять в «пустое» время между кадрами',
      ],
    },
  ],
};
