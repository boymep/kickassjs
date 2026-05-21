import type { Lesson } from '../../types/lesson';
import { hashMapQuiz } from '../quizzes/hash-map';

const Q = Object.fromEntries(hashMapQuiz.questions.map((q) => [q.id, q]));

// Вопросы из квиза, используемые как чекпоинты внутри глав.
// Их ID должны быть в CHECKPOINT_IDS, иначе попадут в finalQuiz и тест упадёт.
const CHECKPOINT_IDS = new Set(['hm-q1', 'hm-q5', 'hm-q7', 'hm-q10', 'hm-q15']);

export const hashMapLesson: Lesson = {
  topicId: 'hash-map',

  intro: {
    whyItMatters: `Хеш-таблица — структура, которая даёт поиск, вставку и удаление за O(1) в среднем. В JavaScript это \`Map\`, \`Set\`, \`Object\` и \`WeakMap\`: все они построены на одной идее — получить значение по ключу без перебора всей коллекции.

На собеседовании хеш-таблицы встречаются почти в каждой второй задаче лёгкого и среднего уровня: подсчёт частот, поиск пары с заданной суммой, группировка по признаку, проверка уникальности. Часто наивное решение O(n²) превращается в O(n) одной строкой — \`map.set(...)\`.`,
    estimatedMinutes: 28,
    interviewAngle:
      'Интервьюера обычно интересует не API \`Map\`, а понимание, почему O(1) — амортизированная константа, чем \`Map\` отличается от \`Object\` на уровне движка и в каких случаях операции деградируют до O(n).',
    prerequisites: [],
  },

  chapters: [
    // ─────────────────────────────────────────────────────────────
    {
      id: 'how-it-works',
      title: 'Как устроена хеш-таблица',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            '**Хеш-таблица** — это массив бакетов плюс **хеш-функция**, которая превращает ключ в индекс бакета. Чтобы найти значение по ключу, нужно посчитать хеш и взять элемент по индексу — это O(1) при условии, что хеш-функция распределяет ключи равномерно.',
        },
        {
          type: 'text',
          content:
            'Две разные ключевые строки могут получить один и тот же индекс — это называется **коллизия**. Полностью избежать коллизий нельзя: ключей бесконечно много, а индексов ограниченное число. Поэтому каждая хеш-таблица содержит механизм разрешения коллизий.',
        },
        {
          type: 'visualization',
          content: '',
          vizId: 'hash-map',
        },
        { type: 'heading', content: 'Свойства хорошей хеш-функции' },
        {
          type: 'list',
          content: `**Детерминированность**: одинаковый ключ всегда даёт одинаковый хеш.
**Равномерность**: хеши распределены по диапазону так, чтобы минимизировать коллизии.
**Скорость**: вычисляется за O(1) по размеру таблицы и за O(L) по длине ключа (для строки длины L).`,
        },
        { type: 'heading', content: 'Два способа разрешения коллизий' },
        {
          type: 'list',
          content: `**Цепочки (separate chaining)**: каждый бакет — связный список или массив пар \`{key, value}\`. Простая реализация, устойчива к высокой загрузке. Используется в Java HashMap.
**Открытая адресация (open addressing)**: при коллизии ищется следующий свободный бакет. Лучше работает с кэшем процессора, но требует перестройки таблицы при загрузке выше 50–70 %.`,
        },
        { type: 'heading', content: 'Почему O(1) — амортизированная' },
        {
          type: 'text',
          content:
            'При заполнении таблицы выше определённого порога (обычно ~75 %) движок выделяет массив большего размера и **перехеширует** все ключи — это O(n). Такая операция случается раз на n вставок, поэтому в среднем по большой серии операций цена остаётся константной. Но отдельная вставка в худшем случае может стоить O(n).',
        },
      ],
      checkpoint: [Q['hm-q5']!, {
        type: 'multi-select',
        id: 'hm-ms1',
        description: 'Какие операции хеш-таблицы имеют среднюю сложность O(1)?',
        options: [
          'get(key)',
          'set(key, value)',
          'has(key)',
          'delete(key)',
          'Итерация по всем элементам',
        ],
        correctIndices: [0, 1, 2, 3],
        explanation:
          'get, set, has, delete — O(1) в среднем (O(n) в худшем при цепочке коллизий или перестройке). Итерация — O(n), потому что нужно обойти все записи. Map при этом гарантирует порядок вставки.',
      }],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'frequency-pattern',
      title: 'Подсчёт частот и быстрый поиск',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Два базовых паттерна с \`Map\` на собеседованиях:\n- **Быстрый поиск**: проходим коллекцию один раз, для каждого элемента проверяем, есть ли в \`Map\` его «дополнение». Превращает O(n²) в O(n). Классический пример — задача Two Sum.\n- **Подсчёт частот**: считаем, сколько раз встречается каждый элемент. Нужно для анаграмм, группировок, поиска уникальных.',
        },
        {
          type: 'text',
          content:
            'Сигнал распознать паттерн: в условии есть слова «найдите пару», «посчитайте», «уникальные», «дубликаты», «частоты» — почти всегда это \`Map\` или \`Set\`.',
        },
        {
          type: 'visualization',
          content: '',
          vizId: 'frequency-count',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function countFrequencies(items) {
  const freq = new Map();

  for (const item of items) {
    freq.set(item, (freq.get(item) || 0) + 1);
  }

  return freq;
}

// countFrequencies("abracadabra")
// Map(5) { 'a' => 5, 'b' => 2, 'r' => 2, 'c' => 1, 'd' => 1 }`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Обращение к ключу, которого нет в \`Map\`, возвращает \`undefined\`, а не \`0\`. Идиома \`(map.get(key) || 0) + 1\` — стандартный способ инкремента. Если значение 0 — валидное и его нельзя «перезаписать», вместо \`||\` используется \`??\` (nullish coalescing).',
        },
        { type: 'heading', content: 'Быстрый поиск: задача Two Sum' },
        {
          type: 'visualization',
          content: '',
          vizId: 'two-sum-lookup',
        },
        {
          type: 'text',
          content:
            'Когда задача звучит как «найдите пару элементов с суммой, разностью или произведением, равным X», работает один из двух подходов: бинарный поиск, если массив отсортирован, или хеш-таблица за один проход.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function twoSum(nums, target) {
  const seen = new Map(); // значение → индекс

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }

  return [];
}`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Проверка \`seen.has(complement)\` идёт **до** записи текущего элемента. Это естественно решает случай с дубликатами: \`twoSum([3, 3], 6)\` корректно возвращает \`[0, 1]\`, а не \`[0, 0]\`.',
        },
      ],
      checkpoint: [Q['hm-q1']!, Q['hm-q10']!],
      playground: {
        starterCode: `// Реализуйте hasDuplicate через Set за один проход.
// Верните true, если в массиве есть хотя бы один повтор, иначе false.

function hasDuplicate(arr) {
  // ваш код
}

console.log(hasDuplicate([1, 2, 3, 2]));
console.log(hasDuplicate([1, 2, 3, 4]));`,
        expectedOutput: 'true\nfalse',
        description:
          'Паттерн «уже видел»: добавляем элементы в \`Set\` по одному и проверяем, есть ли уже такой. Сложность — O(n) по времени, O(n) по памяти.',
      },
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'grouping',
      title: 'Группировка по ключу',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Когда в задаче встречается «сгруппируйте элементы по признаку X», обычно подходит \`Map\`, где ключ — это значение признака, а значение — массив элементов. Признак может быть любым: длина строки, остаток от деления, отсортированный набор букв, имя категории.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function groupAnagrams(strs) {
  const groups = new Map();

  for (const s of strs) {
    // Все анаграммы дают одинаковый отсортированный ключ.
    const key = s.split('').sort().join('');

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(s);
  }

  return Array.from(groups.values());
}

// groupAnagrams(["eat","tea","tan","ate","nat","bat"])
// → [["eat","tea","ate"], ["tan","nat"], ["bat"]]`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'В современных движках есть встроенный метод \`Object.groupBy(items, fn)\` (ES2024) и \`Map.groupBy\` для случая, когда ключи — объекты. Шаблон выше остаётся универсальным и работает в более ранних рантаймах.',
        },
        { type: 'heading', content: 'Альтернативный ключ через частоты' },
        {
          type: 'text',
          content:
            'Сортировка строки длины m стоит O(m log m). Если строки длинные, ключ можно сократить до массива из 26 частот букв — это даёт O(m) на ключ без логарифма.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function anagramKey(s) {
  const counts = new Array(26).fill(0);
  for (const ch of s) counts[ch.charCodeAt(0) - 97]++;
  return counts.join(',');
}`,
        },
      ],
      checkpoint: [Q['hm-q7']!, {
        type: 'match-pairs',
        id: 'hm-mp1',
        description: 'Сопоставьте структуру данных с её ключевой характеристикой',
        pairs: [
          { left: 'Map', right: 'Ключи любого типа, гарантирует порядок вставки' },
          { left: 'Object', right: 'Ключи только строки и символы, есть прототип' },
          { left: 'Set', right: 'Хранит уникальные значения, нет дубликатов' },
          { left: 'WeakMap', right: 'Ключи только объекты, не мешает сборке мусора' },
        ],
        explanation:
          '\`Map\` предпочтительнее \`Object\`, когда ключи не строки или порядок важен. \`WeakMap\` — для метаданных объектов без удержания их от сборки мусора. \`Set\` — быстрая проверка наличия за O(1).',
      }],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'map-vs-object',
      title: 'Map, Object и WeakMap',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'В JavaScript три «хеш-подобные» структуры: \`Object\` (ключи — строки и символы, есть прототип), \`Map\` (любые ключи, гарантированный порядок, есть \`.size\`), \`WeakMap\` (слабые ключи, нет итерации). Понимание их различий — один из самых частых вопросов на JS-собеседовании.',
        },
        { type: 'heading', content: 'Object — статические словари' },
        {
          type: 'list',
          content: `Ключи приводятся к строкам или символам: \`obj[1]\` и \`obj["1"]\` — один и тот же ключ.
Наследует прототипные ключи (\`toString\`, \`constructor\`), что может конфликтовать с пользовательскими данными. Защита — \`Object.create(null)\` или \`Object.hasOwn\`.
Размер считается как \`Object.keys(obj).length\` — это O(n).
Удобен для статических словарей и JSON-сериализации.`,
        },
        { type: 'heading', content: 'Map — динамические коллекции' },
        {
          type: 'list',
          content: `Ключ может быть **любого** типа: число, объект, функция, \`NaN\`, \`null\`.
Сохраняет порядок вставки.
\`.size\` за O(1).
Оптимизирован под частые вставки и удаления.
Не имеет прототипных ключей, поэтому безопаснее для пользовательских данных.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Object теряет тип ключа
const obj = {};
obj[1] = 'one';
obj['1'] = 'string-one';
console.log(Object.keys(obj));    // ['1']  — один ключ
console.log(obj[1]);              // 'string-one'

// Map различает 1 и "1"
const map = new Map();
map.set(1, 'one');
map.set('1', 'string-one');
console.log(map.size);            // 2
console.log(map.get(1));          // 'one'`,
        },
        { type: 'heading', content: 'WeakMap — ассоциация без удержания' },
        {
          type: 'text',
          content:
            'У \`WeakMap\` ключи — только объекты, и удерживаются **слабо**. Если на ключ-объект больше нет ссылок снаружи, сборщик мусора уберёт его, а запись из \`WeakMap\` исчезнет. Это удобно, когда нужно прикрепить к объекту приватные данные, не мешая его сборке.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const cache = new WeakMap();

function processNode(domNode) {
  if (cache.has(domNode)) return cache.get(domNode);

  const result = expensiveCompute(domNode);
  cache.set(domNode, result);
  return result;
}

// Когда DOM-узел удаляют со страницы и теряют все ссылки,
// запись из cache исчезнет автоматически — утечки нет.`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'У \`WeakMap\` нет \`.size\`, итераторов и метода \`clear\`. Это сделано специально: иначе видимость ключей мешала бы сборщику мусора. Если нужно перебрать все элементы — берётся обычный \`Map\`, и за утечки приходится отвечать самостоятельно.',
        },
      ],
      checkpoint: [Q['hm-q15']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'pitfalls',
      title: 'Подводные камни',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Самая частая ошибка с \`Map\` — использовать объект как ключ и ожидать, что сравнение пойдёт по содержимому. \`Map\` сравнивает объекты по ссылке: два литерала с одинаковыми полями — это два разных ключа.',
        },
        { type: 'heading', content: 'Объект как ключ сравнивается по ссылке' },
        {
          type: 'code',
          language: 'javascript',
          content: `const map = new Map();
map.set({ id: 1 }, 'A');
map.set({ id: 1 }, 'B');

console.log(map.size);                    // 2 — это два разных объекта
console.log(map.get({ id: 1 }));          // undefined — третий объект, нет в Map`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            '\`Map\` сравнивает ключи через алгоритм SameValueZero — для объектов это сравнение по ссылке. Если нужен ключ по содержимому, используется сериализация (\`JSON.stringify\` с сортировкой ключей) или композитный ключ-строка.',
        },
        { type: 'heading', content: 'Object и числовые ключи' },
        {
          type: 'code',
          language: 'javascript',
          content: `const counts = {};
counts[1] = 'a';
counts['1'] = 'b';
console.log(Object.keys(counts)); // ['1'] — один ключ, "1" перезаписал 1

// Если важен тип ключа — используется Map
const m = new Map();
m.set(1, 'a');
m.set('1', 'b');
console.log(m.size); // 2`,
        },
        { type: 'heading', content: 'Прототипные ключи у Object' },
        {
          type: 'code',
          language: 'javascript',
          content: `const obj = {};
console.log(obj.toString); // function — наследуется от Object.prototype

// Безопасный словарь — без прототипа
const dict = Object.create(null);
console.log(dict.toString); // undefined`,
        },
        { type: 'heading', content: 'Деградация O(1) до O(n)' },
        {
          type: 'text',
          content:
            'В худшем случае все ключи попадают в один бакет, и операции деградируют до O(n). На практике в V8 это маловероятно — хеш-функция инициализируется случайным значением при старте процесса. Но если в задаче явно говорится про специально подобранные ключи (hash flooding-атака), эту деградацию стоит упомянуть на собеседовании.',
        },
      ],
      playground: {
        starterCode: `// Что выведет console.log? Запустите мысленно или в реальности.

const seen = new Map();
const a = { id: 1 };
const b = { id: 1 };

seen.set(a, 'first');
console.log(seen.get(b));`,
        expectedOutput: 'undefined',
        description:
          '\`Map\` сравнивает объектные ключи по ссылке, а не по содержимому. \`a\` и \`b\` — два разных объекта, поэтому \`seen.get(b)\` возвращает \`undefined\`.',
      },
    },
  ],

  // Все вопросы квиза, не использованные как чекпоинт
  finalQuiz: hashMapQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  cheatsheet: `### Шпаргалка по хеш-таблицам

**Когда применять**
- Поиск, вставка, удаление за O(1) в среднем
- Подсчёт частот, проверка уникальности, группировка
- Превращение O(n²) в O(n) через таблицу «уже виденного»

**Сложность**
- get / set / has / delete — O(1) амортизированно
- Итерация — O(n)
- В худшем случае операция может стоить O(n) из-за перестройки таблицы

**Подсчёт частот**
\`\`\`js
const freq = new Map();
for (const item of arr) {
  freq.set(item, (freq.get(item) || 0) + 1);
}
\`\`\`

**Быстрый поиск (Two Sum)**
\`\`\`js
const seen = new Map();
for (let i = 0; i < nums.length; i++) {
  const c = target - nums[i];
  if (seen.has(c)) return [seen.get(c), i];
  seen.set(nums[i], i);
}
\`\`\`
- Проверка \`has(complement)\` идёт **до** записи текущего

**Группировка**
\`\`\`js
if (!groups.has(key)) groups.set(key, []);
groups.get(key).push(item);
\`\`\`

**Map vs Object**
- Map: ключи любого типа, порядок вставки, \`.size\` за O(1)
- Object: ключи строки и символы, есть прототип, удобен для JSON
- \`obj[1]\` и \`obj["1"]\` — один ключ в Object, два — в Map

**WeakMap**
- Ключи только объекты, слабые ссылки
- Нет \`.size\`, нет итерации
- Используется для метаданных объектов и кэшей с автоочисткой

**Подводные камни**
- Объект как ключ сравнивается по ссылке, не по содержимому
- Прототипные ключи у Object: лечится \`Object.create(null)\` или \`hasOwn\`
- При специально подобранных ключах возможна деградация до O(n) на операцию`,

  nextTopics: [
    {
      slug: 'sliding-window',
      reason:
        'Скользящее окно почти всегда комбинируется с хеш-таблицей: \`Map\` для частот символов в окне, \`Set\` для уникальности.',
    },
    {
      slug: 'trees',
      reason:
        'Деревья — следующий шаг по структурам данных. Многие задачи на деревьях используют хеш-таблицы для маркировки посещённых узлов и кэширования поддеревьев.',
    },
  ],
};
