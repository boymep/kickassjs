import type { TopicQuiz } from '../../types/quiz';

export const nodeStreamsQuiz: TopicQuiz = {
  topicId: 'node-streams',
  questions: [
    {
      type: 'output',
      id: 'nodes-q1',
      description: 'Стримы. Что выведет код?',
      code: `const { Readable } = require('stream');

const readable = new Readable({
  read() {}
});

readable.on('data', (chunk) => {
  console.log('chunk:', chunk.toString());
});

readable.push('hello');
readable.push(' world');
readable.push(null); // конец стрима
console.log('after push');`,
      options: [
        'chunk: hello, chunk:  world, after push',
        'after push, chunk: hello, chunk:  world',
        'chunk: hello world, after push',
        'after push (data events асинхронны)',
      ],
      correctIndex: 0,
      explanation: 'Подписка `on("data")` переводит стрим в **flowing mode**. В этом режиме `push()` немедленно вызывает обработчик **синхронно** — через `stream.emit("data", chunk)`. Поэтому "chunk: hello" и "chunk:  world" выводятся до `console.log("after push")`. `push(null)` сигнализирует конец стрима (вызывает событие "end").',
    },
    {
      type: 'fill-blank',
      id: 'nodes-q2',
      description: 'Заполните пропуск для безопасного соединения стримов.',
      codeWithBlanks: `const { ___BLANK___ } = require('stream/promises');
const fs = require('fs');
const zlib = require('zlib');

// Безопасная цепочка с обработкой ошибок:
await ___BLANK___(
  fs.createReadStream('input.txt'),
  zlib.createGzip(),
  fs.createWriteStream('output.gz'),
);`,
      options: ['pipeline', 'pipe', 'chain', 'connect'],
      correctIndex: 0,
      explanation: '`pipeline` из `stream/promises` (или `stream.pipeline` с callback) правильно обрабатывает ошибки и очищает все стримы при сбое. `pipe` не передаёт ошибки по цепочке — при ошибке destination стрим остаётся открытым, что ведёт к утечке ресурсов.',
    },
    {
      type: 'output',
      id: 'nodes-q3',
      description: 'Backpressure. Что означает `false` от `writable.write()`?',
      code: `const writable = getWritableStream();

const canWrite = writable.write('large chunk of data');
console.log(canWrite); // false

// Что делать дальше?`,
      options: [
        'Пауза! Подождать событие "drain" перед следующей записью',
        'Ошибка записи — данные потеряны',
        'Продолжать писать — false игнорируется',
        'Закрыть стрим',
      ],
      correctIndex: 0,
      explanation: '`write()` возвращает `false` когда внутренний буфер достиг highWaterMark — нужно остановить запись. После того как буфер освободится, стрим испускает событие `"drain"`. Это механизм backpressure. Игнорирование `false` приводит к избыточному потреблению памяти.',
    },
    {
      type: 'fill-blank',
      id: 'nodes-q4',
      description: 'Заполните пропуск для создания Transform стрима.',
      codeWithBlanks: `const { Transform } = require('stream');

class UpperCase extends Transform {
  ___BLANK___(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
}`,
      options: ['_transform', 'transform', 'process', '_process'],
      correctIndex: 0,
      explanation: '`_transform(chunk, encoding, callback)` — обязательный метод Transform стрима. Получает чанк, трансформирует его, пушит результат через `this.push()`. `callback()` вызывается когда готовы к следующему чанку. Дополнительно можно определить `_flush(callback)` для финализации.',
    },
    {
      type: 'output',
      id: 'nodes-q5',
      description: 'Что означает `push(null)` в Readable стриме?',
      code: `const { Readable } = require('stream');

const r = new Readable({ read() {} });

r.push('data1');
r.push('data2');
r.push(null); // ???

r.on('data', console.log);
r.on('end', () => console.log('END'));`,
      options: [
        'Сигнал конца стрима — после него "end" событие',
        'Пушит null значение в буфер',
        'Очищает буфер',
        'Вызывает ошибку',
      ],
      correctIndex: 0,
      explanation: '`push(null)` сигнализирует конец данных (EOF). После обработки всех данных стрим испускает событие `"end"`. Попытка `push` после `null` бросит ошибку. Это эквивалент EOF при чтении файла.',
    },
    {
      type: 'output',
      id: 'nodes-q6',
      description: 'objectMode. Что позволяет этот режим?',
      code: `const { Transform } = require('stream');

const objectTransform = new Transform({
  objectMode: true,
  transform(obj, _, cb) {
    this.push({ ...obj, processed: true });
    cb();
  }
});

objectTransform.write({ id: 1, name: 'Alice' });
objectTransform.on('data', (obj) => console.log(obj));`,
      options: [
        '{ id: 1, name: "Alice", processed: true }',
        'TypeError: invalid data type',
        '"[object Object]"',
        'Buffer содержащий JSON',
      ],
      correctIndex: 0,
      explanation: '`objectMode: true` позволяет передавать произвольные JS-объекты вместо Buffer/String. Полезно для: database cursor streams, JSON record processing, event streams. Без objectMode стримы работают только с Buffer и String.',
    },
    {
      type: 'output',
      id: 'nodes-q7',
      description: 'pipe vs pipeline. В чём разница при ошибке?',
      code: `// Вариант A: pipe
fs.createReadStream('missing.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('out.gz'));

// Вариант B: pipeline
await pipeline(
  fs.createReadStream('missing.txt'),
  zlib.createGzip(),
  fs.createWriteStream('out.gz'),
);`,
      options: [
        'A: утечка ресурсов (gzip и writeStream не закрыты). B: всё закрывается автоматически',
        'A и B идентичны в обработке ошибок',
        'A лучше: более явное управление',
        'B не работает с fs стримами',
      ],
      correctIndex: 0,
      explanation: 'При ошибке в `pipe`-цепочке: ошибка не передаётся downstream, последующие стримы остаются открытыми → утечка файловых дескрипторов. `pipeline` автоматически вызывает `destroy()` на всех стримах при любой ошибке и вызывает callback/reject с ошибкой.',
    },
    {
      type: 'fill-blank',
      id: 'nodes-q8',
      description: 'Заполните пропуск для async iteration по стриму.',
      codeWithBlanks: `const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('data.txt'),
});

// Async iteration:
___BLANK___ (const line of rl) {
  console.log(line);
}`,
      options: ['for await', 'for', 'await for', 'async for'],
      correctIndex: 0,
      explanation: '`for await...of` позволяет итерировать асинхронные итераторы — в том числе стримы Node.js. Это удобнее чем `on("data")` / `on("end")`. Node.js Readable стримы реализуют `Symbol.asyncIterator`. Доступно с Node.js 10+.',
    },
    {
      type: 'output',
      id: 'nodes-q9',
      description: 'highWaterMark. Что это такое?',
      code: `const readable = fs.createReadStream('file.txt', {
  highWaterMark: 16 * 1024, // 16KB
});`,
      options: [
        'Размер буфера в байтах — после превышения стрим приостанавливается',
        'Максимальный размер файла для чтения',
        'Порог для переключения в objectMode',
        'Количество одновременных читателей',
      ],
      correctIndex: 0,
      explanation: '`highWaterMark` — размер внутреннего буфера стрима. По умолчанию 16KB для Readable/Writable, 16 объектов для objectMode. Когда буфер заполняется — readable переходит в paused mode. Меньшее значение = меньше памяти, больше syscalls. Больше = эффективнее I/O, больше памяти.',
    },
    {
      type: 'output',
      id: 'nodes-q10',
      description: 'Readable.from(). Для чего используется?',
      code: `const { Readable } = require('stream');

async function* generateData() {
  yield 'first';
  yield 'second';
  yield 'third';
}

const stream = Readable.from(generateData());
stream.pipe(process.stdout);`,
      options: [
        'Создаёт Readable из async generator или итерируемого объекта',
        'Читает данные из файла асинхронно',
        'Преобразует Buffer в Readable',
        'Создаёт HTTP readable поток',
      ],
      correctIndex: 0,
      explanation: '`Readable.from(iterable)` создаёт Readable стрим из любого итерируемого или async iterable: массива, генератора, async генератора. Удобно для тестирования и создания стримов из in-memory данных. Node.js 12.3+.',
    },
    {
      type: 'complexity',
      id: 'nodes-q11',
      description: 'Какова сложность по памяти обработки файла 1GB через стрим vs readFileSync?',
      code: `// Вариант A: стрим
fs.createReadStream('1gb.txt').pipe(transform).pipe(output);

// Вариант B: readFileSync
const data = fs.readFileSync('1gb.txt');
transform(data);`,
      options: [
        'A: O(chunk) = O(16KB). B: O(N) = O(1GB)',
        'A: O(N). B: O(1)',
        'Одинаково — оба O(N)',
        'A: O(N²). B: O(N)',
      ],
      correctIndex: 0,
      explanation: 'Стрим держит в памяти только текущий чанк (по умолчанию 16KB). `readFileSync` загружает весь файл. Для 1GB файла: стрим ≈ 16KB памяти, readFileSync ≈ 1GB + overhead. Именно поэтому стримы критичны для работы с большими файлами в production.',
    },
    {
      type: 'output',
      id: 'nodes-q12',
      description: 'Что такое Duplex стрим?',
      code: `const net = require('net');

const socket = net.connect(8080); // Duplex!

// Одновременно:
socket.write('request data');       // Writable
socket.on('data', (response) => {   // Readable
  console.log(response.toString());
});`,
      options: [
        'Одновременно Readable и Writable — независимые потоки ввода и вывода',
        'Transform стрим — выход зависит от входа',
        'Readonly стрим с двойным буфером',
        'Два связанных Readable стрима',
      ],
      correctIndex: 0,
      explanation: 'Duplex — стрим с двумя независимыми каналами: Readable (входящие данные) и Writable (исходящие). В отличие от Transform, входной и выходной потоки не связаны. Примеры: TCP socket, WebSocket. Transform — подкласс Duplex, где выход зависит от входа.',
    },
  ],
};
