// =====================================================
// Деревья и графы — подготовка к собеседованию
// =====================================================
// Запуск: node algorithms/07-trees-graphs.js

function assert(condition, message) {
  if (!condition) {
    console.error("❌ " + message);
  } else {
    console.log("✅ " + message);
  }
}

function assertDeepEqual(a, b, message) {
  assert(
    JSON.stringify(a) === JSON.stringify(b),
    message + " | got: " + JSON.stringify(a) + ", expected: " + JSON.stringify(b),
  );
}

// =====================================================
// КАК РАБОТАЮТ ДЕРЕВЬЯ И ГРАФЫ
// =====================================================
//
// БИНАРНОЕ ДЕРЕВО — структура из узлов, каждый хранит значение
// и ссылки на левого и правого потомка (или null).
//   Узел: { val, left, right }
//
// Обходы дерева (DFS):
//   - Inorder (лево → корень → право): для BST даёт отсортированный порядок.
//   - Preorder (корень → лево → право): для копирования/сериализации.
//   - Postorder (лево → право → корень): для удаления/вычисления снизу вверх.
//
// Обход в ширину (BFS):
//   Уровень за уровнем, с помощью очереди.
//   Шаблон:
//     const queue = [root];
//     while (queue.length) {
//       const node = queue.shift();
//       // обработка node
//       if (node.left) queue.push(node.left);
//       if (node.right) queue.push(node.right);
//     }
//
// BST (Binary Search Tree):
//   Для каждого узла: все значения слева < val < все значения справа.
//
// ГРАФЫ:
//   Представление: список смежности (Map или объект).
//   BFS — кратчайший путь в невзвешенном графе.
//   DFS — обход, поиск компонент связности, топологическая сортировка.
//   Важно: отмечать посещённые узлы (Set), чтобы избежать циклов.
//
// Сложность: обход дерева — O(n) по времени, O(h) по памяти (h = высота).
//            обход графа — O(V + E) по времени, O(V) по памяти.
// =====================================================

// --- Вспомогательные функции (НЕ закомментированы) ---

// Строит бинарное дерево из массива (формат LeetCode):
// [3, 9, 20, null, null, 15, 7] →
//       3
//      / \
//     9   20
//        / \
//       15   7
function buildTree(arr) {
  if (!arr || arr.length === 0 || arr[0] === null) return null;
  const root = { val: arr[0], left: null, right: null };
  const queue = [root];
  let i = 1;
  while (i < arr.length) {
    const node = queue.shift();
    if (i < arr.length && arr[i] !== null) {
      node.left = { val: arr[i], left: null, right: null };
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = { val: arr[i], left: null, right: null };
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

// Сериализует дерево обратно в массив (формат LeetCode)
function treeToArray(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    if (node) {
      result.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    } else {
      result.push(null);
    }
  }
  // Убрать trailing nulls
  while (result.length && result[result.length - 1] === null) {
    result.pop();
  }
  return result;
}


// ===== ЗАДАЧА 1: Максимальная глубина бинарного дерева (Easy) =====
// Дано бинарное дерево. Верните его максимальную глубину.
// Глубина — количество узлов на самом длинном пути
// от корня до листа.
//
// Пример:
//     3
//    / \
//   9   20
//      / \
//     15   7
// maxDepth → 3
//
// maxDepth(null) → 0
//
// Оцените сложность по времени и памяти.

// function maxDepth(root) {
//   // ваш код
// }

// --- Тесты задача 1 ---
// assert(maxDepth(buildTree([3, 9, 20, null, null, 15, 7])) === 3, "maxDepth: [3,9,20,null,null,15,7] → 3");
// assert(maxDepth(buildTree([1, null, 2])) === 2, "maxDepth: [1,null,2] → 2");
// assert(maxDepth(null) === 0, "maxDepth: null → 0");
// assert(maxDepth(buildTree([1])) === 1, "maxDepth: [1] → 1");
// assert(maxDepth(buildTree([1, 2, 3, 4, 5])) === 3, "maxDepth: [1,2,3,4,5] → 3");


// ===== ЗАДАЧА 2: Инвертировать бинарное дерево (Easy) =====
// Дано бинарное дерево. Инвертируйте его — зеркально отразите
// (поменяйте местами левого и правого потомка на каждом уровне).
// Верните корень инвертированного дерева.
//
// Пример:
//     4            4
//    / \   →      / \
//   2   7        7   2
//  / \ / \      / \ / \
// 1  3 6  9    9  6 3  1
//
// Оцените сложность по времени и памяти.

// function invertTree(root) {
//   // ваш код
// }

// --- Тесты задача 2 ---
// assertDeepEqual(treeToArray(invertTree(buildTree([4, 2, 7, 1, 3, 6, 9]))), [4, 7, 2, 9, 6, 3, 1], "invertTree: основной пример");
// assertDeepEqual(treeToArray(invertTree(buildTree([2, 1, 3]))), [2, 3, 1], "invertTree: [2,1,3]");
// assert(invertTree(null) === null, "invertTree: null");
// assertDeepEqual(treeToArray(invertTree(buildTree([1]))), [1], "invertTree: один узел");


// ===== ЗАДАЧА 3: Обход дерева по уровням — Level Order (Medium) =====
// Дано бинарное дерево. Верните массив массивов — значения
// узлов на каждом уровне (слева направо).
//
// Пример:
//     3
//    / \
//   9   20
//      / \
//     15   7
// levelOrder → [[3], [9, 20], [15, 7]]
//
// Подсказка: BFS с очередью. На каждом шаге обрабатывайте
// все узлы текущего уровня (запомните длину очереди).
//
// Оцените сложность по времени и памяти.

// function levelOrder(root) {
//   // ваш код
// }

// --- Тесты задача 3 ---
// assertDeepEqual(levelOrder(buildTree([3, 9, 20, null, null, 15, 7])), [[3], [9, 20], [15, 7]], "levelOrder: основной пример");
// assertDeepEqual(levelOrder(buildTree([1])), [[1]], "levelOrder: один узел");
// assertDeepEqual(levelOrder(null), [], "levelOrder: null");
// assertDeepEqual(levelOrder(buildTree([1, 2, 3, 4, 5, 6, 7])), [[1], [2, 3], [4, 5, 6, 7]], "levelOrder: полное дерево");
// assertDeepEqual(levelOrder(buildTree([1, 2, null, 3])), [[1], [2], [3]], "levelOrder: только левая ветка");


// ===== ЗАДАЧА 4: Проверка BST (Medium) =====
// Дано бинарное дерево. Определите, является ли оно
// валидным деревом поиска (BST).
//
// Правила BST:
// - Все значения в левом поддереве < значение узла
// - Все значения в правом поддереве > значение узла
// - Оба поддерева тоже BST
//
// Пример:
//   2
//  / \
// 1   3    → true
//
//   5
//  / \
// 1   4    → false (4 < 5, но в правом поддереве)
//    / \
//   3   6
//
// Подсказка: передавайте в рекурсии допустимый диапазон (min, max)
// для каждого узла.
//
// Оцените сложность по времени и памяти.

// function isValidBST(root) {
//   // ваш код
// }

// --- Тесты задача 4 ---
// assert(isValidBST(buildTree([2, 1, 3])) === true, "isValidBST: [2,1,3] → true");
// assert(isValidBST(buildTree([5, 1, 4, null, null, 3, 6])) === false, "isValidBST: [5,1,4,null,null,3,6] → false");
// assert(isValidBST(buildTree([1])) === true, "isValidBST: один узел → true");
// assert(isValidBST(null) === true, "isValidBST: null → true");
// assert(isValidBST(buildTree([5, 4, 6, null, null, 3, 7])) === false, "isValidBST: 3 в правом поддереве → false");
// assert(isValidBST(buildTree([2, 2, 2])) === false, "isValidBST: дубликаты → false (strict BST)");


// ===== ЗАДАЧА 5: Количество островов (Medium) =====
// Дана матрица m×n из "1" (суша) и "0" (вода).
// Посчитайте количество островов. Остров — группа клеток "1",
// соединённых по горизонтали или вертикали.
//
// Пример:
// [["1","1","0","0","0"],
//  ["1","1","0","0","0"],
//  ["0","0","1","0","0"],
//  ["0","0","0","1","1"]]  → 3
//
// Подсказка: пройдите по матрице. Когда встретите "1" — запустите
// DFS или BFS, чтобы «затопить» весь остров (пометить как "0").
// Увеличьте счётчик.
//
// Оцените сложность по времени и памяти.

// function numIslands(grid) {
//   // ваш код
// }

// --- Тесты задача 5 ---
// assert(numIslands([
//   ["1","1","0","0","0"],
//   ["1","1","0","0","0"],
//   ["0","0","1","0","0"],
//   ["0","0","0","1","1"]
// ]) === 3, "numIslands: 3 острова");
// assert(numIslands([
//   ["1","1","1"],
//   ["1","1","1"]
// ]) === 1, "numIslands: 1 остров");
// assert(numIslands([
//   ["0","0","0"],
//   ["0","0","0"]
// ]) === 0, "numIslands: 0 островов");
// assert(numIslands([
//   ["1","0","1"],
//   ["0","1","0"],
//   ["1","0","1"]
// ]) === 5, "numIslands: шахматный порядок → 5");
// assert(numIslands([["1"]]) === 1, "numIslands: 1x1 суша");
// assert(numIslands([["0"]]) === 0, "numIslands: 1x1 вода");


// ===== ЗАДАЧА 6: Наименьший общий предок — LCA (Medium) =====
// Дано бинарное дерево и два узла p и q (гарантированно в дереве).
// Найдите их наименьшего общего предка (Lowest Common Ancestor).
//
// LCA — самый глубокий узел, который является предком и p, и q.
// Узел считается предком самого себя.
//
// Пример:
//       3
//      / \
//     5   1
//    / \ / \
//   6  2 0  8
//     / \
//    7   4
//
// LCA(5, 1) → 3
// LCA(5, 4) → 5
//
// Подсказка: рекурсивно проверяйте левое и правое поддерево.
// Если оба вернули не-null — текущий узел и есть LCA.
// Если только одно — возвращаем его наверх.
//
// Оцените сложность по времени и памяти.

// function lowestCommonAncestor(root, p, q) {
//   // p и q — значения (числа), не узлы
//   // верните значение LCA
//   // ваш код
// }

// --- Тесты задача 6 ---
// assert(lowestCommonAncestor(buildTree([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]), 5, 1) === 3, "LCA: LCA(5,1) = 3");
// assert(lowestCommonAncestor(buildTree([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]), 5, 4) === 5, "LCA: LCA(5,4) = 5");
// assert(lowestCommonAncestor(buildTree([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]), 6, 4) === 5, "LCA: LCA(6,4) = 5");
// assert(lowestCommonAncestor(buildTree([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]), 0, 8) === 1, "LCA: LCA(0,8) = 1");
// assert(lowestCommonAncestor(buildTree([1, 2]), 1, 2) === 1, "LCA: LCA(1,2) = 1");
