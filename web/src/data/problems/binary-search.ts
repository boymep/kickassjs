import type { Problem } from '../../types/problem';

export const binarySearchProblems: Problem[] = [
  {
    id: 'bs-problem-1',
    topicId: 'binary-search',
    title: 'Классический бинарный поиск',
    difficulty: 'easy',
    isContextual: false,
    description: `Дан отсортированный по возрастанию массив целых чисел arr и целое число target.

Напишите функцию, которая находит target в массиве и возвращает его индекс. Если элемент не найден, верните -1.

Требования:
- Решение должно работать за O(log n)
- Массив отсортирован по возрастанию
- Все элементы массива уникальны

Примеры:
- binarySearch([1, 3, 5, 7, 9], 5) => 2
- binarySearch([1, 3, 5, 7, 9], 6) => -1
- binarySearch([2, 4, 6], 2) => 0`,
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
      'Используйте два указателя: left и right, которые обозначают границы текущей области поиска.',
      'На каждом шаге вычисляйте mid = Math.floor((left + right) / 2) и сравнивайте arr[mid] с target.',
      'Если arr[mid] < target, сдвигайте left = mid + 1. Если arr[mid] > target, сдвигайте right = mid - 1.',
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
    description: `Дан отсортированный по возрастанию массив целых чисел arr и целое число target.

Найдите элемент массива, ближайший к target, и верните его. Если два элемента одинаково близки, верните меньший из них.

Гарантируется, что массив содержит хотя бы один элемент.

Примеры:
- findClosest([1, 3, 5, 7, 9], 6) => 5
- findClosest([1, 3, 5, 7, 9], 4) => 3
- findClosest([1, 10], 5) => 1`,
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
    ],
    hints: [
      'Сначала выполните обычный бинарный поиск. Если элемент найден -- верните его.',
      'Если элемент не найден, после цикла left указывает на первый элемент больше target, а right -- на последний элемент меньше target.',
      'Сравните расстояния до arr[left] и arr[right] (проверяя границы массива) и верните ближайший. При равных расстояниях верните меньший.',
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
    description: `На маркетплейсе размещено множество товаров. Каждый товар характеризуется числовым значением (например, ценой или рейтингом). У каждого покупателя есть потребность -- тоже числовое значение, отражающее идеальный товар.

Если точного товара нет, покупатель выбирает ближайший по значению. Неудовлетворённость покупателя -- это абсолютная разница между его потребностью и выбранным товаром.

Количество каждого товара не ограничено: один и тот же товар могут купить несколько покупателей.

Напишите функцию, которая принимает массив товаров goods и массив потребностей покупателей buyerNeeds, и возвращает суммарную неудовлетворённость всех покупателей.

Примеры:
- calcDissatisfaction([8, 3, 5], [5, 6]) => 1
  Первый покупатель покупает товар 5 (неудовлетворённость 0).
  Второй покупатель тоже покупает товар 5 -- ближайший к 6 (неудовлетворённость 1).
  Итого: 0 + 1 = 1.

- calcDissatisfaction([1, 10], [5]) => 4
  Покупатель выбирает товар 1 (расстояние 4) или товар 10 (расстояние 5).
  Ближайший -- товар 1, неудовлетворённость = 4.

Подсказка: подумайте, как использовать сортировку и бинарный поиск для эффективного нахождения ближайшего товара для каждого покупателя.`,
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
      'Отсортируйте массив товаров -- это позволит применить бинарный поиск.',
      'Для каждого покупателя найдите позицию вставки его потребности в отсортированный массив товаров с помощью бинарного поиска.',
      'После бинарного поиска сравните расстояние до соседних элементов слева и справа от позиции вставки, чтобы выбрать ближайший товар.',
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
];
