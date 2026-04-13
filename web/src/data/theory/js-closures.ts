import type { TopicTheory } from '../../types/topic';

export const jsClosuresTheory: TopicTheory = {
  topicId: 'js-closures',
  sections: [
    {
      title: 'Лексическая область видимости',
      blocks: [
        {
          type: 'text',
          content:
            'В JavaScript область видимости переменных определяется в момент написания кода, а не в момент его выполнения — это называется **лексической областью видимости** (lexical scope). Функция "запоминает" окружение, в котором она была создана.',
        },
        {
          type: 'text',
          content:
            'Цепочка областей видимости (scope chain): когда движок JS ищет переменную, он сначала проверяет локальную область, затем внешнюю, затем внешнюю внешней — вплоть до глобальной.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const x = 'global';

function outer() {
  const x = 'outer';

  function inner() {
    const x = 'inner';
    console.log(x); // 'inner' — локальная переменная
  }

  function middle() {
    console.log(x); // 'outer' — берёт из внешней области
  }

  inner();  // 'inner'
  middle(); // 'outer'
}

outer();
console.log(x); // 'global'`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Области видимости в JS: **global** → **module** → **function** → **block** (let/const). Переменные `var` игнорируют блочную область видимости — они «всплывают» до ближайшей функции.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// var — функциональная область видимости
function example() {
  if (true) {
    var x = 1;  // видна во всей функции
    let y = 2;  // видна только в блоке
  }
  console.log(x); // 1 ✓
  console.log(y); // ReferenceError ✗
}`,
        },
      ],
    },
    {
      title: 'Что такое замыкание',
      blocks: [
        {
          type: 'text',
          content:
            '**Замыкание** — это функция, которая сохраняет ссылку на переменные из своей внешней области видимости даже после того, как внешняя функция завершила выполнение. Переменные не уничтожаются, пока на них есть ссылка из замыкания.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function makeCounter() {
  let count = 0; // эта переменная "закрыта" в замыкании

  return {
    increment() { count++; },
    decrement() { count--; },
    getCount()  { return count; },
  };
}

const counter = makeCounter();
counter.increment();
counter.increment();
counter.increment();
counter.decrement();
console.log(counter.getCount()); // 2

// count недоступен снаружи — это приватное состояние
console.log(counter.count); // undefined`,
        },
        {
          type: 'visualization',
          content: '', vizId: 'closure-scope',
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Замыкания — это не копия значений, а **живые ссылки** на переменные. Если переменная изменится, замыкание увидит новое значение.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function makeAdder(x) {
  return function(y) {
    return x + y; // x "заперт" из внешней области
  };
}

const add5 = makeAdder(5);
const add10 = makeAdder(10);

console.log(add5(3));  // 8
console.log(add10(3)); // 13
console.log(add5(10)); // 15`,
        },
      ],
    },
    {
      title: 'Практические паттерны замыканий',
      blocks: [
        {
          type: 'heading',
          content: 'Мемоизация',
        },
        {
          type: 'text',
          content:
            'Мемоизация — кеширование результата функции по аргументам. Замыкание хранит кеш между вызовами:',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function memoize(fn) {
  const cache = new Map(); // кеш живёт в замыкании

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const slowSquare = (n) => {
  // имитируем долгое вычисление
  return n * n;
};

const fastSquare = memoize(slowSquare);
fastSquare(4); // вычисляет → 16
fastSquare(4); // из кеша → 16 (fn не вызывается)`,
        },
        {
          type: 'heading',
          content: 'Функция once',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function once(fn) {
  let called = false;
  let result;

  return function(...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result; // повторные вызовы вернут первый результат
  };
}

const init = once(() => {
  console.log('Инициализация!');
  return 42;
});

init(); // 'Инициализация!' → 42
init(); // (ничего не выводит) → 42`,
        },
        {
          type: 'heading',
          content: 'IIFE — немедленно вызываемая функция',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Изолировать область видимости (актуально до ES-модулей)
const counter = (function() {
  let count = 0;
  return {
    inc: () => ++count,
    get: () => count,
  };
})();

counter.inc();
counter.inc();
console.log(counter.get()); // 2`,
        },
      ],
    },
    {
      title: 'Типичные ловушки',
      blocks: [
        {
          type: 'heading',
          content: 'Классика: var в цикле + setTimeout',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Проблема: все callback'и видят одно и то же i = 3
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// Выводит: 3  3  3

// Решение 1: let создаёт новую переменную на каждую итерацию
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// Выводит: 0  1  2

// Решение 2: IIFE создаёт отдельную область видимости
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 0);
  })(i);
}
// Выводит: 0  1  2`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'С `var` все функции в цикле разделяют **одну** переменную `i`. К моменту выполнения setTimeout цикл уже завершился и `i === 3`. С `let` каждая итерация получает **свою копию** `i`.',
        },
        {
          type: 'heading',
          content: 'Замыкание на мутируемую переменную',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function createMultipliers() {
  const multipliers = [];
  for (var i = 1; i <= 3; i++) {
    multipliers.push(function(x) { return x * i; });
  }
  return multipliers;
}

const mults = createMultipliers();
console.log(mults[0](10)); // 40 (не 10!) — i уже равно 4
console.log(mults[1](10)); // 40
console.log(mults[2](10)); // 40

// Исправленная версия с let:
function createMultipliersFix() {
  const multipliers = [];
  for (let i = 1; i <= 3; i++) {
    multipliers.push((x) => x * i);
  }
  return multipliers;
}
const fixed = createMultipliersFix();
console.log(fixed[0](10)); // 10
console.log(fixed[1](10)); // 20
console.log(fixed[2](10)); // 30`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'На собеседовании часто спрашивают: "что выведет этот код с var в цикле?". Ключ к ответу — замыкание хранит **ссылку**, а не значение. Переменная `i` одна для всего цикла.',
        },
        {
          type: 'heading',
          content: 'Утечка памяти через замыкания',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Замыкание держит весь scope — включая то, что вам не нужно
function attachHandler(element) {
  const bigData = new Array(100000).fill('data'); // 🔴 утечка!

  element.addEventListener('click', function() {
    console.log('clicked'); // bigData не используется,
    // но замыкание держит весь scope → bigData не удаляется GC
  });
}

// Исправление: явно освобождаем данные или выносим handler наружу
function attachHandlerFixed(element) {
  const bigData = new Array(100000).fill('data');
  const processed = transform(bigData); // только результат

  element.addEventListener('click', function() {
    console.log(processed); // только processed — bigData уже не нужен
  });
}`,
        },
        {
          type: 'heading',
          content: 'Тонкость: let в блоке создаёт отдельную переменную',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// let в for создаёт НОВУЮ переменную для каждой итерации
// Как будто под капотом делается так:
{
  let i_0 = 0; setTimeout(() => console.log(i_0), 0); // 0
}
{
  let i_1 = 1; setTimeout(() => console.log(i_1), 0); // 1
}
{
  let i_2 = 2; setTimeout(() => console.log(i_2), 0); // 2
}

// Это специфика спецификации ES6 — let в for-init
// создаёт отдельную binding на каждую итерацию`,
        },
      ],
    },
  ],
};
