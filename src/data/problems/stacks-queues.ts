import type { Problem } from '../../types/problem';

export const stacksQueuesProblems: Problem[] = [
  {
    id: 'sq-p1',
    topicId: 'stacks-queues',
    title: 'Валидные скобки',
    difficulty: 'easy',
    isContextual: false,
    description: `Дана строка \`s\`, содержащая только символы \`(\`, \`)\`, \`{\`, \`}\`, \`[\` и \`]\`. Определите, является ли строка **валидной**.

Строка валидна, если:

- Каждая открывающая скобка имеет соответствующую закрывающую того же типа.
- Скобки закрываются в правильном порядке.
- Каждой закрывающей скобке соответствует открывающая того же типа.

Пустая строка считается валидной.

**Примеры:**
\`\`\`
isValid("()")        // → true
isValid("()[]{}")    // → true
isValid("(]")        // → false
isValid("([)]")      // → false
\`\`\``,
    functionName: 'isValid',
    starterCode: `function isValid(s) {
  // Ваш код здесь
}`,
    testCases: [
      {
        id: 'sq-p1-t1',
        inputDisplay: 'isValid("()")',
        inputArgs: ['()'],
        expected: true,
      },
      {
        id: 'sq-p1-t2',
        inputDisplay: 'isValid("()[]{}")',
        inputArgs: ['()[]{}'],
        expected: true,
      },
      {
        id: 'sq-p1-t3',
        inputDisplay: 'isValid("(]")',
        inputArgs: ['(]'],
        expected: false,
      },
      {
        id: 'sq-p1-t4',
        inputDisplay: 'isValid("([)]")',
        inputArgs: ['([)]'],
        expected: false,
      },
      {
        id: 'sq-p1-t5',
        inputDisplay: 'isValid("{[]}")',
        inputArgs: ['{[]}'],
        expected: true,
      },
      {
        id: 'sq-p1-t6',
        inputDisplay: 'isValid("")',
        inputArgs: [''],
        expected: true,
      },
    ],
    hints: [
      'Правило «последняя открытая должна закрыться первой» — это в точности LIFO. На каждую открывающую запоминайте, какую закрывающую ждёте; на каждую закрывающую — сверяйте с самым свежим ожиданием.',
      'Используйте стек открывающих скобок. На `(`, `[`, `{` — `push`. На закрывающую — `pop` и сравните с парной (через словарь `) → (`, `] → [`, `} → {`). Несовпадение или пустой стек на закрывающей — ошибка. В конце строка валидна, только если стек пуст.',
      `Главный инвариант: на вершине стека всегда лежит самая «свежая» открывающая скобка, которая ещё не закрылась. Закрывающая обязана совпасть именно с ней — иначе ошибка вложенности. Две ловушки: \`pop\` на пустом стеке вернёт \`undefined\` (не считайте это валидным закрытием), а в конце стек должен быть **пустым** — иначе остались незакрытые скобки.

С чего начать:
\`\`\`js
const stack = [];
const pairs = new Map([[')', '('], [']', '['], ['}', '{']]);
for (const ch of s) {
  // ...
}
return stack.length === 0;
\`\`\``,
    ],
    solutionCode: `function isValid(s) {
  const stack = [];
  const pairs = new Map([
    [')', '('],
    [']', '['],
    ['}', '{'],
  ]);

  for (const ch of s) {
    if (!pairs.has(ch)) {
      // Открывающая скобка — кладём в стек
      stack.push(ch);
    } else {
      // Закрывающая скобка — проверяем вершину стека
      if (stack.length === 0 || stack.pop() !== pairs.get(ch)) {
        return false;
      }
    }
  }

  return stack.length === 0;
}`,
  },
  {
    id: 'sq-p2',
    topicId: 'stacks-queues',
    title: 'Ежедневная температура',
    difficulty: 'medium',
    isContextual: false,
    description: `Дан массив целых чисел \`temperatures\`, где \`temperatures[i]\` — температура в \`i\`-й день. Верните массив \`result\`, где \`result[i]\` — количество дней, которое нужно подождать после \`i\`-го дня, чтобы наступил **более тёплый** день.

Если нет будущего дня с более высокой температурой — \`result[i] = 0\`.

**Пример:**
\`\`\`
dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73])
// → [1, 1, 4, 2, 1, 1, 0, 0]
\`\`\``,
    functionName: 'dailyTemperatures',
    starterCode: `function dailyTemperatures(temperatures) {
  // Ваш код здесь
}`,
    testCases: [
      {
        id: 'sq-p2-t1',
        inputDisplay: 'dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73])',
        inputArgs: [[73, 74, 75, 71, 69, 72, 76, 73]],
        expected: [1, 1, 4, 2, 1, 1, 0, 0],
      },
      {
        id: 'sq-p2-t2',
        inputDisplay: 'dailyTemperatures([30, 40, 50, 60])',
        inputArgs: [[30, 40, 50, 60]],
        expected: [1, 1, 1, 0],
      },
      {
        id: 'sq-p2-t3',
        inputDisplay: 'dailyTemperatures([60, 50, 40, 30])',
        inputArgs: [[60, 50, 40, 30]],
        expected: [0, 0, 0, 0],
      },
      {
        id: 'sq-p2-t4',
        inputDisplay: 'dailyTemperatures([30, 30, 30])',
        inputArgs: [[30, 30, 30]],
        expected: [0, 0, 0],
      },
      {
        id: 'sq-p2-t5',
        inputDisplay: 'dailyTemperatures([50])',
        inputArgs: [[50]],
        expected: [0],
      },
    ],
    hints: [
      'Для дня `i` ответ становится известен в момент, когда вы наконец встретили день с большей температурой. До тех пор такие «ждущие» дни нужно где-то держать, причём именно последний из них первым найдёт свой ответ.',
      'Используйте монотонный стек **индексов** с убывающими температурами. Идя по массиву, пока вершина стека имеет температуру ниже текущей — выталкивайте её и записывайте `result[prev] = i - prev`. Затем кладите текущий `i`. Индексы, оставшиеся в стеке, не нашли «более тёплого» дня — у них останется `0`.',
      `Почему это O(n), несмотря на вложенный \`while\`: каждый индекс попадает в стек ровно один раз и выходит из него тоже ровно один раз, поэтому суммарное число \`pop\`-ов по всем итерациям не больше \`n\`. В стеке лежат **индексы**, а не температуры — иначе нельзя вычислить расстояние \`i - prev\`. Инвариант: температуры по индексам в стеке монотонно убывают сверху вниз; равные температуры тоже не выталкиваются, потому что нужна **строго** большая.

С чего начать:
\`\`\`js
const result = new Array(temperatures.length).fill(0);
const stack = [];
for (let i = 0; i < temperatures.length; i++) {
  // ...
}
return result;
\`\`\``,
    ],
    solutionCode: `function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const result = new Array(n).fill(0);
  const stack = []; // монотонный стек индексов

  for (let i = 0; i < n; i++) {
    // Пока текущая температура выше, чем у дня на вершине стека
    while (
      stack.length > 0 &&
      temperatures[i] > temperatures[stack[stack.length - 1]]
    ) {
      const prevIndex = stack.pop();
      result[prevIndex] = i - prevIndex;
    }
    stack.push(i);
  }

  return result;
}`,
  },
  {
    id: 'sq-p3',
    topicId: 'stacks-queues',
    title: 'История просмотров объявлений',
    difficulty: 'medium',
    isContextual: true,
    description: `Пользователь просматривает объявления. Он начинает на главной странице (\`id = 0\`). Каждое действие — это либо переход на страницу объявления (\`{ type: "visit", id: <число> }\`), либо нажатие кнопки «Назад» (\`{ type: "back" }\`).

Напишите функцию, которая принимает массив действий пользователя и возвращает \`id\` страницы, на которой пользователь окажется в итоге.

**Правила:**
- Начальная страница имеет \`id = 0\`.
- \`visit\` — переход на новую страницу (кладёт её в историю).
- \`back\` — возврат на предыдущую страницу, если история не пуста. Если возвращаться некуда (пользователь на главной), действие \`back\` **игнорируется**.

Верни \`id\` текущей страницы после выполнения всех действий.`,
    functionName: 'getCurrentPage',
    starterCode: `function getCurrentPage(actions) {
  // Ваш код здесь
}`,
    testCases: [
      {
        id: 'sq-p3-t1',
        inputDisplay:
          'getCurrentPage([{ type: "visit", id: 10 }, { type: "visit", id: 20 }])',
        inputArgs: [
          [
            { type: 'visit', id: 10 },
            { type: 'visit', id: 20 },
          ],
        ],
        expected: 20,
      },
      {
        id: 'sq-p3-t2',
        inputDisplay:
          'getCurrentPage([{ type: "visit", id: 10 }, { type: "visit", id: 20 }, { type: "back" }])',
        inputArgs: [
          [
            { type: 'visit', id: 10 },
            { type: 'visit', id: 20 },
            { type: 'back' },
          ],
        ],
        expected: 10,
      },
      {
        id: 'sq-p3-t3',
        inputDisplay:
          'getCurrentPage([{ type: "visit", id: 5 }, { type: "back" }, { type: "back" }])',
        inputArgs: [
          [
            { type: 'visit', id: 5 },
            { type: 'back' },
            { type: 'back' },
          ],
        ],
        expected: 0,
      },
      {
        id: 'sq-p3-t4',
        inputDisplay: 'getCurrentPage([{ type: "back" }, { type: "back" }])',
        inputArgs: [[{ type: 'back' }, { type: 'back' }]],
        expected: 0,
      },
      {
        id: 'sq-p3-t5',
        inputDisplay:
          'getCurrentPage([{ type: "visit", id: 1 }, { type: "visit", id: 2 }, { type: "visit", id: 3 }, { type: "back" }, { type: "back" }, { type: "visit", id: 4 }])',
        inputArgs: [
          [
            { type: 'visit', id: 1 },
            { type: 'visit', id: 2 },
            { type: 'visit', id: 3 },
            { type: 'back' },
            { type: 'back' },
            { type: 'visit', id: 4 },
          ],
        ],
        expected: 4,
      },
    ],
    hints: [
      'Текущая страница — это всегда последняя добавленная. «Назад» — отказ от последней. Это поведение один в один совпадает с LIFO-структурой.',
      'Заведите стек, инициализированный `[0]` (главная). На `visit` — `push(action.id)`. На `back` — `pop()`, но только если в стеке больше одного элемента (главная не должна уходить). Ответ — `stack[stack.length - 1]`.',
      `Ловушка — обработать \`back\`, когда возвращаться некуда. По условию это игнорируется, но если делать слепой \`pop()\`, стек опустеет и \`stack[stack.length - 1]\` вернёт \`undefined\`. Поэтому проверка \`stack.length > 1\` обязательна — чтобы главная страница \`0\` всегда оставалась на дне. Стек гарантирует O(1) на каждое действие — намного быстрее, чем срезать массив или искать индекс.

С чего начать:
\`\`\`js
const stack = [0];
for (const action of actions) {
  // ...
}
return stack[stack.length - 1];
\`\`\``,
    ],
    solutionCode: `function getCurrentPage(actions) {
  const stack = [0]; // начинаем на главной странице

  for (const action of actions) {
    if (action.type === 'visit') {
      stack.push(action.id);
    } else if (action.type === 'back') {
      // Возвращаемся, только если есть куда
      if (stack.length > 1) {
        stack.pop();
      }
    }
  }

  // Текущая страница — вершина стека
  return stack[stack.length - 1];
}`,
  },
  {
    id: 'sq-p4',
    topicId: 'stacks-queues',
    title: 'Валидация вложенных тегов',
    difficulty: 'medium',
    isContextual: true,
    description: `В простом HTML-подобном шаблоне есть открывающие теги вида \`<div>\` и закрывающие \`</div>\`. Дана строка с тегами. Проверьте, правильно ли они вложены: каждый открывающий тег закрыт соответствующим, порядок вложенности корректен. Верните \`true\`/\`false\`.

**Допустимые теги:** \`div\`, \`span\`, \`a\`, \`b\`, \`p\`. Атрибутов и самозакрывающихся тегов нет. Текст между тегами игнорируется.

**Примеры:**
\`\`\`
validateTags("<div><span></span></div>")  // → true
validateTags("<div><span></div></span>")  // → false
\`\`\``,
    functionName: 'validateTags',
    starterCode: `function validateTags(html) {
  // ваш код
}`,
    testCases: [
      {
        id: 'sq-p4-t1',
        inputDisplay: 'validateTags("<div><span></span></div>")',
        inputArgs: ['<div><span></span></div>'],
        expected: true,
      },
      {
        id: 'sq-p4-t2',
        inputDisplay: 'validateTags("<div><span></div></span>")',
        inputArgs: ['<div><span></div></span>'],
        expected: false,
      },
      {
        id: 'sq-p4-t3',
        inputDisplay: 'validateTags("<a></a><b></b>")',
        inputArgs: ['<a></a><b></b>'],
        expected: true,
      },
      {
        id: 'sq-p4-t4',
        inputDisplay: 'validateTags("<div>")',
        inputArgs: ['<div>'],
        expected: false,
      },
      {
        id: 'sq-p4-t5',
        inputDisplay: 'validateTags("")',
        inputArgs: [''],
        expected: true,
      },
    ],
    hints: [
      'Это та же задача, что валидация скобок, только «скобки» — это парные теги. Закрывающий тег обязан совпадать с самым свежим открытым.',
      'Извлеките все теги регуляркой `/<\\/?([a-z]+)>/g`. Открывающий (`fullTag` не начинается с `</`) — `push(tagName)` в стек. Закрывающий — `pop()` и сравнение: если стек пуст или вершина не равна `tagName` — `false`. В конце стек должен быть пуст.',
      `Та же ловушка, что и в скобках: пустой стек на закрывающем теге — это сразу \`false\`, иначе \`pop()\` вернёт \`undefined\` и сравнение с именем тега даст ложный «не равен» вместо явной ошибки. И в конце обязательно проверьте, что стек пуст — например, для \`"<div>"\` цикл просто положит \`div\` в стек и без этой проверки функция вернула бы \`true\`.

С чего начать:
\`\`\`js
const stack = [];
const regex = /<\\/?([a-z]+)>/g;
let match;
while ((match = regex.exec(html)) !== null) {
  // ...
}
return stack.length === 0;
\`\`\``,
    ],
    solutionCode: `function validateTags(html) {
  const stack = [];
  const regex = /<\\/?([a-z]+)>/g;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const fullTag = match[0];
    const tagName = match[1];

    if (fullTag.startsWith('</')) {
      // Закрывающий тег
      if (stack.length === 0 || stack.pop() !== tagName) {
        return false;
      }
    } else {
      // Открывающий тег
      stack.push(tagName);
    }
  }

  return stack.length === 0;
}`,
  },
  {
    id: 'sq-p5',
    topicId: 'stacks-queues',
    title: 'Отмена действий (Undo)',
    difficulty: 'easy',
    isContextual: true,
    description: `В текстовом редакторе пользователь выполняет действия. Каждое действие — это либо:

- \`{ type: "write", text: string }\` — добавить текст в конец;
- \`{ type: "undo" }\` — отменить последний \`write\`.

Верни **итоговую строку** после выполнения всех действий. Если \`undo\` вызвано, когда нечего отменять — действие игнорируется.

**Пример:**
\`\`\`
applyActions([
  { type: 'write', text: 'hello' },
  { type: 'write', text: ' world' },
  { type: 'undo' },
])
// → 'hello'
\`\`\``,
    functionName: 'applyActions',
    starterCode: `function applyActions(actions) {
  // ваш код
}`,
    testCases: [
      {
        id: 'sq-p5-t1',
        inputDisplay:
          'applyActions([{type:"write",text:"hello"},{type:"write",text:" world"},{type:"undo"}])',
        inputArgs: [
          [
            { type: 'write', text: 'hello' },
            { type: 'write', text: ' world' },
            { type: 'undo' },
          ],
        ],
        expected: 'hello',
      },
      {
        id: 'sq-p5-t2',
        inputDisplay:
          'applyActions([{type:"write",text:"a"},{type:"write",text:"b"},{type:"write",text:"c"},{type:"undo"},{type:"undo"}])',
        inputArgs: [
          [
            { type: 'write', text: 'a' },
            { type: 'write', text: 'b' },
            { type: 'write', text: 'c' },
            { type: 'undo' },
            { type: 'undo' },
          ],
        ],
        expected: 'a',
      },
      {
        id: 'sq-p5-t3',
        inputDisplay: 'applyActions([{type:"undo"}])',
        inputArgs: [[{ type: 'undo' }]],
        expected: '',
      },
      {
        id: 'sq-p5-t4',
        inputDisplay: 'applyActions([{type:"write",text:"test"}])',
        inputArgs: [[{ type: 'write', text: 'test' }]],
        expected: 'test',
      },
      {
        id: 'sq-p5-t5',
        inputDisplay:
          'applyActions([{type:"write",text:"x"},{type:"undo"},{type:"undo"},{type:"write",text:"y"}])',
        inputArgs: [
          [
            { type: 'write', text: 'x' },
            { type: 'undo' },
            { type: 'undo' },
            { type: 'write', text: 'y' },
          ],
        ],
        expected: 'y',
      },
    ],
    hints: [
      'Простейший способ поддержать undo — хранить не дельты, а **снимки** всей строки после каждого действия. Возврат к прошлому состоянию = снять верхний снимок.',
      'Заведите стек снимков, начиная с `[""]`. На `write` — возьмите вершину, прибавьте текст и `push` новой строки. На `undo` — `pop()`, но только если в стеке больше одного элемента (пустая исходная строка должна остаться). Ответ — вершина в конце.',
      `Хранение полных снимков расточительно по памяти (O(длина строки × количество действий)), но даёт безусловно правильный \`undo\`. Альтернатива через хранение длин до каждого \`write\` экономнее, но сложнее. Главное — не уйти в минус: на \`undo\` при стеке из одного начального элемента \`""\` нужно ничего не делать, иначе следующий \`write\` упадёт при чтении вершины.

С чего начать:
\`\`\`js
const stack = [""];
for (const action of actions) {
  // ...
}
return stack[stack.length - 1];
\`\`\``,
    ],
    solutionCode: `function applyActions(actions) {
  const stack = [""]; // начальное состояние — пустая строка

  for (const action of actions) {
    if (action.type === "write") {
      const current = stack[stack.length - 1];
      stack.push(current + action.text);
    } else if (action.type === "undo") {
      if (stack.length > 1) {
        stack.pop();
      }
    }
  }

  return stack[stack.length - 1];
}`,
  },
  {
    id: 'sq-p6',
    topicId: 'stacks-queues',
    kind: 'predict-output',
    title: 'Что выведет код: трассировка стека и очереди',
    difficulty: 'easy',
    isContextual: false,
    description: `Перед вами короткая программа, которая работает с массивом одновременно как со стеком (\`push\`/\`pop\`) и как с очередью (\`push\`/\`shift\`). Проследите изменение состояния и определите, что выведет финальный \`console.log\`.`,
    code: `const buf = [];

buf.push('a');
buf.push('b');
buf.push('c');

const stackTop = buf.pop();    // снимаем с конца
buf.push('d');
const queueHead = buf.shift(); // снимаем с начала

console.log(stackTop + ',' + queueHead + ',' + buf.join(''));`,
    expected: 'c,a,bd',
    hints: [
      'Шаг 1: после трёх `push` массив `["a", "b", "c"]`. Затем `pop()` снимает с **конца** — `stackTop = "c"`, массив становится `["a", "b"]`.',
      'Шаг 2: `push("d")` добавляет в конец → `["a", "b", "d"]`. Затем `shift()` снимает с **начала** — `queueHead = "a"`, массив остаётся `["b", "d"]`.',
      'Шаг 3: финальный `buf.join("")` склеивает `["b", "d"]` без разделителя → `"bd"`. Итоговая строка: `"c,a,bd"`.',
    ],
    solutionCode: `// push('a'), push('b'), push('c')  → buf = ['a', 'b', 'c']
// pop()                              → 'c',  buf = ['a', 'b']
// push('d')                          → buf = ['a', 'b', 'd']
// shift()                            → 'a',  buf = ['b', 'd']
//
// Итог: stackTop = 'c', queueHead = 'a', buf.join('') = 'bd'
// Вывод: "c,a,bd"`,
  },
  {
    id: 'sq-p7',
    topicId: 'stacks-queues',
    kind: 'find-bug',
    title: 'Найдите баг: проверка скобок и пустой стек',
    difficulty: 'medium',
    isContextual: false,
    description: `Перед вами реализация \`isValid\`, которая должна возвращать \`true\` для сбалансированных скобок и \`false\` иначе. Функция проходит большинство тестов, но на некоторых входах возвращает неверный результат.

Найдите баг и исправьте его. Подумайте о двух вещах: что произойдёт, если строка состоит только из закрывающих скобок, и что — если только из открывающих.`,
    functionName: 'isValid',
    buggyCode: `function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };

  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push(ch);
    } else {
      // Снимаем верхнюю и сравниваем с парой
      const top = stack.pop();
      if (top !== pairs[ch]) return false;
    }
  }

  return true;
}`,
    bugSummary:
      'Функция возвращает true, не проверяя, что стек пуст в конце. Для строки "((" цикл проходит без срабатывания return false, и финальный return true даёт неверный ответ — на самом деле скобки не закрыты.',
    testCases: [
      {
        id: 'sq-p7-t1',
        inputDisplay: 'isValid("()")',
        inputArgs: ['()'],
        expected: true,
      },
      {
        id: 'sq-p7-t2',
        inputDisplay: 'isValid("((")',
        inputArgs: ['(('],
        expected: false,
      },
      {
        id: 'sq-p7-t3',
        inputDisplay: 'isValid("()[]{}")',
        inputArgs: ['()[]{}'],
        expected: true,
      },
      {
        id: 'sq-p7-t4',
        inputDisplay: 'isValid("([)]")',
        inputArgs: ['([)]'],
        expected: false,
      },
      {
        id: 'sq-p7-t5',
        inputDisplay: 'isValid("{[}")',
        inputArgs: ['{[}'],
        expected: false,
      },
    ],
    hints: [
      'Шаг 1: мысленно прогоните функцию на строке `"(("`. Цикл сделает два `push` и ни разу не зайдёт в ветку с закрывающими — никаких `return false`. Итог: `return true`. Но ответ должен быть `false`: скобки не закрыты.',
      'Шаг 2: значит проблема не в логике закрытия, а в **финальном** `return true`. Что осталось в стеке после прохода? Все незакрытые открывающие. Если стек непуст — строка невалидна.',
      'Шаг 3: финальная проверка `stack.length === 0` — это пост-условие, которое нельзя пропускать в задачах на сбалансированность. Внутри цикла мы ловим только ошибки «не та закрывающая» и «закрывающая на пустом стеке». А вот «открывающая без закрывающей» проявляется только в конце: цикл закончился, а на стеке всё ещё что-то осталось. Без этой проверки тесты с одними открывающими (`"((("`, `"{["`) проходят как валидные.',
    ],
    solutionCode: `function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };

  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push(ch);
    } else {
      const top = stack.pop();
      if (top !== pairs[ch]) return false;
    }
  }

  // Все открывающие скобки должны быть закрыты — стек пуст
  return stack.length === 0;
}`,
  },
  {
    id: 'sq-p8',
    topicId: 'stacks-queues',
    kind: 'refactor',
    title: 'Рефакторинг: O(n²) Next Greater Element → O(n) монотонный стек',
    difficulty: 'medium',
    isContextual: false,
    description: `Перед вами наивная реализация задачи Next Greater Element: для каждого элемента \`nums[i]\` нужно вернуть ближайший справа элемент, который **строго больше** \`nums[i]\`. Если такого нет — вернуть \`-1\`.

Реализация работает корректно, но за O(n²) — два вложенных цикла. На массиве из 100 000 элементов она слишком медленная.

Перепишите функцию через монотонный стек, чтобы она работала за O(n).

Тест производительности: на массиве из 100 000 элементов решение должно завершаться за 50 миллисекунд.`,
    functionName: 'nextGreater',
    starterCode: `function nextGreater(nums) {
  // Наивное решение O(n²): для каждого элемента — линейный поиск вправо.
  const n = nums.length;
  const res = new Array(n).fill(-1);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (nums[j] > nums[i]) {
        res[i] = nums[j];
        break;
      }
    }
  }
  return res;
}`,
    testCases: [
      {
        id: 'sq-p8-t1',
        inputDisplay: 'nextGreater([2, 1, 2, 4, 3])',
        inputArgs: [[2, 1, 2, 4, 3]],
        expected: [4, 2, 4, -1, -1],
      },
      {
        id: 'sq-p8-t2',
        inputDisplay: 'nextGreater([5, 4, 3, 2, 1])',
        inputArgs: [[5, 4, 3, 2, 1]],
        expected: [-1, -1, -1, -1, -1],
      },
      {
        id: 'sq-p8-t3',
        inputDisplay: 'nextGreater([1, 2, 3, 4, 5])',
        inputArgs: [[1, 2, 3, 4, 5]],
        expected: [2, 3, 4, 5, -1],
      },
      {
        id: 'sq-p8-t4',
        inputDisplay: 'nextGreater([7])',
        inputArgs: [[7]],
        expected: [-1],
      },
      {
        id: 'sq-p8-t5',
        inputDisplay: 'nextGreater([1, 1, 1, 2])',
        inputArgs: [[1, 1, 1, 2]],
        expected: [2, 2, 2, -1],
      },
    ],
    perfTest: {
      // Худший случай для O(n²): убывающий массив + один большой элемент в конце.
      // 100_000 элементов: [99_999, 99_998, ..., 1, 0, 100_001].
      inputArgs: [
        (() => {
          const a = Array.from({ length: 99_999 }, (_, i) => 99_999 - i);
          a.push(100_001);
          return a;
        })(),
      ],
      maxMs: 50,
    },
    hints: [
      'Ответ для элемента `nums[i]` становится известен, когда вы наконец встречаете число строго больше. До этого момента такие «ждущие» элементы можно складывать в одну структуру — причём последний пришедший первым найдёт ответ.',
      'Используйте монотонно убывающий стек **индексов**. Идя по массиву, пока вершина имеет значение меньше текущего — `pop` и запиши `res[j] = nums[i]`. Затем `push(i)`. Индексы, оставшиеся в стеке после прохода, не имеют большего справа — для них `res[j] = -1` уже выставлено инициализацией.',
      `Почему \`-1\` ставится **инициализацией**, а не в конце: индексы, оставшиеся в стеке после прохода, — это именно те элементы, для которых большего справа не нашлось. Если их не трогать, в \`res\` остаётся уже выставленный \`-1\`. Сравнение строгое (\`nums[i] > nums[top]\`): равные не выталкивают друг друга, иначе для \`[1, 1, 2]\` первый \`1\` получил бы ответом второй \`1\` вместо \`2\`.

С чего начать:
\`\`\`js
const n = nums.length;
const res = new Array(n).fill(-1);
const stack = [];
for (let i = 0; i < n; i++) {
  // ...
}
return res;
\`\`\``,
    ],
    solutionCode: `function nextGreater(nums) {
  const n = nums.length;
  const res = new Array(n).fill(-1);
  const stack = []; // монотонно убывающий стек индексов

  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {
      const j = stack.pop();
      res[j] = nums[i];
    }
    stack.push(i);
  }

  // Индексы, оставшиеся в стеке, не имеют большего справа — у них уже -1.
  return res;
}`,
  },
  {
    id: 'sq-h1',
    topicId: 'stacks-queues',
    kind: 'implement',
    title: 'Максимальный прямоугольник в гистограмме',
    difficulty: 'hard',
    isContextual: false,
    description: `Дан массив \`heights\`, где \`heights[i]\` — высота i-го столбца гистограммы (ширина каждого столбца = 1). Найдите площадь **наибольшего прямоугольника**, который можно вписать в гистограмму.

Примеры:
\`\`\`
largestRectangle([2, 1, 5, 6, 2, 3])  // → 10  (столбцы 5 и 6, высота 5)
largestRectangle([2, 4])               // → 4
largestRectangle([1])                  // → 1
largestRectangle([0])                  // → 0
\`\`\``,
    functionName: 'largestRectangle',
    starterCode: `function largestRectangle(heights) {
  // ваш код
}`,
    testCases: [
      { id: 'sq-h1-t1', inputDisplay: 'largestRectangle([2,1,5,6,2,3])', inputArgs: [[2,1,5,6,2,3]], expected: 10 },
      { id: 'sq-h1-t2', inputDisplay: 'largestRectangle([2,4])', inputArgs: [[2,4]], expected: 4 },
      { id: 'sq-h1-t3', inputDisplay: 'largestRectangle([1])', inputArgs: [[1]], expected: 1 },
      { id: 'sq-h1-t4', inputDisplay: 'largestRectangle([0])', inputArgs: [[0]], expected: 0 },
      { id: 'sq-h1-t5', inputDisplay: 'largestRectangle([6,2,5,4,5,1,6])', inputArgs: [[6,2,5,4,5,1,6]], expected: 12 },
    ],
    hints: [
      'Для каждого столбца высоты `h` максимальный прямоугольник высоты `h` ограничен слева и справа ближайшими столбцами **строго ниже** `h`. Эти границы для всех столбцов сразу даёт классический монотонный стек.',
      'Поддерживайте стек индексов с **неубывающими** высотами. Когда новый `heights[i]` ниже вершины — вершина «закрылась»: её правая граница = `i`, левая = индекс под новой вершиной (или `-1`). Ширина = `i - stack.top() - 1` (или `i`, если стек пуст). Чтобы освободить хвост стека в конце, удобно добавить «фиктивный» столбец высоты `0` справа.',
      `Главная тонкость — формула ширины. Когда вытолкнули индекс \`j\` (высота \`heights[j]\`), правая граница уже найдена (\`i\`), а левая — это **новая** вершина стека, а не сам \`j\`. Если стек после \`pop\` пуст, столбец \`j\` тянулся от самого начала, ширина = \`i\`. Виртуальный «столбец нулевой высоты» в конце нужен, чтобы освободить хвост стека: без него столбцы, дотянувшиеся до правого края, никогда бы не были посчитаны.

С чего начать:
\`\`\`js
const stack = [];
let maxArea = 0;
const n = heights.length;
for (let i = 0; i <= n; i++) {
  // ...
}
return maxArea;
\`\`\``,
    ],
    solutionCode: `function largestRectangle(heights) {
  const stack = []; // монотонный стек индексов (возрастающий)
  let maxArea = 0;
  const n = heights.length;

  for (let i = 0; i <= n; i++) {
    const h = i === n ? 0 : heights[i];

    while (stack.length > 0 && h < heights[stack[stack.length - 1]]) {
      const height = heights[stack.pop()];
      const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
      maxArea = Math.max(maxArea, height * width);
    }

    stack.push(i);
  }

  return maxArea;
}`,
  },
  {
    id: 'sq-h2',
    topicId: 'stacks-queues',
    kind: 'implement',
    title: 'Максимум в скользящем окне (Sliding Window Maximum)',
    difficulty: 'hard',
    isContextual: false,
    description: `Дан массив \`nums\` и число \`k\` — размер скользящего окна. Верните массив максимальных значений для каждого окна.

Решение за O(n) — с помощью двусторонней очереди (deque).

Примеры:
\`\`\`
slidingWindowMax([1,3,-1,-3,5,3,6,7], 3)
// → [3, 3, 5, 5, 6, 7]

slidingWindowMax([1], 1)   // → [1]
slidingWindowMax([9,8,7,6], 2)  // → [9, 8, 7]
\`\`\``,
    functionName: 'slidingWindowMax',
    starterCode: `function slidingWindowMax(nums, k) {
  // ваш код — O(n) с deque
}`,
    testCases: [
      { id: 'sq-h2-t1', inputDisplay: 'slidingWindowMax([1,3,-1,-3,5,3,6,7], 3)', inputArgs: [[1,3,-1,-3,5,3,6,7], 3], expected: [3,3,5,5,6,7] },
      { id: 'sq-h2-t2', inputDisplay: 'slidingWindowMax([1], 1)', inputArgs: [[1], 1], expected: [1] },
      { id: 'sq-h2-t3', inputDisplay: 'slidingWindowMax([9,8,7,6], 2)', inputArgs: [[9,8,7,6], 2], expected: [9,8,7] },
      { id: 'sq-h2-t4', inputDisplay: 'slidingWindowMax([1,2,3,4,5], 3)', inputArgs: [[1,2,3,4,5], 3], expected: [3,4,5] },
      { id: 'sq-h2-t5', inputDisplay: 'slidingWindowMax([-1,-3,-5,-2,-4], 3)', inputArgs: [[-1,-3,-5,-2,-4], 3], expected: [-1,-2,-2] },
    ],
    hints: [
      'Идея: если элемент `a` стоит левее `b` и `a <= b`, то `a` уже никогда не будет максимумом (его «перекрывает» более молодой и больший `b`). Значит, в структуре имеет смысл хранить только «кандидатов на максимум».',
      'Используйте двустороннюю очередь **индексов** с монотонно убывающими значениями. На каждом шаге `i`: (1) выкиньте с **головы** индексы, вышедшие из окна (`< i - k + 1`); (2) выкиньте с **хвоста** все индексы, чьё значение ≤ `nums[i]`; (3) `push(i)` в хвост. Текущий максимум — `nums[deque[0]]` (когда `i >= k - 1`).',
      `Главный инвариант: в deque лежат индексы, у которых значения строго убывают от головы к хвосту. Голова — индекс текущего максимума окна, а хвост — кандидаты, которые станут максимумом, когда нынешний выйдет. Тонкость со сравнением \`<=\` (а не \`<\`) при выталкивании с хвоста: одинаковые значения тоже выкидываются — нет смысла держать более старый дубль, его всё равно потеснит более молодой. Запись в результат начинается только при \`i >= k - 1\`, когда окно сформировано.

С чего начать:
\`\`\`js
const deque = [];
const result = [];
for (let i = 0; i < nums.length; i++) {
  // ...
}
return result;
\`\`\``,
    ],
    solutionCode: `function slidingWindowMax(nums, k) {
  const deque = []; // хранит индексы
  const result = [];

  for (let i = 0; i < nums.length; i++) {
    // Убираем элементы вне окна
    if (deque.length > 0 && deque[0] < i - k + 1) deque.shift();

    // Убираем элементы меньше текущего из хвоста
    while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[i]) {
      deque.pop();
    }

    deque.push(i);

    // Окно полностью сформировано
    if (i >= k - 1) result.push(nums[deque[0]]);
  }

  return result;
}`,
  },
  {
    id: 'sq-e2',
    topicId: 'stacks-queues',
    title: 'Сравнение строк после backspace',
    difficulty: 'easy',
    isContextual: false,
    description: `Даны две строки \`s\` и \`t\`. Каждая может содержать символ \`'#'\`, означающий **backspace** (удаление предыдущего символа). Верните \`true\`, если после применения backspace результирующие строки **равны**, иначе — \`false\`.

\`#\` на пустой строке ничего не делает.

Примеры:
\`\`\`
backspaceCompare('ab#c', 'ad#c')   // → true   ('ac' === 'ac')
backspaceCompare('ab##', 'c#d#')   // → true   ('' === '')
backspaceCompare('a##c', '#a#c')   // → true   ('c' === 'c')
backspaceCompare('a#c', 'b')       // → false  ('c' !== 'b')
backspaceCompare('', '')           // → true
backspaceCompare('xywrrmp', 'xywrrmu#p') // → true
\`\`\`

Это **LeetCode 844** — небольшая, но показательная задача на стек.`,
    functionName: 'backspaceCompare',
    starterCode: `function backspaceCompare(s, t) {
  // ваш код
}`,
    testCases: [
      { id: 'sq-e2-t1', inputDisplay: "backspaceCompare('ab#c', 'ad#c')", inputArgs: ['ab#c', 'ad#c'], expected: true },
      { id: 'sq-e2-t2', inputDisplay: "backspaceCompare('ab##', 'c#d#')", inputArgs: ['ab##', 'c#d#'], expected: true },
      { id: 'sq-e2-t3', inputDisplay: "backspaceCompare('a##c', '#a#c')", inputArgs: ['a##c', '#a#c'], expected: true },
      { id: 'sq-e2-t4', inputDisplay: "backspaceCompare('a#c', 'b')", inputArgs: ['a#c', 'b'], expected: false },
      { id: 'sq-e2-t5', inputDisplay: "backspaceCompare('', '')", inputArgs: ['', ''], expected: true },
      { id: 'sq-e2-t6', inputDisplay: "backspaceCompare('xywrrmp', 'xywrrmu#p')", inputArgs: ['xywrrmp', 'xywrrmu#p'], expected: true },
    ],
    hints: [
      'Печать в редакторе — последовательность пушей и попов: обычная буква добавляется в конец, `#` удаляет последнюю напечатанную. Это в точности поведение стека.',
      'Постройте «итоговую» строку для каждой входной: идите по символам, на букву — `push`, на `#` — `pop` (но только если стек не пуст). В конце склейте через `join("")` и сравните результаты.',
      `Ловушка — \`#\` на пустой строке. По условию это **не ошибка**, а просто no-op: \`stack.pop()\` на пустом массиве возвращает \`undefined\`, и стек не меняется — что и нужно. Если бы вы вручную проверяли длину перед \`pop\`, всё тоже работало бы, но лишний код. Альтернатива за O(1) памяти — два указателя справа налево с подсчётом backspace, но для O(n) памяти стек проще и нагляднее.

С чего начать:
\`\`\`js
function build(str) {
  const stack = [];
  for (const ch of str) {
    // ...
  }
  return stack.join('');
}
return build(s) === build(t);
\`\`\``,
    ],
    solutionCode: `function backspaceCompare(s, t) {
  function build(str) {
    const stack = [];
    for (const ch of str) {
      if (ch === '#') {
        stack.pop();
      } else {
        stack.push(ch);
      }
    }
    return stack.join('');
  }
  return build(s) === build(t);
}`,
  },
  {
    id: 'sq-h3',
    topicId: 'stacks-queues',
    kind: 'implement',
    title: 'Длиннейшая корректная скобочная последовательность',
    difficulty: 'hard',
    isContextual: false,
    description: `Дана строка \`s\` из символов \`'('\` и \`')'\`. Верните длину **самой длинной корректной (правильно сбалансированной) непрерывной подстроки**.

Примеры:
\`\`\`
longestValidParentheses('(()')       // → 2   ('()' внутри)
longestValidParentheses(')()())')    // → 4   ('()()')
longestValidParentheses('')          // → 0
longestValidParentheses('()(()')     // → 2
longestValidParentheses('()(())')    // → 6
longestValidParentheses('(()(((()')  // → 2
\`\`\`

Это **LeetCode 32** — известная hard-задача. Существует элегантное решение через стек индексов за O(n).`,
    functionName: 'longestValidParentheses',
    starterCode: `function longestValidParentheses(s) {
  // ваш код — O(n)
}`,
    testCases: [
      { id: 'sq-h3-t1', inputDisplay: "longestValidParentheses('(()')", inputArgs: ['(()'], expected: 2 },
      { id: 'sq-h3-t2', inputDisplay: "longestValidParentheses(')()())')", inputArgs: [')()())'], expected: 4 },
      { id: 'sq-h3-t3', inputDisplay: "longestValidParentheses('')", inputArgs: [''], expected: 0 },
      { id: 'sq-h3-t4', inputDisplay: "longestValidParentheses('()(()')", inputArgs: ['()(()'], expected: 2 },
      { id: 'sq-h3-t5', inputDisplay: "longestValidParentheses('()(())')", inputArgs: ['()(())'], expected: 6 },
      { id: 'sq-h3-t6', inputDisplay: "longestValidParentheses('(()(((()')", inputArgs: ['(()(((()'], expected: 2 },
      { id: 'sq-h3-t7', inputDisplay: "longestValidParentheses('()')", inputArgs: ['()'], expected: 2 },
    ],
    hints: [
      'Корректная подстрока — это последовательность сбалансированных скобок без «лишних» закрытий и без незакрытых открытий. Длину такой подстроки удобно мерить как разность между текущей позицией и индексом последнего «разрыва» — позиции, где скобки больше не балансируются.',
      'В стек кладите **индексы**. Инициализируйте его `[-1]` — это «последняя несовпадённая граница». На `(` — `push(i)`. На `)` — `pop()`: если стек опустел, текущая `)` сама становится новой границей (`push(i)`); иначе текущая длина = `i - stack.at(-1)` — обновите максимум.',
      `Ключевой инвариант: на дне стека всегда лежит индекс «последнего разрыва» — позиция, перед которой текущая корректная подстрока не может начинаться. Изначально это \`-1\` (фиктивная позиция до строки), чтобы для \`"()"\` длина считалась как \`1 - (-1) = 2\`. На \`)\` при пустеющем стеке текущий \`i\` сам становится новой границей: всё до него уже сбалансироваться не может, надо начинать сначала. Без инициализации \`[-1]\` правильно посчитать длины невозможно.

С чего начать:
\`\`\`js
const stack = [-1];
let max = 0;
for (let i = 0; i < s.length; i++) {
  // ...
}
return max;
\`\`\``,
    ],
    solutionCode: `function longestValidParentheses(s) {
  const stack = [-1];
  let max = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') {
      stack.push(i);
    } else {
      stack.pop();
      if (stack.length === 0) {
        stack.push(i);
      } else {
        const len = i - stack[stack.length - 1];
        if (len > max) max = len;
      }
    }
  }
  return max;
}`,
  },
  {
    id: 'sq-h4',
    topicId: 'stacks-queues',
    kind: 'implement',
    title: 'Базовый калькулятор (+, -, скобки)',
    difficulty: 'hard',
    isContextual: false,
    description: `Реализуйте функцию \`calculate(s)\`, которая принимает строковое арифметическое выражение и вычисляет его значение.

Выражение содержит:
- неотрицательные целые числа
- операторы \`+\` и \`-\`
- открывающие \`(\` и закрывающие \`)\` скобки
- пробелы (которые игнорируются)

Гарантируется, что выражение синтаксически корректное и не содержит унарного минуса в начале или сразу после \`(\` (в реальных тестах LeetCode такое бывает, но здесь — нет, для упрощения).

Примеры (LeetCode 224):
\`\`\`
calculate('1 + 1')                            // → 2
calculate(' 2-1 + 2 ')                        // → 3
calculate('(1+(4+5+2)-3)+(6+8)')              // → 23
calculate('1-1-1')                            // → -1
calculate('(5)')                              // → 5
calculate('(1)+(2)')                          // → 3
\`\`\`

**Не используйте \`eval\` или \`Function\`** — нужно реализовать парсер вручную через стек.`,
    functionName: 'calculate',
    starterCode: `function calculate(s) {
  // ваш код — без eval/Function
}`,
    testCases: [
      { id: 'sq-h4-t1', inputDisplay: "calculate('1 + 1')", inputArgs: ['1 + 1'], expected: 2 },
      { id: 'sq-h4-t2', inputDisplay: "calculate(' 2-1 + 2 ')", inputArgs: [' 2-1 + 2 '], expected: 3 },
      { id: 'sq-h4-t3', inputDisplay: "calculate('(1+(4+5+2)-3)+(6+8)')", inputArgs: ['(1+(4+5+2)-3)+(6+8)'], expected: 23 },
      { id: 'sq-h4-t4', inputDisplay: "calculate('1-1-1')", inputArgs: ['1-1-1'], expected: -1 },
      { id: 'sq-h4-t5', inputDisplay: "calculate('(5)')", inputArgs: ['(5)'], expected: 5 },
      { id: 'sq-h4-t6', inputDisplay: "calculate('(1)+(2)')", inputArgs: ['(1)+(2)'], expected: 3 },
      { id: 'sq-h4-t7', inputDisplay: "calculate('10-(2+3)')", inputArgs: ['10-(2+3)'], expected: 5 },
    ],
    hints: [
      'Только `+` и `-` — операторы одного приоритета. Идея: ведём бегущий результат `result`, текущее накопляемое число `num` и текущий знак `sign` (`+1` или `-1`). На каждом операторе «сжигаем» накопленное: `result += sign * num`. Скобки добавляют один поворот: содержимое скобок надо вычислить как самостоятельный мини-результат, а потом прибавить к внешнему.',
      'При `(` — сохраните в стек текущий `result` и `sign`, обнулите их (начинаете «новый калькулятор» внутри скобок). При `)` — закройте текущее число (`result += sign * num`), затем `result = result * stack.pop() (sign до скобки) + stack.pop() (внешний result)`. Цифру накапливайте: `num = num * 10 + (ch - "0")`.',
      `Главная ловушка — последнее число. Цифры накапливаются в \`num\`, а «сжигаются» в \`result\` только при встрече оператора или \`)\`. Если строка кончается цифрой (\`"1+2"\`), последний \`num = 2\` останется не учтённым — поэтому в конце обязателен \`result += sign * num\`. Многозначные числа собираются через \`num = num * 10 + (ch - "0")\`. Стек хранит **два** значения на каждое \`(\` — внешний \`result\` и знак перед скобкой; снимать тоже надо в обратном порядке: сначала знак, потом внешний result.

С чего начать:
\`\`\`js
const stack = [];
let result = 0, num = 0, sign = 1;
for (let i = 0; i < s.length; i++) {
  // ...
}
result += sign * num;
return result;
\`\`\``,
    ],
    solutionCode: `function calculate(s) {
  const stack = [];
  let result = 0;
  let num = 0;
  let sign = 1;

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch >= '0' && ch <= '9') {
      num = num * 10 + (ch.charCodeAt(0) - 48);
    } else if (ch === '+') {
      result += sign * num;
      num = 0;
      sign = 1;
    } else if (ch === '-') {
      result += sign * num;
      num = 0;
      sign = -1;
    } else if (ch === '(') {
      stack.push(result);
      stack.push(sign);
      result = 0;
      sign = 1;
    } else if (ch === ')') {
      result += sign * num;
      num = 0;
      result *= stack.pop(); // знак перед '('
      result += stack.pop(); // результат до '('
    }
    // пробелы и любые прочие игнорируем
  }

  result += sign * num;
  return result;
}`,
  },
];
