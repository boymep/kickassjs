import type { TopicQuiz } from '../../types/quiz';

export const binarySearchQuiz: TopicQuiz = {
  topicId: 'binary-search',
  questions: [
    // ==================== BASIC (1-6) ====================
    {
      type: 'fill-blank',
      id: 'bs-q1',
      description: 'Классический бинарный поиск: какое выражение нужно подставить для вычисления среднего индекса?',
      codeWithBlanks: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = ___BLANK___;

    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}`,
      options: [
        'Math.floor((left + right) / 2)',
        '(left + right) / 2',
        'Math.ceil((left + right) / 2)',
        'left + Math.floor((right - left) / 2)',
      ],
      correctIndex: 0,
      explanation:
        'Math.floor((left + right) / 2) — стандартный способ вычисления среднего индекса. Вариант left + Math.floor((right - left) / 2) тоже корректен и защищает от переполнения в других языках, но в JavaScript переполнение целых чисел не проблема. Вариант без Math.floor даст дробный индекс, а Math.ceil может привести к бесконечному циклу.',
    },
    {
      type: 'output',
      id: 'bs-q2',
      description: 'Что вернёт вызов binarySearch([1, 3, 5, 7, 9], 5)?',
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

console.log(binarySearch([1, 3, 5, 7, 9], 5));`,
      options: ['0', '1', '2', '3'],
      correctIndex: 2,
      explanation:
        'Элемент 5 находится по индексу 2 в массиве [1, 3, 5, 7, 9]. На первой итерации mid = 2, arr[2] = 5 === 5, поэтому сразу возвращается 2.',
    },
    {
      type: 'fill-blank',
      id: 'bs-q3',
      description: 'Поиск левой границы: когда arr[mid] >= target, что мы делаем, чтобы продолжить поиск первого вхождения?',
      codeWithBlanks: `function searchLeftBound(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] >= target) {
      ___BLANK___;
    } else {
      left = mid + 1;
    }
  }

  return left < arr.length && arr[left] === target ? left : -1;
}`,
      options: [
        'right = mid - 1',
        'left = mid + 1',
        'return mid',
        'right = mid',
      ],
      correctIndex: 0,
      explanation:
        'Чтобы найти первое (левое) вхождение target, при arr[mid] >= target мы сдвигаем right = mid - 1 и продолжаем поиск левее. Когда цикл завершится, left будет указывать на первое вхождение target (если оно есть).',
    },
    {
      type: 'tracing',
      id: 'bs-q4',
      description: 'Проследите выполнение бинарного поиска числа 8 в массиве [2, 4, 6, 8, 10, 12].',
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

binarySearch([2, 4, 6, 8, 10, 12], 8);`,
      steps: [
        {
          label: 'Итерация 1',
          variables: { left: 0, right: 5, mid: 2, 'arr[mid]': 6 },
        },
        {
          label: 'Итерация 2',
          variables: { left: 3, right: 5, mid: 4, 'arr[mid]': 10 },
        },
        {
          label: 'Итерация 3',
          variables: { left: 3, right: 3, mid: 3, 'arr[mid]': 8 },
        },
      ],
      question: 'Сколько итераций потребовалось для нахождения элемента 8?',
      options: ['1', '2', '3', '4'],
      correctIndex: 2,
      explanation:
        'Итерация 1: mid = 2, arr[2] = 6 < 8, сдвигаем left = 3. Итерация 2: mid = 4, arr[4] = 10 > 8, сдвигаем right = 3. Итерация 3: mid = 3, arr[3] = 8 === 8, нашли! Итого 3 итерации.',
    },
    {
      type: 'output',
      id: 'bs-q5',
      description: 'Что вернёт вызов searchInsert([1, 3, 5, 6], 2)?',
      code: `function searchInsert(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return left;
}

console.log(searchInsert([1, 3, 5, 6], 2));`,
      options: ['0', '1', '2', '3'],
      correctIndex: 1,
      explanation:
        'Ищем 2 в [1, 3, 5, 6]. Итерация 1: mid = 1, arr[1] = 3 > 2, right = 0. Итерация 2: mid = 0, arr[0] = 1 < 2, left = 1. Цикл завершается (left > right), возвращаем left = 1 — позицию, куда нужно вставить 2.',
    },
    {
      type: 'complexity',
      id: 'bs-q6',
      description: 'Какова временная сложность бинарного поиска в отсортированном массиве из n элементов?',
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
}`,
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctIndex: 1,
      explanation:
        'На каждой итерации область поиска сокращается вдвое. Начиная с n элементов, после k итераций остаётся n / 2^k элементов. Цикл завершится когда n / 2^k = 1, то есть k = log2(n). Поэтому временная сложность — O(log n).',
    },

    // ==================== INTERMEDIATE (7-12) ====================
    {
      type: 'fill-blank',
      id: 'bs-q7',
      description: 'Поиск правой границы (последнего вхождения target). Какое условие нужно вставить?',
      codeWithBlanks: `function searchRightBound(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  let result = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      result = mid;
      ___BLANK___;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result;
}`,
      options: [
        'left = mid + 1',
        'right = mid - 1',
        'return mid',
        'left = mid',
      ],
      correctIndex: 0,
      explanation:
        'Чтобы найти последнее (правое) вхождение target, при нахождении совпадения мы запоминаем результат и сдвигаем left = mid + 1, чтобы продолжить поиск правее. Так мы найдём самое правое вхождение.',
    },
    {
      type: 'output',
      id: 'bs-q8',
      description: 'Что вернёт вызов searchInsert([1, 3, 5, 6], 7)?',
      code: `function searchInsert(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return left;
}

console.log(searchInsert([1, 3, 5, 6], 7));`,
      options: ['2', '3', '4', '-1'],
      correctIndex: 2,
      explanation:
        'Ищем 7 в [1, 3, 5, 6]. Итерация 1: mid = 1, arr[1] = 3 < 7, left = 2. Итерация 2: mid = 2, arr[2] = 5 < 7, left = 3. Итерация 3: mid = 3, arr[3] = 6 < 7, left = 4. Цикл завершается, возвращаем left = 4 — позиция вставки за концом массива.',
    },
    {
      type: 'tracing',
      id: 'bs-q9',
      description: 'Проследите выполнение поиска левой границы числа 5 в массиве [1, 3, 5, 5, 5, 8, 10].',
      code: `function searchLeftBound(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] >= target) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return left < arr.length && arr[left] === target ? left : -1;
}

searchLeftBound([1, 3, 5, 5, 5, 8, 10], 5);`,
      steps: [
        {
          label: 'Итерация 1',
          variables: { left: 0, right: 6, mid: 3, 'arr[mid]': 5 },
        },
        {
          label: 'Итерация 2',
          variables: { left: 0, right: 2, mid: 1, 'arr[mid]': 3 },
        },
        {
          label: 'Итерация 3',
          variables: { left: 2, right: 2, mid: 2, 'arr[mid]': 5 },
        },
        {
          label: 'Итерация 4',
          variables: { left: 2, right: 1, mid: '-', 'arr[mid]': '-' },
        },
      ],
      question: 'Какое значение вернёт функция?',
      options: ['1', '2', '3', '-1'],
      correctIndex: 1,
      explanation:
        'Итерация 1: mid = 3, arr[3] = 5 >= 5, right = 2. Итерация 2: mid = 1, arr[1] = 3 < 5, left = 2. Итерация 3: mid = 2, arr[2] = 5 >= 5, right = 1. Цикл завершается (left = 2 > right = 1). arr[2] = 5 === target, возвращаем 2 — индекс первого вхождения 5.',
    },
    {
      type: 'fill-blank',
      id: 'bs-q10',
      description: 'Поиск в повёрнутом отсортированном массиве: какое условие определяет, что левая половина отсортирована?',
      codeWithBlanks: `function searchRotated(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) return mid;

    if (___BLANK___) {
      // левая половина отсортирована
      if (target >= nums[left] && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // правая половина отсортирована
      if (target > nums[mid] && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return -1;
}`,
      options: [
        'nums[left] <= nums[mid]',
        'nums[mid] <= nums[right]',
        'nums[left] < nums[right]',
        'nums[mid] > nums[right]',
      ],
      correctIndex: 0,
      explanation:
        'Условие nums[left] <= nums[mid] означает, что от left до mid нет точки поворота, то есть левая половина отсортирована. Знак <= (а не <) нужен для случая, когда left === mid (подмассив из одного элемента). Это позволяет определить, в какой половине искать target.',
    },
    {
      type: 'output',
      id: 'bs-q11',
      description: 'Что вернёт вызов searchRotated([4, 5, 6, 7, 0, 1, 2], 0)?',
      code: `function searchRotated(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) return mid;

    if (nums[left] <= nums[mid]) {
      if (target >= nums[left] && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      if (target > nums[mid] && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return -1;
}

console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 0));`,
      options: ['3', '4', '5', '-1'],
      correctIndex: 1,
      explanation:
        'Итерация 1: left=0, right=6, mid=3, nums[3]=7. nums[0]=4 <= 7 — левая часть отсортирована. target=0 не в диапазоне [4,7), идём вправо: left=4. Итерация 2: left=4, right=6, mid=5, nums[5]=1. nums[4]=0 <= 1 — левая часть отсортирована. target=0 >= 0 и 0 < 1, идём влево: right=4. Итерация 3: left=4, right=4, mid=4, nums[4]=0 === 0, возвращаем 4.',
    },
    {
      type: 'complexity',
      id: 'bs-q12',
      description: 'Какова временная сложность поиска левой и правой границы элемента в отсортированном массиве, если мы выполняем два отдельных бинарных поиска?',
      code: `function countOccurrences(arr, target) {
  function searchLeft(arr, target) {
    let left = 0, right = arr.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid] >= target) right = mid - 1;
      else left = mid + 1;
    }
    return left;
  }

  function searchRight(arr, target) {
    let left = 0, right = arr.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid] <= target) left = mid + 1;
      else right = mid - 1;
    }
    return right;
  }

  const lo = searchLeft(arr, target);
  const hi = searchRight(arr, target);

  if (lo > hi) return 0;
  return hi - lo + 1;
}`,
      options: ['O(log n)', 'O(2 log n) = O(log n)', 'O(n)', 'O(n log n)'],
      correctIndex: 1,
      explanation:
        'Каждый бинарный поиск выполняется за O(log n). Два поиска — O(2 log n), но константный множитель не влияет на асимптотику, поэтому итоговая сложность O(log n). Это значительно лучше, чем линейный проход O(n).',
    },

    // ==================== HARDER MIDDLE (13-18) ====================
    {
      type: 'fill-blank',
      id: 'bs-q13',
      description: 'Бинарный поиск по ответу: поиск минимальной грузоподъёмности для перевозки всех посылок за days дней. Какое условие определяет, что текущей грузоподъёмности достаточно?',
      codeWithBlanks: `function shipWithinDays(weights, days) {
  let left = Math.max(...weights);
  let right = weights.reduce((a, b) => a + b, 0);

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    // Считаем, сколько дней нужно при грузоподъёмности mid
    let daysNeeded = 1;
    let currentLoad = 0;
    for (const w of weights) {
      if (currentLoad + w > mid) {
        daysNeeded++;
        currentLoad = 0;
      }
      currentLoad += w;
    }

    if (___BLANK___) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left;
}`,
      options: [
        'daysNeeded <= days',
        'daysNeeded < days',
        'daysNeeded >= days',
        'daysNeeded === days',
      ],
      correctIndex: 0,
      explanation:
        'Если daysNeeded <= days, значит грузоподъёмности mid достаточно (или даже с запасом), и мы пробуем уменьшить её: right = mid. Если daysNeeded > days — грузоподъёмности не хватает, нужно увеличить: left = mid + 1. Мы ищем минимальную подходящую грузоподъёмность.',
    },
    {
      type: 'output',
      id: 'bs-q14',
      description: 'Что вернёт вызов findPeakElement([1, 2, 3, 1])?',
      code: `function findPeakElement(nums) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] > nums[mid + 1]) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left;
}

console.log(findPeakElement([1, 2, 3, 1]));`,
      options: ['0', '1', '2', '3'],
      correctIndex: 2,
      explanation:
        'Итерация 1: left=0, right=3, mid=1, nums[1]=2 < nums[2]=3, идём вправо: left=2. Итерация 2: left=2, right=3, mid=2, nums[2]=3 > nums[3]=1, идём влево: right=2. Цикл завершается (left === right === 2). Пик — элемент 3 по индексу 2.',
    },
    {
      type: 'tracing',
      id: 'bs-q15',
      description: 'Проследите выполнение бинарного поиска по ответу: найти минимальную грузоподъёмность для доставки weights=[1, 2, 3, 4, 5] за 3 дня.',
      code: `function shipWithinDays(weights, days) {
  let left = Math.max(...weights);   // 5
  let right = weights.reduce((a, b) => a + b, 0); // 15

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    let daysNeeded = 1;
    let currentLoad = 0;
    for (const w of weights) {
      if (currentLoad + w > mid) {
        daysNeeded++;
        currentLoad = 0;
      }
      currentLoad += w;
    }

    if (daysNeeded <= days) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left;
}

shipWithinDays([1, 2, 3, 4, 5], 3);`,
      steps: [
        {
          label: 'Итерация 1',
          variables: { left: 5, right: 15, mid: 10, daysNeeded: 2 },
        },
        {
          label: 'Итерация 2',
          variables: { left: 5, right: 10, mid: 7, daysNeeded: 2 },
        },
        {
          label: 'Итерация 3',
          variables: { left: 5, right: 7, mid: 6, daysNeeded: 3 },
        },
        {
          label: 'Итерация 4',
          variables: { left: 5, right: 6, mid: 5, daysNeeded: 4 },
        },
        {
          label: 'Итерация 5',
          variables: { left: 6, right: 6, mid: '-', daysNeeded: '-' },
        },
      ],
      question: 'Какое значение вернёт функция (минимальная грузоподъёмность)?',
      options: ['5', '6', '7', '10'],
      correctIndex: 1,
      explanation:
        'При mid=10: [1,2,3,4], [5] — 2 дня <= 3, right=10. При mid=7: [1,2,3], [4,5] — 2 дня <= 3, right=7. При mid=6: [1,2,3], [4], [5] — 3 дня <= 3, right=6. При mid=5: [1,2], [3], [4], [5] — 4 дня > 3, left=6. Цикл завершается (left === right === 6). Ответ: 6.',
    },
    {
      type: 'complexity',
      id: 'bs-q16',
      description: 'Какова временная сложность поиска минимальной грузоподъёмности методом бинарного поиска по ответу? n — количество посылок, S — суммарный вес.',
      code: `function shipWithinDays(weights, days) {
  let left = Math.max(...weights);
  let right = weights.reduce((a, b) => a + b, 0);

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    let daysNeeded = 1;
    let currentLoad = 0;
    for (const w of weights) {
      if (currentLoad + w > mid) {
        daysNeeded++;
        currentLoad = 0;
      }
      currentLoad += w;
    }

    if (daysNeeded <= days) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }

  return left;
}`,
      options: ['O(n)', 'O(n log n)', 'O(n log S)', 'O(S log n)'],
      correctIndex: 2,
      explanation:
        'Бинарный поиск работает по диапазону [max(weights), sum(weights)], то есть выполняет O(log S) итераций. На каждой итерации мы проходим по всем n посылкам для подсчёта дней — O(n). Итого: O(n log S), где S — суммарный вес всех посылок.',
    },
    {
      type: 'output',
      id: 'bs-q17',
      description: 'Что вернёт вызов findMin([3, 4, 5, 1, 2]) — поиск минимума в повёрнутом массиве?',
      code: `function findMin(nums) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] > nums[right]) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return nums[left];
}

console.log(findMin([3, 4, 5, 1, 2]));`,
      options: ['3', '1', '5', '2'],
      correctIndex: 1,
      explanation:
        'Итерация 1: left=0, right=4, mid=2, nums[2]=5 > nums[4]=2, left=3. Итерация 2: left=3, right=4, mid=3, nums[3]=1 <= nums[4]=2, right=3. Цикл завершается (left === right === 3). nums[3] = 1 — минимальный элемент массива.',
    },
    {
      type: 'tracing',
      id: 'bs-q18',
      description: 'Проследите выполнение бинарного поиска квадратного корня из 10 (целочисленный результат).',
      code: `function mySqrt(x) {
  if (x < 2) return x;

  let left = 1;
  let right = Math.floor(x / 2);

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const sq = mid * mid;

    if (sq === x) return mid;
    else if (sq < x) left = mid + 1;
    else right = mid - 1;
  }

  return right;
}

mySqrt(10);`,
      steps: [
        {
          label: 'Итерация 1',
          variables: { left: 1, right: 5, mid: 3, sq: 9 },
        },
        {
          label: 'Итерация 2',
          variables: { left: 4, right: 5, mid: 4, sq: 16 },
        },
        {
          label: 'Итерация 3',
          variables: { left: 4, right: 3, mid: '-', sq: '-' },
        },
      ],
      question: 'Какое значение вернёт функция?',
      options: ['2', '3', '4', '5'],
      correctIndex: 1,
      explanation:
        'Итерация 1: mid=3, 3*3=9 < 10, left=4. Итерация 2: mid=4, 4*4=16 > 10, right=3. Цикл завершается (left=4 > right=3). Возвращаем right=3. Действительно, floor(sqrt(10)) = 3, поскольку 3*3=9 <= 10, а 4*4=16 > 10.',
    },
  ],
};
