import type { Problem } from '../../types/problem';

export const treesProblems: Problem[] = [
  {
    id: 'tree-p1',
    topicId: 'trees',
    title: 'Сумма всех значений в дереве',
    difficulty: 'easy',
    isContextual: false,
    description: `Дано дерево, где каждый узел имеет поле \`value\` (число) и необязательное поле \`children\` (массив дочерних узлов).

Напишите функцию, которая возвращает **сумму всех значений** \`value\` в дереве.

**Пример:**
\`\`\`
const tree = {
  value: 1,
  children: [
    { value: 2 },
    { value: 3, children: [{ value: 4 }, { value: 5 }] },
  ],
};
sumTree(tree)  // → 15   (1 + 2 + 3 + 4 + 5)
\`\`\``,
    functionName: 'sumTree',
    starterCode: `function sumTree(node) {
  // ваш код
}`,
    testCases: [
      {
        id: 'tree-p1-t1',
        inputDisplay: 'tree: {1, [2, {3, [4, 5]}]}',
        inputArgs: [{ value: 1, children: [{ value: 2 }, { value: 3, children: [{ value: 4 }, { value: 5 }] }] }],
        expected: 15,
      },
      {
        id: 'tree-p1-t2',
        inputDisplay: 'tree: {10}',
        inputArgs: [{ value: 10 }],
        expected: 10,
      },
      {
        id: 'tree-p1-t3',
        inputDisplay: 'tree: {0, [0, 0]}',
        inputArgs: [{ value: 0, children: [{ value: 0 }, { value: 0 }] }],
        expected: 0,
      },
      {
        id: 'tree-p1-t4',
        inputDisplay: 'tree: глубокая вложенность {1, [{2, [{3, [{4}]}]}]}',
        inputArgs: [{ value: 1, children: [{ value: 2, children: [{ value: 3, children: [{ value: 4 }] }] }] }],
        expected: 10,
      },
      {
        id: 'tree-p1-t5',
        inputDisplay: 'tree: широкое дерево {1, [2, 3, 4, 5, 6]}',
        inputArgs: [{ value: 1, children: [{ value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }, { value: 6 }] }],
        expected: 21,
      },
    ],
    hints: [
      'Дерево определено рекурсивно: узел + его поддеревья. Сумма всего дерева раскладывается так же: значение текущего узла + сумма по каждому поддереву. Базовый случай — узел без `children` (или с пустым массивом).',
      'Реализуйте функцию, которая возвращает `node.value + Σ sumTree(child)` по всем детям. Если `children` отсутствует или пуст — сразу `node.value`.',
      `Рекурсивный DFS работает за счёт того, что результат для узла — это функция от результатов детей: \`sum(node) = node.value + Σ sum(child)\`. Базовый случай (узел без \`children\` или с пустым массивом) задаёт «дно»: возвращается просто \`node.value\`, без обращения к несуществующим детям. Без проверки \`node.children\` рекурсия упала бы на листах в \`Cannot read properties of undefined (reading "length")\`.

С чего начать:
\`\`\`js
let sum = node.value;
if (node.children) {
  // ...
}
return sum;
\`\`\``,
    ],
    solutionCode: `function sumTree(node) {
  let sum = node.value;
  if (node.children) {
    for (const child of node.children) {
      sum += sumTree(child);
    }
  }
  return sum;
}`,
  },
  {
    id: 'tree-p2',
    topicId: 'trees',
    title: 'Максимальная глубина дерева',
    difficulty: 'easy',
    isContextual: false,
    description: `Дано дерево с полями \`value\` и \`children\`. Найдите **максимальную глубину** дерева.

Глубина корня = \`1\`. Если у узла нет детей, его глубина = \`1\`.

**Пример:**
\`\`\`
const tree = {
  value: 1,
  children: [
    { value: 2 },
    { value: 3, children: [{ value: 4, children: [{ value: 5 }] }] },
  ],
};
maxDepth(tree)  // → 4   (путь: 1 → 3 → 4 → 5)
\`\`\``,
    functionName: 'maxDepth',
    starterCode: `function maxDepth(node) {
  // ваш код
}`,
    testCases: [
      {
        id: 'tree-p2-t1',
        inputDisplay: 'tree: {1, [2, {3, [{4, [{5}]}]}]}',
        inputArgs: [{ value: 1, children: [{ value: 2 }, { value: 3, children: [{ value: 4, children: [{ value: 5 }] }] }] }],
        expected: 4,
      },
      {
        id: 'tree-p2-t2',
        inputDisplay: 'tree: {1} — один узел',
        inputArgs: [{ value: 1 }],
        expected: 1,
      },
      {
        id: 'tree-p2-t3',
        inputDisplay: 'tree: {1, [2, 3, 4]} — плоское',
        inputArgs: [{ value: 1, children: [{ value: 2 }, { value: 3 }, { value: 4 }] }],
        expected: 2,
      },
      {
        id: 'tree-p2-t4',
        inputDisplay: 'tree: цепочка глубины 5',
        inputArgs: [{ value: 1, children: [{ value: 2, children: [{ value: 3, children: [{ value: 4, children: [{ value: 5 }] }] }] }] }],
        expected: 5,
      },
    ],
    hints: [
      'Глубина дерева с корнем `node` = 1 + максимальная глубина среди его поддеревьев. Узел-лист (без `children` или с пустым массивом) имеет глубину `1`.',
      'Рекурсивно посчитайте глубину каждого ребёнка через `Math.max(...)`, прибавьте `1` для текущего узла. Не забудьте, что `children` может отсутствовать.',
      `Глубина считается **от единицы** (корень = 1), а не от нуля — это частая путаница. Базовый случай — узел без детей возвращает \`1\`, а не \`0\`; иначе для одиночного узла получился бы \`0\`. Инициализация \`max = 0\` нужна именно потому, что к ней потом прибавляется \`1\` — это и даёт правильную глубину \`1\` для листа без \`children\` или с пустым массивом.

С чего начать:
\`\`\`js
if (!node.children || node.children.length === 0) return 1;
let max = 0;
for (const child of node.children) {
  // ...
}
return 1 + max;
\`\`\``,
    ],
    solutionCode: `function maxDepth(node) {
  if (!node.children || node.children.length === 0) {
    return 1;
  }
  let max = 0;
  for (const child of node.children) {
    max = Math.max(max, maxDepth(child));
  }
  return 1 + max;
}`,
  },
  {
    id: 'tree-p3',
    topicId: 'trees',
    title: 'Получение узлов по типу',
    difficulty: 'medium',
    isContextual: true,
    description: `Дана древовидная структура следующего формата:

\`\`\`
const tree = {
  type: "nested",
  children: [
    { type: "added", value: 42 },
    {
      type: "nested",
      children: [{ type: "added", value: 43 }],
    },
    { type: "added", value: 44 },
  ],
};
\`\`\`

Напишите функцию \`getNodes(tree, type)\`, которая возвращает **все узлы в порядке следования**, соответствующие переданному типу. Глубина вложенности — любая.

**Примеры:**
\`\`\`
getNodes(tree, "added")
// → [
//   { type: "added", value: 42 },
//   { type: "added", value: 43 },
//   { type: "added", value: 44 },
// ]

getNodes(tree, "nested")
// → [
//   { type: "nested", children: [...] },  // корень
//   { type: "nested", children: [...] },  // вложенный nested
// ]
\`\`\``,
    functionName: 'getNodes',
    starterCode: `function getNodes(tree, type) {
  // ваш код
}`,
    testCases: [
      {
        id: 'tree-p3-t1',
        inputDisplay: 'getNodes(tree, "added") — базовый пример',
        inputArgs: [
          {
            type: 'nested',
            children: [
              { type: 'added', value: 42 },
              { type: 'nested', children: [{ type: 'added', value: 43 }] },
              { type: 'added', value: 44 },
            ],
          },
          'added',
        ],
        expected: [
          { type: 'added', value: 42 },
          { type: 'added', value: 43 },
          { type: 'added', value: 44 },
        ],
      },
      {
        id: 'tree-p3-t2',
        inputDisplay: 'getNodes(tree, "nested") — ищем nested',
        inputArgs: [
          {
            type: 'nested',
            children: [
              { type: 'added', value: 42 },
              { type: 'nested', children: [{ type: 'added', value: 43 }] },
              { type: 'added', value: 44 },
            ],
          },
          'nested',
        ],
        expected: [
          {
            type: 'nested',
            children: [
              { type: 'added', value: 42 },
              { type: 'nested', children: [{ type: 'added', value: 43 }] },
              { type: 'added', value: 44 },
            ],
          },
          { type: 'nested', children: [{ type: 'added', value: 43 }] },
        ],
      },
      {
        id: 'tree-p3-t3',
        inputDisplay: 'getNodes — тип не найден',
        inputArgs: [
          { type: 'nested', children: [{ type: 'added', value: 1 }] },
          'removed',
        ],
        expected: [],
      },
      {
        id: 'tree-p3-t4',
        inputDisplay: 'getNodes — один узел без children',
        inputArgs: [{ type: 'added', value: 99 }, 'added'],
        expected: [{ type: 'added', value: 99 }],
      },
      {
        id: 'tree-p3-t5',
        inputDisplay: 'getNodes — глубокая вложенность',
        inputArgs: [
          {
            type: 'nested',
            children: [
              {
                type: 'nested',
                children: [
                  {
                    type: 'nested',
                    children: [{ type: 'removed', value: 1 }],
                  },
                ],
              },
            ],
          },
          'removed',
        ],
        expected: [{ type: 'removed', value: 1 }],
      },
      {
        id: 'tree-p3-t6',
        inputDisplay: 'getNodes — смешанные типы',
        inputArgs: [
          {
            type: 'nested',
            children: [
              { type: 'added', value: 1 },
              { type: 'removed', value: 2 },
              { type: 'modified', value: 3 },
              { type: 'nested', children: [
                { type: 'added', value: 4 },
                { type: 'removed', value: 5 },
              ]},
            ],
          },
          'removed',
        ],
        expected: [
          { type: 'removed', value: 2 },
          { type: 'removed', value: 5 },
        ],
      },
    ],
    hints: [
      'Нужно посетить **каждый** узел и сохранить тот, у которого совпадает `type`. Порядок «в порядке следования» — это pre-order DFS: сначала корень, потом дети слева направо.',
      'Заведите внешний массив `result`. Внутри определите вложенную функцию `traverse(node)`: если `node.type === type` — `result.push(node)`. Затем для каждого `child` из `node.children` рекурсивно вызовите `traverse(child)`.',
      `Ключ к «порядку следования» — pre-order: сначала записать текущий узел, потом обходить детей. Если поменять порядок (сначала дети, потом текущий), получится post-order — и в результате родители окажутся **после** своих детей, что для \`nested\` сломает тест. Сам корень тоже проверяется — он подходит, если его \`type\` совпадает; легко забыть, начиная обход «с детей корня».

С чего начать:
\`\`\`js
const result = [];
function traverse(node) {
  // ...
}
traverse(tree);
return result;
\`\`\``,
    ],
    solutionCode: `function getNodes(tree, type) {
  const result = [];

  function traverse(node) {
    if (node.type === type) {
      result.push(node);
    }
    if (node.children) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  traverse(tree);
  return result;
}`,
  },
  {
    id: 'tree-p4',
    topicId: 'trees',
    title: 'Плоское представление дерева категорий',
    difficulty: 'medium',
    isContextual: true,
    description: `Товары организованы в дерево категорий. Каждая категория имеет \`id\`, \`name\` и необязательный массив \`subcategories\`.

Напишите функцию \`flattenCategories(tree)\`, которая возвращает **плоский массив** всех категорий с указанием пути (breadcrumb).

**Пример:**
\`\`\`
const categories = {
  id: 1, name: "Все",
  subcategories: [
    { id: 2, name: "Транспорт", subcategories: [
      { id: 4, name: "Автомобили" },
      { id: 5, name: "Мотоциклы" },
    ]},
    { id: 3, name: "Недвижимость" },
  ],
};

flattenCategories(categories)
// → [
//   { id: 1, path: "Все" },
//   { id: 2, path: "Все > Транспорт" },
//   { id: 4, path: "Все > Транспорт > Автомобили" },
//   { id: 5, path: "Все > Транспорт > Мотоциклы" },
//   { id: 3, path: "Все > Недвижимость" },
// ]
\`\`\`

Порядок — **DFS** (в глубину).`,
    functionName: 'flattenCategories',
    starterCode: `function flattenCategories(tree) {
  // ваш код
}`,
    testCases: [
      {
        id: 'tree-p4-t1',
        inputDisplay: 'Дерево категорий',
        inputArgs: [
          {
            id: 1,
            name: 'Все',
            subcategories: [
              {
                id: 2,
                name: 'Транспорт',
                subcategories: [
                  { id: 4, name: 'Автомобили' },
                  { id: 5, name: 'Мотоциклы' },
                ],
              },
              { id: 3, name: 'Недвижимость' },
            ],
          },
        ],
        expected: [
          { id: 1, path: 'Все' },
          { id: 2, path: 'Все > Транспорт' },
          { id: 4, path: 'Все > Транспорт > Автомобили' },
          { id: 5, path: 'Все > Транспорт > Мотоциклы' },
          { id: 3, path: 'Все > Недвижимость' },
        ],
      },
      {
        id: 'tree-p4-t2',
        inputDisplay: 'Одна категория без подкатегорий',
        inputArgs: [{ id: 1, name: 'Все' }],
        expected: [{ id: 1, path: 'Все' }],
      },
      {
        id: 'tree-p4-t3',
        inputDisplay: 'Глубокая вложенность',
        inputArgs: [
          {
            id: 1,
            name: 'A',
            subcategories: [
              {
                id: 2,
                name: 'B',
                subcategories: [{ id: 3, name: 'C' }],
              },
            ],
          },
        ],
        expected: [
          { id: 1, path: 'A' },
          { id: 2, path: 'A > B' },
          { id: 3, path: 'A > B > C' },
        ],
      },
      {
        id: 'tree-p4-t4',
        inputDisplay: 'Широкое дерево',
        inputArgs: [
          {
            id: 1,
            name: 'Root',
            subcategories: [
              { id: 2, name: 'A' },
              { id: 3, name: 'B' },
              { id: 4, name: 'C' },
            ],
          },
        ],
        expected: [
          { id: 1, path: 'Root' },
          { id: 2, path: 'Root > A' },
          { id: 3, path: 'Root > B' },
          { id: 4, path: 'Root > C' },
        ],
      },
    ],
    hints: [
      'Путь до узла = путь до родителя + " > " + имя текущего. Эту накопленную строку удобно **передавать как параметр** при рекурсии вниз — так каждый узел знает свой полный breadcrumb.',
      'Внутри обхода `traverse(node, parentPath)`: вычислите `path = parentPath ? parentPath + " > " + node.name : node.name`, добавьте `{ id, path }` в результат (pre-order — **до** обхода детей), затем рекурсивно по `subcategories` с обновлённым `path`.',
      `Главная идея — передавать «накопленный контекст» (\`parentPath\`) **вниз** по рекурсии, а не пытаться восстанавливать его при возврате. Так каждый узел сразу знает свой полный breadcrumb. Ловушка — корень: для него \`parentPath\` пустой, и просто конкатенация даст \`" > Все"\` с лишним префиксом. Поэтому либо проверяйте пустую строку, либо начинайте с \`null\` и обрабатывайте отдельно. Pre-order гарантирует, что родитель появится в выводе раньше своих детей.

С чего начать:
\`\`\`js
const result = [];
function traverse(node, parentPath) {
  // ...
}
traverse(tree, "");
return result;
\`\`\``,
    ],
    solutionCode: `function flattenCategories(tree) {
  const result = [];

  function traverse(node, parentPath) {
    const path = parentPath ? parentPath + " > " + node.name : node.name;
    result.push({ id: node.id, path });

    if (node.subcategories) {
      for (const sub of node.subcategories) {
        traverse(sub, path);
      }
    }
  }

  traverse(tree, "");
  return result;
}`,
  },
  {
    id: 'tree-p5',
    topicId: 'trees',
    title: 'Поиск по вложенным фильтрам',
    difficulty: 'medium',
    isContextual: true,
    description: `В системе фильтрации данных фильтр представлен деревом. Каждый узел — это либо условие \`{ type: "condition", field: string, value: any }\`, либо группа \`{ type: "and" | "or", children: [...] }\`.

Дан объект (одна запись) и дерево фильтров. Проверьте, **проходит ли объект фильтр**.

**Правила:**
- \`"condition"\` — \`obj[field] === value\`.
- \`"and"\` — **все** \`children\` должны быть \`true\`.
- \`"or"\` — **хотя бы один** \`child\` должен быть \`true\`.

**Пример:**
\`\`\`
const filter = {
  type: "and",
  children: [
    { type: "condition", field: "city", value: "Moscow" },
    { type: "condition", field: "age", value: 25 },
  ],
};
matchesFilter({ city: "Moscow", age: 25 }, filter)  // → true
matchesFilter({ city: "Moscow", age: 30 }, filter)  // → false
\`\`\``,
    functionName: 'matchesFilter',
    starterCode: `function matchesFilter(obj, filter) {
  // ваш код
}`,
    testCases: [
      {
        id: 'tree-p5-t1',
        inputDisplay: 'matchesFilter — and: оба условия true',
        inputArgs: [
          { city: 'Moscow', age: 25 },
          {
            type: 'and',
            children: [
              { type: 'condition', field: 'city', value: 'Moscow' },
              { type: 'condition', field: 'age', value: 25 },
            ],
          },
        ],
        expected: true,
      },
      {
        id: 'tree-p5-t2',
        inputDisplay: 'matchesFilter — and: одно условие false',
        inputArgs: [
          { city: 'Moscow', age: 30 },
          {
            type: 'and',
            children: [
              { type: 'condition', field: 'city', value: 'Moscow' },
              { type: 'condition', field: 'age', value: 25 },
            ],
          },
        ],
        expected: false,
      },
      {
        id: 'tree-p5-t3',
        inputDisplay: 'matchesFilter — or: одно условие true',
        inputArgs: [
          { status: 'active', role: 'user' },
          {
            type: 'or',
            children: [
              { type: 'condition', field: 'role', value: 'admin' },
              { type: 'condition', field: 'status', value: 'active' },
            ],
          },
        ],
        expected: true,
      },
      {
        id: 'tree-p5-t4',
        inputDisplay: 'matchesFilter — вложенные группы',
        inputArgs: [
          { city: 'SPb', age: 20, premium: true },
          {
            type: 'and',
            children: [
              { type: 'condition', field: 'premium', value: true },
              {
                type: 'or',
                children: [
                  { type: 'condition', field: 'city', value: 'Moscow' },
                  { type: 'condition', field: 'city', value: 'SPb' },
                ],
              },
            ],
          },
        ],
        expected: true,
      },
      {
        id: 'tree-p5-t5',
        inputDisplay: 'matchesFilter — одиночное condition',
        inputArgs: [
          { name: 'Alice' },
          { type: 'condition', field: 'name', value: 'Alice' },
        ],
        expected: true,
      },
    ],
    hints: [
      'Структура фильтра рекурсивна: лист — это `condition`, а узлы `and`/`or` содержат поддеревья. Базовый случай рекурсии — `condition`: сравниваем `obj[field]` с `value`. Узлы-комбинаторы делегируют решение детям.',
      'Для `and` подходит `Array.prototype.every` — все дети должны вернуть `true`. Для `or` — `some`. Оба метода замыкают на той же `matchesFilter(obj, child)`, то есть рекурсия идёт сама собой.',
      `Базовый случай — \`condition\`: именно он останавливает рекурсию и возвращает реальный \`boolean\`. Узлы \`and\`/\`or\` сами по себе ничего не сравнивают — они только агрегируют результаты детей. Тонкость: \`every\` на **пустом** массиве возвращает \`true\`, а \`some\` — \`false\`. Это математически корректно (пустой \`and\` = «нет нарушений», пустой \`or\` = «никто не подтвердил»), но в реальных фильтрах пустая группа обычно ошибка — стоит знать про это поведение.

С чего начать:
\`\`\`js
if (filter.type === "condition") {
  // ...
}
if (filter.type === "and") {
  // ...
}
// ...
return false;
\`\`\``,
    ],
    solutionCode: `function matchesFilter(obj, filter) {
  if (filter.type === "condition") {
    return obj[filter.field] === filter.value;
  }

  if (filter.type === "and") {
    return filter.children.every(child => matchesFilter(obj, child));
  }

  if (filter.type === "or") {
    return filter.children.some(child => matchesFilter(obj, child));
  }

  return false;
}`,
  },
  {
    id: 'tr-p6',
    topicId: 'trees',
    kind: 'predict-output',
    title: 'Что выведет код: pre-order и BFS на одном дереве',
    difficulty: 'easy',
    isContextual: false,
    description: `Перед вами небольшое дерево и две функции обхода — pre-order DFS и BFS. Проследите выполнение и определите, что выведет console.log.

Дерево:
\`\`\`
        1
       / \\
      2   3
     / \\   \\
    4   5   6
\`\`\``,
    code: `const tree = {
  value: 1,
  children: [
    { value: 2, children: [{ value: 4 }, { value: 5 }] },
    { value: 3, children: [{ value: 6 }] },
  ],
};

function dfs(node) {
  const out = [node.value];
  if (node.children) for (const c of node.children) out.push(...dfs(c));
  return out;
}

function bfs(root) {
  const out = [];
  const queue = [root];
  while (queue.length) {
    const n = queue.shift();
    out.push(n.value);
    if (n.children) for (const c of n.children) queue.push(c);
  }
  return out;
}

console.log(dfs(tree).join(','));
console.log(bfs(tree).join(','));`,
    expected: '1,2,4,5,3,6\n1,2,3,4,5,6',
    hints: [
      'Шаг 1 (DFS, pre-order). Сначала запишите корень, потом полностью обойдите первое поддерево, потом второе. Идём: `1 → 2 → 4 → 5 → 3 → 6`. Получаем `"1,2,4,5,3,6"`.',
      'Шаг 2 (BFS). Очередь начинает с `[1]`. Снимаем `1`, добавляем `[2, 3]`. Снимаем `2`, добавляем `[4, 5]`. Снимаем `3`, добавляем `[6]`. Дальше снимаем `4, 5, 6`. Порядок выписки: `1, 2, 3, 4, 5, 6` → `"1,2,3,4,5,6"`.',
      'Шаг 3. Итоговый вывод (две строки через `\\n`): `"1,2,4,5,3,6\\n1,2,3,4,5,6"`. Главная разница: DFS уходит вглубь по первой ветке, BFS обрабатывает уровень целиком.',
    ],
    solutionCode: `// DFS (pre-order):
//   visit(1) → visit(2) → visit(4) → visit(5) → visit(3) → visit(6)
//   результат: [1, 2, 4, 5, 3, 6]
//
// BFS (по уровням):
//   уровень 0: [1]
//   уровень 1: [2, 3]
//   уровень 2: [4, 5, 6]
//   результат: [1, 2, 3, 4, 5, 6]`,
  },
  {
    id: 'tr-p7',
    topicId: 'trees',
    kind: 'find-bug',
    title: 'Найдите баг: DFS зацикливается на структуре с циклом',
    difficulty: 'medium',
    isContextual: false,
    description: `Перед вами реализация подсчёта узлов в «дереве». Функция работает корректно на настоящих деревьях, но «дерево» в этом приложении приходит из API, и иногда из-за бага бэкенда содержит обратные ссылки — структура превращается в **граф с циклом**.

Сейчас функция уходит в бесконечную рекурсию и падает с \`Maximum call stack\`. Найдите ошибку и исправьте её — функция должна корректно считать **уникальные** узлы даже при наличии циклов.`,
    functionName: 'countNodes',
    buggyCode: `function countNodes(root) {
  let count = 1;
  if (root.children) {
    for (const child of root.children) {
      count += countNodes(child);
    }
  }
  return count;
}`,
    bugSummary:
      'DFS без отметки посещённых узлов на циклической структуре уходит в бесконечную рекурсию. Решение — Set seen, передаваемый в рекурсию, чтобы каждый узел учитывался ровно один раз.',
    testCases: [
      {
        id: 'tr-p7-t1',
        inputDisplay: 'обычное дерево из 6 узлов',
        inputArgs: [
          {
            value: 1,
            children: [
              { value: 2, children: [{ value: 4 }, { value: 5 }] },
              { value: 3, children: [{ value: 6 }] },
            ],
          },
        ],
        expected: 6,
      },
      {
        id: 'tr-p7-t2',
        inputDisplay: 'один узел без children',
        inputArgs: [{ value: 1 }],
        expected: 1,
      },
      {
        id: 'tr-p7-t3',
        inputDisplay: 'плоское дерево {1, [2, 3, 4]}',
        inputArgs: [{ value: 1, children: [{ value: 2 }, { value: 3 }, { value: 4 }] }],
        expected: 4,
      },
      {
        id: 'tr-p7-t4',
        inputDisplay: 'граф с циклом: ребёнок ссылается на корень',
        inputArgs: [
          (() => {
            const root: { value: number; children: unknown[] } = { value: 1, children: [] };
            const child = { value: 2, children: [root] }; // ← цикл!
            root.children.push(child);
            return root;
          })(),
        ],
        expected: 2,
      },
      {
        id: 'tr-p7-t5',
        inputDisplay: 'граф с диамантом: один узел — общий ребёнок',
        inputArgs: [
          (() => {
            const shared = { value: 99, children: [] };
            return {
              value: 1,
              children: [
                { value: 2, children: [shared] },
                { value: 3, children: [shared] },
              ],
            };
          })(),
        ],
        expected: 4,
      },
    ],
    hints: [
      'Шаг 1: посмотрите на тест с циклом — `child.children = [root]`, а `root.children = [child]`. Рекурсия `countNodes(root)` пойдёт `root → child → root → child → ...` без условия выхода — отсюда `Maximum call stack`. Стандартный DFS по дереву предполагает, что обратных рёбер нет.',
      'Шаг 2: лекарство универсальное — отслеживать уже посещённые узлы в `Set` (сравнение по ссылке именно то, что нужно). Если узел уже в `seen` — возвращаем `0` и не идём в его поддерево. Это превращает обход графа в обход с защитой от циклов.',
      'Шаг 3: `Set` для отметки посещённых должен сравнивать узлы по **ссылке** — именно это даёт стандартный `Set` для объектов через SameValueZero. Параметр со значением по умолчанию (`seen = new Set()`) создаётся при каждом внешнем вызове заново, поэтому независимые тесты не делят состояние. И помните: «уже видели» → возврат `0`, а не пропуск — иначе вклад поддерева потеряется не туда, куда нужно. Diamond-структура (общий ребёнок у двух родителей) проверяет именно это: уникальных узлов 4, а наивный DFS вернёт 5.',
    ],
    solutionCode: `function countNodes(root, seen = new Set()) {
  if (seen.has(root)) return 0;
  seen.add(root);

  let count = 1;
  if (root.children) {
    for (const child of root.children) {
      count += countNodes(child, seen);
    }
  }
  return count;
}`,
  },
  {
    id: 'tr-p8',
    topicId: 'trees',
    kind: 'refactor',
    title: 'Рефакторинг: рекурсивный DFS → итеративный со стеком',
    difficulty: 'medium',
    isContextual: false,
    description: `Перед вами рекурсивный DFS, собирающий значения всех узлов дерева. Он корректно работает на сбалансированных деревьях, но на дереве-цепочке глубиной 50 000 узлов падает с \`Maximum call stack size exceeded\` — V8 ограничивает стек вызовов примерно 10–15 тысячами кадров.

Перепишите функцию **итеративно**, используя явный стек. Контракт остаётся прежним: вернуть массив значений в **pre-order** (корень → дети слева направо).

**Тест производительности:** цепочка из 50 000 узлов должна обходиться без падения стека и завершаться за **100 мс**.`,
    functionName: 'collectValues',
    starterCode: `function collectValues(root) {
  // Рекурсивный DFS — работает, но падает на глубокой цепочке
  const result = [];

  function dfs(node) {
    result.push(node.value);
    if (node.children) {
      for (const child of node.children) dfs(child);
    }
  }

  dfs(root);
  return result;
}`,
    testCases: [
      {
        id: 'tr-p8-t1',
        inputDisplay: 'базовое дерево {1, [2, [4, 5], 3, [6]]}',
        inputArgs: [
          {
            value: 1,
            children: [
              { value: 2, children: [{ value: 4 }, { value: 5 }] },
              { value: 3, children: [{ value: 6 }] },
            ],
          },
        ],
        expected: [1, 2, 4, 5, 3, 6],
      },
      {
        id: 'tr-p8-t2',
        inputDisplay: 'один узел',
        inputArgs: [{ value: 42 }],
        expected: [42],
      },
      {
        id: 'tr-p8-t3',
        inputDisplay: 'плоское дерево {1, [2, 3, 4]}',
        inputArgs: [{ value: 1, children: [{ value: 2 }, { value: 3 }, { value: 4 }] }],
        expected: [1, 2, 3, 4],
      },
      {
        id: 'tr-p8-t4',
        inputDisplay: 'короткая цепочка глубины 5',
        inputArgs: [
          {
            value: 0,
            children: [
              {
                value: 1,
                children: [
                  {
                    value: 2,
                    children: [
                      { value: 3, children: [{ value: 4 }] },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        expected: [0, 1, 2, 3, 4],
      },
    ],
    perfTest: {
      // Chain of 50_000 nodes — recursive DFS will blow the stack on this input.
      inputArgs: [
        (() => {
          let chain: { value: number; children: unknown[] } | null = null;
          for (let i = 49_999; i >= 0; i--) {
            chain = { value: i, children: chain ? [chain] : [] };
          }
          return chain;
        })(),
      ],
      maxMs: 100,
    },
    hints: [
      'Любую рекурсию можно превратить в цикл с явным стеком — это и спасает от переполнения стека вызовов V8. Сам стек живёт в куче, и его размер ограничен только памятью.',
      'Заведите массив-стек `[root]`. В цикле `while (stack.length)` снимайте узел с конца (`pop`), записывайте `node.value`, затем кладите детей. Чтобы порядок остался pre-order (слева направо), детей надо класть в **обратном** порядке — тогда левый окажется на вершине и будет снят первым.',
      `Ключевая инверсия — дети кладутся в стек в **обратном** порядке. Стек LIFO: последний положенный снимается первым, поэтому чтобы левый ребёнок обрабатывался раньше правого (как требует pre-order), правый должен оказаться **под** левым. Если положить детей слева направо, получится обход «справа налево» — все тесты с порядком в массиве упадут. Сам стек живёт в куче, его размер ограничен только памятью — отсюда устойчивость к глубине 50 000, на которой рекурсия падает.

С чего начать:
\`\`\`js
const result = [];
const stack = [root];
while (stack.length > 0) {
  // ...
}
return result;
\`\`\``,
    ],
    solutionCode: `function collectValues(root) {
  const result = [];
  const stack = [root];

  while (stack.length > 0) {
    const node = stack.pop();
    result.push(node.value);

    if (node.children) {
      // Кладём в обратном порядке: первый ребёнок окажется на вершине
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push(node.children[i]);
      }
    }
  }

  return result;
}`,
  },
  {
    id: 'tree-h1',
    topicId: 'trees',
    kind: 'implement',
    title: 'Наименьший общий предок (LCA) в бинарном дереве',
    difficulty: 'hard',
    isContextual: false,
    description: `Дано бинарное дерево (не обязательно BST) и значения двух узлов \`p\` и \`q\`. Найдите **наименьшего общего предка** (Lowest Common Ancestor) — самый глубокий узел, являющийся предком обоих.

Дерево представлено узлом с полями \`val\`, \`left\`, \`right\`. Гарантируется, что оба узла существуют в дереве.

Примеры:
\`\`\`
//        3
//       / \\
//      5   1
//     / \\ / \\
//    6  2 0  8
//      / \\
//     7   4

lca(root, 5, 1)  // → 3
lca(root, 5, 4)  // → 5  (5 является предком 4)
lca(root, 6, 4)  // → 5
\`\`\``,
    functionName: 'lca_test',
    starterCode: `function lca(root, p, q) {
  // ваш код
}`,
    testCases: [
      { id: 'tree-h1-t1', inputDisplay: 'lca(root, 5, 1) → 3', inputArgs: ['5-1'], expected: 3 },
      { id: 'tree-h1-t2', inputDisplay: 'lca(root, 5, 4) → 5', inputArgs: ['5-4'], expected: 5 },
      { id: 'tree-h1-t3', inputDisplay: 'lca(root, 6, 4) → 5', inputArgs: ['6-4'], expected: 5 },
      { id: 'tree-h1-t4', inputDisplay: 'lca(root, 0, 8) → 1', inputArgs: ['0-8'], expected: 1 },
      { id: 'tree-h1-t5', inputDisplay: 'lca(root, 7, 4) → 2', inputArgs: ['7-4'], expected: 2 },
    ],
    hints: [
      'Узел является LCA для `p` и `q` в одном из двух случаев: (1) `p` нашёлся в одном поддереве, а `q` — в другом; (2) сам узел совпадает с `p` или `q`, а второй — где-то в его поддереве. Рекурсия может вернуть «нашёл одного из них» снизу, и тогда сборщик наверху определит LCA.',
      'Базы: `null → null`, `root.val === p || root.val === q → root`. Иначе вызывайте `lca` для левого и правого. Если оба не `null` — текущий узел и есть LCA. Если один — поднимаем его наверх (он либо сам найденный, либо уже LCA из поддерева).',
      `Главная элегантность — рекурсия возвращает разные смыслы: «нашёл одного из p/q», «нашёл LCA» или \`null\`. Но снаружи это неразличимо: если в одном поддереве вернулось что-то непустое, а в другом \`null\`, значит **оба** узла внизу в первом поддереве, и непустой результат уже либо сам LCA, либо «всплывающий вверх» один из них. Тонкость: проверка \`root.val === p || root.val === q\` идёт **до** ухода в поддеревья — даже если второй узел потомок первого, LCA — именно этот первый.

С чего начать:
\`\`\`js
if (!root || root.val === p || root.val === q) return root;
const left = lca(root.left, p, q);
const right = lca(root.right, p, q);
// ...
\`\`\``,
    ],
    solutionCode: `function lca(root, p, q) {
  if (!root || root.val === p || root.val === q) return root;

  const left  = lca(root.left, p, q);
  const right = lca(root.right, p, q);

  if (left && right) return root;
  return left ?? right;
}`,
    testHelperCode: `function buildTree() {
  function node(val, left = null, right = null) { return { val, left, right }; }
  return node(3,
    node(5, node(6), node(2, node(7), node(4))),
    node(1, node(0), node(8))
  );
}
function lca_test(pair) {
  const root = buildTree();
  const [p, q] = pair.split('-').map(Number);
  const res = lca(root, p, q);
  return res ? res.val : null;
}`,
  },
  {
    id: 'tree-h2',
    topicId: 'trees',
    kind: 'implement',
    title: 'Сериализация и десериализация бинарного дерева',
    difficulty: 'hard',
    isContextual: false,
    description: `Реализуйте функции \`serialize(root)\` и \`deserialize(data)\` для бинарного дерева.

- \`serialize(root)\` преобразует дерево в строку
- \`deserialize(data)\` восстанавливает дерево из строки

Формат строки — на ваш выбор, главное чтобы round-trip работал корректно.

Дерево: узлы с полями \`val\`, \`left\`, \`right\`.

Примеры:
\`\`\`
const root = { val: 1, left: { val: 2, left: null, right: null }, right: { val: 3, left: null, right: null } };
const s = serialize(root);
const r = deserialize(s);
r.val         // → 1
r.left.val    // → 2
r.right.val   // → 3
\`\`\``,
    functionName: 'serdes_test',
    starterCode: `function serialize(root) {
  // ваш код
}

function deserialize(data) {
  // ваш код
}`,
    testCases: [
      { id: 'tree-h2-t1', inputDisplay: 'serialize→deserialize [1,2,3]', inputArgs: ['simple'], expected: [1, 2, 3] },
      { id: 'tree-h2-t2', inputDisplay: 'serialize→deserialize [1,null,2,3]', inputArgs: ['right-chain'], expected: [1, null, 2, null, 3] },
      { id: 'tree-h2-t3', inputDisplay: 'serialize→deserialize null', inputArgs: ['empty'], expected: null },
      { id: 'tree-h2-t4', inputDisplay: 'serialize→deserialize одного узла [42]', inputArgs: ['single'], expected: [42] },
    ],
    hints: [
      'Чтобы по строке однозначно восстановить дерево, нужно кодировать **в том числе** отсутствующих детей (иначе не получится отличить «у узла нет левого» от «есть левый, его дети идут дальше»). Удобный маркер — `"N"` (или `null`).',
      'Самый простой формат — BFS с null-местами: записываем уровни по очереди, пустые места — `"N"`. При десериализации идём по той же очереди: для каждого «живого» узла читаем два следующих токена — левого и правого ребёнка, добавляем непустых в очередь.',
      `Без маркера для \`null\` сериализация неоднозначна: строка \`"1,2,3"\` могла бы означать и \`[1, [2], [3]]\`, и \`[1, [2, [3]]]\`, и многое другое. Поэтому в очередь BFS кладут **в том числе** null-детей, а при выгрузке null-узлов в очередь повторно их класть уже не нужно — но в массиве они должны быть. Главное при десериализации — синхронно двигать указатель \`i\` ровно по два токена на каждый снятый с очереди узел, иначе дети сместятся и дерево восстановится неправильно.

С чего начать:
\`\`\`js
// serialize
if (!root) return 'N';
const res = [];
const queue = [root];
while (queue.length) {
  // ...
}
return res.join(',');
\`\`\``,
    ],
    solutionCode: `function serialize(root) {
  if (!root) return 'N';
  const res = [];
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    if (!node) { res.push('N'); continue; }
    res.push(String(node.val));
    queue.push(node.left);
    queue.push(node.right);
  }
  return res.join(',');
}

function deserialize(data) {
  const vals = data.split(',');
  if (vals[0] === 'N') return null;
  const root = { val: Number(vals[0]), left: null, right: null };
  const queue = [root];
  let i = 1;
  while (queue.length && i < vals.length) {
    const node = queue.shift();
    if (vals[i] !== 'N') {
      node.left = { val: Number(vals[i]), left: null, right: null };
      queue.push(node.left);
    }
    i++;
    if (i < vals.length && vals[i] !== 'N') {
      node.right = { val: Number(vals[i]), left: null, right: null };
      queue.push(node.right);
    }
    i++;
  }
  return root;
}`,
    testHelperCode: `function serdes_test(scenario) {
  function node(val, left = null, right = null) { return { val, left, right }; }
  function bfsVals(root) {
    if (!root) return null;
    const result = [], queue = [root];
    while (queue.length) {
      const n = queue.shift();
      if (!n) { result.push(null); continue; }
      result.push(n.val);
      if (n.left || n.right || (queue.length > 0)) {
        queue.push(n.left, n.right);
      }
    }
    // trim trailing nulls
    while (result.length > 0 && result[result.length - 1] === null) result.pop();
    return result;
  }
  if (scenario === 'empty') {
    const r = deserialize(serialize(null));
    return r;
  }
  let root;
  if (scenario === 'simple') root = node(1, node(2), node(3));
  if (scenario === 'right-chain') root = node(1, null, node(2, node(3)));
  if (scenario === 'single') root = node(42);
  const restored = deserialize(serialize(root));
  return bfsVals(restored);
}`,
  },
  {
    id: 'tree-e2',
    topicId: 'trees',
    title: 'Подсчёт листьев в дереве',
    difficulty: 'easy',
    isContextual: false,
    description: `Дано дерево, где каждый узел имеет поле \`value\` и необязательное поле \`children\` (массив дочерних узлов).

**Лист** — это узел, у которого нет детей (поле \`children\` отсутствует или массив пуст).

Напишите функцию \`countLeaves(node)\`, которая возвращает количество листьев в дереве.

Примеры:
\`\`\`
countLeaves({ value: 1 })                                                   // → 1
countLeaves({ value: 1, children: [{ value: 2 }, { value: 3 }] })           // → 2
countLeaves({ value: 1, children: [] })                                     // → 1
countLeaves({ value: 1, children: [
  { value: 2, children: [{ value: 4 }, { value: 5 }] },
  { value: 3 }
]})                                                                          // → 3
\`\`\``,
    functionName: 'countLeaves',
    starterCode: `function countLeaves(node) {
  // ваш код
}`,
    testCases: [
      {
        id: 'tree-e2-t1',
        inputDisplay: 'countLeaves({1})',
        inputArgs: [{ value: 1 }],
        expected: 1,
      },
      {
        id: 'tree-e2-t2',
        inputDisplay: 'countLeaves({1, [2, 3]})',
        inputArgs: [{ value: 1, children: [{ value: 2 }, { value: 3 }] }],
        expected: 2,
      },
      {
        id: 'tree-e2-t3',
        inputDisplay: 'countLeaves({1, []})',
        inputArgs: [{ value: 1, children: [] }],
        expected: 1,
      },
      {
        id: 'tree-e2-t4',
        inputDisplay: 'countLeaves({1, [{2, [4, 5]}, 3]})',
        inputArgs: [{ value: 1, children: [{ value: 2, children: [{ value: 4 }, { value: 5 }] }, { value: 3 }] }],
        expected: 3,
      },
      {
        id: 'tree-e2-t5',
        inputDisplay: 'countLeaves(глубокая цепочка)',
        inputArgs: [{ value: 1, children: [{ value: 2, children: [{ value: 3, children: [{ value: 4 }] }] }] }],
        expected: 1,
      },
      {
        id: 'tree-e2-t6',
        inputDisplay: 'countLeaves(широкое дерево с 5 листьями)',
        inputArgs: [{ value: 1, children: [{ value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }, { value: 6 }] }],
        expected: 5,
      },
    ],
    hints: [
      'Лист — узел без детей; он сам считается за единицу. Узел с детьми сам по себе не лист — его вклад равен сумме листьев по поддеревьям.',
      'База: `!node.children || node.children.length === 0` → `return 1`. Иначе `return Σ countLeaves(child)`.',
      `Базовый случай — лист — возвращает \`1\`, а не \`0\`. Это ловушка: интуитивно хочется «считать листья» начиная с нуля, но именно лист и есть единичный вклад. Узел с детьми сам не лист — его собственное значение в сумму не идёт, только сумма по поддеревьям. Проверка \`!node.children || node.children.length === 0\` важна с обеих сторон: и для отсутствующего поля, и для пустого массива — оба случая означают «лист».

С чего начать:
\`\`\`js
if (!node.children || node.children.length === 0) return 1;
let total = 0;
for (const child of node.children) {
  // ...
}
return total;
\`\`\``,
    ],
    solutionCode: `function countLeaves(node) {
  if (!node.children || node.children.length === 0) return 1;
  let total = 0;
  for (const child of node.children) {
    total += countLeaves(child);
  }
  return total;
}`,
  },
  {
    id: 'tree-h3',
    topicId: 'trees',
    kind: 'implement',
    title: 'Максимальная сумма пути в бинарном дереве',
    difficulty: 'hard',
    isContextual: false,
    description: `Дано бинарное дерево с узлами \`{ val, left, right }\`. **Путь** — любая последовательность узлов, в которой каждая пара соседей соединена ребром. Путь **не обязан** начинаться или заканчиваться в корне, и **не обязан** содержать корень. Путь использует каждый узел не более одного раза.

Верните **максимальную сумму** значений узлов в любом таком пути.

Это **LeetCode 124** — классическая hard-задача на рекурсию по дереву с двойным учётом: «вклад поддерева вверх» и «лучший путь, замыкающийся в текущем узле».

Пример:
\`\`\`
//       -10
//      /    \\
//     9     20
//           / \\
//          15  7

maxPathSum(root)  // → 42   (путь 15 → 20 → 7)
\`\`\`

Примеры:
\`\`\`
maxPathSum(node(1, node(2), node(3)))       // → 6   (2+1+3)
maxPathSum(node(-3))                         // → -3
maxPathSum(node(2, node(-1)))                // → 2   (только корень)
maxPathSum(node(1, node(-2), node(3)))       // → 4   (1+3, минуем -2)
\`\`\``,
    functionName: 'maxPathSum_test',
    starterCode: `function maxPathSum(root) {
  // ваш код
}`,
    testCases: [
      { id: 'tree-h3-t1', inputDisplay: 'maxPathSum([1,2,3]) → 6', inputArgs: ['simple'], expected: 6 },
      { id: 'tree-h3-t2', inputDisplay: 'maxPathSum([-10,9,20,null,null,15,7]) → 42', inputArgs: ['with-neg'], expected: 42 },
      { id: 'tree-h3-t3', inputDisplay: 'maxPathSum([-3]) → -3', inputArgs: ['single'], expected: -3 },
      { id: 'tree-h3-t4', inputDisplay: 'maxPathSum([2,-1]) → 2', inputArgs: ['two'], expected: 2 },
      { id: 'tree-h3-t5', inputDisplay: 'maxPathSum([1,-2,3]) → 4', inputArgs: ['positive-third'], expected: 4 },
      { id: 'tree-h3-t6', inputDisplay: 'maxPathSum([1,2,null,3,null,4]) → 10', inputArgs: ['chain'], expected: 10 },
    ],
    hints: [
      'Ключевая идея — различать **два** значения для каждого узла. (1) «Вклад вверх» — лучший путь, который заходит в узел и уходит **только** в одно поддерево; такой путь можно продлить выше. (2) «Локальный максимум» — путь, замыкающийся в текущем узле; берёт **обе** ветви, но дальше не идёт. Ответ задачи — максимум из всех локальных максимумов по всему дереву.',
      'Рекурсивная функция возвращает «вклад вверх» = `node.val + max(leftGain, rightGain)`, причём отрицательные `leftGain`/`rightGain` обрезаются нулём (лучше не брать поддерево). Внутри обновляйте внешний максимум как `node.val + leftGain + rightGain`.',
      `Ключевая ловушка — отрицательные значения. Инициализация \`max = -Infinity\` (а не \`0\`) обязательна: путь должен содержать хотя бы один узел, и для дерева с единственным узлом \`-3\` ответ именно \`-3\`, а не \`0\`. Обрезка \`Math.max(gain, 0)\` — отдельная история: тут \`0\` уместен, потому что отрицательное поддерево лучше «не подключать», а просто не идти в него (пустой вклад). И не путайте две сущности: наверх отдаём вклад **одной** ветки, а обновляем максимум — суммой **обеих**.

С чего начать:
\`\`\`js
let max = -Infinity;
function gain(node) {
  if (!node) return 0;
  // ...
}
gain(root);
return max;
\`\`\``,
    ],
    solutionCode: `function maxPathSum(root) {
  let max = -Infinity;
  function gain(node) {
    if (!node) return 0;
    const left  = Math.max(gain(node.left), 0);
    const right = Math.max(gain(node.right), 0);
    const localMax = node.val + left + right;
    if (localMax > max) max = localMax;
    return node.val + Math.max(left, right);
  }
  gain(root);
  return max;
}`,
    testHelperCode: `function maxPathSum_test(scenario) {
  function node(val, left = null, right = null) { return { val, left, right }; }
  let root = null;
  if (scenario === 'simple') root = node(1, node(2), node(3));
  if (scenario === 'with-neg') root = node(-10, node(9), node(20, node(15), node(7)));
  if (scenario === 'single') root = node(-3);
  if (scenario === 'two') root = node(2, node(-1));
  if (scenario === 'positive-third') root = node(1, node(-2), node(3));
  if (scenario === 'chain') root = node(1, node(2, node(3, node(4))));
  return maxPathSum(root);
}`,
  },
  {
    id: 'tree-h4',
    topicId: 'trees',
    kind: 'implement',
    title: 'Построить бинарное дерево из preorder и inorder',
    difficulty: 'hard',
    isContextual: false,
    description: `Даны два массива:
- \`preorder\` — preorder-обход бинарного дерева (узел → лево → право)
- \`inorder\` — inorder-обход того же дерева (лево → узел → право)

Восстановите дерево и верните его корень. Гарантируется, что **все значения в дереве уникальны**.

Это **LeetCode 105** — классическая задача на восстановление дерева из двух обходов.

Пример:
\`\`\`
buildTree([3,9,20,15,7], [9,3,15,20,7])
// →   3
//    / \\
//   9   20
//       / \\
//      15  7
\`\`\`

Для проверки в тестах мы сериализуем восстановленное дерево обходом BFS (с обрезанием хвостовых null).`,
    functionName: 'build_test',
    starterCode: `function buildTree(preorder, inorder) {
  // ваш код
}`,
    testCases: [
      { id: 'tree-h4-t1', inputDisplay: 'buildTree([3,9,20,15,7], [9,3,15,20,7])', inputArgs: ['simple'], expected: [3, 9, 20, null, null, 15, 7] },
      { id: 'tree-h4-t2', inputDisplay: 'buildTree([1], [1])', inputArgs: ['single'], expected: [1] },
      { id: 'tree-h4-t3', inputDisplay: 'buildTree([1,2,3], [3,2,1]) — левая цепочка', inputArgs: ['left-only'], expected: [1, 2, null, 3] },
      { id: 'tree-h4-t4', inputDisplay: 'buildTree([1,2,3], [1,2,3]) — правая цепочка', inputArgs: ['right-only'], expected: [1, null, 2, null, 3] },
      { id: 'tree-h4-t5', inputDisplay: 'buildTree([3,9,1,2,20,15,7], [1,9,2,3,15,20,7])', inputArgs: ['mixed'], expected: [3, 9, 20, 1, 2, 15, 7] },
    ],
    hints: [
      'Pre-order начинается с корня, in-order помещает корень между левым и правым поддеревьями. Зная корень из preorder, в inorder можно отрезать левую часть (это inorder левого поддерева) и правую (это inorder правого). Размер левой части подсказывает, какой кусок preorder относится к левому поддереву.',
      'Заведите `Map<значение → индекс в inorder>` для O(1) поиска корня. Поддерживайте указатель `preIdx`, увеличивающийся при каждом «съеденном» корне. Рекурсивно стройте поддерево по диапазону `[inLo, inHi]` в inorder: корень = `preorder[preIdx++]`, его индекс в inorder = `m`, левое — `build(inLo, m - 1)`, правое — `build(m + 1, inHi)`.',
      `Главный инвариант — \`preIdx\` **глобальный** и монотонно растёт. Каждый рекурсивный вызов «съедает» один корень из preorder, и порядок важен: сначала строится левое поддерево, потом правое, потому что в preorder именно так: корень → весь левый блок → весь правый. Если поменять местами вызовы \`build\` для левого и правого, \`preIdx\` уйдёт не к тому корню. Уникальность значений критична — без неё индекс корня в inorder неоднозначен.

С чего начать:
\`\`\`js
const idx = new Map();
for (let i = 0; i < inorder.length; i++) idx.set(inorder[i], i);
let preIdx = 0;
function build(inLo, inHi) {
  // ...
}
return build(0, inorder.length - 1);
\`\`\``,
    ],
    solutionCode: `function buildTree(preorder, inorder) {
  if (!preorder.length) return null;
  const idx = new Map();
  for (let i = 0; i < inorder.length; i++) idx.set(inorder[i], i);

  let preIdx = 0;
  function build(inLo, inHi) {
    if (inLo > inHi) return null;
    const val = preorder[preIdx++];
    const m = idx.get(val);
    const node = { val, left: null, right: null };
    node.left  = build(inLo, m - 1);
    node.right = build(m + 1, inHi);
    return node;
  }
  return build(0, inorder.length - 1);
}`,
    testHelperCode: `function build_test(scenario) {
  let pre, ino;
  if (scenario === 'simple')      { pre = [3,9,20,15,7];        ino = [9,3,15,20,7]; }
  if (scenario === 'single')      { pre = [1];                  ino = [1]; }
  if (scenario === 'left-only')   { pre = [1,2,3];              ino = [3,2,1]; }
  if (scenario === 'right-only')  { pre = [1,2,3];              ino = [1,2,3]; }
  if (scenario === 'mixed')       { pre = [3,9,1,2,20,15,7];    ino = [1,9,2,3,15,20,7]; }
  const root = buildTree(pre, ino);
  // BFS-сериализация с null-местами; обрезаем висящие null
  if (!root) return [];
  const result = [];
  const q = [root];
  while (q.length) {
    const n = q.shift();
    if (n === null) { result.push(null); continue; }
    result.push(n.val);
    if (n.left !== null || n.right !== null) {
      q.push(n.left);
      q.push(n.right);
    }
  }
  while (result.length && result[result.length - 1] === null) result.pop();
  return result;
}`,
  },
];
