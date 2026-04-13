import type { TopicQuiz } from '../../types/quiz';

export const jsBrowserQuiz: TopicQuiz = {
  topicId: 'js-browser',
  questions: [
    {
      type: 'output',
      id: 'jsbr-q1',
      description: 'Что произойдёт при смешивании read/write DOM-операций?',
      code: `// 5 элементов, каждый 100px высотой
elements.forEach((el) => {
  const h = el.offsetHeight; // READ
  el.style.height = (h + 10) + 'px'; // WRITE
});
// Сколько раз произойдёт reflow?`,
      options: ['5 раз (Forced Synchronous Layout)', '1 раз в конце', '0 раз', '2 раза'],
      correctIndex: 0,
      explanation: 'Каждая итерация: WRITE (style.height) инвалидирует layout → следующая READ (offsetHeight) принудительно запускает reflow для получения актуального значения. 5 итераций = 5 Forced Synchronous Layout. Решение: прочитать все значения сначала, затем записать.',
    },
    {
      type: 'fill-blank',
      id: 'jsbr-q2',
      description: 'Какое CSS-свойство вызывает только Composite, а не Reflow/Repaint?',
      codeWithBlanks: `// Для плавной анимации позиции без reflow:
element.style.___BLANK___ = 'translateX(100px)';

// Вместо:
element.style.left = '100px'; // вызывает Reflow!`,
      options: ['transform', 'position', 'margin-left', 'left'],
      correctIndex: 0,
      explanation: '`transform: translateX()` работает только на compositor layer — не вызывает Layout или Paint на главном потоке. GPU обрабатывает трансформацию. Поэтому анимации через transform намного плавнее, чем через left/top/margin.',
    },
    {
      type: 'output',
      id: 'jsbr-q3',
      description: 'defer vs async. В каком порядке выполнятся скрипты?',
      code: `<script src="a.js" defer></script>
<script src="b.js" async></script>
<script src="c.js" defer></script>
// a.js — загружается 200ms
// b.js — загружается 50ms
// c.js — загружается 300ms`,
      options: [
        'b.js (async, как загрузится), затем a.js → c.js (defer, по порядку)',
        'a.js → b.js → c.js',
        'c.js → b.js → a.js',
        'a.js → c.js → b.js',
      ],
      correctIndex: 0,
      explanation: 'async: выполняется сразу как загрузился (50ms) — b.js первый. defer: выполняется после парсинга HTML, **в порядке в документе** — a.js, затем c.js. Ключевое отличие: defer сохраняет порядок, async — нет.',
    },
    {
      type: 'output',
      id: 'jsbr-q4',
      description: 'Какой браузерный API использовать для Lazy Loading без событий scroll?',
      code: `// Нужно загружать изображение только когда оно
// появляется в viewport. Какой API предпочтителен?`,
      options: ['IntersectionObserver', 'scroll event listener', 'setTimeout', 'MutationObserver'],
      correctIndex: 0,
      explanation: 'IntersectionObserver — специально создан для этого. Работает в отдельном потоке, не блокирует главный. scroll event запускается сотни раз в секунду при скролле — неэффективно. IntersectionObserver вызывается только при пересечении границы viewport.',
    },
    {
      type: 'fill-blank',
      id: 'jsbr-q5',
      description: 'Заполните пропуск для выбора оптимального изображения по dpr.',
      codeWithBlanks: `<img
  src="img-400.jpg"
  srcset="img-400.jpg 400w, img-800.jpg 800w, img-1200.jpg 1200w"
  ___BLANK___="(max-width: 600px) 400px, 800px"
  alt="photo"
>`,
      options: ['sizes', 'media', 'width', 'srcwidth'],
      correctIndex: 0,
      explanation: '`sizes` — описывает, какого размера будет изображение на разных viewport. Браузер использует sizes + dpr для выбора нужного варианта из srcset. Без sizes браузер не знает, как будет отображаться изображение, и выбирает неоптимально.',
    },
    {
      type: 'output',
      id: 'jsbr-q6',
      description: 'Critical Rendering Path. Что блокирует рендеринг?',
      code: `<head>
  <link rel="stylesheet" href="styles.css">  <!-- A -->
  <script src="app.js"></script>              <!-- B -->
  <script defer src="analytics.js"></script>  <!-- C -->
  <link rel="preload" href="font.woff2" as="font"> <!-- D -->
</head>`,
      options: ['A и B блокируют', 'только B', 'A, B и D блокируют', 'ничего не блокирует'],
      correctIndex: 0,
      explanation: 'CSS (A) блокирует рендеринг (не парсинг). Script без defer/async (B) блокирует и рендеринг и парсинг HTML. defer (C) — не блокирует. preload (D) — загружает заранее, но не блокирует рендеринг.',
    },
    {
      type: 'output',
      id: 'jsbr-q7',
      description: 'requestAnimationFrame vs setTimeout. Что лучше для анимации?',
      code: `// Вариант A: setInterval
setInterval(() => { el.style.left = pos++ + 'px'; }, 16);

// Вариант B: requestAnimationFrame
function animate() {
  el.style.transform = 'translateX(' + pos++ + 'px)';
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);`,
      options: [
        'B лучше: синхронизация с экраном + transform без reflow',
        'A лучше: предсказуемый интервал',
        'Одинаково',
        'A лучше при 60fps мониторе',
      ],
      correctIndex: 0,
      explanation: 'rAF синхронизируется с частотой обновления экрана (60/120/144fps), setInterval — нет. rAF приостанавливается когда вкладка неактивна. transform избегает reflow в отличие от left. Тройное преимущество варианта B.',
    },
    {
      type: 'tracing',
      id: 'jsbr-q8',
      description: 'Проследите шаги браузера от HTML до пикселей.',
      code: `// Браузер получает HTML:
// <html><head><link rel="stylesheet" href="style.css">
// </head><body><div class="box">Hello</div></body></html>`,
      steps: [
        { label: '1. Парсинг HTML → DOM', variables: { результат: 'Дерево DOM-узлов' } },
        { label: '2. Загрузка и парсинг CSS → CSSOM', variables: { результат: 'Модель стилей' } },
        { label: '3. DOM + CSSOM → Render Tree', variables: { результат: 'Только видимые элементы' } },
        { label: '4. Layout (Reflow)', variables: { результат: 'Геометрия: позиции и размеры' } },
        { label: '5. Paint', variables: { результат: 'Пиксели на слои' } },
        { label: '6. Composite', variables: { результат: 'Слои → финальная картинка' } },
      ],
      question: 'На каком шаге HTML-парсинг блокируется CSS?',
      options: ['Шаг 3 (Render Tree нельзя построить без CSSOM)', 'Шаг 1 (сразу)', 'Шаг 4 (Layout)', 'CSS не блокирует HTML-парсинг'],
      correctIndex: 0,
      explanation: 'HTML парсинг и загрузка CSS происходят параллельно. Но Render Tree (шаг 3) нельзя построить без CSSOM — браузер ждёт завершения парсинга CSS. Поэтому CSS блокирует **рендеринг**, но не парсинг HTML.',
    },
    {
      type: 'output',
      id: 'jsbr-q9',
      description: 'Web Workers. Что НЕ доступно в Worker?',
      code: `// worker.js
self.onmessage = (e) => {
  // Что из этого вызовет ошибку?
  const result = e.data.map(x => x * 2); // A
  document.body.style.color = 'red';      // B
  self.postMessage(result);               // C
  console.log('done');                    // D
};`,
      options: ['B (document недоступен)', 'A (map недоступен)', 'C (postMessage недоступен)', 'D (console недоступен)'],
      correctIndex: 0,
      explanation: 'Web Workers работают в отдельном потоке **без доступа к DOM**. `document`, `window`, `navigator` (частично) недоступны. Доступны: `self`, `postMessage`, большинство JS API (Map, Set, fetch, indexedDB), `console`. Это защищает UI-поток от блокировки.',
    },
    {
      type: 'fill-blank',
      id: 'jsbr-q10',
      description: 'Заполните пропуск для lazy loading изображений через нативный атрибут.',
      codeWithBlanks: `<img
  src="photo.jpg"
  ___BLANK___="lazy"
  alt="A photo"
>`,
      options: ['loading', 'lazy', 'defer', 'fetchpriority'],
      correctIndex: 0,
      explanation: '`loading="lazy"` — нативный lazy loading HTML-атрибут. Браузер откладывает загрузку изображений за пределами viewport. Поддерживается всеми современными браузерами. Альтернатива: IntersectionObserver для большего контроля (кастомный threshold, placeholder).',
    },
    {
      type: 'output',
      id: 'jsbr-q11',
      description: 'will-change. Что делает это свойство?',
      code: `.animated-element {
  will-change: transform;
}
// Элемент анимируется через JS:
el.style.transform = 'translateX(100px)';`,
      options: [
        'Перемещает элемент на отдельный GPU layer заранее',
        'Запускает анимацию автоматически',
        'Отключает reflow для этого элемента',
        'Ускоряет JS-выполнение',
      ],
      correctIndex: 0,
      explanation: '`will-change: transform` подсказывает браузеру, что элемент будет анимироваться. Браузер **заранее** создаёт отдельный compositor layer. Это убирает "рывок" при старте анимации. Но: слишком много will-change = много GPU-памяти. Используйте только для нужных элементов.',
    },
    {
      type: 'output',
      id: 'jsbr-q12',
      description: 'Forced Synchronous Layout. Что произойдёт?',
      code: `// После этой записи layout "испорчен" (dirty):
element.style.width = '100px';

// Немедленное чтение геометрии:
const height = element.offsetHeight;
console.log(height);`,
      options: [
        'Браузер принудительно пересчитает layout (reflow) перед чтением',
        'height = 0 (не обновилось)',
        'height = предыдущее значение',
        'TypeError',
      ],
      correctIndex: 0,
      explanation: 'После записи стиля layout становится "dirty". При следующем чтении геометрического свойства (offsetHeight, offsetWidth, getBoundingClientRect и др.) браузер принудительно запускает reflow — чтобы вернуть актуальное значение. Это называется Forced Synchronous Layout.',
    },
  ],
};
