import type { Problem } from '../../types/problem';

export const nodeStreamsProblems: Problem[] = [
  {
    id: 'nodes-p1',
    topicId: 'node-streams',
    title: 'Pipeline — цепочка трансформаций',
    difficulty: 'easy',
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
    functionName: '__runPipeline',
    starterCode: `function createPipeline(...fns) {
  // ваш код
}`,
    testCases: [
      {
        id: 'nodes-p1-t1',
        inputDisplay: 'x*2 → x+1 → x*x : process(3) = 49',
        inputArgs: ['math', 3],
        expected: 49,
      },
      {
        id: 'nodes-p1-t2',
        inputDisplay: 'trim → toLowerCase → replace spaces',
        inputArgs: ['string', '  Hello World  '],
        expected: 'hello-world',
      },
      {
        id: 'nodes-p1-t3',
        inputDisplay: 'пустой pipeline — identity',
        inputArgs: ['empty', 42],
        expected: 42,
      },
      {
        id: 'nodes-p1-t4',
        inputDisplay: 'одна функция',
        inputArgs: ['single', 5],
        expected: 10,
      },
      {
        id: 'nodes-p1-t5',
        inputDisplay: 'порядок применения слева направо',
        inputArgs: ['order', 10],
        expected: 3,
      },
    ],
    hints: [
      'Используйте `Array.prototype.reduce`: начните с начального значения и последовательно применяйте каждую функцию.',
      'Если `fns` пустой — верните функцию `x => x` (identity).',
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
    id: 'nodes-p2',
    topicId: 'node-streams',
    title: 'chunk — разбивка строки на части',
    difficulty: 'easy',
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
    functionName: 'chunkString',
    starterCode: `function chunkString(str, size) {
  // ваш код
}`,
    testCases: [
      {
        id: 'nodes-p2-t1',
        inputDisplay: '"abcdefghi", 3 → ["abc","def","ghi"]',
        inputArgs: ['abcdefghi', 3],
        expected: ['abc', 'def', 'ghi'],
      },
      {
        id: 'nodes-p2-t2',
        inputDisplay: '"hello", 2 → ["he","ll","o"]',
        inputArgs: ['hello', 2],
        expected: ['he', 'll', 'o'],
      },
      {
        id: 'nodes-p2-t3',
        inputDisplay: '"", 3 → []',
        inputArgs: ['', 3],
        expected: [],
      },
      {
        id: 'nodes-p2-t4',
        inputDisplay: '"ab", 10 → ["ab"]',
        inputArgs: ['ab', 10],
        expected: ['ab'],
      },
      {
        id: 'nodes-p2-t5',
        inputDisplay: '"12345", 1 → ["1","2","3","4","5"]',
        inputArgs: ['12345', 1],
        expected: ['1', '2', '3', '4', '5'],
      },
    ],
    hints: [
      'Используйте цикл `while (i < str.length)` и `str.slice(i, i + size)`, увеличивая `i` на `size` каждую итерацию.',
      'Или: `str.match(/.{1,size}/g)` с шаблоном в виде RegExp.',
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
    id: 'nodes-p3',
    topicId: 'node-streams',
    title: 'TransformStream — класс преобразования данных',
    difficulty: 'medium',
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
    functionName: 'TransformStream',
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
        id: 'nodes-p3-t1',
        inputDisplay: 'write + read — базовая трансформация',
        inputArgs: ['basic'],
        expected: 'HELLO',
      },
      {
        id: 'nodes-p3-t2',
        inputDisplay: 'read пустого буфера → null',
        inputArgs: ['empty-read'],
        expected: null,
      },
      {
        id: 'nodes-p3-t3',
        inputDisplay: 'pipe — цепочка двух TransformStream',
        inputArgs: ['pipe'],
        expected: 'HELLO',
      },
      {
        id: 'nodes-p3-t4',
        inputDisplay: 'несколько write → правильный порядок read',
        inputArgs: ['order'],
        expected: ['A', 'B', 'C'],
      },
      {
        id: 'nodes-p3-t5',
        inputDisplay: 'pipe в несколько стримов',
        inputArgs: ['multi-pipe'],
        expected: '!!!HELLO!!!',
      },
    ],
    hints: [
      'Храните буфер обработанных чанков: `this.buffer = []`. `write` → `this.buffer.push(transformFn(chunk))`.',
      '`pipe`: когда `this.write` вызывается, автоматически вызывайте `otherStream.write()` с результатом. Храните `this.pipeTo` и вызывайте его в `write`.',
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
    id: 'nodes-p4',
    topicId: 'node-streams',
    title: 'BufferedWriter — буферизованная запись',
    difficulty: 'medium',
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
    functionName: 'BufferedWriter',
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
        id: 'nodes-p4-t1',
        inputDisplay: 'auto-flush при достижении bufferSize',
        inputArgs: ['auto-flush'],
        expected: ['helloworld'],
      },
      {
        id: 'nodes-p4-t2',
        inputDisplay: 'явный flush сбрасывает оставшееся',
        inputArgs: ['manual-flush'],
        expected: ['helloworld', '!'],
      },
      {
        id: 'nodes-p4-t3',
        inputDisplay: 'getBufferSize() после записи',
        inputArgs: ['buffer-size'],
        expected: 5,
      },
      {
        id: 'nodes-p4-t4',
        inputDisplay: 'flush пустого буфера — flushFn не вызывается',
        inputArgs: ['flush-empty'],
        expected: 0,
      },
      {
        id: 'nodes-p4-t5',
        inputDisplay: 'данные больше bufferSize — flush сразу',
        inputArgs: ['overflow'],
        expected: ['hello world!'],
      },
    ],
    hints: [
      'Храните `this.buffer = ""`. При `write`: `this.buffer += data`, затем проверяйте `this.buffer.length >= this.bufferSize`.',
      '`flush`: если `this.buffer.length > 0` — вызовите `this.flushFn(this.buffer)` и очистите `this.buffer = ""`.',
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
    id: 'nodes-p5',
    topicId: 'node-streams',
    title: 'splitLines — разбивка текста на строки',
    difficulty: 'easy',
    isContextual: false,
    description: `Реализуйте функцию \`splitLines(text)\`:
- Разбивает текст на строки (по \`\\n\`)
- Пропускает пустые строки
- Возвращает массив строк без ведущих/trailing пробелов

Примеры:
\`\`\`
splitLines("hello\\nworld\\nfoo");
// → ['hello', 'world', 'foo']

splitLines("line1\\n\\n  line2  \\nline3\\n");
// → ['line1', 'line2', 'line3']

splitLines("");
// → []
\`\`\``,
    functionName: 'splitLines',
    starterCode: `function splitLines(text) {
  // ваш код
}`,
    testCases: [
      {
        id: 'nodes-p5-t1',
        inputDisplay: '"hello\\nworld\\nfoo" → ["hello","world","foo"]',
        inputArgs: ['hello\nworld\nfoo'],
        expected: ['hello', 'world', 'foo'],
      },
      {
        id: 'nodes-p5-t2',
        inputDisplay: 'пустые строки пропускаются',
        inputArgs: ['line1\n\n  line2  \nline3\n'],
        expected: ['line1', 'line2', 'line3'],
      },
      {
        id: 'nodes-p5-t3',
        inputDisplay: 'пустая строка → []',
        inputArgs: [''],
        expected: [],
      },
      {
        id: 'nodes-p5-t4',
        inputDisplay: 'одна строка без \\n',
        inputArgs: ['hello'],
        expected: ['hello'],
      },
      {
        id: 'nodes-p5-t5',
        inputDisplay: 'строки с пробелами обрезаются',
        inputArgs: ['  a  \n  b  \n  c  '],
        expected: ['a', 'b', 'c'],
      },
    ],
    hints: [
      '`text.split("\\n")` — разбить на строки. Затем `.map(l => l.trim())` и `.filter(l => l.length > 0)`.',
    ],
    solutionCode: `function splitLines(text) {
  return text
    .split('\\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}`,
  },
  {
    kind: 'predict-output',
    id: 'ns-p6',
    topicId: 'node-streams',
    title: 'Угадай вывод: трассировка событий стрима',
    difficulty: 'medium',
    isContextual: false,
    description: `Перед вами эмуляция Readable-стрима через массив. \`emit\` срабатывает синхронно — как у настоящего EventEmitter в Node.js. Введи каждую напечатанную строку в отдельной строчке поля ответа.

Подсказка: подписка на \`data\` переводит стрим в flowing mode, и каждый \`push\` синхронно вызывает обработчик до возврата управления. Событие \`end\` стандартно эмитится **асинхронно** (через микрозадачу) — это поведение мы воспроизвели через \`Promise.resolve().then\`.`,
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
    expected: 'before\ndata: A\ndata: B\nafter\nend',
    hints: [
      '«before» — синхронный console.log до первого push.',
      'push("A") и push("B") синхронно вызывают обработчик data — это flowing mode.',
      'push(null) ставит end-обработчик в микрозадачу через Promise.resolve().then. Микрозадачи выполняются после текущего синхронного кода, поэтому "after" печатается раньше "end".',
    ],
    solutionCode: `// before  — sync до push
// data: A — sync, push в flowing mode
// data: B — sync, push в flowing mode
// after   — sync console.log
// end     — микрозадача после текущего стека`,
  },
  {
    kind: 'find-bug',
    id: 'ns-p7',
    topicId: 'node-streams',
    title: 'Найди баг: pipe без обработки ошибок',
    difficulty: 'medium',
    isContextual: false,
    description: `Функция \`runPipeline(source, transform, sink)\` должна последовательно «протолкнуть» каждый элемент из \`source\` (массив) через \`transform\` (функция) в \`sink\` (массив-приёмник через push), и вернуть массив элементов, на которые \`transform\` бросил ошибку (то есть skipped).

В коде классический баг: ошибка в \`transform\` для одного элемента **роняет всю обработку**, остальные элементы теряются — это аналог \`pipe\` без \`.on('error')\` в реальных стримах. Найди баг и почини так, чтобы при ошибке элемент пропускался, попадал в массив errors и обработка продолжалась.

Сигнатура: \`runPipeline(source, transform, sink) → string[]\` (массив сообщений ошибок в порядке появления).`,
    buggyCode: `function runPipeline(source, transform, sink) {
  const errors = [];
  for (const item of source) {
    // Баг: одна ошибка прерывает весь цикл, sink теряет последующие элементы.
    const out = transform(item);
    sink.push(out);
  }
  return errors;
}`,
    functionName: 'ns_p7_test',
    bugSummary:
      'Вызов transform(item) не обёрнут в try/catch — это аналог `.pipe()` без подписки на error. Любая ошибка прерывает цикл и оставляет приёмник в неполном состоянии. Решение — обернуть transform/push в try/catch, в catch добавлять сообщение в errors и продолжать цикл.',
    testCases: [
      {
        id: 'ns-p7-t1',
        inputDisplay: 'все элементы успешны → sink заполнен, errors пуст',
        inputArgs: ['all-ok'],
        expected: '[2,4,6]|[]',
      },
      {
        id: 'ns-p7-t2',
        inputDisplay: 'ошибка в середине — обработка продолжается',
        inputArgs: ['middle-error'],
        expected: '[4,8]|[bad:3]',
      },
      {
        id: 'ns-p7-t3',
        inputDisplay: 'несколько ошибок подряд',
        inputArgs: ['multi-errors'],
        expected: '[4,8]|[bad:3,bad:5]',
      },
      {
        id: 'ns-p7-t4',
        inputDisplay: 'все элементы вызывают ошибку',
        inputArgs: ['all-bad'],
        expected: '[]|[bad:1,bad:2,bad:3]',
      },
    ],
    hints: [
      'В реальных стримах эта проблема решается переходом с `pipe` на `pipeline` — он ловит ошибки и не теряет данные.',
      'Здесь нужно обернуть тело цикла в try/catch и в catch делать `errors.push(err.message)`.',
      'После catch цикл должен продолжиться — никакого `throw` или `break`.',
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
    kind: 'refactor',
    id: 'ns-p8',
    topicId: 'node-streams',
    title: 'Рефактор: загрузка всего файла → потоковая обработка',
    difficulty: 'medium',
    isContextual: false,
    description: `Функция \`countErrors(lines)\` должна посчитать количество строк, содержащих подстроку "ERROR". Текущая реализация — наивный аналог \`fs.readFileSync\` + \`split\`: материализует весь массив, делает несколько проходов, аллоцирует промежуточные структуры. На больших объёмах это аналог OOM в Node.js.

Перепиши так, чтобы обработка шла **за один проход** через async generator (потоковый аналог Transform-стрима в Node.js). Сигнатура: \`countErrors(lines) → Promise<number>\`. \`lines\` — массив (в реальном Node.js это был бы Readable-стрим).

Корректность: результат должен совпадать. Производительность не критична (тест на корректность только) — главное, не делать лишних проходов и промежуточных массивов размером O(N).`,
    functionName: 'countErrors_test',
    starterCode: `async function countErrors(lines) {
  // ❌ Аналог readFileSync: всё в памяти, два прохода, лишние массивы.
  const trimmed = lines.map((l) => l.trim());
  const filtered = trimmed.filter((l) => l.includes('ERROR'));
  return filtered.length;
}`,
    testCases: [
      {
        id: 'ns-p8-t1',
        inputDisplay: 'смешанные строки — считаются только ERROR',
        inputArgs: [['INFO ok', 'ERROR fail', 'WARN low', 'ERROR boom']],
        expected: 2,
      },
      {
        id: 'ns-p8-t2',
        inputDisplay: 'пустой массив → 0',
        inputArgs: [[]],
        expected: 0,
      },
      {
        id: 'ns-p8-t3',
        inputDisplay: 'все строки — ERROR',
        inputArgs: [['ERROR a', 'ERROR b', 'ERROR c']],
        expected: 3,
      },
      {
        id: 'ns-p8-t4',
        inputDisplay: 'нет ERROR — ноль',
        inputArgs: [['INFO 1', 'INFO 2']],
        expected: 0,
      },
      {
        id: 'ns-p8-t5',
        inputDisplay: 'строки с пробелами вокруг — trim не должен убирать совпадение',
        inputArgs: [['  ERROR  ', 'ok', '\\tERROR']],
        expected: 2,
      },
    ],
    hints: [
      'Превратите массив в async iterable: `async function* source() { for (const l of lines) yield l; }`.',
      'Считайте через `for await (const line of source())` и инкрементируйте счётчик при `line.includes("ERROR")` — без map/filter.',
      'В реальном Node.js это был бы `pipeline(fs.createReadStream, readline.createInterface, async function* (src) {...})`.',
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
];
