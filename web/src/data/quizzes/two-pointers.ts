import type { TopicQuiz } from '../../types/quiz';

export const twoPointersQuiz: TopicQuiz = {
  topicId: 'two-pointers',
  questions: [
    // ==================== EASY (1-6) ====================
    {
      type: 'fill-blank',
      id: 'tp-q1',
      description:
        'В задаче Two Sum на отсортированном массиве, если текущая сумма меньше target, что нужно сделать?',
      codeWithBlanks: `function twoSum(nums: number[], target: number): number[] {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) ___;
    else right--;
  }
  return [-1, -1];
}`,
      options: ['left++', 'right--', 'left--', 'right++'],
      correctIndex: 0,
      explanation:
        'Если сумма меньше target, нужно увеличить её. Так как массив отсортирован, сдвигаем левый указатель вправо (`left++`), чтобы взять большее число.',
    },
    {
      type: 'output',
      id: 'tp-q2',
      description:
        'Что вернёт функция `twoSum([1, 3, 5, 7, 11], 8)`?',
      code: `function twoSum(nums: number[], target: number): number[] {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [-1, -1];
}

console.log(twoSum([1, 3, 5, 7, 11], 8));`,
      options: ['[0, 3]', '[1, 2]', '[0, 4]', '[1, 3]'],
      correctIndex: 0,
      explanation:
        'Пошагово: left=0, right=4, sum=1+11=12 > 8, right--. left=0, right=3, sum=1+7=8 === target, return [0, 3]. Алгоритм находит первую подходящую пару — числа 1 и 7 с индексами 0 и 3.',
    },
    {
      type: 'fill-blank',
      id: 'tp-q3',
      description:
        'В функции removeDuplicates, когда nums[fast] !== nums[slow], что нужно сделать перед записью?',
      codeWithBlanks: `function removeDuplicates(nums: number[]): number {
  let slow = 0;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      ___;
      nums[slow] = nums[fast];
    }
  }
  return slow + 1;
}`,
      options: ['slow++', 'slow--', 'fast++', 'fast--'],
      correctIndex: 0,
      explanation:
        'Когда встречаем новый уникальный элемент (nums[fast] !== nums[slow]), сначала сдвигаем slow вперёд (`slow++`), а затем записываем в эту позицию новое значение.',
    },
    {
      type: 'tracing',
      id: 'tp-q4',
      description: 'Проследите выполнение isPalindrome("racecar") для первых 3 итераций.',
      code: `function isPalindrome(s: string): boolean {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
      steps: [
        {
          label: 'Итерация 1',
          variables: { left: 0, right: 6, 's[left]': 'r', 's[right]': 'r', result: 'совпали' },
        },
        {
          label: 'Итерация 2',
          variables: { left: 1, right: 5, 's[left]': 'a', 's[right]': 'a', result: 'совпали' },
        },
        {
          label: 'Итерация 3',
          variables: { left: 2, right: 4, 's[left]': 'c', 's[right]': 'c', result: 'совпали' },
        },
      ],
      question: 'Какой будет результат после 3-й итерации?',
      options: [
        'left=3, right=3, цикл завершится, return true',
        'left=3, right=3, ещё одна проверка',
        'left=2, right=4, return false',
        'left=3, right=2, return true',
      ],
      correctIndex: 0,
      explanation:
        'После 3-й итерации left=3, right=3. Условие `left < right` (3 < 3) ложно, цикл завершается, функция возвращает true. Строка "racecar" — палиндром.',
    },
    {
      type: 'complexity',
      id: 'tp-q5',
      description:
        'Какова временная сложность подхода с двумя указателями для поиска пары с заданной суммой в отсортированном массиве?',
      code: `function twoSum(nums: number[], target: number): number[] {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [-1, -1];
}`,
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctIndex: 2,
      explanation:
        'Каждый шаг цикла сдвигает один из указателей. Суммарно left и right вместе пройдут не более n шагов (left движется только вправо, right только влево, и они встречаются). Итого — O(n).',
    },
    {
      type: 'output',
      id: 'tp-q6',
      description: 'Что вернёт `removeDuplicates([0, 0, 1, 1, 2])`?',
      code: `function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0;
  let slow = 0;

  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }
  return slow + 1;
}

console.log(removeDuplicates([0, 0, 1, 1, 2]));`,
      options: ['2', '3', '4', '5'],
      correctIndex: 1,
      explanation:
        'Уникальные элементы: 0, 1, 2 — всего 3 штуки. Пошагово: slow=0. fast=1: nums[1]=0 === nums[0]=0, пропуск. fast=2: nums[2]=1 !== nums[0]=0, slow=1, nums[1]=1. fast=3: nums[3]=1 === nums[1]=1, пропуск. fast=4: nums[4]=2 !== nums[1]=1, slow=2, nums[2]=2. Итого slow+1 = 3.',
    },

    // ==================== INTERMEDIATE (7-11) ====================
    {
      type: 'fill-blank',
      id: 'tp-q7',
      description:
        'В задаче "Container With Most Water" нужно вычислить площадь между двумя линиями. Какая формула правильная?',
      codeWithBlanks: `function maxArea(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let max = 0;

  while (left < right) {
    const area = ___;
    max = Math.max(max, area);
    if (height[left] < height[right]) left++;
    else right--;
  }
  return max;
}`,
      options: [
        'Math.min(height[left], height[right]) * (right - left)',
        'Math.max(height[left], height[right]) * (right - left)',
        'height[left] * height[right]',
        '(height[left] + height[right]) * (right - left) / 2',
      ],
      correctIndex: 0,
      explanation:
        'Площадь контейнера ограничена более короткой стенкой (вода выльется через неё). Поэтому высота — это минимум из двух высот, а ширина — расстояние между указателями: `Math.min(height[left], height[right]) * (right - left)`.',
    },
    {
      type: 'output',
      id: 'tp-q8',
      description:
        'Что вернёт функция слияния двух отсортированных массивов `merge([1, 3, 5], [2, 4, 6])`?',
      code: `function merge(a: number[], b: number[]): number[] {
  const result: number[] = [];
  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) {
      result.push(a[i]);
      i++;
    } else {
      result.push(b[j]);
      j++;
    }
  }

  while (i < a.length) { result.push(a[i]); i++; }
  while (j < b.length) { result.push(b[j]); j++; }

  return result;
}

console.log(merge([1, 3, 5], [2, 4, 6]));`,
      options: [
        '[1, 2, 3, 4, 5, 6]',
        '[2, 4, 6, 1, 3, 5]',
        '[1, 3, 5, 2, 4, 6]',
        '[1, 2, 3, 5, 4, 6]',
      ],
      correctIndex: 0,
      explanation:
        'Два указателя i и j идут по массивам a и b соответственно. На каждом шаге берётся меньший элемент: 1, 2, 3, 4, 5, 6. Это классический алгоритм слияния (merge) из merge sort.',
    },
    {
      type: 'complexity',
      id: 'tp-q9',
      description:
        'Какова временная сложность алгоритма 3Sum, который использует сортировку и два указателя для каждого фиксированного элемента?',
      code: `function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const result: number[][] = [];

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) left++;
      else right--;
    }
  }
  return result;
}`,
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(n³)'],
      correctIndex: 2,
      explanation:
        'Сортировка занимает O(n log n). Внешний цикл — O(n), внутренний цикл с двумя указателями — O(n). Итого O(n) * O(n) = O(n²). Сортировка O(n log n) поглощается O(n²). Это значительно лучше наивного O(n³) перебора тройками.',
    },
    {
      type: 'tracing',
      id: 'tp-q10',
      description:
        'Проследите выполнение функции partition для массива [3, 1, 4, 1, 5] с pivot = 3.',
      code: `function partition(nums: number[], pivot: number): number {
  let left = 0;

  for (let right = 0; right < nums.length; right++) {
    if (nums[right] < pivot) {
      [nums[left], nums[right]] = [nums[right], nums[left]];
      left++;
    }
  }
  return left; // индекс, куда встанет pivot
}`,
      steps: [
        {
          label: 'right=0',
          variables: { 'nums[right]': 3, condition: '3 < 3 = false', left: 0, array: '[3, 1, 4, 1, 5]' },
        },
        {
          label: 'right=1',
          variables: { 'nums[right]': 1, condition: '1 < 3 = true', left: 1, array: '[1, 3, 4, 1, 5]' },
        },
        {
          label: 'right=2',
          variables: { 'nums[right]': 4, condition: '4 < 3 = false', left: 1, array: '[1, 3, 4, 1, 5]' },
        },
        {
          label: 'right=3',
          variables: { 'nums[right]': 1, condition: '1 < 3 = true', left: 2, array: '[1, 1, 4, 3, 5]' },
        },
        {
          label: 'right=4',
          variables: { 'nums[right]': 5, condition: '5 < 3 = false', left: 2, array: '[1, 1, 4, 3, 5]' },
        },
      ],
      question: 'Какое значение вернёт функция и каков итоговый массив?',
      options: [
        'Вернёт 2, массив [1, 1, 4, 3, 5]',
        'Вернёт 3, массив [1, 1, 3, 4, 5]',
        'Вернёт 1, массив [1, 3, 4, 1, 5]',
        'Вернёт 2, массив [1, 1, 3, 4, 5]',
      ],
      correctIndex: 0,
      explanation:
        'Функция перемещает все элементы меньше pivot (3) в начало массива. Два элемента (1 и 1) меньше 3, поэтому left = 2. Итоговый массив: [1, 1, 4, 3, 5]. Обратите внимание: элементы >= pivot не обязательно отсортированы.',
    },
    {
      type: 'fill-blank',
      id: 'tp-q11',
      description:
        'В задаче "Container With Most Water", если левая стенка ниже правой, какой указатель нужно сдвинуть и почему?',
      codeWithBlanks: `function maxArea(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let max = 0;

  while (left < right) {
    const area = Math.min(height[left], height[right]) * (right - left);
    max = Math.max(max, area);
    if (height[left] < height[right]) ___;
    else right--;
  }
  return max;
}`,
      options: ['left++', 'right--', 'left--', 'right++'],
      correctIndex: 0,
      explanation:
        'Если height[left] < height[right], то левая стенка — узкое место. Сдвигать right бессмысленно: ширина уменьшится, а высота не увеличится (она ограничена левой стенкой). Поэтому сдвигаем left++ в надежде найти более высокую стенку.',
    },

    // ==================== HARDER MIDDLE (12-16) ====================
    {
      type: 'output',
      id: 'tp-q12',
      description:
        'Что вернёт функция `moveZeroes([0, 1, 0, 3, 12])`? Обратите внимание на порядок ненулевых элементов.',
      code: `function moveZeroes(nums: number[]): number[] {
  let slow = 0;

  for (let fast = 0; fast < nums.length; fast++) {
    if (nums[fast] !== 0) {
      [nums[slow], nums[fast]] = [nums[fast], nums[slow]];
      slow++;
    }
  }
  return nums;
}

console.log(moveZeroes([0, 1, 0, 3, 12]));`,
      options: [
        '[1, 3, 12, 0, 0]',
        '[0, 0, 1, 3, 12]',
        '[1, 0, 3, 0, 12]',
        '[12, 3, 1, 0, 0]',
      ],
      correctIndex: 0,
      explanation:
        'slow-указатель отслеживает позицию для следующего ненулевого элемента. fast проходит массив: встречает 1 (swap с позицией 0), 3 (swap с позицией 1), 12 (swap с позицией 2). Итог: [1, 3, 12, 0, 0]. Порядок ненулевых элементов сохраняется.',
    },
    {
      type: 'tracing',
      id: 'tp-q13',
      description:
        'Проследите выполнение Dutch National Flag (сортировка 0, 1, 2) для массива [2, 0, 1, 2, 0].',
      code: `function sortColors(nums: number[]): number[] {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;

  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    }
  }
  return nums;
}`,
      steps: [
        {
          label: 'Шаг 1',
          variables: { low: 0, mid: 0, high: 4, 'nums[mid]': 2, action: 'swap mid<->high', array: '[0, 0, 1, 2, 2]' },
        },
        {
          label: 'Шаг 2',
          variables: { low: 0, mid: 0, high: 3, 'nums[mid]': 0, action: 'swap low<->mid', array: '[0, 0, 1, 2, 2]' },
        },
        {
          label: 'Шаг 3',
          variables: { low: 1, mid: 1, high: 3, 'nums[mid]': 0, action: 'swap low<->mid', array: '[0, 0, 1, 2, 2]' },
        },
        {
          label: 'Шаг 4',
          variables: { low: 2, mid: 2, high: 3, 'nums[mid]': 1, action: 'mid++', array: '[0, 0, 1, 2, 2]' },
        },
        {
          label: 'Шаг 5',
          variables: { low: 2, mid: 3, high: 3, 'nums[mid]': 2, action: 'swap mid<->high', array: '[0, 0, 1, 2, 2]' },
        },
      ],
      question: 'Каков итоговый отсортированный массив?',
      options: [
        '[0, 0, 1, 2, 2]',
        '[0, 0, 2, 1, 2]',
        '[0, 1, 0, 2, 2]',
        '[2, 2, 1, 0, 0]',
      ],
      correctIndex: 0,
      explanation:
        'Алгоритм Dutch National Flag использует три указателя: low (граница нулей), mid (текущий), high (граница двоек). За один проход массив разбивается на три зоны: [0..low) — нули, [low..mid) — единицы, (high..end] — двойки. Итог: [0, 0, 1, 2, 2].',
    },
    {
      type: 'complexity',
      id: 'tp-q14',
      description:
        'Какова пространственная сложность (дополнительная память) алгоритма Dutch National Flag для сортировки массива из 0, 1, 2?',
      code: `function sortColors(nums: number[]): void {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;

  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    }
  }
}`,
      options: ['O(n)', 'O(n log n)', 'O(1)', 'O(n²)'],
      correctIndex: 2,
      explanation:
        'Алгоритм использует только три переменных-указателя (low, mid, high) и выполняет обмены in-place. Дополнительная память не зависит от размера массива — это O(1). Временная сложность при этом O(n) — один проход по массиву.',
    },
    {
      type: 'output',
      id: 'tp-q15',
      description:
        'Что вернёт функция `trapWater([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])`? Это задача Trapping Rain Water с двумя указателями.',
      code: `function trapWater(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        water += leftMax - height[left];
      }
      left++;
    } else {
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        water += rightMax - height[right];
      }
      right--;
    }
  }
  return water;
}

console.log(trapWater([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]));`,
      options: ['4', '6', '8', '5'],
      correctIndex: 1,
      explanation:
        'Два указателя идут навстречу друг другу. Для каждой позиции объём воды = max_высота_с_этой_стороны - текущая_высота. Суммарно: позиция 2 (1 воды) + позиция 4 (1) + позиция 5 (2) + позиция 6 (1) + позиция 9 (1) = 6 единиц воды. Это классическая задача, решаемая двумя указателями за O(n) времени и O(1) памяти.',
    },
    {
      type: 'fill-blank',
      id: 'tp-q16',
      description:
        'В задаче поиска тройки с суммой 0 (3Sum) нужно пропускать дубликаты, чтобы избежать повторных ответов. Какое условие пропуска дубликата для внешнего цикла?',
      codeWithBlanks: `function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const result: number[][] = [];

  for (let i = 0; i < nums.length - 2; i++) {
    if (___) continue;

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) left++;
      else right--;
    }
  }
  return result;
}`,
      options: [
        'i > 0 && nums[i] === nums[i - 1]',
        'nums[i] === nums[i + 1]',
        'i > 0 && nums[i] === nums[i + 1]',
        'nums[i] === 0',
      ],
      correctIndex: 0,
      explanation:
        'Нужно проверить `i > 0 && nums[i] === nums[i - 1]`. Мы сравниваем с предыдущим элементом, а не со следующим. Если сравнивать со следующим (`nums[i] === nums[i + 1]`), мы пропустим допустимые тройки, например [-1, -1, 2]. Условие `i > 0` защищает от выхода за границу массива.',
    },
  ],
};
