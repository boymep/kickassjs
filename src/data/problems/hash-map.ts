import type { Problem } from '../../types/problem';

export const hashMapProblems: Problem[] = [
  {
    id: 'hm-p1',
    topicId: 'hash-map',
    title: 'Two Sum',
    difficulty: 'easy',
    isContextual: false,
    description: `Дан массив целых чисел \`nums\` и целое число \`target\`. Верните индексы двух элементов, сумма которых равна \`target\`.

Можно считать, что каждый вход имеет **ровно одно решение**, и нельзя использовать один и тот же элемент дважды.

Верните массив из двух индексов \`[i, j]\`, где \`i < j\`.

**Примеры:**
\`\`\`
twoSum([2, 7, 11, 15], 9)  // → [0, 1]
twoSum([3, 2, 4], 6)       // → [1, 2]
twoSum([3, 3], 6)          // → [0, 1]
\`\`\``,
    functionName: 'twoSum',
    starterCode: `function twoSum(nums, target) {
  // ваш код
}`,
    testCases: [
      {
        id: 'hm-p1-t1',
        inputDisplay: 'twoSum([2, 7, 11, 15], 9)',
        inputArgs: [[2, 7, 11, 15], 9],
        expected: [0, 1],
      },
      {
        id: 'hm-p1-t2',
        inputDisplay: 'twoSum([3, 2, 4], 6)',
        inputArgs: [[3, 2, 4], 6],
        expected: [1, 2],
      },
      {
        id: 'hm-p1-t3',
        inputDisplay: 'twoSum([3, 3], 6)',
        inputArgs: [[3, 3], 6],
        expected: [0, 1],
      },
      {
        id: 'hm-p1-t4',
        inputDisplay: 'twoSum([1, 5, 3, 7, 2], 9)',
        inputArgs: [[1, 5, 3, 7, 2], 9],
        expected: [3, 4],
      },
      {
        id: 'hm-p1-t5',
        inputDisplay: 'twoSum([-1, -2, -3, -4, -5], -8)',
        inputArgs: [[-1, -2, -3, -4, -5], -8],
        expected: [2, 4],
      },
    ],
    hints: [
      'Для каждого элемента нужен «партнёр» с заранее известным значением — `target - nums[i]`. Если бы можно было мгновенно проверить, встречался ли такой партнёр раньше, хватило бы одного прохода.',
      'Идите по массиву слева направо. Для каждого `nums[i]` сначала проверяйте, есть ли `target - nums[i]` среди уже виденных значений (храните их вместе с индексами в Map: значение → индекс). Если есть — пара найдена. Если нет — кладите `nums[i] → i` в Map.',
      `Главное — проверять \`complement\` **до** того, как положить текущий элемент в Map. Иначе для \`nums = [3, 3], target = 6\` вы сравните \`3\` сам с собой и решите, что пара есть из одного индекса. И помните: ключ в Map — это значение, а индекс — значение записи, потому что искать вы будете именно по значению.

С чего начать:
\`\`\`js
const map = new Map();
for (let i = 0; i < nums.length; i++) {
  const complement = target - nums[i];
  // ...
}
return [];
\`\`\``,
    ],
    solutionCode: `function twoSum(nums, target) {
  const map = new Map();

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
    id: 'hm-p2',
    topicId: 'hash-map',
    title: 'Проверка анаграммы',
    difficulty: 'easy',
    isContextual: false,
    description: `Даны две строки \`s\` и \`t\`. Определите, является ли \`t\` **анаграммой** \`s\`.

Анаграмма — это слово, полученное перестановкой букв другого слова. Обе строки состоят только из строчных латинских букв.

Верните \`true\`, если строки являются анаграммами, и \`false\` в противном случае.

**Примеры:**
\`\`\`
isAnagram('anagram', 'nagaram')  // → true
isAnagram('listen', 'silent')    // → true
isAnagram('rat', 'car')          // → false
\`\`\``,
    functionName: 'isAnagram',
    starterCode: `function isAnagram(s, t) {
  // ваш код
}`,
    testCases: [
      {
        id: 'hm-p2-t1',
        inputDisplay: 'isAnagram("anagram", "nagaram")',
        inputArgs: ['anagram', 'nagaram'],
        expected: true,
      },
      {
        id: 'hm-p2-t2',
        inputDisplay: 'isAnagram("rat", "car")',
        inputArgs: ['rat', 'car'],
        expected: false,
      },
      {
        id: 'hm-p2-t3',
        inputDisplay: 'isAnagram("listen", "silent")',
        inputArgs: ['listen', 'silent'],
        expected: true,
      },
      {
        id: 'hm-p2-t4',
        inputDisplay: 'isAnagram("hello", "world")',
        inputArgs: ['hello', 'world'],
        expected: false,
      },
      {
        id: 'hm-p2-t5',
        inputDisplay: 'isAnagram("a", "a")',
        inputArgs: ['a', 'a'],
        expected: true,
      },
      {
        id: 'hm-p2-t6',
        inputDisplay: 'isAnagram("ab", "a")',
        inputArgs: ['ab', 'a'],
        expected: false,
      },
    ],
    hints: [
      'Две строки — анаграммы тогда и только тогда, когда у них совпадают мультимножества символов. Сортировка работает за O(n log n) — но достаточно посчитать сколько раз встречается каждая буква.',
      'Сначала отсейте случай разной длины. Затем за один проход по `s` соберите Map `символ → количество`. Идя по `t`, уменьшайте счётчики; если какого-то символа не хватает (нет в Map или счётчик уже 0) — это не анаграмма.',
      `Главный инвариант: в момент любой итерации по \`t\` счётчик в Map показывает, сколько ещё букв этого вида должно встретиться в \`t\`. Если счётчик опустился до нуля, а буква встретилась снова — это уже «лишняя» буква и анаграммы нет. Проверка длины в начале — обязательна: без неё для \`s = "a"\`, \`t = "aa"\` второй цикл прошёл бы по более длинной строке.

С чего начать:
\`\`\`js
if (s.length !== t.length) return false;
const freq = new Map();
for (const ch of s) {
  // ...
}
return true;
\`\`\``,
    ],
    solutionCode: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;

  const freq = new Map();

  for (const ch of s) {
    freq.set(ch, (freq.get(ch) || 0) + 1);
  }

  for (const ch of t) {
    if (!freq.has(ch) || freq.get(ch) === 0) return false;
    freq.set(ch, freq.get(ch) - 1);
  }

  return true;
}`,
  },
  {
    id: 'hm-p3',
    topicId: 'hash-map',
    title: 'Чемпионы шагов',
    difficulty: 'medium',
    isContextual: true,
    description: `В компании проходит корпоративный челлендж по шагам. Каждый день фиксируются результаты участников — количество пройденных шагов.

Дан массив \`days\`, где каждый элемент — массив объектов \`{ userId: number, steps: number }\`, представляющий результаты за один день.

Нужно найти **чемпионов** — пользователей, которые:

1. Участвовали **каждый** день (имеют запись в каждом дне).
2. Среди таких пользователей набрали **максимальное** суммарное количество шагов за все дни.

Верните объект \`{ userIds: number[], steps: number }\`, где \`userIds\` — отсортированный по возрастанию массив id чемпионов, а \`steps\` — их суммарное количество шагов. Если несколько пользователей набрали одинаковое максимальное количество — верните всех.`,
    functionName: 'findChampions',
    starterCode: `function findChampions(days) {
  // ваш код
}`,
    testCases: [
      {
        id: 'hm-p3-t1',
        inputDisplay:
          'findChampions([[{userId:1,steps:1000},{userId:2,steps:1500}],[{userId:2,steps:1000}]])',
        inputArgs: [
          [
            [
              { userId: 1, steps: 1000 },
              { userId: 2, steps: 1500 },
            ],
            [{ userId: 2, steps: 1000 }],
          ],
        ],
        expected: { userIds: [2], steps: 2500 },
      },
      {
        id: 'hm-p3-t2',
        inputDisplay:
          'findChampions([[{userId:1,steps:2000},{userId:3,steps:1500}],[{userId:2,steps:4000},{userId:1,steps:3500}]])',
        inputArgs: [
          [
            [
              { userId: 1, steps: 2000 },
              { userId: 3, steps: 1500 },
            ],
            [
              { userId: 2, steps: 4000 },
              { userId: 1, steps: 3500 },
            ],
          ],
        ],
        expected: { userIds: [1], steps: 5500 },
      },
      {
        id: 'hm-p3-t3',
        inputDisplay:
          'findChampions([[{userId:1,steps:3000},{userId:2,steps:3000}],[{userId:1,steps:2000},{userId:2,steps:2000}]])',
        inputArgs: [
          [
            [
              { userId: 1, steps: 3000 },
              { userId: 2, steps: 3000 },
            ],
            [
              { userId: 1, steps: 2000 },
              { userId: 2, steps: 2000 },
            ],
          ],
        ],
        expected: { userIds: [1, 2], steps: 5000 },
      },
      {
        id: 'hm-p3-t4',
        inputDisplay: 'findChampions([[{userId:1,steps:5000}]])',
        inputArgs: [[[{ userId: 1, steps: 5000 }]]],
        expected: { userIds: [1], steps: 5000 },
      },
      {
        id: 'hm-p3-t5',
        inputDisplay:
          'findChampions([[{userId:1,steps:500},{userId:2,steps:1000}],[{userId:1,steps:500},{userId:3,steps:2000}],[{userId:1,steps:500},{userId:2,steps:800}]])',
        inputArgs: [
          [
            [
              { userId: 1, steps: 500 },
              { userId: 2, steps: 1000 },
            ],
            [
              { userId: 1, steps: 500 },
              { userId: 3, steps: 2000 },
            ],
            [
              { userId: 1, steps: 500 },
              { userId: 2, steps: 800 },
            ],
          ],
        ],
        expected: { userIds: [1], steps: 1500 },
      },
    ],
    hints: [
      'Для каждого пользователя нужны две агрегации: суммарные шаги и количество дней, в которых он появился. Обе считаются за один проход — нужны две независимые «копилки» по userId.',
      'Заведите два Map: `totalSteps` (userId → сумма) и `daysCount` (userId → сколько дней встречался). Проходя `days`, для каждой записи прибавляйте `steps` и `+1` к счётчику дней. «Участвовал каждый день» означает `daysCount.get(userId) === days.length`.',
      `Ловушка — начальное \`max = 0\`. Если в каком-то дне нет ни одного пользователя или все участвовали не во все дни, \`champions\` так и останется пустым, и это правильный ответ — но \`steps\` тогда логично вернуть тоже \`0\`. И не забудьте про равенство: при \`steps === maxSteps\` чемпиона нужно **добавить** в список, а не заменить — иначе при ничьей вернётся только последний пользователь.

С чего начать:
\`\`\`js
const totalSteps = new Map();
const daysCount = new Map();
for (const day of days) {
  // ...
}
return { userIds: [], steps: 0 };
\`\`\``,
    ],
    solutionCode: `function findChampions(days) {
  const totalSteps = new Map();
  const daysCount = new Map();
  const totalDays = days.length;

  for (const day of days) {
    for (const { userId, steps } of day) {
      totalSteps.set(userId, (totalSteps.get(userId) || 0) + steps);
      daysCount.set(userId, (daysCount.get(userId) || 0) + 1);
    }
  }

  let maxSteps = 0;
  let champions = [];

  for (const [userId, count] of daysCount) {
    if (count === totalDays) {
      const steps = totalSteps.get(userId);
      if (steps > maxSteps) {
        maxSteps = steps;
        champions = [userId];
      } else if (steps === maxSteps) {
        champions.push(userId);
      }
    }
  }

  return { userIds: champions.sort((a, b) => a - b), steps: maxSteps };
}`,
  },
  {
    id: 'hm-p4',
    topicId: 'hash-map',
    title: 'Подсчёт уникальных посетителей',
    difficulty: 'easy',
    isContextual: true,
    description: `Дан массив логов визитов — каждый элемент это \`userId\` (число). Один пользователь может посетить сайт несколько раз. Верните **количество уникальных посетителей**.

**Примеры:**
\`\`\`
countUnique([1, 2, 3, 1, 2])  // → 3
countUnique([1, 1, 1])        // → 1
countUnique([])               // → 0
\`\`\``,
    functionName: 'countUnique',
    starterCode: `function countUnique(visits) {
  // ваш код
}`,
    testCases: [
      {
        id: 'hm-p4-t1',
        inputDisplay: 'countUnique([1, 2, 3, 1, 2])',
        inputArgs: [[1, 2, 3, 1, 2]],
        expected: 3,
      },
      {
        id: 'hm-p4-t2',
        inputDisplay: 'countUnique([1, 1, 1])',
        inputArgs: [[1, 1, 1]],
        expected: 1,
      },
      {
        id: 'hm-p4-t3',
        inputDisplay: 'countUnique([])',
        inputArgs: [[]],
        expected: 0,
      },
      {
        id: 'hm-p4-t4',
        inputDisplay: 'countUnique([5])',
        inputArgs: [[5]],
        expected: 1,
      },
      {
        id: 'hm-p4-t5',
        inputDisplay: 'countUnique([1, 2, 3, 4, 5])',
        inputArgs: [[1, 2, 3, 4, 5]],
        expected: 5,
      },
    ],
    hints: [
      'Нужно собрать значения без повторов и узнать их количество. В JavaScript есть встроенная структура, которая хранит уникальные значения и сразу знает свой размер.',
      'Конструктор `Set` принимает любой iterable и пропускает дубли через SameValueZero. Пустой массив даст `Set` размера `0` — отдельной обработки не нужно. Если бы значения были объектами, такой трюк не сработал бы: одинаковые по содержимому объекты сравниваются по ссылке и считались бы разными.',
    ],
    solutionCode: `function countUnique(visits) {
  return new Set(visits).size;
}`,
  },
  {
    id: 'hm-p5',
    topicId: 'hash-map',
    title: 'Группировка объявлений по категориям',
    difficulty: 'medium',
    isContextual: true,
    description: `Дан массив объявлений, каждое — объект \`{ id: number, category: string }\`. Сгруппируйте объявления по категориям. Верните объект, где **ключ** — категория, **значение** — массив id объявлений этой категории (в порядке появления).

**Пример:**
\`\`\`
groupByCategory([
  { id: 1, category: 'авто' },
  { id: 2, category: 'недвижимость' },
  { id: 3, category: 'авто' },
])
// → { 'авто': [1, 3], 'недвижимость': [2] }
\`\`\``,
    functionName: 'groupByCategory',
    starterCode: `function groupByCategory(ads) {
  // ваш код
}`,
    testCases: [
      {
        id: 'hm-p5-t1',
        inputDisplay:
          'groupByCategory([{id:1,category:"авто"},{id:2,category:"недвижимость"},{id:3,category:"авто"}])',
        inputArgs: [
          [
            { id: 1, category: 'авто' },
            { id: 2, category: 'недвижимость' },
            { id: 3, category: 'авто' },
          ],
        ],
        expected: { 'авто': [1, 3], 'недвижимость': [2] },
      },
      {
        id: 'hm-p5-t2',
        inputDisplay: 'groupByCategory([])',
        inputArgs: [[]],
        expected: {},
      },
      {
        id: 'hm-p5-t3',
        inputDisplay:
          'groupByCategory([{id:10,category:"электроника"}])',
        inputArgs: [[{ id: 10, category: 'электроника' }]],
        expected: { 'электроника': [10] },
      },
      {
        id: 'hm-p5-t4',
        inputDisplay:
          'groupByCategory([{id:1,category:"а"},{id:2,category:"б"},{id:3,category:"в"},{id:4,category:"а"},{id:5,category:"б"}])',
        inputArgs: [
          [
            { id: 1, category: 'а' },
            { id: 2, category: 'б' },
            { id: 3, category: 'в' },
            { id: 4, category: 'а' },
            { id: 5, category: 'б' },
          ],
        ],
        expected: { 'а': [1, 4], 'б': [2, 5], 'в': [3] },
      },
      {
        id: 'hm-p5-t5',
        inputDisplay:
          'groupByCategory([{id:1,category:"x"},{id:2,category:"x"},{id:3,category:"x"}])',
        inputArgs: [
          [
            { id: 1, category: 'x' },
            { id: 2, category: 'x' },
            { id: 3, category: 'x' },
          ],
        ],
        expected: { x: [1, 2, 3] },
      },
    ],
    hints: [
      'Категории заранее неизвестны — нельзя завести фиксированный набор массивов. Нужен «динамический контейнер», где новые корзины создаются по мере появления новых ключей.',
      'Используйте обычный объект (или Map) `category → number[]`. Для каждого объявления: если корзины ещё нет — создайте пустой массив, затем `push(ad.id)`. Порядок появления сохраняется автоматически.',
      `Ловушка — пропустить инициализацию корзины. \`groups[ad.category].push(...)\` упадёт на первом попадании каждой новой категории, потому что \`groups[ad.category]\` ещё \`undefined\`. Лениво создавайте пустой массив при первом появлении ключа. Порядок появления категорий сохраняется автоматически — обычные объекты помнят порядок вставки строковых ключей.

С чего начать:
\`\`\`js
const groups = {};
for (const ad of ads) {
  // ...
}
return groups;
\`\`\``,
    ],
    solutionCode: `function groupByCategory(ads) {
  const groups = {};

  for (const ad of ads) {
    if (!groups[ad.category]) {
      groups[ad.category] = [];
    }
    groups[ad.category].push(ad.id);
  }

  return groups;
}`,
  },
  {
    id: 'hm-p6',
    topicId: 'hash-map',
    kind: 'predict-output',
    title: 'Что выведет код с Map и Set?',
    difficulty: 'medium',
    isContextual: false,
    description: `Перед вами фрагмент кода, использующий \`Map\` и \`Set\` с разными типами ключей. Что попадёт в stdout?`,
    code: `const map = new Map();
map.set(1, 'number-one');
map.set('1', 'string-one');
map.set(NaN, 'not-a-number');
map.set(NaN, 'still-not-a-number');

const set = new Set([1, '1', NaN, NaN, +0, -0]);

console.log(map.size);
console.log(map.get(NaN));
console.log(set.size);`,
    expected: '3\nstill-not-a-number\n4',
    hints: [
      'Шаг 1 (`map.size`). Map не приводит ключи к строке: `1` (number) и `"1"` (string) — это два разных ключа. А вот два подряд `set(NaN, ...)` — это один ключ (см. шаг 2).',
      'Шаг 2 (`map.get(NaN)`). Map и Set сравнивают ключи по алгоритму **SameValueZero**, в котором `NaN === NaN` считается истиной. Поэтому второй `set(NaN, ...)` перезаписывает первый — остаётся `"still-not-a-number"`. Итого в map три ключа: `1`, `"1"`, `NaN`.',
      'Шаг 3 (`set.size`). По SameValueZero: дубли `NaN, NaN` свернутся в один, `+0` и `-0` — тоже в один. Уникальные значения: `1`, `"1"`, `NaN`, `0` → размер 4. Итог: `3\\nstill-not-a-number\\n4`.',
    ],
    solutionCode: `// map: { 1 => 'number-one', '1' => 'string-one', NaN => 'still-not-a-number' }
// → size = 3, get(NaN) = 'still-not-a-number'
// set: { 1, '1', NaN, 0 } — +0 и -0 это один элемент
// → size = 4`,
  },
  {
    id: 'hm-p7',
    topicId: 'hash-map',
    kind: 'find-bug',
    title: 'Баг: Map с объектным ключом',
    difficulty: 'medium',
    isContextual: false,
    description: `Функция \`findUserSession\` должна вернуть \`sessionId\` пользователя по объекту-ключу. Но тесты падают: каждый раз возвращается \`undefined\`.

Найдите баг и исправьте функцию так, чтобы поиск по совпадающему \`userId\` работал. Сигнатура и поведение должны остаться прежними:

- **Вход:** массив записей \`{ user: { id }, sessionId }\` и искомый объект \`query\`.
- **Выход:** найденный \`sessionId\` или \`null\`.`,
    functionName: 'findUserSession',
    buggyCode: `function findUserSession(records, query) {
  const sessions = new Map();

  for (const { user, sessionId } of records) {
    sessions.set(user, sessionId);
  }

  return sessions.get(query) ?? null;
}`,
    bugSummary:
      'Map сравнивает объектные ключи по ссылке (SameValueZero). \`query\` и \`user\` из records — разные объекты, даже если у них одинаковый \`id\`. Чтобы сравнение шло по содержимому, нужно использовать \`user.id\` как ключ, а не сам объект.',
    testCases: [
      {
        id: 'hm-p7-t1',
        inputDisplay:
          "findUserSession([{user:{id:1},sessionId:'A'},{user:{id:2},sessionId:'B'}], {id:1})",
        inputArgs: [
          [
            { user: { id: 1 }, sessionId: 'A' },
            { user: { id: 2 }, sessionId: 'B' },
          ],
          { id: 1 },
        ],
        expected: 'A',
      },
      {
        id: 'hm-p7-t2',
        inputDisplay:
          "findUserSession([{user:{id:1},sessionId:'A'},{user:{id:2},sessionId:'B'}], {id:2})",
        inputArgs: [
          [
            { user: { id: 1 }, sessionId: 'A' },
            { user: { id: 2 }, sessionId: 'B' },
          ],
          { id: 2 },
        ],
        expected: 'B',
      },
      {
        id: 'hm-p7-t3',
        inputDisplay: 'findUserSession([], {id:1})',
        inputArgs: [[], { id: 1 }],
        expected: null,
      },
      {
        id: 'hm-p7-t4',
        inputDisplay:
          "findUserSession([{user:{id:42},sessionId:'X'}], {id:99})",
        inputArgs: [[{ user: { id: 42 }, sessionId: 'X' }], { id: 99 }],
        expected: null,
      },
      {
        id: 'hm-p7-t5',
        inputDisplay:
          "findUserSession([{user:{id:7},sessionId:'first'},{user:{id:7},sessionId:'second'}], {id:7})",
        inputArgs: [
          [
            { user: { id: 7 }, sessionId: 'first' },
            { user: { id: 7 }, sessionId: 'second' },
          ],
          { id: 7 },
        ],
        expected: 'second',
      },
    ],
    hints: [
      'Шаг 1: посмотрите, что именно кладётся в Map в цикле — это объект `user` (со своей ссылкой) или какое-то его поле? И что передаётся в `sessions.get(...)`?',
      'Шаг 2: Map сравнивает ключи через SameValueZero. Для объектов это значит «та же ссылка», а не «то же содержимое». Объект `{id: 1}` из records и объект `{id: 1}` из аргумента `query` — это два разных объекта в памяти.',
      'Шаг 3: ключевой принцип — Map (и Set) сравнивают по SameValueZero. Для примитивов это сравнение по значению, для объектов — по ссылке. Чтобы поиск по «логически равным» объектам работал, превратите их в примитив (`user.id`) или нормализованную строку (например, `JSON.stringify`). Иначе придётся хранить и сравнивать конкретные ссылки.',
    ],
    solutionCode: `function findUserSession(records, query) {
  const sessions = new Map();

  for (const { user, sessionId } of records) {
    sessions.set(user.id, sessionId);
  }

  return sessions.get(query.id) ?? null;
}`,
  },
  {
    id: 'hm-p8',
    topicId: 'hash-map',
    kind: 'refactor',
    title: 'Рефакторинг: пары с заданной разностью за O(n)',
    difficulty: 'medium',
    isContextual: false,
    description: `Функция \`countPairsWithDiff(nums, k)\` должна вернуть количество пар индексов \`(i, j)\` таких, что \`i < j\` и \`|nums[i] - nums[j]| === k\`. В массиве могут быть дубликаты.

Текущая реализация работает за **O(n²)** — вложенный цикл. На входе из 100 000 элементов это уже не проходит по времени.

**Задача:** перепишите функцию через \`Map\` (или \`Set\`) так, чтобы она работала за **O(n)**.`,
    functionName: 'countPairsWithDiff',
    starterCode: `function countPairsWithDiff(nums, k) {
  let count = 0;

  // O(n^2): вложенный цикл
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (Math.abs(nums[i] - nums[j]) === k) {
        count++;
      }
    }
  }

  return count;
}`,
    testCases: [
      {
        id: 'hm-p8-t1',
        inputDisplay: 'countPairsWithDiff([1, 5, 3, 4, 2], 2)',
        inputArgs: [[1, 5, 3, 4, 2], 2],
        expected: 3,
      },
      {
        id: 'hm-p8-t2',
        inputDisplay: 'countPairsWithDiff([1, 1, 1, 1], 0)',
        inputArgs: [[1, 1, 1, 1], 0],
        expected: 6,
      },
      {
        id: 'hm-p8-t3',
        inputDisplay: 'countPairsWithDiff([1, 2, 3], 5)',
        inputArgs: [[1, 2, 3], 5],
        expected: 0,
      },
      {
        id: 'hm-p8-t4',
        inputDisplay: 'countPairsWithDiff([3, 1, 4, 1, 5], 2)',
        inputArgs: [[3, 1, 4, 1, 5], 2],
        expected: 3,
      },
      {
        id: 'hm-p8-t5',
        inputDisplay: 'countPairsWithDiff([], 1)',
        inputArgs: [[], 1],
        expected: 0,
      },
    ],
    perfTest: {
      // 100k элементов, k=1 — вложенный цикл не уложится в 50ms.
      inputArgs: [
        Array.from({ length: 100_000 }, (_, i) => i % 1000),
        1,
      ],
      maxMs: 50,
    },
    hints: [
      'Для каждого числа `x` партнёр — это `x + k` (или `x - k`, но если перебирать одно направление, дубли не появятся). Если посчитать, сколько раз встречается каждое значение, количество пар `(x, x+k)` равно произведению их частот.',
      'Шаг 1: соберите Map `число → частота` за один проход. Шаг 2: для `k > 0` пройдитесь по всем `(num, count)` и прибавляйте `count * freq.get(num + k)`. Случай `k === 0` особый: в одной группе одинаковых чисел количество пар = `C(count, 2) = count * (count - 1) / 2`.',
      `Главная ловушка — двойной счёт. Если перебирать обе пары \`(x, x+k)\` и \`(x, x-k)\`, каждая пара посчитается дважды. Поэтому идите в одном направлении (\`num + k\`) — пара \`(a, b)\` с \`a < b\` встретится ровно один раз через \`num = a\`. Для \`k === 0\` это вырождается в комбинации внутри группы одинаковых чисел: \`C(c, 2) = c * (c - 1) / 2\`, а не \`c * c\` (иначе посчитаете пары \`(i, i)\` сами с собой).

С чего начать:
\`\`\`js
const freq = new Map();
for (const n of nums) {
  // ...
}
let count = 0;
// ...
return count;
\`\`\``,
    ],
    solutionCode: `function countPairsWithDiff(nums, k) {
  const freq = new Map();
  for (const n of nums) {
    freq.set(n, (freq.get(n) || 0) + 1);
  }

  let count = 0;

  if (k === 0) {
    // Пары одинаковых: C(n, 2) = n*(n-1)/2 в каждой группе.
    for (const c of freq.values()) {
      count += (c * (c - 1)) / 2;
    }
    return count;
  }

  // k > 0: для каждого num считаем пары (num, num + k).
  for (const [num, c] of freq) {
    const partner = freq.get(num + k);
    if (partner) count += c * partner;
  }

  return count;
}`,
  },
  {
    id: 'hm-h1',
    topicId: 'hash-map',
    kind: 'implement',
    title: 'Длиннейшая последовательная цепочка — O(n)',
    difficulty: 'hard',
    isContextual: false,
    description: `Дан неотсортированный массив целых чисел \`nums\`. Найдите длину **длиннейшей последовательной цепочки** — то есть самой длинной последовательности подряд идущих целых чисел, которую можно собрать из элементов массива.

Например, в \`[100, 4, 200, 1, 3, 2]\` цепочка \`1, 2, 3, 4\` имеет длину **4**.

**Решение должно работать за O(n)** — без сортировки!

Примеры:
\`\`\`
longestConsecutive([100, 4, 200, 1, 3, 2])           // → 4
longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])  // → 9
longestConsecutive([1])                               // → 1
longestConsecutive([])                                // → 0
\`\`\``,
    functionName: 'longestConsecutive',
    starterCode: `function longestConsecutive(nums) {
  // ваш код — только O(n), без сортировки!
}`,
    testCases: [
      { id: 'hm-h1-t1', inputDisplay: 'longestConsecutive([100,4,200,1,3,2])', inputArgs: [[100, 4, 200, 1, 3, 2]], expected: 4 },
      { id: 'hm-h1-t2', inputDisplay: 'longestConsecutive([0,3,7,2,5,8,4,6,0,1])', inputArgs: [[0,3,7,2,5,8,4,6,0,1]], expected: 9 },
      { id: 'hm-h1-t3', inputDisplay: 'longestConsecutive([1])', inputArgs: [[1]], expected: 1 },
      { id: 'hm-h1-t4', inputDisplay: 'longestConsecutive([])', inputArgs: [[]], expected: 0 },
      { id: 'hm-h1-t5', inputDisplay: 'longestConsecutive([1,2,0,1])', inputArgs: [[1,2,0,1]], expected: 3 },
    ],
    hints: [
      'Сортировка дала бы O(n log n) — нам нужно быстрее. Идея: положить все числа в структуру с O(1) поиском, и тогда для каждой потенциальной «головы» цепочки можно за линейное число шагов протянуть её вверх.',
      'Положите все элементы в `Set`. Число `n` — начало цепочки тогда и только тогда, когда `n - 1` НЕ в Set. Только из таких стартовых точек идите вверх: `while (set.has(cur + 1)) cur++; len++;`. Это даёт O(n) суммарно, потому что каждое число обходится ровно в одной цепочке.',
      `Почему это O(n), а не O(n²): внешний цикл может выглядеть «вложенным» из-за \`while\`, но внутрь \`while\` мы заходим **только** для начал цепочек (там, где \`n - 1\` отсутствует). Каждое число во всём массиве принадлежит ровно одной цепочке и обходится только из её начала — суммарно \`O(n)\` шагов по \`while\` за весь прогон. Дубликаты автоматически схлопываются \`Set\`, и пустой массив даёт \`maxLen = 0\` без отдельной обработки.

С чего начать:
\`\`\`js
const set = new Set(nums);
let maxLen = 0;
for (const n of set) {
  // ...
}
return maxLen;
\`\`\``,
    ],
    solutionCode: `function longestConsecutive(nums) {
  const set = new Set(nums);
  let maxLen = 0;

  for (const n of set) {
    if (set.has(n - 1)) continue; // не начало цепочки

    let cur = n, len = 1;
    while (set.has(cur + 1)) { cur++; len++; }
    maxLen = Math.max(maxLen, len);
  }

  return maxLen;
}`,
  },
  {
    id: 'hm-h2',
    topicId: 'hash-map',
    kind: 'implement',
    title: 'Подмассивы с нулевой суммой — найти все',
    difficulty: 'hard',
    isContextual: false,
    description: `Дан массив целых чисел \`nums\` (могут быть отрицательные). Найдите **все подмассивы с нулевой суммой** и верните массив пар \`[start, end]\` (включительно, 0-based), упорядоченных по start, затем по end.

Если таких подмассивов нет — верните пустой массив.

Примеры:
\`\`\`
findZeroSumSubarrays([1, -1, 2, -2])   // → [[0,1], [0,3], [2,3]]
findZeroSumSubarrays([1, 2, 3])         // → []
findZeroSumSubarrays([0])               // → [[0,0]]
\`\`\``,
    functionName: 'findZeroSumSubarrays',
    starterCode: `function findZeroSumSubarrays(nums) {
  // ваш код
}`,
    testCases: [
      {
        id: 'hm-h2-t1',
        inputDisplay: 'findZeroSumSubarrays([1,-1,2,-2])',
        inputArgs: [[1, -1, 2, -2]],
        expected: [[0,1],[0,3],[2,3]],
      },
      {
        id: 'hm-h2-t2',
        inputDisplay: 'findZeroSumSubarrays([1,2,3]) → []',
        inputArgs: [[1, 2, 3]],
        expected: [],
      },
      {
        id: 'hm-h2-t3',
        inputDisplay: 'findZeroSumSubarrays([0])',
        inputArgs: [[0]],
        expected: [[0,0]],
      },
      {
        id: 'hm-h2-t4',
        inputDisplay: 'findZeroSumSubarrays([1,-1,1,-1])',
        inputArgs: [[1,-1,1,-1]],
        expected: [[0,1],[0,3],[2,3]],
      },
    ],
    hints: [
      'Подмассив `nums[i..j]` имеет сумму = `prefix[j] - prefix[i-1]`. Сумма равна нулю ⇔ `prefix[j] === prefix[i-1]`. То есть нужно искать **совпадающие префиксные суммы** (включая префикс «до начала» = 0).',
      'Идите слева направо, поддерживая `sum`. Для каждой текущей `sum` сохраните все индексы, где она уже встречалась, в Map `sum → number[]` (с предзаполнением `0 → [-1]`). Когда снова встречаете эту же `sum` в позиции `i`, для каждого сохранённого `j` подмассив `[j+1, i]` имеет нулевую сумму.',
      `Ключевая хитрость — предзаполнение \`0 → [-1]\`. Без неё подмассивы, начинающиеся с индекса \`0\`, не были бы найдены: они соответствуют префиксной сумме, равной нулю, до того как добавлен какой-либо элемент. Индекс \`j + 1\` именно отсюда: подмассив \`[j+1, i]\` — это диапазон, при удалении префикса \`[0..j]\` от префикса \`[0..i]\` сумма становится нулём. И помните, что для одной суммы может быть несколько прежних позиций — нужно хранить массив, а не одно значение.

С чего начать:
\`\`\`js
const map = new Map([[0, [-1]]]);
let sum = 0;
const result = [];
for (let i = 0; i < nums.length; i++) {
  // ...
}
return result;
\`\`\``,
    ],
    solutionCode: `function findZeroSumSubarrays(nums) {
  const map = new Map([[0, [-1]]]);
  let sum = 0;
  const result = [];

  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    if (map.has(sum)) {
      for (const j of map.get(sum)) {
        result.push([j + 1, i]);
      }
    }
    if (!map.has(sum)) map.set(sum, []);
    map.get(sum).push(i);
  }

  result.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return result;
}`,
  },
  {
    id: 'hm-e2',
    topicId: 'hash-map',
    title: 'Первый уникальный символ в строке',
    difficulty: 'easy',
    isContextual: false,
    description: `Дана строка \`s\`. Найдите **первый не повторяющийся** символ и верните его **индекс**. Если такого символа нет, верните \`-1\`.

Примеры:
\`\`\`
firstUniqChar('leetcode')      // → 0
firstUniqChar('loveleetcode')  // → 2
firstUniqChar('aabb')          // → -1
firstUniqChar('z')             // → 0
firstUniqChar('')              // → -1
firstUniqChar('abca')          // → 1
\`\`\`

Это **LeetCode 387**. Решается за O(n): один проход — посчитать частоты, второй — найти первый символ с частотой 1.`,
    functionName: 'firstUniqChar',
    starterCode: `function firstUniqChar(s) {
  // ваш код
}`,
    testCases: [
      { id: 'hm-e2-t1', inputDisplay: "firstUniqChar('leetcode')", inputArgs: ['leetcode'], expected: 0 },
      { id: 'hm-e2-t2', inputDisplay: "firstUniqChar('loveleetcode')", inputArgs: ['loveleetcode'], expected: 2 },
      { id: 'hm-e2-t3', inputDisplay: "firstUniqChar('aabb')", inputArgs: ['aabb'], expected: -1 },
      { id: 'hm-e2-t4', inputDisplay: "firstUniqChar('z')", inputArgs: ['z'], expected: 0 },
      { id: 'hm-e2-t5', inputDisplay: "firstUniqChar('')", inputArgs: [''], expected: -1 },
      { id: 'hm-e2-t6', inputDisplay: "firstUniqChar('abca')", inputArgs: ['abca'], expected: 1 },
    ],
    hints: [
      'Узнать «уникален ли символ» можно только после того, как просмотрена вся строка — раньше неизвестно, не встретится ли он снова. Значит, нужен один проход для подсчёта частот, и второй — для поиска первого подходящего.',
      'Шаг 1: соберите Map `символ → количество` за проход по `s`. Шаг 2: пройдите по `s` второй раз и верните `i`, как только `counts.get(s[i]) === 1`. Если такого нет — `-1`.',
      `Почему именно два прохода, а не один: при первом появлении символа неизвестно, придёт ли он ещё раз. Если возвращать первый «пока уникальный», для \`"abca"\` получите \`0\`, хотя правильный ответ \`1\`. Второй проход именно по строке \`s\` (а не по Map) гарантирует возврат **первого** индекса при ничьей — порядок ключей в Map совпал бы с порядком первого появления, но идти по строке надёжнее и нагляднее.

С чего начать:
\`\`\`js
const counts = new Map();
for (const ch of s) {
  // ...
}
for (let i = 0; i < s.length; i++) {
  // ...
}
return -1;
\`\`\``,
    ],
    solutionCode: `function firstUniqChar(s) {
  const counts = new Map();
  for (const ch of s) {
    counts.set(ch, (counts.get(ch) ?? 0) + 1);
  }
  for (let i = 0; i < s.length; i++) {
    if (counts.get(s[i]) === 1) return i;
  }
  return -1;
}`,
  },
  {
    id: 'hm-h3',
    topicId: 'hash-map',
    kind: 'implement',
    title: 'LRU Cache — операции get/put',
    difficulty: 'hard',
    isContextual: false,
    description: `Реализуйте LRU Cache (Least Recently Used) — кеш с фиксированной ёмкостью, который при переполнении вытесняет **наименее недавно использованный** элемент.

API в виде функции \`lruOperations(capacity, operations)\`:
- \`capacity\` — максимальный размер кеша
- \`operations\` — массив команд:
  - \`['put', key, value]\` — добавить/обновить значение; считается «использованием»
  - \`['get', key]\` — получить значение; считается «использованием»

Верните массив результатов: для \`put\` — \`null\`, для \`get\` — значение или \`-1\` если ключа нет.

**Требование сложности**: каждая операция — O(1).

Пример (LeetCode 146):
\`\`\`
lruOperations(2, [
  ['put', 1, 1],
  ['put', 2, 2],
  ['get', 1],
  ['put', 3, 3],   // вытесняет ключ 2
  ['get', 2],      // -1
  ['put', 4, 4],   // вытесняет ключ 1
  ['get', 1],      // -1
  ['get', 3],
  ['get', 4]
])
// → [null, null, 1, null, -1, null, -1, 3, 4]
\`\`\``,
    functionName: 'lruOperations',
    starterCode: `function lruOperations(capacity, operations) {
  // ваш код
}`,
    testCases: [
      {
        id: 'hm-h3-t1',
        inputDisplay: 'lruOperations(2, [put 1 1, put 2 2, get 1, put 3 3, get 2, put 4 4, get 1, get 3, get 4])',
        inputArgs: [2, [['put', 1, 1], ['put', 2, 2], ['get', 1], ['put', 3, 3], ['get', 2], ['put', 4, 4], ['get', 1], ['get', 3], ['get', 4]]],
        expected: [null, null, 1, null, -1, null, -1, 3, 4],
      },
      {
        id: 'hm-h3-t2',
        inputDisplay: 'lruOperations(1, [put 1 1, put 2 2, get 1, get 2])',
        inputArgs: [1, [['put', 1, 1], ['put', 2, 2], ['get', 1], ['get', 2]]],
        expected: [null, null, -1, 2],
      },
      {
        id: 'hm-h3-t3',
        inputDisplay: 'lruOperations(2, [put 2 1, put 1 1, put 2 3, put 4 1, get 1, get 2])',
        inputArgs: [2, [['put', 2, 1], ['put', 1, 1], ['put', 2, 3], ['put', 4, 1], ['get', 1], ['get', 2]]],
        expected: [null, null, null, null, -1, 3],
      },
      {
        id: 'hm-h3-t4',
        inputDisplay: 'lruOperations(2, [get 2, put 2 6, get 1, put 1 5, put 1 2, get 1, get 2])',
        inputArgs: [2, [['get', 2], ['put', 2, 6], ['get', 1], ['put', 1, 5], ['put', 1, 2], ['get', 1], ['get', 2]]],
        expected: [-1, null, -1, null, null, 2, 6],
      },
      {
        id: 'hm-h3-t5',
        inputDisplay: 'lruOperations(3, [put a 1, put b 2, put c 3, get a, put d 4, get b])',
        inputArgs: [3, [['put', 'a', 1], ['put', 'b', 2], ['put', 'c', 3], ['get', 'a'], ['put', 'd', 4], ['get', 'b']]],
        expected: [null, null, null, 1, null, -1],
      },
    ],
    hints: [
      'Нужны две вещи за O(1): доступ к значению по ключу и понимание, какой ключ «самый старый». Если бы упорядоченная структура с быстрым доступом сама поддерживала порядок вставки — задача стала бы простой.',
      'В JS `Map` сохраняет порядок вставки ключей. Самый старый ключ всегда первый: `cache.keys().next().value`. Чтобы «освежить» ключ — удалите и сразу вставьте снова: он переедет в конец. На `get` — то же самое: считать значение, удалить, вставить обратно. На переполнении после `set` — удалить первый ключ.',
      `Главный инвариант: порядок ключей в \`Map\` всегда совпадает с порядком «использования» — от самого старого (\`keys().next().value\`) до самого свежего. На \`put\` существующего ключа важно сначала \`delete\`, потом \`set\`: иначе \`set\` лишь обновит значение, но не переместит ключ в конец, и при вытеснении уйдёт не то, что нужно. На \`get\` тоже нужен \`delete\` + \`set\` — само чтение значения порядок ключей в Map не меняет.

С чего начать:
\`\`\`js
const cache = new Map();
const out = [];
for (const op of operations) {
  // ...
}
return out;
\`\`\``,
    ],
    solutionCode: `function lruOperations(capacity, operations) {
  const cache = new Map();
  const out = [];

  for (const op of operations) {
    if (op[0] === 'put') {
      const key = op[1];
      const value = op[2];
      if (cache.has(key)) {
        cache.delete(key);
      }
      cache.set(key, value);
      if (cache.size > capacity) {
        const oldest = cache.keys().next().value;
        cache.delete(oldest);
      }
      out.push(null);
    } else if (op[0] === 'get') {
      const key = op[1];
      if (cache.has(key)) {
        const value = cache.get(key);
        cache.delete(key);
        cache.set(key, value);
        out.push(value);
      } else {
        out.push(-1);
      }
    }
  }

  return out;
}`,
  },
  {
    id: 'hm-h4',
    topicId: 'hash-map',
    kind: 'implement',
    title: 'Подстрока из конкатенации всех слов',
    difficulty: 'hard',
    isContextual: false,
    description: `Дана строка \`s\` и массив строк \`words\`, где **все слова одинаковой длины**. Верните массив начальных индексов всех подстрок в \`s\`, которые являются **конкатенацией каждого слова из \`words\` ровно один раз** в любом порядке (без перекрытий по символам).

Порядок индексов в ответе — по возрастанию.

Примеры:
\`\`\`
findSubstring('barfoothefoobarman', ['foo', 'bar'])
// → [0, 9]   (s[0..6]='barfoo', s[9..15]='foobar')

findSubstring('wordgoodgoodgoodbestword', ['word','good','best','word'])
// → []

findSubstring('barfoofoobarthefoobarman', ['bar','foo','the'])
// → [6, 9, 12]
\`\`\`

Это **LeetCode 30** — классическая hard-задача. Эффективное решение — sliding window с двумя счётчиками-словарями.`,
    functionName: 'findSubstring',
    starterCode: `function findSubstring(s, words) {
  // ваш код
}`,
    testCases: [
      {
        id: 'hm-h4-t1',
        inputDisplay: "findSubstring('barfoothefoobarman', ['foo','bar'])",
        inputArgs: ['barfoothefoobarman', ['foo', 'bar']],
        expected: [0, 9],
      },
      {
        id: 'hm-h4-t2',
        inputDisplay: "findSubstring('wordgoodgoodgoodbestword', ['word','good','best','word'])",
        inputArgs: ['wordgoodgoodgoodbestword', ['word', 'good', 'best', 'word']],
        expected: [],
      },
      {
        id: 'hm-h4-t3',
        inputDisplay: "findSubstring('barfoofoobarthefoobarman', ['bar','foo','the'])",
        inputArgs: ['barfoofoobarthefoobarman', ['bar', 'foo', 'the']],
        expected: [6, 9, 12],
      },
      {
        id: 'hm-h4-t4',
        inputDisplay: "findSubstring('aaa', ['a','a'])",
        inputArgs: ['aaa', ['a', 'a']],
        expected: [0, 1],
      },
      {
        id: 'hm-h4-t5',
        inputDisplay: "findSubstring('abc', ['xy'])",
        inputArgs: ['abc', ['xy']],
        expected: [],
      },
      {
        id: 'hm-h4-t6',
        inputDisplay: "findSubstring('foobar', ['foo','bar'])",
        inputArgs: ['foobar', ['foo', 'bar']],
        expected: [0],
      },
    ],
    hints: [
      'Все слова одной длины `w`, искомая подстрока имеет длину `w * m` и состоит из ровно одного экземпляра каждого слова (с учётом дубликатов). Любая позиция, кратная `w` (от выбранного стартового смещения), задаёт «границу» куска — а значит окно из кусков можно двигать на `w` за шаг.',
      'Постройте `need: Map<word, count>` для `words`. Запустите `w` отдельных sliding window-проходов: для каждого смещения `offset ∈ [0, w-1]` идите по `s` шагами `w`. Поддерживайте `have: Map<word, count>` и счётчик `count`. Если кусок не в `need` — сбрасывайте окно. Если `have[piece] > need[piece]` — двигайте левую границу вправо, пока не нормализуется. При `count === m` — сохраните `left`.',
      `Зачем именно \`w\` отдельных проходов: окно сдвигается шагом ровно в одно слово (\`w\` символов), потому что искомая подстрока выровнена по границам слов. Если бы все позиции \`0..s.length - 1\` пробовались по одной, теряется смысл sliding window — пришлось бы строить \`have\` заново для каждого старта. Главная ловушка — лишнее слово в окне: при \`have[piece] > need[piece]\` нужно двигать левую границу вправо, пока баланс не восстановится, иначе при дубликатах в \`words\` ответ будет неверным.

С чего начать:
\`\`\`js
const w = words[0].length;
const need = new Map();
for (const word of words) need.set(word, (need.get(word) ?? 0) + 1);
const result = [];
for (let offset = 0; offset < w; offset++) {
  // ...
}
return result;
\`\`\``,
    ],
    solutionCode: `function findSubstring(s, words) {
  if (!words.length || !s) return [];
  const w = words[0].length;
  const m = words.length;
  const totalLen = w * m;
  if (s.length < totalLen) return [];

  const need = new Map();
  for (const word of words) {
    need.set(word, (need.get(word) ?? 0) + 1);
  }

  const result = [];

  for (let offset = 0; offset < w; offset++) {
    let left = offset;
    let count = 0;
    const have = new Map();

    for (let right = offset; right + w <= s.length; right += w) {
      const piece = s.substring(right, right + w);
      if (!need.has(piece)) {
        have.clear();
        count = 0;
        left = right + w;
        continue;
      }
      have.set(piece, (have.get(piece) ?? 0) + 1);
      count++;
      while ((have.get(piece) ?? 0) > need.get(piece)) {
        const leftPiece = s.substring(left, left + w);
        have.set(leftPiece, have.get(leftPiece) - 1);
        count--;
        left += w;
      }
      if (count === m) {
        result.push(left);
        const leftPiece = s.substring(left, left + w);
        have.set(leftPiece, have.get(leftPiece) - 1);
        count--;
        left += w;
      }
    }
  }

  result.sort((a, b) => a - b);
  return result;
}`,
  },
];
