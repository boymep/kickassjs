import type { Problem } from '../../types/problem';

export const treesProblems: Problem[] = [
  {
    id: 'tree-p1',
    topicId: 'trees',
    title: 'Сумма всех значений в дереве',
    difficulty: 'easy',
    isContextual: false,
    description: `Дано дерево, где каждый узел имеет поле value (число) и необязательное поле children (массив дочерних узлов).

Напишите функцию, которая возвращает сумму всех значений value в дереве.

Пример:
const tree = {
  value: 1,
  children: [
    { value: 2 },
    { value: 3, children: [{ value: 4 }, { value: 5 }] },
  ],
};
sumTree(tree) → 15  (1 + 2 + 3 + 4 + 5)`,
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
      'Используйте рекурсию: сумма = value текущего узла + сумма всех детей',
      'Базовый случай: если нет children, вернуть value',
      'Пройдите по children циклом и рекурсивно вызовите sumTree для каждого',
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
    description: `Дано дерево с полями value и children. Найдите максимальную глубину дерева.

Глубина корня = 1. Если у узла нет детей, его глубина = 1.

Пример:
const tree = {
  value: 1,
  children: [
    { value: 2 },
    { value: 3, children: [{ value: 4, children: [{ value: 5 }] }] },
  ],
};
maxDepth(tree) → 4  (путь: 1 → 3 → 4 → 5)`,
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
      'Глубина узла = 1 + максимум из глубин его детей',
      'Если нет children, глубина = 1',
      'Используйте Math.max для нахождения максимума среди детей',
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

Необходимо написать функцию getNodes(tree, type), которая возвращает все ноды в порядке следования, соответствующие переданному типу. Глубина вложенности любая.

Пример:
getNodes(tree, "added") → [
  { type: "added", value: 42 },
  { type: "added", value: 43 },
  { type: "added", value: 44 },
]

getNodes(tree, "nested") → [
  { type: "nested", children: [...] },  // корень
  { type: "nested", children: [...] },  // вложенный nested
]`,
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
      'Используйте рекурсивный DFS — обходите дерево в глубину',
      'Для каждого узла: если node.type === type, добавьте его в результат',
      'Если у узла есть children, рекурсивно обойдите каждого ребёнка',
      'Не забудьте проверить сам корневой узел',
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
    description: `Товары организованы в дерево категорий. Каждая категория имеет id, name и необязательный массив subcategories.

Напишите функцию flattenCategories(tree), которая возвращает плоский массив всех категорий с указанием пути (breadcrumb).

Пример:
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

flattenCategories(categories) → [
  { id: 1, path: "Все" },
  { id: 2, path: "Все > Транспорт" },
  { id: 4, path: "Все > Транспорт > Автомобили" },
  { id: 5, path: "Все > Транспорт > Мотоциклы" },
  { id: 3, path: "Все > Недвижимость" },
]

Порядок — DFS (в глубину).`,
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
      'Передавайте текущий путь как параметр рекурсии',
      'Путь строится из name родительских узлов через " > "',
      'Используйте DFS: сначала добавляйте текущий узел, потом рекурсивно обходите subcategories',
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

Дан объект (одна запись) и дерево фильтров. Проверьте, проходит ли объект фильтр.

Для "condition": obj[field] === value.
Для "and": все children должны быть true.
Для "or": хотя бы один child должен быть true.

Пример:
const filter = {
  type: "and",
  children: [
    { type: "condition", field: "city", value: "Moscow" },
    { type: "condition", field: "age", value: 25 },
  ],
};
matchesFilter({ city: "Moscow", age: 25 }, filter) → true
matchesFilter({ city: "Moscow", age: 30 }, filter) → false`,
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
      'Рекурсия: для condition — проверить obj[field] === value',
      'Для and — every(), для or — some()',
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
];
