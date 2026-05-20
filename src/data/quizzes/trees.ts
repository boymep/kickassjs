import type { TopicQuiz } from '../../types/quiz';

export const treesQuiz: TopicQuiz = {
  topicId: 'trees',
  questions: [
    // ==================== EASY (1–6) ====================
    {
      type: 'fill-blank',
      id: 'tree-q1',
      description: 'Рекурсивный обход дерева с children. Что нужно проверить перед обходом детей?',
      codeWithBlanks: `function traverse(node) {
  console.log(node.value);
  if (___BLANK___) {
    for (const child of node.children) {
      traverse(child);
    }
  }
}`,
      options: ['node.children', 'node.children.length > 0', 'node !== null', 'typeof node === "object"'],
      correctIndex: 0,
      explanation:
        'Нужно проверить наличие поля children (node.children). Это покрывает случаи когда children отсутствует (листовой узел) и когда children === undefined. Проверка length > 0 тоже допустима, но node.children уже достаточно — пустой массив просто не выполнит цикл.',
    },
    {
      type: 'output',
      id: 'tree-q2',
      description: 'Какой порядок значений выведет DFS для данного дерева?',
      code: `const tree = {
  value: 1,
  children: [
    { value: 2, children: [{ value: 4 }, { value: 5 }] },
    { value: 3, children: [{ value: 6 }] },
  ],
};

function dfs(node) {
  const result = [node.value];
  if (node.children) {
    for (const child of node.children) {
      result.push(...dfs(child));
    }
  }
  return result;
}

console.log(dfs(tree));`,
      options: ['[1, 2, 4, 5, 3, 6]', '[1, 2, 3, 4, 5, 6]', '[4, 5, 2, 6, 3, 1]', '[1, 3, 6, 2, 5, 4]'],
      correctIndex: 0,
      explanation:
        'DFS (pre-order) обходит: корень (1), затем рекурсивно первого ребёнка (2 → 4, 5), затем второго (3 → 6). Результат: [1, 2, 4, 5, 3, 6].',
    },
    {
      type: 'output',
      id: 'tree-q3',
      description: 'Какой порядок значений выведет BFS для того же дерева?',
      code: `const tree = {
  value: 1,
  children: [
    { value: 2, children: [{ value: 4 }, { value: 5 }] },
    { value: 3, children: [{ value: 6 }] },
  ],
};

function bfs(root) {
  const result = [];
  const queue = [root];
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node.value);
    if (node.children) {
      for (const child of node.children) {
        queue.push(child);
      }
    }
  }
  return result;
}

console.log(bfs(tree));`,
      options: ['[1, 2, 4, 5, 3, 6]', '[1, 2, 3, 4, 5, 6]', '[4, 5, 6, 2, 3, 1]', '[1, 3, 2, 6, 5, 4]'],
      correctIndex: 1,
      explanation:
        'BFS обходит по уровням: уровень 0 → [1], уровень 1 → [2, 3], уровень 2 → [4, 5, 6]. Результат: [1, 2, 3, 4, 5, 6].',
    },
    {
      type: 'tracing',
      id: 'tree-q4',
      description: 'Проследите выполнение getNodes для дерева с вложенными типами.',
      code: `function getNodes(root, targetType) {
  const result = [];
  function traverse(node) {
    if (node.type === targetType) result.push(node);
    if (node.children) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }
  traverse(root);
  return result;
}

const tree = {
  type: "nested",
  children: [
    { type: "added", value: 42 },
    {
      type: "nested",
      children: [{ type: "added", value: 43 }],
    },
    { type: "removed", value: 44 },
  ],
};

getNodes(tree, "added"); // ?`,
      steps: [
        { label: 'traverse(root)', variables: { 'node.type': 'nested', match: 'нет', 'result.length': 0 } },
        { label: 'traverse(child[0])', variables: { 'node.type': 'added', match: 'да', 'result.length': 1 } },
        { label: 'traverse(child[1])', variables: { 'node.type': 'nested', match: 'нет', 'result.length': 1 } },
        { label: 'traverse(child[1].child[0])', variables: { 'node.type': 'added', match: 'да', 'result.length': 2 } },
        { label: 'traverse(child[2])', variables: { 'node.type': 'removed', match: 'нет', 'result.length': 2 } },
      ],
      question: 'Сколько элементов вернёт getNodes(tree, "added")?',
      options: ['1', '2', '3', '4'],
      correctIndex: 1,
      explanation:
        'В дереве два узла с type === "added": {value: 42} и {value: 43}. Узел "nested" и "removed" не подходят. Ответ: 2.',
    },
    {
      type: 'complexity',
      id: 'tree-q5',
      description: 'Какова временная сложность DFS-обхода дерева с n узлами?',
      code: `function dfs(node, callback) {
  callback(node);
  if (node.children) {
    for (const child of node.children) {
      dfs(child, callback);
    }
  }
}`,
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctIndex: 2,
      explanation:
        'DFS посещает каждый узел ровно один раз, выполняя O(1) работы на каждый. Итого O(n), где n — количество узлов в дереве.',
    },
    {
      type: 'fill-blank',
      id: 'tree-q6',
      description: 'Итеративный DFS с помощью стека. Чтобы обойти детей в прямом порядке, добавляем их в стек:',
      codeWithBlanks: `function dfs(root) {
  const stack = [root];
  while (stack.length > 0) {
    const node = stack.pop();
    process(node);
    if (node.children) {
      for (let i = ___BLANK___; i >= 0; i--) {
        stack.push(node.children[i]);
      }
    }
  }
}`,
      options: [
        'node.children.length - 1',
        'node.children.length',
        '0',
        'node.children.length + 1',
      ],
      correctIndex: 0,
      explanation:
        'Стек — LIFO. Чтобы первый ребёнок был обработан первым, нужно добавить детей в обратном порядке: от последнего (length-1) до первого (0). Тогда первый ребёнок окажется на вершине стека.',
    },

    // ==================== INTERMEDIATE (7–11) ====================
    {
      type: 'output',
      id: 'tree-q7',
      description: 'Функция flatten превращает дерево в плоский массив. Что вернёт вызов?',
      code: `const tree = {
  value: 'a',
  children: [
    {
      value: 'b',
      children: [
        { value: 'd' },
        { value: 'e' },
      ],
    },
    { value: 'c' },
  ],
};

function flatten(node) {
  const result = [node.value];
  if (node.children) {
    for (const child of node.children) {
      result.push(...flatten(child));
    }
  }
  return result;
}

console.log(flatten(tree));`,
      options: [
        '["a", "b", "d", "e", "c"]',
        '["a", "b", "c", "d", "e"]',
        '["d", "e", "b", "c", "a"]',
        '["a", "c", "b", "e", "d"]',
      ],
      correctIndex: 0,
      explanation:
        'flatten делает DFS (pre-order): сначала корень "a", затем рекурсивно первый ребёнок "b" → "d", "e", затем второй ребёнок "c". Итог: ["a", "b", "d", "e", "c"].',
    },
    {
      type: 'fill-blank',
      id: 'tree-q8',
      description: 'Рекурсивная функция вычисления максимальной глубины дерева. Что стоит в базовом случае?',
      codeWithBlanks: `function maxDepth(node) {
  if (!node.children || node.children.length === 0) {
    return ___BLANK___;
  }
  let max = 0;
  for (const child of node.children) {
    const d = maxDepth(child);
    if (d > max) max = d;
  }
  return max + 1;
}`,
      options: ['0', '1', '-1', 'null'],
      correctIndex: 1,
      explanation:
        'Листовой узел (без детей) имеет глубину 1 — он сам является одним уровнем. Каждый родитель добавляет +1 к максимальной глубине своих детей. Если корень — лист, глубина = 1.',
    },
    {
      type: 'output',
      id: 'tree-q9',
      description: 'BFS с поуровневым сбором значений. Что вернёт функция?',
      code: `const tree = {
  value: 1,
  children: [
    { value: 2, children: [{ value: 5 }, { value: 6 }] },
    { value: 3 },
    { value: 4, children: [{ value: 7 }] },
  ],
};

function levelOrder(root) {
  const result = [];
  const queue = [root];
  while (queue.length > 0) {
    const levelSize = queue.length;
    const level = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      level.push(node.value);
      if (node.children) {
        queue.push(...node.children);
      }
    }
    result.push(level);
  }
  return result;
}

console.log(levelOrder(tree));`,
      options: [
        '[[1], [2, 3, 4], [5, 6, 7]]',
        '[[1, 2, 3, 4, 5, 6, 7]]',
        '[[1], [2, 5, 6], [3], [4, 7]]',
        '[[7, 6, 5], [4, 3, 2], [1]]',
      ],
      correctIndex: 0,
      explanation:
        'levelOrder собирает узлы по уровням с помощью BFS. На каждом шаге внешнего while обрабатывается ровно один уровень (levelSize фиксирует длину очереди). Уровень 0: [1], уровень 1: [2, 3, 4], уровень 2: [5, 6, 7].',
    },
    {
      type: 'tracing',
      id: 'tree-q10',
      description: 'Проследите подсчёт узлов, значение которых больше 3.',
      code: `const tree = {
  value: 5,
  children: [
    { value: 2, children: [{ value: 8 }] },
    { value: 1 },
    { value: 4, children: [{ value: 3 }, { value: 7 }] },
  ],
};

function countIf(node, predicate) {
  let count = predicate(node) ? 1 : 0;
  if (node.children) {
    for (const child of node.children) {
      count += countIf(child, predicate);
    }
  }
  return count;
}

console.log(countIf(tree, (n) => n.value > 3));`,
      steps: [
        { label: 'countIf(5)', variables: { value: 5, 'predicate(5)': 'true', count: 1 } },
        { label: 'countIf(2)', variables: { value: 2, 'predicate(2)': 'false', count: 0 } },
        { label: 'countIf(8)', variables: { value: 8, 'predicate(8)': 'true', count: 1 } },
        { label: 'возврат из ветки 2→8', variables: { 'count(2)': '0+1=1' } },
        { label: 'countIf(1)', variables: { value: 1, 'predicate(1)': 'false', count: 0 } },
        { label: 'countIf(4)', variables: { value: 4, 'predicate(4)': 'true', count: 1 } },
        { label: 'countIf(3)', variables: { value: 3, 'predicate(3)': 'false', count: 0 } },
        { label: 'countIf(7)', variables: { value: 7, 'predicate(7)': 'true', count: 1 } },
        { label: 'возврат из ветки 4→3,7', variables: { 'count(4)': '1+0+1=2' } },
        { label: 'итого в корне', variables: { 'count(5)': '1+1+0+2=4' } },
      ],
      question: 'Сколько узлов со значением > 3 в дереве?',
      options: ['2', '3', '4', '5'],
      correctIndex: 2,
      explanation:
        'Узлы со значением > 3: корень (5), вложенный (8), ребёнок (4) и вложенный (7). Узлы 2, 1, 3 не проходят проверку. Итого: 4.',
    },
    {
      type: 'fill-blank',
      id: 'tree-q11',
      description: 'Функция ищет путь от корня до узла с заданным значением. Что нужно вернуть, если узел найден?',
      codeWithBlanks: `function findPath(node, target) {
  if (node.value === target) {
    return ___BLANK___;
  }
  if (node.children) {
    for (const child of node.children) {
      const path = findPath(child, target);
      if (path) {
        return [node.value, ...path];
      }
    }
  }
  return null;
}`,
      options: ['[node.value]', 'node.value', 'true', '[target]'],
      correctIndex: 0,
      explanation:
        'Когда нашли целевой узел, возвращаем массив с его значением — [node.value]. Это базовый случай рекурсии. Родительские вызовы будут дописывать свои значения в начало через [node.value, ...path], формируя полный путь от корня.',
    },

    // ==================== HARDER MIDDLE (12–16) ====================
    {
      type: 'output',
      id: 'tree-q12',
      description: 'Сериализация дерева в строку и обратно. Что выведет код?',
      code: `const tree = {
  value: 'root',
  children: [
    { value: 'a', children: [{ value: 'a1' }] },
    { value: 'b' },
  ],
};

function serialize(node) {
  const obj = { v: node.value };
  if (node.children && node.children.length > 0) {
    obj.c = node.children.map(serialize);
  }
  return obj;
}

function deserialize(obj) {
  const node = { value: obj.v };
  if (obj.c) {
    node.children = obj.c.map(deserialize);
  }
  return node;
}

const json = JSON.stringify(serialize(tree));
const restored = deserialize(JSON.parse(json));
console.log(restored.children[0].children[0].value);`,
      options: ['a1', 'a', 'root', 'undefined'],
      correctIndex: 0,
      explanation:
        'serialize преобразует дерево в компактный объект {v, c}, который сериализуется в JSON. deserialize восстанавливает исходную структуру. Путь restored.children[0].children[0] ведёт к узлу {value: "a1"}, поэтому ответ — "a1".',
    },
    {
      type: 'tracing',
      id: 'tree-q13',
      description: 'Проследите поиск наименьшего общего предка (LCA) двух узлов в дереве с children.',
      code: `const tree = {
  value: 1,
  children: [
    {
      value: 2,
      children: [{ value: 4 }, { value: 5 }],
    },
    {
      value: 3,
      children: [{ value: 6 }, { value: 7 }],
    },
  ],
};

function findPath(node, target) {
  if (node.value === target) return [node.value];
  if (node.children) {
    for (const child of node.children) {
      const p = findPath(child, target);
      if (p) return [node.value, ...p];
    }
  }
  return null;
}

function lca(root, a, b) {
  const pathA = findPath(root, a);
  const pathB = findPath(root, b);
  let ancestor = null;
  for (let i = 0; i < Math.min(pathA.length, pathB.length); i++) {
    if (pathA[i] === pathB[i]) ancestor = pathA[i];
    else break;
  }
  return ancestor;
}

console.log(lca(tree, 4, 5));
console.log(lca(tree, 4, 6));`,
      steps: [
        { label: 'findPath(root, 4)', variables: { result: '[1, 2, 4]' } },
        { label: 'findPath(root, 5)', variables: { result: '[1, 2, 5]' } },
        { label: 'сравнение путей к 4 и 5', variables: { 'i=0': '1===1 ✓', 'i=1': '2===2 ✓', 'i=2': '4!==5 ✗', ancestor: 2 } },
        { label: 'findPath(root, 4)', variables: { result: '[1, 2, 4]' } },
        { label: 'findPath(root, 6)', variables: { result: '[1, 3, 6]' } },
        { label: 'сравнение путей к 4 и 6', variables: { 'i=0': '1===1 ✓', 'i=1': '2!==3 ✗', ancestor: 1 } },
      ],
      question: 'Что выведет lca(tree, 4, 6)?',
      options: ['2', '3', '1', '4'],
      correctIndex: 2,
      explanation:
        'Путь к 4: [1, 2, 4]. Путь к 6: [1, 3, 6]. Последний общий элемент путей — 1 (корень). Узлы 4 и 6 находятся в разных ветках, поэтому их LCA — корень дерева.',
    },
    {
      type: 'output',
      id: 'tree-q14',
      description: 'Восстановление дерева из массива элементов с parentId. Какое значение будет у второго ребёнка корня?',
      code: `const items = [
  { id: 1, parentId: null, value: 'root' },
  { id: 2, parentId: 1, value: 'A' },
  { id: 3, parentId: 1, value: 'B' },
  { id: 4, parentId: 2, value: 'A1' },
  { id: 5, parentId: 3, value: 'B1' },
  { id: 6, parentId: 3, value: 'B2' },
];

function buildTree(items) {
  const map = {};
  let root = null;

  for (const item of items) {
    map[item.id] = { value: item.value, children: [] };
  }

  for (const item of items) {
    if (item.parentId === null) {
      root = map[item.id];
    } else {
      map[item.parentId].children.push(map[item.id]);
    }
  }

  return root;
}

const tree = buildTree(items);
console.log(tree.children[1].value);
console.log(tree.children[1].children.length);`,
      options: [
        '"B", 2',
        '"A", 1',
        '"B1", 0',
        '"B", 1',
      ],
      correctIndex: 0,
      explanation:
        'buildTree создаёт map по id, затем связывает родителей с детьми. Корень (id=1) имеет двух детей: A (id=2) и B (id=3). children[1] — это B. У B два ребёнка: B1 и B2. Поэтому выведет "B" и 2.',
    },
    {
      type: 'output',
      id: 'tree-q15',
      description: 'Функция сравнивает два дерева и возвращает объект с различиями. Что будет в результате?',
      code: `const treeA = {
  value: 1,
  children: [
    { value: 2 },
    { value: 3, children: [{ value: 5 }] },
  ],
};

const treeB = {
  value: 1,
  children: [
    { value: 2 },
    { value: 3, children: [{ value: 99 }] },
  ],
};

function diffTrees(a, b, path = '') {
  const diffs = [];
  if (a.value !== b.value) {
    diffs.push({ path, from: a.value, to: b.value });
  }
  const aChildren = a.children || [];
  const bChildren = b.children || [];
  const maxLen = Math.max(aChildren.length, bChildren.length);
  for (let i = 0; i < maxLen; i++) {
    if (aChildren[i] && bChildren[i]) {
      diffs.push(...diffTrees(aChildren[i], bChildren[i], path + '/' + i));
    } else if (aChildren[i]) {
      diffs.push({ path: path + '/' + i, type: 'removed' });
    } else {
      diffs.push({ path: path + '/' + i, type: 'added' });
    }
  }
  return diffs;
}

const result = diffTrees(treeA, treeB);
console.log(result.length);
console.log(result[0].path);
console.log(result[0].from, result[0].to);`,
      options: [
        '1, "/1/0", 5, 99',
        '2, "/1", 3, 3',
        '1, "/1", 5, 99',
        '3, "/0", 2, 2',
      ],
      correctIndex: 0,
      explanation:
        'diffTrees рекурсивно сравнивает узлы. Корни равны (1===1), первые дети равны (2===2), вторые дети равны (3===3), но на уровне глубже: 5 !== 99. Единственное различие — по пути "/1/0" (второй ребёнок корня → первый ребёнок этого узла), значение изменилось с 5 на 99.',
    },
    {
      type: 'complexity',
      id: 'tree-q16',
      description: 'Какова временная сложность функции mapTree, которая создаёт новое дерево, применяя функцию к каждому узлу?',
      code: `function mapTree(node, fn) {
  const mapped = { value: fn(node.value) };
  if (node.children) {
    mapped.children = node.children.map(
      (child) => mapTree(child, fn)
    );
  }
  return mapped;
}

// Пример использования:
const doubled = mapTree(tree, (v) => v * 2);`,
      options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'],
      correctIndex: 1,
      explanation:
        'mapTree посещает каждый узел ровно один раз и выполняет O(1) работы на каждый (вызов fn + создание объекта). Метод .map() на children не добавляет вложенности — он просто итерирует по массиву детей текущего узла, а рекурсия уходит вглубь. Суммарно каждый узел обработан один раз, итого O(n).',
    },
  ],
};
