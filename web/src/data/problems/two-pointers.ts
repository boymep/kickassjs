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
    starterCode: `function twoSum(numbers, target) {
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
    solutionCode: `function twoSum(numbers, target) {
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
    starterCode: `function maxArea(height) {
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
    solutionCode: `function maxArea(height) {
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
    starterCode: `function findBestPair(prices, budget) {
  // ваш код
}`,
    testCases: [
      {
        id: 'tp3-tc1',
        inputDisplay: 'findBestPair([100, 250, 300, 400, 500], 600)',
        inputArgs: [[100, 250, 300, 400, 500], 600],
        expected: [100, 500],
      },
      {
        id: 'tp3-tc2',
        inputDisplay: 'findBestPair([50, 120, 150, 200], 250)',
        inputArgs: [[50, 120, 150, 200], 250],
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
        inputDisplay: 'findBestPair([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 18)',
        inputArgs: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 18],
        expected: [8, 10],
      },
    ],
    hints: [
      'Массив уже отсортирован — используйте два указателя.',
      'left в начале, right в конце. Если сумма <= budget, это кандидат на лучшую пару.',
      'Обновляйте лучший результат каждый раз, когда находите пару с суммой <= budget, и двигайте left++. Если сумма > budget — двигайте right--.',
    ],
    solutionCode: `function findBestPair(prices, budget) {
  let left = 0;
  let right = prices.length - 1;
  let bestPair = [];
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
  {
    id: 'tp-p6',
    topicId: 'two-pointers',
    kind: 'predict-output',
    title: 'Трассировка Two Sum II',
    difficulty: 'easy',
    isContextual: false,
    description: `Перед вами реализация Two Sum на отсортированном массиве с логированием каждого шага. Предскажите вывод программы.

Каждая итерация печатает строку формата \`left=L right=R sum=S\`, а итоговая строка содержит найденную пару индексов.`,
    code: `function twoSum(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];
    console.log('left=' + left + ' right=' + right + ' sum=' + sum);
    if (sum === target) {
      console.log('found ' + left + ',' + right);
      return;
    }
    if (sum < target) left++;
    else right--;
  }
}

twoSum([1, 2, 4, 7, 11, 15], 13);`,
    expected: `left=0 right=5 sum=16
left=0 right=4 sum=12
left=1 right=4 sum=13
found 1,4`,
    hints: [
      'Считайте sum = nums[left] + nums[right] на каждой итерации.',
      'Если sum > target — сдвигается right, если sum < target — left.',
      'Как только sum === target, печатается строка found и функция возвращается.',
    ],
    solutionCode: `// Трассировка по шагам:
// left=0 right=5 sum=1+15=16 (>13) → right--
// left=0 right=4 sum=1+11=12 (<13) → left++
// left=1 right=4 sum=2+11=13 (===13) → found 1,4`,
  },
  {
    id: 'tp-p7',
    topicId: 'two-pointers',
    kind: 'find-bug',
    title: 'Найдите баг: проверка палиндрома',
    difficulty: 'easy',
    isContextual: false,
    description: `Функция \`isPalindrome\` должна возвращать \`true\` для палиндромов и \`false\` иначе. Реализация выглядит правильно, но тесты падают.

Найдите ошибку в сдвиге указателей и исправьте её. Подсказка: проверьте, оба ли указателя движутся к центру.`,
    functionName: 'isPalindrome',
    buggyCode: `function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
  }

  return true;
}`,
    bugSummary:
      'В теле цикла сдвигается только `left`, а `right` остаётся на месте. После первого совпадения `left` начинает сравниваться с тем же правым символом, и для любого нетривиального палиндрома вторая итерация почти всегда возвращает `false`. Правильное поведение — двигать оба указателя навстречу друг другу: `left++` и `right--`.',
    testCases: [
      {
        id: 'tp-p7-t1',
        inputDisplay: "isPalindrome('racecar')",
        inputArgs: ['racecar'],
        expected: true,
      },
      {
        id: 'tp-p7-t2',
        inputDisplay: "isPalindrome('level')",
        inputArgs: ['level'],
        expected: true,
      },
      {
        id: 'tp-p7-t3',
        inputDisplay: "isPalindrome('hello')",
        inputArgs: ['hello'],
        expected: false,
      },
      {
        id: 'tp-p7-t4',
        inputDisplay: "isPalindrome('a')",
        inputArgs: ['a'],
        expected: true,
      },
      {
        id: 'tp-p7-t5',
        inputDisplay: "isPalindrome('ab')",
        inputArgs: ['ab'],
        expected: false,
      },
      {
        id: 'tp-p7-t6',
        inputDisplay: "isPalindrome('')",
        inputArgs: [''],
        expected: true,
      },
    ],
    hints: [
      'Сравните условие цикла со стандартным шаблоном converging-pointers.',
      'Что произойдёт, когда left и right встретятся в середине строки?',
      'Какой инвариант гарантирует, что элемент не сравнивается сам с собой?',
    ],
    solutionCode: `function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }

  return true;
}`,
  },
  {
    id: 'tp-p8',
    topicId: 'two-pointers',
    kind: 'refactor',
    title: 'Рефакторинг: Two Sum за O(n) вместо O(n²)',
    difficulty: 'medium',
    isContextual: false,
    description: `Перед вами рабочая, но медленная реализация задачи Two Sum на **отсортированном** массиве. Она перебирает все пары вложенными циклами за O(n²).

Перепишите её на технику двух указателей за O(n). Решение должно проходить тест производительности: 100 000 элементов за 50 мс.

Функция возвращает массив из двух 0-based индексов первой найденной пары с суммой \`target\`. Если пара не найдена — \`[-1, -1]\`.`,
    functionName: 'twoSum',
    starterCode: `function twoSum(numbers, target) {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      if (numbers[i] + numbers[j] === target) {
        return [i, j];
      }
    }
  }
  return [-1, -1];
}`,
    testCases: [
      {
        id: 'tp-p8-t1',
        inputDisplay: 'twoSum([2, 7, 11, 15], 9)',
        inputArgs: [[2, 7, 11, 15], 9],
        expected: [0, 1],
      },
      {
        id: 'tp-p8-t2',
        inputDisplay: 'twoSum([1, 3, 5, 7, 9], 14)',
        inputArgs: [[1, 3, 5, 7, 9], 14],
        expected: [2, 4],
      },
      {
        id: 'tp-p8-t3',
        inputDisplay: 'twoSum([-3, -1, 0, 2, 5], 1)',
        inputArgs: [[-3, -1, 0, 2, 5], 1],
        expected: [1, 3],
      },
      {
        id: 'tp-p8-t4',
        inputDisplay: 'twoSum([1, 2, 3], 100)',
        inputArgs: [[1, 2, 3], 100],
        expected: [-1, -1],
      },
      {
        id: 'tp-p8-t5',
        inputDisplay: 'twoSum([1, 2], 3)',
        inputArgs: [[1, 2], 3],
        expected: [0, 1],
      },
    ],
    perfTest: {
      // Отсортированный массив длиной 100 000, target — сумма последних двух элементов,
      // что заставляет наивное O(n²)-решение выполнить ~5×10^9 итераций и упасть по таймауту.
      inputArgs: [
        Array.from({ length: 100000 }, (_, i) => i + 1),
        100000 + 99999,
      ],
      maxMs: 50,
    },
    hints: [
      'Массив уже отсортирован — это ключевая подсказка.',
      'Поставьте left в начало, right в конец и двигайте указатели в зависимости от знака `sum - target`.',
      'Каждая итерация сдвигает один указатель → суммарно не больше n шагов.',
    ],
    solutionCode: `function twoSum(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }

  return [-1, -1];
}`,
  },
];
