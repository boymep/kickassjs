import type { TopicTheory } from '../../types/topic';

export const nodeStreamsTheory: TopicTheory = {
  topicId: 'node-streams',
  sections: [
    {
      title: 'Типы стримов в Node.js',
      blocks: [
        {
          type: 'text',
          content:
            'Стримы (Streams) — один из фундаментальных паттернов Node.js. Они позволяют работать с данными **по частям (chunk by chunk)**, не загружая весь файл или ответ в память. Идеально для больших файлов, HTTP-запросов, сжатия.',
        },
        {
          type: 'list',
          content:
            '**Readable** — источник данных: `fs.createReadStream()`, `http.IncomingMessage`, `process.stdin`.\n**Writable** — приёмник данных: `fs.createWriteStream()`, `http.ServerResponse`, `process.stdout`.\n**Duplex** — одновременно Readable и Writable: TCP-сокет (`net.Socket`).\n**Transform** — Duplex, который преобразует данные: `zlib.createGzip()`, `crypto.createCipher()`.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const fs = require('fs');
const zlib = require('zlib');

// Читать файл → сжать → записать
// Без стримов: загрузить весь файл в память (проблема для 10GB)
// Со стримами: обрабатываем по чанкам

const readStream = fs.createReadStream('big-file.txt');
const gzip = zlib.createGzip(); // Transform
const writeStream = fs.createWriteStream('big-file.txt.gz');

readStream.pipe(gzip).pipe(writeStream);

writeStream.on('finish', () => console.log('Done!'));
writeStream.on('error', console.error);`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Readable stream в двух режимах:
const { Readable } = require('stream');

// 1. Flowing mode (data events):
readStream.on('data', (chunk) => {
  console.log('chunk:', chunk.length, 'bytes');
});
readStream.on('end', () => console.log('all data read'));

// 2. Paused mode (pull модель):
readStream.on('readable', () => {
  let chunk;
  while (null !== (chunk = readStream.read(1024))) {
    console.log('chunk:', chunk);
  }
});`,
        },
      ],
    },
    {
      title: 'pipe, pipeline и обработка ошибок',
      blocks: [
        {
          type: 'text',
          content:
            '`pipe` соединяет стримы и управляет backpressure автоматически. Но `pipe` **не передаёт ошибки** по цепочке — нужно вешать `on("error")` на каждый стрим. `pipeline` (Node.js 10+) решает эту проблему.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const { pipeline } = require('stream/promises'); // Node.js 15+
const fs = require('fs');
const zlib = require('zlib');

// ❌ pipe — ошибки не пробрасываются:
fs.createReadStream('input.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('output.gz'));
// Если input.txt не существует — утечка ресурсов!

// ✅ pipeline — автоматически очищает все стримы при ошибке:
async function compress() {
  try {
    await pipeline(
      fs.createReadStream('input.txt'),
      zlib.createGzip(),
      fs.createWriteStream('output.gz'),
    );
    console.log('Compressed successfully');
  } catch (err) {
    console.error('Pipeline failed:', err.message);
  }
}`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            '**Backpressure**: если Writable обрабатывает данные медленнее, чем Readable их поставляет, данные накапливаются в памяти. `pipe`/`pipeline` автоматически вызывают `pause()` на Readable когда `write()` возвращает `false`. При ручном `write` проверяйте возвращаемое значение!',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Ручное управление backpressure:
readable.on('data', (chunk) => {
  const canContinue = writable.write(chunk);
  if (!canContinue) {
    readable.pause(); // ⏸ ждём пока writable освободится
  }
});

writable.on('drain', () => {
  readable.resume(); // ▶️ writable готов принять ещё данные
});`,
        },
      ],
    },
    {
      title: 'Создание кастомных стримов',
      blocks: [
        {
          type: 'code',
          language: 'javascript',
          content: `const { Transform } = require('stream');

// Transform stream — преобразует чанки:
class UpperCaseTransform extends Transform {
  _transform(chunk, encoding, callback) {
    // chunk — Buffer или String
    this.push(chunk.toString().toUpperCase());
    callback(); // сигнал: готов к следующему чанку
  }

  _flush(callback) {
    // Вызывается когда все данные обработаны (опционально):
    this.push('\\n[END]\\n');
    callback();
  }
}

// Использование:
process.stdin
  .pipe(new UpperCaseTransform())
  .pipe(process.stdout);`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const { Readable, Writable } = require('stream');

// Readable — генерация данных по требованию:
class CounterStream extends Readable {
  constructor(max) {
    super({ objectMode: true }); // можно пушить объекты!
    this.max = max;
    this.current = 0;
  }

  _read() {
    if (this.current < this.max) {
      this.push({ value: this.current++ });
    } else {
      this.push(null); // null = конец стрима
    }
  }
}

// Async generators как Readable (Node.js 12+):
const { Readable: R } = require('stream');

async function* generateNumbers(n) {
  for (let i = 0; i < n; i++) {
    await new Promise((r) => setTimeout(r, 10));
    yield i;
  }
}

const stream = R.from(generateNumbers(5));
for await (const num of stream) {
  console.log(num); // 0 1 2 3 4
}`,
        },
      ],
    },
    {
      title: 'Практические паттерны',
      blocks: [
        {
          type: 'code',
          language: 'javascript',
          content: `// 1. Чтение файла построчно:
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: fs.createReadStream('data.csv'),
});

for await (const line of rl) {
  const [name, score] = line.split(',');
  console.log(name, score);
}

// 2. Stream → Buffer (когда нужен полный контент):
async function streamToBuffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

// 3. HTTP response как стрим:
const https = require('https');
https.get('https://example.com', (res) => {
  let data = '';
  res.setEncoding('utf8');
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => console.log(data));
});`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            '**objectMode**: по умолчанию стримы работают с Buffer/String. `{ objectMode: true }` позволяет передавать любые JS-объекты. Используется для стримов баз данных, парсинга JSON, трансформации записей.',
        },
      ],
    },
    {
      title: 'Хитрые кейсы и производительность',
      blocks: [
        {
          type: 'heading',
          content: 'highWaterMark — тюнинг буфера',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// highWaterMark — размер внутреннего буфера стрима
// По умолчанию: 16KB для Readable/Writable, 16 для objectMode

const readStream = fs.createReadStream('file.txt', {
  highWaterMark: 64 * 1024, // 64KB — больше чанки, меньше syscalls
});

const gzip = zlib.createGzip({
  // Нет highWaterMark напрямую, но внутри это Transform
});

// Меньший highWaterMark = меньше памяти, больше I/O операций
// Больший highWaterMark = эффективнее I/O, больше памяти

// Для objectMode: highWaterMark = количество объектов (не байт!)
const dbStream = new Readable({
  objectMode: true,
  highWaterMark: 50, // буферизует до 50 объектов
  read() {}
});`,
        },
        {
          type: 'heading',
          content: 'Ошибка: забыть обработать событие error',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// ❌ Необработанная ошибка стрима → crash!
const stream = fs.createReadStream('missing.txt');
stream.pipe(process.stdout);
// Error: ENOENT: no such file → unhandled error → process.exit(1)!

// ✅ Всегда обрабатывайте error:
stream.on('error', (err) => {
  console.error('Stream error:', err.message);
});

// ✅ Или используйте pipeline (обрабатывает автоматически):
const { pipeline } = require('stream/promises');
try {
  await pipeline(
    fs.createReadStream('missing.txt'),
    process.stdout
  );
} catch (err) {
  console.error('Pipeline error:', err.message);
  // Все стримы автоматически очищены и закрыты
}`,
        },
        {
          type: 'heading',
          content: 'Streaming JSON: парсинг большого JSON-файла',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Проблема: JSON.parse(fs.readFileSync('10gb.json')) → crash OOM
// Решение: streaming JSON parser (библиотека stream-json)

const { parser } = require('stream-json');
const { streamArray } = require('stream-json/streamers/StreamArray');

fs.createReadStream('large-array.json')
  .pipe(parser())
  .pipe(streamArray())
  .on('data', ({ key, value }) => {
    // Обрабатываем каждый элемент массива по одному
    processItem(value);
  })
  .on('end', () => console.log('Done'));

// Память: O(1 item) вместо O(весь файл)
// Для файлов > 100MB это критично`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Частая ошибка на собеседованиях: "как прочитать 10GB файл в Node.js?" — ответ всегда стримы. `fs.readFileSync` или даже `fs.readFile` для больших файлов = OOM crash. Streams + pipeline = правильный подход.',
        },
      ],
    },
  ],
};
