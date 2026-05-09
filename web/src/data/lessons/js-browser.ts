import type { Lesson } from '../../types/lesson';
import { jsBrowserQuiz } from '../quizzes/js-browser';
import { jsBrowserFlashcards } from '../flashcards/js-browser';

// Index existing quiz questions for reuse as checkpoints.
const Q = Object.fromEntries(jsBrowserQuiz.questions.map((q) => [q.id, q]));

// Questions used as in-chapter checkpoints (must NOT appear in finalQuiz).
const CHECKPOINT_IDS = new Set(['jsbr-q8', 'jsbr-q1', 'jsbr-q2', 'jsbr-q7']);

const extraFlashcards = [
  {
    id: 'jsbr-f7',
    question: 'Что такое Forced Synchronous Layout и как его избежать?',
    answer:
      'Forced Synchronous Layout (или layout thrashing) — ситуация, когда чтение геометрических свойств (offsetWidth, getBoundingClientRect, scrollTop) после записи стиля вынуждает браузер синхронно пересчитать layout. Чтобы избежать — батчить все чтения до начала записей или выполнять записи внутри requestAnimationFrame.',
    keyPoints: [
      'Браузер откладывает пересчёт layout до конца текущего тика',
      'Чтение «грязного» layout-свойства принудительно вызывает reflow',
      'Решение: read-phase → write-phase, либо fastdom, либо rAF',
      'Внутри rAF чтения дешевле — layout уже актуален',
      'DevTools Performance показывает Forced Reflow фиолетовым',
    ],
  },
  {
    id: 'jsbr-f8',
    question: 'Когда использовать will-change и в чём его подвох?',
    answer:
      'will-change — CSS-подсказка браузеру: «этот элемент скоро будет анимироваться». Браузер заранее создаёт отдельный compositor layer, чтобы при старте анимации не было «рывка». Подвох — каждый layer ест GPU-память, а постоянный will-change на множестве элементов может ухудшить производительность вместо улучшения.',
    keyPoints: [
      'Применять только к элементам, которые реально анимируются прямо сейчас',
      'Снимать (will-change: auto) после завершения анимации',
      'Никогда не ставить will-change на сотни элементов разом',
      'Альтернативы: transform: translateZ(0), backface-visibility: hidden',
      'Не нужен для CSS-анимаций — браузер сам определит',
    ],
  },
  {
    id: 'jsbr-f9',
    question: 'Чем AVIF отличается от WebP и когда что выбрать?',
    answer:
      'AVIF (на основе AV1) даёт на 30–50% меньший вес, чем WebP, при том же визуальном качестве, и поддерживает HDR. Минусы — более медленная декодировка и менее полная поддержка в Safari/старых браузерах. На практике используют <picture> с цепочкой AVIF → WebP → JPEG fallback.',
    keyPoints: [
      'AVIF: лучшее сжатие, медленнее декодируется, менее поддерживаем',
      'WebP: универсальный современный стандарт, поддержка ~96%',
      'JPEG/PNG: fallback и старые форматы',
      '<picture> + <source type="image/avif"> для постепенной деградации',
      'Сервинг через CDN с авто-форматом (Cloudinary, ImgIX, Vercel Image)',
    ],
    code: `<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="hero" loading="lazy">
</picture>`,
  },
  {
    id: 'jsbr-f10',
    question: 'Как улучшить LCP (Largest Contentful Paint)?',
    answer:
      'LCP — время до отрисовки самого большого видимого элемента (обычно героя-картинки или заголовка). Цель — < 2.5s. Улучшается ускорением сети (CDN, HTTP/2, preconnect), оптимизацией изображений (AVIF/WebP, srcset), preload для LCP-ресурса, server-side rendering и снижением блокирующего CSS/JS.',
    keyPoints: [
      'Найти LCP-элемент: DevTools → Performance → Timings',
      'preload для LCP-картинки или шрифта',
      'fetchpriority="high" на LCP-изображении',
      'Inline critical CSS, defer некритичный JS',
      'SSR/SSG вместо чистого CSR',
    ],
  },
];

export const jsBrowserLesson: Lesson = {
  topicId: 'js-browser',

  intro: {
    whyItMatters: `Браузер — это сложная многоэтапная машина рендеринга, и понимание того, как она работает, отличает фронтендера-«сборщика страниц» от инженера, который умеет делать быстрый UI. Каждый раз, когда страница загружается, браузер проходит **Critical Rendering Path**: парсит HTML в **DOM**, парсит CSS в **CSSOM**, объединяет их в **Render Tree**, считает геометрию (**Layout** / Reflow), растеризует пиксели по слоям (**Paint**) и собирает финальное изображение из слоёв на GPU (**Composite**). Любое изменение DOM или стилей запускает часть этой цепочки заново — и не любое одинаково дорого.

**Reflow** (пересчёт макета) — самая тяжёлая операция: меняются \`width\`, \`height\`, \`top\`, шрифт, добавляется/удаляется узел — и браузер пересчитывает геометрию всего поддерева, иногда всего документа. **Repaint** — перерисовка пикселей без изменения геометрии (\`color\`, \`background\`) — дешевле. А **Composite** — простое смещение уже готового слоя на GPU — почти бесплатно. Поэтому \`transform\` и \`opacity\` — главные «дешёвые» свойства для анимаций: они не трогают layout-поток вообще. Подсказка \`will-change: transform\` заранее переводит элемент на отдельный compositor layer, чтобы первый кадр анимации не вызвал «рывок».

Не менее важны **изображения**: на типичной странице они дают 50–70% веса. Современные форматы (**AVIF**, **WebP**) экономят 25–50% по сравнению с JPEG; \`srcset\` + \`sizes\` отдают каждому устройству свой размер; \`loading="lazy"\` откладывает загрузку до приближения к viewport. Метрики **Core Web Vitals** (LCP, INP, CLS) — то, чем Google измеряет UX, и то, что почти всегда обсуждается на интервью на frontend-позиции.`,
    estimatedMinutes: 35,
    interviewAngle:
      'Интервьюер проверяет три вещи: знаете ли вы шаги Critical Rendering Path и что блокирует рендеринг; различаете ли reflow / repaint / composite и умеете ли подобрать «дешёвые» свойства для анимаций; понимаете ли Core Web Vitals (LCP, INP, CLS) и чем их можно улучшить в реальном проекте.',
    prerequisites: [
      { slug: 'js-event-loop', title: 'Event Loop' },
      { slug: 'js-dom', title: 'DOM и события' },
    ],
  },

  resources: {
    videos: [
      {
        source: 'youtube',
        id: 'cCOL7MC4Pl0',
        title: 'In The Loop — Jake Archibald (JSConf.Asia)',
        channel: 'JSConf',
        language: 'en',
        durationSec: 35 * 60,
        description: 'Доклад инженера Chrome про event loop, microtask checkpoint и шаг рендеринга — ключевой контекст для понимания, когда и как браузер рисует кадр.',
      },
      {
        source: 'youtube',
        id: 'ZTnIxIA5KGw',
        title: 'The Critical Rendering Path — Fireship',
        channel: 'Fireship',
        language: 'en',
        durationSec: 6 * 60,
        description: '6-минутный обзор Critical Rendering Path: HTML → DOM → CSSOM → Render Tree → Paint. Хороший быстрый разогрев перед уроком.',
      },
    ],
    links: [
      {
        url: 'https://web.dev/articles/rendering-performance',
        title: 'Rendering Performance — web.dev',
        source: 'web-dev',
        language: 'en',
        note: 'Канонический гайд Пола Льюиса: пиксельный конвейер, что вызывает reflow/repaint/composite, как профилировать.',
      },
      {
        url: 'https://web.dev/articles/lcp',
        title: 'Largest Contentful Paint (LCP) — web.dev',
        source: 'web-dev',
        language: 'en',
        note: 'Что такое LCP, как измерять и как улучшать — главный материал по этой Core Web Vital.',
      },
      {
        url: 'https://web.dev/articles/cls',
        title: 'Cumulative Layout Shift (CLS) — web.dev',
        source: 'web-dev',
        language: 'en',
        note: 'Как измерять и устранять «прыжки» макета: резервируйте размеры под изображения, шрифты и рекламу.',
      },
      {
        url: 'https://developer.mozilla.org/en-US/docs/Web/Performance/Critical_rendering_path',
        title: 'Critical rendering path — MDN',
        source: 'mdn',
        language: 'en',
        note: 'Справочник MDN по CRP: парсинг HTML/CSS, построение Render Tree, шаги Layout и Paint.',
      },
      {
        url: 'https://web.dev/articles/optimize-inp',
        title: 'Optimize Interaction to Next Paint — web.dev',
        source: 'web-dev',
        language: 'en',
        note: 'INP заменил FID как метрика отклика. В статье — стратегии разбиения long tasks и приоритизации обработки ввода.',
      },
    ],
  },

  chapters: [
    {
      id: 'critical-rendering-path',
      title: 'Critical Rendering Path',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Когда браузер получает HTML, он не рисует пиксели сразу. Он проходит цепочку шагов — **Critical Rendering Path** — превращающую байты сетевого ответа в видимое изображение. Каждый шаг блокируется предыдущим, и любой из них может стать узким местом производительности.',
        },
        {
          type: 'list',
          content: `1. **HTML → DOM.** Парсер строит дерево DOM-узлов из тегов.
2. **CSS → CSSOM.** Парсер CSS строит модель стилей. CSS блокирует рендеринг (но не парсинг HTML).
3. **DOM + CSSOM → Render Tree.** Только видимые элементы (\`display: none\` отбрасывается) с вычисленными стилями.
4. **Layout (Reflow).** Расчёт геометрии: размер и позиция каждого узла.
5. **Paint.** Растеризация: пиксели разбиваются на **слои** (compositor layers).
6. **Composite.** Слои собираются в финальное изображение, чаще всего на GPU.`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'JavaScript блокирует **парсинг HTML**: при встрече `<script>` без атрибутов парсер останавливается, ждёт загрузку и выполнение. Атрибут `defer` откладывает выполнение до завершения парсинга (с сохранением порядка), `async` — выполняет сразу как загрузится (порядок не гарантирован).',
        },
        {
          type: 'code',
          language: 'html',
          content: `<head>
  <!-- Блокирует рендеринг (но не парсинг HTML): -->
  <link rel="stylesheet" href="critical.css">

  <!-- Блокирует парсинг HTML и рендеринг: -->
  <script src="legacy.js"></script>

  <!-- Не блокирует, выполняется после парсинга в порядке тегов: -->
  <script src="app.js" defer></script>

  <!-- Не блокирует, выполняется как только загрузится (без гарантии порядка): -->
  <script src="analytics.js" async></script>

  <!-- Resource hints: ускоряют CRP, не блокируя его. -->
  <link rel="preload" href="hero.avif" as="image" fetchpriority="high">
  <link rel="preconnect" href="https://api.example.com">
  <link rel="dns-prefetch" href="https://cdn.example.com">
</head>`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Главное правило оптимизации первого кадра: **минимум блокирующих ресурсов в `<head>`**. Inline-критический CSS + `<link rel="preload">` для LCP-картинки + `defer`/`async` для всего JS — типовой стек улучшения LCP.',
        },
      ],
      flashcardIds: ['jsbr-f1'],
      checkpoint: [Q['jsbr-q8']!],
    },

    {
      id: 'reflow-repaint-composite',
      title: 'Reflow, Repaint и Composite',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            'После первого рендера любое изменение DOM или стилей запускает **часть** Critical Rendering Path заново. От того, какую именно часть — зависит, насколько дорогим окажется обновление. Три уровня по убыванию стоимости: **Reflow** → **Repaint** → **Composite**.',
        },
        {
          type: 'list',
          content: `**Reflow (Layout)** — пересчёт геометрии. Запускают: \`width\`, \`height\`, \`margin\`, \`padding\`, \`top\`, \`left\`, \`font-size\`, добавление/удаление узлов, чтение \`offsetWidth\`/\`getBoundingClientRect\`/\`scrollTop\`.
**Repaint** — перерисовка пикселей **без** изменения геометрии. Запускают: \`color\`, \`background-color\`, \`visibility\`, \`border-color\`, \`box-shadow\`.
**Composite** — пересборка готовых слоёв на GPU. Запускают **только**: \`transform\` и \`opacity\` (если элемент уже на отдельном compositor layer).`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Дорого: меняем left → reflow всего поддерева → repaint → composite
el.style.left = '100px';

// Дёшево: только composite, без reflow и repaint
el.style.transform = 'translateX(100px)';

// Дорого: меняем display → пересчёт всего layout
el.style.display = 'flex';

// Дёшево: opacity на отдельном слое — только composite
el.style.opacity = '0.5';`,
        },
        { type: 'heading', content: 'Layout Thrashing — антипаттерн' },
        {
          type: 'text',
          content:
            'Браузер старается отложить reflow до конца текущего тика, чтобы пересчитать layout один раз для всех изменений. Но если в цикле чередовать **запись** стиля и **чтение** геометрии — каждое чтение принудительно сбрасывает отложенный layout. Это и называется **Forced Synchronous Layout** или **layout thrashing**.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// ❌ Layout thrashing: на каждой итерации reflow
function bad(elements) {
  elements.forEach((el) => {
    const w = el.offsetWidth;        // READ → принудительный reflow
    el.style.width = (w + 10) + 'px'; // WRITE → инвалидирует layout снова
  });
}

// ✅ Сначала все READ, затем все WRITE — один reflow на всю партию
function good(elements) {
  const widths = elements.map((el) => el.offsetWidth); // READ-фаза
  elements.forEach((el, i) => {
    el.style.width = (widths[i] + 10) + 'px';          // WRITE-фаза
  });
}`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'В Chrome DevTools Performance такие операции подсвечиваются красно-фиолетовым «Forced reflow». Если видите их в hot path — почти всегда виноват цикл с миксом read/write.',
        },
        { type: 'heading', content: 'will-change и compositor layers' },
        {
          type: 'text',
          content:
            '`will-change: transform` (или `opacity`) — подсказка браузеру: «этот элемент будет анимироваться». Браузер **заранее** создаёт отдельный compositor layer, и первый кадр анимации не вызывает «рывок» из-за подъёма на GPU.',
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Подвох `will-change`: каждый layer занимает GPU-память. Ставить `will-change` на сотни элементов или на всё подряд — антипаттерн: можно получить из ускорения замедление и выгорание батареи. Снимайте свойство (`will-change: auto`) после анимации.',
        },
      ],
      flashcardIds: ['jsbr-f2', 'jsbr-f3', 'jsbr-f7', 'jsbr-f8'],
      checkpoint: [Q['jsbr-q1']!, Q['jsbr-q2']!],
      playground: {
        starterCode: `// Эмуляция layout thrashing.
// reflows — счётчик; каждое READ после WRITE его инкрементирует.
// Перепишите цикл так, чтобы reflows стало равно 1.

let reflows = 0;
let layoutDirty = true;

const elements = [
  { _w: 10, _dirty: false },
  { _w: 20, _dirty: false },
  { _w: 30, _dirty: false },
];

function readWidth(el) {
  if (layoutDirty) { reflows++; layoutDirty = false; }
  return el._w;
}
function writeWidth(el, val) {
  el._w = val;
  layoutDirty = true;
}

// ❌ thrashing — здесь reflows получится 3
elements.forEach((el) => {
  const w = readWidth(el);
  writeWidth(el, w + 1);
});

console.log('reflows =', reflows);`,
        expectedOutput: 'reflows = 3',
        description:
          'Запустите как есть — увидите reflows = 3 (по reflow на каждую итерацию). Затем разделите цикл на read-фазу и write-фазу — после переписывания reflows должен стать 1.',
      },
    },

    {
      id: 'images-and-loading',
      title: 'Изображения, lazy loading и форматы',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'На типичной странице изображения дают 50–70% общего веса. Поэтому даже небольшие победы здесь — крупные победы по LCP и расходу трафика. Современный стек: **AVIF/WebP** вместо JPEG, **`srcset` + `sizes`** для адаптивных размеров, **`loading="lazy"`** для офф-скрин картинок и **`fetchpriority="high"`** для LCP-изображения.',
        },
        {
          type: 'code',
          language: 'html',
          content: `<!-- Адаптивный размер: браузер выбирает подходящий вариант -->
<img
  src="hero-800.jpg"
  srcset="hero-400.jpg 400w, hero-800.jpg 800w, hero-1200.jpg 1200w"
  sizes="(max-width: 600px) 100vw, 800px"
  alt="hero"
  width="800" height="450"
  fetchpriority="high"
>

<!-- Современные форматы с fallback -->
<picture>
  <source srcset="photo.avif" type="image/avif">
  <source srcset="photo.webp" type="image/webp">
  <img src="photo.jpg" alt="photo" loading="lazy" width="800" height="600">
</picture>`,
        },
        {
          type: 'list',
          content: `- **AVIF** — на 30–50% меньше JPEG; идеален для героя-фото. Минус — медленнее декодируется.
- **WebP** — универсальный современный формат; поддерживается ~96% браузеров.
- **\`loading="lazy"\`** — нативный lazy-load для офф-скрин картинок (поддерживается всеми современными браузерами).
- **\`fetchpriority="high"\`** — сигнал браузеру «это важная картинка» (обычно LCP).
- **Атрибуты \`width\` и \`height\`** обязательны: без них браузер не знает размер до загрузки и получит **CLS** (layout shift).`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            '`<img loading="lazy">` — браузерный механизм без JS. Для более тонкого контроля (custom threshold, blur placeholder, intersection с rootMargin) используют `IntersectionObserver`.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Кастомный lazy-load через IntersectionObserver
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src; // подменяем src на реальный
        observer.unobserve(img);
      }
    }
  },
  { rootMargin: '200px' } // загружать за 200px ДО появления
);

document.querySelectorAll('img[data-src]').forEach((img) => observer.observe(img));`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'CLS (Cumulative Layout Shift) почти всегда вызван картинками без `width`/`height`, динамической рекламой или поздно подгружаемыми шрифтами (FOUT). Резервируйте место заранее — `aspect-ratio` в CSS или явные атрибуты у `<img>`.',
        },
      ],
      flashcardIds: ['jsbr-f9'],
    },

    {
      id: 'animations-and-raf',
      title: 'Анимации, requestAnimationFrame и GPU',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Анимации в браузере хороши только тогда, когда успевают вписаться в кадр: на 60 Гц мониторе у вас всего ~16.6 мс на JS + layout + paint + composite. Промахнулись — пользователь увидит пропущенный кадр (jank). Поэтому два правила: использовать **дешёвые** свойства (`transform`, `opacity`) и **синхронизироваться** с кадрами через `requestAnimationFrame`.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// ❌ setInterval не синхронизирован с экраном, использует left → reflow
let pos = 0;
setInterval(() => {
  el.style.left = pos++ + 'px';
}, 16);

// ✅ rAF синхронизирован с vsync, transform → composite-only
function animate(time) {
  const x = (time / 10) % 300;
  el.style.transform = \`translateX(\${x}px)\`;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);`,
        },
        {
          type: 'list',
          content: `Преимущества \`requestAnimationFrame\` над \`setTimeout\`/\`setInterval\`:
- Синхронизация с частотой обновления экрана (60/120/144 Гц).
- Пауза в фоновых вкладках — экономия CPU и батареи.
- Колбэк получает \`DOMHighResTimeStamp\` — удобно считать прошедшее время.
- Лучшее место для **чтения** layout: внутри rAF \`getBoundingClientRect\` не вызывает forced reflow, потому что layout уже актуален.`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Для простых анимаций (hover, появление модалки) лучше **CSS transitions/animations**, а не JS+rAF. Они выполняются на compositor thread и не зависят от того, занят ли главный поток.',
        },
        { type: 'heading', content: 'Web Workers — для CPU-bound задач' },
        {
          type: 'text',
          content:
            'Если анимация всё равно подтормаживает, потому что параллельно работает тяжёлая JS-логика — выносите её в **Web Worker**. У него свой поток без доступа к DOM, общение через `postMessage`.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// main.js
const worker = new Worker('worker.js');
worker.postMessage({ data: bigArray });
worker.onmessage = (e) => {
  console.log('Готово:', e.data.result);
};

// worker.js — отдельный поток, без DOM
self.onmessage = (e) => {
  const result = heavyComputation(e.data.data);
  self.postMessage({ result });
};`,
        },
      ],
      flashcardIds: ['jsbr-f5'],
      checkpoint: [Q['jsbr-q7']!],
    },

    {
      id: 'core-web-vitals',
      title: 'Core Web Vitals: LCP, INP, CLS',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            'Google Core Web Vitals — стандартный набор метрик UX, который влияет на ранжирование в поиске и почти всегда обсуждается на frontend-интервью. Их три, и каждая описывает свою сторону опыта.',
        },
        {
          type: 'list',
          content: `**LCP — Largest Contentful Paint.** Время до отрисовки самого большого видимого элемента (обычно героя-картинки или заголовка). Цель — < **2.5 с**.
**INP — Interaction to Next Paint.** Худшая задержка отклика на пользовательский ввод за весь сеанс. Заменил FID в 2024 г. Цель — < **200 мс**.
**CLS — Cumulative Layout Shift.** Сумма «прыжков» макета. Цель — < **0.1**.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Измерение Core Web Vitals через PerformanceObserver
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('LCP:', entry.startTime, 'ms', entry.element);
  }
}).observe({ type: 'largest-contentful-paint', buffered: true });

new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) console.log('CLS +=', entry.value);
  }
}).observe({ type: 'layout-shift', buffered: true });

// Long tasks > 50ms — ухудшают INP
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.warn('long task', entry.duration, 'ms', entry.attribution);
  }
}).observe({ type: 'longtask', buffered: true });

// На практике используют web-vitals библиотеку Google:
// import { onLCP, onINP, onCLS } from 'web-vitals';
// onLCP(sendToAnalytics);`,
        },
        { type: 'heading', content: 'Как улучшать каждую из метрик' },
        {
          type: 'list',
          content: `**LCP** — preload LCP-ресурса, \`fetchpriority="high"\` на LCP-картинке, AVIF/WebP, CDN, SSR, минимум блокирующего CSS.
**INP** — разбивать long tasks на чанки через \`setTimeout\`/\`scheduler.yield\`, выносить тяжёлую логику в Web Worker, виртуализировать длинные списки, \`startTransition\` в React.
**CLS** — резервировать размеры под изображения (\`width\`/\`height\` или \`aspect-ratio\`), использовать \`font-display: optional\` или \`size-adjust\` для шрифтов, не вставлять контент над уже видимым.`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Метрики снимаются на реальных пользователях через RUM (Real User Monitoring), а не только в Lighthouse. Lighthouse даёт лабораторное измерение — оно может расходиться с тем, что видят пользователи в проде.',
        },
        { type: 'heading', content: 'Виртуализация длинных списков' },
        {
          type: 'code',
          language: 'javascript',
          content: `// Рендерить только видимый кусок списка (react-window / TanStack Virtual)
function getVisibleRange(scrollTop, containerHeight, itemHeight, total) {
  const start = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight) + 1;
  const end = Math.min(start + visibleCount, total);
  return { start, end, offsetY: start * itemHeight };
}
// Контейнер имеет полную высоту total*itemHeight,
// но в DOM существуют только items[start..end],
// сдвинутые через transform: translateY(offsetY).`,
        },
      ],
      flashcardIds: ['jsbr-f4', 'jsbr-f6', 'jsbr-f10'],
    },
  ],

  // Все вопросы из старого квиза, кроме тех, что ушли в checkpoint.
  finalQuiz: jsBrowserQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  // Реюзаем существующие карточки + добавляем новые.
  flashcards: [...jsBrowserFlashcards.cards, ...extraFlashcards],

  cheatsheet: `### Шпаргалка по работе браузера

- **CRP**: HTML→DOM, CSS→CSSOM, Render Tree, **Layout** (геометрия), **Paint** (пиксели), **Composite** (слои).
- CSS блокирует **рендер** (не парсинг HTML); JS без \`defer\`/\`async\` блокирует **и** парсинг, **и** рендер.
- Стоимость обновлений: **Reflow > Repaint > Composite**. Анимируйте только \`transform\` и \`opacity\`.
- **Layout thrashing** = чередование READ/WRITE → принудительный reflow. Решение: read-фаза → write-фаза или \`requestAnimationFrame\`.
- \`will-change: transform\` — подъём на отдельный compositor layer заранее. Не злоупотреблять.
- Изображения: AVIF/WebP, \`srcset\`+\`sizes\`, \`loading="lazy"\`, \`fetchpriority="high"\`, обязательные \`width\`/\`height\` против CLS.
- \`requestAnimationFrame\` синхронизирован с экраном; \`setTimeout\` — нет. Тяжёлый CPU — в Web Worker.
- **Core Web Vitals**: LCP < 2.5 с (preload, AVIF, SSR), INP < 200 мс (батчинг long tasks, Worker), CLS < 0.1 (резервируйте размеры).`,

  interviewQA: [
    {
      id: 'jsbr-iq1',
      question: 'Опишите Critical Rendering Path. Что блокирует рендеринг?',
      shortAnswer:
        'CRP — путь от HTML-байтов до пикселей: HTML→DOM, CSS→CSSOM, Render Tree, Layout, Paint, Composite. Рендеринг блокируется CSS (нужен для CSSOM) и любым `<script>` без `defer`/`async` (он блокирует и парсинг HTML, и сам рендер).',
      fullAnswer: `Critical Rendering Path — последовательность шагов, которые браузер выполняет от получения HTML до отрисовки первого кадра:

1. **HTML → DOM**. Парсер строит дерево DOM-узлов из HTML.
2. **CSS → CSSOM**. Параллельно парсится CSS — строится модель стилей.
3. **DOM + CSSOM → Render Tree**. Объединяется в дерево, в котором остаются только видимые элементы (\`display: none\` отбрасывается).
4. **Layout (Reflow)**. Считается геометрия каждого узла: позиция, размер.
5. **Paint**. Растеризация: пиксели разносятся по compositor-слоям.
6. **Composite**. Слои собираются в финальное изображение, обычно на GPU.

**Что блокирует рендеринг.**

- **CSS** блокирует рендеринг (но не парсинг HTML): без CSSOM нельзя построить Render Tree.
- **\`<script>\` без атрибутов** блокирует и парсинг HTML, и рендер: парсер останавливается до загрузки и выполнения скрипта.
- **\`<script defer>\`** не блокирует ничего: выполняется после парсинга, в порядке тегов.
- **\`<script async>\`** не блокирует парсинг, но выполняется как только загружен — без гарантии порядка.
- **\`<link rel="preload">\`** загружает заранее, не блокируя рендер.

Практический вывод: критический CSS — inline в \`<head>\`, остальной CSS — асинхронно; весь JS — \`defer\` или \`async\`; для LCP-картинки — \`<link rel="preload" as="image" fetchpriority="high">\`.`,
      followUps: [
        'Чем `defer` отличается от `async` по порядку выполнения?',
        'Что произойдёт, если поставить `<script>` в конец `<body>` без атрибутов?',
      ],
      relatedChapterId: 'critical-rendering-path',
    },
    {
      id: 'jsbr-iq2',
      question: 'Чем reflow отличается от repaint и composite? Что самое дорогое?',
      shortAnswer:
        'Reflow (Layout) — пересчёт геометрии всего поддерева, самая дорогая операция. Repaint — перерисовка пикселей без изменения геометрии, дешевле. Composite — пересборка готовых слоёв на GPU, почти бесплатна. Поэтому анимировать стоит только `transform` и `opacity`.',
      fullAnswer: `Reflow, repaint и composite — три уровня пиксельного конвейера, которые могут быть запущены изменением DOM или стилей.

**Reflow (Layout).** Пересчёт позиций и размеров. Самая дорогая операция: меняет геометрию поддерева, иногда всего документа. Запускается при изменении \`width\`, \`height\`, \`margin\`, \`top\`, \`left\`, \`font-size\`, \`display\`, добавлении/удалении узлов и при чтении \`offsetWidth\`, \`getBoundingClientRect\`, \`scrollTop\` (если layout «грязный»).

**Repaint.** Перерисовка пикселей **без** изменения геометрии. Дешевле: запускается при изменении \`color\`, \`background-color\`, \`visibility\`, \`border-color\`. Не затрагивает шаг Layout.

**Composite.** Пересборка готовых слоёв в финальное изображение. Самая дешёвая операция: выполняется на GPU, не затрагивает главный поток. Только \`transform\` и \`opacity\` (если элемент уже на отдельном compositor layer) дают composite-only обновление.

Из этого вытекают практические правила:
- Анимации делать через \`transform\` и \`opacity\`.
- Подсказывать браузеру через \`will-change: transform\` создание отдельного слоя заранее.
- Избегать \`top\`/\`left\` в анимациях — они вызывают reflow.
- Не читать геометрию после записи стилей в одном цикле — это **layout thrashing**.`,
      followUps: [
        'Почему `transform` и `opacity` дёшевы, а `width` и `height` — нет?',
        'Что произойдёт, если поставить `will-change` на 1000 элементов сразу?',
      ],
      relatedChapterId: 'reflow-repaint-composite',
    },
    {
      id: 'jsbr-iq3',
      question: 'Какие CSS-свойства не вызывают reflow и почему?',
      shortAnswer:
        '`transform` и `opacity` — единственные свойства, которые могут обновляться только на этапе Composite, без Reflow и Paint. Они работают на compositor layer элемента, который GPU собирает отдельно от остальной страницы. Поэтому именно их используют в плавных 60-FPS анимациях.',
      fullAnswer: `Чтобы CSS-свойство не вызывало reflow, оно не должно менять геометрию документа и должно выполняться на отдельном compositor layer.

**Без reflow и без repaint** (только Composite, на GPU):
- \`transform: translate / scale / rotate / skew\` — смещение, масштабирование, поворот.
- \`opacity\` — прозрачность.
- \`filter\` — на современных браузерах тоже композитное, если элемент на отдельном слое.

**Без reflow, но с repaint** (Paint + Composite, без Layout):
- \`color\`, \`background-color\`, \`background-image\` — перерисовка пикселей текущего слоя.
- \`visibility\`, \`box-shadow\`, \`border-color\`.

**Полный reflow** (Layout + Paint + Composite):
- Любые геометрические свойства: \`width\`, \`height\`, \`top\`, \`left\`, \`margin\`, \`padding\`, \`font-size\`, \`display\`, \`position\`.
- Добавление/удаление узлов DOM.

Чтобы \`transform\`/\`opacity\` действительно работали в режиме «только composite», у элемента должен быть свой слой. Браузер создаёт его автоматически в нескольких случаях:
- \`will-change: transform\` или \`will-change: opacity\`.
- \`transform: translateZ(0)\` (исторический хак).
- \`position: fixed\`, \`<video>\`, \`<canvas>\`, элементы с CSS-фильтрами.

Эта оптимизация особенно важна для мобильных устройств — там GPU-композитинг даёт самый заметный выигрыш по FPS и батарее.`,
      followUps: [
        'Чем `transform: translate` отличается от `top/left` для анимаций?',
        'Когда `filter: blur` тоже composite, а когда вызывает paint?',
      ],
      relatedChapterId: 'reflow-repaint-composite',
    },
    {
      id: 'jsbr-iq4',
      question: 'Что такое Largest Contentful Paint и как его улучшить?',
      shortAnswer:
        'LCP — время до отрисовки самого большого видимого элемента (обычно героя-картинки или большого заголовка). Цель — < 2.5 с. Улучшается ускорением сети (CDN, preconnect), оптимизацией картинок (AVIF/WebP, srcset, preload, fetchpriority="high"), inline-критическим CSS, server-side rendering и снижением блокирующего JS.',
      fullAnswer: `**LCP (Largest Contentful Paint)** — одна из трёх Core Web Vitals. Метрика измеряет момент, когда в видимой части страницы появляется самый большой контентный элемент: \`<img>\`, фоновое изображение, видео-постер или большой блок текста. Цель Google — < 2.5 с в 75-м перцентиле реальных пользователей.

**Что обычно становится LCP-элементом:**
- Hero-изображение баннера.
- Большой H1 на лендинге.
- Карточка продукта на главной.

**Как улучшать LCP:**

1. **Сократить TTFB.** CDN, edge-рендеринг, кеширование. Без быстрого ответа сервера остальное не поможет.
2. **Preload LCP-ресурса.** \`<link rel="preload" as="image" href="hero.avif" fetchpriority="high">\` — браузер начнёт загрузку картинки параллельно с парсингом HTML.
3. **\`fetchpriority="high"\` на \`<img>\`** для LCP-картинки. Современный сигнал приоритета.
4. **Оптимизация изображений.** AVIF или WebP, \`srcset\` + \`sizes\` для адаптивных размеров, корректные \`width\`/\`height\` (заодно улучшит CLS).
5. **Inline критический CSS, defer некритичный JS.** Меньше блокирующих ресурсов в \`<head>\`.
6. **Server-Side Rendering / Streaming SSR.** Чистый CSR (например, голый Vite + React) почти всегда хуже по LCP, чем SSR.
7. **Шрифты.** \`<link rel="preload" as="font" crossorigin>\` для критичного шрифта; \`font-display: swap\` или \`optional\`.

**Как измерять.** В Chrome DevTools панель Performance → Timings → LCP-маркер. В проде — Web Vitals API (\`onLCP\` из библиотеки \`web-vitals\`) и RUM-инструменты (Vercel Analytics, SpeedCurve, Sentry).`,
      followUps: [
        'Чем LCP отличается от FCP (First Contentful Paint)?',
        'Когда `fetchpriority="high"` может ухудшить LCP?',
      ],
      relatedChapterId: 'core-web-vitals',
    },
    {
      id: 'jsbr-iq5',
      question: 'Зачем нужен `will-change` и в чём его подвох?',
      shortAnswer:
        '`will-change: transform` подсказывает браузеру: «этот элемент скоро будет анимироваться». Браузер заранее создаёт отдельный compositor layer на GPU, чтобы первый кадр анимации не вызвал «рывок» из-за подъёма на слой. Подвох — каждый layer ест GPU-память; постоянный `will-change` на сотнях элементов даёт обратный эффект и расход батареи.',
      fullAnswer: `**\`will-change\`** — CSS-свойство, которое сообщает браузеру: «этот элемент в ближайшее время будет меняться по таким-то свойствам». На основе этой подсказки браузер заранее выделяет ресурсы — обычно создаёт отдельный compositor layer.

**Зачем это нужно.** Без \`will-change\` первый кадр анимации часто «дёргается»: браузер только в момент изменения замечает, что элемент стоит анимировать, и поднимает его на отдельный слой. Это занимает несколько миллисекунд и даёт визуальный «рывок». \`will-change: transform\` устраняет этот jank: слой создан заранее, переход на анимацию плавный.

**Подвохи и антипаттерны:**

1. **Каждый layer ест GPU-память.** На моделях с 1–2 ГБ RAM (бюджетные Android) переизбыток слоёв приводит к свопам на CPU и обратному эффекту — анимация замедляется.
2. **Постоянный \`will-change\`.** Если поставить его в CSS на класс, который применяется к сотням элементов, — у вас сотни ненужных слоёв.
3. **Применять «на всякий случай»** — особенно \`will-change: auto\` или \`will-change: scroll-position\` без анимации.

**Правильное применение.**
- Ставить **только** на элементы, которые реально анимируются прямо сейчас.
- Снимать (\`will-change: auto\`) после завершения анимации, особенно если она длинная.
- Использовать перед стартом — например, добавлять класс \`.is-animating\` за пару кадров до анимации и убирать после.
- Для CSS-анимаций (\`@keyframes\`) \`will-change\` обычно **не нужен** — браузер сам понимает, что свойство изменяется.

**Альтернативы**: \`transform: translateZ(0)\` (исторический хак подъёма на слой) и \`backface-visibility: hidden\`. Они работают, но менее декларативны и хуже читаются.`,
      followUps: [
        'Когда `transform: translateZ(0)` всё ещё имеет смысл вместо `will-change`?',
        'Как измерить, помог ли `will-change` в конкретной анимации?',
      ],
      relatedChapterId: 'reflow-repaint-composite',
    },
    {
      id: 'jsbr-iq6',
      question: 'Что такое layout thrashing и как его исправить?',
      shortAnswer:
        'Layout thrashing — антипаттерн, когда в одном цикле чередуются запись стиля и чтение геометрии. Каждое чтение принудительно сбрасывает отложенный layout, и reflow выполняется N раз вместо одного. Исправляется разделением фаз: сначала все чтения (READ), затем все записи (WRITE). Альтернатива — fastdom или выполнение записей внутри `requestAnimationFrame`.',
      fullAnswer: `**Layout thrashing** (он же Forced Synchronous Layout) — типовой антипаттерн фронтенда. Возникает, когда в одном тике JS чередуются:

1. **Запись** в DOM или стиль (любое изменение, влияющее на геометрию).
2. **Чтение** геометрического свойства (\`offsetWidth\`, \`offsetHeight\`, \`getBoundingClientRect()\`, \`scrollTop\`, \`getComputedStyle\`).

Браузер обычно откладывает пересчёт layout до конца тика, чтобы пересчитать всё за один проход. Но **чтение** геометрии после записи требует актуального значения — поэтому браузер вынужден синхронно запустить reflow прямо сейчас. Сделали так в цикле из 100 элементов — получили 100 reflow вместо одного.

\`\`\`js
// ❌ thrashing — N reflow
elements.forEach((el) => {
  const w = el.offsetWidth;        // READ → forced reflow
  el.style.width = (w + 10) + 'px'; // WRITE → инвалидация
});

// ✅ batched — 1 reflow
const widths = elements.map((el) => el.offsetWidth); // все READ
elements.forEach((el, i) => {
  el.style.width = (widths[i] + 10) + 'px';          // все WRITE
});
\`\`\`

**Как обнаружить.** В Chrome DevTools → Performance запись помечает forced reflow фиолетовым «Forced reflow is a likely performance bottleneck». Если такие места видны в hot path (особенно при скролле или resize) — нужно фиксить.

**Решения:**
- **Разделение фаз read → write.** Самое простое и универсальное.
- **\`requestAnimationFrame\`.** Внутри rAF layout уже актуален, чтения дешевле; кроме того, записи попадут в текущий кадр без лишнего reflow.
- **Библиотека fastdom.** Очередь чтений и записей, автоматически разделённая по фазам.
- **Кешировать значения.** Если \`offsetWidth\` не меняется в течение цикла — прочитать один раз снаружи.`,
      followUps: [
        'Какие именно методы и свойства считаются «forcing»?',
        'Почему `getComputedStyle` тоже может вызвать reflow?',
      ],
      relatedChapterId: 'reflow-repaint-composite',
    },
    {
      id: 'jsbr-iq7',
      question: 'Как работает lazy loading изображений и какие есть подходы?',
      shortAnswer:
        'Lazy loading — отложенная загрузка изображений до приближения к viewport. Простейший способ — нативный атрибут `loading="lazy"`. Для тонкого контроля (custom rootMargin, blur placeholder, кастомные плейсхолдеры) используют IntersectionObserver. Оба подхода экономят трафик и улучшают LCP, не загружая офф-скрин картинки.',
      fullAnswer: `**Lazy loading** откладывает загрузку изображений до момента, когда они приближаются к области видимости. Это даёт меньший initial payload, лучшую LCP и экономит трафик пользователю.

**1. Нативный \`loading="lazy"\`.**

\`\`\`html
<img src="photo.jpg" loading="lazy" alt="..." width="800" height="600">
\`\`\`

Поддерживается всеми современными браузерами. Не требует JS. Браузер сам решает, насколько заранее начать загрузку (обычно за несколько viewport до появления). Атрибут \`loading="eager"\` — обратный сигнал «это критично, загружай сразу» (обычно для LCP-картинки).

**Важно:** **никогда** не ставить \`loading="lazy"\` на LCP-изображение — это **ухудшит** LCP, потому что браузер отложит загрузку самой важной картинки.

**2. IntersectionObserver.**

Для большего контроля (custom \`rootMargin\`, blur placeholder, аналитика, сложные scrollable контейнеры):

\`\`\`js
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      const img = e.target;
      img.src = img.dataset.src;
      io.unobserve(img);
    }
  }
}, { rootMargin: '200px' });

document.querySelectorAll('img[data-src]').forEach((img) => io.observe(img));
\`\`\`

**3. Прогрессивные плейсхолдеры.**
- **LQIP (Low-Quality Image Placeholder)** — крохотная (например, 20×15 px) копия, скейлится до полного размера и сразу видна, пока загружается оригинал.
- **BlurHash** — компактное (20–30 байт) представление картинки, декодируется в blurry placeholder.
- **Dominant color** — заливка средним цветом до загрузки.

**4. Сервинг адаптивных версий.** \`srcset\` + \`sizes\` или CDN с auto-формат (Cloudinary, ImgIX, Vercel Image, Next.js \`<Image>\`).

**Антипаттерн:** ставить \`loading="lazy"\` на все картинки подряд, включая LCP. Правильно — eager на LCP, lazy на всё ниже первого экрана.`,
      followUps: [
        'Когда IntersectionObserver лучше нативного `loading="lazy"`?',
        'Как BlurHash экономит вес и где он применяется?',
      ],
      relatedChapterId: 'images-and-loading',
    },
  ],

  nextTopics: [
    { slug: 'js-network', reason: 'После рендеринга — сетевой слой: HTTP/2, кеширование, fetch, CORS. Эти темы напрямую влияют на LCP и TTFB.' },
  ],

  related: [
    { kind: 'pitfall', id: 'layout-thrashing', label: 'JS-ловушки: layout thrashing и forced reflow' },
    { kind: 'pattern', id: 'virtual-scroll', label: 'Паттерн: виртуализация длинных списков' },
  ],
};
