import type { Lesson } from '../../types/lesson';
import { treesQuiz } from '../quizzes/trees';

const Q = Object.fromEntries(treesQuiz.questions.map((q) => [q.id, q]));

// Чекпоинт-вопросы из квиза. Не должны попадать в finalQuiz.
const CHECKPOINT_IDS = new Set(['tree-q2', 'tree-q3', 'tree-q6', 'tree-q8', 'tree-q11']);

export const treesLesson: Lesson = {
  topicId: 'trees',

  intro: {
    whyItMatters: `Дерево — иерархическая структура из узлов, у которой есть ровно один корень и нет циклов. С деревьями работает почти любой код: DOM в браузере, Virtual DOM в React, AST в компиляторе, JSON с вложенностью, файловая система — всё это деревья.

На собеседованиях деревья проверяют умение работать с рекурсией и понимание двух стратегий обхода: DFS (в глубину, через стек или рекурсию) и BFS (в ширину, через очередь). Сложность обхода — O(n) по времени и O(h) по памяти на стек рекурсии, где h — высота дерева. На сбалансированном дереве h = O(log n), на вырожденном — O(n).`,
    estimatedMinutes: 32,
    interviewAngle:
      'Интервьюера интересует обоснованный выбор стратегии (DFS или BFS), типа DFS (pre-order, in-order, post-order) и формы реализации (рекурсия или итерация со стеком) — исходя из условия задачи и ограничений по глубине.',
    prerequisites: [{ slug: 'stacks-queues', title: 'Стеки и очереди' }],
  },

  chapters: [
    // ─────────────────────────────────────────────────────────────
    {
      id: 'what-is-tree',
      title: 'Что такое дерево',
      estimatedMinutes: 4,
      blocks: [
        {
          type: 'text',
          content:
            '**Дерево** — иерархическая структура из узлов. У каждого узла есть значение и ссылки на дочерние узлы. **Корень** — единственный узел без родителя, **листья** — узлы без детей. Между любыми двумя узлами существует ровно один путь — этим дерево отличается от графа.',
        },
        {
          type: 'visualization',
          content: '',
          vizId: 'trees',
        },
        { type: 'heading', content: 'Виды деревьев' },
        {
          type: 'list',
          content: `**Бинарное дерево** — у каждого узла не более двух детей (\`left\` и \`right\`).
**Бинарное дерево поиска (BST)** — все значения в левом поддереве меньше узла, в правом — больше.
**Сбалансированное дерево** (AVL, Red-Black) — высоты поддеревьев отличаются не более чем на 1, операции выполняются за O(log n).
**N-ary tree** — у узла произвольное число детей в массиве \`children\`. Частая форма на фронтенд-собеседованиях.
**Trie (бор)** — дерево префиксов: каждый путь от корня — это строка. Используется для автодополнения.
**Heap** — частично упорядоченное бинарное дерево, реализация приоритетной очереди.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Типовая форма n-ary дерева
const tree = {
  type: 'folder',
  children: [
    { type: 'file', name: 'index.ts' },
    {
      type: 'folder',
      children: [
        { type: 'file', name: 'utils.ts' },
        { type: 'file', name: 'config.ts' },
      ],
    },
  ],
};`,
        },
      ],
      checkpoint: [Q['tree-q2']!, {
        type: 'match-pairs',
        id: 'tree-mp1',
        description: 'Сопоставьте вид дерева с его свойством',
        pairs: [
          { left: 'BST', right: 'Левое поддерево < узла, правое > узла' },
          { left: 'AVL / Red-Black', right: 'Сбалансировано, операции за O(log n)' },
          { left: 'Trie', right: 'Хранит строки по префиксам' },
          { left: 'Heap', right: 'Частично упорядоченное, реализует приоритетную очередь' },
        ],
        explanation:
          'BST даёт быстрый поиск только когда сбалансировано — иначе деградирует до O(n). Trie экономит память на общих префиксах. Heap не сортирует элементы полностью, а гарантирует минимум или максимум на вершине за O(1).',
      }],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'dfs',
      title: 'Обход в глубину (DFS)',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            '**DFS** (Depth-First Search) идёт вглубь как можно дальше, прежде чем повернуть назад. Естественно реализуется рекурсией — каждый рекурсивный вызов использует системный стек. Можно также написать итеративно через явный стек.',
        },
        {
          type: 'visualization',
          content: '',
          vizId: 'dfs',
        },
        { type: 'heading', content: 'Три порядка DFS' },
        {
          type: 'list',
          content: `**Pre-order** (корень → левое → правое): сначала узел, потом поддеревья. Применяется для копирования дерева, сериализации, печати с отступами.
**In-order** (левое → корень → правое): для BST даёт элементы в отсортированном порядке.
**Post-order** (левое → правое → корень): сначала поддеревья, потом узел. Применяется для удаления и для подсчётов снизу вверх (высота, размер, проверка балансировки).`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function preOrder(node) {
  if (!node) return;
  visit(node);              // 1. обработать узел
  preOrder(node.left);      // 2. левое поддерево
  preOrder(node.right);     // 3. правое поддерево
}

function inOrder(node) {
  if (!node) return;
  inOrder(node.left);
  visit(node);
  inOrder(node.right);
}

function postOrder(node) {
  if (!node) return;
  postOrder(node.left);
  postOrder(node.right);
  visit(node);
}`,
        },
        { type: 'heading', content: 'Итеративный DFS на явном стеке' },
        {
          type: 'text',
          content:
            'Рекурсивный DFS использует системный стек вызовов, у которого в JavaScript-движках лимит ~10⁴ кадров. На глубоком дереве будет \`RangeError: Maximum call stack size exceeded\`. Решение — итеративная версия на явном стеке.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function dfsIterative(root) {
  if (!root) return;
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    visit(node);
    // правое кладём раньше — оно достанется позже,
    // левое окажется наверху и будет обработано первым
    if (node.right) stack.push(node.right);
    if (node.left)  stack.push(node.left);
  }
}`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Сложность DFS — O(n) по времени, O(h) по памяти, где h — высота дерева. На сбалансированном дереве h = O(log n), на вырожденном (цепочке) h = O(n).',
        },
      ],
      checkpoint: [Q['tree-q3']!, Q['tree-q6']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'bfs',
      title: 'Обход в ширину (BFS)',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            '**BFS** (Breadth-First Search) обходит дерево уровень за уровнем. Реализуется через очередь: достаём узел, обрабатываем, добавляем детей в конец очереди. Применяется, когда нужен ближайший ответ или поуровневая обработка.',
        },
        {
          type: 'visualization',
          content: '',
          vizId: 'bfs',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function bfs(root) {
  if (!root) return;
  const queue = [root];
  let head = 0;
  while (head < queue.length) {
    const node = queue[head++];
    visit(node);
    if (node.left)  queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
}`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Использование \`queue.shift()\` вместо указателя головы даёт O(n²) на больших деревьях, потому что каждый \`shift\` сдвигает все оставшиеся элементы. Для боевого кода берётся указатель головы или двусвязный список.',
        },
        { type: 'heading', content: 'Level-order: обработка по уровням' },
        {
          type: 'text',
          content:
            'Если нужно знать, на каком уровне находится узел (или вернуть узлы сгруппированными по уровням), удобно обрабатывать очередь «слоями»: на каждой итерации внешнего цикла обрабатывается ровно одна порция, равная текущему размеру очереди.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length) {
    const level = [];
    const size = queue.length;          // фиксируем размер уровня
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left)  queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'BFS гарантирует обход в порядке возрастания глубины. Поэтому для задачи «найдите минимальную глубину» он останавливается сразу при первом листе — это O(n) в худшем случае, но часто работает быстрее DFS, если ответ близко к корню.',
        },
      ],
      checkpoint: [Q['tree-q8']!, {
        type: 'match-pairs',
        id: 'tree-mp2',
        description: 'Когда применять DFS, а когда BFS',
        pairs: [
          { left: 'DFS pre-order', right: 'Сериализация, копирование дерева' },
          { left: 'DFS in-order', right: 'Вывод BST в отсортированном порядке' },
          { left: 'DFS post-order', right: 'Подсчёт снизу вверх (высота, размер)' },
          { left: 'BFS', right: 'Минимальная глубина, level-order, кратчайший путь' },
        ],
        explanation:
          'Выбор стратегии диктуется задачей. Если ответ зависит от поддеревьев — нужен post-order. Если важен порядок глубины — BFS. Если нужно отсортировать BST — in-order.',
      }],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'typical-tasks',
      title: 'Типовые задачи на дереве',
      estimatedMinutes: 6,
      blocks: [
        { type: 'heading', content: 'Глубина дерева' },
        {
          type: 'text',
          content:
            'Высота (глубина) дерева — длина самого длинного пути от корня до листа. Решается post-order: сначала считаем высоту левого и правого поддеревьев, потом возвращаем максимум плюс единица.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
        },
        { type: 'heading', content: 'Проверка симметрии' },
        {
          type: 'code',
          language: 'javascript',
          content: `function isSymmetric(root) {
  function mirror(a, b) {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return a.val === b.val
      && mirror(a.left, b.right)
      && mirror(a.right, b.left);
  }
  return !root || mirror(root.left, root.right);
}`,
        },
        { type: 'heading', content: 'Поиск в BST' },
        {
          type: 'text',
          content:
            'В бинарном дереве поиска работает классический бинарный поиск: если искомое значение меньше узла — идём в левое поддерево, иначе — в правое. Сложность — O(h): O(log n) на сбалансированном дереве, O(n) на вырожденном.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function searchBST(node, target) {
  while (node) {
    if (node.val === target) return node;
    node = target < node.val ? node.left : node.right;
  }
  return null;
}`,
        },
        { type: 'heading', content: 'Наименьший общий предок (LCA)' },
        {
          type: 'text',
          content:
            'LCA — самый глубокий узел, который содержит p и q в своих поддеревьях. Для произвольного бинарного дерева решается рекурсивно за O(n): идём вниз, возвращаем найденный узел; если узел находит и левого, и правого — он и есть LCA.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;
  const left  = lowestCommonAncestor(root.left,  p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left && right) return root;
  return left ?? right;
}`,
        },
      ],
      checkpoint: [Q['tree-q11']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'pitfalls',
      title: 'Подводные камни',
      estimatedMinutes: 5,
      blocks: [
        { type: 'heading', content: 'Переполнение стека вызовов' },
        {
          type: 'text',
          content:
            'JavaScript-движки ограничивают глубину рекурсии (~10⁴ кадров). На дереве, которое выродилось в цепочку (например, отсортированный массив, построенный как BST без балансировки), рекурсивный обход упадёт с \`RangeError: Maximum call stack size exceeded\`.',
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Защита — итеративный обход через явный стек. Память выделяется в куче, лимита нет. Также помогает «хвостовая рекурсия», но V8 её не оптимизирует — рассчитывать на это нельзя.',
        },
        { type: 'heading', content: 'Array.shift в BFS' },
        {
          type: 'text',
          content:
            'Стандартный \`queue.shift()\` стоит O(n) — на больших деревьях BFS превращается в O(n²). Решение — указатель головы или двусвязный список.',
        },
        { type: 'heading', content: 'Проверка BST через локальные сравнения' },
        {
          type: 'code',
          language: 'javascript',
          content: `// АНТИПАТТЕРН: проверка только с непосредственными детьми
function isBST(node) {
  if (!node) return true;
  if (node.left  && node.left.val  >= node.val) return false;
  if (node.right && node.right.val <= node.val) return false;
  return isBST(node.left) && isBST(node.right);
}
// Для дерева 10 → (5, 15 → (6, 20)) пройдёт проверку,
// хотя 6 < 10 и должен быть в левом поддереве.`,
        },
        {
          type: 'text',
          content:
            'Правильная проверка — рекурсивная с диапазоном допустимых значений: каждый узел должен лежать в (lo, hi), и эти границы сужаются при спуске.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function isValidBST(root, lo = -Infinity, hi = Infinity) {
  if (!root) return true;
  if (root.val <= lo || root.val >= hi) return false;
  return isValidBST(root.left,  lo, root.val)
      && isValidBST(root.right, root.val, hi);
}`,
        },
        { type: 'heading', content: 'Циклы в «дереве», полученном извне' },
        {
          type: 'text',
          content:
            'Если структура пришла из внешнего источника (распарсенный JSON, граф с пометкой «дерево»), стоит проверять отсутствие циклов перед рекурсивным обходом. Иначе обход уйдёт в бесконечный цикл и положит процесс. Простая защита — \`Set\` посещённых узлов.',
        },
      ],
    },
  ],

  finalQuiz: treesQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  cheatsheet: `### Шпаргалка по деревьям

**Когда применять**
- DFS: задачи, где ответ зависит от поддеревьев (высота, копирование, post-order вычисления)
- BFS: минимальная глубина, level-order обход, ближайший узел с условием
- In-order на BST: отсортированный обход

**Сложность**
- Обход: O(n) по времени
- Память: O(h) на рекурсию или O(w) на BFS-очередь (w — ширина уровня)
- На сбалансированном дереве: h = O(log n)
- На вырожденном: h = O(n) → риск переполнения стека

**DFS рекурсивно**
\`\`\`js
function dfs(node) {
  if (!node) return;
  // pre-order:  visit здесь
  dfs(node.left);
  // in-order:   visit здесь
  dfs(node.right);
  // post-order: visit здесь
}
\`\`\`

**DFS итеративно через стек**
\`\`\`js
const stack = [root];
while (stack.length) {
  const node = stack.pop();
  visit(node);
  if (node.right) stack.push(node.right);
  if (node.left)  stack.push(node.left);
}
\`\`\`

**BFS через очередь**
\`\`\`js
const queue = [root];
let head = 0;                    // указатель головы вместо shift
while (head < queue.length) {
  const node = queue[head++];
  visit(node);
  if (node.left)  queue.push(node.left);
  if (node.right) queue.push(node.right);
}
\`\`\`

**Level-order по слоям**
\`\`\`js
while (queue.length) {
  const size = queue.length;     // фиксируем размер уровня
  for (let i = 0; i < size; i++) {
    const node = queue.shift();
    // обработка node на текущем уровне
  }
}
\`\`\`

**Подводные камни**
- Переполнение стека вызовов на глубоких деревьях → итеративная версия
- \`queue.shift()\` стоит O(n) → указатель головы
- Локальная проверка BST неверна — нужна с диапазоном (lo, hi)
- Циклы во внешних данных → \`Set\` посещённых узлов`,

  nextTopics: [
    {
      slug: 'hash-map',
      reason:
        'Хеш-таблицы часто используются вместе с обходом дерева: маркировка посещённых узлов, кэширование поддеревьев, индексация значений.',
    },
    {
      slug: 'sliding-window',
      reason:
        'После деревьев и хеш-таблиц логично перейти к окнам — третий частый паттерн на собеседованиях.',
    },
  ],
};
