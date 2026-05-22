import type { Problem } from '../../types/problem';

export const twoPointersProblems: Problem[] = [
  {
    id: 'tp-problem-1',
    topicId: 'two-pointers',
    title: 'Two Sum в отсортированном массиве',
    difficulty: 'easy',
    isContextual: false,
    description: `Дан отсортированный по возрастанию массив целых чисел \`numbers\` и целое число \`target\`.

Найдите **два числа**, которые в сумме дают \`target\`, и верните массив из двух их индексов (0-based).

Гарантируется, что решение существует и оно **единственное**. Нельзя использовать один и тот же элемент дважды.

**Примеры:**
\`\`\`
twoSum([2, 7, 11, 15], 9)  // → [0, 1]
twoSum([2, 3, 4], 6)       // → [0, 2]
twoSum([-1, 0], -1)        // → [0, 1]
\`\`\``,
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
      'Массив отсортирован — как это свойство позволяет не перебирать все пары?',
      'Куда сдвинуть указатель, если текущая сумма слишком мала? А если слишком велика?',
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
    description: `Дан массив неотрицательных целых чисел \`height\`, где каждый элемент представляет высоту вертикальной линии на координатной оси.

Найдите **две линии**, которые вместе с осью X образуют контейнер, содержащий наибольшее количество воды. Верните **максимальный объём** воды.

Объём вычисляется как:
\`\`\`
min(height[i], height[j]) * (j - i)
\`\`\`

**Примеры:**
\`\`\`
maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])  // → 49
maxArea([1, 1])                       // → 1
maxArea([4, 3, 2, 1, 4])              // → 16
\`\`\``,
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
      'Объём определяется двумя факторами: шириной и высотой. Как они связаны при сближении указателей?',
      'Какой из двух указателей имеет смысл двигать — и почему именно его, а не другой?',
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
    description: `В маркетплейсе проходит акция: покупатель может выбрать **ровно два** товара, и их суммарная стоимость не должна превышать бюджет.

Дан отсортированный по возрастанию массив цен \`prices\` и число \`budget\` — бюджет покупателя.

Найдите пару товаров, суммарная цена которых **максимально близка к бюджету**, но не превышает его. Верните массив из двух цен этих товаров (в порядке возрастания).

- Если ни одна пара не укладывается в бюджет — верните пустой массив.
- Если несколько пар дают одинаковую сумму — верните любую из них.

**Примеры:**
\`\`\`
findBestPair([100, 250, 300, 400, 500], 600)  // → [100, 500]
findBestPair([10, 20, 30, 40, 50], 100)       // → [40, 50]
findBestPair([500, 600], 400)                  // → []
\`\`\``,
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
      'Нужна наибольшая сумма, не превышающая budget. Как использовать отсортированность массива?',
      'Когда сумма укладывается в бюджет — это уже кандидат. Что нужно сделать, чтобы найти лучший?',
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
    description: `В ленте объявлений массив отсортирован по цене, но есть дубликаты. Нужно вернуть **новый массив без дубликатов** (исходный не мутировать). Решение должно работать за **O(n)**.

**Примеры:**
\`\`\`
removeDuplicates([1, 1, 2, 3, 3, 4])  // → [1, 2, 3, 4]
removeDuplicates([1, 1, 1])           // → [1]
removeDuplicates([1, 2, 3])           // → [1, 2, 3]
\`\`\``,
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
      'Как разделить роли двух указателей: один для чтения элементов, другой для записи уникальных?',
      'Когда элемент является «новым уникальным» и должен быть записан?',
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
      'Сравните цикл со стандартным шаблоном двух сходящихся указателей: оба указателя должны двигаться навстречу друг другу.',
      'Что произойдёт, когда `left` и `right` встретятся в середине строки?',
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
      'Линейный перебор всех пар работает, но неэффективен. Как отсортированность массива позволяет за один проход сократить число сравнений?',
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
  {
    id: 'tp-h1',
    topicId: 'two-pointers',
    kind: 'implement',
    title: 'Three Sum — все уникальные тройки с нулевой суммой',
    difficulty: 'hard',
    isContextual: false,
    description: `Дан массив целых чисел \`nums\`. Найдите **все уникальные тройки** \`[a, b, c]\` такие, что \`a + b + c === 0\`.

Тройки не должны повторяться: \`[-1, 0, 1]\` и \`[0, -1, 1]\` считаются одинаковыми.
Верните массив троек, каждая из которых отсортирована по возрастанию. Порядок троек в ответе — любой.

Примеры:
\`\`\`
threeSum([-1, 0, 1, 2, -1, -4])
// → [[-1, -1, 2], [-1, 0, 1]]

threeSum([0, 1, 1])   // → []
threeSum([0, 0, 0])   // → [[0, 0, 0]]
\`\`\``,
    functionName: 'threeSum_test',
    starterCode: `function threeSum(nums) {
  // ваш код
}`,
    testCases: [
      {
        id: 'tp-h1-t1',
        inputDisplay: 'threeSum([-1,0,1,2,-1,-4])',
        inputArgs: [[-1, 0, 1, 2, -1, -4]],
        expected: [[-1, -1, 2], [-1, 0, 1]],
      },
      {
        id: 'tp-h1-t2',
        inputDisplay: 'threeSum([0,1,1]) → []',
        inputArgs: [[0, 1, 1]],
        expected: [],
      },
      {
        id: 'tp-h1-t3',
        inputDisplay: 'threeSum([0,0,0]) → [[0,0,0]]',
        inputArgs: [[0, 0, 0]],
        expected: [[0, 0, 0]],
      },
      {
        id: 'tp-h1-t4',
        inputDisplay: 'threeSum([-2,0,0,2,2]) → [[-2,0,2]]',
        inputArgs: [[-2, 0, 0, 2, 2]],
        expected: [[-2, 0, 2]],
      },
      {
        id: 'tp-h1-t5',
        inputDisplay: 'threeSum([-4,-2,-2,-2,0,1,2,2,2,3,3,4,4,6,6])',
        inputArgs: [[-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6]],
        expected: [[-4,-2,6],[-4,0,4],[-4,1,3],[-4,2,2],[-2,-2,4],[-2,0,2]],
      },
    ],
    hints: [
      'Задача на два указателя, но с тремя числами. Как свести к задаче с двумя — фиксируя одно?',
      'Как избежать дублирующихся троек в результате? Что нужно сделать с отсортированным массивом, чтобы пропускать повторы?',
    ],
    solutionCode: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }

  return result;
}`,
    testHelperCode: `function threeSum_test(nums) {
  const res = threeSum(nums);
  res.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
  return res;
}`,
  },
  {
    id: 'tp-h2',
    topicId: 'two-pointers',
    kind: 'implement',
    title: 'Ловушка для дождевой воды',
    difficulty: 'hard',
    isContextual: false,
    description: `Дан массив \`height\`, где каждый элемент обозначает высоту столбца. Найдите общий объём воды, который задерживается между столбцами после дождя.

Вода держится там, где с обеих сторон есть столбцы выше текущего.

Примеры:
\`\`\`
trap([0,1,0,2,1,0,1,3,2,1,2,1])  // → 6
trap([4,2,0,3,2,5])               // → 9
trap([3,0,3])                     // → 3
trap([1,2,3,4,5])                 // → 0  (вода не задерживается)
\`\`\`

Решение за O(n) времени и O(1) памяти — через два указателя.`,
    functionName: 'trap',
    starterCode: `function trap(height) {
  // ваш код
}`,
    testCases: [
      { id: 'tp-h2-t1', inputDisplay: 'trap([0,1,0,2,1,0,1,3,2,1,2,1])', inputArgs: [[0,1,0,2,1,0,1,3,2,1,2,1]], expected: 6 },
      { id: 'tp-h2-t2', inputDisplay: 'trap([4,2,0,3,2,5])', inputArgs: [[4,2,0,3,2,5]], expected: 9 },
      { id: 'tp-h2-t3', inputDisplay: 'trap([3,0,3])', inputArgs: [[3,0,3]], expected: 3 },
      { id: 'tp-h2-t4', inputDisplay: 'trap([1,2,3,4,5]) → 0', inputArgs: [[1,2,3,4,5]], expected: 0 },
      { id: 'tp-h2-t5', inputDisplay: 'trap([5,4,3,2,1]) → 0', inputArgs: [[5,4,3,2,1]], expected: 0 },
      { id: 'tp-h2-t6', inputDisplay: 'trap([2,0,2])', inputArgs: [[2,0,2]], expected: 2 },
    ],
    hints: [
      'Количество воды над каждой позицией зависит от максимальных высот слева и справа. Как не считать их заново для каждой позиции?',
      'Можно хранить два массива максимумов, но есть способ обойтись двумя указателями и O(1) памяти. Какой инвариант при этом поддерживается?',
    ],
    solutionCode: `function trap(height) {
  let left = 0, right = height.length - 1;
  let maxLeft = 0, maxRight = 0;
  let water = 0;

  while (left < right) {
    if (height[left] <= height[right]) {
      if (height[left] >= maxLeft) {
        maxLeft = height[left];
      } else {
        water += maxLeft - height[left];
      }
      left++;
    } else {
      if (height[right] >= maxRight) {
        maxRight = height[right];
      } else {
        water += maxRight - height[right];
      }
      right--;
    }
  }

  return water;
}`,
  },
  {
    id: 'tp-e2',
    topicId: 'two-pointers',
    title: 'Перемещение нулей в конец массива',
    difficulty: 'easy',
    isContextual: false,
    description: `Дан массив целых чисел \`nums\`. Переместите все нули в конец массива, сохранив **относительный порядок** ненулевых элементов.

Функция должна возвращать **изменённый массив** (но операцию выполнять in-place с O(1) дополнительной памяти).

Примеры:
\`\`\`
moveZeroes([0, 1, 0, 3, 12])    // → [1, 3, 12, 0, 0]
moveZeroes([0])                  // → [0]
moveZeroes([1, 2, 3])            // → [1, 2, 3]
moveZeroes([0, 0, 1])            // → [1, 0, 0]
\`\`\`

Классическая задача на два указателя: решается за один проход — O(n) время, O(1) дополнительной памяти.`,
    functionName: 'moveZeroes',
    starterCode: `function moveZeroes(nums) {
  // in-place, верните тот же массив
}`,
    testCases: [
      { id: 'tp-e2-t1', inputDisplay: 'moveZeroes([0,1,0,3,12])', inputArgs: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0] },
      { id: 'tp-e2-t2', inputDisplay: 'moveZeroes([0])', inputArgs: [[0]], expected: [0] },
      { id: 'tp-e2-t3', inputDisplay: 'moveZeroes([1,2,3])', inputArgs: [[1, 2, 3]], expected: [1, 2, 3] },
      { id: 'tp-e2-t4', inputDisplay: 'moveZeroes([0,0,1])', inputArgs: [[0, 0, 1]], expected: [1, 0, 0] },
      { id: 'tp-e2-t5', inputDisplay: 'moveZeroes([1,0,2,0,3,0])', inputArgs: [[1, 0, 2, 0, 3, 0]], expected: [1, 2, 3, 0, 0, 0] },
      { id: 'tp-e2-t6', inputDisplay: 'moveZeroes([])', inputArgs: [[]], expected: [] },
    ],
    hints: [
      'Один указатель отмечает позицию для записи следующего ненулевого элемента. Второй сканирует массив.',
      'После того как все ненулевые элементы скопированы вперёд — что нужно сделать с оставшимся хвостом?',
    ],
    solutionCode: `function moveZeroes(nums) {
  let writeIdx = 0;
  for (let readIdx = 0; readIdx < nums.length; readIdx++) {
    if (nums[readIdx] !== 0) {
      nums[writeIdx] = nums[readIdx];
      writeIdx++;
    }
  }
  for (let i = writeIdx; i < nums.length; i++) {
    nums[i] = 0;
  }
  return nums;
}`,
  },
  {
    id: 'tp-h3',
    topicId: 'two-pointers',
    kind: 'implement',
    title: '4Sum — все уникальные четвёрки с заданной суммой',
    difficulty: 'hard',
    isContextual: false,
    description: `Дан массив целых чисел \`nums\` и целое число \`target\`. Верните **все уникальные четвёрки** \`[a, b, c, d]\` из элементов массива (по индексам), такие что \`a + b + c + d === target\`.

Каждая четвёрка должна быть отсортирована по возрастанию, и сам результат — массив уникальных четвёрок, отсортированный лексикографически.

Примеры:
\`\`\`
fourSum([1, 0, -1, 0, -2, 2], 0)
// → [[-2,-1,1,2], [-2,0,0,2], [-1,0,0,1]]

fourSum([2, 2, 2, 2, 2], 8)
// → [[2,2,2,2]]

fourSum([1, 2, 3, 4], 100)
// → []
\`\`\`

Классическое расширение 3Sum: внешний цикл по a, второй цикл по b, и two-pointer для пары c, d. Сложность O(n³). Будьте внимательны с пропуском дубликатов.`,
    functionName: 'fourSum',
    starterCode: `function fourSum(nums, target) {
  // ваш код
}`,
    testCases: [
      {
        id: 'tp-h3-t1',
        inputDisplay: 'fourSum([1,0,-1,0,-2,2], 0)',
        inputArgs: [[1, 0, -1, 0, -2, 2], 0],
        expected: [[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]],
      },
      {
        id: 'tp-h3-t2',
        inputDisplay: 'fourSum([2,2,2,2,2], 8)',
        inputArgs: [[2, 2, 2, 2, 2], 8],
        expected: [[2, 2, 2, 2]],
      },
      {
        id: 'tp-h3-t3',
        inputDisplay: 'fourSum([1,2,3,4], 100)',
        inputArgs: [[1, 2, 3, 4], 100],
        expected: [],
      },
      {
        id: 'tp-h3-t4',
        inputDisplay: 'fourSum([], 0)',
        inputArgs: [[], 0],
        expected: [],
      },
      {
        id: 'tp-h3-t5',
        inputDisplay: 'fourSum([-3,-2,-1,0,0,1,2,3], 0)',
        inputArgs: [[-3, -2, -1, 0, 0, 1, 2, 3], 0],
        expected: [
          [-3, -2, 2, 3],
          [-3, -1, 1, 3],
          [-3, 0, 0, 3],
          [-3, 0, 1, 2],
          [-2, -1, 0, 3],
          [-2, -1, 1, 2],
          [-2, 0, 0, 2],
          [-1, 0, 0, 1],
        ],
      },
    ],
    hints: [
      'Отсортируйте массив. После этого структура задачи похожа на 3Sum, обёрнутый в дополнительный цикл.',
      'Чтобы избежать дубликатов: пропускайте равные значения для каждого «фиксированного» индекса.',
      'На внутренних позициях используйте классический two-pointer: при недоборе — двигайте левый вперёд, при переборе — правый назад.',
    ],
    solutionCode: `function fourSum(nums, target) {
  const arr = [...nums].sort((a, b) => a - b);
  const n = arr.length;
  const result = [];

  for (let i = 0; i < n - 3; i++) {
    if (i > 0 && arr[i] === arr[i - 1]) continue;
    for (let j = i + 1; j < n - 2; j++) {
      if (j > i + 1 && arr[j] === arr[j - 1]) continue;
      let left = j + 1;
      let right = n - 1;
      while (left < right) {
        const sum = arr[i] + arr[j] + arr[left] + arr[right];
        if (sum === target) {
          result.push([arr[i], arr[j], arr[left], arr[right]]);
          while (left < right && arr[left] === arr[left + 1]) left++;
          while (left < right && arr[right] === arr[right - 1]) right--;
          left++;
          right--;
        } else if (sum < target) {
          left++;
        } else {
          right--;
        }
      }
    }
  }

  return result;
}`,
  },
  {
    id: 'tp-h4',
    topicId: 'two-pointers',
    kind: 'implement',
    title: 'Самая длинная палиндромная подстрока',
    difficulty: 'hard',
    isContextual: false,
    description: `Дана строка \`s\`. Верните **самую длинную палиндромную подстроку** в \`s\`. Если таких несколько — верните любую (тесты принимают конкретный результат, см. примеры).

**Решение должно быть O(n²) или лучше** — за O(n³) (перебор всех подстрок) не принимается.

Подход **«расширение от центра»** (expand around center): для каждой позиции \`i\` пробуйте расширять палиндром в обе стороны, считая её центром. Палиндром может иметь нечётную длину (\`aba\`) или чётную (\`abba\`).

Примеры:
\`\`\`
longestPalindrome('babad')   // → 'bab'  ('aba' тоже корректно, но принимаем 'bab')
longestPalindrome('cbbd')    // → 'bb'
longestPalindrome('a')       // → 'a'
longestPalindrome('ac')      // → 'a'
longestPalindrome('racecar') // → 'racecar'
\`\`\``,
    functionName: 'longestPalindrome',
    starterCode: `function longestPalindrome(s) {
  // ваш код — O(n^2) max
}`,
    testCases: [
      { id: 'tp-h4-t1', inputDisplay: "longestPalindrome('babad')", inputArgs: ['babad'], expected: 'bab' },
      { id: 'tp-h4-t2', inputDisplay: "longestPalindrome('cbbd')", inputArgs: ['cbbd'], expected: 'bb' },
      { id: 'tp-h4-t3', inputDisplay: "longestPalindrome('a')", inputArgs: ['a'], expected: 'a' },
      { id: 'tp-h4-t4', inputDisplay: "longestPalindrome('ac')", inputArgs: ['ac'], expected: 'a' },
      { id: 'tp-h4-t5', inputDisplay: "longestPalindrome('racecar')", inputArgs: ['racecar'], expected: 'racecar' },
      { id: 'tp-h4-t6', inputDisplay: "longestPalindrome('abacdfgdcaba')", inputArgs: ['abacdfgdcaba'], expected: 'aba' },
    ],
    hints: [
      'Каждая позиция (или щель между двумя символами) может быть центром палиндрома. Сколько таких центров всего?',
      'Из каждого центра расширяйтесь двумя указателями пока s[left] === s[right]. Запоминайте максимальный найденный сегмент.',
      'Палиндром может быть нечётной длины (центр — символ) или чётной (центр — между двумя одинаковыми символами).',
    ],
    solutionCode: `function longestPalindrome(s) {
  if (!s) return '';
  let bestStart = 0;
  let bestLen = 1;

  function expand(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    const start = left + 1;
    const len = right - left - 1;
    if (len > bestLen) {
      bestStart = start;
      bestLen = len;
    }
  }

  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }

  return s.slice(bestStart, bestStart + bestLen);
}`,
  },
];
