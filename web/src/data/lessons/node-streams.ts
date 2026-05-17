import type { Lesson } from '../../types/lesson';
import { nodeStreamsQuiz } from '../quizzes/node-streams';
import { nodeStreamsFlashcards } from '../flashcards/node-streams';

// Index quiz questions for reuse as checkpoints.
const Q = Object.fromEntries(nodeStreamsQuiz.questions.map((q) => [q.id, q]));

// Questions used as in-chapter checkpoints (must NOT appear in finalQuiz).
const CHECKPOINT_IDS = new Set(['nodes-q1', 'nodes-q3', 'nodes-q7', 'nodes-q11']);

const extraFlashcards = [
  {
    id: 'nodes-f6',
    question: 'Чем pipeline из stream/promises удобнее, чем pipeline с callback и тем более pipe?',
    answer:
      'pipeline из stream/promises возвращает Promise — его можно ждать через await и оборачивать в try/catch. При любой ошибке в любом стриме цепочки он автоматически вызывает destroy() на всех участниках, закрывая дескрипторы. pipe и callback-вариант либо вообще не пробрасывают ошибки (pipe), либо делают это через нестандартный API.',
    keyPoints: [
      'pipe — старый API, ошибки не пробрасываются по цепочке',
      'stream.pipeline(...streams, callback) — Node 10+, корректно обрабатывает ошибки',
      'stream/promises pipeline (Node 15+) — то же, но с Promise/await',
      'Поддерживает AbortSignal: { signal: controller.signal } в опциях',
      'Принимает не только стримы, но и async generator-функции в середине цепочки',
    ],
    code: `const { pipeline } = require('stream/promises');
const controller = new AbortController();

await pipeline(
  fs.createReadStream('input.txt'),
  async function* (source) {
    for await (const chunk of source) {
      yield chunk.toString().toUpperCase();
    }
  },
  fs.createWriteStream('output.txt'),
  { signal: controller.signal },
);`,
  },
  {
    id: 'nodes-f7',
    question: 'Когда стоит использовать Transform-стрим вместо обычной обработки массива через map/filter?',
    answer:
      'Transform нужен, когда данные приходят кусками во времени и не помещаются в память: разбор большого CSV/NDJSON, проксирование HTTP-запроса, gzip-сжатие на лету. Если данные уже в массиве и размер ограничен — обычные map/filter проще и быстрее.',
    keyPoints: [
      'Transform — для потоковой обработки, когда полный объём данных недоступен или большой',
      'map/filter — синхронны, требуют весь массив в памяти',
      'Transform работает с backpressure: writable пауза → upstream readable замедляется',
      'Альтернатива в современном Node.js — async generator + pipeline, читается проще класса',
    ],
  },
  {
    id: 'nodes-f8',
    question: 'Что такое async iteration по стриму (for await...of) и какие у неё подводные камни?',
    answer:
      'Readable-стримы реализуют Symbol.asyncIterator. for await перебирает чанки последовательно, сам обрабатывает паузы и завершение. Подводный камень: при выходе из цикла (break, throw) стрим автоматически уничтожается через destroy() — это удобно, но неожиданно, если вы хотели «приостановить» итерацию.',
    keyPoints: [
      'Доступно с Node.js 10+, удобнее event-based on("data")/on("end")',
      'break/throw внутри цикла → stream.destroy() — открытые ресурсы закрываются',
      'Нельзя смешивать on("data") и for await на одном стриме — потеря данных',
      'Идеально сочетается с async generator в pipeline',
    ],
    code: `for await (const chunk of fs.createReadStream('huge.log')) {
  if (chunk.includes('FATAL')) break; // стрим автоматически закроется
}`,
  },
];

export const nodeStreamsLesson: Lesson = {
  topicId: 'node-streams',

  intro: {
    whyItMatters: `Стримы — фундаментальная абстракция Node.js, на которой построены файловая система (\`fs.createReadStream\`/\`createWriteStream\`), HTTP (\`req\` и \`res\` — это стримы), child_process (\`stdin\`/\`stdout\`/\`stderr\` дочернего процесса), сжатие (\`zlib\`), шифрование (\`crypto\`). Любой код на Node, который работает с большим количеством данных — загрузка файла, проксирование запроса, экспорт CSV, сжатие бэкапа — рано или поздно приходит к стримам.

Главная проблема, которую решают стримы — **память**. Загрузить файл на 10 ГБ через \`fs.readFileSync\` означает попытаться разместить эти 10 ГБ в куче V8, что приведёт к OOM-крэшу. Стрим читает данные кусками (по умолчанию 16 КБ) и в памяти держит только текущий чанк — расход памяти O(1) от размера файла. То же самое для проксирования HTTP: вы не должны буферизовать тело запроса целиком, чтобы передать его дальше.

Вторая проблема — **скорость источника не равна скорости приёмника**. Если читать диск быстрее, чем писать в сеть, чанки начнут копиться во внутреннем буфере writable-стрима, пока не съедят всю RAM. Механизм решения называется **backpressure**: \`writable.write()\` возвращает \`false\`, когда буфер заполнен; правильная реализация на это останавливает источник до события \`drain\`. Это ровно то, что \`pipeline\` (Node 10+) делает за вас автоматически — в отличие от старого \`pipe\`, который не пробрасывает ошибки и оставляет открытые файловые дескрипторы при сбое.

В Node существует **четыре типа стримов**: Readable (источник), Writable (приёмник), Duplex (одновременно читать и писать независимо — TCP-сокет), Transform (Duplex, где выход вычисляется из входа — gzip, шифрование). Понимание их различий и того, как они стыкуются через \`pipeline\`, — обязательная компетенция для Node-разработчика middle+.`,
    estimatedMinutes: 35,
    interviewAngle:
      'Senior-интервьюер проверяет три вещи: (1) знаете ли вы 4 типа стримов и приведёте ли пример каждого из стандартной библиотеки; (2) понимаете ли backpressure и почему pipeline лучше pipe; (3) умеете ли заменить fs.readFileSync на потоковую обработку и оценить экономию памяти. Бонус — async generator как Readable и AbortSignal в pipeline.',
    prerequisites: [{ slug: 'node-event-loop', title: 'Event Loop в Node.js' }],
  },

  resources: {
    videos: [
      {
        source: 'youtube',
        id: 'GlybFFMXXmQ',
        title: 'Streams in Node.js — Hussein Nasser',
        channel: 'Hussein Nasser',
        language: 'en',
        durationSec: 25 * 60,
        description: 'Hussein Nasser объясняет стримы с фокусом на сетевую модель: почему backpressure — это в первую очередь про TCP, а не про Node.',
      },
      {
        source: 'youtube',
        id: 'My-EjC_R-70',
        title: 'Stream Into The Future — Matteo Collina (Node TLV 2020)',
        channel: 'Node.TLV',
        language: 'en',
        durationSec: 30 * 60,
        description:
          'Маттео Коллина — член Node.js TSC и мейнтейнер стримов — показывает, как async iteration и pipeline меняют работу со стримами и почему именно pipeline решает backpressure корректно.',
      },
    ],
    links: [
      {
        url: 'https://nodejs.org/docs/latest/api/stream.html',
        title: 'Stream — официальная документация Node.js',
        source: 'nodejs-docs',
        language: 'en',
        note: 'Канонический источник по API. Раздел «Buffering» и «pipeline» обязательны к прочтению.',
      },
      {
        url: 'https://nodejs.org/en/learn/modules/backpressuring-in-streams',
        title: 'Backpressuring in Streams — Node.js Learn',
        source: 'nodejs-docs',
        language: 'en',
        note: 'Подробный разбор backpressure с диаграммами: что происходит в буфере при разнице скоростей.',
      },
      {
        url: 'https://2ality.com/2019/11/nodejs-streams-async-iteration.html',
        title: 'Using Node.js streams with async iteration — 2ality',
        source: 'article',
        language: 'en',
        note: 'Аксель Раушмайер про async iteration, Readable.from и async generator в pipeline.',
      },
      {
        url: 'https://github.com/substack/stream-handbook',
        title: 'stream-handbook — substack',
        source: 'github',
        language: 'en',
        note: 'Классическая книга по стримам. Старая, но хорошо объясняет философию pipe.',
      },
      {
        url: 'https://blog.platformatic.dev/a-deep-dive-into-the-most-advanced-node-js-streams',
        title: 'A deep dive into Node.js streams — Platformatic',
        source: 'article',
        language: 'en',
        note: 'Свежее (2023+) объяснение от команды Matteo Collina: highWaterMark, objectMode, AbortSignal в pipeline.',
      },
    ],
  },

  chapters: [
    {
      id: 'four-types',
      title: 'Четыре типа стримов',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            'Стрим в Node.js — это абстракция над потоком данных, которая получает или отдаёт данные **кусками (chunks)**, а не целиком. Все стримы — наследники `EventEmitter` и реализуют общий протокол: события `data`, `end`, `error`, `close`, методы управления потоком.',
        },
        {
          type: 'list',
          content: `- **Readable** — источник. Из него можно только читать. Примеры: \`fs.createReadStream(path)\`, \`http.IncomingMessage\` (входящий запрос на сервере или ответ на клиенте), \`process.stdin\`.
- **Writable** — приёмник. В него можно только писать. Примеры: \`fs.createWriteStream(path)\`, \`http.ServerResponse\`, \`process.stdout\`.
- **Duplex** — два независимых канала: можно одновременно читать и писать, причём данные разные. Пример: \`net.Socket\` — TCP-соединение, где исходящий и входящий поток не связаны напрямую.
- **Transform** — частный случай Duplex, где выходные данные вычисляются из входных. Это «фильтр» или «преобразователь». Примеры: \`zlib.createGzip()\`, \`crypto.createCipheriv()\`, ваш собственный CSV-парсер.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const fs = require('fs');
const zlib = require('zlib');
const { pipeline } = require('stream/promises');

// Цепочка: Readable → Transform → Writable
await pipeline(
  fs.createReadStream('big-file.txt'),  // Readable
  zlib.createGzip(),                    // Transform (Duplex)
  fs.createWriteStream('big-file.gz'),  // Writable
);
// Память: O(highWaterMark) ≈ 16 КБ, независимо от размера файла.`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Все стримы наследуются от EventEmitter — поэтому событие `error` без подписчика крашит процесс. Это одна из самых частых причин падений в production: забыли `stream.on("error", ...)` или используете `pipe` вместо `pipeline`.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Иерархия классов в модуле 'stream':
//
//   Readable  ──┐
//               ├──► Duplex ──► Transform
//   Writable  ──┘
//
// Любой Transform — это Duplex.
// Любой Duplex — и Readable, и Writable.`,
        },
      ],
      flashcardIds: ['nodes-f1'],
      checkpoint: [Q['nodes-q1']!],
      docsLink: { url: 'https://metanit.com/web/nodejs/11.1.php', title: 'Потоки (Streams) — metanit.com' },
    },

    {
      id: 'backpressure',
      title: 'Backpressure: почему скорость источника важна',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            '**Backpressure** возникает, когда Writable обрабатывает данные медленнее, чем Readable их поставляет. Если ничего не делать, чанки начнут копиться во внутреннем буфере Writable, пока не съедят всю RAM процесса.',
        },
        {
          type: 'text',
          content:
            'Защитный механизм встроен в API: метод `writable.write(chunk)` возвращает **boolean**. Если буфер заполнился до `highWaterMark` — возврат `false`, и это сигнал «остановись, не пиши, пока я не скажу». Когда буфер освободится, Writable эмитит событие `drain`.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// ❌ Игнорирование backpressure — утечка памяти.
readable.on('data', (chunk) => {
  writable.write(chunk); // возврат false игнорируется → буфер растёт
});

// ✅ Корректная ручная обработка backpressure.
readable.on('data', (chunk) => {
  const ok = writable.write(chunk);
  if (!ok) {
    readable.pause();   // ⏸ останавливаем источник
  }
});

writable.on('drain', () => {
  readable.resume();    // ▶️ буфер освободился — продолжаем
});`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Ручная обработка backpressure — частый источник ошибок: забытый `pause`, забытый `drain`, отсутствие `error`-обработчика. На практике в production-коде её почти не пишут — используют `pipeline`, который делает всё это автоматически.',
        },
        {
          type: 'text',
          content:
            'Параметр `highWaterMark` задаёт размер буфера: 16 КБ по умолчанию для байтовых стримов, 16 объектов для `objectMode`. Меньшее значение = меньше памяти, чаще syscalls. Большее = эффективнее I/O, но больше пик памяти.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Тонкий тюнинг под характер нагрузки:
const readStream = fs.createReadStream('file.bin', {
  highWaterMark: 64 * 1024, // 64 КБ — крупнее чанки, реже системные вызовы
});

// Для objectMode highWaterMark меряется в объектах, а не в байтах:
const dbStream = new Readable({
  objectMode: true,
  highWaterMark: 50, // буферизуем до 50 записей
  read() {/* ... */},
});`,
        },
      ],
      flashcardIds: ['nodes-f2'],
      checkpoint: [Q['nodes-q3']!],
      docsLink: { url: 'https://metanit.com/web/nodejs/11.1.php', title: 'Потоки (Streams) — metanit.com' },
    },

    {
      id: 'pipe-vs-pipeline',
      title: 'pipe vs pipeline: обработка ошибок',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Метод `readable.pipe(writable)` появился в Node.js 0.x и долго был основным инструментом склейки стримов. У него два больших недостатка: **ошибки не пробрасываются по цепочке** и **при сбое не освобождаются ресурсы**.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// ❌ pipe: если input.txt не существует, gzip и writeStream
// останутся открытыми → утечка файловых дескрипторов.
fs.createReadStream('input.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('output.gz'));

// Чтобы было безопасно, пришлось бы вешать .on('error') на КАЖДЫЙ стрим
// и вручную вызывать destroy() на остальных — несколько десятков строк boilerplate.`,
        },
        {
          type: 'text',
          content:
            '`stream.pipeline` (Node 10+) и его promise-вариант `stream/promises.pipeline` (Node 15+) решают обе проблемы: при ошибке в любом стриме автоматически вызывается `destroy()` на всех участниках цепочки.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const { pipeline } = require('stream/promises');

async function compress(src, dst) {
  try {
    await pipeline(
      fs.createReadStream(src),
      zlib.createGzip(),
      fs.createWriteStream(dst),
    );
  } catch (err) {
    // ВСЕ стримы уже закрыты, дескрипторы освобождены.
    console.error('pipeline failed:', err);
    throw err;
  }
}`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Современный pipeline принимает не только стримы, но и **async generator-функции** прямо в середине цепочки — это убирает необходимость писать класс-наследник Transform для простых преобразований.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `await pipeline(
  fs.createReadStream('input.log'),
  async function* (source) {
    source.setEncoding('utf8');
    for await (const chunk of source) {
      yield chunk.toUpperCase();
    }
  },
  fs.createWriteStream('output.log'),
);`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'pipeline поддерживает AbortSignal: `pipeline(...streams, { signal: controller.signal })`. Вызов `controller.abort()` останавливает всю цепочку и закрывает стримы.',
        },
      ],
      flashcardIds: ['nodes-f3', 'nodes-f6'],
      checkpoint: [Q['nodes-q7']!],
      docsLink: { url: 'https://metanit.com/web/nodejs/11.2.php', title: 'Pipe — metanit.com' },
    },

    {
      id: 'custom-transform',
      title: 'Свой Transform-стрим и async generators',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            'Чтобы написать собственный Transform, нужно унаследоваться от `Transform` и реализовать метод `_transform(chunk, encoding, callback)`. Опциональный `_flush(callback)` вызывается один раз в конце — там можно «дослать» накопленные данные.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const { Transform } = require('stream');

class UpperCase extends Transform {
  _transform(chunk, encoding, callback) {
    // chunk — Buffer (или строка, если задан encoding)
    this.push(chunk.toString().toUpperCase()); // отдаём вниз по цепочке
    callback();                                // готов к следующему чанку
  }

  _flush(callback) {
    this.push('\\n[END OF STREAM]\\n');
    callback();
  }
}

process.stdin.pipe(new UpperCase()).pipe(process.stdout);`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Если данные обрабатываются строками (а не байтами), укажите `decodeStrings: false` в конструкторе и/или `setEncoding("utf8")` на upstream-стриме — иначе на стыке UTF-8 чанков можно «разрезать» многобайтовый символ пополам.',
        },
        {
          type: 'text',
          content:
            'В современном коде вместо класса-наследника часто пишут **async generator** — это короче и не требует возиться с `callback`/`push`. Превратить его в Readable можно через `Readable.from(asyncIterable)`, а вставить в середину `pipeline` можно как обычную функцию.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const { Readable } = require('stream');

async function* generateLines(n) {
  for (let i = 0; i < n; i++) {
    await new Promise((r) => setTimeout(r, 10));
    yield \`line \${i}\\n\`;
  }
}

// Превращаем async generator в полноценный Readable.
const stream = Readable.from(generateLines(100));

// for await...of перебирает чанки один за другим:
for await (const line of stream) {
  process.stdout.write(line);
}`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'При выходе из `for await...of` через `break` или `throw` стрим автоматически уничтожается через `stream.destroy()` — открытые файловые дескрипторы закрываются. Это удобно, но неожиданно, если вы хотели «приостановить» итерацию: повторно итерировать тот же стрим уже не получится.',
        },
      ],
      flashcardIds: ['nodes-f4', 'nodes-f7', 'nodes-f8'],
      docsLink: { url: 'https://metanit.com/web/nodejs/11.3.php', title: 'Transform-поток — metanit.com' },
      playground: {
        starterCode: `// В браузерном sandbox нет модуля 'stream' и fs.
// Эмулируем стрим через async generator: он ведёт себя как Readable
// в смысле потокового выпуска данных.
//
// Задача: реализовать "Transform" upperCase, который принимает
// async iterable строк и выдаёт их в верхнем регистре.

async function* source() {
  yield 'hello';
  yield 'world';
  yield 'streams';
}

async function* upperCase(input) {
  // ваш код: пройти по input через for await...of
  // и yield-ить chunk.toUpperCase()
}

(async () => {
  for await (const line of upperCase(source())) {
    console.log(line);
  }
})();`,
        expectedOutput: 'HELLO\nWORLD\nSTREAMS',
        description:
          'Допишите async generator upperCase так, чтобы он работал как Transform-стрим: получает входной async iterable и выдаёт преобразованные значения. В реальном Node.js этот же код можно вставить прямо в pipeline как Transform — без класса-наследника.',
      },
    },

    {
      id: 'patterns',
      title: 'Практические паттерны',
      estimatedMinutes: 6,
      blocks: [
        { type: 'heading', content: 'Чтение файла построчно' },
        {
          type: 'code',
          language: 'javascript',
          content: `const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('access.log'),
  crlfDelay: Infinity, // корректно обрабатывает \\r\\n
});

let count = 0;
for await (const line of rl) {
  if (line.includes('ERROR')) count++;
}
console.log('errors:', count);`,
        },
        { type: 'heading', content: 'Stream → Buffer (когда без вариантов)' },
        {
          type: 'code',
          language: 'javascript',
          content: `// Когда API требует полный буфер (например, парсер JSON):
async function streamToBuffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

// ⚠️ Используйте только когда уверены, что данные поместятся в память.
// Для произвольно больших файлов — потоковый парсер (stream-json и т.п.).`,
        },
        { type: 'heading', content: 'objectMode для записей БД' },
        {
          type: 'code',
          language: 'javascript',
          content: `// objectMode позволяет передавать произвольные JS-объекты,
// а не только Buffer/String. Полезно для cursor → transform → writer.
const { Transform } = require('stream');

const enrich = new Transform({
  objectMode: true,
  transform(row, _encoding, cb) {
    this.push({ ...row, fullName: \`\${row.first} \${row.last}\` });
    cb();
  },
});

await pipeline(
  dbCursorAsReadableStream(),  // objectMode: true
  enrich,
  csvSerializer(),             // objectMode → string
  fs.createWriteStream('users.csv'),
);`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'На собеседовании любимый вопрос: «как прочитать 10 ГБ файл?». Правильный ответ — стримами с потоковой обработкой. `fs.readFile`/`readFileSync` для таких размеров загрузят весь файл в память и процесс упадёт. `pipeline` + Transform/async generator + `fs.createWriteStream` = O(highWaterMark) памяти — то есть расход памяти ограничен размером буфера, а не размером файла.',
        },
      ],
      flashcardIds: ['nodes-f5'],
      docsLink: { url: 'https://metanit.com/web/nodejs/11.1.php', title: 'Потоки (Streams) — metanit.com' },
      playground: {
        starterCode: `// Эмулируем потоковую обработку CSV без fs:
// "источник" — массив строк, "стрим" — async generator.
// Задача: посчитать сумму поля "amount" из CSV "id,amount".

const csv = [
  'id,amount',
  '1,10',
  '2,20',
  '3,30',
  '4,40',
];

async function* lines() {
  for (const line of csv) yield line;
}

async function sumAmounts(linesIterable) {
  let total = 0;
  let header = null;
  // ваш код: пройдитесь по linesIterable через for await...of,
  // первая строка — заголовок, у остальных возьмите второе поле.
  return total;
}

(async () => {
  console.log(await sumAmounts(lines()));
})();`,
        expectedOutput: '100',
        description:
          'Реализуйте потоковую обработку CSV: считаете построчно, не загружая всё в массив. В реальном Node.js это был бы pipeline(fs.createReadStream, readline.createInterface, async function*).',
      },
    },

    {
      id: 'pitfalls',
      title: 'Типичные ошибки и память',
      estimatedMinutes: 5,
      blocks: [
        { type: 'heading', content: 'Забытый обработчик error' },
        {
          type: 'code',
          language: 'javascript',
          content: `// ❌ Если файла нет — событие 'error' без подписчика → throw → крах процесса.
const stream = fs.createReadStream('missing.txt');
stream.pipe(process.stdout);

// ✅ Минимально допустимое:
stream.on('error', (err) => console.error(err.message));

// ✅ Лучше — pipeline:
await pipeline(fs.createReadStream('missing.txt'), process.stdout);
// catch на try поймает ошибку, всё закроется.`,
        },
        { type: 'heading', content: 'readFileSync на больших файлах' },
        {
          type: 'code',
          language: 'javascript',
          content: `// ❌ Файл 2 ГБ → попытка разместить его в куче V8 → OOM.
const data = fs.readFileSync('huge.json');
const parsed = JSON.parse(data);

// ✅ Потоковый JSON-парсер для массива:
const { parser } = require('stream-json');
const { streamArray } = require('stream-json/streamers/StreamArray');

await pipeline(
  fs.createReadStream('huge.json'),
  parser(),
  streamArray(),
  async function* (source) {
    for await (const { value } of source) {
      processItem(value);              // O(1) памяти на элемент
      yield JSON.stringify(value) + '\\n';
    }
  },
  fs.createWriteStream('processed.ndjson'),
);`,
        },
        { type: 'heading', content: 'Смешивание on("data") и for await' },
        {
          type: 'code',
          language: 'javascript',
          content: `// ❌ Подписка на 'data' переводит стрим в flowing mode,
// for await ниже теряет уже прочитанные чанки.
stream.on('data', (chunk) => log(chunk));
for await (const chunk of stream) { /* пропустим часть данных */ }

// ✅ Выберите ОДИН способ потребления.`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Стрим — это однопроходная сущность. Один раз прочитан — всё. Если данные нужны несколько раз, либо буферизуйте (для маленьких объёмов), либо открывайте новый стрим из источника.',
        },
      ],
      checkpoint: [Q['nodes-q11']!],
      docsLink: { url: 'https://metanit.com/web/nodejs/11.1.php', title: 'Потоки (Streams) — metanit.com' },
    },
  ],

  // Все вопросы из старого квиза, кроме тех, что ушли в checkpoint.
  finalQuiz: nodeStreamsQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  // Реюзаем существующие карточки и добавляем новые.
  flashcards: [...nodeStreamsFlashcards.cards, ...extraFlashcards],

  cheatsheet: `### Шпаргалка по Node.js Streams

- **4 типа**: Readable (источник), Writable (приёмник), Duplex (TCP-сокет), Transform (gzip, шифрование).
- Все стримы — \`EventEmitter\`. Событие \`error\` без подписчика → крах процесса.
- **Backpressure**: \`writable.write()\` → \`false\` ⇒ \`readable.pause()\`; событие \`drain\` ⇒ \`readable.resume()\`.
- \`pipe\` **не пробрасывает ошибки** и оставляет дескрипторы. Используйте \`stream/promises\` \`pipeline\`.
- \`pipeline\` принимает async generator-функции прямо в цепочке — Transform-класс не нужен для простых случаев.
- \`Readable.from(asyncIterable)\` — превращает любой iterable/async-iterable в Readable.
- \`for await (chunk of stream)\` ⇒ при \`break\`/\`throw\` стрим уничтожается автоматически.
- \`highWaterMark\`: 16 КБ для байтовых стримов, 16 объектов для \`objectMode\`.
- На больших файлах **никогда** не используйте \`fs.readFile\`/\`readFileSync\` — только стримы.`,

  interviewQA: [
    {
      id: 'nodes-iq1',
      question: 'Опишите четыре типа стримов в Node.js. Приведите пример каждого из стандартной библиотеки.',
      shortAnswer:
        'Readable (источник, fs.createReadStream), Writable (приёмник, fs.createWriteStream / http.ServerResponse), Duplex (две независимые стороны, net.Socket), Transform (Duplex с зависимостью выхода от входа, zlib.createGzip).',
      fullAnswer: `В Node.js есть четыре класса стримов, все они наследуются от \`EventEmitter\` и определены в модуле \`stream\`:

1. **Readable** — стрим, из которого читают. Чанки появляются в нём извне (диск, сеть, генератор) и потребитель забирает их через \`on('data')\`, \`read()\` или \`for await\`. Примеры: \`fs.createReadStream(path)\`, \`http.IncomingMessage\` (req на сервере, res на клиенте), \`process.stdin\`.

2. **Writable** — стрим, в который пишут. У него есть \`write(chunk)\`, \`end()\` и события \`drain\`/\`finish\`. Примеры: \`fs.createWriteStream(path)\`, \`http.ServerResponse\`, \`process.stdout\`.

3. **Duplex** — два независимых канала чтения и записи. Данные, которые вы пишете, не появляются на стороне чтения автоматически. Канонический пример — \`net.Socket\`: вы пишете в сокет HTTP-запрос, а на стороне чтения получаете HTTP-ответ — это разные данные, идущие в разные стороны по сети.

4. **Transform** — частный случай Duplex, где выход вычисляется из входа. Это «фильтр» в цепочке. Примеры: \`zlib.createGzip()\`, \`crypto.createCipheriv()\`, любой ваш парсер CSV/NDJSON. Реализуется через метод \`_transform(chunk, encoding, cb)\`.

Иерархия: Transform ⊂ Duplex ⊂ (Readable + Writable).`,
      followUps: [
        'Почему net.Socket — Duplex, а не Transform?',
        'Какой метод обязательно нужно реализовать в подклассе Readable, и какой — в Writable?',
      ],
      relatedChapterId: 'four-types',
    },
    {
      id: 'nodes-iq2',
      question: 'Что такое backpressure? Что произойдёт, если читать из Readable быстрее, чем писать в Writable?',
      shortAnswer:
        'Backpressure — механизм согласования скоростей между источником и приёмником. Если игнорировать его, данные копятся во внутреннем буфере Writable и съедают всю память. Признак: writable.write() вернёт false. Реакция: readable.pause() до события drain.',
      fullAnswer: `Если данные читаются быстрее, чем записываются, они начинают накапливаться в **внутреннем буфере Writable**. Этот буфер находится в куче V8 и никак не ограничен сверху по умолчанию — теоретически он растёт, пока процессу не придёт OOM-killer.

API сообщает о backpressure через возвращаемое значение \`writable.write(chunk)\`:
- \`true\` — буфер ниже \`highWaterMark\`, можно писать дальше.
- \`false\` — буфер заполнился до \`highWaterMark\` (по умолчанию 16 КБ). Это сигнал «остановись».

Корректная ручная обработка:

\`\`\`js
readable.on('data', (chunk) => {
  if (!writable.write(chunk)) readable.pause();
});
writable.on('drain', () => readable.resume());
readable.on('end', () => writable.end());
\`\`\`

На практике этот код почти никогда не пишут вручную — слишком легко забыть один из трёх обработчиков и получить либо утечку памяти, либо «зависший» стрим. Вместо этого используют \`pipeline\` или \`pipe\`, которые делают всё это автоматически.

Итого: при игнорировании backpressure вы получите рост RSS-памяти процесса, постепенное замедление GC и в конце — крах с \`JavaScript heap out of memory\`.`,
      followUps: [
        'Как backpressure связана с TCP zero-window и почему это «та же идея» на сетевом уровне?',
        'Что произойдёт с памятью, если не подписаться на drain после первого write → false?',
      ],
      relatedChapterId: 'backpressure',
    },
    {
      id: 'nodes-iq3',
      question: 'Чем pipeline лучше pipe?',
      shortAnswer:
        'pipeline корректно пробрасывает ошибки, вызывает destroy() на всех стримах при сбое (нет утечки дескрипторов), возвращает Promise (в stream/promises) и поддерживает AbortSignal. pipe не делает ничего из этого — ошибки молча теряются.',
      fullAnswer: `\`pipe\` — старый API из Node.js 0.x. У него два конкретных недостатка:

1. **Ошибки не пробрасываются.** Если в одном из стримов в середине цепочки эмитится \`error\`, остальные стримы остаются открытыми. На production это значит, что один сбойный запрос постепенно «съедает» лимит файловых дескрипторов процесса.

2. **Нужно вешать .on('error') на каждый стрим.** Цепочка из трёх стримов превращается в полтора десятка строк boilerplate, и любой пропуск приводит к крашу.

\`stream.pipeline(...streams, callback)\` (Node 10+) и его promise-вариант \`require('stream/promises').pipeline\` (Node 15+) решают оба пункта:

- При **любой** ошибке в **любом** стриме автоматически вызывается \`stream.destroy()\` на всех остальных.
- Возвращает Promise (в promise-варианте) — оборачивается в try/catch.
- Поддерживает \`AbortSignal\`: \`pipeline(...streams, { signal: controller.signal })\` — \`controller.abort()\` корректно останавливает цепочку.
- В современных версиях принимает **async generator-функции** прямо в середине, без обёртки в Transform-класс.

\`\`\`js
const { pipeline } = require('stream/promises');
await pipeline(
  fs.createReadStream(input),
  async function* (src) {
    for await (const chunk of src) yield chunk.toString().toUpperCase();
  },
  fs.createWriteStream(output),
  { signal },
);
\`\`\`

Правило: в новом коде \`pipe\` использовать не нужно. Только \`pipeline\` или (для очень специфических случаев) ручное управление с \`.on('error')\` на каждом стриме.`,
      followUps: [
        'Что именно делает destroy() на Readable и на Writable?',
        'Как реализовать таймаут на pipeline через AbortController?',
      ],
      relatedChapterId: 'pipe-vs-pipeline',
    },
    {
      id: 'nodes-iq4',
      question: 'Когда использовать Transform-стрим вместо обычной обработки массива через map/filter?',
      shortAnswer:
        'Transform нужен, когда данные приходят кусками во времени и не помещаются в память: большие файлы, проксирование HTTP, gzip на лету. map/filter синхронны и требуют весь массив в куче. Эвристика: если объём данных может превысить ~10% RAM процесса — стримы.',
      fullAnswer: `\`Array.prototype.map\`/\`filter\` — это **синхронные** методы над уже существующим массивом. Они требуют, чтобы все данные одновременно находились в памяти, и работают с задержкой O(n) сразу для всего массива.

Transform-стрим нужен в трёх случаях:

1. **Размер данных непредсказуем или больше памяти.** Лог-файл может быть 10 МБ или 10 ГБ — кода это не должно касаться. Stream + pipeline работают с O(highWaterMark) памяти независимо от объёма.

2. **Данные приходят постепенно во времени.** HTTP-запрос — это стрим: байты прибывают по сети в течение секунд, и нет смысла ждать конца, чтобы начать обработку (например, проксировать в другой сервис).

3. **Несколько преобразований стыкуются в pipeline.** Чтение → парсинг JSON → фильтр → сериализация → gzip → запись в файл — каждый шаг видит чанк, отдаёт результат дальше, нигде не материализуется весь датасет.

Когда **не** стоит:
- Данные уже в массиве в памяти и помещаются туда комфортно.
- Преобразование требует знать весь массив сразу (сортировка, медиана, JOIN без ключа).
- Нагрузка одноразовая, читаемость кода важнее: \`array.map().filter()\` понятнее чем \`pipeline + Transform\`.

Современный компромисс — async generator. Он читается почти как обычная функция, но работает потоково и стыкуется с pipeline.`,
      followUps: [
        'Можно ли в Transform-стриме сделать сортировку, и почему обычно это плохая идея?',
        'Чем async generator выигрывает у класса-наследника Transform по читаемости?',
      ],
      relatedChapterId: 'custom-transform',
    },
    {
      id: 'nodes-iq5',
      question: 'Как прочитать 10 ГБ файл в Node.js, не получив OOM?',
      shortAnswer:
        'Только стримами. fs.createReadStream даёт чанки по highWaterMark (16 КБ по умолчанию), Transform/async generator обрабатывает их по одному, fs.createWriteStream пишет результат. Память — O(highWaterMark), независимо от размера файла. fs.readFile/readFileSync на таких размерах гарантированно крашат процесс.',
      fullAnswer: `Канонический ответ — \`pipeline\` из \`stream/promises\` плюс потоковый парсер для формата:

\`\`\`js
const { pipeline } = require('stream/promises');
const fs = require('fs');
const zlib = require('zlib');

await pipeline(
  fs.createReadStream('huge.log'),     // O(16KB)
  zlib.createGunzip(),                  // O(окно сжатия)
  async function* (source) {            // потоковая обработка
    source.setEncoding('utf8');
    let tail = '';
    for await (const chunk of source) {
      const lines = (tail + chunk).split('\\n');
      tail = lines.pop();              // неполная строка на конце
      for (const line of lines) {
        if (line.includes('ERROR')) yield line + '\\n';
      }
    }
    if (tail) yield tail;
  },
  fs.createWriteStream('errors.log'),
);
\`\`\`

Что **нельзя**:

- \`fs.readFileSync('huge.log')\` — попытка разместить весь файл в куче V8 (лимит по умолчанию ~4 ГБ для 64-bit, меньше с \`--max-old-space-size\`).
- \`fs.readFile('huge.log', cb)\` — асинхронный, но всё равно весь файл в памяти.
- \`fs.readFileSync().split('\\n').forEach(...)\` — двойной OOM: сам файл + массив строк.

Что нужно помнить:
- Чанк может **разрезать** многобайтовый UTF-8 символ или строку — обрабатывайте «хвост» между чанками.
- \`pipeline\` корректно закрывает все стримы при ошибке.
- Для JSON используйте потоковый парсер (например, \`stream-json\`), а не \`JSON.parse\` поверх собранного буфера.`,
      followUps: [
        'Как корректно обработать BOM и неполные UTF-8 последовательности в потоке?',
        'Чем stream-json отличается от обычного JSON.parse и когда им пользоваться?',
      ],
      relatedChapterId: 'pitfalls',
    },
    {
      id: 'nodes-iq6',
      question: 'Что выведет код с push в Readable и подпиской на data, и почему?',
      shortAnswer:
        'push в flowing-режиме (когда есть подписчик на "data") синхронно эмитит "data". Поэтому "chunk: ..." выводится до строки после последнего push. Многие ожидают асинхронный порядок — это типовая ловушка собеседования.',
      fullAnswer: `Рассмотрим код:

\`\`\`js
const { Readable } = require('stream');
const r = new Readable({ read() {} });

r.on('data', (chunk) => console.log('chunk:', chunk.toString()));

r.push('hello');
r.push(' world');
r.push(null);
console.log('after push');
\`\`\`

Вывод: \`chunk: hello\` → \`chunk:  world\` → \`after push\`.

Причина: подписка на событие \`data\` переводит Readable в **flowing mode**. В этом режиме каждый \`push(chunk)\` синхронно вызывает \`emit('data', chunk)\` — обработчик отрабатывает в текущем стеке, до возврата управления из \`push\`.

Это часто удивляет, потому что:
- В paused-режиме (без подписки на \`data\`) данные сидят в буфере и забираются через \`read()\`.
- Многие ассоциируют стримы с асинхронностью и ждут \`setImmediate\` или микрозадачу между \`push\` и \`emit\`.

\`push(null)\` сигнализирует EOF. После него \`r.push(...)\` бросит ошибку, а стрим эмитит событие \`end\` (но \`end\` асинхронен — он отрабатывает после опустошения буфера, на следующей итерации цикла).

На собеседовании этот вопрос проверяет понимание flowing/paused режимов и того, что \`emit\` в Node.js — синхронный.`,
      followUps: [
        'В чём разница между flowing mode и paused mode у Readable?',
        'Что произойдёт, если push сделать без подписки на data?',
      ],
      relatedChapterId: 'four-types',
    },
    {
      id: 'nodes-iq7',
      question: 'Что такое objectMode и зачем он нужен?',
      shortAnswer:
        'objectMode позволяет передавать через стрим произвольные JS-объекты вместо Buffer/String. Используется для пайплайнов, где важна структура: курсор БД → enrich → сериализация в CSV. highWaterMark в objectMode меряется в количестве объектов, а не в байтах.',
      fullAnswer: `По умолчанию стримы работают только с \`Buffer\` или \`string\`. Это правильно для байтовых потоков (файлы, сеть), но неудобно, когда вы строите пайплайн над **структурированными записями**: строками БД, событиями, JSON-объектами.

\`{ objectMode: true }\` снимает это ограничение: \`push\`/\`write\` принимают любой JS-объект, и в \`for await\` приходят те же объекты без сериализации.

\`\`\`js
const { Transform } = require('stream');

const enrich = new Transform({
  objectMode: true,
  transform(row, _encoding, cb) {
    this.push({ ...row, fullName: \`\${row.first} \${row.last}\` });
    cb();
  },
});

await pipeline(
  dbCursor(),                      // Readable, objectMode: true
  enrich,                          // Transform, objectMode: true
  csvSerializer(),                 // Transform, objectMode → string
  fs.createWriteStream('out.csv'), // Writable, байтовый
);
\`\`\`

Особенности:

- \`highWaterMark\` в objectMode меряется в **объектах**, а не байтах. Дефолт — 16. Если объекты тяжёлые, имеет смысл уменьшить его до 1–4.
- На стыке objectMode-стрима и байтового стрима нужен сериализующий Transform — иначе TypeError при попытке записать объект.
- \`Readable.from(iterable)\` по умолчанию создаёт стрим в objectMode, если в итерируемом не Buffer/string.

Это основа для большинства ETL-пайплайнов на Node.`,
      followUps: [
        'Как сериализовать поток объектов в NDJSON через Transform?',
        'Почему дефолтный highWaterMark в objectMode = 16, а в байтовом — 16384?',
      ],
      relatedChapterId: 'patterns',
    },
  ],

  nextTopics: [
    { slug: 'node-network', reason: 'HTTP-запросы и ответы — это стримы. Backpressure, обработка ошибок и graceful shutdown сервера прямо опираются на материал этого урока.' },
    { slug: 'node-optimization', reason: 'Стримы — основной инструмент оптимизации памяти. Дальше — батчинг, LRU-кэш, пул соединений и другие техники.' },
  ],

  related: [
    { kind: 'pattern', id: 'pipeline', label: 'Паттерн: pipeline-обработка данных без полной материализации' },
  ],
};
