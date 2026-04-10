import type { TopicTheory } from '../../types/topic';

export const treesTheory: TopicTheory = {
  topicId: 'trees',
  sections: [
    {
      title: 'Что такое дерево',
      blocks: [
        {
          type: 'text',
          content:
            'Дерево — это иерархическая структура данных, состоящая из узлов (нод). Каждый узел может содержать значение и ссылки на дочерние узлы (children). Узел без родителя — корень (root), узлы без детей — листья (leaves).',
        },
        {
          type: 'text',
          content:
            'На собеседованиях деревья часто встречаются в виде вложенных объектов — например, дерево категорий, иерархия комментариев, DOM-дерево, JSON-структуры с произвольной вложенностью.',
        },
        {
          type: 'visualization',
          content: '',
          vizId: 'trees',
        },
        {
          type: 'code',
          content: `// Типичная структура дерева на собеседовании
const tree = {
  type: "nested",
  children: [
    { type: "added", value: 42 },
    {
      type: "nested",
      children: [
        { type: "added", value: 43 },
      ],
    },
    { type: "added", value: 44 },
  ],
};`,
          language: 'javascript',
        },
        {
          type: 'callout',
          content:
            'На фронтенд-собеседованиях деревья обычно представлены как вложенные JS-объекты с полем children, а не как классические бинарные деревья с left/right.',
          calloutType: 'info',
        },
      ],
    },
    {
      title: 'DFS — обход в глубину',
      blocks: [
        {
          type: 'text',
          content:
            'DFS (Depth-First Search) — обход, при котором мы идём как можно глубже по каждой ветке, прежде чем вернуться назад. Реализуется через рекурсию или стек.',
        },
        {
          type: 'text',
          content: 'Три варианта DFS для бинарных деревьев:',
        },
        {
          type: 'list',
          content:
            'Pre-order (прямой): корень → левое → правое — используется для копирования дерева\nIn-order (центральный): левое → корень → правое — даёт отсортированный порядок в BST\nPost-order (обратный): левое → правое → корень — используется для удаления дерева',
        },
        {
          type: 'text',
          content: 'Для деревьев с произвольным количеством детей (как на собесе) используем рекурсивный обход:',
        },
        {
          type: 'code',
          content: `// Рекурсивный DFS для дерева с children
function dfs(node, callback) {
  callback(node); // обрабатываем текущий узел

  if (node.children) {
    for (const child of node.children) {
      dfs(child, callback); // рекурсивно обходим детей
    }
  }
}

// Пример: собрать все значения
const values = [];
dfs(tree, (node) => {
  if (node.value !== undefined) {
    values.push(node.value);
  }
});`,
          language: 'javascript',
        },
        {
          type: 'text',
          content: 'DFS через стек (итеративно):',
        },
        {
          type: 'code',
          content: `function dfsIterative(root, callback) {
  const stack = [root];

  while (stack.length > 0) {
    const node = stack.pop();
    callback(node);

    if (node.children) {
      // Добавляем в обратном порядке, чтобы
      // первый ребёнок оказался на вершине стека
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push(node.children[i]);
      }
    }
  }
}`,
          language: 'javascript',
        },
      ],
    },
    {
      title: 'BFS — обход в ширину',
      blocks: [
        {
          type: 'text',
          content:
            'BFS (Breadth-First Search) — обход по уровням: сначала все узлы на глубине 0, потом на глубине 1 и т.д. Реализуется через очередь.',
        },
        {
          type: 'code',
          content: `function bfs(root, callback) {
  const queue = [root];

  while (queue.length > 0) {
    const node = queue.shift(); // берём первый элемент
    callback(node);

    if (node.children) {
      for (const child of node.children) {
        queue.push(child); // добавляем детей в конец
      }
    }
  }
}`,
          language: 'javascript',
        },
        {
          type: 'callout',
          content:
            'queue.shift() — O(n) операция в JS. Для продакшн-кода используйте связный список. Но на собеседовании shift() вполне допустим — интервьюер это понимает.',
          calloutType: 'tip',
        },
      ],
    },
    {
      title: 'Паттерн: фильтрация узлов по условию',
      blocks: [
        {
          type: 'text',
          content:
            'Частая задача на собеседованиях — найти/собрать все узлы, удовлетворяющие условию. Это базовый паттерн DFS + аккумулятор:',
        },
        {
          type: 'code',
          content: `function getNodes(tree, type) {
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
          language: 'javascript',
        },
        {
          type: 'text',
          content: 'Этот паттерн применим к огромному количеству задач:',
        },
        {
          type: 'list',
          content:
            'Найти все элементы с определённым типом/свойством\nПосчитать сумму всех значений в дереве\nНайти максимальную глубину вложенности\nПреобразовать дерево в плоский массив (flatten)\nНайти путь от корня до конкретного узла',
        },
      ],
    },
    {
      title: 'Когда применять',
      blocks: [
        {
          type: 'list',
          content:
            'Вложенные объекты с children / nodes / items\nИерархические данные (категории, комментарии, файловая система)\nDOM-манипуляции (обход дочерних элементов)\nJSON с произвольной глубиной вложенности\nСлова «обойти», «найти все», «собрать», «глубина»',
        },
        {
          type: 'callout',
          content:
            'Если в задаче есть слово "вложенность" или "children" — это почти наверняка задача на обход дерева.',
          calloutType: 'tip',
        },
      ],
    },
    {
      title: 'Типичные ошибки',
      blocks: [
        {
          type: 'callout',
          content:
            'Забыть проверить наличие children перед обходом. Если у листового узла нет поля children — for...of на undefined вызовет ошибку.',
          calloutType: 'warning',
        },
        {
          type: 'callout',
          content:
            'Не обрабатывать корневой узел. Рекурсия должна начинаться с самого корня, а не сразу с children.',
          calloutType: 'warning',
        },
        {
          type: 'callout',
          content:
            'Путать DFS и BFS. Если порядок обхода важен (например, "в порядке следования"), DFS и BFS могут давать разный результат. На собеседовании уточните, какой порядок нужен.',
          calloutType: 'warning',
        },
        {
          type: 'callout',
          content:
            'Бесконечная рекурсия при циклических ссылках. В деревьях циклов обычно нет, но если структура — граф, нужен Set для отслеживания посещённых узлов.',
          calloutType: 'warning',
        },
      ],
    },
  ],
};
