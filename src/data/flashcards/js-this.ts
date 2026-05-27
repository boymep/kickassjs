import type { TopicFlashcards } from '../../types/flashcard';

export const jsThisFlashcards: TopicFlashcards = {
  topicId: 'js-this',
  cards: [
    {
      id: 'jsth-f1',
      question: 'Каковы 4 правила определения this? Каков их приоритет?',
      answer:
        'this определяется не тем, где функция написана, а тем, как она вызвана. 4 правила по убыванию приоритета: new > explicit (call/apply/bind) > implicit (obj.method()) > default (глобальный или undefined в strict).',
      keyPoints: [
        'new: создаётся новый объект, this = он',
        'Explicit: call/apply/bind — явно задаём this',
        'Implicit: obj.method() — this = obj',
        'Default: просто fn() — this = global или undefined (strict mode)',
      ],
      code: `function f() { console.log(this); }

f();          // default: window / undefined
obj.f();      // implicit: obj
f.call(ctx);  // explicit: ctx
new f();      // new: новый объект`,
    },
    {
      id: 'jsth-f2',
      question: 'Почему this теряется при деструктуризации или передаче как callback?',
      answer:
        'При деструктуризации или передаче метода как значения теряется связь с объектом. Функция вызывается без контекста (default binding). Это как записать метод в переменную и вызвать напрямую.',
      keyPoints: [
        'const { method } = obj — это просто ссылка на функцию без obj',
        'setTimeout(obj.method, 0) — передаём ссылку, не вызов',
        'Решения: bind, стрелочная функция-обёртка, class fields',
      ],
      code: `const obj = {
  name: 'Alice',
  greet() { return this.name; }
};

obj.greet();              // 'Alice' ✅
const fn = obj.greet;
fn();                     // undefined ❌
const { greet } = obj;
greet();                  // undefined ❌
fn.bind(obj)();           // 'Alice' ✅`,
    },
    {
      id: 'jsth-f3',
      question: 'Как стрелочные функции обрабатывают this? Когда их использовать, а когда нет?',
      answer:
        'Стрелочные функции не имеют своего this — они наследуют его лексически из окружающего scope. Это делает их идеальными как callback-и внутри методов, но неподходящими в роли самих методов объекта.',
      keyPoints: [
        'Нет своего this, arguments, super, new.target',
        'Нельзя использовать как конструктор (new)',
        'Идеальны внутри методов: setTimeout(() => this.x, 0)',
        'Не использовать как метод объекта или на прототипе',
      ],
      code: `class Timer {
  start() {
    // ✅ this из start() сохраняется в стрелочной функции
    setInterval(() => this.tick(), 1000);
  }
}

const obj = {
  // ❌ this здесь — глобальный, не obj
  broken: () => console.log(this),
  // ✅
  correct() { console.log(this); }
};`,
    },
    {
      id: 'jsth-f4',
      question: 'Что делает new под капотом? Напишите собственную реализацию.',
      answer:
        'new: 1) создаёт пустой объект, 2) устанавливает его [[Prototype]] = Constructor.prototype, 3) вызывает конструктор с this = новый объект, 4) возвращает объект (или значение конструктора, если оно объект).',
      keyPoints: [
        'Прототип устанавливается через Object.create(Constructor.prototype)',
        'Если конструктор явно возвращает объект — new вернёт его, а не созданный',
        'instanceof проверяет Constructor.prototype в цепочке прототипов',
      ],
      code: `function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype);
  const result = Constructor.apply(obj, args);
  return result instanceof Object ? result : obj;
}`,
    },
    {
      id: 'jsth-f5',
      question: 'Что такое class fields (стрелочные методы) и какую проблему они решают?',
      answer:
        'Class fields позволяют определить метод как стрелочную функцию прямо в теле класса. Каждый экземпляр получает свою копию функции с зафиксированным this — без bind в конструкторе.',
      keyPoints: [
        'handleClick = () => {} — определяется как own property экземпляра, не на прототипе',
        'Больший расход памяти: своя копия у каждого экземпляра',
        'Нельзя переопределить в подклассе через super',
        'Популярный паттерн в React для обработчиков событий',
      ],
      code: `class Button {
  label = 'OK'; // class field

  // Стрелочный метод — this всегда привязан
  handleClick = () => {
    console.log(this.label); // всегда работает
  };
}

const btn = new Button();
const { handleClick } = btn;
handleClick(); // 'OK' ✅ — this не потерян`,
    },
    {
      id: 'jsth-f6',
      question: 'В чём разница между call, apply и bind?',
      answer:
        'Все три явно задают this. call и apply вызывают функцию немедленно. bind возвращает новую функцию с зафиксированным this (и опционально первыми аргументами).',
      keyPoints: [
        'call(ctx, arg1, arg2) — аргументы перечислением',
        'apply(ctx, [arg1, arg2]) — аргументы массивом',
        'bind(ctx, arg1) — создаёт новую функцию, не вызывает',
        'Повторный bind не перебивает первый — this зафиксирован жёстко',
      ],
      code: `function greet(greeting, punct) {
  return \`\${greeting}, \${this.name}\${punct}\`;
}
const user = { name: 'Alice' };

greet.call(user, 'Hi', '!');       // 'Hi, Alice!'
greet.apply(user, ['Hello', '.']); // 'Hello, Alice.'
const hi = greet.bind(user, 'Hey');
hi('?');                           // 'Hey, Alice?'`,
    },
  ],
};
