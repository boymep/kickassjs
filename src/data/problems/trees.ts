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
      'Сумма поддерева — это текущий узел плюс что-то от его детей. Что именно?',
      'Как выглядит базовый случай — когда рекурсия должна остановиться?',
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
      'Глубина узла зависит от глубины его потомков. Как выразить её через рекурсивные вызовы?',
      'Как обработать узел без детей?',
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

Напиши функцию \`getNodes(tree, type)\`, которая возвращает **все узлы в порядке следования**, соответствующие переданному типу. Глубина вложенности — любая.

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
      'Нужно посетить каждый узел дерева. Какой порядок обхода — DFS или BFS — проще реализовать рекурсивно?',
      'Как структура дерева определяет структуру рекурсии?',
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

Напиши функцию \`flattenCategories(tree)\`, которая возвращает **плоский массив** всех категорий с указанием пути (breadcrumb).

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
      'Путь к узлу зависит от его предков. Как передать эту информацию вниз по рекурсии?',
      'Когда нужно добавить узел в результат — при входе в него или при выходе?',
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

Дан объект (одна запись) и дерево фильтров. Проверь, **проходит ли объект фильтр**.

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
      'Структура фильтра рекурсивна: условие может быть простым или составным. Как обработать оба варианта?',
      'Какие стандартные методы массивов естественно выражают логику «все условия выполнены» и «хотя бы одно»?',
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
    title: 'Предскажите вывод: pre-order и BFS на одном дереве',
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
\`\`\`

Подсказка: pre-order идёт «корень → левое поддерево → правое». BFS идёт по уровням: сначала корень, потом дети, потом внуки.`,
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
      'Pre-order DFS: посетите узел → рекурсивно по детям слева направо.',
      'BFS обходит уровень за уровнем: [1] → [2, 3] → [4, 5, 6].',
      'Главное отличие: DFS уходит вглубь по первой ветке, BFS обрабатывает уровень целиком.',
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
    description: `Перед тобой реализация подсчёта узлов в «дереве». Функция работает корректно на настоящих деревьях, но «дерево» в этом приложении приходит из API, и иногда из-за бага бэкенда содержит обратные ссылки — структура превращается в **граф с циклом**.

Сейчас функция уходит в бесконечную рекурсию и падает с \`Maximum call stack\`. Найди ошибку и исправь её — функция должна корректно считать **уникальные** узлы даже при наличии циклов.

**Подсказка:** в графе обход требует отметки посещённых узлов.`,
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
      'Почему стандартная рекурсия может зациклиться на этом дереве?',
      'Как отслеживать уже посещённые узлы, чтобы не обрабатывать их повторно?',
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
    description: `Перед тобой рекурсивный DFS, собирающий значения всех узлов дерева. Он корректно работает на сбалансированных деревьях, но на дереве-цепочке глубиной 50 000 узлов падает с \`Maximum call stack size exceeded\` — V8 ограничивает стек вызовов примерно 10–15 тысячами кадров.

Перепиши функцию **итеративно**, используя явный стек. Контракт остаётся прежним: вернуть массив значений в **pre-order** (корень → дети слева направо).

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
      'Рекурсия использует стек вызовов неявно. Как сделать этот стек явным?',
      'В каком порядке нужно добавлять детей в стек, чтобы порядок обхода остался pre-order?',
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
      'Общий предок — это узел, у которого p и q находятся в разных поддеревьях (или один из них сам является этим узлом). Как найти его рекурсивно?',
      'Что означает результат рекурсивного поиска в поддереве: нашли p, нашли q, нашли обоих или не нашли ничего?',
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
      'Сериализация должна однозначно восстанавливать дерево — как кодировать отсутствующие узлы?',
      'Какой порядок обхода проще всего восстановить при десериализации?',
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
      'Базовый случай: узел без детей (или с пустым массивом children) — это сам лист. Сколько он добавляет к ответу?',
      'Иначе суммируйте количество листьев по всем детям рекурсивно.',
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
      'Различайте две величины: «вклад поддерева в путь, продолжающий вверх» (только одна ветвь идёт к родителю) и «лучший путь, замыкающийся в текущем узле» (можно взять обе ветви).',
      'При спуске вниз отрицательные вклады поддеревьев можно «отбрасывать» — заменяя на 0, мы решаем не идти в это поддерево.',
      'Поддерживайте глобальный максимум в замыкании и обновляйте его при каждом узле.',
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
      'Первый элемент preorder — корень. Найдите его в inorder: всё слева — левое поддерево, всё справа — правое.',
      'Размер левого поддерева равен числу элементов слева от корня в inorder. На основе этого делите preorder.',
      'Для ускорения поиска корня в inorder заведите Map<значение, индекс>.',
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
