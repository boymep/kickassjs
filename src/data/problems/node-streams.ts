import type { Problem } from "../../types/problem";

export const nodeStreamsProblems: Problem[] = [
  {
    id: "nodes-p1",
    topicId: "node-streams",
    title: "Pipeline — цепочка трансформаций",
    difficulty: "easy",
    isContextual: false,
    description: `Реализуйте функцию \`createPipeline(...fns)\`:
- Принимает набор функций-трансформаций
- Возвращает функцию, которая последовательно применяет все трансформации к входному значению

Примеры:
\`\`\`
const process = createPipeline(
  x => x * 2,
  x => x + 1,
  x => x * x,
);
process(3); // (3*2+1)^2 = 49

const normalize = createPipeline(
  s => s.trim(),
  s => s.toLowerCase(),
  s => s.replace(/\\s+/g, '-'),
);
normalize('  Hello World  '); // 'hello-world'
\`\`\``,
    functionName: "__runPipeline",
    starterCode: `function createPipeline(...fns) {
  // ваш код
}`,
    testCases: [
      {
        id: "nodes-p1-t1",
        inputDisplay: "x*2 → x+1 → x*x : process(3) = 49",
        inputArgs: ["math", 3],
        expected: 49,
      },
      {
        id: "nodes-p1-t2",
        inputDisplay: "trim → toLowerCase → replace spaces",
        inputArgs: ["string", "  Hello World  "],
        expected: "hello-world",
      },
      {
        id: "nodes-p1-t3",
        inputDisplay: "пустой pipeline — identity",
        inputArgs: ["empty", 42],
        expected: 42,
      },
      {
        id: "nodes-p1-t4",
        inputDisplay: "одна функция",
        inputArgs: ["single", 5],
        expected: 10,
      },
      {
        id: "nodes-p1-t5",
        inputDisplay: "порядок применения слева направо",
        inputArgs: ["order", 10],
        expected: 3,
      },
    ],
    hints: [
      "Как применить последовательность функций, где каждая получает результат предыдущей?",
      "Что возвращать, если список функций пуст?",
    ],
    solutionCode: `function createPipeline(...fns) {
  return (value) => fns.reduce((acc, fn) => fn(acc), value);
}`,
    testHelperCode: `function __runPipeline(kind, value) {
  let pipeline;
  if (kind === 'math') {
    pipeline = createPipeline(x => x * 2, x => x + 1, x => x * x);
  } else if (kind === 'string') {
    pipeline = createPipeline(s => s.trim(), s => s.toLowerCase(), s => s.replace(/\\s+/g, '-'));
  } else if (kind === 'empty') {
    pipeline = createPipeline();
  } else if (kind === 'single') {
    pipeline = createPipeline(x => x * 2);
  } else if (kind === 'order') {
    pipeline = createPipeline(x => x + 5, x => x / 3, x => x - 2);
  } else {
    throw new Error('unknown kind: ' + kind);
  }
  return pipeline(value);
}`,
  },
  {
    id: "nodes-p2",
    topicId: "node-streams",
    title: "chunk — разбивка строки на части",
    difficulty: "easy",
    isContextual: false,
    description: `Реализуйте функцию \`chunkString(str, size)\`:
- Разбивает строку \`str\` на части по \`size\` символов
- Последняя часть может быть короче \`size\`
- Возвращает массив строк

Примеры:
\`\`\`
chunkString('abcdefghi', 3); // ['abc', 'def', 'ghi']
chunkString('hello', 2);     // ['he', 'll', 'o']
chunkString('', 3);          // []
chunkString('ab', 10);       // ['ab']
\`\`\``,
    functionName: "chunkString",
    starterCode: `function chunkString(str, size) {
  // ваш код
}`,
    testCases: [
      {
        id: "nodes-p2-t1",
        inputDisplay: '"abcdefghi", 3 → ["abc","def","ghi"]',
        inputArgs: ["abcdefghi", 3],
        expected: ["abc", "def", "ghi"],
      },
      {
        id: "nodes-p2-t2",
        inputDisplay: '"hello", 2 → ["he","ll","o"]',
        inputArgs: ["hello", 2],
        expected: ["he", "ll", "o"],
      },
      {
        id: "nodes-p2-t3",
        inputDisplay: '"", 3 → []',
        inputArgs: ["", 3],
        expected: [],
      },
      {
        id: "nodes-p2-t4",
        inputDisplay: '"ab", 10 → ["ab"]',
        inputArgs: ["ab", 10],
        expected: ["ab"],
      },
      {
        id: "nodes-p2-t5",
        inputDisplay: '"12345", 1 → ["1","2","3","4","5"]',
        inputArgs: ["12345", 1],
        expected: ["1", "2", "3", "4", "5"],
      },
    ],
    hints: [
      "Как пройти по строке фиксированными шагами размером size и собирать отрезки?",
    ],
    solutionCode: `function chunkString(str, size) {
  if (!str) return [];
  const chunks = [];
  for (let i = 0; i < str.length; i += size) {
    chunks.push(str.slice(i, i + size));
  }
  return chunks;
}`,
  },
  {
    id: "nodes-p3",
    topicId: "node-streams",
    title: "TransformStream — класс преобразования данных",
    difficulty: "medium",
    isContextual: false,
    description: `Реализуйте класс \`TransformStream\`:
- \`constructor(transformFn)\` — принимает функцию трансформации
- \`write(chunk)\` — добавляет чанк, применяет трансформацию, сохраняет результат в буфер
- \`read()\` — возвращает следующий обработанный чанк (или \`null\` если буфер пуст)
- \`pipe(otherStream)\` — передаёт все обработанные чанки в другой TransformStream

Примеры:
\`\`\`
const upper = new TransformStream(s => s.toUpperCase());
upper.write('hello');
upper.write('world');
upper.read(); // 'HELLO'
upper.read(); // 'WORLD'
upper.read(); // null

const trim = new TransformStream(s => s.trim());
const upper2 = new TransformStream(s => s.toUpperCase());
trim.pipe(upper2);
trim.write('  hello  ');
upper2.read(); // 'HELLO'
\`\`\``,
    functionName: "TransformStream",
    starterCode: `class TransformStream {
  constructor(transformFn) {
    // ваш код
  }

  write(chunk) {
    // ваш код
  }

  read() {
    // ваш код
  }

  pipe(otherStream) {
    // ваш код
  }
}`,
    testCases: [
      {
        id: "nodes-p3-t1",
        inputDisplay: "write + read — базовая трансформация",
        inputArgs: ["basic"],
        expected: "HELLO",
      },
      {
        id: "nodes-p3-t2",
        inputDisplay: "read пустого буфера → null",
        inputArgs: ["empty-read"],
        expected: null,
      },
      {
        id: "nodes-p3-t3",
        inputDisplay: "pipe — цепочка двух TransformStream",
        inputArgs: ["pipe"],
        expected: "HELLO",
      },
      {
        id: "nodes-p3-t4",
        inputDisplay: "несколько write → правильный порядок read",
        inputArgs: ["order"],
        expected: ["A", "B", "C"],
      },
      {
        id: "nodes-p3-t5",
        inputDisplay: "pipe в несколько стримов",
        inputArgs: ["multi-pipe"],
        expected: "!!!HELLO!!!",
      },
    ],
    hints: [
      "write должен трансформировать чанк и куда-то его сохранять. Где?",
      "pipe — это подключение выхода одного стрима ко входу другого. Что должно происходить при вызове write после pipe?",
    ],
    solutionCode: `class TransformStream {
  constructor(transformFn) {
    this.transformFn = transformFn;
    this.buffer = [];
    this.pipeTo = null;
  }

  write(chunk) {
    const result = this.transformFn(chunk);
    this.buffer.push(result);
    if (this.pipeTo) {
      this.pipeTo.write(result);
    }
  }

  read() {
    return this.buffer.length > 0 ? this.buffer.shift() : null;
  }

  pipe(otherStream) {
    this.pipeTo = otherStream;
    return otherStream;
  }
}`,
  },
  {
    id: "nodes-p4",
    topicId: "node-streams",
    title: "BufferedWriter — буферизованная запись",
    difficulty: "medium",
    isContextual: false,
    description: `Реализуйте класс \`BufferedWriter\`:
- \`constructor(flushFn, bufferSize)\` — \`flushFn(data)\` вызывается при сбросе; \`bufferSize\` — максимальный размер буфера в символах
- \`write(data)\` — добавляет данные в буфер; если буфер достигает \`bufferSize\` — вызывает flush автоматически
- \`flush()\` — сбрасывает буфер в \`flushFn\` и очищает его
- \`getBufferSize()\` — текущий размер буфера

Примеры:
\`\`\`
const written = [];
const writer = new BufferedWriter(data => written.push(data), 10);

writer.write('hello'); // 5 символов — буфер не полный
writer.write('world'); // ещё 5 — итого 10, flush!
// written → ['helloworld']

writer.write('!');
writer.flush(); // явный flush
// written → ['helloworld', '!']
\`\`\``,
    functionName: "BufferedWriter",
    starterCode: `class BufferedWriter {
  constructor(flushFn, bufferSize) {
    // ваш код
  }

  write(data) {
    // ваш код
  }

  flush() {
    // ваш код
  }

  getBufferSize() {
    // ваш код
  }
}`,
    testCases: [
      {
        id: "nodes-p4-t1",
        inputDisplay: "auto-flush при достижении bufferSize",
        inputArgs: ["auto-flush"],
        expected: ["helloworld"],
      },
      {
        id: "nodes-p4-t2",
        inputDisplay: "явный flush сбрасывает оставшееся",
        inputArgs: ["manual-flush"],
        expected: ["helloworld", "!"],
      },
      {
        id: "nodes-p4-t3",
        inputDisplay: "getBufferSize() после записи",
        inputArgs: ["buffer-size"],
        expected: 5,
      },
      {
        id: "nodes-p4-t4",
        inputDisplay: "flush пустого буфера — flushFn не вызывается",
        inputArgs: ["flush-empty"],
        expected: 0,
      },
      {
        id: "nodes-p4-t5",
        inputDisplay: "данные больше bufferSize — flush сразу",
        inputArgs: ["overflow"],
        expected: ["hello world!"],
      },
    ],
    hints: [
      "Данные накапливаются между вызовами write. Что нужно хранить между вызовами и когда «сбрасывать» накопленное?",
      "flush должен обработать то, что осталось в буфере. Что делать, если буфер пустой?",
    ],
    solutionCode: `class BufferedWriter {
  constructor(flushFn, bufferSize) {
    this.flushFn = flushFn;
    this.bufferSize = bufferSize;
    this.buffer = '';
  }

  write(data) {
    this.buffer += data;
    if (this.buffer.length >= this.bufferSize) {
      this.flush();
    }
  }

  flush() {
    if (this.buffer.length > 0) {
      this.flushFn(this.buffer);
      this.buffer = '';
    }
  }

  getBufferSize() {
    return this.buffer.length;
  }
}`,
  },
  {
    id: "nodes-p5",
    topicId: "node-streams",
    title: "splitLines — разбивка текста на строки",
    difficulty: "easy",
    isContextual: false,
    description: `Реализуйте функцию \`splitLines(text)\`:
- Разбивает текст на строки (по \`\\n\`)
- Пропускает пустые строки
- Возвращает массив строк, у которых обрезаны пробелы в начале и в конце

Примеры:
\`\`\`
splitLines("hello\\nworld\\nfoo");
// → ['hello', 'world', 'foo']

splitLines("line1\\n\\n  line2  \\nline3\\n");
// → ['line1', 'line2', 'line3']

splitLines("");
// → []
\`\`\``,
    functionName: "splitLines",
    starterCode: `function splitLines(text) {
  // ваш код
}`,
    testCases: [
      {
        id: "nodes-p5-t1",
        inputDisplay: '"hello\\nworld\\nfoo" → ["hello","world","foo"]',
        inputArgs: ["hello\nworld\nfoo"],
        expected: ["hello", "world", "foo"],
      },
      {
        id: "nodes-p5-t2",
        inputDisplay: "пустые строки пропускаются",
        inputArgs: ["line1\n\n  line2  \nline3\n"],
        expected: ["line1", "line2", "line3"],
      },
      {
        id: "nodes-p5-t3",
        inputDisplay: "пустая строка → []",
        inputArgs: [""],
        expected: [],
      },
      {
        id: "nodes-p5-t4",
        inputDisplay: "одна строка без \\n",
        inputArgs: ["hello"],
        expected: ["hello"],
      },
      {
        id: "nodes-p5-t5",
        inputDisplay: "строки с пробелами обрезаются",
        inputArgs: ["  a  \n  b  \n  c  "],
        expected: ["a", "b", "c"],
      },
    ],
    hints: [
      "Как разбить текст на строки и отфильтровать пустые?",
    ],
    solutionCode: `function splitLines(text) {
  return text
    .split('\\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}`,
  },
  {
    kind: "predict-output",
    id: "ns-p6",
    topicId: "node-streams",
    title: "Определи вывод: трассировка событий стрима",
    difficulty: "medium",
    isContextual: false,
    description: `Перед вами эмуляция Readable-стрима через массив. \`emit\` срабатывает синхронно — как у настоящего EventEmitter в Node.js. Введите каждую напечатанную строку на отдельной строке поля ответа.

**Подсказка:** подписка на \`data\` переводит стрим в flowing mode, и каждый \`push\` синхронно вызывает обработчик до возврата управления. Событие \`end\` по стандарту эмитится **асинхронно** (через микрозадачу) — мы воспроизвели это через \`Promise.resolve().then\`.`,
    code: `// Минимальный mock Readable: push сразу emit'ит data,
// push(null) ставит end в микрозадачу.
function makeStream() {
  const handlers = {};
  return {
    on(event, fn) { handlers[event] = fn; return this; },
    push(chunk) {
      if (chunk === null) {
        Promise.resolve().then(() => handlers.end && handlers.end());
      } else {
        handlers.data && handlers.data(chunk);
      }
    },
  };
}

const stream = makeStream();
stream.on('data', (c) => console.log('data:', c));
stream.on('end', () => console.log('end'));

console.log('before');
stream.push('A');
stream.push('B');
stream.push(null);
console.log('after');`,
    expected: "before\ndata: A\ndata: B\nafter\nend",
    hints: [
      "«before» — синхронный console.log до первого push.",
      'push("A") и push("B") синхронно вызывают обработчик data — это flowing mode.',
      'push(null) ставит end-обработчик в микрозадачу через Promise.resolve().then. Микрозадачи выполняются после текущего синхронного кода, поэтому "after" печатается раньше "end".',
    ],
    solutionCode: `// before  — синхронно, до push
// data: A — синхронно: push в flowing mode сразу вызывает обработчик
// data: B — то же самое
// after   — синхронный console.log
// end     — микрозадача, срабатывает после текущего синхронного кода`,
  },
  {
    kind: "find-bug",
    id: "ns-p7",
    topicId: "node-streams",
    title: "Найдите баг: часть элементов теряется при обработке",
    difficulty: "medium",
    isContextual: false,
    description: `Функция \`runPipeline(source, transform, sink)\` должна пройти по всем элементам \`source\`, применить \`transform\` и положить результат в \`sink\`. Если \`transform\` бросает ошибку — элемент пропускается, а сообщение ошибки добавляется в возвращаемый массив. Обработка при этом должна продолжаться для остальных элементов.

Что-то идёт не так. Найдите и исправьте.

Сигнатура: \`runPipeline(source, transform, sink) → string[]\` (массив сообщений ошибок в порядке появления).`,
    buggyCode: `function runPipeline(source, transform, sink) {
  const errors = [];
  for (const item of source) {
    const out = transform(item);
    sink.push(out);
  }
  return errors;
}`,
    functionName: "ns_p7_test",
    bugSummary:
      "Вызов transform(item) не обёрнут в try/catch — это аналог `.pipe()` без подписки на error. Любая ошибка прерывает цикл и оставляет приёмник в неполном состоянии. Решение — обернуть transform/push в try/catch, в catch добавлять сообщение в errors и продолжать цикл.",
    testCases: [
      {
        id: "ns-p7-t1",
        inputDisplay: "все элементы успешны → sink заполнен, errors пуст",
        inputArgs: ["all-ok"],
        expected: "[2,4,6]|[]",
      },
      {
        id: "ns-p7-t2",
        inputDisplay: "ошибка в середине — обработка продолжается",
        inputArgs: ["middle-error"],
        expected: "[4,8]|[bad:3]",
      },
      {
        id: "ns-p7-t3",
        inputDisplay: "несколько ошибок подряд",
        inputArgs: ["multi-errors"],
        expected: "[4,8]|[bad:3,bad:5]",
      },
      {
        id: "ns-p7-t4",
        inputDisplay: "все элементы вызывают ошибку",
        inputArgs: ["all-bad"],
        expected: "[]|[bad:1,bad:2,bad:3]",
      },
    ],
    hints: [
      "Как обработать ошибку так, чтобы она не прервала обработку остальных элементов?",
      "Что нужно сделать с ошибкой — игнорировать, сохранить, пробросить?",
    ],
    solutionCode: `function runPipeline(source, transform, sink) {
  const errors = [];
  for (const item of source) {
    try {
      const out = transform(item);
      sink.push(out);
    } catch (err) {
      errors.push(err.message);
    }
  }
  return errors;
}`,
    testHelperCode: `function ns_p7_test(arg) {
  const sink = [];
  const double = (x) => x * 2;
  const failOnOdd = (x) => {
    if (x % 2 === 1) throw new Error('bad:' + x);
    return x * 2;
  };
  const failAll = (x) => { throw new Error('bad:' + x); };

  let errors;
  if (arg === 'all-ok') {
    errors = runPipeline([1, 2, 3], double, sink);
  } else if (arg === 'middle-error') {
    errors = runPipeline([2, 3, 4], failOnOdd, sink);
  } else if (arg === 'multi-errors') {
    errors = runPipeline([2, 3, 5, 4], failOnOdd, sink);
  } else if (arg === 'all-bad') {
    errors = runPipeline([1, 2, 3], failAll, sink);
  }
  return JSON.stringify(sink) + '|[' + errors.join(',') + ']';
}`,
  },
  {
    kind: "refactor",
    id: "ns-p8",
    topicId: "node-streams",
    title: "Рефактор: загрузка всего файла → потоковая обработка",
    difficulty: "medium",
    isContextual: false,
    description: `Функция \`countErrors(lines)\` должна посчитать количество строк, содержащих подстроку "ERROR". Текущая реализация — наивный аналог \`fs.readFileSync\` + \`split\`: материализует весь массив, делает несколько проходов, аллоцирует промежуточные структуры. На больших объёмах это аналог OOM в Node.js.

Перепишите так, чтобы обработка шла **за один проход** через async generator (потоковый аналог Transform-стрима в Node.js). Сигнатура: \`countErrors(lines) → Promise<number>\`. \`lines\` — массив (в реальном Node.js это был бы Readable-стрим).

Корректность: результат должен совпадать. Производительность не критична (тест на корректность только) — главное, не делать лишних проходов и промежуточных массивов размером O(N).`,
    functionName: "countErrors_test",
    starterCode: `async function countErrors(lines) {
  // ❌ Аналог readFileSync: всё в памяти, два прохода, лишние массивы.
  const trimmed = lines.map((l) => l.trim());
  const filtered = trimmed.filter((l) => l.includes('ERROR'));
  return filtered.length;
}`,
    testCases: [
      {
        id: "ns-p8-t1",
        inputDisplay: "смешанные строки — считаются только ERROR",
        inputArgs: [["INFO ok", "ERROR fail", "WARN low", "ERROR boom"]],
        expected: 2,
      },
      {
        id: "ns-p8-t2",
        inputDisplay: "пустой массив → 0",
        inputArgs: [[]],
        expected: 0,
      },
      {
        id: "ns-p8-t3",
        inputDisplay: "все строки — ERROR",
        inputArgs: [["ERROR a", "ERROR b", "ERROR c"]],
        expected: 3,
      },
      {
        id: "ns-p8-t4",
        inputDisplay: "нет ERROR — ноль",
        inputArgs: [["INFO 1", "INFO 2"]],
        expected: 0,
      },
      {
        id: "ns-p8-t5",
        inputDisplay:
          "строки с пробелами вокруг — trim не должен убирать совпадение",
        inputArgs: [["  ERROR  ", "ok", "\\tERROR"]],
        expected: 2,
      },
    ],
    hints: [
      "Как обработать массив строк так, словно это стрим данных?",
      "Как асинхронно итерироваться по источнику данных в JavaScript?",
    ],
    solutionCode: `async function countErrors(lines) {
  // ✅ Потоковая обработка: один проход, без промежуточных массивов.
  async function* source() {
    for (const l of lines) yield l;
  }
  let count = 0;
  for await (const line of source()) {
    if (line.includes('ERROR')) count++;
  }
  return count;
}`,
    testHelperCode: `async function countErrors_test(input) {
  return await countErrors(input);
}`,
  },
  {
    id: "nods-h1",
    topicId: "node-streams",
    kind: "implement",
    title: "CSV Transform Stream — парсим CSV построчно",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте функцию \`parseCsvStream(readable)\`, которая принимает Node.js Readable stream с CSV-данными и возвращает промис с массивом распарсенных строк (каждая строка — объект).

Первая строка CSV — заголовки. Значения могут быть в кавычках.

Пример CSV:
\`\`\`
name,age,city
Alice,30,Moscow
Bob,25,"New York"
\`\`\`
→ \`[{ name:'Alice', age:'30', city:'Moscow' }, { name:'Bob', age:'25', city:'New York' }]\``,
    functionName: "parseCsvStream_test",
    starterCode: `const { Transform } = require('stream');

async function parseCsvStream(readable) {
  // ваш код
}`,
    testCases: [
      {
        id: "nods-h1-t1",
        inputDisplay: "простой CSV",
        inputArgs: ["simple"],
        expected: [
          { name: "Alice", age: "30" },
          { name: "Bob", age: "25" },
        ],
      },
      {
        id: "nods-h1-t2",
        inputDisplay: "значения в кавычках",
        inputArgs: ["quoted"],
        expected: [{ city: "New York", code: "NY" }],
      },
      {
        id: "nods-h1-t3",
        inputDisplay: "пустой CSV (только заголовки)",
        inputArgs: ["headers-only"],
        expected: [],
      },
    ],
    hints: [
      "Первая строка CSV — заголовки. Как связать значения из последующих строк с именами полей?",
      "Запятые внутри кавычек не являются разделителями. Как правильно разбить строку по полям?",
    ],
    solutionCode: `const { Transform } = require('stream');

function parseCsvLine(line) {
  const values = [];
  let val = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      values.push(val);
      val = '';
    } else {
      val += c;
    }
  }
  values.push(val);
  return values;
}

async function parseCsvStream(readable) {
  return new Promise((resolve, reject) => {
    const rows = [];
    let headers = null;
    let buffer = '';

    readable.on('data', (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split('\\n');
      buffer = lines.pop(); // последняя неполная строка

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        const values = parseCsvLine(trimmed);
        if (!headers) {
          headers = values;
        } else {
          const row = {};
          headers.forEach((h, i) => { row[h] = values[i] ?? ''; });
          rows.push(row);
        }
      }
    });

    readable.on('end', () => {
      if (buffer.trim()) {
        const values = parseCsvLine(buffer.trim());
        if (headers) {
          const row = {};
          headers.forEach((h, i) => { row[h] = values[i] ?? ''; });
          rows.push(row);
        }
      }
      resolve(rows);
    });

    readable.on('error', reject);
  });
}`,
    testHelperCode: `const { Readable } = require('stream');

async function parseCsvStream_test(scenario) {
  function makeStream(str) {
    return Readable.from([str]);
  }

  if (scenario === 'simple') {
    return await parseCsvStream(makeStream('name,age\\nAlice,30\\nBob,25'));
  }
  if (scenario === 'quoted') {
    return await parseCsvStream(makeStream('city,code\\n"New York",NY'));
  }
  if (scenario === 'headers-only') {
    return await parseCsvStream(makeStream('name,age'));
  }
}`,
  },
  {
    id: "nods-h2",
    topicId: "node-streams",
    kind: "implement",
    title: "Stream pipeline с backpressure — ограничение скорости записи",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте функцию \`createThrottledPipeline(readable, writable, bytesPerSecond)\`, которая:

1. Читает данные из \`readable\`
2. Применяет **backpressure** — если \`writable.write()\` вернул \`false\`, прекращает чтение до события \`drain\`
3. Записывает в \`writable\` с ограничением скорости (\`bytesPerSecond\`)
4. Возвращает промис, который резолвится когда всё записано

Это ключевой паттерн Node.js streams — избегать переполнения памяти при разной скорости producer/consumer.`,
    functionName: "createThrottledPipeline_test",
    starterCode: `async function createThrottledPipeline(readable, writable, bytesPerSecond) {
  // ваш код — используйте backpressure!
}`,
    testCases: [
      {
        id: "nods-h2-t1",
        inputDisplay: "все данные доходят до writable",
        inputArgs: ["all-data"],
        expected: "hello world",
      },
      {
        id: "nods-h2-t2",
        inputDisplay:
          "backpressure: readable pauses когда writable.write → false",
        inputArgs: ["backpressure"],
        expected: true,
      },
      {
        id: "nods-h2-t3",
        inputDisplay: "промис резолвится только после окончания записи",
        inputArgs: ["complete"],
        expected: true,
      },
    ],
    hints: [
      "Writable.write возвращает false, если буфер заполнен. Что должен делать readable в этот момент?",
      "Как узнать, что writable снова готов принимать данные? И как сигнализировать о полном завершении записи?",
    ],
    solutionCode: `async function createThrottledPipeline(readable, writable, bytesPerSecond) {
  return new Promise((resolve, reject) => {
    readable.on('data', (chunk) => {
      const ok = writable.write(chunk);
      if (!ok) {
        readable.pause();
        writable.once('drain', () => readable.resume());
      }
    });

    readable.on('end', () => writable.end());
    readable.on('error', reject);
    writable.on('finish', resolve);
    writable.on('error', reject);
  });
}`,
    testHelperCode: `const { Readable, Writable } = require('stream');

async function createThrottledPipeline_test(scenario) {
  if (scenario === 'all-data') {
    const chunks = ['hello', ' ', 'world'];
    const readable = Readable.from(chunks);
    const collected = [];
    const writable = new Writable({
      write(chunk, enc, cb) { collected.push(chunk.toString()); cb(); }
    });
    await createThrottledPipeline(readable, writable, 1000);
    return collected.join('');
  }

  if (scenario === 'backpressure') {
    let paused = false;
    const data = Array.from({ length: 20 }, (_, i) => Buffer.alloc(100, i));
    const readable = Readable.from(data);
    const origPause = readable.pause.bind(readable);
    readable.pause = () => { paused = true; return origPause(); };

    const writable = new Writable({
      highWaterMark: 50,
      write(chunk, enc, cb) { setTimeout(cb, 5); }
    });

    await createThrottledPipeline(readable, writable, 10000);
    return paused;
  }

  if (scenario === 'complete') {
    const readable = Readable.from(['a', 'b', 'c']);
    let finished = false;
    const writable = new Writable({
      write(chunk, enc, cb) { setTimeout(cb, 10); }
    });
    writable.on('finish', () => { finished = true; });
    await createThrottledPipeline(readable, writable, 1000);
    return finished;
  }
}`,
  },
  {
    id: "nodes-e2",
    topicId: "node-streams",
    title: "bufferAll — собрать все чанки async-итератора в строку",
    difficulty: "easy",
    isContextual: false,
    description: `Реализуйте \`bufferAll(asyncIterable)\` — функцию, которая принимает async-итерируемый источник строковых чанков и возвращает Promise, резолвящийся **конкатенацией** всех чанков в одну строку.

Это базовый паттерн «полностью прочитать поток в память» (например, \`response.text()\`).

Пример:
\`\`\`
async function* source() {
  yield 'Hello, ';
  yield 'World';
  yield '!';
}
const text = await bufferAll(source());
// text === 'Hello, World!'
\`\`\``,
    functionName: 'bufferAll_test',
    starterCode: `async function bufferAll(asyncIterable) {
  // ваш код
}`,
    testCases: [
      { id: 'nodes-e2-t1', inputDisplay: "три чанка", inputArgs: ['three-chunks'], expected: 'Hello, World!' },
      { id: 'nodes-e2-t2', inputDisplay: "пустой источник → пустая строка", inputArgs: ['empty'], expected: '' },
      { id: 'nodes-e2-t3', inputDisplay: "один чанк", inputArgs: ['single'], expected: 'only' },
      { id: 'nodes-e2-t4', inputDisplay: "много чанков", inputArgs: ['many'], expected: 'abcdefghij' },
    ],
    hints: [
      'Используйте `for await...of` для итерации по async-итератору.',
      'Аккумулируйте чанки в строку (или массив + join в конце).',
    ],
    solutionCode: `async function bufferAll(asyncIterable) {
  const chunks = [];
  for await (const chunk of asyncIterable) {
    chunks.push(chunk);
  }
  return chunks.join('');
}`,
    testHelperCode: `async function bufferAll_test(scenario) {
  if (scenario === 'three-chunks') {
    async function* source() { yield 'Hello, '; yield 'World'; yield '!'; }
    return await bufferAll(source());
  }
  if (scenario === 'empty') {
    async function* source() { /* nothing */ }
    return await bufferAll(source());
  }
  if (scenario === 'single') {
    async function* source() { yield 'only'; }
    return await bufferAll(source());
  }
  if (scenario === 'many') {
    async function* source() {
      const letters = 'abcdefghij';
      for (const c of letters) yield c;
    }
    return await bufferAll(source());
  }
}`,
  },
  {
    id: "nodes-h3",
    topicId: "node-streams",
    kind: "implement",
    title: "parseNDJSON — потоковый парсер newline-delimited JSON",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте async-генератор \`parseNDJSON(asyncIterable)\`, который принимает поток **строковых чанков** и **построчно** парсит NDJSON (newline-delimited JSON) — формат, где каждая строка — отдельный JSON-объект.

Сложность в том, что **JSON-объект может оказаться разорван между чанками**. Нужно правильно склеивать остатки.

- Пропускайте пустые строки.
- При неуспешном \`JSON.parse\` — кидайте ошибку (не игнорируйте).
- Если в последнем чанке нет завершающего \`\\n\` — последняя строка тоже должна быть распарсена (если она не пустая).

Пример:
\`\`\`
async function* source() {
  yield '{"id":1,"name":"';
  yield 'Alice"}\\n{"id":2,';
  yield '"name":"Bob"}\\n';
}
const result = [];
for await (const obj of parseNDJSON(source())) result.push(obj);
// result === [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
\`\`\`

Типичный паттерн на бэкенде: чтение потоков логов, обработка вывода дочернего процесса (\`child_process\`) и других построчных источников данных.`,
    functionName: 'parseNDJSON_test',
    starterCode: `async function* parseNDJSON(asyncIterable) {
  // ваш код
}`,
    testCases: [
      { id: 'nodes-h3-t1', inputDisplay: "разделение объекта между чанками", inputArgs: ['split'], expected: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }] },
      { id: 'nodes-h3-t2', inputDisplay: "пустые строки игнорируются", inputArgs: ['empty-lines'], expected: [{ a: 1 }, { b: 2 }] },
      { id: 'nodes-h3-t3', inputDisplay: "хвост без \\n тоже парсится", inputArgs: ['trailing'], expected: [{ x: 10 }] },
      { id: 'nodes-h3-t4', inputDisplay: "ошибка парсинга — exception", inputArgs: ['bad-json'], expected: 'threw' },
      { id: 'nodes-h3-t5', inputDisplay: "пустой источник → []", inputArgs: ['empty-source'], expected: [] },
    ],
    hints: [
      'Поддерживайте буфер для «непрочитанного остатка». На каждый чанк: `buffer += chunk`, затем разделите по `\\n`.',
      'Последний элемент после `split` может быть **частичной** строкой — оставьте его в буфере для следующего чанка.',
      'После окончания итерации проверьте остаток в буфере — если он непустой, тоже распарсите.',
    ],
    solutionCode: `async function* parseNDJSON(asyncIterable) {
  let buffer = '';
  for await (const chunk of asyncIterable) {
    buffer += chunk;
    const parts = buffer.split('\\n');
    buffer = parts.pop(); // последняя часть может быть неполной
    for (const line of parts) {
      if (line.length === 0) continue;
      yield JSON.parse(line);
    }
  }
  if (buffer.length > 0) {
    yield JSON.parse(buffer);
  }
}`,
    testHelperCode: `async function parseNDJSON_test(scenario) {
  if (scenario === 'split') {
    async function* src() {
      yield '{"id":1,"name":"';
      yield 'Alice"}\\n{"id":2,';
      yield '"name":"Bob"}\\n';
    }
    const out = [];
    for await (const o of parseNDJSON(src())) out.push(o);
    return out;
  }
  if (scenario === 'empty-lines') {
    async function* src() { yield '{"a":1}\\n\\n\\n{"b":2}\\n'; }
    const out = [];
    for await (const o of parseNDJSON(src())) out.push(o);
    return out;
  }
  if (scenario === 'trailing') {
    async function* src() { yield '{"x":10}'; }
    const out = [];
    for await (const o of parseNDJSON(src())) out.push(o);
    return out;
  }
  if (scenario === 'bad-json') {
    async function* src() { yield '{"valid":1}\\nnot-json\\n'; }
    try {
      for await (const o of parseNDJSON(src())) { /* drain */ }
      return 'no-throw';
    } catch (e) {
      return 'threw';
    }
  }
  if (scenario === 'empty-source') {
    async function* src() { /* nothing */ }
    const out = [];
    for await (const o of parseNDJSON(src())) out.push(o);
    return out;
  }
}`,
  },
  {
    id: "nodes-h4",
    topicId: "node-streams",
    kind: "implement",
    title: "composeStreams — конвейер async-трансформов",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте \`composeStreams(source, ...transforms)\` — функцию, которая собирает конвейер из источника и нескольких трансформ-функций и возвращает финальный async-итератор.

- \`source\` — async-итерируемый источник чанков.
- \`transforms\` — async-генераторные функции вида \`(asyncIter) => asyncGenerator\`.

Каждая трансформа получает на вход выход предыдущей. Финальный итератор — выход последней трансформы.

Пример:
\`\`\`
async function* fromArray(arr) { for (const x of arr) yield x; }
async function* double(src)    { for await (const x of src) yield x * 2; }
async function* incThenStr(src) { for await (const x of src) yield String(x + 1); }

const pipe = composeStreams(fromArray([1, 2, 3]), double, incThenStr);
const out = [];
for await (const v of pipe) out.push(v);
// out === ['3', '5', '7']  (1*2+1, 2*2+1, 3*2+1)
\`\`\`

Это паттерн, лежащий в основе Node.js \`stream.pipeline\` и аналогичных конвейеров.`,
    functionName: 'composeStreams_test',
    starterCode: `function composeStreams(source, ...transforms) {
  // ваш код — верните async-итератор
}`,
    testCases: [
      { id: 'nodes-h4-t1', inputDisplay: "double + incThenStr", inputArgs: ['double-inc-str'], expected: ['3', '5', '7'] },
      { id: 'nodes-h4-t2', inputDisplay: "без трансформ — пропускает source", inputArgs: ['no-transforms'], expected: [1, 2, 3] },
      { id: 'nodes-h4-t3', inputDisplay: "одна трансформа", inputArgs: ['one-transform'], expected: [10, 20, 30] },
      { id: 'nodes-h4-t4', inputDisplay: "пустой источник → []", inputArgs: ['empty'], expected: [] },
      { id: 'nodes-h4-t5', inputDisplay: "фильтр + map", inputArgs: ['filter-map'], expected: ['even-2', 'even-4'] },
    ],
    hints: [
      'Применяйте `reduce` к массиву трансформ: на каждом шаге оборачивайте текущий итератор в новую трансформу.',
      'Финальный результат — итератор после применения всех трансформ.',
      'Каждая трансформа должна работать с async-итераторами (через for await).',
    ],
    solutionCode: `function composeStreams(source, ...transforms) {
  return transforms.reduce((iter, transform) => transform(iter), source);
}`,
    testHelperCode: `async function composeStreams_test(scenario) {
  async function* fromArray(arr) { for (const x of arr) yield x; }
  async function* double(src) { for await (const x of src) yield x * 2; }
  async function* incThenStr(src) { for await (const x of src) yield String(x + 1); }
  async function* times10(src) { for await (const x of src) yield x * 10; }
  async function* keepEven(src) { for await (const x of src) if (x % 2 === 0) yield x; }
  async function* tagEven(src) { for await (const x of src) yield 'even-' + x; }

  if (scenario === 'double-inc-str') {
    const out = [];
    for await (const v of composeStreams(fromArray([1, 2, 3]), double, incThenStr)) out.push(v);
    return out;
  }
  if (scenario === 'no-transforms') {
    const out = [];
    for await (const v of composeStreams(fromArray([1, 2, 3]))) out.push(v);
    return out;
  }
  if (scenario === 'one-transform') {
    const out = [];
    for await (const v of composeStreams(fromArray([1, 2, 3]), times10)) out.push(v);
    return out;
  }
  if (scenario === 'empty') {
    const out = [];
    for await (const v of composeStreams(fromArray([]), double)) out.push(v);
    return out;
  }
  if (scenario === 'filter-map') {
    const out = [];
    for await (const v of composeStreams(fromArray([1, 2, 3, 4, 5]), keepEven, tagEven)) out.push(v);
    return out;
  }
}`,
  },
];
