import type { Lesson } from '../../types/lesson';
import { treesQuiz } from '../quizzes/trees';

// Index existing quiz questions for reuse as checkpoints.
const Q = Object.fromEntries(treesQuiz.questions.map((q) => [q.id, q]));

// Questions used as in-chapter checkpoints (must NOT appear in finalQuiz).
const CHECKPOINT_IDS = new Set(['tree-q2', 'tree-q3', 'tree-q6', 'tree-q8', 'tree-q11']);

export const treesLesson: Lesson = {
  topicId: 'trees',

  intro: {
    whyItMatters: `Дерево — самая распространённая структура данных в работе фронтенд-инженера, даже если вы об этом не задумываетесь. DOM, который браузер рендерит на странице, — это дерево. Виртуальный DOM React, который сравнивается между рендерами в процессе reconciliation, — тоже дерево. AST, который парсер вашего сборщика строит из исходников TypeScript, — дерево. Структура категорий в интернет-магазине, иерархия комментариев на форуме, файловая система операционной системы, JSON произвольной вложенности из ответа API — везде деревья.

На алгоритмических собеседованиях деревья проверяют умение работать с **рекурсией** и понимание разницы между двумя стратегиями обхода: DFS (в глубину, через стек или рекурсию) и BFS (в ширину, через очередь). DFS бывает трёх видов — pre-order, in-order и post-order — и каждый из них применяется в своих задачах: pre-order для копирования и сериализации, in-order для вывода BST в отсортированном порядке, post-order для удаления и для подсчёта снизу вверх (например, высота дерева). BFS используется, когда нужен **ближайший** ответ или поуровневая обработка: «найти путь минимальной длины», «вывести узлы по уровням», «найти первого общего предка по глубине».

Помимо обхода, на интервью спрашивают про **бинарные деревья поиска (BST)**, балансировку (AVL, Red-Black), Trie для автодополнения, наименьшего общего предка (LCA), сериализацию и восстановление дерева. Сложность обхода — O(n) по времени, O(h) по памяти на стек рекурсии, где h — высота дерева. На сбалансированном дереве h = O(log n); на вырожденном (цепочке) — h = O(n), и наивная рекурсия легко получает Maximum call stack size exceeded.`,
    estimatedMinutes: 36,
    interviewAngle:
      'Деревья встречаются на каждом алгоритмическом собеседовании. Сильный кандидат не зазубривает шаблон обхода, а аргументирует выбор стратегии (DFS vs BFS), типа DFS (pre/in/post) и формы реализации (рекурсия vs итерация со стеком), исходя из формулировки задачи и ограничений по глубине.',
    prerequisites: [{ slug: 'stacks-queues', title: 'Стеки и очереди' }],
  },

  resources: {
    videos: [
      {
        source: 'youtube',
        id: 'fAAZixBzIAI',
        title: 'Binary Tree Algorithms for Technical Interviews — Full Course',
        channel: 'freeCodeCamp.org (Alvin Zablan)',
        language: 'en',
        durationSec: 76 * 60,
        description: 'Образцовый разбор задач на деревья по шаблонам DFS и BFS — must-watch перед собеседованием.',
      },
      {
        source: 'youtube',
        id: '9RHO6jU--GU',
        title: 'Binary tree traversal — breadth-first and depth-first strategies',
        channel: 'mycodeschool',
        language: 'en',
        durationSec: 11 * 60,
        description: 'Каноническая визуализация трёх вариантов DFS (pre/in/post-order) и BFS на доске.',
      },
    ],
    links: [
      {
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction',
        title: 'Introduction to the DOM — MDN',
        source: 'mdn',
        language: 'en',
        note: 'DOM как живой пример древовидной структуры в браузере: узлы, родители, дети, обход.',
      },
      {
        url: 'https://cp-algorithms.com/graph/breadth-first-search.html',
        title: 'Breadth-first search — cp-algorithms',
        source: 'article',
        language: 'en',
        note: 'Точная формулировка BFS, инварианты очереди и обоснование O(n + m).',
      },
      {
        url: 'https://cp-algorithms.com/graph/depth-first-search.html',
        title: 'Depth-first search — cp-algorithms',
        source: 'article',
        language: 'en',
        note: 'Глубокий разбор DFS, цвета вершин, классификация рёбер, применение для топосорта.',
      },
      {
        url: 'https://neetcode.io/courses/dsa-for-beginners/24',
        title: 'Trees — NeetCode DSA course',
        source: 'article',
        language: 'en',
        note: 'Бесплатный курс с пошаговым разбором BST, обходов и шаблонов под LeetCode-задачи.',
      },
      {
        url: 'https://en.wikipedia.org/wiki/Tree_traversal',
        title: 'Tree traversal — Wikipedia',
        source: 'article',
        language: 'en',
        note: 'Справочник: pre/in/post-order, level-order, итеративные шаблоны со стеком.',
      },
    ],
  },

  chapters: [
    {
      id: 'what-is-tree',
      title: 'Что такое дерево',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            '**Дерево** — это иерархическая структура из узлов (nodes). Каждый узел хранит значение и ссылки на дочерние узлы. У дерева есть **корень** (единственный узел без родителя) и **листья** (узлы без детей). Между любыми двумя узлами существует ровно один путь — это отличает дерево от графа.',
        },
        {
          type: 'visualization',
          content: '',
          vizId: 'trees',
        },
        { type: 'heading', content: 'Виды деревьев' },
        {
          type: 'list',
          content: `- **Бинарное дерево** — у каждого узла не более двух детей (\`left\` и \`right\`).
- **Бинарное дерево поиска (BST)** — для каждого узла все значения в левом поддереве меньше, в правом — больше.
- **Сбалансированное дерево** (AVL, Red-Black) — высота поддеревьев отличается не более чем на 1, что гарантирует O(log n) на операции.
- **N-ary tree** — у узла произвольное число детей в массиве \`children\`. Самая частая форма на фронтенд-собеседованиях.
- **Trie (бор)** — дерево префиксов: каждый путь от корня — это строка. Используется для автодополнения и поиска.
- **Heap** — частично упорядоченное бинарное дерево, реализация приоритетной очереди.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Типичная форма дерева на фронтенд-собеседовании
const tree = {
  type: 'nested',
  children: [
    { type: 'added', value: 42 },
    {
      type: 'nested',
      children: [{ type: 'added', value: 43 }],
    },
    { type: 'added', value: 44 },
  ],
};

// Классическое бинарное дерево из алгоритмических задач
const bst = {
  value: 5,
  left:  { value: 3, left: { value: 1 }, right: { value: 4 } },
  right: { value: 8, left: { value: 7 }, right: { value: 9 } },
};`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Чем дерево отличается от графа: в дереве **n** узлов соединены **n − 1** ребром, нет циклов и есть выделенный корень. В графе циклы возможны, и при обходе нужно отмечать посещённые узлы (\`Set\` или булев массив), иначе DFS зациклится.',
        },
      ],
      flashcardIds: ['tr-f1', 'tr-f2'],
      checkpoint: [Q['tree-q2']!],
      docsLink: { url: 'https://ru.algorithmica.org/cs/trees/', title: 'Корневые деревья — ru.algorithmica.org' },
    },

    {
      id: 'dfs',
      title: 'DFS — обход в глубину',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'visualization',
          content: '',
          vizId: 'dfs',
        },
        {
          type: 'text',
          content:
            '**DFS** (Depth-First Search) идёт как можно глубже по одной ветке, прежде чем вернуться и обойти соседнюю. Реализуется либо через рекурсию (стек вызовов делает работу за вас), либо итеративно через явный стек.',
        },
        { type: 'heading', content: 'Три порядка DFS для бинарного дерева' },
        {
          type: 'list',
          content: `- **Pre-order** (прямой): корень → левое → правое. Применение: сериализация дерева, копирование, печать структуры.
- **In-order** (центральный): левое → корень → правое. Применение: вывод BST в отсортированном порядке.
- **Post-order** (обратный): левое → правое → корень. Применение: удаление дерева, подсчёт «снизу вверх» (высота, размер, агрегаты).`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Три варианта DFS для бинарного дерева
function preorder(node, visit) {
  if (!node) return;
  visit(node);              // 1. корень
  preorder(node.left, visit);
  preorder(node.right, visit);
}

function inorder(node, visit) {
  if (!node) return;
  inorder(node.left, visit);
  visit(node);              // 2. корень между поддеревьями
  inorder(node.right, visit);
}

function postorder(node, visit) {
  if (!node) return;
  postorder(node.left, visit);
  postorder(node.right, visit);
  visit(node);              // 3. корень в конце
}`,
        },
        { type: 'heading', content: 'DFS для дерева с произвольным числом детей' },
        {
          type: 'code',
          language: 'javascript',
          content: `// На фронтенде чаще встречается форма с children: []
function dfs(node, visit) {
  visit(node);
  if (node.children) {
    for (const child of node.children) {
      dfs(child, visit);
    }
  }
}`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Сложность DFS — O(n) по времени и O(h) по памяти, где h — высота дерева. На сбалансированном дереве h = O(log n), на вырожденной цепочке h = O(n), и рекурсия может уронить стек.',
        },
      ],
      flashcardIds: ['tr-f3', 'tr-f4', 'tr-f5'],
      checkpoint: [Q['tree-q6']!, Q['tree-q8']!],
      docsLink: { url: 'https://ru.algorithmica.org/cs/graph-traversals/dfs/', title: 'Поиск в глубину (DFS) — ru.algorithmica.org' },
    },

    {
      id: 'bfs',
      title: 'BFS — обход в ширину',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'visualization',
          content: '',
          vizId: 'bfs',
        },
        {
          type: 'text',
          content:
            '**BFS** (Breadth-First Search) обходит дерево по уровням: сначала корень (уровень 0), потом всех его детей (уровень 1), потом внуков (уровень 2) и так далее. Реализуется через **очередь** (FIFO).',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function bfs(root, visit) {
  if (!root) return;
  const queue = [root];

  while (queue.length > 0) {
    const node = queue.shift();    // FIFO: берём из начала
    visit(node);

    if (node.children) {
      for (const child of node.children) {
        queue.push(child);          // в конец очереди
      }
    }
  }
}`,
        },
        { type: 'heading', content: 'Поуровневый BFS (level-order)' },
        {
          type: 'text',
          content:
            'Если нужно знать, **на каком уровне** находится узел, фиксируйте размер очереди в начале каждой итерации. Все узлы текущего уровня обработаются одной партией.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function levelOrder(root) {
  const result = [];
  if (!root) return result;
  const queue = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;     // ✓ зафиксировали границу уровня
    const level = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      level.push(node.value);
      if (node.children) queue.push(...node.children);
    }

    result.push(level);
  }

  return result;
}`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Когда выбирать BFS, а когда DFS. **BFS** — если нужен ближайший ответ (минимальная глубина, кратчайший путь, поуровневый вывод). **DFS** — если нужен любой путь, агрегаты от листьев к корню, или важна простота кода через рекурсию.',
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            '\`Array.prototype.shift\` — O(n): движок сдвигает все элементы. На больших деревьях используйте указатель-голову (\`head++\`) или связный список. На собеседовании \`shift()\` допустим, но упомяните цену вслух.',
        },
      ],
      flashcardIds: ['tr-f6', 'tr-f7'],
      checkpoint: [Q['tree-q3']!],
      docsLink: { url: 'https://ru.algorithmica.org/cs/graph-traversals/', title: 'Обходы графов — ru.algorithmica.org' },
    },

    {
      id: 'iterative-dfs',
      title: 'Итеративный DFS — без рекурсии',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'На вырожденном дереве (цепочке) глубина может быть десятки тысяч. Движок V8 по умолчанию допускает порядка 10–15 тысяч кадров стека — рекурсивный DFS падает с **Maximum call stack size exceeded**. Лекарство — заменить рекурсию на явный стек.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Итеративный pre-order DFS через явный стек
function dfsIterative(root, visit) {
  if (!root) return;
  const stack = [root];

  while (stack.length > 0) {
    const node = stack.pop();           // LIFO: с вершины
    visit(node);

    if (node.children) {
      // Кладём детей в обратном порядке, чтобы первый ребёнок
      // оказался на вершине стека и был обработан первым.
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push(node.children[i]);
      }
    }
  }
}`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Различие между BFS и итеративным DFS — это структура данных контейнера: **очередь** (\`shift\`) даёт BFS, **стек** (\`pop\`) даёт DFS. Алгоритмическая логика — та же.',
        },
        { type: 'heading', content: 'Итеративный in-order для бинарного дерева' },
        {
          type: 'code',
          language: 'javascript',
          content: `function inorderIterative(root) {
  const result = [];
  const stack = [];
  let node = root;

  while (node || stack.length > 0) {
    // 1. Идём максимально влево, складывая узлы в стек
    while (node) {
      stack.push(node);
      node = node.left;
    }
    // 2. Снимаем — это самый левый необработанный узел
    node = stack.pop();
    result.push(node.value);
    // 3. Переходим в правое поддерево
    node = node.right;
  }

  return result;
}`,
        },
        {
          type: 'text',
          content:
            'Этот шаблон встречается в задачах на BST: «найти k-й по величине элемент», «валидировать BST», «итератор по BST». Память — O(h), но без падения стека вызовов.',
        },
      ],
      playground: {
        starterCode: `// Реализуйте итеративный DFS, который не превышает стек на дереве-цепочке.
// Дерево глубины 50_000 — рекурсия упадёт, итерация должна выжить.

function dfsIterative(root) {
  // ваш код: верните массив значений в порядке pre-order
  return [];
}

// Строим цепочку из 5 узлов для проверки корректности
let chain = null;
for (let i = 4; i >= 0; i--) chain = { value: i, children: chain ? [chain] : [] };

console.log(JSON.stringify(dfsIterative(chain)));`,
        expectedOutput: '[0,1,2,3,4]',
        description:
          'Используйте явный стек: \`const stack = [root]\`, в цикле \`pop\` и push детей в обратном порядке. На цепочке pre-order даёт значения от корня к листу: [0, 1, 2, 3, 4].',
      },
      flashcardIds: ['tr-f8'],
    },

    {
      id: 'bst-balance',
      title: 'BST, балансировка и Trie',
      estimatedMinutes: 6,
      blocks: [
        { type: 'heading', content: 'Бинарное дерево поиска (BST)' },
        {
          type: 'text',
          content:
            '**BST** — бинарное дерево, в котором для каждого узла все значения слева **меньше**, а справа **больше**. Это свойство даёт поиск, вставку и удаление за O(h), где h — высота. На сбалансированном BST h = O(log n).',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function bstSearch(node, target) {
  while (node) {
    if (target === node.value) return node;
    node = target < node.value ? node.left : node.right;
  }
  return null;                  // не найдено
}`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Если вставлять в BST уже отсортированные данные, дерево вырождается в цепочку и поиск деградирует до O(n). Это почему в реальных БД и стандартных библиотеках используют **самобалансирующиеся** BST: AVL, Red-Black, B-tree.',
        },
        { type: 'heading', content: 'Балансировка (AVL, Red-Black)' },
        {
          type: 'list',
          content: `- **AVL** — для каждого узла |высота(left) − высота(right)| ≤ 1. Жёсткий баланс, быстрый поиск, но больше ротаций при вставке.
- **Red-Black** — более слабый инвариант через раскраску узлов. Используется в Java \`TreeMap\`, C++ \`std::map\`, V8 для словарных режимов объектов.
- **B-tree** — узел может иметь 2..k детей. Лежит в основе индексов SQL: меньше уровней = меньше дисковых чтений.`,
        },
        { type: 'heading', content: 'Trie — дерево префиксов' },
        {
          type: 'code',
          language: 'javascript',
          content: `// Trie для автодополнения: каждый путь от корня — это строка
class Trie {
  constructor() { this.root = { children: {}, isEnd: false }; }

  insert(word) {
    let node = this.root;
    for (const ch of word) {
      node.children[ch] ??= { children: {}, isEnd: false };
      node = node.children[ch];
    }
    node.isEnd = true;
  }

  startsWith(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children[ch]) return false;
      node = node.children[ch];
    }
    return true;
  }
}`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Поиск в Trie — O(L), где L — длина запроса, **не зависит от размера словаря**. Это делает Trie идеальным для автодополнения, проверки орфографии и поиска по префиксу.',
        },
      ],
      flashcardIds: ['tr-f9', 'tr-f10', 'tr-f11'],
    },

    {
      id: 'lca-and-patterns',
      title: 'LCA и паттерны рекурсии',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            '**Наименьший общий предок** (Lowest Common Ancestor, LCA) двух узлов \`p\` и \`q\` — самый глубокий узел, поддерево которого содержит и \`p\`, и \`q\`. Классическое решение через post-order: каждый узел возвращает «нашёл ли я в своём поддереве \`p\` или \`q\`».',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function lca(root, p, q) {
  if (!root || root === p || root === q) return root;

  const left  = lca(root.left,  p, q);
  const right = lca(root.right, p, q);

  // Нашли по одному в каждом поддереве — текущий узел и есть LCA
  if (left && right) return root;
  // Иначе ответ в той ветке, где что-то нашлось
  return left || right;
}`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Шаблон **«рекурсия post-order с возвратом агрегата»** покрывает огромный класс задач: высота дерева, диаметр, симметричность, сериализация, валидация BST. Идея одна: ребёнок возвращает то, что родителю нужно для своего ответа.',
        },
        { type: 'heading', content: 'Шаблон: build tree из плоского списка' },
        {
          type: 'code',
          language: 'javascript',
          content: `// Из массива {id, parentId} собираем дерево за O(n) через Map
function buildTree(items) {
  const map = new Map();
  for (const item of items) map.set(item.id, { ...item, children: [] });

  let root = null;
  for (const item of items) {
    const node = map.get(item.id);
    if (item.parentId === null) root = node;
    else map.get(item.parentId).children.push(node);
  }
  return root;
}`,
        },
        {
          type: 'text',
          content:
            'Этот паттерн появляется на собеседованиях в формулировках «дерево комментариев из БД», «иерархия категорий», «структура папок». Хеш-таблица превращает наивный O(n²)-поиск родителя в O(1).',
        },
      ],
      flashcardIds: ['tr-f12'],
      checkpoint: [Q['tree-q11']!],
    },

    {
      id: 'pitfalls',
      title: 'Типичные ошибки',
      estimatedMinutes: 4,
      blocks: [
        { type: 'heading', content: 'Забыли проверить наличие children' },
        {
          type: 'code',
          language: 'javascript',
          content: `// АНТИПАТТЕРН: TypeError на листе, у которого нет children
function dfs(node, visit) {
  visit(node);
  for (const child of node.children) {  // ✗ undefined у листа
    dfs(child, visit);
  }
}

// Правильно: явная проверка
function dfsSafe(node, visit) {
  visit(node);
  if (node.children) {
    for (const child of node.children) dfs(child, visit);
  }
}`,
        },
        { type: 'heading', content: 'Рекурсия без терминатора' },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'У бинарного дерева ребёнок может быть \`null\`. Любая рекурсивная функция должна начинаться с \`if (!node) return ...\`. Без этого первый же лист обрушит вызов \`node.left\` с TypeError.',
        },
        { type: 'heading', content: 'Maximum call stack на глубоком дереве' },
        {
          type: 'text',
          content:
            'Цепочка из 50 000 узлов гарантированно уронит рекурсию: V8 разрешает примерно 10–15 тысяч кадров. Решение — итеративный DFS со стеком, как показано в главе 4.',
        },
        { type: 'heading', content: 'Циклы при обходе графа как дерева' },
        {
          type: 'code',
          language: 'javascript',
          content: `// АНТИПАТТЕРН: бесконечная рекурсия, если структура — граф с циклом
function dfsGraph(node, visit) {
  visit(node);
  for (const next of node.neighbors) dfsGraph(next, visit); // ✗ зациклится
}

// Правильно: маркируем посещённые
function dfsGraphSafe(node, visit, seen = new Set()) {
  if (seen.has(node)) return;
  seen.add(node);
  visit(node);
  for (const next of node.neighbors) dfsGraphSafe(next, visit, seen);
}`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'В **дереве** циклов нет по определению, маркировка не нужна. Но если структура пришла из API и содержит обратные ссылки на родителя или дублирующиеся узлы — это уже граф, и без \`Set\` обхода не обойтись.',
        },
      ],
      playground: {
        starterCode: `// Перед вами буггованный код. Найдите ошибку и исправьте.
// На дереве { value: 1 } (без children) код падает с TypeError.

function sumTree(node) {
  let sum = node.value;
  for (const child of node.children) {
    sum += sumTree(child);
  }
  return sum;
}

console.log(sumTree({ value: 1 }));`,
        expectedOutput: '1',
        description:
          'Лист — это узел без поля \`children\`. \`for...of\` по \`undefined\` бросает TypeError. Добавьте \`if (node.children)\` перед циклом.',
      },
      flashcardIds: ['tr-f13'],
    },
  ],

  // Все вопросы из старого квиза, кроме тех, что ушли в checkpoint.
  finalQuiz: treesQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  flashcards: [
    {
      id: 'tr-f1',
      question: 'Что такое дерево и как оно отличается от графа?',
      answer:
        'Дерево — иерархическая структура из n узлов и n − 1 рёбер с одним корнем и без циклов. Между любыми двумя узлами существует ровно один путь. Граф допускает циклы и отсутствие выделенного корня.',
      keyPoints: [
        'Узел (node), корень (root), листья (leaves)',
        'n узлов → n − 1 рёбер, нет циклов',
        'Для обхода графа нужен Set посещённых, для дерева — нет',
      ],
    },
    {
      id: 'tr-f2',
      question: 'Какие виды деревьев чаще всего спрашивают на собеседовании?',
      answer:
        'Бинарное дерево (≤2 детей), BST (поиск за O(h)), сбалансированные AVL/Red-Black, N-ary с массивом children, Trie для префиксов и Heap как реализация приоритетной очереди.',
      keyPoints: [
        'Бинарное и BST — для алгоритмических задач',
        'N-ary — для DOM, JSON, категорий',
        'Trie — для автодополнения, поиска по префиксу',
        'Heap — реализует priority queue',
      ],
    },
    {
      id: 'tr-f3',
      question: 'В чём разница между pre-order, in-order и post-order?',
      answer:
        'Это три порядка обхода бинарного дерева через DFS. Pre-order: корень → лево → право (сериализация, копирование). In-order: лево → корень → право (сортированный вывод BST). Post-order: лево → право → корень (агрегаты снизу вверх, удаление).',
      keyPoints: [
        'Pre-order — посетить корень первым',
        'In-order — посетить корень между поддеревьями',
        'Post-order — посетить корень последним',
        'In-order по BST даёт отсортированный массив',
      ],
      code: `function preorder(n, v) { if (!n) return; v(n); preorder(n.left, v); preorder(n.right, v); }
function inorder (n, v) { if (!n) return; inorder(n.left, v);  v(n); inorder(n.right, v); }
function postorder(n, v) { if (!n) return; postorder(n.left, v); postorder(n.right, v); v(n); }`,
      codeLanguage: 'javascript',
    },
    {
      id: 'tr-f4',
      question: 'Когда выбирать DFS, а когда BFS?',
      answer:
        'DFS — когда нужен любой путь, агрегаты от листьев к корню, или когда естественно использовать рекурсию. BFS — когда нужен ближайший ответ, минимальная глубина, поуровневый вывод или кратчайший путь по числу рёбер.',
      keyPoints: [
        'BFS гарантирует ближайший узел по уровням',
        'DFS проще писать рекурсивно',
        'BFS использует очередь O(w), DFS — стек O(h)',
        '«Минимальное число шагов» = почти всегда BFS',
      ],
    },
    {
      id: 'tr-f5',
      question: 'Какова сложность DFS-обхода и сколько он жрёт памяти?',
      answer:
        'Время — O(n): каждый узел посещается ровно один раз. Дополнительная память — O(h), где h — высота дерева, на стек рекурсии или явный стек. На сбалансированном дереве h = O(log n), на цепочке h = O(n).',
      keyPoints: [
        'Время O(n) для всех вариантов DFS и BFS',
        'Память DFS = O(h), BFS = O(w) (ширина уровня)',
        'На цепочке h = n — рекурсия может уронить стек',
      ],
    },
    {
      id: 'tr-f6',
      question: 'Какая структура данных нужна для BFS и почему?',
      answer:
        'Очередь (FIFO). BFS обходит узлы по уровням: сначала корень, потом все его дети, потом внуки. Чтобы дети текущего уровня обрабатывались после всех узлов предыдущего, нужно класть в конец и забирать из начала — это и есть FIFO.',
      keyPoints: [
        'Очередь = FIFO: push в конец, shift из начала',
        'shift в массиве — O(n); для прода используйте deque',
        'Стек дал бы DFS, очередь — BFS',
      ],
      code: `function bfs(root, visit) {
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    visit(node);
    if (node.children) queue.push(...node.children);
  }
}`,
      codeLanguage: 'javascript',
    },
    {
      id: 'tr-f7',
      question: 'Как сделать поуровневый BFS (level-order)?',
      answer:
        'Перед обработкой уровня зафиксируйте \`levelSize = queue.length\`. Затем извлеките ровно столько узлов из очереди — это все узлы текущего уровня. Дети, добавленные в очередь во время этой партии, относятся к следующему уровню.',
      keyPoints: [
        '`levelSize = queue.length` фиксирует границу уровня',
        'Внутренний for от 0 до levelSize обрабатывает один уровень',
        'Используется для «правый край дерева», «средние значения уровней»',
      ],
    },
    {
      id: 'tr-f8',
      question: 'Как сделать DFS итеративно, без рекурсии?',
      answer:
        'Заведите явный стек, положите в него корень и в цикле вынимайте через pop, складывая детей. Чтобы получить pre-order на n-арном дереве, кладите детей в обратном порядке — тогда первый ребёнок окажется на вершине стека.',
      keyPoints: [
        'Замените стек вызовов на массив-стек',
        'pop = LIFO = DFS',
        'Спасает от Maximum call stack на глубоких деревьях',
        'Детей кладите в обратном порядке для pre-order',
      ],
      code: `function dfs(root, visit) {
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    visit(node);
    if (node.children) {
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push(node.children[i]);
      }
    }
  }
}`,
      codeLanguage: 'javascript',
    },
    {
      id: 'tr-f9',
      question: 'Что такое BST и какие у него инварианты?',
      answer:
        'Binary Search Tree — бинарное дерево, в котором для каждого узла все значения в левом поддереве строго меньше, в правом — строго больше. Это даёт поиск, вставку и удаление за O(h).',
      keyPoints: [
        'left < node < right — для всех потомков, а не только прямых',
        'In-order обход BST → отсортированный массив',
        'Поиск, вставка, удаление: O(h)',
        'Без балансировки h может вырасти до n',
      ],
    },
    {
      id: 'tr-f10',
      question: 'Что такое сбалансированное дерево и зачем нужны AVL/Red-Black?',
      answer:
        'Сбалансированным называют дерево, в котором высота ограничена O(log n). AVL и Red-Black — самобалансирующиеся BST: после вставки/удаления они выполняют ротации, поддерживая инвариант баланса. Без этого вставка отсортированных данных вырождает дерево в цепочку.',
      keyPoints: [
        'AVL: |h(left) − h(right)| ≤ 1, жёсткий баланс',
        'Red-Black: чёрная высота, более слабый баланс, меньше ротаций',
        'Применяются в std::map, TreeMap, ядре Linux',
      ],
    },
    {
      id: 'tr-f11',
      question: 'Что такое Trie и для чего он нужен?',
      answer:
        'Trie (бор, дерево префиксов) — дерево, в котором каждый путь от корня соответствует строке. Узел хранит флаг конца слова и map детей по символам. Поиск, вставка и проверка префикса занимают O(L), где L — длина запроса.',
      keyPoints: [
        'O(L) — не зависит от размера словаря',
        'Применение: автодополнение, проверка орфографии, IP-роутинг',
        'Память пропорциональна суммарной длине строк × алфавит',
      ],
    },
    {
      id: 'tr-f12',
      question: 'Как найти наименьшего общего предка (LCA) двух узлов?',
      answer:
        'Рекурсивно: для каждого узла спуститесь в левое и правое поддерево. Если оба возврата непустые — текущий узел и есть LCA. Иначе ответ — в той ветке, которая нашла хотя бы один из искомых узлов.',
      keyPoints: [
        'Post-order рекурсия с возвратом агрегата',
        'База: null или совпадение с p или q',
        'Если left && right → текущий узел = LCA',
        'Сложность O(n), память O(h) на стек',
      ],
      code: `function lca(root, p, q) {
  if (!root || root === p || root === q) return root;
  const left  = lca(root.left,  p, q);
  const right = lca(root.right, p, q);
  if (left && right) return root;
  return left || right;
}`,
      codeLanguage: 'javascript',
    },
    {
      id: 'tr-f13',
      question: 'Какие типичные ошибки случаются при обходе деревьев?',
      answer:
        'Не проверить наличие children и упасть на листе с TypeError. Забыть базовый случай в рекурсии. Превысить стек на глубоком дереве. Перепутать DFS и BFS, когда задача требует именно ближайший узел. Запустить DFS на графе без Set посещённых.',
      keyPoints: [
        '`if (node.children)` перед циклом — must',
        'Базовый случай `if (!node) return` для бинарного дерева',
        'Глубина >10_000 → итеративный обход',
        'Цикл в данных → Set seen',
      ],
    },
  ],

  cheatsheet: `### Шпаргалка по обходу деревьев

- **Узел**: \`{ value, children: [...] }\` или \`{ value, left, right }\`.
- **DFS** (стек/рекурсия): pre/in/post-order. Время O(n), память O(h).
- **BFS** (очередь): уровни. Время O(n), память O(w) — ширина уровня.
- **Pre-order**: корень → лево → право. Сериализация, копирование.
- **In-order**: лево → корень → право. Сортированный вывод BST.
- **Post-order**: лево → право → корень. Агрегаты, удаление, LCA.
- **BFS-шаблон**: \`while (queue.length) { node = queue.shift(); visit; push детей }\`.
- **Итеративный DFS**: явный стек спасает от Maximum call stack.
- **BST**: left < node < right, поиск O(h). Без баланса h → n.
- **Trie**: O(L) на запрос, не зависит от размера словаря.
- **LCA**: post-order с возвратом «нашёл ли p/q».
- **Граф ≠ дерево**: добавьте \`Set seen\`, иначе DFS зациклится.`,

  interviewQA: [
    {
      id: 'tr-iq1',
      question: 'DFS vs BFS: когда что выбрать?',
      shortAnswer:
        'BFS — когда нужен ближайший узел или поуровневая обработка (минимальная глубина, кратчайший путь по рёбрам). DFS — когда нужен любой путь, агрегаты от листьев к корню или когда удобнее писать рекурсивно.',
      fullAnswer: `Оба алгоритма посещают каждый узел ровно один раз и работают за O(n). Различаются они в **порядке** обхода и в **памяти**.

**Сигналы выбрать BFS.**
- В формулировке есть «минимальное число шагов», «ближайший», «по уровням», «кратчайший».
- Нужен поуровневый агрегат: средние значения уровней, правый край дерева, zigzag-обход.
- Дерево очень глубокое и сравнительно узкое — память O(w) меньше, чем O(h).

**Сигналы выбрать DFS.**
- Нужно посчитать что-то «снизу вверх»: высоту, размер, диаметр, валидность BST.
- Нужен любой путь от корня до листа (а не самый короткий).
- Структура задачи естественно рекурсивна — например, матчинг шаблонов в AST.
- Дерево широкое, но не глубокое — память O(h) меньше, чем O(w) у BFS.

**По памяти.** DFS хранит O(h) кадров стека (явного или через рекурсию), где h — высота. BFS хранит O(w) узлов в очереди, где w — максимальная ширина уровня. На сбалансированном дереве w ≈ n / 2 на последнем уровне — BFS может оказаться **дороже** по памяти, чем DFS.

**Корректность LeetCode-формулировок.** «Find shortest path in unweighted graph» — BFS. «Find any path that sums to K» — DFS. «Level-order serialize a tree» — BFS. «Validate BST» — DFS in-order.`,
      followUps: [
        'Что произойдёт с памятью BFS на полном бинарном дереве высотой 20?',
        'Можно ли решить задачу «минимальная глубина дерева» через DFS, и стоит ли?',
      ],
      relatedChapterId: 'bfs',
    },
    {
      id: 'tr-iq2',
      question: 'Чем отличаются pre-order, in-order и post-order? Где они применяются?',
      shortAnswer:
        'Это три способа упорядочить визит корня относительно поддеревьев в DFS. Pre-order — корень первый (сериализация, копирование). In-order — корень между поддеревьями, на BST даёт сортированный массив. Post-order — корень последним, для агрегатов снизу вверх и для удаления.',
      fullAnswer: `Все три обхода — это варианты DFS бинарного дерева, отличающиеся **моментом посещения** корня:

\`\`\`js
function preorder (n, v) { if (!n) return; v(n);                preorder(n.left,v); preorder(n.right,v); }
function inorder  (n, v) { if (!n) return; inorder(n.left,v);   v(n);               inorder(n.right,v);  }
function postorder(n, v) { if (!n) return; postorder(n.left,v); postorder(n.right,v); v(n); }
\`\`\`

**Pre-order.** Корень посещается до спуска. Применения:
- Сериализация дерева (LeetCode 297) — корень первым, чтобы при десериализации сразу знать структуру.
- Глубокое копирование дерева — создаём текущий узел, потом рекурсивно его дети.
- Отображение иерархии (например, рендер дерева категорий).

**In-order.** Корень между поддеревьями. Применения:
- Вывод BST в **отсортированном** порядке — это его определяющее свойство.
- «Найти k-й по величине элемент BST» — итеративный in-order до k-го извлечения.
- Валидация BST — соседние значения в in-order должны идти строго возрастающе.

**Post-order.** Корень в самом конце. Применения:
- Удаление дерева (сначала освободить детей, потом узел).
- Подсчёт высоты, диаметра, размера — родитель использует уже посчитанные значения детей.
- LCA через возврат «нашёл ли я p/q в своём поддереве».
- Вычисление выражений по AST: операнды раньше оператора.

**Для n-арного дерева** существуют только pre-order и post-order — in-order требует ровно двух поддеревьев.`,
      followUps: [
        'Как восстановить бинарное дерево по парам pre-order + in-order?',
        'Почему по одному pre-order восстановить дерево нельзя?',
      ],
      relatedChapterId: 'dfs',
    },
    {
      id: 'tr-iq3',
      question: 'Как обойти бинарное дерево итеративно, без рекурсии? Зачем это нужно?',
      shortAnswer:
        'Заведите явный стек, положите туда корень и в цикле вынимайте через pop, добавляя детей. Это спасает от Maximum call stack на дереве-цепочке глубиной десятки тысяч узлов, где V8 ограничивает стек вызовов 10–15 тысячами кадров.',
      fullAnswer: `Рекурсивная реализация DFS использует **стек вызовов** движка. На сбалансированном дереве из 10⁶ узлов глубина около 20 — это безопасно. Но если дерево вырождено в цепочку (вставляли отсортированные данные в BST без балансировки, или входные данные пришли из API в виде линейного списка), глубина может быть равна числу узлов, и движок выбросит **Maximum call stack size exceeded** уже на 10–15 тысячах.

Решение — заменить стек вызовов на явный массив-стек:

\`\`\`js
function dfsIterative(root, visit) {
  if (!root) return;
  const stack = [root];

  while (stack.length > 0) {
    const node = stack.pop();
    visit(node);
    if (node.right) stack.push(node.right);
    if (node.left)  stack.push(node.left);   // ← левый сверху → пойдёт первым
  }
}
\`\`\`

**Порядок push.** Стек — LIFO, поэтому, чтобы получить pre-order (левый ребёнок раньше правого), сначала кладём правого, потом левого. Левый окажется на вершине и будет вынут первым.

**In-order итеративно.** Сложнее: нужно «дойти до самого левого» через push в стек, потом снимать и переходить в правое поддерево. Этот шаблон используется как итератор по BST.

**Сложность.** Время O(n), память O(h) — но теперь куча, а не стек вызовов. Куча в V8 — порядка гигабайтов, легко выдерживает миллионы узлов.

**Когда оставить рекурсию.** Если высота гарантированно мала (АВЛ, B-tree глубиной 4–5 для миллионов записей) — рекурсивный код проще читается и пишется. Итеративный шаблон применяют, когда есть риск глубокого дерева или когда нужен полный контроль над состоянием обхода (например, lazy-итератор).`,
      followUps: [
        'Сколько примерно кадров стека вызовов разрешает V8 по умолчанию?',
        'Почему `tail call optimization` в Node.js не спасает рекурсивный DFS?',
      ],
      relatedChapterId: 'iterative-dfs',
    },
    {
      id: 'tr-iq4',
      question: 'Что такое сбалансированное дерево? Почему AVL и Red-Black поддерживают баланс?',
      shortAnswer:
        'Сбалансированное дерево гарантирует высоту O(log n) — поэтому поиск, вставка и удаление работают за O(log n). AVL и Red-Black после каждой модификации делают ротации, восстанавливая инвариант баланса; без этого вставка отсортированных данных вырождает BST в цепочку с O(n).',
      fullAnswer: `**Проблема несбалансированного BST.** Если вставить элементы в порядке 1, 2, 3, ..., n, дерево превратится в линейную цепочку из правых детей. Поиск элемента n в такой цепочке — O(n), и преимущество BST исчезает.

**Сбалансированное дерево** — то, у которого высота h = O(log n) при любом порядке вставок и удалений. Это достигается **ротациями** — локальной перестройкой узлов, сохраняющей инвариант BST.

**AVL (Адельсон-Вельский, Ландис, 1962).** Для каждого узла |h(left) − h(right)| ≤ 1. После вставки или удаления алгоритм поднимается от изменённого узла к корню и при нарушении баланса делает левую, правую или двойную ротацию. Высота строго ограничена ≈ 1.44 · log₂(n + 2). Поиск чуть быстрее Red-Black, но ротаций больше.

**Red-Black tree.** Каждый узел красный или чёрный, выполняются 5 правил: корень чёрный, листья (NIL) чёрные, у красного узла оба ребёнка чёрные, на любом пути от узла до листа равное число чёрных узлов, новый узел красный. Эти правила гарантируют высоту ≤ 2 · log₂(n + 1). Менее жёсткий баланс → меньше ротаций при модификации, но поиск чуть медленнее AVL.

**Где используется.**
- C++ \`std::map\` и \`std::set\` — Red-Black.
- Java \`TreeMap\` — Red-Black.
- Linux kernel: планировщик процессов CFS, \`epoll\` — Red-Black.
- B-tree (обобщение с k-арными узлами) — индексы PostgreSQL, MySQL, файловые системы.

**В JavaScript.** Стандартный \`Map\` в V8 — это хеш-таблица, не дерево. Сбалансированных деревьев в стандартной библиотеке JS нет; реализуют вручную или берут npm-пакеты, когда нужен упорядоченный словарь.`,
      followUps: [
        'Чем B-tree отличается от Red-Black и почему он лучше подходит для дисковых индексов?',
        'Сколько ротаций в худшем случае требуется при вставке в AVL?',
      ],
      relatedChapterId: 'bst-balance',
    },
    {
      id: 'tr-iq5',
      question: 'Чем дерево отличается от графа? Как это влияет на алгоритм обхода?',
      shortAnswer:
        'Дерево — связный ациклический граф с n узлами и n − 1 рёбрами и одним корнем. В графе допустимы циклы, и при обходе нужно отмечать посещённые узлы (Set), иначе DFS/BFS уйдёт в бесконечную рекурсию.',
      fullAnswer: `**Формальные отличия.**

| Свойство | Дерево | Граф |
|---|---|---|
| Циклы | Нет | Возможны |
| Корень | Один выделенный | Не определён |
| Число рёбер | Ровно n − 1 | От 0 до n(n − 1) / 2 |
| Путь между двумя узлами | Уникален | Может быть несколько |
| Направление | Обычно от родителя к ребёнку | Может быть направлен или нет |

**Влияние на обход.** В дереве DFS без проверки «уже посещён» работает корректно — невозможно вернуться в посещённый узел, не пройдя по уже использованному ребру дважды. В графе нужен \`Set\` посещённых:

\`\`\`js
function dfsTree(node, visit) {
  visit(node);
  for (const child of node.children) dfsTree(child, visit);   // безопасно
}

function dfsGraph(node, visit, seen = new Set()) {
  if (seen.has(node)) return;                                  // ✓ обязательно
  seen.add(node);
  visit(node);
  for (const next of node.neighbors) dfsGraph(next, visit, seen);
}
\`\`\`

**Подвохи на интервью.**
- API возвращает «дерево комментариев», но в данных есть \`parentId\`, ссылающийся на потомка → это уже граф с циклом.
- DOM «дерево» содержит \`parentNode\` — обратная ссылка делает структуру графом, и наивный обход обоих \`children\` и \`parentNode\` зациклится.
- Объект с круговыми ссылками (\`a.b = a\`) при сериализации в JSON падает с TypeError. Это сигнал, что структура — граф.

**Если не уверены, дерево перед вами или граф** — добавьте \`Set seen\` на всякий случай. Лишняя проверка стоит копейки и страхует от бесконечной рекурсии.`,
      followUps: [
        'Как формально доказать, что в дереве из n узлов ровно n − 1 рёбер?',
        'Когда DAG (ориентированный ациклический граф) можно обойти как дерево?',
      ],
      relatedChapterId: 'pitfalls',
    },
    {
      id: 'tr-iq6',
      question: 'Как найти наименьшего общего предка двух узлов в бинарном дереве за O(n)?',
      shortAnswer:
        'Рекурсивно: если корень — null, p или q, верните корень. Иначе спуститесь в оба поддерева. Если оба возврата непустые — текущий узел и есть LCA. Иначе ответ в той ветке, где что-то нашлось.',
      fullAnswer: `\`\`\`js
function lca(root, p, q) {
  if (!root || root === p || root === q) return root;

  const left  = lca(root.left,  p, q);
  const right = lca(root.right, p, q);

  if (left && right) return root;   // p и q в разных поддеревьях
  return left || right;             // оба нашлись с одной стороны
}
\`\`\`

**Идея.** Каждый рекурсивный вызов возвращает один из:
- \`null\` — в этом поддереве нет ни p, ни q;
- сам p или q — найден один из них;
- LCA — узел, под которым находятся оба.

**Корректность по случаям.**
1. Если левый возврат непустой и правый непустой — значит, p и q находятся в разных поддеревьях текущего узла. Текущий узел — их ближайший общий предок.
2. Если непустой только левый — оба узла (или ближайший к ним предок) находятся слева. Возвращаем найденный ответ выше.
3. Аналогично для правого.

**Сложность.**
- Время: O(n). Каждый узел посещается ровно один раз.
- Память: O(h) на стек рекурсии.

**Особый случай BST.** Если дерево — BST, существует более простой алгоритм за O(h) без полного обхода: спускайтесь от корня, и пока оба значения p и q лежат строго слева — иди влево, оба строго справа — иди вправо; иначе текущий узел и есть LCA.

**Где встречается на практике.**
- Git: \`git merge-base\` для двух коммитов — это LCA в DAG истории.
- Файловые системы: общий родительский каталог двух файлов.
- DOM: ближайший общий предок двух элементов для определения области события.`,
      followUps: [
        'Как найти LCA в дереве с произвольным числом детей?',
        'Можно ли решить LCA быстрее, чем O(n), при предобработке за O(n)?',
      ],
      relatedChapterId: 'lca-and-patterns',
    },
  ],

  nextTopics: [
    {
      slug: 'hash-map',
      reason:
        'Хеш-таблица — постоянный спутник деревьев: Map для отслеживания посещённых при обходе графа, Map для построения дерева из плоского массива {id, parentId} за O(n).',
    },
    {
      slug: 'stacks-queues',
      reason:
        'Стеки и очереди — «двигатели» итеративных DFS и BFS. После деревьев логично закрепить, как они устроены под капотом и где ещё применяются.',
    },
  ],

  related: [
    { kind: 'pattern', id: 'recursion', label: 'Шаблон: рекурсия с агрегатом снизу вверх' },
    { kind: 'pitfall', id: 'stack-overflow', label: 'Maximum call stack: когда рекурсия падает на глубоком дереве' },
  ],
};
