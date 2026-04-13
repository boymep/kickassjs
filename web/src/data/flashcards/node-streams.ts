import type { TopicFlashcards } from '../../types/flashcard';

export const nodeStreamsFlashcards: TopicFlashcards = {
  topicId: 'node-streams',
  cards: [
    {
      id: 'nodes-f1',
      question: 'Что такое Readable, Writable, Duplex и Transform стримы?',
      answer:
        'Четыре типа стримов в Node.js. Readable — источник данных. Writable — приёмник. Duplex — оба независимо (TCP socket). Transform — Duplex, где выход зависит от входа (сжатие, шифрование).',
      keyPoints: [
        'Readable: fs.createReadStream, http.IncomingMessage, process.stdin',
        'Writable: fs.createWriteStream, http.ServerResponse, process.stdout',
        'Duplex: net.Socket — читать и писать независимо',
        'Transform: zlib.createGzip() — входные данные преобразуются в выходные',
      ],
    },
    {
      id: 'nodes-f2',
      question: 'Что такое backpressure в стримах? Как его правильно обрабатывать?',
      answer:
        'Backpressure — механизм управления потоком данных. Когда writable не успевает — write() возвращает false. Нужно остановить readable и дождаться события drain.',
      keyPoints: [
        'write() → false: буфер заполнен, не писать больше',
        'drain событие: буфер освободился, можно продолжать',
        'Игнорирование backpressure — утечка памяти (буфер растёт бесконечно)',
        'pipeline() обрабатывает backpressure автоматически',
      ],
      code: `readable.on('data', (chunk) => {
  const ok = writable.write(chunk);
  if (!ok) {
    readable.pause(); // ждём drain
  }
});
writable.on('drain', () => readable.resume());`,
    },
    {
      id: 'nodes-f3',
      question: 'Чем pipeline отличается от pipe? Почему pipe считается устаревшим?',
      answer:
        'pipe не обрабатывает ошибки — при ошибке в одном стриме, остальные не закрываются, что ведёт к утечке ресурсов. pipeline правильно уничтожает все стримы при ошибке.',
      keyPoints: [
        'pipe: ошибка не распространяется → открытые файловые дескрипторы',
        'pipeline: при ошибке — destroy() на все стримы в цепочке',
        'stream/promises pipeline — возвращает Promise, работает с async/await',
        'pipeline — предпочтительный способ для production',
      ],
      code: `const { pipeline } = require('stream/promises');

// ✅ Безопасно:
await pipeline(
  fs.createReadStream('in.txt'),
  zlib.createGzip(),
  fs.createWriteStream('out.gz')
);
// При ошибке все стримы автоматически закрыты`,
    },
    {
      id: 'nodes-f4',
      question: 'Как создать собственный Transform стрим? Что такое _transform и _flush?',
      answer:
        '_transform обрабатывает каждый входящий чанк и может выдать (push) преобразованные данные. _flush вызывается когда входные данные закончились — для финализации (пушить оставшееся).',
      keyPoints: [
        '_transform(chunk, encoding, callback) — обязательный',
        'callback() — сигнал готовности к следующему чанку',
        '_flush(callback) — опциональный, для финализации',
        'objectMode: true — для передачи JS-объектов вместо Buffer',
      ],
      code: `class UpperCase extends Transform {
  _transform(chunk, enc, cb) {
    this.push(chunk.toString().toUpperCase());
    cb();
  }
}
process.stdin.pipe(new UpperCase()).pipe(process.stdout);`,
    },
    {
      id: 'nodes-f5',
      question: 'Почему для файлов >100MB нужны стримы? Что будет без них?',
      answer:
        'fs.readFileSync или fs.readFile загружают весь файл в память. Для 10GB файла это = OOM crash. Стримы обрабатывают данные чанками (по умолчанию 16KB) — память O(1 чанк).',
      keyPoints: [
        'readFile: весь файл в heap → OOM при больших файлах',
        'createReadStream: O(16KB) в памяти независимо от размера файла',
        'highWaterMark — настройка размера чанка',
        'for await...of stream — удобный async iteration по стриму',
      ],
    },
  ],
};
