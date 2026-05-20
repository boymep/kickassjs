import type { TopicFlashcards } from '../../types/flashcard';

export const jsPrototypesFlashcards: TopicFlashcards = {
  topicId: 'js-prototypes',
  cards: [
    {
      id: 'jspr-f1',
      question: 'Как работает прототипная цепочка? Как JS ищет свойство на объекте?',
      answer:
        'При обращении к свойству JS сначала ищет его на самом объекте (own property). Если не найдено — поднимается по [[Prototype]] к прототипу, затем к прототипу прототипа, вплоть до Object.prototype, затем null. Возвращает undefined если не нашёл.',
      keyPoints: [
        'Каждый объект имеет [[Prototype]] — ссылку на родительский объект',
        'Object.getPrototypeOf(obj) — стандартный способ получить прототип',
        '__proto__ — устаревшее, избегать в production',
        'null — конец цепочки, Object.getPrototypeOf(Object.prototype) === null',
      ],
      code: `const arr = [1, 2, 3];
// arr → Array.prototype → Object.prototype → null

arr.push(4);           // Array.prototype.push
arr.hasOwnProperty(0); // Object.prototype.hasOwnProperty
arr.nonExistent;       // undefined`,
    },
    {
      id: 'jspr-f2',
      question: 'Чем class в JS отличается от функции-конструктора? Это настоящие классы?',
      answer:
        'class — синтаксический сахар над прототипным наследованием. Под капотом та же функция-конструктор и prototype. Но class добавляет: обязательный new, нет hoisting, strict mode, super.',
      keyPoints: [
        'typeof Animal === "function" — class это функция',
        'Методы класса попадают на .prototype, не на экземпляры',
        'class нельзя вызвать без new — TypeError',
        'class не всплывает в отличие от function declaration',
      ],
      code: `class Animal { speak() {} }
typeof Animal; // 'function'
Animal.prototype.speak; // функция ✓

// Идентично:
function Animal() {}
Animal.prototype.speak = function() {};`,
    },
    {
      id: 'jspr-f3',
      question: 'Как работает instanceof под капотом?',
      answer:
        'instanceof проверяет, присутствует ли Constructor.prototype в цепочке [[Prototype]] объекта. Не проверяет сам конструктор — только прототип.',
      keyPoints: [
        'Можно обмануть: Object.setPrototypeOf(obj, Constructor.prototype)',
        'Не работает между iframe/realm — разные Object.prototype',
        'Symbol.hasInstance позволяет переопределить поведение',
        'Object.getPrototypeOf в цикле — ручная реализация',
      ],
      code: `function myInstanceof(obj, Ctor) {
  let proto = Object.getPrototypeOf(obj);
  while (proto !== null) {
    if (proto === Ctor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

myInstanceof([], Array);  // true
myInstanceof([], Object); // true`,
    },
    {
      id: 'jspr-f4',
      question: 'Что такое static методы и свойства? Чем они отличаются от методов прототипа?',
      answer:
        'static определяет свойства/методы самого класса (функции-конструктора), а не его прототипа. Экземпляры их не наследуют — только сам класс.',
      keyPoints: [
        'static живёт на объекте-конструкторе, не на prototype',
        'Экземпляры не видят static: instance.staticMethod === undefined',
        'Полезны для: фабричных методов, утилит, кеша',
        'static наследуется в подклассах',
      ],
      code: `class MathUtil {
  static PI = 3.14159;
  static square(n) { return n * n; }
  describe() { return 'instance method'; }
}

MathUtil.PI;          // 3.14159
MathUtil.square(4);   // 16
new MathUtil().PI;    // undefined ❌`,
    },
    {
      id: 'jspr-f5',
      question: 'Что такое приватные #fields? Чем они отличаются от соглашения _underscore?',
      answer:
        'Приватные поля с # — синтаксически защищены движком. Обращение снаружи класса — SyntaxError. _underscore — только соглашение, никакой защиты нет.',
      keyPoints: [
        '#field недоступен через obj.#field снаружи — SyntaxError, не undefined',
        'Работают корректно с instanceof и наследованием',
        'WeakMap — старая альтернатива до появления #fields',
        'Доступны в Node.js 12+, Chrome 74+',
      ],
      code: `class BankAccount {
  #balance = 0;
  deposit(n) { this.#balance += n; }
  get balance() { return this.#balance; }
}

const acc = new BankAccount();
acc.deposit(100);
acc.balance;   // 100 ✅
acc.#balance;  // SyntaxError ❌`,
    },
    {
      id: 'jspr-f6',
      question: 'Что такое hasOwnProperty и чем отличается от оператора in?',
      answer:
        'hasOwnProperty возвращает true только для собственных свойств объекта, не проверяя цепочку прототипов. Оператор in проверяет всю цепочку.',
      keyPoints: [
        'for...in перебирает все enumerable свойства, включая прототипные',
        'Object.hasOwn(obj, key) — современная альтернатива hasOwnProperty',
        'Object.keys() возвращает только own enumerable свойства',
        'Важно при итерации по объектам с прототипами',
      ],
      code: `const obj = Object.create({ inherited: 1 });
obj.own = 2;

'own' in obj;                  // true
'inherited' in obj;            // true
obj.hasOwnProperty('own');     // true
obj.hasOwnProperty('inherited'); // false
Object.hasOwn(obj, 'own');     // true (современный)`,
    },
  ],
};
