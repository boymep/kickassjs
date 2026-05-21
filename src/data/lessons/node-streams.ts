import type { Lesson } from '../../types/lesson';
import { nodeStreamsQuiz } from '../quizzes/node-streams';

const Q = Object.fromEntries(nodeStreamsQuiz.questions.map((q) => [q.id, q]));

const CHECKPOINT_IDS = new Set(['nodes-q1', 'nodes-q3', 'nodes-q7', 'nodes-q11']);

export const nodeStreamsLesson: Lesson = {
  topicId: 'node-streams',

  intro: {
    whyItMatters: `Streams — основной API Node.js для работы с большими объёмами данных. Файл на 10 GB нельзя прочитать целиком в память, но можно обработать построчно через \`createReadStream\`. HTTP-ответ, чтение из БД, обработка CSV, gzip-компрессия — везде стримы.

На собеседовании по Node.js проверяют четыре типа стримов (Readable, Writable, Duplex, Transform), понимание backpressure, разницу между \`pipe\` и \`pipeline\`, и умение писать собственный Transform.`,
    estimatedMinutes: 26,
    interviewAngle:
      'Интервьюера интересуют backpressure, как \`pipeline\` отличается от \`pipe\`, что произойдёт без него при ошибке, и как реализовать кастомный Transform с правильной обработкой objectMode.',
    prerequisites: [{ slug: 'node-event-loop', title: 'Event loop в Node.js' }],
  },

  chapters: [
    // ─────────────────────────────────────────────────────────────
    {
      id: 'four-types',
      title: 'Четыре типа стримов',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'В Node.js четыре базовых типа стримов. У каждого своя роль и свой набор событий.',
        },
        {
          type: 'list',
          content: `**Readable** — источник данных: \`fs.createReadStream\`, HTTP-запрос на сервере, \`stdin\`. События: \`data\`, \`end\`, \`error\`.
**Writable** — приёмник данных: \`fs.createWriteStream\`, HTTP-ответ, \`stdout\`. Методы: \`write\`, \`end\`.
**Duplex** — и читает, и пишет независимо: TCP-сокет.
**Transform** — Duplex, который преобразует данные «на лету»: \`zlib.createGzip\`, \`crypto.createCipher\`.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const fs = require('node:fs');

const readable = fs.createReadStream('input.txt', { encoding: 'utf8' });
const writable = fs.createWriteStream('output.txt');

readable.on('data', (chunk) => {
  writable.write(chunk);
});
readable.on('end', () => writable.end());`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'У стримов два режима: **buffer mode** (\`Buffer\` или строки) и **object mode** (произвольные JS-объекты). Object mode включается опцией \`objectMode: true\` и нужен для конвейеров обработки данных — например, парсинг JSON по строкам и далее запись в БД.',
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
            '**Backpressure** — механизм согласования скорости источника и приёмника. Если читать из быстрого файла и писать в медленную сеть, без backpressure данные накопятся в памяти и исчерпают всю доступную RAM. Стримы решают это автоматически: \`writable.write(chunk)\` возвращает \`false\`, когда внутренний буфер заполнен (свыше \`highWaterMark\`).',
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
            'На практике вручную backpressure пишется редко — \`pipe\` и \`pipeline\` делают это автоматически. Понимать механизм нужно, чтобы диагностировать утечки памяти и латенси в кастомных Transform.',
        },
        { type: 'heading', content: 'highWaterMark' },
        {
          type: 'text',
          content:
            '\`highWaterMark\` — порог буфера, при превышении которого Writable перестаёт принимать новые \`write\`. По умолчанию 16 KB для buffer-режима, 16 объектов для object-режима. Уменьшение порога даёт более плавный backpressure и меньшее пиковое потребление памяти, но больше переключений контекста.',
        },
      ],
      checkpoint: [Q['nodes-q3']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'pipe-vs-pipeline',
      title: 'pipe и pipeline',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            '\`stream.pipe(dest)\` — простой способ перенаправить данные. Решает backpressure автоматически. Минус: при ошибке в одной из стадий другие стримы не закрываются — это утечка дескрипторов файлов и сокетов.',
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
        { type: 'heading', content: 'pipeline — современная замена' },
        {
          type: 'text',
          content:
            '\`stream.pipeline\` корректно закрывает все стримы при ошибке и предоставляет коллбэк или промис с результатом. Стандартный способ работы со стримами в современном коде.',
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
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            '\`pipe\` не подходит для боевого кода с несколькими стадиями без обработки ошибок. \`pipeline\` гарантирует закрытие всех стримов даже при сбое в середине.',
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
            'Transform — стрим, который читает чанк и записывает преобразованный результат. Реализуется через подкласс \`Transform\` или \`Transform.from\`. Реализуется \`_transform(chunk, encoding, callback)\` и опционально \`_flush(callback)\` для финальной порции.',
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
            '\`pipeline\` принимает не только стримы, но и async-генераторы — это удобный способ вставить произвольную логику без подкласса \`Transform\`.',
        },
        { type: 'heading', content: 'Object mode' },
        {
          type: 'text',
          content:
            'Если Transform читает буфер, а выдаёт объекты — \`readableObjectMode: true\`. Если читает объекты — \`writableObjectMode: true\`. Если оба — \`objectMode: true\`. Без флага попытка передать объект через \`push\` приведёт к ошибке.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'patterns',
      title: 'Типовые применения',
      estimatedMinutes: 4,
      blocks: [
        { type: 'heading', content: 'Стриминг HTTP-ответа' },
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
        { type: 'heading', content: 'Парсинг больших CSV' },
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
        { type: 'heading', content: 'Async-итераторы' },
        {
          type: 'text',
          content:
            'Любой Readable-стрим — это async-итератор. Можно использовать \`for await\` без явной подписки на событие \`data\`. Это часто читаемее и проще обрабатывает ошибки.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `for await (const chunk of fs.createReadStream('file.txt')) {
  process(chunk);
}`,
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
            '\`pipe\` не пробрасывает ошибки между стримами. Если в gzip-Transform упало исключение, Readable остаётся открытым — файл не закроется, дескриптор утечёт. Решение — \`pipeline\` либо ручная подписка на \`error\` на каждом стриме.',
        },
        { type: 'heading', content: 'Смешивание режимов data и paused' },
        {
          type: 'text',
          content:
            'У Readable два режима: paused (по умолчанию) и flowing (после подписки на \`data\`). Если подписаться на \`data\`, потом вызвать \`pause()\` — стрим встанет; забыв \`resume()\`, обработка остановится навсегда.',
        },
        { type: 'heading', content: 'Запись в закрытый стрим' },
        {
          type: 'text',
          content:
            'Запись в Writable после \`end()\` бросает ошибку \`ERR_STREAM_WRITE_AFTER_END\`. Часто возникает при сложной асинхронной логике — ответ HTTP уже закрыт, а коллбэк продолжает писать. Защита — флаг \`writable.writableEnded\` перед \`write\`.',
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
- **Readable** — источник: \`fs.createReadStream\`, HTTP request
- **Writable** — приёмник: \`fs.createWriteStream\`, HTTP response
- **Duplex** — и читает, и пишет: TCP-сокет
- **Transform** — преобразование: \`zlib.createGzip\`, \`crypto.createCipher\`

**Backpressure**
- \`writable.write(chunk)\` → \`false\`, если буфер полный
- \`writable.once('drain')\` — сигнал «можно писать дальше»
- \`readable.pause()\` / \`readable.resume()\` — ручное управление
- \`pipe\` и \`pipeline\` решают это автоматически

**pipe vs pipeline**
- \`pipe\` — простой, но не закрывает стримы при ошибке
- \`pipeline\` — закрывает стримы при ошибке, async / await, принимает iterables
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
- Без флага \`push\` объекта бросает ошибку

**Async-итераторы**
\`\`\`js
for await (const chunk of readable) {
  process(chunk);
}
\`\`\`

**Подводные камни**
- \`pipe\` не закрывает стримы при ошибке — \`pipeline\`
- \`write\` после \`end\` бросает \`ERR_STREAM_WRITE_AFTER_END\`
- Игнорирование backpressure → утечка памяти
- \`highWaterMark\` контролирует размер внутреннего буфера`,

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
