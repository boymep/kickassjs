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
  {
    id: 'bs-p6',
    topicId: 'binary-search',
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
    id: 'bs-p4',
    topicId: 'binary-search',
    title: 'Поиск версии с багом',
    difficulty: 'medium',
    isContextual: true,
    description: `В системе CI/CD каждый коммит получает порядковый номер (от 1 до n). Начиная с какого-то коммита в проде появился баг. Дана функция isBuggy(version), которая возвращает true если версия содержит баг. Все версии после первой багованной тоже багованные.

Для простоты: дан отсортированный boolean-массив versions, где false — версия без бага, true — с багом (например [false, false, true, true, true]). Найдите индекс первой true (первой багованной версии). Если багов нет, верните -1.

Примеры:
- findFirstBuggy([false, false, true, true, true]) => 2
- findFirstBuggy([true, true, true]) => 0
- findFirstBuggy([false, false, false]) => -1`,
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
      'Это задача на поиск левой границы',
      'Используйте бинарный поиск — если versions[mid] === true, ищите левее',
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
    title: 'Предскажите вывод: бинарный поиск 4 в [1, 2, 4, 4, 5]',
    difficulty: 'easy',
    isContextual: false,
    description: `Перед вами реализация классического бинарного поиска. Проследите выполнение для массива [1, 2, 4, 4, 5] и target = 4. Какой индекс выведет console.log?

Подсказка: посчитайте mid вручную для каждой итерации и определите, на какой именно итерации сработает условие arr[mid] === target.`,
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
      'Итерация 1: left=0, right=4, mid=2, arr[2]=4 — совпадение.',
      'Классический шаблон возвращает первый встретившийся индекс, не обязательно самый левый.',
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
    description: `Перед вами реализация бинарного поиска, в которой содержится баг. На некоторых входах функция зависает в бесконечном цикле или возвращает неверный результат.

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
      'Запустите код мысленно для массива [1] и target = 1. Войдёт ли цикл?',
      'Сравните условие цикла с шаблоном из теории: какое из двух (< или <=) подходит при сдвигах mid + 1 / mid - 1?',
      'Закрытый интервал [left; right] требует условия left <= right.',
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
    description: `Перед вами линейный поиск элемента в отсортированном массиве. Он работает корректно, но за O(n) — на массиве из 100 000 элементов это слишком медленно.

Перепишите функцию так, чтобы она использовала бинарный поиск и работала за O(log n). Контракт остаётся тем же: вернуть индекс target или -1, если элемента нет.

Тест производительности: на массиве из 100 000 элементов с target в середине решение должно завершаться за 50 миллисекунд.`,
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
      'Используйте классический шаблон с двумя указателями left и right.',
      'На каждой итерации сравнивайте arr[mid] с target и сдвигайте одну из границ на mid ± 1.',
      'Линейный поиск делает O(n) сравнений; бинарный — O(log n) (около 17 для 100 000 элементов).',
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
    id: 'bs-p5',
    topicId: 'binary-search',
    title: 'Минимальная скорость доставки',
    difficulty: 'medium',
    isContextual: true,
    description: `Курьер должен доставить все заказы за hours часов. Массив orders содержит количество посылок на каждой точке. За час курьер может обработать до speed посылок на одной точке (если посылок меньше speed, он всё равно тратит целый час на эту точку). Найдите минимальную скорость speed, при которой курьер успеет обработать все точки за hours часов.

Примеры:
- minDeliverySpeed([3, 6, 7, 11], 8) => 4
  При speed=4: ceil(3/4)+ceil(6/4)+ceil(7/4)+ceil(11/4) = 1+2+2+3 = 8 <= 8 ✓
- minDeliverySpeed([30, 11, 23, 4, 20], 5) => 30
- minDeliverySpeed([1, 1, 1, 1], 4) => 1`,
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
      'Бинарный поиск по ответу',
      'Ищите минимальную speed в диапазоне [1, max(orders)]',
      'Для каждой speed считайте Math.ceil(orders[i] / speed) часов на точку',
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
];
