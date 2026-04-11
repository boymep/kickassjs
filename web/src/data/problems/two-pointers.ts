import type { Problem } from '../../types/problem';

export const twoPointersProblems: Problem[] = [
  {
    id: 'tp-problem-1',
    topicId: 'two-pointers',
    title: 'Two Sum в отсортированном массиве',
    difficulty: 'easy',
    isContextual: false,
    description:
      'Дан отсортированный по возрастанию массив целых чисел `numbers` и целое число `target`.\n\nНайдите два числа, которые в сумме дают `target`, и верните массив из двух их индексов (0-based).\n\nГарантируется, что решение существует и оно единственное. Нельзя использовать один и тот же элемент дважды.',
    functionName: 'twoSum',
    starterCode: `function twoSum(numbers: number[], target: number): number[] {
  // ваш код
}`,
    testCases: [
      {
        id: 'tp1-tc1',
        inputDisplay: 'twoSum([2, 7, 11, 15], 9)',
        inputArgs: [[2, 7, 11, 15], 9],
        expected: [0, 1],
      },
      {
        id: 'tp1-tc2',
        inputDisplay: 'twoSum([2, 3, 4], 6)',
        inputArgs: [[2, 3, 4], 6],
        expected: [0, 2],
      },
      {
        id: 'tp1-tc3',
        inputDisplay: 'twoSum([-1, 0], -1)',
        inputArgs: [[-1, 0], -1],
        expected: [0, 1],
      },
      {
        id: 'tp1-tc4',
        inputDisplay: 'twoSum([1, 2, 3, 4, 5], 9)',
        inputArgs: [[1, 2, 3, 4, 5], 9],
        expected: [3, 4],
      },
      {
        id: 'tp1-tc5',
        inputDisplay: 'twoSum([1, 3, 5, 7, 9], 10)',
        inputArgs: [[1, 3, 5, 7, 9], 10],
        expected: [0, 4],
      },
    ],
    hints: [
      'Массив уже отсортирован — воспользуйтесь этим.',
      'Поставьте один указатель в начало, другой в конец.',
      'Если сумма меньше target — сдвиньте левый указатель вправо. Если больше — правый влево.',
    ],
    solutionCode: `function twoSum(numbers: number[], target: number): number[] {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];

    if (sum === target) {
      return [left, right];
    }

    if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  return [-1, -1];
}`,
  },
  {
    id: 'tp-problem-2',
    topicId: 'two-pointers',
    title: 'Контейнер с максимальным объёмом воды',
    difficulty: 'medium',
    isContextual: false,
    description:
      'Дан массив неотрицательных целых чисел `height`, где каждый элемент представляет высоту вертикальной линии на координатной оси.\n\nНайдите две линии, которые вместе с осью X образуют контейнер, содержащий наибольшее количество воды.\n\nВерните максимальный объём воды, который может вместить контейнер.\n\nОбъём вычисляется как `min(height[i], height[j]) * (j - i)`.',
    functionName: 'maxArea',
    starterCode: `function maxArea(height: number[]): number {
  // ваш код
}`,
    testCases: [
      {
        id: 'tp2-tc1',
        inputDisplay: 'maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])',
        inputArgs: [[1, 8, 6, 2, 5, 4, 8, 3, 7]],
        expected: 49,
      },
      {
        id: 'tp2-tc2',
        inputDisplay: 'maxArea([1, 1])',
        inputArgs: [[1, 1]],
        expected: 1,
      },
      {
        id: 'tp2-tc3',
        inputDisplay: 'maxArea([4, 3, 2, 1, 4])',
        inputArgs: [[4, 3, 2, 1, 4]],
        expected: 16,
      },
      {
        id: 'tp2-tc4',
        inputDisplay: 'maxArea([1, 2, 1])',
        inputArgs: [[1, 2, 1]],
        expected: 2,
      },
      {
        id: 'tp2-tc5',
        inputDisplay: 'maxArea([2, 3, 10, 5, 7, 8, 9])',
        inputArgs: [[2, 3, 10, 5, 7, 8, 9]],
        expected: 36,
      },
    ],
    hints: [
      'Переборе всех пар — O(n²). Можно ли лучше?',
      'Начните с самого широкого контейнера: left = 0, right = длина - 1.',
      'Двигайте тот указатель, чья высота меньше — так есть шанс найти более высокую линию.',
    ],
    solutionCode: `function maxArea(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let max = 0;

  while (left < right) {
    const width = right - left;
    const h = Math.min(height[left], height[right]);
    max = Math.max(max, width * h);

    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return max;
}`,
  },
  {
    id: 'tp-problem-3',
    topicId: 'two-pointers',
    title: 'Оптимальные пары товаров',
    difficulty: 'medium',
    isContextual: true,
    description:
      'В маркетплейсе проходит акция: покупатель может выбрать ровно два товара, и их суммарная стоимость не должна превышать бюджет.\n\nДан отсортированный по возрастанию массив цен `prices` и число `budget` — бюджет покупателя.\n\nНайдите пару товаров, суммарная цена которых максимально близка к бюджету, но не превышает его. Верните массив из двух цен этих товаров (в порядке возрастания).\n\nЕсли ни одна пара не укладывается в бюджет, верните пустой массив.\n\nЕсли несколько пар дают одинаковую сумму, верните любую из них.',
    functionName: 'findBestPair',
    starterCode: `function findBestPair(prices: number[], budget: number): number[] {
  // ваш код
}`,
    testCases: [
      {
        id: 'tp3-tc1',
        inputDisplay: 'findBestPair([100, 200, 300, 400, 500], 600)',
        inputArgs: [[100, 200, 300, 400, 500], 600],
        expected: [100, 500],
      },
      {
        id: 'tp3-tc2',
        inputDisplay: 'findBestPair([50, 100, 150, 200], 250)',
        inputArgs: [[50, 100, 150, 200], 250],
        expected: [50, 200],
      },
      {
        id: 'tp3-tc3',
        inputDisplay: 'findBestPair([10, 20, 30, 40, 50], 100)',
        inputArgs: [[10, 20, 30, 40, 50], 100],
        expected: [40, 50],
      },
      {
        id: 'tp3-tc4',
        inputDisplay: 'findBestPair([500, 600], 400)',
        inputArgs: [[500, 600], 400],
        expected: [],
      },
      {
        id: 'tp3-tc5',
        inputDisplay: 'findBestPair([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 15)',
        inputArgs: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 15],
        expected: [5, 10],
      },
    ],
    hints: [
      'Массив уже отсортирован — используйте два указателя.',
      'left в начале, right в конце. Если сумма <= budget, это кандидат на лучшую пару.',
      'Обновляйте лучший результат каждый раз, когда находите пару с суммой <= budget, и двигайте left++. Если сумма > budget — двигайте right--.',
    ],
    solutionCode: `function findBestPair(prices: number[], budget: number): number[] {
  let left = 0;
  let right = prices.length - 1;
  let bestPair: number[] = [];
  let bestSum = -1;

  while (left < right) {
    const sum = prices[left] + prices[right];

    if (sum <= budget) {
      if (sum > bestSum) {
        bestSum = sum;
        bestPair = [prices[left], prices[right]];
      }
      left++;
    } else {
      right--;
    }
  }

  return bestPair;
}`,
  },
  {
    id: 'tp-p4',
    topicId: 'two-pointers',
    title: 'Подбор размеров одежды',
    difficulty: 'easy',
    isContextual: true,
    description: `В интернет-магазине есть отсортированный массив доступных размеров одежды sizes. Покупатель хочет размер target. Если точного размера нет, нужно вернуть два ближайших размера (меньший и больший). Если точный есть — вернуть его дважды [target, target].

Крайние случаи:
- Если нет размера меньше target, вернуть [ближайший больший, ближайший больший].
- Если нет размера больше target, вернуть [ближайший меньший, ближайший меньший].

Примеры:
- findClosestSizes([36, 38, 40, 42, 44], 41) => [40, 42]
- findClosestSizes([36, 38, 40, 42], 40) => [40, 40]
- findClosestSizes([38, 42, 46], 35) => [38, 38]`,
    functionName: 'findClosestSizes',
    starterCode: `function findClosestSizes(sizes, target) {
  // ваш код
}`,
    testCases: [
      {
        id: 'tp-p4-t1',
        inputDisplay: 'findClosestSizes([36, 38, 40, 42, 44], 41)',
        inputArgs: [[36, 38, 40, 42, 44], 41],
        expected: [40, 42],
      },
      {
        id: 'tp-p4-t2',
        inputDisplay: 'findClosestSizes([36, 38, 40, 42], 40)',
        inputArgs: [[36, 38, 40, 42], 40],
        expected: [40, 40],
      },
      {
        id: 'tp-p4-t3',
        inputDisplay: 'findClosestSizes([38, 42, 46], 35)',
        inputArgs: [[38, 42, 46], 35],
        expected: [38, 38],
      },
      {
        id: 'tp-p4-t4',
        inputDisplay: 'findClosestSizes([38, 42, 46], 50)',
        inputArgs: [[38, 42, 46], 50],
        expected: [46, 46],
      },
      {
        id: 'tp-p4-t5',
        inputDisplay: 'findClosestSizes([36, 38, 40, 42, 44, 46], 43)',
        inputArgs: [[36, 38, 40, 42, 44, 46], 43],
        expected: [42, 44],
      },
    ],
    hints: [
      'Найдите позицию вставки target в отсортированном массиве',
      'Сравните arr[pos-1] и arr[pos] с target',
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
    id: 'tp-p5',
    topicId: 'two-pointers',
    title: 'Фильтрация дубликатов в ленте',
    difficulty: 'medium',
    isContextual: true,
    description: `В ленте объявлений массив отсортирован по цене, но есть дубликаты. Нужно вернуть новый массив без дубликатов (не мутировать исходный). Решите за O(n) времени.

Примеры:
- removeDuplicates([1, 1, 2, 3, 3, 4]) => [1, 2, 3, 4]
- removeDuplicates([1, 1, 1]) => [1]
- removeDuplicates([1, 2, 3]) => [1, 2, 3]`,
    functionName: 'removeDuplicates',
    starterCode: `function removeDuplicates(arr) {
  // ваш код
}`,
    testCases: [
      {
        id: 'tp-p5-t1',
        inputDisplay: 'removeDuplicates([1, 1, 2, 3, 3, 4])',
        inputArgs: [[1, 1, 2, 3, 3, 4]],
        expected: [1, 2, 3, 4],
      },
      {
        id: 'tp-p5-t2',
        inputDisplay: 'removeDuplicates([1, 1, 1])',
        inputArgs: [[1, 1, 1]],
        expected: [1],
      },
      {
        id: 'tp-p5-t3',
        inputDisplay: 'removeDuplicates([1, 2, 3])',
        inputArgs: [[1, 2, 3]],
        expected: [1, 2, 3],
      },
      {
        id: 'tp-p5-t4',
        inputDisplay: 'removeDuplicates([])',
        inputArgs: [[]],
        expected: [],
      },
      {
        id: 'tp-p5-t5',
        inputDisplay: 'removeDuplicates([5])',
        inputArgs: [[5]],
        expected: [5],
      },
    ],
    hints: [
      'Два указателя: slow для записи, fast для чтения',
      'Если arr[fast] !== arr[fast-1], записываем',
    ],
    solutionCode: `function removeDuplicates(arr) {
  if (arr.length === 0) return [];

  const result = [arr[0]];

  for (let fast = 1; fast < arr.length; fast++) {
    if (arr[fast] !== arr[fast - 1]) {
      result.push(arr[fast]);
    }
  }

  return result;
}`,
  },
];
