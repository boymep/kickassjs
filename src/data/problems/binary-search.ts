import type { Problem } from '../../types/problem';

export const binarySearchProblems: Problem[] = [
  {
    id: 'bs-problem-1',
    topicId: 'binary-search',
    title: 'Классический бинарный поиск',
    difficulty: 'easy',
    isContextual: false,
    description: `Дан отсортированный по возрастанию массив целых чисел \`arr\` и целое число \`target\`.

Напишите функцию, которая находит \`target\` в массиве и возвращает его индекс. Если элемент не найден, верните \`-1\`.

**Требования:**
- Решение должно работать за **O(log n)**.
- Массив отсортирован по возрастанию.
- Все элементы массива уникальны.

**Примеры:**
\`\`\`
binarySearch([1, 3, 5, 7, 9], 5)  // → 2
binarySearch([1, 3, 5, 7, 9], 6)  // → -1
binarySearch([2, 4, 6], 2)        // → 0
\`\`\``,
    functionName: 'binarySearch',
    starterCode: `function binarySearch(arr, target) {
  // ваш код
}`,
    testCases: [
      {
        id: 'bs-p1-t1',
        inputDisplay: 'binarySearch([1, 3, 5, 7, 9], 5)',
        inputArgs: [[1, 3, 5, 7, 9], 5],
        expected: 2,
      },
      {
        id: 'bs-p1-t2',
        inputDisplay: 'binarySearch([1, 3, 5, 7, 9], 6)',
        inputArgs: [[1, 3, 5, 7, 9], 6],
        expected: -1,
      },
      {
        id: 'bs-p1-t3',
        inputDisplay: 'binarySearch([2, 4, 6], 2)',
        inputArgs: [[2, 4, 6], 2],
        expected: 0,
      },
      {
        id: 'bs-p1-t4',
        inputDisplay: 'binarySearch([10], 10)',
        inputArgs: [[10], 10],
        expected: 0,
      },
      {
        id: 'bs-p1-t5',
        inputDisplay: 'binarySearch([1, 2, 3, 4, 5], 5)',
        inputArgs: [[1, 2, 3, 4, 5], 5],
        expected: 4,
      },
    ],
    hints: [
      'Сортированность даёт право отбрасывать половину диапазона на каждом шаге. Какие переменные должны меняться, чтобы сужать область поиска?',
      'Поддерживайте `left` и `right` — границы оставшегося диапазона. Считайте `mid = Math.floor((left + right) / 2)`. Сравнение `arr[mid]` с `target` определяет, какую половину выкинуть; цикл идёт пока `left <= right`.',
      `Главная ловушка — бесконечный цикл при «мягком» обновлении границ. После сравнения сдвигайте границу строго мимо \`mid\`: \`left = mid + 1\` или \`right = mid - 1\`. Если цикл закончился без совпадения — элемента в массиве нет, возвращайте \`-1\`. Условие \`left <= right\` (а не \`<\`) важно, чтобы проверить последний оставшийся элемент.

С чего начать:
\`\`\`js
let left = 0;
let right = arr.length - 1;
while (left <= right) {
  const mid = Math.floor((left + right) / 2);
  // ...
}
return -1;
\`\`\``,
    ],
    solutionCode: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}`,
  },
  {
    id: 'bs-problem-2',
    topicId: 'binary-search',
    title: 'Поиск ближайшего элемента',
    difficulty: 'easy',
    isContextual: false,
    description: `Дан отсортированный по возрастанию массив целых чисел \`arr\` и целое число \`target\`.

Найдите элемент массива, ближайший к \`target\`, и верните его. Если два элемента одинаково близки — верните **меньший** из них.

Гарантируется, что массив содержит хотя бы один элемент.

**Примеры:**
\`\`\`
findClosest([1, 3, 5, 7, 9], 6)  // → 5
findClosest([1, 3, 5, 7, 9], 4)  // → 3
findClosest([1, 10], 5)          // → 1
\`\`\``,
    functionName: 'findClosest',
    starterCode: `function findClosest(arr, target) {
  // ваш код
}`,
    testCases: [
      {
        id: 'bs-p2-t1',
        inputDisplay: 'findClosest([1, 3, 5, 7, 9], 6)',
        inputArgs: [[1, 3, 5, 7, 9], 6],
        expected: 5,
      },
      {
        id: 'bs-p2-t2',
        inputDisplay: 'findClosest([1, 3, 5, 7, 9], 4)',
        inputArgs: [[1, 3, 5, 7, 9], 4],
        expected: 3,
      },
      {
        id: 'bs-p2-t3',
        inputDisplay: 'findClosest([1, 10], 5)',
        inputArgs: [[1, 10], 5],
        expected: 1,
      },
      {
        id: 'bs-p2-t4',
        inputDisplay: 'findClosest([5], 100)',
        inputArgs: [[5], 100],
        expected: 5,
      },
      {
        id: 'bs-p2-t5',
        inputDisplay: 'findClosest([1, 2, 3, 4, 5], 3)',
        inputArgs: [[1, 2, 3, 4, 5], 3],
        expected: 3,
      },
      {
        id: 'bs-p2-t6',
        inputDisplay: 'findClosest([1, 3, 5], 10)',
        inputArgs: [[1, 3, 5], 10],
        expected: 5,
      },
      {
        id: 'bs-p2-t7',
        inputDisplay: 'findClosest([10, 20, 30], 1)',
        inputArgs: [[10, 20, 30], 1],
        expected: 10,
      },
    ],
    hints: [
      'Если бы массив гарантированно содержал target — задача сводилась бы к классическому поиску. Когда совпадения нет, оставшиеся «границы» сами указывают на двух ближайших кандидатов.',
      'После завершения обычного бинарного поиска: `right` — последний элемент `< target`, `left` — первый элемент `> target`. Из двух соседей `arr[right]` и `arr[left]` выбираете ближайший. При равенстве расстояний по условию возвращаете меньший — `arr[right]`.',
      `Главная ловушка — выход за границы массива: если \`target\` меньше всех элементов, \`right\` станет \`-1\`; если больше всех — \`left\` уйдёт за \`arr.length\`. Эти случаи нужно обработать до сравнения расстояний, иначе получите \`undefined\`. И помните про правило «при равенстве — меньший»: используйте нестрогое сравнение, чтобы \`arr[right]\` побеждал при равной дистанции.

С чего начать:
\`\`\`js
let left = 0;
let right = arr.length - 1;
while (left <= right) {
  const mid = Math.floor((left + right) / 2);
  // ... обычный бинпоиск; при совпадении return arr[mid]
}
// здесь left и right — соседи точки вставки
// ...
\`\`\``,
    ],
    solutionCode: `function findClosest(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return arr[mid];
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  // left -- первый элемент > target, right -- последний элемент < target
  if (left >= arr.length) return arr[right];
  if (right < 0) return arr[left];

  // При равном расстоянии возвращаем меньший (arr[right])
  if (target - arr[right] <= arr[left] - target) {
    return arr[right];
  }

  return arr[left];
}`,
  },
  {
    id: 'bs-problem-3',
    topicId: 'binary-search',
    title: 'Неудовлетворённость покупателей',
    difficulty: 'medium',
    isContextual: true,
    description: `На маркетплейсе размещено множество товаров. Каждый товар характеризуется числовым значением (например, ценой или рейтингом). У каждого покупателя есть **потребность** — тоже числовое значение, отражающее идеальный товар.

Если точного товара нет, покупатель выбирает ближайший по значению. **Неудовлетворённость** покупателя — это абсолютная разница между его потребностью и выбранным товаром.

Количество каждого товара не ограничено: один и тот же товар могут купить несколько покупателей.

Напишите функцию, которая принимает массив товаров \`goods\` и массив потребностей покупателей \`buyerNeeds\` и возвращает **суммарную** неудовлетворённость всех покупателей.

**Примеры:**

\`\`\`
calcDissatisfaction([8, 3, 5], [5, 6])  // → 1
\`\`\`
Первый покупатель покупает товар \`5\` (неудовлетворённость \`0\`). Второй покупатель тоже покупает товар \`5\` — ближайший к \`6\` (неудовлетворённость \`1\`). Итого: \`0 + 1 = 1\`.

\`\`\`
calcDissatisfaction([1, 10], [5])  // → 4
\`\`\`
Покупатель выбирает товар \`1\` (расстояние \`4\`) или товар \`10\` (расстояние \`5\`). Ближайший — товар \`1\`, неудовлетворённость \`= 4\`.`,
    functionName: 'calcDissatisfaction',
    starterCode: `function calcDissatisfaction(goods, buyerNeeds) {
  // ваш код
}`,
    testCases: [
      {
        id: 'bs-p3-t1',
        inputDisplay: 'calcDissatisfaction([8, 3, 5], [5, 6])',
        inputArgs: [[8, 3, 5], [5, 6]],
        expected: 1,
      },
      {
        id: 'bs-p3-t2',
        inputDisplay: 'calcDissatisfaction([1, 10], [5])',
        inputArgs: [[1, 10], [5]],
        expected: 4,
      },
      {
        id: 'bs-p3-t3',
        inputDisplay: 'calcDissatisfaction([5], [5])',
        inputArgs: [[5], [5]],
        expected: 0,
      },
      {
        id: 'bs-p3-t4',
        inputDisplay: 'calcDissatisfaction([1, 2, 3, 4, 5], [3, 3, 3])',
        inputArgs: [[1, 2, 3, 4, 5], [3, 3, 3]],
        expected: 0,
      },
      {
        id: 'bs-p3-t5',
        inputDisplay: 'calcDissatisfaction([10, 20, 30], [1, 25, 35])',
        inputArgs: [[10, 20, 30], [1, 25, 35]],
        expected: 19,
      },
    ],
    hints: [
      'Массив `goods` не отсортирован, а покупателей много. Линейный поиск для каждого даст `O(n·m)`. Если предварительно один раз привести данные в удобный для быстрого поиска вид, каждый запрос станет логарифмическим.',
      'Отсортируйте товары один раз, затем для каждой потребности бинарным поиском найдите соседние товары и возьмите минимум из `need - sorted[right]` и `sorted[left] - need`. Граничные случаи: `need` меньше минимума или больше максимума.',
      `Ключевой инвариант: сортируйте товары один раз — не внутри цикла по покупателям, иначе сложность снова станет квадратичной. Не забудьте про граничные случаи, когда \`need\` выходит за пределы диапазона товаров: тогда расстояние одностороннее, иначе обращение к \`sorted[-1]\` или \`sorted[length]\` даст \`undefined\` и сломает арифметику.

С чего начать:
\`\`\`js
const sorted = [...goods].sort((a, b) => a - b);
let total = 0;
for (const need of buyerNeeds) {
  // бинпоиск ближайшего к need в sorted
  // ...
}
return total;
\`\`\``,
    ],
    solutionCode: `function calcDissatisfaction(goods, buyerNeeds) {
  const sorted = [...goods].sort((a, b) => a - b);

  let totalDissatisfaction = 0;

  for (const need of buyerNeeds) {
    let left = 0;
    let right = sorted.length - 1;

    // Граничные случаи: потребность за пределами диапазона товаров
    if (need <= sorted[0]) {
      totalDissatisfaction += sorted[0] - need;
      continue;
    }
    if (need >= sorted[right]) {
      totalDissatisfaction += need - sorted[right];
      continue;
    }

    // Бинарный поиск ближайшего товара
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (sorted[mid] === need) {
        left = mid;
        right = mid;
        break;
      } else if (sorted[mid] < need) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    // Сравниваем соседей: right -- ближайший слева, left -- ближайший справа
    const diffLeft = need - sorted[right];
    const diffRight = sorted[left] - need;

    totalDissatisfaction += Math.min(diffLeft, diffRight);
  }

  return totalDissatisfaction;
}`,
  },
  {
    id: 'bs-p6',
    topicId: 'binary-search',
    title: 'Подбор размеров одежды',
    difficulty: 'easy',
    isContextual: true,
    description: `В интернет-магазине есть отсортированный массив доступных размеров одежды \`sizes\`. Покупатель хочет размер \`target\`. Если точного размера нет, нужно вернуть два ближайших — меньший и больший. Если точный есть — вернуть его дважды: \`[target, target]\`.

**Крайние случаи:**
- Если нет размера меньше \`target\` — вернуть \`[ближайший больший, ближайший больший]\`.
- Если нет размера больше \`target\` — вернуть \`[ближайший меньший, ближайший меньший]\`.

**Примеры:**
\`\`\`
findClosestSizes([36, 38, 40, 42, 44], 41)  // → [40, 42]
findClosestSizes([36, 38, 40, 42], 40)      // → [40, 40]
findClosestSizes([38, 42, 46], 35)          // → [38, 38]
\`\`\``,
    functionName: 'findClosestSizes',
    starterCode: `function findClosestSizes(sizes, target) {
  // ваш код
}`,
    testCases: [
      {
        id: 'bs-p6-t1',
        inputDisplay: 'findClosestSizes([36, 38, 40, 42, 44], 41)',
        inputArgs: [[36, 38, 40, 42, 44], 41],
        expected: [40, 42],
      },
      {
        id: 'bs-p6-t2',
        inputDisplay: 'findClosestSizes([36, 38, 40, 42], 40)',
        inputArgs: [[36, 38, 40, 42], 40],
        expected: [40, 40],
      },
      {
        id: 'bs-p6-t3',
        inputDisplay: 'findClosestSizes([38, 42, 46], 35)',
        inputArgs: [[38, 42, 46], 35],
        expected: [38, 38],
      },
      {
        id: 'bs-p6-t4',
        inputDisplay: 'findClosestSizes([38, 42, 46], 50)',
        inputArgs: [[38, 42, 46], 50],
        expected: [46, 46],
      },
      {
        id: 'bs-p6-t5',
        inputDisplay: 'findClosestSizes([36, 38, 40, 42, 44, 46], 43)',
        inputArgs: [[36, 38, 40, 42, 44, 46], 43],
        expected: [42, 44],
      },
    ],
    hints: [
      'После «неудачного» бинарного поиска указатели `left` и `right` сами указывают на соседей точки вставки. Что они означают, когда цикл завершился без совпадения?',
      'По завершении: `right` — последний элемент `< target`, `left` — первый элемент `> target`. Если `right < 0` — все размеры больше target, возвращаем `[sizes[left], sizes[left]]`. Если `left >= sizes.length` — наоборот. Иначе — `[sizes[right], sizes[left]]`.',
      `После «неудачного» бинпоиска указатели \`left\` и \`right\` меняются местами относительно точки вставки — это контринтуитивно, но именно то, что нужно. Обязательно отдельно обработайте случаи \`right < 0\` (все размеры больше target) и \`left >= sizes.length\` (все меньше), иначе обращение к несуществующему индексу вернёт \`undefined\`.

С чего начать:
\`\`\`js
let left = 0;
let right = sizes.length - 1;
while (left <= right) {
  const mid = (left + right) >> 1;
  // ... при совпадении return [target, target]
}
// здесь right < left; разберите граничные случаи и верните пару
// ...
\`\`\``,
    ],
    solutionCode: `function findClosestSizes(sizes, target) {
  // Бинарный поиск позиции вставки
  let left = 0;
  let right = sizes.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (sizes[mid] === target) {
      return [target, target];
    } else if (sizes[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  // left — позиция вставки (первый элемент > target)
  // right — последний элемент < target
  if (right < 0) return [sizes[left], sizes[left]];
  if (left >= sizes.length) return [sizes[right], sizes[right]];

  return [sizes[right], sizes[left]];
}`,
  },
  {
    id: 'bs-p4',
    topicId: 'binary-search',
    title: 'Поиск версии с багом',
    difficulty: 'medium',
    isContextual: true,
    description: `В системе CI/CD каждый коммит получает порядковый номер (от \`1\` до \`n\`). Начиная с какого-то коммита в проде появился баг. Дана функция \`isBuggy(version)\`, которая возвращает \`true\`, если версия содержит баг. Все версии после первой багованной — **тоже багованные**.

Для простоты: дан отсортированный массив \`versions\` из \`boolean\`, где \`false\` — версия без бага, \`true\` — с багом (например \`[false, false, true, true, true]\`). Найдите индекс **первого** \`true\` (первой багованной версии). Если багов нет — верните \`-1\`.

**Примеры:**
\`\`\`
findFirstBuggy([false, false, true, true, true])  // → 2
findFirstBuggy([true, true, true])                // → 0
findFirstBuggy([false, false, false])             // → -1
\`\`\``,
    functionName: 'findFirstBuggy',
    starterCode: `function findFirstBuggy(versions) {
  // ваш код
}`,
    testCases: [
      {
        id: 'bs-p4-t1',
        inputDisplay: 'findFirstBuggy([false, false, true, true, true])',
        inputArgs: [[false, false, true, true, true]],
        expected: 2,
      },
      {
        id: 'bs-p4-t2',
        inputDisplay: 'findFirstBuggy([true, true, true])',
        inputArgs: [[true, true, true]],
        expected: 0,
      },
      {
        id: 'bs-p4-t3',
        inputDisplay: 'findFirstBuggy([false, false, false])',
        inputArgs: [[false, false, false]],
        expected: -1,
      },
      {
        id: 'bs-p4-t4',
        inputDisplay: 'findFirstBuggy([false, true])',
        inputArgs: [[false, true]],
        expected: 1,
      },
      {
        id: 'bs-p4-t5',
        inputDisplay: 'findFirstBuggy([false, false, false, false, true])',
        inputArgs: [[false, false, false, false, true]],
        expected: 4,
      },
    ],
    hints: [
      'Массив имеет вид `[false, ..., false, true, ..., true]` — это монотонный «переход». Нужно найти именно границу перехода, а не любое вхождение `true`.',
      'Бинарный поиск левой границы: если `versions[mid] === true`, это потенциальный ответ — запомните его и двигайте `right = mid - 1` (ищем левее). Если `false` — двигайте `left = mid + 1`.',
      `Отличие от классического поиска: даже найдя \`true\`, нельзя сразу возвращать — нужно запомнить кандидата и продолжить искать левее. Заведите переменную \`result = -1\` и обновляйте её только при \`versions[mid] === true\`. Если ни одного \`true\` не встретилось — \`result\` останется \`-1\`, что и нужно по условию.

С чего начать:
\`\`\`js
let left = 0;
let right = versions.length - 1;
let result = -1;
while (left <= right) {
  const mid = (left + right) >> 1;
  // ...
}
return result;
\`\`\``,
    ],
    solutionCode: `function findFirstBuggy(versions) {
  let left = 0;
  let right = versions.length - 1;
  let result = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (versions[mid] === true) {
      result = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return result;
}`,
  },
  {
    id: 'bs-p7',
    topicId: 'binary-search',
    kind: 'predict-output',
    title: 'Что выведет код: бинарный поиск 4 в [1, 2, 4, 4, 5]',
    difficulty: 'easy',
    isContextual: false,
    description: `Перед вами реализация классического бинарного поиска. Проследите выполнение для массива \`[1, 2, 4, 4, 5]\` и \`target = 4\`. Какой индекс выведет \`console.log\`?`,
    code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}

console.log(binarySearch([1, 2, 4, 4, 5], 4));`,
    expected: '2',
    hints: [
      'Шаг 1: при `left=0, right=4` чему равно `mid`? Какое значение стоит в `arr[mid]`?',
      'Шаг 2: `mid = Math.floor((0 + 4) / 2) = 2`, и `arr[2] === 4`. Условие `arr[mid] === target` уже выполнено — функция сразу возвращает текущий `mid`, не пытаясь найти «самое левое» вхождение.',
      'Итог: возвращается `2`, хотя индекс `3` — тоже валидная позиция четвёрки.',
    ],
    solutionCode: `// На итерации 1: mid = Math.floor((0 + 4) / 2) = 2.
// arr[2] === 4 === target, поэтому функция возвращает 2.
//
// Заметьте: индекс 3 — тоже валидное вхождение 4,
// но классический шаблон останавливается на первом найденном.`,
  },
  {
    id: 'bs-p8',
    topicId: 'binary-search',
    kind: 'find-bug',
    title: 'Найдите баг: бесконечный цикл в бинарном поиске',
    difficulty: 'medium',
    isContextual: false,
    description: `Перед вами реализация бинарного поиска, в которой содержится баг. На некоторых входах функция **зависает в бесконечном цикле** или возвращает неверный результат.

Найдите ошибку и исправьте её. Подумайте, как сочетаются условие цикла и сдвиг границ.`,
    functionName: 'binarySearch',
    buggyCode: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}`,
    bugSummary:
      'Условие цикла left < right (вместо left <= right) пропускает диапазон из одного элемента. Когда искомое значение находится в позиции left === right, цикл завершается до проверки.',
    testCases: [
      {
        id: 'bs-p8-t1',
        inputDisplay: 'binarySearch([1, 3, 5, 7, 9], 9)',
        inputArgs: [[1, 3, 5, 7, 9], 9],
        expected: 4,
      },
      {
        id: 'bs-p8-t2',
        inputDisplay: 'binarySearch([1], 1)',
        inputArgs: [[1], 1],
        expected: 0,
      },
      {
        id: 'bs-p8-t3',
        inputDisplay: 'binarySearch([1, 3, 5, 7, 9], 5)',
        inputArgs: [[1, 3, 5, 7, 9], 5],
        expected: 2,
      },
      {
        id: 'bs-p8-t4',
        inputDisplay: 'binarySearch([1, 3, 5, 7, 9], 1)',
        inputArgs: [[1, 3, 5, 7, 9], 1],
        expected: 0,
      },
      {
        id: 'bs-p8-t5',
        inputDisplay: 'binarySearch([1, 3, 5, 7, 9], 6)',
        inputArgs: [[1, 3, 5, 7, 9], 6],
        expected: -1,
      },
    ],
      hints: [
        'Прогоните код в голове на `binarySearch([1], 1)`: `left = 0`, `right = 0`. Войдёт ли цикл? Что вернётся?',
        'При `left === right` диапазон содержит ровно один непроверенный элемент — потенциальный ответ. Условие `left < right` не даёт его проверить. Замените на `left <= right`.',
        `Главный урок: условие цикла и шаг обновления границ должны быть согласованы. При \`left = mid + 1\` и \`right = mid - 1\` индекс \`mid\` уже исключён из дальнейшего поиска, поэтому диапазон \`[left, right]\` всегда содержит только непроверенные элементы — и его нужно обрабатывать до тех пор, пока он непустой, то есть пока \`left <= right\`.

Старт:
\`\`\`js
let left = 0;
let right = arr.length - 1;
while (left <= right) {
  const mid = (left + right) >> 1;
  // ...
}
return -1;
\`\`\``,
      ],
    solutionCode: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}`,
  },
  {
    id: 'bs-p9',
    topicId: 'binary-search',
    kind: 'refactor',
    title: 'Рефакторинг: O(n) поиск → O(log n) бинарный поиск',
    difficulty: 'medium',
    isContextual: false,
    description: `Перед вами линейный поиск элемента в отсортированном массиве. Он работает корректно, но за **O(n)** — на массиве из 100 000 элементов это слишком медленно.

Перепишите функцию так, чтобы она использовала **бинарный поиск** и работала за **O(log n)**. Контракт остаётся прежним: вернуть индекс \`target\` или \`-1\`, если элемента нет.

**Тест производительности:** на массиве из 100 000 элементов с \`target\` в середине решение должно завершаться за **50 мс**.`,
    functionName: 'findIndex',
    starterCode: `function findIndex(arr, target) {
  // Линейный поиск — работает, но медленно
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
    testCases: [
      {
        id: 'bs-p9-t1',
        inputDisplay: 'findIndex([1, 3, 5, 7, 9], 5)',
        inputArgs: [[1, 3, 5, 7, 9], 5],
        expected: 2,
      },
      {
        id: 'bs-p9-t2',
        inputDisplay: 'findIndex([1, 3, 5, 7, 9], 6)',
        inputArgs: [[1, 3, 5, 7, 9], 6],
        expected: -1,
      },
      {
        id: 'bs-p9-t3',
        inputDisplay: 'findIndex([10], 10)',
        inputArgs: [[10], 10],
        expected: 0,
      },
      {
        id: 'bs-p9-t4',
        inputDisplay: 'findIndex([], 5)',
        inputArgs: [[], 5],
        expected: -1,
      },
      {
        id: 'bs-p9-t5',
        inputDisplay: 'findIndex([1, 2, 3, 4, 5], 1)',
        inputArgs: [[1, 2, 3, 4, 5], 1],
        expected: 0,
      },
      {
        id: 'bs-p9-t6',
        inputDisplay: 'findIndex([1, 2, 3, 4, 5], 5)',
        inputArgs: [[1, 2, 3, 4, 5], 5],
        expected: 4,
      },
    ],
    perfTest: {
      // Sorted array of 100_000 numbers (0, 2, 4, ..., 199_998); target = 99_998 (middle index 49_999).
      inputArgs: [
        Array.from({ length: 100_000 }, (_, i) => i * 2),
        99_998,
      ],
      maxMs: 50,
    },
    hints: [
      'Линейный перебор не использует факт сортированности. Если посмотреть на средний элемент — что можно сразу сказать о половине массива?',
      'Поддерживайте границы `left` и `right`. На каждой итерации `mid = Math.floor((left + right) / 2)`. Сравнив `arr[mid]` с `target`, выкидываете половину диапазона. Сложность становится `O(log n)`.',
      `Почему это \`O(log n)\`: каждая итерация выкидывает ровно половину оставшегося диапазона. За \`log₂(n)\` шагов диапазон сожмётся до нуля. Для массива в 100 000 элементов это всего ~17 сравнений вместо 100 000 — отсюда и колоссальный выигрыш в производительности.

С чего начать:
\`\`\`js
let left = 0;
let right = arr.length - 1;
while (left <= right) {
  const mid = (left + right) >> 1;
  // ...
}
return -1;
\`\`\``,
    ],
    solutionCode: `function findIndex(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}`,
  },
  {
    id: 'bs-h1',
    topicId: 'binary-search',
    kind: 'implement',
    title: 'Поиск в повёрнутом отсортированном массиве',
    difficulty: 'hard',
    isContextual: false,
    description: `Дан массив \`arr\`, изначально отсортированный по возрастанию, который был **повёрнут** в некоторой точке (например, \`[4,5,6,7,0,1,2]\`). Дано число \`target\`.

Найдите индекс \`target\` в массиве. Если элемент не найден — верните \`-1\`.

**Решение должно работать за O(log n) — без линейного перебора!**

Примеры:
\`\`\`
searchRotated([4, 5, 6, 7, 0, 1, 2], 0)  // → 4
searchRotated([4, 5, 6, 7, 0, 1, 2], 3)  // → -1
searchRotated([1], 0)                      // → -1
searchRotated([3, 1], 1)                   // → 1
\`\`\``,
    functionName: 'searchRotated',
    starterCode: `function searchRotated(arr, target) {
  // ваш код — только O(log n)!
}`,
    testCases: [
      { id: 'bs-h1-t1', inputDisplay: 'searchRotated([4,5,6,7,0,1,2], 0)', inputArgs: [[4,5,6,7,0,1,2], 0], expected: 4 },
      { id: 'bs-h1-t2', inputDisplay: 'searchRotated([4,5,6,7,0,1,2], 3)', inputArgs: [[4,5,6,7,0,1,2], 3], expected: -1 },
      { id: 'bs-h1-t3', inputDisplay: 'searchRotated([1], 0)', inputArgs: [[1], 0], expected: -1 },
      { id: 'bs-h1-t4', inputDisplay: 'searchRotated([3,1], 1)', inputArgs: [[3,1], 1], expected: 1 },
      { id: 'bs-h1-t5', inputDisplay: 'searchRotated([5,1,2,3,4], 5)', inputArgs: [[5,1,2,3,4], 5], expected: 0 },
      { id: 'bs-h1-t6', inputDisplay: 'searchRotated([1,2,3,4,5], 3)', inputArgs: [[1,2,3,4,5], 3], expected: 2 },
    ],
    hints: [
      'Поворот ломает глобальный порядок, но локально каждая «половина» относительно `mid` либо отсортирована, либо содержит точку поворота. Это уже даёт основу для бинарного поиска.',
      'На каждой итерации сравните `arr[left]` с `arr[mid]`. Если `arr[left] <= arr[mid]` — левая половина отсортирована: проверьте, лежит ли `target` в `[arr[left], arr[mid])`, и сдвиньте границу. Иначе отсортирована правая — действуйте симметрично.',
      `Ключевой инвариант: хотя весь массив не отсортирован, ровно одна половина от \`mid\` всегда упорядочена — это даёт право применять бинпоиск. Тонкость в граничных случаях сравнений: используйте \`arr[left] <= arr[mid]\` (нестрого), иначе при двухэлементном массиве с поворотом, например \`[3, 1]\`, обе ветки сработают неправильно. И проверяйте принадлежность \`target\` упорядоченной половине строго по её границам, прежде чем сдвигать указатели.

С чего начать:
\`\`\`js
let left = 0;
let right = arr.length - 1;
while (left <= right) {
  const mid = (left + right) >> 1;
  if (arr[mid] === target) return mid;
  // определить, какая половина отсортирована, и сдвинуть границу
  // ...
}
return -1;
\`\`\``,
    ],
    solutionCode: `function searchRotated(arr, target) {
  let left = 0, right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;

    // Левая половина отсортирована
    if (arr[left] <= arr[mid]) {
      if (arr[left] <= target && target < arr[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // Правая половина отсортирована
      if (arr[mid] < target && target <= arr[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return -1;
}`,
  },
  {
    id: 'bs-h2',
    topicId: 'binary-search',
    kind: 'implement',
    title: 'K-й наименьший элемент в отсортированной матрице',
    difficulty: 'hard',
    isContextual: false,
    description: `Дана матрица \`n × n\`, где каждая строка и каждый столбец отсортированы по возрастанию. Найдите **k-й наименьший** элемент в матрице.

Индекс \`k\` начинается с **1** (k=1 — наименьший элемент).

**Ключевое ограничение**: используйте бинарный поиск по значению, а не сортировку всей матрицы.

Примеры:
\`\`\`
kthSmallest([[1,5,9],[10,11,13],[12,13,15]], 8)  // → 13
kthSmallest([[1,2],[3,3]], 2)                     // → 2
kthSmallest([[-5]], 1)                            // → -5
\`\`\``,
    functionName: 'kthSmallest',
    starterCode: `function kthSmallest(matrix, k) {
  // ваш код
}`,
    testCases: [
      { id: 'bs-h2-t1', inputDisplay: 'kthSmallest([[1,5,9],[10,11,13],[12,13,15]], 8)', inputArgs: [[[1,5,9],[10,11,13],[12,13,15]], 8], expected: 13 },
      { id: 'bs-h2-t2', inputDisplay: 'kthSmallest([[1,2],[3,3]], 2)', inputArgs: [[[1,2],[3,3]], 2], expected: 2 },
      { id: 'bs-h2-t3', inputDisplay: 'kthSmallest([[-5]], 1)', inputArgs: [[[-5]], 1], expected: -5 },
      { id: 'bs-h2-t4', inputDisplay: 'kthSmallest([[1,5,9],[10,11,13],[12,13,15]], 1)', inputArgs: [[[1,5,9],[10,11,13],[12,13,15]], 1], expected: 1 },
      { id: 'bs-h2-t5', inputDisplay: 'kthSmallest([[1,3,5],[6,7,12],[11,14,14]], 6)', inputArgs: [[[1,3,5],[6,7,12],[11,14,14]], 6], expected: 11 },
    ],
    hints: [
      'Ответ — это число, а не позиция. Бинарный поиск можно запускать не по индексам, а по диапазону возможных значений, лежащих в матрице.',
      'Границы — `matrix[0][0]` и `matrix[n-1][n-1]`. Для кандидата `mid` нужна функция `countLessOrEqual(mid)` за O(n): идите из левого нижнего угла, при `matrix[row][col] <= mid` добавляйте `row + 1` и двигайтесь вправо, иначе — вверх. Если `count >= k` — сужайте `right = mid`, иначе `left = mid + 1`.',
      `Ключевая идея: ищем не индекс, а значение — поэтому бинпоиск работает по диапазону \`[matrix[0][0], matrix[n-1][n-1]]\`, а не по индексам. Важно использовать условие \`lo < hi\` и \`right = mid\` (без \`-1\`), иначе можно проскочить ответ, ведь \`mid\` может оказаться валидным значением, которого нет в матрице, но рядом с ним и лежит правильный ответ. Сходимость гарантирована тем, что \`countLessOrEqual\` монотонна по \`mid\`.

С чего начать:
\`\`\`js
const n = matrix.length;
let lo = matrix[0][0];
let hi = matrix[n - 1][n - 1];
function countLessOrEqual(x) { /* ... */ }
while (lo < hi) {
  const mid = (lo + hi) >> 1;
  // ...
}
return lo;
\`\`\``,
    ],
    solutionCode: `function kthSmallest(matrix, k) {
  const n = matrix.length;

  function countLessOrEqual(mid) {
    let count = 0;
    let row = n - 1, col = 0;
    while (row >= 0 && col < n) {
      if (matrix[row][col] <= mid) {
        count += row + 1;
        col++;
      } else {
        row--;
      }
    }
    return count;
  }

  let left = matrix[0][0];
  let right = matrix[n - 1][n - 1];

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (countLessOrEqual(mid) >= k) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left;
}`,
  },
  {
    id: 'bs-p5',
    topicId: 'binary-search',
    title: 'Минимальная скорость доставки',
    difficulty: 'medium',
    isContextual: true,
    description: `Курьер должен доставить все заказы за \`hours\` часов. Массив \`orders\` содержит количество посылок на каждой точке. За час курьер может обработать до \`speed\` посылок на одной точке (если посылок меньше \`speed\`, он всё равно тратит целый час на эту точку).

Найдите **минимальную** скорость \`speed\`, при которой курьер успеет обработать все точки за \`hours\` часов.

**Примеры:**
\`\`\`
minDeliverySpeed([3, 6, 7, 11], 8)         // → 4
// При speed=4: ceil(3/4)+ceil(6/4)+ceil(7/4)+ceil(11/4) = 1+2+2+3 = 8 ≤ 8 ✓

minDeliverySpeed([30, 11, 23, 4, 20], 5)   // → 30
minDeliverySpeed([1, 1, 1, 1], 4)          // → 1
\`\`\``,
    functionName: 'minDeliverySpeed',
    starterCode: `function minDeliverySpeed(orders, hours) {
  // ваш код
}`,
    testCases: [
      {
        id: 'bs-p5-t1',
        inputDisplay: 'minDeliverySpeed([3, 6, 7, 11], 8)',
        inputArgs: [[3, 6, 7, 11], 8],
        expected: 4,
      },
      {
        id: 'bs-p5-t2',
        inputDisplay: 'minDeliverySpeed([30, 11, 23, 4, 20], 5)',
        inputArgs: [[30, 11, 23, 4, 20], 5],
        expected: 30,
      },
      {
        id: 'bs-p5-t3',
        inputDisplay: 'minDeliverySpeed([1, 1, 1, 1], 4)',
        inputArgs: [[1, 1, 1, 1], 4],
        expected: 1,
      },
      {
        id: 'bs-p5-t4',
        inputDisplay: 'minDeliverySpeed([10], 1)',
        inputArgs: [[10], 1],
        expected: 10,
      },
      {
        id: 'bs-p5-t5',
        inputDisplay: 'minDeliverySpeed([3, 6, 7, 11], 4)',
        inputArgs: [[3, 6, 7, 11], 4],
        expected: 11,
      },
    ],
    hints: [
      'Если скорость `X` подходит, то любая `X+1` тоже подходит — функция «успевает / не успевает» монотонна. Это даёт право искать бинарным поиском минимальную подходящую скорость.',
      'Диапазон: `left = 1`, `right = Math.max(...orders)`. Проверка для `mid`: сумма `Math.ceil(order / mid)` по всем точкам должна быть `<= hours`. Если успеваем — пробуем уменьшить (`right = mid - 1`), иначе увеличиваем (`left = mid + 1`).',
      `Это «бинпоиск по ответу»: ищем не индекс, а значение скорости. Работает только потому, что предикат «успевает за \`hours\`» монотонен — если успели на скорости \`X\`, то и на \`X+1\` успеете. Не забудьте про \`Math.ceil\`: даже одна посылка занимает целый час. И стартуйте с \`left = 1\`, а не \`0\`, иначе деление на ноль.

С чего начать:
\`\`\`js
let left = 1;
let right = Math.max(...orders);
while (left < right) {
  const mid = (left + right) >> 1;
  // проверка: успевает ли курьер при скорости mid
  // ...
}
return left;
\`\`\``,
    ],
    solutionCode: `function minDeliverySpeed(orders, hours) {
  let left = 1;
  let right = Math.max(...orders);
  let result = right;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    let totalHours = 0;
    for (const order of orders) {
      totalHours += Math.ceil(order / mid);
    }

    if (totalHours <= hours) {
      result = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return result;
}`,
  },
  {
    id: 'bs-h3',
    topicId: 'binary-search',
    kind: 'implement',
    title: 'Медиана двух отсортированных массивов',
    difficulty: 'hard',
    isContextual: false,
    description: `Даны два отсортированных по возрастанию массива \`nums1\` и \`nums2\` размеров \`m\` и \`n\`. Найдите **медиану** объединённого отсортированного массива.

**Требование сложности**: O(log(min(m, n))). Решение через слияние массивов за O(m+n) не подойдёт.

Медиана — это:
- средний элемент, если общее число элементов нечётное;
- среднее двух средних, если чётное.

Возвращайте число (для чётного случая — \`(a + b) / 2\` без округления).

Примеры:
\`\`\`
findMedianSortedArrays([1, 3], [2])        // → 2
findMedianSortedArrays([1, 2], [3, 4])     // → 2.5
findMedianSortedArrays([], [1])            // → 1
findMedianSortedArrays([0, 0], [0, 0])     // → 0
\`\`\``,
    functionName: 'findMedianSortedArrays',
    starterCode: `function findMedianSortedArrays(nums1, nums2) {
  // ваш код — O(log(min(m, n)))
}`,
    testCases: [
      { id: 'bs-h3-t1', inputDisplay: 'findMedianSortedArrays([1,3], [2])', inputArgs: [[1, 3], [2]], expected: 2 },
      { id: 'bs-h3-t2', inputDisplay: 'findMedianSortedArrays([1,2], [3,4])', inputArgs: [[1, 2], [3, 4]], expected: 2.5 },
      { id: 'bs-h3-t3', inputDisplay: 'findMedianSortedArrays([], [1])', inputArgs: [[], [1]], expected: 1 },
      { id: 'bs-h3-t4', inputDisplay: 'findMedianSortedArrays([0,0], [0,0])', inputArgs: [[0, 0], [0, 0]], expected: 0 },
      { id: 'bs-h3-t5', inputDisplay: 'findMedianSortedArrays([1,2,3,4,5], [6,7,8,9,10])', inputArgs: [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10]], expected: 5.5 },
      { id: 'bs-h3-t6', inputDisplay: 'findMedianSortedArrays([1,3,5,7], [2,4,6,8,10])', inputArgs: [[1, 3, 5, 7], [2, 4, 6, 8, 10]], expected: 5 },
    ],
    hints: [
      'Слияние даст `O(m+n)` — слишком медленно. Подумайте о задаче как о поиске такого «разреза» в обоих массивах, чтобы слева оказалась ровно половина всех элементов и любой левый элемент был `<=` любого правого.',
      'Запустите бинарный поиск по позиции `i` разреза в меньшем массиве (`nums1`). Позиция `j = half - i` во втором массиве определяется однозначно. Корректный разрез: `leftA <= rightB && leftB <= rightA`. Если `leftA > rightB` — `i` слишком велико, сдвигайте `hi = i - 1`.',
      `Главная ловушка — граничные случаи разреза: если \`i === 0\`, в левой части \`nums1\` ничего нет, и \`leftA\` должен быть \`-Infinity\`; если \`i === m\` — \`rightA\` должен быть \`+Infinity\`. Аналогично для \`j\` и \`nums2\`. Без этих сторожевых значений сравнения \`leftA <= rightB\` сломаются на крайних разрезах. И обязательно сначала меняйте массивы местами так, чтобы \`nums1\` был короче — иначе \`j\` может оказаться отрицательным.

С чего начать:
\`\`\`js
if (nums1.length > nums2.length) [nums1, nums2] = [nums2, nums1];
const m = nums1.length, n = nums2.length;
const half = (m + n + 1) >> 1;
let lo = 0, hi = m;
while (lo <= hi) {
  const i = (lo + hi) >> 1;
  const j = half - i;
  // ...
}
\`\`\``,
    ],
    solutionCode: `function findMedianSortedArrays(nums1, nums2) {
  if (nums1.length > nums2.length) {
    [nums1, nums2] = [nums2, nums1];
  }
  const m = nums1.length;
  const n = nums2.length;
  const total = m + n;
  const half = Math.floor((total + 1) / 2);

  let lo = 0;
  let hi = m;

  while (lo <= hi) {
    const i = Math.floor((lo + hi) / 2);
    const j = half - i;

    const leftA = i === 0 ? -Infinity : nums1[i - 1];
    const rightA = i === m ? Infinity : nums1[i];
    const leftB = j === 0 ? -Infinity : nums2[j - 1];
    const rightB = j === n ? Infinity : nums2[j];

    if (leftA <= rightB && leftB <= rightA) {
      if (total % 2 === 1) {
        return Math.max(leftA, leftB);
      }
      return (Math.max(leftA, leftB) + Math.min(rightA, rightB)) / 2;
    } else if (leftA > rightB) {
      hi = i - 1;
    } else {
      lo = i + 1;
    }
  }

  return 0;
}`,
  },
  {
    id: 'bs-h4',
    topicId: 'binary-search',
    kind: 'implement',
    title: 'Разделение массива: минимизировать максимум',
    difficulty: 'hard',
    isContextual: false,
    description: `Дан массив неотрицательных целых чисел \`nums\` и целое число \`k\`. Разбейте массив на ровно \`k\` непустых **непрерывных** подмассивов так, чтобы **максимальная** сумма среди подмассивов была **минимальной**.

Верните эту минимальную возможную максимальную сумму.

Примеры:
\`\`\`
splitArray([7, 2, 5, 10, 8], 2)   // → 18   (разбиение [7,2,5] | [10,8])
splitArray([1, 2, 3, 4, 5], 2)    // → 9    ([1,2,3] | [4,5])
splitArray([1, 4, 4], 3)          // → 4
\`\`\``,
    functionName: 'splitArray',
    starterCode: `function splitArray(nums, k) {
  // ваш код — бинарный поиск по значению ответа
}`,
    testCases: [
      { id: 'bs-h4-t1', inputDisplay: 'splitArray([7,2,5,10,8], 2)', inputArgs: [[7, 2, 5, 10, 8], 2], expected: 18 },
      { id: 'bs-h4-t2', inputDisplay: 'splitArray([1,2,3,4,5], 2)', inputArgs: [[1, 2, 3, 4, 5], 2], expected: 9 },
      { id: 'bs-h4-t3', inputDisplay: 'splitArray([1,4,4], 3)', inputArgs: [[1, 4, 4], 3], expected: 4 },
      { id: 'bs-h4-t4', inputDisplay: 'splitArray([10], 1)', inputArgs: [[10], 1], expected: 10 },
      { id: 'bs-h4-t5', inputDisplay: 'splitArray([1,1,1,1,1], 5)', inputArgs: [[1, 1, 1, 1, 1], 5], expected: 1 },
      { id: 'bs-h4-t6', inputDisplay: 'splitArray([2,3,1,2,4,3], 3)', inputArgs: [[2, 3, 1, 2, 4, 3], 3], expected: 4 },
    ],
    hints: [
      'Перебор разбиений экспоненциален, но ответ — число, и оно зажато между `max(nums)` (одна часть ≥ максимума) и `sum(nums)` (всё в одну). Это даёт пространство для бинарного поиска по значению.',
      'Для фиксированного лимита `X` функция `canSplit(X)`: жадно набирайте префикс пока `sum + n <= X`, иначе открываете новую часть и считаете её. Если число частей `<= k` — `X` достижим. Свойство монотонно: если `X` подходит, то `X+1` тоже.',
      `Это снова «бинпоиск по ответу» — ищем минимальное значение лимита. Нижняя граница \`lo = max(nums)\` критична: меньше любого отдельного элемента быть не может, иначе его не поместить ни в одну часть. Жадная проверка \`canSplit\` корректна, потому что добавлять текущий элемент к существующей части всегда безопаснее, чем открывать новую — никаких рассуждений о «может, лучше отложить» не нужно.

С чего начать:
\`\`\`js
let lo = Math.max(...nums);
let hi = nums.reduce((a, b) => a + b, 0);
function canSplit(limit) { /* ... */ }
while (lo < hi) {
  const mid = (lo + hi) >> 1;
  // ...
}
return lo;
\`\`\``,
    ],
    solutionCode: `function splitArray(nums, k) {
  let lo = 0;
  let hi = 0;
  for (const n of nums) {
    if (n > lo) lo = n;
    hi += n;
  }

  function canSplit(limit) {
    let parts = 1;
    let sum = 0;
    for (const n of nums) {
      if (sum + n > limit) {
        parts++;
        sum = n;
        if (parts > k) return false;
      } else {
        sum += n;
      }
    }
    return true;
  }

  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (canSplit(mid)) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }

  return lo;
}`,
  },
];
