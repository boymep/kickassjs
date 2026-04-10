import { Box, Typography, Paper, Alert, Divider } from '@mui/material';
import CodeBlock from '../theory/CodeBlock';

interface Pitfall {
  title: string;
  description: string;
  badCode: string;
  goodCode: string;
  explanation: string;
}

const pitfalls: Pitfall[] = [
  {
    title: '1. .sort() без компаратора',
    description:
      'По умолчанию .sort() сортирует элементы как строки в лексикографическом порядке, даже если массив содержит числа. Это одна из самых частых ловушек на собеседованиях.',
    badCode: `// Ожидаем: [1, 2, 10]
const nums = [10, 2, 1];
console.log(nums.sort()); // [1, 10, 2] — лексикографический порядок!`,
    goodCode: `const nums = [10, 2, 1];
console.log(nums.sort((a, b) => a - b)); // [1, 2, 10] — числовой порядок

// Для сортировки по убыванию:
console.log(nums.sort((a, b) => b - a)); // [10, 2, 1]`,
    explanation:
      'Всегда передавайте функцию сравнения в .sort(). Без неё числа преобразуются в строки: "10" < "2", потому что "1" < "2".',
  },
  {
    title: '2. Мутация массива',
    description:
      'Методы .sort(), .reverse() и .splice() изменяют исходный массив. Если вы сортируете входные данные, последующие операции с оригинальным массивом дадут неожиданный результат.',
    badCode: `function solve(arr: number[]): number {
  const sorted = arr.sort((a, b) => a - b); // мутирует arr!
  const min = arr[0]; // arr уже отсортирован — это не оригинальный первый элемент

  // Дальнейшая работа с arr даёт неверные результаты,
  // потому что порядок элементов изменился
  return arr.indexOf(min); // всегда 0!
}`,
    goodCode: `function solve(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b); // копия!
  const min = arr[0]; // arr не изменён

  return arr.indexOf(sorted[0]); // корректный индекс
}

// Аналогично для reverse:
const reversed = [...arr].reverse();`,
    explanation:
      'Создавайте копию массива через [...arr] или arr.slice() перед вызовом мутирующих методов. Это особенно важно, когда входной массив используется далее в алгоритме.',
  },
  {
    title: '3. Map vs обычный объект',
    description:
      'У обычного объекта все ключи приводятся к строкам. Map сохраняет тип ключей и гарантирует порядок вставки. Это критично при работе с числовыми ключами.',
    badCode: `const obj: Record<string, number> = {};
obj[1] = 'один';
obj[2] = 'два';
obj['1'] = 'перезаписано'; // ключ 1 и '1' — одно и то же!

console.log(Object.keys(obj)); // ['1', '2'] — ключи всегда строки
console.log(obj[1] === obj['1']); // true

// Числовые ключи сортируются автоматически:
const obj2 = { 3: 'c', 1: 'a', 2: 'b' };
console.log(Object.keys(obj2)); // ['1', '2', '3'] — не порядок вставки!`,
    goodCode: `const map = new Map<number, string>();
map.set(1, 'один');
map.set(2, 'два');
map.set('1', 'строка один'); // это другой ключ!

console.log(map.get(1));    // 'один'
console.log(map.get('1'));  // 'строка один'
console.log(map.size);      // 3 — все ключи уникальны

// Порядок вставки сохраняется:
for (const [key, val] of map) {
  console.log(key, val); // 1, 2, '1' — как вставляли
}`,
    explanation:
      'Используйте Map, когда ключи — числа или когда важен порядок вставки. Map также быстрее при частых добавлениях и удалениях элементов.',
  },
  {
    title: '4. === для объектов и массивов',
    description:
      'Оператор === сравнивает объекты и массивы по ссылке, а не по содержимому. Два массива с одинаковыми элементами не будут равны.',
    badCode: `const a = [1, 2, 3];
const b = [1, 2, 3];

console.log(a === b); // false — разные ссылки!
console.log(a == b);  // false — тоже не работает

// Частая ошибка в алгоритмах:
const visited = new Set();
visited.add([0, 0]);
console.log(visited.has([0, 0])); // false — это другой массив!`,
    goodCode: `// Вариант 1: сравнение через JSON (для простых случаев)
const a = [1, 2, 3];
const b = [1, 2, 3];
console.log(JSON.stringify(a) === JSON.stringify(b)); // true

// Вариант 2: поэлементное сравнение
function arraysEqual(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((val, i) => val === b[i]);
}

// Вариант 3: строковые ключи для Set
const visited = new Set<string>();
visited.add('0,0');
console.log(visited.has('0,0')); // true

// Или используйте вспомогательную функцию:
const key = (r: number, c: number) => \`\${r},\${c}\`;
visited.add(key(0, 0));`,
    explanation:
      'Для хранения координат или пар значений в Set/Map используйте строковые ключи. JSON.stringify подходит для простого сравнения, но медленнее поэлементной проверки.',
  },
  {
    title: '5. Переполнение чисел',
    description:
      'Числа в JavaScript — 64-битные числа с плавающей точкой (IEEE 754). Целочисленная точность гарантируется только до Number.MAX_SAFE_INTEGER (2^53 - 1).',
    badCode: `console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991

// За пределами безопасного диапазона:
console.log(Number.MAX_SAFE_INTEGER + 1 === Number.MAX_SAFE_INTEGER + 2); // true!
console.log(9007199254740992 === 9007199254740993); // true!

// Это может сломать алгоритмы с большими числами:
function factorial(n: number): number {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}
console.log(factorial(25)); // 1.5511210043330986e+25 — потеря точности`,
    goodCode: `// Используйте BigInt для точных вычислений с большими числами:
console.log(BigInt(Number.MAX_SAFE_INTEGER) + 1n
  === BigInt(Number.MAX_SAFE_INTEGER) + 2n); // false — корректно!

function factorial(n: bigint): bigint {
  let result = 1n;
  for (let i = 2n; i <= n; i++) result *= i;
  return result;
}
console.log(factorial(25n)); // 15511210043330985984000000n — точно!

// Проверка безопасного диапазона:
console.log(Number.isSafeInteger(9007199254740991)); // true
console.log(Number.isSafeInteger(9007199254740992)); // false`,
    explanation:
      'Если задача подразумевает работу с большими целыми числами, используйте BigInt. Помните, что BigInt нельзя смешивать с обычными числами в арифметических операциях.',
  },
  {
    title: '6. Array.from({ length: n }) vs new Array(n)',
    description:
      'new Array(n) создаёт массив с «пустыми слотами» (sparse array). Методы .map(), .filter(), .forEach() пропускают пустые слоты, что приводит к неожиданным результатам.',
    badCode: `// new Array(5) создаёт sparse-массив с пустыми слотами
const arr = new Array(5);
console.log(arr); // [ <5 empty items> ]

// .map() НЕ итерирует по пустым слотам!
const mapped = new Array(5).map((_, i) => i);
console.log(mapped); // [ <5 empty items> ] — ничего не произошло!

// .fill() + .map() работает, но неудобно:
const filled = new Array(5).fill(0).map((_, i) => i);

// Создание 2D-массива — частая ошибка:
const grid = new Array(3).fill(new Array(3).fill(0));
grid[0][0] = 1;
console.log(grid); // [[1,0,0],[1,0,0],[1,0,0]] — все строки ссылаются на один массив!`,
    goodCode: `// Array.from корректно создаёт массив и итерирует:
const arr = Array.from({ length: 5 }, (_, i) => i);
console.log(arr); // [0, 1, 2, 3, 4]

// Создание 2D-массива:
const grid = Array.from({ length: 3 }, () => new Array(3).fill(0));
grid[0][0] = 1;
console.log(grid); // [[1,0,0],[0,0,0],[0,0,0]] — каждая строка независима!

// Альтернативы:
const zeros = Array.from({ length: 5 }, () => 0); // [0, 0, 0, 0, 0]
const range = [...Array(5).keys()]; // [0, 1, 2, 3, 4]`,
    explanation:
      'Используйте Array.from({ length: n }, callback) для создания и инициализации массивов. Для 2D-массивов всегда создавайте каждую строку отдельно, иначе все строки будут ссылаться на один массив.',
  },
  {
    title: '7. Math.floor vs побитовое OR для деления',
    description:
      'Побитовый оператор |0 часто используется как быстрая замена Math.floor при целочисленном делении. Однако он приводит число к 32-битному целому, что вызывает ошибки для больших значений.',
    badCode: `// |0 работает для маленьких чисел:
console.log(7 / 2 | 0); // 3 — ОК

// Но ломается для больших:
console.log(2147483648 | 0);  // -2147483648 — переполнение 32 бит!
console.log(3000000000 | 0);  // -1294967296

// Классическая ошибка в бинарном поиске:
function binarySearch(arr: number[], target: number): number {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = (left + right) / 2 | 0; // переполнение при left + right > 2^31
    // ...
  }
  return -1;
}`,
    goodCode: `// Безопасное вычисление середины:
function binarySearch(arr: number[], target: number): number {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    // Защита от переполнения: вычисляем разницу, а не сумму
    const mid = left + Math.floor((right - left) / 2);

    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

// Math.floor безопасен для чисел до Number.MAX_SAFE_INTEGER:
console.log(Math.floor(3000000000 / 2)); // 1500000000 — корректно
console.log(Math.floor(2147483648 / 2)); // 1073741824 — корректно`,
    explanation:
      'Используйте Math.floor вместо |0. Для бинарного поиска вычисляйте mid как left + Math.floor((right - left) / 2), чтобы избежать переполнения при сложении left + right.',
  },
  {
    title: '8. for...in vs for...of',
    description:
      'for...in перебирает ключи (свойства) объекта, включая унаследованные из прототипа. for...of перебирает значения итерируемых объектов. Путаница между ними — частый источник багов.',
    badCode: `const arr = [10, 20, 30];

// for...in перебирает ИНДЕКСЫ как СТРОКИ, а не значения:
for (const val of arr) {} // — нормально
for (const key in arr) {
  console.log(key);        // '0', '1', '2' — строки!
  console.log(typeof key); // 'string'
}

// Ещё хуже — захватывает свойства из прототипа:
Array.prototype.customProp = 'oops';
for (const key in arr) {
  console.log(key); // '0', '1', '2', 'customProp' — неожиданный элемент!
}

// Арифметика со строковыми ключами:
for (const i in arr) {
  console.log(i + 1); // '01', '11', '21' — конкатенация строк!
}`,
    goodCode: `const arr = [10, 20, 30];

// for...of перебирает ЗНАЧЕНИЯ:
for (const val of arr) {
  console.log(val); // 10, 20, 30
}

// Если нужны индексы — используйте entries():
for (const [i, val] of arr.entries()) {
  console.log(i, val); // 0 10, 1 20, 2 30 — индексы числовые
}

// Классический for — самый надёжный вариант:
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}

// for...in — только для объектов, с hasOwnProperty:
const obj = { a: 1, b: 2 };
for (const key in obj) {
  if (Object.hasOwn(obj, key)) {
    console.log(key, obj[key]);
  }
}`,
    explanation:
      'Для массивов используйте for...of или классический for. for...in предназначен для объектов и может дать неожиданные результаты с массивами из-за строковых ключей и свойств прототипа.',
  },
];

export default function JsPitfallsPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Подводные камни JavaScript в алгоритмах
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        JavaScript имеет ряд особенностей, которые могут привести к неожиданным
        ошибкам при решении алгоритмических задач на собеседованиях. Знание этих
        ловушек поможет избежать потери времени на отладку.
      </Typography>

      <Alert severity="warning" sx={{ mb: 3 }}>
        Эти подводные камни особенно актуальны на собеседованиях, где нет
        возможности запустить код и проверить результат. Запомните их заранее!
      </Alert>

      {pitfalls.map((pitfall, index) => (
        <Paper key={index} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {pitfall.title}
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {pitfall.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography
            variant="subtitle2"
            sx={{ color: 'error.main', mb: 0.5, fontWeight: 700 }}
          >
            Плохо:
          </Typography>
          <CodeBlock code={pitfall.badCode} />

          <Typography
            variant="subtitle2"
            sx={{ color: 'success.main', mb: 0.5, fontWeight: 700 }}
          >
            Хорошо:
          </Typography>
          <CodeBlock code={pitfall.goodCode} />

          <Divider sx={{ my: 2 }} />

          <Alert severity="info" icon={false}>
            {pitfall.explanation}
          </Alert>
        </Paper>
      ))}
    </Box>
  );
}
