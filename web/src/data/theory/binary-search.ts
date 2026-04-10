import type { TopicTheory } from '../../types/topic';

export const binarySearchTheory: TopicTheory = {
  topicId: 'binary-search',
  sections: [
    {
      title: 'Как работает бинарный поиск',
      blocks: [
        {
          type: 'text',
          content:
            'Бинарный поиск -- алгоритм поиска элемента в отсортированном массиве за O(log n). На каждом шаге мы делим область поиска пополам, сравнивая средний элемент с искомым.',
        },
        {
          type: 'visualization',
          content: '',
          vizId: 'binary-search',
        },
        {
          type: 'heading',
          content: 'Пошаговый пример: ищем 7 в массиве [1, 3, 5, 7, 9, 11]',
        },
        {
          type: 'text',
          content:
            'Шаг 1: left = 0, right = 5, mid = 2. arr[2] = 5 < 7 => сдвигаем left = mid + 1 = 3.',
        },
        {
          type: 'text',
          content:
            'Шаг 2: left = 3, right = 5, mid = 4. arr[4] = 9 > 7 => сдвигаем right = mid - 1 = 3.',
        },
        {
          type: 'text',
          content:
            'Шаг 3: left = 3, right = 3, mid = 3. arr[3] = 7 === 7 => нашли! Возвращаем индекс 3.',
        },
        {
          type: 'callout',
          content:
            'На каждой итерации область поиска сокращается вдвое. Для массива из n элементов потребуется не более log2(n) шагов.',
          calloutType: 'info',
        },
      ],
    },
    {
      title: 'Шаблон кода',
      blocks: [
        {
          type: 'heading',
          content: 'Классический бинарный поиск',
        },
        {
          type: 'text',
          content:
            'Ищем точное вхождение элемента target в отсортированном массиве. Возвращаем индекс или -1, если элемент не найден.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function binarySearch(arr, target) {
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

  return -1; // элемент не найден
}`,
        },
        {
          type: 'heading',
          content: 'Поиск левой границы (первое вхождение)',
        },
        {
          type: 'text',
          content:
            'Когда элемент может повторяться и нужно найти его первое вхождение (или позицию для вставки), используем шаблон с left < right.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function searchLeftBound(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] >= target) {
      right = mid - 1; // продолжаем искать левее
    } else {
      left = mid + 1;
    }
  }

  // left -- позиция первого элемента >= target
  return left < arr.length && arr[left] === target ? left : -1;
}`,
        },
        {
          type: 'callout',
          content:
            'Обратите внимание на ключевое отличие: при arr[mid] === target мы НЕ возвращаем mid, а сдвигаем right = mid - 1, чтобы продолжить поиск левее.',
          calloutType: 'tip',
        },
      ],
    },
    {
      title: 'Бинарный поиск по ответу',
      blocks: [
        {
          type: 'text',
          content:
            'Бинарный поиск можно применять не только к массивам. Если ответ задачи -- число, и существует монотонная функция проверки (все значения до некоторого порога не подходят, а после -- подходят), можно искать этот порог бинарным поиском.',
        },
        {
          type: 'heading',
          content: 'Шаблон поиска по ответу',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function binarySearchOnAnswer(lo, hi, check) {
  // check(x) возвращает true, если x удовлетворяет условию
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);

    if (check(mid)) {
      hi = mid; // mid подходит, ищем меньшее значение
    } else {
      lo = mid + 1; // mid не подходит, ищем правее
    }
  }

  return lo; // минимальное значение, удовлетворяющее условию
}`,
        },
        {
          type: 'text',
          content:
            'Примеры задач: минимальная скорость конвейера (Koko eating bananas), минимальная вместимость корабля для перевозки за D дней, максимальный минимальный промежуток между элементами.',
        },
        {
          type: 'callout',
          content:
            'Ключевой признак: если задача спрашивает "найдите минимальное/максимальное значение X, при котором выполняется условие Y" -- скорее всего подходит бинарный поиск по ответу.',
          calloutType: 'tip',
        },
      ],
    },
    {
      title: 'Когда применять',
      blocks: [
        {
          type: 'text',
          content:
            'Бинарный поиск стоит рассматривать, когда вы видите следующие признаки в условии задачи:',
        },
        {
          type: 'list',
          content: `- Массив отсортирован (или его можно отсортировать)
- Требуется найти элемент за время лучше O(n)
- Нужно найти первое/последнее вхождение элемента
- Нужно найти позицию для вставки (searchInsert)
- Задача спрашивает "минимальное/максимальное значение, при котором..."
- Есть монотонная функция: все значения до порога дают false, после -- true
- Ответ можно проверить за O(n) или O(n log n), а пространство ответов огромно`,
        },
      ],
    },
    {
      title: 'Типичные ошибки',
      blocks: [
        {
          type: 'callout',
          content:
            'Off-by-one ошибки: неправильный выбор между left <= right и left < right. Используйте left <= right для классического поиска (ищем точное значение) и left < right для поиска границ.',
          calloutType: 'warning',
        },
        {
          type: 'callout',
          content:
            'Неправильное вычисление mid: выражение (left + right) / 2 может привести к переполнению в языках с фиксированным размером целых чисел. В JavaScript это не проблема, но в C++/Java используйте left + Math.floor((right - left) / 2). Также не забывайте Math.floor -- без него mid будет дробным.',
          calloutType: 'warning',
        },
        {
          type: 'callout',
          content:
            'Бесконечный цикл: если при left < right вы пишете left = mid (а не mid + 1), и mid вычисляется как floor, цикл может зависнуть при left + 1 === right. Убедитесь, что на каждой итерации диапазон уменьшается хотя бы на 1.',
          calloutType: 'warning',
        },
      ],
    },
  ],
};
