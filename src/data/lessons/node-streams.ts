import type { Lesson } from '../../types/lesson';
import { nodeStreamsQuiz } from '../quizzes/node-streams';

const Q = Object.fromEntries(nodeStreamsQuiz.questions.map((q) => [q.id, q]));

const CHECKPOINT_IDS = new Set(['nodes-q1', 'nodes-q3', 'nodes-q7', 'nodes-q11']);

export const nodeStreamsLesson: Lesson = {
  topicId: 'node-streams',

  intro: {
    whyItMatters: `Streams — основной API Node.js для работы с большими объёмами данных. Файл размером 10 ГБ нельзя прочитать целиком в память, но можно обработать построчно через \`createReadStream\`. HTTP-ответ, чтение из БД, обработка CSV, gzip-компрессия — везде используются стримы.

Backpressure — механизм согласования скорости источника и приёмника. Понимание четырёх типов стримов, отличий \`pipe\` от \`pipeline\`, режимов paused/flowing и совместимости с Web Streams API позволяет писать конвейеры, которые корректно работают на любых объёмах данных и не текут по памяти при ошибках.`,
    estimatedMinutes: 28,
    interviewAngle:
      'Ключевые темы: четыре типа стримов (Readable, Writable, Duplex, Transform); backpressure и роль \`highWaterMark\`; различия \`pipe\` и \`pipeline\`, поведение при ошибке без \`pipeline\`; режимы paused/flowing и async-итераторы; реализация кастомного Transform с корректной обработкой \`objectMode\`; совместимость с Web Streams API.',
    prerequisites: [{ slug: 'node-event-loop', title: 'Event loop в Node.js' }],
  },

  chapters: [
    // ─────────────────────────────────────────────────────────────
    {
      id: 'four-types',
      title: 'Четыре типа стримов и режимы чтения',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'В Node.js четыре базовых типа стримов. У каждого своя роль и свой набор событий.',
        },
        {
          type: 'list',
          content: `Readable — источник данных: \`fs.createReadStream\`, HTTP-запрос на сервере, \`stdin\`. События: \`data\`, \`end\`, \`error\`, \`close\`.
Writable — приёмник данных: \`fs.createWriteStream\`, HTTP-ответ, \`stdout\`. Методы: \`write\`, \`end\`, \`destroy\`.
Duplex — и читает, и пишет независимо: TCP-сокет.
Transform — частный случай Duplex, в котором каждый входящий чанк преобразуется и поступает на выход: \`zlib.createGzip\`, \`crypto.createCipheriv\`.`,
        },
        { type: 'heading', content: 'Режимы paused и flowing' },
        {
          type: 'text',
          content:
            'Readable изначально находится в режиме not flowing: данные не читаются из источника, пока их никто не запросит. Стрим переходит в режим flowing после одного из трёх действий: подписка на событие \`data\`, вызов \`resume()\` или \`pipe()\` в Writable. Обратно — через \`pause()\`. В режиме flowing данные толкаются в обработчики автоматически; в paused — читаются явным \`read()\`.',
        },
        { type: 'heading', content: 'Async-итераторы — современный способ чтения' },
        {
          type: 'text',
          content:
            'Любой Readable-стрим реализует \`Symbol.asyncIterator\`, поэтому его можно обходить через \`for await...of\`. Ошибки внутри цикла попадают в обычный \`try / catch\`. Выход из цикла через \`break\` или исключение автоматически уничтожает стрим, освобождая ресурсы. Это, как правило, проще ручной работы с \`pause\` / \`resume\`.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const fs = require('node:fs');

for await (const chunk of fs.createReadStream('file.txt')) {
  process(chunk);
}`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'У стримов два формата данных: buffer mode (\`Buffer\` или строки) и object mode (произвольные JS-объекты). Object mode включается опцией \`objectMode: true\` и нужен для конвейеров обработки структурированных данных — например, парсинг JSON-строк и далее запись в БД. Для Transform можно задать формат раздельно: \`readableObjectMode\` и \`writableObjectMode\`.',
        },
      ],
      checkpoint: [Q['nodes-q1']!, {
        type: 'match-pairs',
        id: 'ns-mp1',
        description: 'Сопоставьте тип стрима с примером',
        pairs: [
          { left: 'Readable', right: 'fs.createReadStream' },
          { left: 'Writable', right: 'fs.createWriteStream' },
          { left: 'Duplex', right: 'TCP-сокет' },
          { left: 'Transform', right: 'zlib.createGzip' },
        ],
        explanation:
          'Transform — частный случай Duplex, где входной и выходной потоки связаны: данные на входе преобразуются и выдаются на выход. Это основная единица для построения pipelines.',
      }],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'backpressure',
      title: 'Backpressure',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Backpressure — механизм согласования скорости источника и приёмника. При чтении из быстрого файла и записи в медленную сеть без backpressure данные накапливаются в памяти и могут исчерпать всю доступную RAM. Стримы решают это автоматически: вызов \`writable.write(chunk)\` возвращает \`false\`, когда после записи объём в буфере достиг или превысил \`highWaterMark\`. Это сигнал «приостановить отправку до события \`drain\`»; данные всё ещё принимаются, но новые \`write\` приведут к ещё большему росту буфера.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Ручная обработка backpressure
readable.on('data', (chunk) => {
  const ok = writable.write(chunk);
  if (!ok) {
    readable.pause();
    writable.once('drain', () => readable.resume());
  }
});`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'На практике вручную backpressure пишется редко — \`pipe\`, \`pipeline\` и \`for await\` решают это автоматически. Понимание механизма необходимо для диагностики утечек памяти и роста задержек в кастомных Transform.',
        },
        { type: 'heading', content: 'highWaterMark' },
        {
          type: 'text',
          content:
            '\`highWaterMark\` — порог буфера, при превышении которого стрим перестаёт активно запрашивать или принимать данные. По умолчанию около 16 КБ для buffer-режима и 16 объектов для object-режима. У Writable это размер внутреннего буфера до сигнала \`drain\`; у Readable — лимит на количество данных, которое будет накоплено до приостановки чтения из источника. Уменьшение порога даёт более плавный backpressure и меньшее пиковое потребление памяти, но больше переключений контекста.',
        },
      ],
      checkpoint: [Q['nodes-q3']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'pipe-vs-pipeline',
      title: 'pipe, pipeline и stream.finished',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            '\`stream.pipe(dest)\` — простой способ перенаправить данные. Решает backpressure автоматически. Главный минус: \`pipe\` не подписывается на событие \`error\` целевого стрима и не разрушает источник при ошибке приёмника. При сбое в середине конвейера остальные стримы остаются открытыми — это утечка дескрипторов файлов и сокетов.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// pipe — простой, но без авто-cleanup при ошибке
const { createReadStream, createWriteStream } = require('node:fs');
const { createGzip } = require('node:zlib');

createReadStream('input.txt')
  .pipe(createGzip())
  .pipe(createWriteStream('output.gz'));

// Если ошибка в gzip — input и output останутся открытыми`,
        },
        { type: 'heading', content: 'pipeline — рекомендуемая замена pipe' },
        {
          type: 'text',
          content:
            '\`stream.pipeline\` корректно закрывает все стримы при ошибке и предоставляет коллбэк или промис с результатом. Это стандартный способ построения конвейеров в современном коде.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const { pipeline } = require('node:stream/promises');
const { createReadStream, createWriteStream } = require('node:fs');
const { createGzip } = require('node:zlib');

async function compress(input, output) {
  await pipeline(
    createReadStream(input),
    createGzip(),
    createWriteStream(output),
  );
}`,
        },
        { type: 'heading', content: 'stream.finished — ожидание одного стрима' },
        {
          type: 'text',
          content:
            '\`stream.finished\` — современный способ дождаться завершения одиночного стрима и гарантированно выполнить cleanup. По сути, это аналог \`pipeline\`, но для одного стрима. Возвращает промис в варианте \`node:stream/promises\`.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const { finished } = require('node:stream/promises');

const rs = createReadStream('huge.log');
rs.on('data', process);
await finished(rs); // ждёт end или ошибку, освобождает ресурсы`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Конструктор \`createCipher\` из \`node:crypto\` устарел с Node 10. Современный аналог — \`createCipheriv(algorithm, key, iv)\`. В новом коде используется именно он.',
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Метод \`destroy(err)\` уничтожает стрим: испускает \`error\` (если err передан) и \`close\`. Это отличается от \`end()\`, который штатно завершает Writable и не разрушает связанные стримы. \`pipeline\` использует \`destroy\` под капотом, чтобы закрыть все стримы конвейера при сбое.',
        },
      ],
      checkpoint: [Q['nodes-q7']!, {
        type: 'multi-select',
        id: 'ns-ms1',
        description: 'Какие преимущества у \`pipeline\` перед \`pipe\`?',
        options: [
          'Автоматически закрывает все стримы при ошибке',
          'Возвращает промис (или принимает callback)',
          'Решает backpressure (это делает и pipe)',
          'Гарантирует порядок завершения стримов',
          'Поддерживает async-итераторы как одно из звеньев',
        ],
        correctIndices: [0, 1, 3, 4],
        explanation:
          'Backpressure решается обоими, но \`pipeline\` дополнительно гарантирует cleanup, упорядоченное завершение, удобный async-API и принимает iterables как звено конвейера.',
      }],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'custom-transform',
      title: 'Кастомный Transform',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Transform — стрим, который читает чанк, преобразует и записывает результат. Реализация — подкласс \`Transform\` с методом \`_transform(chunk, encoding, callback)\` и опциональным \`_flush(callback)\` для финальной порции данных, оставшихся в буфере. Параметр \`encoding\` указывает кодировку строкового чанка (например, \`utf8\`) — он не используется, если входной формат — \`Buffer\` или режим объектный.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const { Transform } = require('node:stream');

class LineSplitter extends Transform {
  constructor(options) {
    super({ ...options, readableObjectMode: true });
    this.buffer = '';
  }

  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString();
    const lines = this.buffer.split('\\n');
    this.buffer = lines.pop(); // последний — потенциально неполный
    for (const line of lines) this.push(line);
    callback();
  }

  _flush(callback) {
    if (this.buffer) this.push(this.buffer);
    callback();
  }
}`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            '\`pipeline\` принимает не только стримы, но и async-генераторы — это удобный способ вставить произвольную логику без подкласса \`Transform\`. В Node 19+ доступен \`stream.compose\`, который собирает массив стримов и генераторов в один Duplex-стрим, который можно встраивать в другие конвейеры.',
        },
        { type: 'heading', content: 'Object mode' },
        {
          type: 'text',
          content:
            'Если Transform читает буфер, а выдаёт объекты, используется \`readableObjectMode: true\`. Если читает объекты — \`writableObjectMode: true\`. Если оба — \`objectMode: true\`. Object mode отключает буферизацию по байтам и снимает проверку, что чанк является \`Buffer\` или строкой; \`push\` принимает любое значение. В \`LineSplitter\` выше \`push(line)\` пушит строки именно благодаря \`readableObjectMode\`.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'web-streams-and-readable-from',
      title: 'Readable.from, stream.compose и Web Streams',
      estimatedMinutes: 5,
      blocks: [
        { type: 'heading', content: 'Readable.from' },
        {
          type: 'text',
          content:
            '\`Readable.from(iterable)\` — фабрика, превращающая массив, генератор или async-итератор в Readable-стрим. Удобно для тестов и для встраивания произвольных источников в конвейеры \`pipeline\`.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const { Readable } = require('node:stream');

async function* lines() {
  yield 'one\\n';
  yield 'two\\n';
}

const src = Readable.from(lines());
await pipeline(src, fs.createWriteStream('out.txt'));`,
        },
        { type: 'heading', content: 'stream.compose' },
        {
          type: 'text',
          content:
            '\`stream.compose(...streams)\` (Node 19+) объединяет цепочку стримов и асинхронных функций в один Duplex-стрим. Получившийся объект можно подставлять в другие конвейеры или возвращать из библиотек как единый «фильтр».',
        },
        { type: 'heading', content: 'Web Streams API и интероп' },
        {
          type: 'text',
          content:
            'Параллельно с Node-стримами существует Web Streams API: \`ReadableStream\`, \`WritableStream\`, \`TransformStream\`. Это стандарт WHATWG, используемый в браузерах, в \`fetch\` и Service Worker. В Node.js они доступны как глобальные классы и используются, например, для тела ответа \`fetch\`.',
        },
        {
          type: 'text',
          content:
            'Для совместимости с уже написанным кодом в \`node:stream\` есть конвертеры: \`Readable.toWeb(readable)\` превращает Node-Readable в \`ReadableStream\`, \`Readable.fromWeb(rs)\` — обратно. Аналогичные пары есть для Writable и Duplex.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const { Readable } = require('node:stream');

// Тело ответа fetch — это ReadableStream (Web Streams)
const res = await fetch('https://example.com/large.json');
const nodeStream = Readable.fromWeb(res.body);

await pipeline(nodeStream, fs.createWriteStream('out.json'));`,
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'patterns',
      title: 'Типовые применения',
      estimatedMinutes: 4,
      blocks: [
        { type: 'heading', content: 'Передача HTTP-ответа потоком' },
        {
          type: 'code',
          language: 'javascript',
          content: `const http = require('node:http');
const fs = require('node:fs');
const { pipeline } = require('node:stream/promises');

http.createServer(async (req, res) => {
  try {
    await pipeline(
      fs.createReadStream('large-video.mp4'),
      res,
    );
  } catch (err) {
    res.statusCode = 500;
    res.end('error');
  }
}).listen(3000);`,
        },
        { type: 'heading', content: 'Обработка больших CSV-файлов' },
        {
          type: 'code',
          language: 'javascript',
          content: `const csv = require('csv-parse');

await pipeline(
  fs.createReadStream('huge.csv'),
  csv.parse({ columns: true }),
  async function* (records) {
    for await (const row of records) {
      yield JSON.stringify(row) + '\\n';
    }
  },
  fs.createWriteStream('out.jsonl'),
);`,
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'pitfalls',
      title: 'Подводные камни',
      estimatedMinutes: 4,
      blocks: [
        { type: 'heading', content: 'pipe без обработки ошибок' },
        {
          type: 'text',
          content:
            '\`pipe\` не пробрасывает ошибки между стримами. Если в gzip-Transform упало исключение, Readable остаётся открытым — файл не закроется, дескриптор будет висеть. Решение — \`pipeline\` либо ручная подписка на \`error\` на каждом стриме.',
        },
        { type: 'heading', content: 'Смешивание режимов flowing и paused' },
        {
          type: 'text',
          content:
            'Если подписаться на \`data\` (включив flowing), а потом вызвать \`pause()\`, стрим встанет; без \`resume()\` обработка не возобновится. Async-итераторы и \`pipeline\` снимают эту проблему — управление режимом происходит автоматически.',
        },
        { type: 'heading', content: 'Запись в закрытый стрим' },
        {
          type: 'text',
          content:
            'Запись в Writable после \`end()\` бросает ошибку \`ERR_STREAM_WRITE_AFTER_END\`. Часто возникает при сложной асинхронной логике — ответ HTTP уже закрыт, а коллбэк продолжает писать. Защита — проверка \`writable.writableEnded\` перед \`write\`.',
        },
        { type: 'heading', content: 'highWaterMark и память' },
        {
          type: 'text',
          content:
            'Если игнорировать backpressure, внутренний буфер Writable растёт неограниченно. На большом потоке это исчерпывает память. \`pipe\` и \`pipeline\` решают проблему автоматически; ручной \`write\` требует явного кода с \`drain\`.',
        },
      ],
      checkpoint: [Q['nodes-q11']!],
    },
  ],

  finalQuiz: nodeStreamsQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  cheatsheet: `### Шпаргалка по стримам Node.js

**Четыре типа**
- Readable — источник: \`fs.createReadStream\`, HTTP request
- Writable — приёмник: \`fs.createWriteStream\`, HTTP response
- Duplex — и читает, и пишет: TCP-сокет
- Transform — преобразование: \`zlib.createGzip\`, \`crypto.createCipheriv\`

**Режимы Readable**
- not flowing (изначально) → flowing после \`data\`, \`resume()\` или \`pipe()\`
- \`pause()\` возвращает в not flowing
- \`for await...of\` управляет режимом автоматически

**Backpressure**
- \`writable.write(chunk)\` → \`false\`, когда буфер достиг \`highWaterMark\` — сигнал «приостановить»
- \`writable.once('drain')\` — сигнал «можно писать дальше»
- \`pipe\`, \`pipeline\` и \`for await\` решают это автоматически

**pipe vs pipeline vs finished**
- \`pipe\` — простой, не закрывает стримы при ошибке
- \`pipeline\` — закрывает стримы при ошибке, async/await, принимает iterables
- \`stream.finished\` — дождаться завершения одного стрима с cleanup
- В production-коде — \`pipeline\`

**Кастомный Transform**
\`\`\`js
class MyTransform extends Transform {
  _transform(chunk, encoding, callback) {
    this.push(transform(chunk));
    callback();
  }
  _flush(callback) {
    if (this.tail) this.push(this.tail);
    callback();
  }
}
\`\`\`

**Object mode**
- \`readableObjectMode\`, \`writableObjectMode\`, или \`objectMode\` для обоих
- Снимает проверку Buffer/string, можно push любого значения

**Современные API**
- \`Readable.from(iterable)\` — массив или генератор → Readable
- \`stream.compose(...)\` — собрать конвейер в один Duplex (Node 19+)
- \`Readable.toWeb\` / \`fromWeb\` — мост к Web Streams API

**Подводные камни**
- \`pipe\` не закрывает стримы при ошибке — \`pipeline\`
- \`write\` после \`end\` → \`ERR_STREAM_WRITE_AFTER_END\`
- Игнорирование backpressure → утечка памяти
- \`createCipher\` устарел, использовать \`createCipheriv\``,

  nextTopics: [
    {
      slug: 'node-network',
      reason:
        'HTTP-сервер в Node — это работа со стримами: тело запроса и ответа. После стримов логично разобрать HTTP, роутинг и middleware.',
    },
    {
      slug: 'node-optimization',
      reason:
        'Кеширование, батчинг, circuit breaker — следующий шаг после понимания I/O-модели и стримов.',
    },
  ],
};
