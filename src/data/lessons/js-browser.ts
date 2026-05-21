import type { Lesson } from '../../types/lesson';
import { jsBrowserQuiz } from '../quizzes/js-browser';

const Q = Object.fromEntries(jsBrowserQuiz.questions.map((q) => [q.id, q]));

const CHECKPOINT_IDS = new Set(['jsbr-q1', 'jsbr-q2', 'jsbr-q7', 'jsbr-q8']);

export const jsBrowserLesson: Lesson = {
  topicId: 'js-browser',

  intro: {
    whyItMatters: `Браузер не выполняет HTML и CSS — он строит DOM, CSSOM, дерево рендера, считает layout, рисует пиксели и составляет слои для GPU. Этот конвейер называется Critical Rendering Path. Когда страница «тормозит», обычно проблема в одной из его стадий: огромный layout, тяжёлый paint, неоптимизированные изображения, блокирующие скрипты.

На собеседовании по производительности проверяют понимание этапов рендеринга, разницу между reflow / repaint / composite, базовые приёмы оптимизации (lazy-loading изображений, preload, code splitting), а также Core Web Vitals — LCP, FID / INP, CLS.`,
    estimatedMinutes: 30,
    interviewAngle:
      'Интервьюера интересует, как кандидат рассуждает о производительности: умеет ли разделить дорогие операции (layout) и дешёвые (composite), знает ли инструменты профилирования (Performance, Lighthouse), понимает ли влияние изображений и скриптов на LCP.',
    prerequisites: [{ slug: 'js-dom', title: 'DOM и события' }],
  },

  chapters: [
    // ─────────────────────────────────────────────────────────────
    {
      id: 'critical-rendering-path',
      title: 'Critical Rendering Path',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Когда браузер получает HTML, он не показывает страницу мгновенно. Сначала проходит несколько стадий, и каждая стадия зависит от предыдущей. Этот конвейер называется **Critical Rendering Path**.',
        },
        {
          type: 'list',
          content: `1. **HTML → DOM**. Парсер строит дерево объектов из тегов.
2. **CSS → CSSOM**. Параллельно парсятся таблицы стилей. CSS — рендер-блокирующий ресурс: пока он не загрузился и не распарсился, страница не отрисуется.
3. **DOM + CSSOM → Render Tree**. Объединение двух деревьев. \`display: none\` элементы в render tree не попадают.
4. **Layout** (reflow). Расчёт геометрии: ширина, высота, позиция каждого блока.
5. **Paint**. Рисование пикселей в слои: текст, фон, тени, границы.
6. **Composite**. Слои собираются в финальный кадр через GPU.`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'CSS блокирует первый рендер: пока стили не загрузились, браузер не показывает страницу — иначе пользователь увидит «неоформленный» HTML. JS блокирует парсинг HTML: пока скрипт не выполнился, парсер останавливается. \`async\` и \`defer\` снимают эту блокировку.',
        },
        { type: 'heading', content: 'async vs defer' },
        {
          type: 'list',
          content: `\`<script>\` без атрибутов — блокирует HTML-парсер, выполняется сразу.
\`<script async>\` — скрипт загружается параллельно, выполняется как только готов (порядок не гарантирован).
\`<script defer>\` — загружается параллельно, выполняется после полного парсинга HTML, в порядке объявления.
\`<script type="module">\` — по умолчанию ведёт себя как \`defer\`.`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Для скриптов, зависящих от DOM или друг от друга — \`defer\`. Для аналитики и независимых модулей — \`async\`. Инлайн-скрипты до \`</head>\` всегда блокируют рендер — их выносят в файлы или в конец \`<body>\`.',
        },
      ],
      checkpoint: [Q['jsbr-q1']!, {
        type: 'ordering',
        id: 'jsbr-ord1',
        description: 'Расставьте стадии Critical Rendering Path в порядке выполнения',
        items: [
          'Парсинг HTML → DOM',
          'Парсинг CSS → CSSOM',
          'DOM + CSSOM → Render Tree',
          'Layout (расчёт геометрии)',
          'Paint (отрисовка пикселей в слои)',
          'Composite (сборка слоёв на GPU)',
        ],
        explanation:
          'Браузер не может пропустить ни одну стадию. Каждая зависит от предыдущей. Если изменить размер элемента — будут перезапущены Layout, Paint и Composite. Если поменять цвет — только Paint и Composite. Если \`transform\` или \`opacity\` — только Composite.',
      }],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'reflow-repaint-composite',
      title: 'Reflow, Repaint, Composite',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Изменения на странице запускают разные стадии конвейера в зависимости от того, что поменялось. Понимание этой иерархии — основа практической оптимизации.',
        },
        {
          type: 'list',
          content: `**Reflow (layout)** — пересчёт геометрии. Дороже всего. Триггеры: \`width\`, \`height\`, \`top\`, \`left\`, добавление и удаление элементов, чтение \`offsetWidth\`, \`getBoundingClientRect\`.
**Repaint** — перерисовка без изменения геометрии. Триггеры: \`background-color\`, \`color\`, \`box-shadow\`, \`outline\`.
**Composite-only** — только сборка слоёв на GPU. Самое дёшевое. Триггеры: \`transform\`, \`opacity\`, \`filter\` (на новом слое).`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Для анимаций подходят только \`transform\` и \`opacity\` — они работают на стадии Composite и не блокируют главный поток. Анимация через \`width\` / \`top\` запускает reflow на каждый кадр — это причина jank.',
        },
        { type: 'heading', content: 'Layout thrashing' },
        {
          type: 'code',
          language: 'javascript',
          content: `// АНТИПАТТЕРН: чередование чтения и записи в цикле
for (const el of items) {
  const w = el.offsetWidth;          // чтение — force layout
  el.style.width = (w * 2) + 'px';   // запись — инвалидирует layout
}
// n итераций → n перерасчётов layout

// Лучше: сначала все чтения, потом все записи
const widths = items.map((el) => el.offsetWidth);
items.forEach((el, i) => {
  el.style.width = (widths[i] * 2) + 'px';
});`,
        },
        { type: 'heading', content: 'Создание нового слоя' },
        {
          type: 'text',
          content:
            'Браузер выделяет элемент на отдельный composite-слой при условиях: \`transform: translateZ(0)\`, \`will-change\`, \`opacity\` меньше 1, \`position: fixed\`, видео и canvas. Это нужно для анимаций — слой можно двигать на GPU без рекомпозитинга остальной страницы. Но каждый слой потребляет память видеокарты — злоупотреблять \`will-change\` не стоит.',
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            '\`will-change\` ставится только когда анимация действительно нужна, и снимается после завершения. Постоянный \`will-change\` на сотнях элементов — типичный источник чрезмерного расхода видеопамяти на мобильных устройствах.',
        },
      ],
      checkpoint: [Q['jsbr-q2']!, {
        type: 'match-pairs',
        id: 'jsbr-mp1',
        description: 'Сопоставьте свойство CSS с тем, какие стадии конвейера оно запускает',
        pairs: [
          { left: 'width, height, top, left', right: 'Layout → Paint → Composite' },
          { left: 'background-color, color', right: 'Paint → Composite' },
          { left: 'transform, opacity', right: 'Только Composite (на отдельном слое)' },
          { left: 'display: none / display: block', right: 'Layout → Paint → Composite' },
        ],
        explanation:
          'Для анимаций используется только \`transform\` и \`opacity\` — они работают на стадии Composite, не запускают Layout и Paint. Это даёт 60 FPS на любом устройстве.',
      }],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'images-and-loading',
      title: 'Изображения и загрузка ресурсов',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Изображения — самые тяжёлые ресурсы на странице, и они напрямую влияют на LCP (Largest Contentful Paint). Браузер предоставляет несколько инструментов для оптимизации.',
        },
        {
          type: 'list',
          content: `\`loading="lazy"\` — отложенная загрузка изображений за пределами вьюпорта.
\`decoding="async"\` — декодирование вне главного потока (не блокирует layout).
\`fetchpriority="high"\` для критичного hero-изображения, \`"low"\` для фоновых.
\`srcset\` и \`sizes\` — разные разрешения под разные экраны (responsive images).
\`<picture>\` с \`<source type="image/webp">\` — современный формат с fallback.
Указанные \`width\` / \`height\` атрибуты резервируют место и улучшают CLS.`,
        },
        {
          type: 'code',
          language: 'html',
          content: `<picture>
  <source srcset="hero.avif" type="image/avif" />
  <source srcset="hero.webp" type="image/webp" />
  <img
    src="hero.jpg"
    alt="..."
    width="1200" height="600"
    loading="eager"
    fetchpriority="high"
    decoding="async"
  />
</picture>`,
        },
        { type: 'heading', content: 'preload и prefetch' },
        {
          type: 'list',
          content: `\`<link rel="preload" as="image" href="hero.webp">\` — загрузка критичного ресурса с высоким приоритетом, до того как браузер увидит его в HTML.
\`<link rel="prefetch" href="/next.js">\` — загрузка ресурса для следующей навигации, с низким приоритетом.
\`<link rel="preconnect" href="https://api.example.com">\` — заранее установить TCP / TLS-соединение с критическим origin.
\`<link rel="dns-prefetch" href="https://api.example.com">\` — то же, но только DNS-резолв; дешевле, но даёт меньший выигрыш.`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Для LCP важнее всего: указать \`width\` / \`height\` (избежать CLS), использовать \`fetchpriority="high"\` для hero-картинки, загружать её с того же домена что и HTML (избежать лишнего TLS handshake).',
        },
      ],
      checkpoint: [Q['jsbr-q7']!, Q['jsbr-q8']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'core-web-vitals',
      title: 'Core Web Vitals',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Google ввёл три ключевые метрики, по которым ранжирует страницы в поиске и в Lighthouse. Они отражают пользовательский опыт: насколько быстро загрузилась самая важная часть страницы, насколько отзывчив интерфейс, насколько стабилен layout.',
        },
        {
          type: 'list',
          content: `**LCP** (Largest Contentful Paint) — время до отрисовки самого большого видимого элемента. Хорошо < 2.5 с.
**INP** (Interaction to Next Paint) — задержка между взаимодействием пользователя и ответом UI. Заменил FID. Хорошо < 200 мс.
**CLS** (Cumulative Layout Shift) — суммарный сдвиг макета. Хорошо < 0.1.`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Частая причина плохого CLS — изображения без атрибутов \`width\` и \`height\`. Браузер не знает их размера до загрузки, поэтому верстка «прыгает», когда картинка наконец появилась. То же касается шрифтов — помогает \`font-display: optional\` или предварительная загрузка.',
        },
        { type: 'heading', content: 'Как улучшить LCP' },
        {
          type: 'list',
          content: `Серверный рендеринг или предварительная отдача HTML.
\`fetchpriority="high"\` для hero-изображения и критичных скриптов.
Минимизация рендер-блокирующего CSS и JS.
Кэширование и CDN для статики.
\`preconnect\` к доменам с критичными ресурсами.`,
        },
        { type: 'heading', content: 'Как улучшить INP' },
        {
          type: 'list',
          content: `Разбивать long tasks дольше 50 мс на чанки через \`setTimeout\` или \`scheduler.yield\`.
Тяжёлые вычисления — в Web Worker.
\`debounce\` и \`throttle\` для частых событий (ввод, скролл, resize).
Минимизировать работу в обработчиках кликов, обновлять состояние через \`requestAnimationFrame\`.`,
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'pitfalls',
      title: 'Подводные камни',
      estimatedMinutes: 4,
      blocks: [
        { type: 'heading', content: 'Layout thrashing в горячем цикле' },
        {
          type: 'text',
          content:
            'Частая ошибка — чередовать чтение и запись в цикле, что заставляет браузер пересчитывать layout многократно. Операции стоит группировать: сначала все \`offsetWidth\` / \`getBoundingClientRect\`, потом все \`style.X = ...\`.',
        },
        { type: 'heading', content: 'Inline-стили в hot path' },
        {
          type: 'text',
          content:
            'Запись в \`element.style.X\` инвалидирует кеш стилей. На массовых обновлениях быстрее переключить класс на родителе или использовать CSS-переменные.',
        },
        { type: 'heading', content: 'Слишком много composite-слоёв' },
        {
          type: 'text',
          content:
            'Каждый \`will-change\`, \`transform: translateZ(0)\`, \`position: fixed\` создаёт новый слой. Слои живут в видеопамяти. На сотнях элементов это перегружает GPU на мобильных устройствах. \`will-change\` имеет смысл ставить только перед началом анимации и снимать после её завершения.',
        },
        { type: 'heading', content: 'Шрифты без font-display' },
        {
          type: 'text',
          content:
            'По умолчанию браузер ждёт загрузки шрифта до 3 секунд, показывая «невидимый текст» (FOIT). \`font-display: swap\` показывает текст системным шрифтом сразу, а потом подменяет — компромисс между чтением и стилем. \`font-display: optional\` лучше для CLS: если шрифт не успел за 100 мс — он не применится в этом визите.',
        },
        { type: 'heading', content: 'document.write и блокирующие скрипты' },
        {
          type: 'text',
          content:
            '\`document.write\` после загрузки страницы стирает DOM. \`document.write\` в синхронном скрипте блокирует парсер. В современном коде этот API не применяется — он остался со времён до появления \`innerHTML\`.',
        },
      ],
    },
  ],

  finalQuiz: jsBrowserQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  cheatsheet: `### Шпаргалка по работе браузера

**Critical Rendering Path**
1. HTML → DOM
2. CSS → CSSOM (рендер-блокирующий)
3. DOM + CSSOM → Render Tree
4. Layout — геометрия
5. Paint — пиксели в слои
6. Composite — сборка на GPU

**Скрипты**
- \`<script>\` блокирует парсер
- \`<script defer>\` — после парсинга, в порядке объявления
- \`<script async>\` — как только готов
- \`<script type="module">\` — по умолчанию ведёт себя как defer

**Reflow / Repaint / Composite**
- \`width\`, \`height\`, \`top\`, \`left\` → Layout + Paint + Composite
- \`background-color\`, \`color\` → Paint + Composite
- \`transform\`, \`opacity\` → только Composite
- Для анимаций — только \`transform\` и \`opacity\`

**Layout thrashing**
- Group reads → group writes
- \`offsetWidth\` / \`getBoundingClientRect\` принуждают синхронный layout
- Inline-стили в цикле — медленно, лучше переключение класса

**Изображения**
- \`loading="lazy"\`, \`decoding="async"\`, \`fetchpriority="high"\`
- \`srcset\` / \`sizes\` для разных экранов
- \`<picture>\` с AVIF / WebP и JPEG fallback
- Атрибуты \`width\` / \`height\` — избежать CLS

**Resource hints**
- \`preload\` — критичный ресурс, высокий приоритет
- \`prefetch\` — ресурс для следующей навигации, низкий приоритет
- \`preconnect\` — заранее установить TCP / TLS
- \`dns-prefetch\` — только DNS

**Core Web Vitals**
- LCP — самый большой элемент < 2.5 с
- INP — отзывчивость < 200 мс
- CLS — стабильность макета < 0.1

**Подводные камни**
- Layout thrashing в hot path
- Слишком много \`will-change\` → перегрузка GPU
- Шрифты без \`font-display\` → FOIT или CLS
- \`document.write\` — никогда`,

  nextTopics: [
    {
      slug: 'sd-rendering',
      reason:
        'После критического рендеринга логично разобрать стратегии рендеринга: CSR, SSR, SSG, ISR, streaming, hydration.',
    },
    {
      slug: 'sd-performance',
      reason:
        'Углублённое продолжение: бюджет бандла, code splitting, lazy / preload, оптимизация изображений на уровне системного дизайна.',
    },
  ],
};
