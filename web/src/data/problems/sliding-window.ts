import type { Problem } from '../../types/problem';

export const slidingWindowProblems: Problem[] = [
  {
    id: 'sw-p1',
    topicId: 'sliding-window',
    title: 'Максимальная сумма подмассива длины k',
    difficulty: 'easy',
    isContextual: false,
    description:
      'Дан массив целых чисел `arr` и число `k`. Найдите максимальную сумму среди всех подмассивов длины `k`.\n\nЕсли длина массива меньше `k`, верните 0.',
    functionName: 'maxSumSubarray',
    starterCode: `function maxSumSubarray(arr, k) {
  // Ваш код здесь
}`,
    testCases: [
      {
        id: 'sw-p1-t1',
        inputDisplay: 'maxSumSubarray([2, 1, 5, 1, 3, 2], 3)',
        inputArgs: [[2, 1, 5, 1, 3, 2], 3],
        expected: 9,
      },
      {
        id: 'sw-p1-t2',
        inputDisplay: 'maxSumSubarray([1, 2, 3, 4, 5], 2)',
        inputArgs: [[1, 2, 3, 4, 5], 2],
        expected: 9,
      },
      {
        id: 'sw-p1-t3',
        inputDisplay: 'maxSumSubarray([5, 5, 5, 5], 1)',
        inputArgs: [[5, 5, 5, 5], 1],
        expected: 5,
      },
      {
        id: 'sw-p1-t4',
        inputDisplay: 'maxSumSubarray([1, 2], 3)',
        inputArgs: [[1, 2], 3],
        expected: 0,
      },
      {
        id: 'sw-p1-t5',
        inputDisplay: 'maxSumSubarray([10, -3, 4, 7, 2, -1], 4)',
        inputArgs: [[10, -3, 4, 7, 2, -1], 4],
        expected: 18,
      },
    ],
    hints: [
      'Сначала посчитайте сумму первых k элементов.',
      'Затем на каждом шаге добавляйте новый элемент и убирайте самый левый элемент предыдущего окна.',
      'Не забудьте обработать случай, когда arr.length < k.',
    ],
    solutionCode: `function maxSumSubarray(arr, k) {
  if (arr.length < k) return 0;

  let sum = 0;
  for (let i = 0; i < k; i++) {
    sum += arr[i];
  }

  let maxSum = sum;
  for (let i = k; i < arr.length; i++) {
    sum = sum + arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, sum);
  }

  return maxSum;
}`,
  },
  {
    id: 'sw-p2',
    topicId: 'sliding-window',
    title: 'Наименьший подмассив с суммой >= target',
    difficulty: 'medium',
    isContextual: false,
    description:
      'Дано положительное целое число `target` и массив положительных целых чисел `nums`. Найдите длину наименьшего подмассива, сумма элементов которого больше или равна `target`.\n\nЕсли такого подмассива не существует, верните 0.',
    functionName: 'minSubarrayLen',
    starterCode: `function minSubarrayLen(target, nums) {
  // Ваш код здесь
}`,
    testCases: [
      {
        id: 'sw-p2-t1',
        inputDisplay: 'minSubarrayLen(7, [2, 3, 1, 2, 4, 3])',
        inputArgs: [7, [2, 3, 1, 2, 4, 3]],
        expected: 2,
      },
      {
        id: 'sw-p2-t2',
        inputDisplay: 'minSubarrayLen(4, [1, 4, 4])',
        inputArgs: [4, [1, 4, 4]],
        expected: 1,
      },
      {
        id: 'sw-p2-t3',
        inputDisplay: 'minSubarrayLen(11, [1, 1, 1, 1, 1])',
        inputArgs: [11, [1, 1, 1, 1, 1]],
        expected: 0,
      },
      {
        id: 'sw-p2-t4',
        inputDisplay: 'minSubarrayLen(15, [5, 1, 3, 5, 10, 7, 4, 9, 2, 8])',
        inputArgs: [15, [5, 1, 3, 5, 10, 7, 4, 9, 2, 8]],
        expected: 2,
      },
      {
        id: 'sw-p2-t5',
        inputDisplay: 'minSubarrayLen(3, [1, 1, 1, 1])',
        inputArgs: [3, [1, 1, 1, 1]],
        expected: 3,
      },
      {
        id: 'sw-p2-t6',
        inputDisplay: 'minSubarrayLen(100, [100])',
        inputArgs: [100, [100]],
        expected: 1,
      },
    ],
    hints: [
      'Используйте два указателя (left и right), которые определяют границы окна.',
      'Расширяйте окно вправо, пока сумма не станет >= target.',
      'Как только сумма >= target, пробуйте сужать окно слева, фиксируя минимальную длину.',
      'Каждый элемент добавляется и убирается максимум один раз — сложность O(n).',
    ],
    solutionCode: `function minSubarrayLen(target, nums) {
  let left = 0;
  let sum = 0;
  let minLen = Infinity;

  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];

    while (sum >= target) {
      minLen = Math.min(minLen, right - left + 1);
      sum -= nums[left];
      left++;
    }
  }

  return minLen === Infinity ? 0 : minLen;
}`,
  },
  {
    id: 'sw-p3',
    topicId: 'sliding-window',
    title: 'Пиковая нагрузка на сервис',
    difficulty: 'medium',
    isContextual: true,
    description:
      'Команда мониторинга анализирует нагрузку на сервис объявлений. У них есть отсортированный массив `timestamps` — временные метки (в секундах) каждого входящего запроса, и число `windowSize` — размер окна наблюдения в секундах.\n\nНужно определить максимальное количество запросов, которые приходят в любом непрерывном интервале длиной `windowSize` секунд. Это поможет определить пиковую нагрузку и правильно настроить автоскейлинг.\n\nМассив `timestamps` отсортирован по возрастанию. Временные метки могут повторяться (несколько запросов в одну секунду). Если массив пуст, верните 0.',
    functionName: 'maxRequestsInWindow',
    starterCode: `function maxRequestsInWindow(timestamps, windowSize) {
  // Ваш код здесь
}`,
    testCases: [
      {
        id: 'sw-p3-t1',
        inputDisplay: 'maxRequestsInWindow([1, 2, 3, 5, 7, 8, 9], 3)',
        inputArgs: [[1, 2, 3, 5, 7, 8, 9], 3],
        expected: 3,
      },
      {
        id: 'sw-p3-t2',
        inputDisplay: 'maxRequestsInWindow([1, 1, 1, 2, 2, 3], 2)',
        inputArgs: [[1, 1, 1, 2, 2, 3], 2],
        expected: 5,
      },
      {
        id: 'sw-p3-t3',
        inputDisplay: 'maxRequestsInWindow([100, 200, 300, 400, 500], 50)',
        inputArgs: [[100, 200, 300, 400, 500], 50],
        expected: 1,
      },
      {
        id: 'sw-p3-t4',
        inputDisplay: 'maxRequestsInWindow([], 10)',
        inputArgs: [[], 10],
        expected: 0,
      },
      {
        id: 'sw-p3-t5',
        inputDisplay: 'maxRequestsInWindow([5, 5, 5, 5, 5], 1)',
        inputArgs: [[5, 5, 5, 5, 5], 1],
        expected: 5,
      },
    ],
    hints: [
      'Это задача на динамическое скользящее окно, но условие сужения основано на разнице временных меток, а не на сумме.',
      'Используйте два указателя: left и right. Двигайте right вправо, и если timestamps[right] - timestamps[left] >= windowSize, сдвигайте left.',
      'На каждом шаге количество запросов в текущем окне = right - left + 1.',
      'Не забудьте обработать пустой массив.',
    ],
    solutionCode: `function maxRequestsInWindow(timestamps, windowSize) {
  if (timestamps.length === 0) return 0;

  let left = 0;
  let maxCount = 0;

  for (let right = 0; right < timestamps.length; right++) {
    // Сужаем окно, пока разница >= windowSize
    while (timestamps[right] - timestamps[left] >= windowSize) {
      left++;
    }

    maxCount = Math.max(maxCount, right - left + 1);
  }

  return maxCount;
}`,
  },
];
