import type { TopicQuiz } from '../../types/quiz';

export const jsAsyncQuiz: TopicQuiz = {
  topicId: 'js-async',
  questions: [
    {
      type: 'output',
      id: 'jsa-q1',
      description: 'Promise chaining. Что выведет код?',
      code: `Promise.resolve(1)
  .then((x) => x + 1)
  .then((x) => x * 2)
  .then((x) => console.log(x));`,
      options: ['4', '2', '3', '6'],
      correctIndex: 0,
      explanation: 'Цепочка: resolve(1) → then(x+1)=2 → then(x*2)=4 → console.log(4). Каждый .then возвращает значение, которое оборачивается в fulfilled Promise для следующего звена.',
    },
    {
      type: 'output',
      id: 'jsa-q2',
      description: 'Promise.all с rejection. Что выведет код?',
      code: `Promise.all([
  Promise.resolve(1),
  Promise.reject(new Error('oops')),
  Promise.resolve(3),
])
.then(console.log)
.catch((e) => console.log('Error:', e.message));`,
      options: ['Error: oops', '[1, undefined, 3]', '[1, Error, 3]', '[1, 2, 3]'],
      correctIndex: 0,
      explanation: 'Promise.all реджектится немедленно при первом rejection. Третий промис (resolve(3)) тоже будет выполнен, но результат уже не важен — Promise.all уже rejected. Вывод: "Error: oops".',
    },
    {
      type: 'output',
      id: 'jsa-q3',
      description: 'Что вернёт async функция?',
      code: `async function getValue() {
  return 42;
}

const result = getValue();
console.log(typeof result);
console.log(result instanceof Promise);`,
      options: ['"object" и true', '"number" и false', '"function" и false', '"undefined" и true'],
      correctIndex: 0,
      explanation: 'async функция **всегда возвращает Promise**, даже если возвращает примитивное значение. `getValue()` возвращает `Promise<42>`. `typeof Promise` = "object", `result instanceof Promise` = true.',
    },
    {
      type: 'fill-blank',
      id: 'jsa-q4',
      description: 'Заполните пропуск для реализации fetchWithTimeout.',
      codeWithBlanks: `function fetchWithTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), ms)
  );
  return Promise.___BLANK___([promise, timeout]);
}`,
      options: ['race', 'all', 'any', 'allSettled'],
      correctIndex: 0,
      explanation: 'Promise.race возвращает первый завершившийся промис. Соревнование между оригинальным промисом и таймером: если оригинал завершится быстрее — его результат, если таймер сработает первым — reject с Error("Timeout").',
    },
    {
      type: 'output',
      id: 'jsa-q5',
      description: 'finally не меняет результат. Что выведет код?',
      code: `Promise.resolve(42)
  .then((v) => {
    console.log('then:', v);
    return v * 2;
  })
  .finally(() => {
    console.log('finally');
    return 0; // попытка изменить результат
  })
  .then((v) => console.log('after finally:', v));`,
      options: ['then: 42, finally, after finally: 84', 'then: 42, finally, after finally: 0', 'finally, then: 42, after finally: 84', 'Ошибка'],
      correctIndex: 0,
      explanation: 'finally не меняет значение промиса — оно "проходит насквозь". Возвращаемое значение из finally игнорируется (если только это не rejected Promise). Порядок: then(42) → finally (выводит "finally", возвращает 0, но это игнорируется) → then(84).',
    },
    {
      type: 'tracing',
      id: 'jsa-q6',
      description: 'Проследите порядок выполнения async операций.',
      code: `async function fetchUser() {
  console.log('fetching');
  await null; // имитация async
  console.log('got user');
  return { id: 1 };
}

async function main() {
  console.log('start');
  const user = await fetchUser();
  console.log('user id:', user.id);
  console.log('end');
}

main();
console.log('after main');`,
      steps: [
        { label: 'main() вызвана', variables: { output: '"start"', callStack: 'main → fetchUser' } },
        { label: 'fetchUser: "fetching"', variables: { output: '"start", "fetching"' } },
        { label: 'await null → пауза fetchUser', variables: { output: '..."fetching"', microqueue: '["got user"]' } },
        { label: 'await fetchUser() → пауза main', variables: { output: '...', global: 'продолжается' } },
        { label: '"after main" — sync', variables: { output: '..."after main"' } },
        { label: 'микрозадача: "got user"', variables: { output: '..."got user"' } },
        { label: 'main продолжается: "user id: 1", "end"', variables: { output: '..."user id: 1", "end"' } },
      ],
      question: 'Каков порядок вывода?',
      options: [
        'start, fetching, after main, got user, user id: 1, end',
        'start, fetching, got user, user id: 1, end, after main',
        'start, after main, fetching, got user, user id: 1, end',
        'fetching, start, after main, got user, end, user id: 1',
      ],
      correctIndex: 0,
      explanation: '"start" → fetchUser вызвана → "fetching" → await null приостанавливает fetchUser → await fetchUser() приостанавливает main → "after main" (sync) → микрозадача: "got user" → main возобновляется → "user id: 1" → "end".',
    },
    {
      type: 'output',
      id: 'jsa-q7',
      description: 'Promise.allSettled. Что вернёт вызов?',
      code: `const results = await Promise.allSettled([
  Promise.resolve(1),
  Promise.reject(new Error('oops')),
  Promise.resolve(3),
]);

console.log(results.length);
console.log(results[1].status);
console.log(results[1].reason.message);`,
      options: ['3, "rejected", "oops"', '2, "rejected", "oops"', '3, "fulfilled", undefined', 'Error'],
      correctIndex: 0,
      explanation: 'Promise.allSettled всегда возвращает массив результатов для ВСЕХ промисов (никогда не reject). Для fulfilled: `{status: "fulfilled", value}`. Для rejected: `{status: "rejected", reason}`. Длина = 3, results[1].status = "rejected", results[1].reason = Error("oops").',
    },
    {
      type: 'output',
      id: 'jsa-q8',
      description: 'Ошибка в промисе. Что выведет код?',
      code: `async function fail() {
  throw new Error('boom');
}

fail()
  .then(() => console.log('success'))
  .catch((e) => console.log('caught:', e.message));`,
      options: ['caught: boom', 'success', 'Uncaught Error: boom', 'undefined'],
      correctIndex: 0,
      explanation: 'throw в async функции → Promise rejected с этой ошибкой. .catch перехватывает её. Вывод: "caught: boom". Если бы .catch не было — UnhandledPromiseRejection.',
    },
    {
      type: 'fill-blank',
      id: 'jsa-q9',
      description: 'Заполните пропуск: нужно дождаться ВСЕХ промисов, но не падать при одном rejection.',
      codeWithBlanks: `async function loadAll(urls) {
  const results = await Promise.___BLANK___(
    urls.map((url) => fetch(url)),
  );
  // results[i].status === 'fulfilled' | 'rejected'
  return results.filter((r) => r.status === 'fulfilled').map((r) => r.value);
}`,
      options: ['allSettled', 'all', 'any', 'race'],
      correctIndex: 0,
      explanation: '`Promise.allSettled` ждёт все промисы и **никогда не реджектится** — каждый результат имеет `{status, value|reason}`. `Promise.all` упадёт при первом rejection. `any` резолвится при первом успехе. `race` — первый завершившийся (успех или ошибка).',
    },
    {
      type: 'output',
      id: 'jsa-q10',
      description: 'Цепочка промисов и ошибки. Что выведет код?',
      code: `Promise.resolve()
  .then(() => { throw new Error('1'); })
  .then(() => console.log('2'))
  .catch((e) => { console.log('caught:', e.message); return 3; })
  .then((v) => console.log('after catch:', v));`,
      options: ['caught: 1, after catch: 3', 'caught: 1', '2, caught: 1', 'Error: 1'],
      correctIndex: 0,
      explanation: 'throw в .then() переводит промис в rejected. .then("2") пропускается. .catch перехватывает ошибку, выводит "caught: 1" и возвращает 3. После .catch цепочка продолжается в fulfilled state со значением 3. .then выводит "after catch: 3".',
    },
    {
      type: 'output',
      id: 'jsa-q11',
      description: 'Promise.any. Что выведет код?',
      code: `const result = await Promise.any([
  Promise.reject(new Error('1')),
  Promise.reject(new Error('2')),
  Promise.resolve('success'),
]);
console.log(result);`,
      options: ['"success"', 'AggregateError', '"1"', 'undefined'],
      correctIndex: 0,
      explanation: 'Promise.any возвращает первый УСПЕШНЫЙ (fulfilled) промис, игнорируя rejection. Первые два rejected — пропускаются. Третий resolve("success") → результат "success". Если бы все были rejected — AggregateError.',
    },
    {
      type: 'output',
      id: 'jsa-q12',
      description: 'async/await и try/catch. Что выведет код?',
      code: `async function main() {
  console.log('A');
  try {
    await Promise.reject('err');
  } catch (e) {
    console.log('B:', e);
  }
  console.log('C');
}

main();
console.log('D');`,
      options: ['A, D, B: err, C', 'A, B: err, C, D', 'A, B: err, D, C', 'D, A, B: err, C'],
      correctIndex: 0,
      explanation: '"A" — sync (внутри main до await). `await Promise.reject(...)` приостанавливает main. "D" — sync (после вызова main). Затем микрозадача: rejected промис попадает в catch → "B: err". После catch main продолжается → "C". Итог: A → D → B: err → C.',
    },
  ],
};
