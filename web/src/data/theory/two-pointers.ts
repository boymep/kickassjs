import type { TopicTheory } from '../../types/topic';

export const twoPointersTheory: TopicTheory = {
  topicId: 'two-pointers',
  sections: [
    {
      title: 'Как работают два указателя',
      blocks: [
        {
          type: 'text',
          content:
            'Техника двух указателей позволяет обрабатывать массив или строку за один проход, используя два индекса вместо вложенных циклов. Это сокращает сложность с O(n²) до O(n).',
        },
        {
          type: 'visualization',
          content: '',
          vizId: 'two-pointers',
        },
        {
          type: 'heading',
          content: 'Три основных варианта',
        },
        {
          type: 'list',
          content:
            '- **Сходящиеся указатели** — `left` и `right` движутся навстречу друг другу от краёв массива к центру.\n- **Параллельные указатели** — оба указателя движутся в одном направлении (slow/fast или два массива).\n- **Быстрый и медленный** — `fast` идёт на шаг вперёд каждый раз, `slow` — только при выполнении условия. Используется для удаления дубликатов, обнаружения цикла и пр.',
        },
        {
          type: 'callout',
          content:
            'Два указателя чаще всего работают на отсортированных данных или на структурах с монотонным свойством.',
          calloutType: 'info',
        },
      ],
    },
    {
      title: 'Сходящиеся указатели',
      blocks: [
        {
          type: 'text',
          content:
            'Указатели стартуют с противоположных концов массива и двигаются навстречу, пока не встретятся. На каждом шаге мы решаем, какой указатель сдвигать.',
        },
        {
          type: 'heading',
          content: 'Шаблон',
        },
        {
          type: 'code',
          content: `function twoPointers(arr: number[], target: number): number[] {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];

    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }

  return [-1, -1];
}`,
          language: 'typescript',
        },
        {
          type: 'heading',
          content: 'Пример: Two Sum в отсортированном массиве',
        },
        {
          type: 'text',
          content:
            'Дан отсортированный массив `numbers` и число `target`. Нужно найти два числа, которые в сумме дают `target`, и вернуть их индексы.',
        },
        {
          type: 'text',
          content:
            'Если сумма меньше `target`, значит нужно число побольше — двигаем `left` вправо. Если больше — двигаем `right` влево. Гарантированно найдём ответ за O(n).',
        },
      ],
    },
    {
      title: 'Параллельные указатели',
      blocks: [
        {
          type: 'text',
          content:
            'Оба указателя идут слева направо. `fast` просматривает каждый элемент, `slow` отмечает позицию для записи. Подход используется для удаления дубликатов in-place, слияния массивов и фильтрации.',
        },
        {
          type: 'heading',
          content: 'Шаблон: удаление дубликатов',
        },
        {
          type: 'code',
          content: `function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0;

  let slow = 0;

  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }

  return slow + 1;
}`,
          language: 'typescript',
        },
        {
          type: 'heading',
          content: 'Шаблон: слияние двух отсортированных массивов',
        },
        {
          type: 'code',
          content: `function merge(a: number[], b: number[]): number[] {
  const result: number[] = [];
  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) {
      result.push(a[i++]);
    } else {
      result.push(b[j++]);
    }
  }

  while (i < a.length) result.push(a[i++]);
  while (j < b.length) result.push(b[j++]);

  return result;
}`,
          language: 'typescript',
        },
      ],
    },
    {
      title: 'Когда применять',
      blocks: [
        {
          type: 'text',
          content: 'Сигналы, что задача решается двумя указателями:',
        },
        {
          type: 'list',
          content:
            '- Массив **отсортирован** (или его можно отсортировать без потери информации).\n- Нужно найти **пару элементов** с определённым свойством (сумма, разность).\n- Нужно **модифицировать массив in-place** (удаление, перестановка).\n- Задача про **палиндром** — проверка строки с двух концов.\n- Нужно **слить два отсортированных** массива или списка.\n- Формулировка содержит слова «подмассив», «пара», «сумма двух» на отсортированных данных.',
        },
        {
          type: 'callout',
          content:
            'Если массив не отсортирован и сортировка потеряет индексы, два указателя могут не подойти — рассмотрите хеш-таблицу.',
          calloutType: 'tip',
        },
      ],
    },
    {
      title: 'Типичные ошибки',
      blocks: [
        {
          type: 'callout',
          content:
            'Условие цикла `left < right` vs `left <= right`: при сходящихся указателях обычно нужен строгий `<`, иначе один элемент может быть использован дважды.',
          calloutType: 'warning',
        },
        {
          type: 'callout',
          content:
            'Забыли сдвинуть указатель: если в ветке `if` нет `left++` или `right--`, цикл зависнет навечно.',
          calloutType: 'warning',
        },
        {
          type: 'callout',
          content:
            'Выход за границы массива: всегда проверяйте `left < nums.length` и `right >= 0` перед обращением к элементу.',
          calloutType: 'warning',
        },
        {
          type: 'callout',
          content:
            'Путаница с индексами: в задачах типа Two Sum II индексы начинаются с 1, а не с 0. Внимательно читайте условие.',
          calloutType: 'warning',
        },
      ],
    },
  ],
};
