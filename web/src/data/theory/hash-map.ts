import type { TopicTheory } from '../../types/topic';

export const hashMapTheory: TopicTheory = {
  topicId: 'hash-map',
  sections: [
    {
      title: 'O(1) операции хеш-таблиц',
      blocks: [
        {
          type: 'text',
          content:
            'Хеш-таблица (Map, Set) — структура данных, которая обеспечивает доступ к элементам за O(1) в среднем. Три ключевые операции — вставка, поиск и удаление — выполняются за константное время.',
        },
        {
          type: 'text',
          content:
            'Внутри хеш-таблица использует хеш-функцию: она принимает ключ и вычисляет индекс в массиве (бакете), где будет храниться значение. Хорошая хеш-функция распределяет ключи равномерно, минимизируя коллизии (ситуации, когда разные ключи попадают в один бакет).',
        },
        {
          type: 'visualization',
          content: '',
          vizId: 'hash-map',
        },
        {
          type: 'callout',
          content:
            'В JavaScript Map и Set реализованы на основе хеш-таблиц. Map хранит пары ключ-значение, Set — только уникальные значения. Обе структуры дают O(1) на get/set/has/delete.',
          calloutType: 'info',
        },
      ],
    },
    {
      title: 'Частотный подсчёт',
      blocks: [
        {
          type: 'text',
          content:
            'Один из самых частых паттернов — подсчёт частоты элементов с помощью Map. Проходим по коллекции и для каждого элемента увеличиваем счётчик.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function countFrequencies(str) {
  const freq = new Map();

  for (const ch of str) {
    freq.set(ch, (freq.get(ch) || 0) + 1);
  }

  return freq;
}

// Пример: countFrequencies("abracadabra")
// Map { 'a' => 5, 'b' => 2, 'r' => 2, 'c' => 1, 'd' => 1 }`,
        },
        {
          type: 'text',
          content:
            'Паттерн `(map.get(key) || 0) + 1` — идиоматический способ инкремента: если ключа нет, get вернёт undefined, и `|| 0` даст начальное значение.',
        },
      ],
    },
    {
      title: 'Lookup-таблица (паттерн Two Sum)',
      blocks: [
        {
          type: 'text',
          content:
            'Классический паттерн: вместо двойного цикла O(n²) используем Map как lookup-таблицу. На каждом шаге проверяем, есть ли в Map нужное дополнение (complement), и добавляем текущий элемент в Map.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function twoSum(nums, target) {
  const map = new Map(); // значение -> индекс

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement), i];
    }

    map.set(nums[i], i);
  }

  return [];
}`,
        },
        {
          type: 'callout',
          content:
            'Ключевой инсайт: мы сохраняем уже просмотренные элементы в Map и ищем complement = target - nums[i]. Это превращает O(n²) в O(n).',
          calloutType: 'tip',
        },
      ],
    },
    {
      title: 'Группировка по ключу',
      blocks: [
        {
          type: 'text',
          content:
            'Ещё один частый паттерн — группировка элементов по вычисляемому ключу. Классический пример: группировка анаграмм. Все анаграммы имеют одинаковый отсортированный набор букв — это и будет ключом.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function groupAnagrams(strs) {
  const map = new Map();

  for (const str of strs) {
    const key = str.split('').sort().join('');

    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(str);
  }

  return Array.from(map.values());
}

// groupAnagrams(["eat","tea","tan","ate","nat","bat"])
// [["eat","tea","ate"], ["tan","nat"], ["bat"]]`,
        },
        {
          type: 'text',
          content:
            'Паттерн универсален: можно группировать по любому вычисляемому свойству — длине строки, остатку от деления, первой букве и т. д.',
        },
      ],
    },
    {
      title: 'Map vs Object в JavaScript',
      blocks: [
        {
          type: 'list',
          content:
            'Map принимает любой тип ключа (объекты, числа, функции), Object — только строки и символы\nMap сохраняет порядок вставки ключей (итерация идёт в порядке добавления)\nMap имеет свойство .size, у Object нужно вызывать Object.keys(obj).length\nMap оптимизирован для частого добавления/удаления ключей\nObject удобнее для статических конфигураций и JSON-совместимых структур\nMap не имеет прототипных ключей — нет риска коллизии с toString, constructor и т. д.',
        },
        {
          type: 'callout',
          content:
            'Правило: если ключи заранее известны и являются строками — используйте Object. Если ключи динамические, могут быть любого типа или важен порядок — используйте Map.',
          calloutType: 'tip',
        },
      ],
    },
    {
      title: 'Когда применять',
      blocks: [
        {
          type: 'text',
          content: 'Сигналы, что задача решается с помощью хеш-таблицы:',
        },
        {
          type: 'list',
          content:
            'Нужен быстрый поиск — O(1) lookup по значению или ключу\nТребуется подсчёт частот (символов, слов, элементов)\nНужна группировка элементов по какому-то признаку\nВ условии задачи «найти пару с заданным свойством X» (Two Sum и вариации)\nТребуется проверить наличие/отсутствие элемента за O(1) — используйте Set\nНужно запомнить уже посещённые элементы (дедупликация, обнаружение цикла)',
        },
      ],
    },
    {
      title: 'Типичные ошибки',
      blocks: [
        {
          type: 'callout',
          content:
            'Map — ссылочный тип. Присваивание const b = a не копирует Map, а создаёт вторую ссылку на тот же объект. Для копирования используйте new Map(existingMap).',
          calloutType: 'warning',
        },
        {
          type: 'callout',
          content:
            'Коллизии хеш-функции не нужно обрабатывать вручную в JavaScript — Map делает это за вас. Но важно понимать, что в худшем случае (все ключи в одном бакете) операции деградируют до O(n).',
          calloutType: 'warning',
        },
        {
          type: 'callout',
          content:
            'Использование Object вместо Map, когда ключи — числа. Object автоматически приводит ключи к строкам: obj[1] и obj["1"] — один и тот же ключ. Map различает 1 и "1".',
          calloutType: 'warning',
        },
      ],
    },
  ],
};
