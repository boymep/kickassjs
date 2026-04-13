import type { TopicTheory } from '../../types/topic';

export const jsAsyncTheory: TopicTheory = {
  topicId: 'js-async',
  sections: [
    {
      title: 'Promise — основы',
      blocks: [
        {
          type: 'text',
          content:
            'Promise — объект, представляющий результат асинхронной операции. Может находиться в трёх состояниях: **pending** (ожидание), **fulfilled** (выполнен), **rejected** (отклонён). Переход из pending — необратим.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const promise = new Promise((resolve, reject) => {
  // Выполняется синхронно!
  setTimeout(() => {
    const success = Math.random() > 0.5;
    if (success) resolve('data');
    else reject(new Error('failed'));
  }, 1000);
});

// Обработка результата:
promise
  .then((data) => console.log('OK:', data))
  .catch((err) => console.log('Err:', err.message))
  .finally(() => console.log('Готово'));`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Цепочки промисов (chaining)
fetch('/api/user')
  .then((res) => res.json())        // возвращает новый Promise
  .then((user) => user.id)          // трансформация
  .then((id) => fetch(\`/api/posts/\${id}\`))
  .then((res) => res.json())
  .catch((err) => {
    // Ловит ошибки из ЛЮБОГО предыдущего звена
    console.error(err);
  });`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Если `.then()` возвращает промис — следующий `.then()` ждёт его резолва. Если возвращает значение — следующий `.then()` получает его немедленно (wrapped in fulfilled Promise).',
        },
      ],
    },
    {
      title: 'async/await',
      blocks: [
        {
          type: 'text',
          content:
            '`async/await` — синтаксический сахар над промисами, делающий асинхронный код похожим на синхронный. `async` функция всегда возвращает Promise. `await` приостанавливает выполнение до резолва промиса.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Промисная версия:
function loadUserData(id) {
  return fetch(\`/api/user/\${id}\`)
    .then(res => res.json())
    .then(user => fetch(\`/api/posts/\${user.authorId}\`))
    .then(res => res.json());
}

// async/await версия (то же самое):
async function loadUserData(id) {
  const userRes = await fetch(\`/api/user/\${id}\`);
  const user = await userRes.json();
  const postsRes = await fetch(\`/api/posts/\${user.authorId}\`);
  return postsRes.json();
}`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Обработка ошибок:
async function safe() {
  try {
    const data = await riskyOperation();
    return data;
  } catch (err) {
    console.error('Ошибка:', err);
    return null; // fallback
  }
}

// Параллельное выполнение:
async function parallel() {
  // ❌ Последовательно — медленно:
  const a = await fetch('/a');
  const b = await fetch('/b');

  // ✅ Параллельно — быстро:
  const [resA, resB] = await Promise.all([
    fetch('/a'),
    fetch('/b'),
  ]);
}`,
        },
      ],
    },
    {
      title: 'Методы Promise — all, race, allSettled, any',
      blocks: [
        {
          type: 'code',
          language: 'javascript',
          content: `const p1 = Promise.resolve(1);
const p2 = new Promise(r => setTimeout(() => r(2), 100));
const p3 = Promise.reject(new Error('oops'));

// Promise.all — ждёт все, при первом reject — reject
await Promise.all([p1, p2]);         // [1, 2] через ~100ms
await Promise.all([p1, p3]);         // reject 'oops'

// Promise.race — первый завершившийся (resolve или reject)
await Promise.race([p1, p2]);        // 1 (p1 быстрее)

// Promise.allSettled — ждёт все, никогда не reject
await Promise.allSettled([p1, p3]);
// [{ status: 'fulfilled', value: 1 }, { status: 'rejected', reason: Error }]

// Promise.any — первый УСПЕШНЫЙ (resolve)
await Promise.any([p3, p2]);         // 2 (p3 reject — игнорируем)
await Promise.any([p3, p3]);         // AggregateError — все упали`,
        },
        {
          type: 'list',
          content:
            '**Promise.all** — нужны все результаты, при одной ошибке — отмена.\n**Promise.race** — нужен первый ответ (timeout-pattern).\n**Promise.allSettled** — нужны все результаты, ошибки не должны прерывать (batch-операции).\n**Promise.any** — нужен первый успех (резервные серверы).',
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Для реализации timeout-паттерна: `Promise.race([actualRequest, delay(5000).then(() => { throw new Error("timeout") })])`.',
        },
      ],
    },
    {
      title: 'Продвинутые паттерны',
      blocks: [
        {
          type: 'heading',
          content: 'Ограниченный параллелизм',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Запускать не более N промисов одновременно
async function limitConcurrency(fns, limit) {
  const results = [];
  const executing = new Set();

  for (const fn of fns) {
    const p = fn().then((result) => {
      executing.delete(p);
      return result;
    });
    executing.add(p);
    results.push(p);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}`,
        },
        {
          type: 'heading',
          content: 'promisify — конвертация callback в Promise',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Node.js callback-стиль: fn(args, (err, result) => {})
function promisify(fn) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  };
}

// Использование:
import fs from 'fs';
const readFile = promisify(fs.readFile);
const content = await readFile('file.txt', 'utf8');
// Вместо: fs.readFile('file.txt', (err, data) => {...})`,
        },
      ],
    },
    {
      title: 'Тонкости и хитрые кейсы',
      blocks: [
        {
          type: 'heading',
          content: 'Promise.allSettled vs Promise.all — в чём разница?',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const p1 = Promise.resolve(1);
const p2 = Promise.reject(new Error('fail'));
const p3 = Promise.resolve(3);

// Promise.all — падает при первом rejection
Promise.all([p1, p2, p3])
  .catch(err => console.log(err.message)); // 'fail' — p1, p3 игнорируются!

// Promise.allSettled — ждёт все, не падает
Promise.allSettled([p1, p2, p3])
  .then(results => {
    results.forEach(r => {
      if (r.status === 'fulfilled') console.log('ok:', r.value);
      else console.log('err:', r.reason.message);
    });
  });
// ok: 1
// err: fail
// ok: 3

// Promise.any — первый успешный (ES2021)
Promise.any([p2, p1, p3])
  .then(first => console.log(first)); // 1 — первый успешный`,
        },
        {
          type: 'heading',
          content: 'Ловушка: async функция в forEach',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// ❌ forEach не awaits Promise — все выполняются параллельно!
const items = [1, 2, 3];
items.forEach(async (item) => {
  await delay(100);
  console.log(item); // порядок непредсказуем
});
console.log('done'); // выводится СРАЗУ, не дождавшись forEach

// ✅ Для последовательного выполнения — for...of:
for (const item of items) {
  await delay(100);
  console.log(item); // 1, 2, 3 в порядке
}

// ✅ Для параллельного с await всех — Promise.all:
await Promise.all(items.map(async (item) => {
  await delay(100);
  console.log(item); // все параллельно
}));
console.log('done'); // после всех`,
        },
        {
          type: 'heading',
          content: 'try/catch не ловит ошибки в синхронном коде внутри Promise',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// ❌ Ошибка в setTimeout — НЕ поймается catch
async function broken() {
  try {
    setTimeout(() => {
      throw new Error('async error'); // необработанная ошибка!
    }, 0);
  } catch (e) {
    console.log('caught?', e); // НИКОГДА не выполнится
  }
}

// ✅ Правильно: обернуть в промис
async function fixed() {
  await new Promise((_, reject) => {
    setTimeout(() => reject(new Error('error')), 0);
  });
}

// ✅ Или: обработать внутри callback
setTimeout(() => {
  try { riskyOperation(); }
  catch (e) { handleError(e); }
}, 0);`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Золотое правило: `try/catch` с `await` работает корректно только если сам `await` находится внутри блока `try`. Ошибки в колбэках, не обёрнутых в промис, `try/catch` не поймает.',
        },
      ],
    },
  ],
};
