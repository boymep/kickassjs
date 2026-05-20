import type { Lesson } from "../../types/lesson";
import type { QuizQuestion } from "../../types/quiz";
import type { Flashcard } from "../../types/flashcard";

// =============================================================================
// Quiz pool. Часть вопросов идёт в checkpoint глав, остальные — в финальный
// квиз. Идентификаторы checkpoint и finalQuiz не пересекаются.
// =============================================================================

const quizQuestions: QuizQuestion[] = [
  {
    type: "fill-blank",
    id: "sdp-q1",
    description:
      "Допишите название Core Web Vital, который измеряет время отрисовки самого крупного видимого элемента (картинка/заголовок) и должен быть < 2.5 с на p75.",
    codeWithBlanks: `// PerformanceObserver
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(entry.element, entry.startTime); // __BLANK__
  }
}).observe({ type: 'largest-contentful-paint', buffered: true });`,
    options: ["FCP", "LCP", "INP", "CLS"],
    correctIndex: 1,
    explanation:
      "LCP (Largest Contentful Paint) измеряет момент, когда отрисован самый большой видимый блок (обычно hero-картинка или заголовок). Цель — < 2.5 секунды на 75-м перцентиле сессий. Браузер обновляет «кандидата» по мере загрузки, финальное значение фиксируется на первом взаимодействии пользователя.",
  },
  {
    type: "output",
    id: "sdp-q2",
    description:
      "Какой Core Web Vital пришёл на смену FID в марте 2024 и измеряет p98 задержки всех взаимодействий за сессию?",
    code: `// chromium вычисляет наихудшую задержку из ~50 взаимодействий
// (клики, тапы, нажатия клавиш) и берёт почти максимум (p98).
// Цель: < 200 мс. Плохо: > 500 мс.`,
    options: [
      "TTFB (Time To First Byte)",
      "INP (Interaction to Next Paint)",
      "TBT (Total Blocking Time)",
      "CLS (Cumulative Layout Shift)",
    ],
    correctIndex: 1,
    explanation:
      "INP (Interaction to Next Paint) с 12 марта 2024 заменил FID в Core Web Vitals. В отличие от FID (только первое взаимодействие, только input delay), INP измеряет полный цикл «нажатие → следующий paint» для всех взаимодействий и берёт почти максимум. Хороший INP < 200 мс, требует оптимизации обработчиков, debounce и yielding на main thread.",
  },
  {
    type: "fill-blank",
    id: "sdp-q3",
    description:
      "Какой Core Web Vital измеряет визуальную стабильность и должен быть < 0.1?",
    codeWithBlanks: `// CLS = Σ (impact fraction × distance fraction)
// для каждого неожиданного сдвига в окне 5 с.
// Хорошо: < 0.1. Нужно улучшить: 0.1–0.25. Плохо: > 0.25.
const score = /* __BLANK__ */;`,
    options: ["LCP", "CLS", "INP", "FCP"],
    correctIndex: 1,
    explanation:
      "CLS (Cumulative Layout Shift) накапливает сдвиги макета, не вызванные пользовательским взаимодействием. Источники: картинки без width/height, шрифты без font-display: optional, поздно вставленные баннеры/реклама. Цель — < 0.1 на p75. Резервировать место под медиа-контент через aspect-ratio или width/height — самое эффективное лечение.",
  },
  {
    type: "output",
    id: "sdp-q4",
    description:
      "В чём разница между RUM (Real User Monitoring) и synthetic-тестами вроде Lighthouse?",
    code: `// RUM: web-vitals.js собирает реальные метрики у юзеров.
// Synthetic: Lighthouse / WebPageTest запускают браузер на CI.
import { onLCP, onINP, onCLS } from 'web-vitals';
onLCP((m) => beacon('/rum', m));
onINP((m) => beacon('/rum', m));
onCLS((m) => beacon('/rum', m));`,
    options: [
      "RUM и synthetic дают одинаковые числа, потому что оба измеряют одни и те же метрики",
      "RUM показывает реальное распределение по устройствам и сетям пользователей; synthetic — воспроизводимая лабораторная цифра без шума",
      "RUM работает только на сервере, synthetic — только в браузере",
      "Lighthouse измеряет только TTFB, web-vitals — только LCP",
    ],
    correctIndex: 1,
    explanation:
      "Synthetic (lab) даёт стабильное число для регрессионного тестирования в CI, но не отражает реальные условия. RUM (field) собирает p75/p95 по всем сессиям пользователей с их устройствами, сетями и кэшем. Только RUM подтверждает, что Core Web Vitals соответствуют порогам Google. Промышленный стандарт — оба источника одновременно.",
  },
  {
    type: "fill-blank",
    id: "sdp-q5",
    description:
      "Какой `<link>`-атрибут используется для критического ресурса, нужного на текущей странице (например, hero-картинки или шрифта)?",
    codeWithBlanks: `<link rel="__BLANK__" as="image" href="/hero.avif" fetchpriority="high">`,
    options: ["prefetch", "preload", "preconnect", "dns-prefetch"],
    correctIndex: 1,
    explanation:
      'rel="preload" говорит браузеру: ресурс понадобится скоро на этой же странице, начни скачивать с высоким приоритетом. Обязателен атрибут as (image/font/script/style), без него preload игнорируется. prefetch — для будущей навигации (низкий приоритет). preconnect открывает TCP+TLS-соединение заранее.',
  },
  {
    type: "output",
    id: "sdp-q6",
    description: "В чём разница между <script defer> и <script async>?",
    code: `<script src="a.js" defer></script>
<script src="b.js" async></script>
<script src="c.js" defer></script>`,
    options: [
      "Оба варианта блокируют HTML-парсер и выполняются синхронно",
      "defer — скачивается параллельно, выполняется после парсинга HTML и сохраняет порядок; async — выполняется сразу после загрузки в произвольном порядке",
      "async — для модулей, defer — для классических скриптов",
      "defer и async — синонимы, разницы нет",
    ],
    correctIndex: 1,
    explanation:
      'defer не блокирует парсинг HTML, скрипт выполняется в порядке объявления после DOMContentLoaded. async тоже не блокирует, но выполняется как только загрузится — порядок не гарантирован. Для зависимых модулей берите defer, для независимых аналитик и трекеров — async. type="module" по умолчанию ведёт себя как defer.',
  },
  {
    type: "fill-blank",
    id: "sdp-q7",
    description:
      "Какой современный формат изображений даёт сжатие лучше WebP и поддерживается в Chrome/Edge/Firefox/Safari 16.4+?",
    codeWithBlanks: `<picture>
  <source type="image/__BLANK__" srcset="/hero.__BLANK__">
  <source type="image/webp" srcset="/hero.webp">
  <img src="/hero.jpg" alt="" width="1200" height="630" loading="lazy">
</picture>`,
    options: ["heic", "avif", "jxl", "jp2"],
    correctIndex: 1,
    explanation:
      "AVIF (AV1 Image Format) обычно даёт на 20–50% меньший размер при том же качестве, чем WebP, и заметно меньший, чем JPEG. Поддержка: Chrome/Edge с 2020, Firefox с 2021, Safari 16.4+ с марта 2023. Стандартный паттерн — <picture> с фолбэком: AVIF → WebP → JPEG. JPEG XL пока не имеет массовой поддержки.",
  },
  {
    type: "output",
    id: "sdp-q8",
    description: 'Что делает атрибут loading="lazy" на <img>?',
    code: `<img src="/photo.jpg" alt="" loading="lazy" width="800" height="600">`,
    options: [
      "Полностью отключает загрузку картинки до клика пользователя",
      "Откладывает загрузку картинок, находящихся далеко от viewport, до скролла; не применяется к hero-изображениям над сгибом",
      "Применяет low-quality placeholder вместо реальной картинки",
      "Загружает картинку только при наличии IntersectionObserver-полифилла",
    ],
    correctIndex: 1,
    explanation:
      'Нативный lazy-loading реализован браузерами через эвристику расстояния до viewport: близкие картинки качаются сразу, дальние — только при скролле. Для LCP-кандидатов (hero) lazy НЕЛЬЗЯ ставить — он откладывает загрузку и ухудшает LCP. На hero ставьте fetchpriority="high".',
  },
  {
    type: "fill-blank",
    id: "sdp-q9",
    description:
      "Какой webpack/Rollup-механизм удаляет неиспользуемый экспорт из бандла на основе статического анализа ESM?",
    codeWithBlanks: `// utils.js
export function used() {}
export function unused() {} // не попадёт в финальный бандл

// app.js
import { used } from './utils';
used();
// Это работает благодаря __BLANK__`,
    options: [
      "code splitting",
      "tree shaking",
      "minification",
      "scope hoisting",
    ],
    correctIndex: 1,
    explanation:
      'Tree shaking — удаление мёртвого кода через статический анализ ESM-импортов. Работает только с ES-модулями (import/export), не с CommonJS. Включить: "sideEffects": false в package.json и production-режим бандлера. Code splitting — разделение на чанки, minification — сжатие, scope hoisting — инлайнинг модулей в одну функцию.',
  },
  {
    type: "output",
    id: "sdp-q10",
    description: "Когда имеет смысл выносить вычисление в Web Worker?",
    code: `const worker = new Worker('/parse.js');
worker.postMessage(largeJson);
worker.onmessage = (e) => render(e.data);`,
    options: [
      "Всегда — Web Worker ускоряет любой код в 2 раза",
      "Когда задача занимает > 50 мс на main thread и блокирует INP/анимации (парсинг больших JSON, диффы, image processing, fuzzy search)",
      "Только когда нужно работать с DOM в фоне",
      "Только для сетевых запросов вместо fetch",
    ],
    correctIndex: 1,
    explanation:
      "Web Worker нужен, чтобы убрать тяжёлый CPU-bound код с main thread и не блокировать рендер/INP. Подходит для: парсинг больших JSON/CSV, fuzzy-поиск, шифрование, image processing. Не работает с DOM. Цена: serialization через postMessage (или Transferable Objects / SharedArrayBuffer для больших данных), холодный старт ~10–30 мс.",
  },
  {
    type: "fill-blank",
    id: "sdp-q11",
    description:
      "Какие CSS-свойства можно изменять без reflow и repaint, оставаясь только на стадии compositing (GPU)?",
    codeWithBlanks: `.card {
  /* анимируем без layout/paint: */
  transition: __BLANK__ 200ms, opacity 200ms;
  will-change: transform;
}`,
    options: ["width, height", "top, left", "transform", "margin"],
    correctIndex: 2,
    explanation:
      "transform и opacity — единственные свойства, которые можно анимировать только на этапе compositing (GPU), без reflow и repaint. width/height/top/left/margin вызывают reflow всего поддерева. will-change: transform поднимает элемент на отдельный композитный слой, чтобы анимация шла на GPU. Это ключевая техника для 60 FPS.",
  },
  {
    type: "output",
    id: "sdp-q12",
    description: "Что такое performance budget и как его контролируют в CI?",
    code: `// lighthouse-ci config
{
  "assertions": {
    "categories:performance": ["error", { "minScore": 0.9 }],
    "resource-summary:script:size": ["error", { "maxNumericValue": 170000 }]
  }
}`,
    options: [
      "Это документ, который никто не читает",
      "Жёсткие лимиты на размер бандла, метрики и ресурсы; CI блокирует merge при их превышении",
      "Только размер CSS, JS не считается",
      "Бюджет тратится за счёт пользователя — это про оплату трафика",
    ],
    correctIndex: 1,
    explanation:
      "Performance budget — заранее согласованные лимиты на размер бандлов (например, < 170 кБ JS gzip), TTFB, LCP, INP. Контролируется через Lighthouse CI, bundlewatch, size-limit. При превышении CI падает, и PR нельзя смерджить без явного исключения. Это превращает производительность из «полировки в конце» в инженерную дисциплину.",
  },
  {
    type: "fill-blank",
    id: "sdp-q13",
    description:
      "Какой атрибут на <img> подсказывает браузеру максимально приоритизировать загрузку (Priority Hints)?",
    codeWithBlanks: `<img src="/hero.avif" alt="" __BLANK__="high" width="1200" height="630">`,
    options: ["priority", "fetchpriority", "importance", "rel"],
    correctIndex: 1,
    explanation:
      'fetchpriority="high" — стандартизованный Priority Hints API (Chrome 101+, Safari 17.2+). Поднимает приоритет ресурса для loader\'а браузера. Применяется к LCP-картинке, критическим скриптам, важным fetch. fetchpriority="low" — для внеэкранного контента и аналитики. Раньше существовал атрибут importance — устаревшее имя.',
  },
  {
    type: "output",
    id: "sdp-q14",
    description:
      "Что эффективнее всего сократит TTI и INP крупного React-приложения?",
    code: `// 1.4 МБ JS-бандла, 200 мс блокировки на mid-tier Android.`,
    options: [
      "Заменить все картинки на AVIF",
      "Code splitting по роутам + dynamic import тяжёлых компонентов + перенос CPU-bound кода в Web Worker",
      "Включить gzip на сервере (уже включён)",
      "Перейти с React на Vue",
    ],
    correctIndex: 1,
    explanation:
      "TTI и INP в большом SPA упираются в размер JS-бандла и блокировки main thread. Самые эффективные техники: route-level code splitting (React.lazy + Suspense), dynamic import редко используемых компонентов (модалок, графиков), перенос тяжёлых вычислений в Web Worker, и tree shaking. AVIF улучшит LCP, но не TTI/INP — это разные оси оптимизации.",
  },
];

const Q = Object.fromEntries(quizQuestions.map((q) => [q.id, q]));

const CHECKPOINT_IDS = new Set(["sdp-q1", "sdp-q5", "sdp-q7", "sdp-q11"]);

// =============================================================================
// Flashcards
// =============================================================================

const flashcards: Flashcard[] = [
  {
    id: "sdp-f1",
    question: "Что такое Core Web Vitals и какие пороги у LCP, INP, CLS?",
    answer:
      "Три ключевые метрики Google для UX: LCP (Largest Contentful Paint) — < 2.5 с, INP (Interaction to Next Paint) — < 200 мс, CLS (Cumulative Layout Shift) — < 0.1. Все пороги проверяются на 75-м перцентиле реальных сессий за 28 дней. Влияют на ранжирование в Google Search.",
    keyPoints: [
      "LCP < 2.5 с (хорошо), 2.5–4 с (требуется улучшение), > 4 с (плохо)",
      "INP < 200 мс / 200–500 мс / > 500 мс",
      "CLS < 0.1 / 0.1–0.25 / > 0.25",
      "Считаются на p75 RUM за 28 дней",
      "Замена FID на INP произошла 12 марта 2024",
    ],
  },
  {
    id: "sdp-f2",
    question: "Что такое LCP и как его улучшить?",
    answer:
      'LCP — время до отрисовки самого большого видимого элемента (картинка, видео-постер, заголовок). Цель < 2.5 с. Улучшается через быстрый TTFB, preload LCP-картинки, fetchpriority="high", сжатие AVIF/WebP, удаление render-blocking ресурсов и серверный рендер.',
    keyPoints: [
      "Кандидат — самый большой image/video/text-блок в viewport",
      'Топ-приёмы: preload + fetchpriority="high" на hero',
      'Не ставить loading="lazy" на LCP-картинку',
      "Использовать AVIF/WebP, srcset под устройство",
      "Минимизировать render-blocking CSS и JS",
    ],
    code: `<link rel="preload" as="image" href="/hero.avif" fetchpriority="high">
<img src="/hero.avif" alt="" fetchpriority="high"
     width="1200" height="630">`,
    codeLanguage: "html",
  },
  {
    id: "sdp-f3",
    question: "Что такое INP и чем отличается от FID?",
    answer:
      "INP (Interaction to Next Paint) — почти максимум (p98) задержки «взаимодействие → следующий paint» по всем кликам/тапам/клавишам за сессию. Заменил FID в марте 2024. FID учитывал только первое взаимодействие и только input delay; INP — полный цикл, включая обработчик и рендер.",
    keyPoints: [
      "FID = первое взаимодействие, только input delay",
      "INP = все взаимодействия, input delay + processing + presentation",
      "Цель < 200 мс на p75",
      "Лечение: short tasks (< 50 мс), debounce, scheduler.yield(), Web Workers",
      "INP стал Core Web Vital 12.03.2024",
    ],
  },
  {
    id: "sdp-f4",
    question: "Что такое CLS и как его уменьшить?",
    answer:
      "CLS — сумма «неожиданных» сдвигов макета за сессию. Вызывается картинками/iframe без width/height, поздними шрифтами, late-инжектируемыми баннерами. Лечится резервированием места: width/height на медиа, aspect-ratio, font-display: optional, min-height для динамического контента.",
    keyPoints: [
      "Цель < 0.1 на p75",
      "Всегда указывать width и height у <img>, <video>, <iframe>",
      "CSS aspect-ratio для responsive-картинок",
      "font-display: optional или size-adjust для шрифтов",
      "Пользовательское взаимодействие в окне 500 мс не считается",
    ],
  },
  {
    id: "sdp-f5",
    question: "RUM vs Synthetic monitoring — в чём разница?",
    answer:
      "RUM (Real User Monitoring) собирает метрики у настоящих пользователей через web-vitals.js → бэкенд (CrUX, Datadog, Sentry). Synthetic — лабораторные прогоны (Lighthouse, WebPageTest, SpeedCurve) на CI с фиксированной конфигурацией. RUM показывает правду, synthetic ловит регрессии.",
    keyPoints: [
      "RUM = field data, p75 по реальным устройствам",
      "Synthetic = lab data, повторяемый запуск в CI",
      "Только RUM влияет на Google Search ranking (CrUX)",
      "Synthetic ловит регрессии в PR ещё до релиза",
      "Промышленный setup: оба источника + алерты",
    ],
  },
  {
    id: "sdp-f6",
    question: "Что такое performance budget?",
    answer:
      "Заранее согласованные жёсткие лимиты на размер ресурсов и метрики: например, < 170 кБ JS gzip, LCP < 2.5 с, INP < 200 мс. Проверяются в CI через Lighthouse CI, bundlewatch, size-limit. Превышение блокирует merge, превращая перформанс в инженерную дисциплину.",
    keyPoints: [
      "Типичные лимиты: 170 кБ JS gzip, 100 кБ CSS, 1 МБ images",
      "Инструменты: Lighthouse CI, size-limit, bundlewatch",
      "Бюджеты на основе RUM-данных конкурентов и устройств аудитории",
      "Бюджет должен соответствовать P75-устройству вашей аудитории",
      "Превышение блокирует merge или требует явного waiver",
    ],
  },
  {
    id: "sdp-f7",
    question: "Чем отличаются preload, prefetch, preconnect и dns-prefetch?",
    answer:
      "preload — критический ресурс этой страницы (высокий приоритет, требует as=). prefetch — ресурс будущей навигации (idle-приоритет). preconnect — TCP+TLS handshake к origin заранее. dns-prefetch — только DNS-резолв, дешевле preconnect.",
    keyPoints: [
      'preload as="image|font|script|style" для текущей страницы',
      "prefetch — для следующей навигации (low priority)",
      "preconnect — экономит ~100–500 мс на TLS handshake",
      "dns-prefetch — fallback для старых браузеров и третьих доменов",
      "modulepreload — для ESM-модулей (preload + parse hint)",
    ],
    code: `<link rel="preload" as="image" href="/hero.avif" fetchpriority="high">
<link rel="preconnect" href="https://api.example.com" crossorigin>
<link rel="dns-prefetch" href="https://cdn.example.com">
<link rel="prefetch" href="/next-page-data.json">`,
    codeLanguage: "html",
  },
  {
    id: "sdp-f8",
    question: "defer vs async vs обычный <script>",
    answer:
      'Обычный — блокирует HTML-парсер и выполняется синхронно. defer — параллельно скачивается, выполняется после парсинга в порядке объявления. async — параллельно скачивается, выполняется сразу при загрузке, порядок не гарантирован. type="module" = defer по умолчанию.',
    keyPoints: [
      "Обычный: download + execute блокируют парсер",
      "defer: после DOMContentLoaded, в порядке объявления",
      "async: как только загрузился, в произвольном порядке",
      "Используйте defer для зависимых скриптов, async — для аналитики",
      'type="module" — defer-семантика по умолчанию',
    ],
  },
  {
    id: "sdp-f9",
    question: "Как оптимизировать изображения для веба?",
    answer:
      'Современные форматы: AVIF (≈-30% к WebP) → WebP (≈-25% к JPEG) → JPEG fallback через <picture>. Адаптивные размеры через srcset/sizes. width/height обязательны для CLS. loading="lazy" на офскрин, fetchpriority="high" на LCP-кандидат.',
    keyPoints: [
      "Формат: <picture> с AVIF → WebP → JPEG/PNG",
      "srcset/sizes для DPR и breakpoints",
      "width + height (или aspect-ratio) против CLS",
      'loading="lazy" — для всего, что ниже сгиба',
      'fetchpriority="high" — для hero-картинки',
      "CDN с on-the-fly resize: Cloudinary, imgix, Vercel /_next/image",
    ],
  },
  {
    id: "sdp-f10",
    question: "Что такое code splitting и tree shaking?",
    answer:
      "Code splitting — разделение бандла на чанки, загружаемые по требованию (по роуту, по dynamic import). Tree shaking — удаление неиспользуемого кода из ESM на этапе сборки. Вместе уменьшают первый JS до десятков килобайт.",
    keyPoints: [
      "Code splitting: React.lazy + Suspense, dynamic import()",
      "Route-based splitting — самый эффективный",
      "Tree shaking требует ESM (не работает с CommonJS)",
      '"sideEffects": false в package.json для агрессивного DCE',
      "Bundle analyzer (rollup-plugin-visualizer, webpack-bundle-analyzer)",
    ],
    code: `// React.lazy + Suspense
const Settings = lazy(() => import('./Settings'));

<Suspense fallback={<Spinner />}>
  <Settings />
</Suspense>`,
    codeLanguage: "tsx",
  },
  {
    id: "sdp-f11",
    question: "Когда использовать Web Worker?",
    answer:
      "Когда CPU-bound задача занимает > 50 мс на main thread и блокирует INP/анимации: парсинг большого JSON/CSV, fuzzy search, шифрование, image/audio processing, диффы. Worker не имеет DOM, общается через postMessage (или Transferable Objects).",
    keyPoints: [
      "CPU-bound > 50 мс — кандидат на Web Worker",
      "Серверный код, парсинг, шифрование, поиск",
      "Нет DOM, нет window — только self, fetch, IndexedDB",
      "postMessage клонирует, Transferable Objects переносит без копии",
      "Холодный старт ~10–30 мс — не нужен для мелких задач",
      "Comlink упрощает RPC между main и worker",
    ],
  },
  {
    id: "sdp-f12",
    question: "Какие CSS-свойства анимируются без reflow/repaint?",
    answer:
      "Только transform и opacity остаются на стадии compositing и идут на GPU. Любые геометрические свойства (width, height, top, left, margin, padding) вызывают reflow всего поддерева. will-change: transform поднимает элемент на отдельный композитный слой.",
    keyPoints: [
      "transform: translate/scale/rotate — compositing only",
      "opacity — compositing only",
      "width, height, top, left, margin, padding — reflow",
      "color, background-color — repaint без reflow",
      "will-change: transform — отдельный composite layer",
      "Цель — 60 FPS = 16.6 мс на кадр",
    ],
  },
  {
    id: "sdp-f13",
    question: "Что такое critical CSS и как его применить?",
    answer:
      'Critical CSS — стили, нужные для отрисовки того, что выше сгиба (above-the-fold). Инлайнятся в <head> через <style>, остальной CSS грузится асинхронно через media-trick или rel="preload". Уменьшает render-blocking и улучшает LCP/FCP.',
    keyPoints: [
      "Инлайн critical CSS в <style> в <head>",
      'Полный CSS грузится через <link rel="preload" as="style" onload>',
      "Инструменты: critters (Next.js), penthouse, critical",
      "Не делать вручную — генерировать на этапе сборки",
      "Размер inline CSS < 14 кБ (первый TCP-сегмент)",
    ],
  },
  {
    id: "sdp-f14",
    question: "Как измерить hydration cost в SSR-приложении?",
    answer:
      "Через PerformanceObserver longtask-entries в момент после FCP, через React Profiler API, или Long Animation Frames (LoAF) API. Обычно гидрация — самая большая длинная задача после загрузки JS. Снижается через RSC, islands, partial hydration, code splitting.",
    keyPoints: [
      'PerformanceObserver({ type: "longtask" }) ловит блокировки > 50 мс',
      "Long Animation Frames API даёт детальный breakdown",
      "React DevTools Profiler показывает время mount компонентов",
      "TTI = FCP + время до конца hydration",
      "Меньше JS на клиенте = быстрее hydration (RSC, islands)",
    ],
  },
  {
    id: "sdp-f15",
    question: "Что такое long task и почему он опасен?",
    answer:
      "Long task — выполнение JS на main thread > 50 мс без yield. Блокирует обработку ввода (страдает INP), отрисовку, скролл. Долгие задачи разбивают на куски через scheduler.yield(), MessageChannel, requestIdleCallback или выносят в Web Worker.",
    keyPoints: [
      "Long task: > 50 мс на main thread",
      "Блокирует INP, скролл, анимации",
      "TBT (Total Blocking Time) = Σ(длинных задач − 50 мс)",
      "Yielding: scheduler.yield() (Chrome), setTimeout(0), MessageChannel",
      'PerformanceObserver({ type: "longtask" }) для мониторинга',
      "Альтернатива — Web Worker для CPU-тяжёлого кода",
    ],
  },
];

// =============================================================================
// Lesson
// =============================================================================

export const sdPerformanceLesson: Lesson = {
  topicId: "sd-performance",

  intro: {
    whyItMatters: `Производительность фронтенда — это не «полировка в конце», а инженерная характеристика продукта, которую измеряют и контролируют так же, как покрытие тестами. Google с 2020 года учитывает **Core Web Vitals** в поисковом ранжировании: **LCP** (время до появления главного контента) должен быть < 2.5 с, **INP** (время отклика на взаимодействие) — < 200 мс, **CLS** (насколько страница «прыгает» при загрузке) — < 0.1. Каждые лишние 100 мс задержки Amazon и Walmart связывают с 1–7% потерей продаж.

Профессиональный подход — измерять из двух источников одновременно. **RUM** (Real User Monitoring) — данные с реальных устройств пользователей через web-vitals.js. Показывает правду о том, как ваш сайт работает на дешёвом Android в 3G. **Synthetic** (Lighthouse CI, WebPageTest) — автоматические проверки в каждом PR в управляемой среде. Ловит регрессии до того, как они попадут в прод. На основе этих данных команда устанавливает **performance budget** — жёсткие лимиты: например, не больше 170 КБ JS после сжатия. CI блокирует merge при превышении.

Техники оптимизации делятся по тому, что именно они улучшают. **Загрузка**: code splitting, lazy import, preload для критичных ресурсов. **Рендер**: анимации только через \`transform\`/\`opacity\`, \`will-change\` для тяжёлых элементов, critical CSS. **Ресурсы**: AVIF/WebP вместо JPEG/PNG, \`srcset\` для разных экранов, \`loading="lazy"\` для картинок вне экрана. **CPU**: Web Workers для тяжёлых вычислений, tree shaking для удаления мёртвого кода.

Зная эти техники и то, на какую метрику каждая из них влияет, вы сможете давать конкретные ответы на интервью — не «оптимизировать бандл», а «вот что именно и почему».`,
    estimatedMinutes: 45,
    interviewAngle:
      "Senior-интервьюер проверяет не знание определений, а умение поставить диагноз: «У страницы LCP 4 секунды на mid-tier Android — что вы будете делать в первые 30 минут?» Сильный кандидат различает RUM и synthetic, знает пороги Core Web Vitals наизусть, понимает, что lazy на hero-картинке портит LCP, и не путает оси оптимизации (LCP / INP / TTI / CLS).",
    prerequisites: [{ slug: "js-browser", title: "Работа браузера" }],
  },

  resources: {
    videos: [
      {
        source: "youtube",
        id: "AQqFZ5t8uNc",
        title: "Optimize for Core Web Vitals",
        channel: "Chrome for Developers",
        language: "en",
        durationSec: 18 * 60,
        description:
          "Addy Osmani и команда Chrome подробно разбирают LCP, INP, CLS и стандартный набор техник: preload, fetchpriority, AVIF, font-display. Лучшее видео для входа в тему.",
      },
      {
        source: "youtube",
        id: "YJGCZCaIZkQ",
        title:
          "Speed at Scale: Web Performance Tips and Tricks (Google I/O 2019)",
        channel: "Chrome for Developers",
        language: "en",
        durationSec: 35 * 60,
        description:
          "Houssein Djirdeh и Addy Osmani показывают системный подход к производительности на масштабе: бюджеты, RUM, code splitting, image optimization, lazy hydration. Многие техники остаются актуальными.",
      },
      {
        source: "youtube",
        id: "6Ljq-Jn-EgU",
        title:
          "Web Performance: Leveraging the Metrics that Most Affect User Experience",
        channel: "Chrome for Developers",
        language: "en",
        durationSec: 35 * 60,
        description:
          "Доклад с Google I/O про связь метрик и реальных KPI продукта (конверсия, отказы). Помогает обосновывать перформанс-инвестиции перед менеджментом.",
      },
    ],
    links: [
      {
        url: "https://web.dev/articles/vitals",
        title: "Web Vitals — web.dev",
        source: "web-dev",
        language: "en",
        note: "Канонический справочник Google по Core Web Vitals: определения, пороги, методы измерения, история (FID → INP).",
      },
      {
        url: "https://web.dev/articles/performance-budgets-101",
        title: "Performance budgets 101 — web.dev",
        source: "web-dev",
        language: "en",
        note: "Как составить и контролировать performance budget: метрики, лимиты на ресурсы, интеграция с Lighthouse CI.",
      },
      {
        url: "https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading",
        title: "Lazy loading — MDN",
        source: "mdn",
        language: "en",
        note: 'Подробный разбор loading="lazy" для img/iframe, IntersectionObserver-фолбэков и динамического импорта модулей.',
      },
      {
        url: "https://web.dev/articles/inp",
        title: "Interaction to Next Paint (INP) — web.dev",
        source: "web-dev",
        language: "en",
        note: "Что такое INP, как измерять, типичные источники медленных взаимодействий и стратегии оптимизации.",
      },
      {
        url: "https://web.dev/articles/optimize-lcp",
        title: "Optimize Largest Contentful Paint — web.dev",
        source: "web-dev",
        language: "en",
        note: "Пошаговый чек-лист улучшения LCP: TTFB, render blocking, preload, fetchpriority, AVIF, CDN.",
      },
    ],
  },

  chapters: [
    {
      id: "core-web-vitals",
      title: "Core Web Vitals: LCP, INP, CLS",
      estimatedMinutes: 8,
      blocks: [
        {
          type: "text",
          content:
            "Core Web Vitals — три метрики которые Google использует для оценки пользовательского опыта: LCP (скорость загрузки), INP (отзывчивость), CLS (стабильность layout). Они влияют на позиции в поиске и реальное ощущение скорости.",
        },
        {
          type: "text",
          content:
            "Core Web Vitals — это три метрики, которые Google использует чтобы понять, насколько приятно пользоваться сайтом: LCP (скорость появления главного контента), INP (насколько быстро страница реагирует на клики) и CLS (не «прыгает» ли контент пока грузится). Они напрямую влияют на позиции в поиске — не как косвенный сигнал, а как официальный ranking factor. Если хотя бы одна метрика плохая у 25% пользователей — страница помечается как «не Good».",
        },
        {
          type: "list",
          content: `- **LCP** (Largest Contentful Paint) — время до отрисовки самого большого видимого блока. Хорошо: **< 2.5 с**, плохо: **> 4 с**.
- **INP** (Interaction to Next Paint) — почти максимум (p98) задержки взаимодействий за сессию. Хорошо: **< 200 мс**, плохо: **> 500 мс**. Заменил FID 12 марта 2024.
- **CLS** (Cumulative Layout Shift) — сумма неожиданных сдвигов макета. Хорошо: **< 0.1**, плохо: **> 0.25**.`,
        },
        {
          type: "callout",
          calloutType: "info",
          content:
            "Существуют и другие метрики: **TTFB** (Time To First Byte) — серверная скорость, **FCP** (First Contentful Paint) — первый видимый контент, **TTI** (Time To Interactive) — момент полной отзывчивости, **TBT** (Total Blocking Time) — суммарное время длинных задач. Они помогают диагностировать, но в Core Web Vitals не входят.",
        },
        {
          type: "heading",
          content: "Как замерить — PerformanceObserver и web-vitals",
        },
        {
          type: "code",
          language: "javascript",
          content: `// 1) Низкоуровнево — нативный API браузера
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('LCP candidate:', entry.startTime, entry.element);
  }
}).observe({ type: 'largest-contentful-paint', buffered: true });

// 2) Прод-стандарт — библиотека web-vitals от Google
import { onLCP, onINP, onCLS, onTTFB, onFCP } from 'web-vitals';

const send = (metric) => {
  navigator.sendBeacon('/rum', JSON.stringify({
    name: metric.name,    // 'LCP' | 'INP' | 'CLS' | ...
    value: metric.value,  // ms или score
    rating: metric.rating, // 'good' | 'needs-improvement' | 'poor'
    id: metric.id,        // уникальный id сессии
  }));
};

onLCP(send); onINP(send); onCLS(send); onTTFB(send); onFCP(send);`,
        },
        {
          type: "text",
          content:
            "Важно понимать: метрики собираются с реальных пользователей через CrUX — это не результаты Lighthouse в DevTools. Lighthouse — синтетический тест в управляемых условиях, он полезен для регрессий в CI, но никак не влияет на ранжирование Google. На собеседовании это классическая ловушка — если ты путаешь «хороший Lighthouse score» с «хорошими Core Web Vitals в проде», это сразу заметно. Настоящая картина — только web-vitals.js и аналитика поверх него.",
        },
        {
          type: "text",
          content:
            "Важно: метрики собираются с реальных пользователей (RUM), а не в лабораторных условиях. Lighthouse — синтетический тест, полезен но не заменяет реальные данные. На собеседовании спросят как измеряешь метрики в продакшне — web-vitals.js + аналитика.",
        },
        { type: "heading", content: "Почему INP заменил FID" },
        {
          type: "text",
          content:
            "FID учитывал только **первое** взаимодействие и только **input delay** (от события до начала обработчика). Этого мало: страница могла показать хороший FID и при этом «зависать» на каждом клике после первого. INP измеряет полный цикл — от ввода до следующего paint — для всех взаимодействий за сессию и берёт почти максимум (p98). Это честнее отражает реальный UX.",
        },
        {
          type: "callout",
          calloutType: "warning",
          content:
            "Запоминайте пороги наизусть: 2.5 / 200 / 0.1. На интервью именно эти числа спрашивают первым делом. Превышение хоть одного — страница «не Good» в глазах Google.",
        },
      ],
      flashcardIds: ["sdp-f1", "sdp-f2", "sdp-f3", "sdp-f4"],
      checkpoint: [Q["sdp-q1"]!, {
        type: 'multi-select',
        id: 'sdp-ms1',
        description: 'Какие метрики входят в Core Web Vitals (официальный набор Google 2024)?',
        options: [
          'LCP (Largest Contentful Paint)',
          'FID (First Input Delay)',
          'CLS (Cumulative Layout Shift)',
          'INP (Interaction to Next Paint)',
          'TTFB (Time to First Byte)',
          'FCP (First Contentful Paint)',
        ],
        correctIndices: [0, 2, 3],
        explanation: 'Core Web Vitals с 2024: LCP (скорость загрузки), CLS (стабильность layout), INP (отзывчивость). FID заменён на INP. TTFB и FCP — \'диагностические\' метрики, не входят в CWV официально.',
      }],
      docsLink: { url: 'https://web.dev/i18n/ru/vitals/', title: 'Core Web Vitals — web.dev (ru)' },
      video: {
        source: 'youtube',
        id: 'AQqFZ5t8uNc',
        title: 'Optimize for Core Web Vitals',
        channel: 'Chrome for Developers',
        language: 'en',
        durationSec: 18 * 60,
        description: 'Addy Osmani разбирает LCP, INP, CLS и стандартный набор техник: preload, fetchpriority, AVIF, font-display.',
      },
      links: [
        {
          url: 'https://web.dev/articles/vitals',
          title: 'Web Vitals — web.dev',
          source: 'web-dev',
          language: 'en',
          note: 'Канонический справочник Google по Core Web Vitals: определения, пороги, методы измерения, история (FID → INP).',
        },
      ],
    },

    {
      id: "rum-vs-synthetic",
      title: "RUM vs Synthetic и performance budget",
      estimatedMinutes: 6,
      blocks: [
        {
          type: "text",
          content:
            "Есть два способа узнать, насколько быстр твой сайт: запустить тест в лаборатории (Lighthouse) или собрать данные с реальных пользователей (RUM). Это не одно и то же. Первый даёт повторяемые цифры для CI, второй — правду о том, что чувствуют твои пользователи. Performance budget — договорённость команды о жёстких лимитах, при превышении которых CI блокирует merge.",
        },
        {
          type: "text",
          content:
            "Представь нагрузочный тест сервера в тихой серверной и реальный «чёрный пятница» с живым трафиком — первый предсказуем, второй показывает правду. Так и с производительностью: хороший Lighthouse score не означает хорошие метрики в проде. Lighthouse гоняет чистый кэш, фиксированную сеть и одну конфигурацию CPU; реальные пользователи приходят с тёплым кэшем частично, на слабом Android и с 3G. На собеседовании важный вопрос — чему доверять для ranking сигналов Google: только RUM через CrUX, Lighthouse на ранжирование не влияет.",
        },
        { type: "heading", content: "Два источника правды" },
        {
          type: "text",
          content:
            "**Synthetic** (lab) — Lighthouse, WebPageTest, SpeedCurve, Calibre — запускают браузер в контролируемом окружении: фиксированная сеть (slow 4G), фиксированный CPU-throttle, чистый кэш. Это даёт **повторяемое** число, которое можно сравнивать между PR-ами и блокировать merge при регрессии. Минус: оно не равно реальной цифре пользователей.",
        },
        {
          type: "text",
          content:
            "**RUM** (field) — web-vitals.js собирает метрики у каждого настоящего посетителя и шлёт на ваш бэкенд (или Google CrUX, Datadog RUM, Sentry Performance, SpeedCurve LUX). Это **правда** про вашу аудиторию: распределение устройств, сетей, географии. Только RUM используется в ranking-сигналах Google.",
        },
        {
          type: "callout",
          calloutType: "tip",
          content:
            "Промышленный setup — оба источника одновременно: synthetic ловит регрессии в CI до релиза, RUM подтверждает, что в проде у p75 пользователей метрики действительно «зелёные».",
        },
        {
          type: "text",
          content:
            "Аналогия: synthetic — это тест-драйв машины на полигоне в идеальных условиях. RUM — это статистика реальных аварий и поломок на дорогах. На собеседовании старший разработчик спросит «а как ты мониторишь производительность в проде?» — и ответ «у нас Lighthouse CI» звучит как «мы тестируем только на полигоне».",
        },
        {
          type: "text",
          content:
            "Типичная ловушка на собеседовании: «мы добавили Lighthouse CI, значит всё под контролем». Нет — Lighthouse гоняет чистый кеш и фиксированную сеть. Ваши реальные пользователи приходят с тёплым кешем частично, со слабым Android, с 3G. Если у тебя нет RUM в проде и ты не можешь сказать «наш p75 LCP на мобайле — 2.1 секунды», значит ты оптимизируешь вслепую. На собеседованиях senior-уровня именно этот вопрос отделяет кандидатов.",
        },
        { type: "heading", content: "Performance budget" },
        {
          type: "text",
          content:
            "Бюджет — это **жёсткие** лимиты на ресурсы и метрики, согласованные заранее. Типичные значения для крупного публичного сайта на p75-устройстве (mid-tier Android, slow 4G):",
        },
        {
          type: "list",
          content: `- JS-бандл первого экрана — **< 170 кБ** gzip
- CSS-бандл первого экрана — **< 100 кБ** gzip
- Изображения первого экрана — **< 1 МБ** суммарно
- LCP — **< 2.5 с**, INP — **< 200 мс**, CLS — **< 0.1**
- TTFB — **< 600 мс** на p75`,
        },
        {
          type: "code",
          language: "json",
          content: `// lighthouserc.json — Lighthouse CI блокирует merge при превышении
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "interaction-to-next-paint": ["error", { "maxNumericValue": 200 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "resource-summary:script:size": ["error", { "maxNumericValue": 170000 }]
      }
    }
  }
}`,
        },
        {
          type: "callout",
          calloutType: "info",
          content:
            "Альтернативные инструменты: **size-limit** и **bundlewatch** — для лимитов на размер ESM-чанков; **Calibre** и **SpeedCurve** — для тренд-графиков RUM/synthetic; **CrUX dashboard** в Google Cloud Studio — бесплатные данные о ваших Web Vitals по 28-дневному окну.",
        },
      ],
      flashcardIds: ["sdp-f5", "sdp-f6"],
      docsLink: { url: 'https://web.dev/i18n/ru/vitals/', title: 'Core Web Vitals — web.dev (ru)' },
      links: [
        {
          url: 'https://web.dev/articles/performance-budgets-101',
          title: 'Performance budgets 101 — web.dev',
          source: 'web-dev',
          language: 'en',
          note: 'Как составить и контролировать performance budget: метрики, лимиты на ресурсы, интеграция с Lighthouse CI.',
        },
      ],
    },

    {
      id: "loading-strategies",
      title:
        "Стратегии загрузки: preload, prefetch, defer, async, Priority Hints",
      estimatedMinutes: 8,
      blocks: [
        {
          type: "text",
          content:
            "Когда браузер загружает страницу, он делает это последовательно: читает HTML, находит ссылки на ресурсы, загружает их, рендерит. Если critical ресурс обнаруживается поздно — LCP страдает. Стратегии загрузки — это набор инструментов чтобы подсказать браузеру что и в каком порядке важно грузить.",
        },
        {
          type: "text",
          content:
            "Классическая путаница с async и defer: оба не блокируют парсинг HTML, но порядок выполнения разный. async выполняет скрипт как только загрузился — в произвольном порядке, как стюардесса объявляет новости прямо во время полёта. defer ждёт пока HTML разобран полностью, а потом выполняет скрипты в порядке их появления в документе — как брифинг до вылета. Ещё важный момент для собеседования: preload означает «начни загрузку прямо сейчас», но не «выполни прямо сейчас» — браузер загрузит скрипт в кэш, но выполнит его только когда до него дойдёт парсер.",
        },
        { type: "heading", content: "Resource hints" },
        {
          type: "text",
          content:
            "У вас есть четыре hints, которые сообщают браузеру, что и в каком приоритете подгружать:",
        },
        {
          type: "list",
          content: `- **preload** — критический ресурс **этой** страницы. Высокий приоритет, требует \`as=\` (image/font/script/style). Браузер начинает загрузку сразу, не дожидаясь обнаружения в HTML/CSS.
- **prefetch** — ресурс **будущей** навигации. Idle-приоритет, кладётся в HTTP-кэш для следующего перехода.
- **preconnect** — выполнить TCP+TLS handshake к origin заранее. Экономит 100–500 мс для критичных third-party.
- **dns-prefetch** — только DNS-резолв, дешевле preconnect; fallback для старых браузеров.`,
        },
        {
          type: "code",
          language: "html",
          content: `<head>
  <!-- LCP-картинка: загружаем максимально приоритетно -->
  <link rel="preload" as="image" href="/hero.avif"
        type="image/avif" fetchpriority="high">

  <!-- Шрифт для above-the-fold текста -->
  <link rel="preload" as="font" href="/inter-var.woff2"
        type="font/woff2" crossorigin>

  <!-- API, к которому пойдёт первый fetch -->
  <link rel="preconnect" href="https://api.example.com" crossorigin>

  <!-- CDN, к которому пойдут картинки ниже сгиба -->
  <link rel="dns-prefetch" href="https://cdn.example.com">

  <!-- Следующий вероятный экран навигации -->
  <link rel="prefetch" href="/dashboard" as="document">
</head>`,
        },
        {
          type: "text",
          content:
            "На интервью часто спрашивают «чем defer отличается от async» — это классика, которую нужно знать как таблицу умножения. Но более интересный вопрос: почему async может навредить? Если скрипт аналитики загрузится раньше основного скрипта и начнёт обращаться к его API — ты получишь TypeError. defer гарантирует порядок исполнения, async — нет. Поэтому async только для полностью независимых скриптов.",
        },
        { type: "heading", content: "defer vs async" },
        {
          type: "list",
          content: `- Без атрибутов — \`<script>\` **блокирует** парсер на время скачивания и выполнения.
- \`<script defer>\` — параллельно скачивается, выполняется **после** парсинга HTML, **в порядке** объявления.
- \`<script async>\` — параллельно скачивается, выполняется **сразу** при загрузке, порядок не гарантирован.
- \`<script type="module">\` — defer-семантика по умолчанию.`,
        },
        {
          type: "code",
          language: "html",
          content: `<!-- ✅ Зависимые скрипты приложения -->
<script src="/vendor.js" defer></script>
<script src="/app.js" defer></script>

<!-- ✅ Независимая аналитика — async -->
<script src="https://plausible.io/js/script.js" async></script>

<!-- 🔴 Без атрибутов — блокирует парсер -->
<script src="/legacy.js"></script>`,
        },
        {
          type: "text",
          content:
            "Ловушка на собеседовании: «какой атрибут сделает мою hero-картинку быстрее?» Начинающие отвечают preload или async. Правильный ответ — комбинация: preload + fetchpriority=\"high\" на LCP-картинку, и никогда не ставить loading=\"lazy\" на hero. Это разные механизмы, и они работают вместе.",
        },
        { type: "heading", content: "Priority Hints — fetchpriority" },
        {
          type: "text",
          content:
            'Атрибут `fetchpriority="high|low|auto"` (Chrome 101+, Safari 17.2+) даёт браузеру явную подсказку. Самое типичное применение — `fetchpriority="high"` на LCP-картинке и критичном fetch, `fetchpriority="low"` на офскрин-изображениях и аналитике.',
        },
        {
          type: "code",
          language: "html",
          content: `<!-- LCP hero — high -->
<img src="/hero.avif" alt="" width="1200" height="630"
     fetchpriority="high">

<!-- Below-the-fold — low + lazy -->
<img src="/footer.avif" alt="" width="400" height="200"
     loading="lazy" fetchpriority="low">

<!-- Критичный API-запрос -->
<script>
  fetch('/api/me', { priority: 'high' });
  fetch('/api/analytics', { priority: 'low' });
</script>`,
        },
        {
          type: "callout",
          calloutType: "warning",
          content:
            "Не злоупотребляйте preload: если пометить «всё критичным», браузер не сможет правильно расставить приоритеты, и метрики ухудшатся. Реальная норма — 1–3 preload на страницу: LCP-картинка, основной шрифт, критичный API.",
        },
      ],
      flashcardIds: ["sdp-f7", "sdp-f8"],
      checkpoint: [Q["sdp-q5"]!, {
        type: 'match-pairs',
        id: 'sdp-mp1',
        description: 'Сопоставь метрику с тем, что она измеряет',
        pairs: [
          { left: 'LCP', right: 'Время загрузки самого крупного видимого элемента' },
          { left: 'CLS', right: 'Суммарный сдвиг layout за время жизни страницы' },
          { left: 'INP', right: 'Задержка от взаимодействия до следующей отрисовки' },
          { left: 'TTFB', right: 'Время до получения первого байта от сервера' },
        ],
        explanation: 'LCP > 2.5s — плохо (цель ≤2.5s). CLS > 0.1 — плохо (цель ≤0.1). INP > 200ms — плохо (цель ≤200ms). TTFB влияет на LCP: медленный сервер → поздний старт загрузки.',
      }],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/Performance', title: 'Производительность — MDN (ru)' },
      video: {
        source: 'youtube',
        id: 'YJGCZCaIZkQ',
        title: 'Speed at Scale: Web Performance Tips and Tricks (Google I/O 2019)',
        channel: 'Chrome for Developers',
        language: 'en',
        durationSec: 35 * 60,
        description: 'Системный подход к производительности на масштабе: бюджеты, RUM, code splitting, image optimization, lazy hydration.',
      },
      links: [
        {
          url: 'https://web.dev/articles/inp',
          title: 'Interaction to Next Paint (INP) — web.dev',
          source: 'web-dev',
          language: 'en',
          note: 'Что такое INP, как измерять, типичные источники медленных взаимодействий и стратегии оптимизации.',
        },
      ],
    },

    {
      id: "images",
      title: "Оптимизация изображений",
      estimatedMinutes: 7,
      blocks: [
        {
          type: "text",
          content:
            "LCP (Largest Contentful Paint) — время до отрисовки самого крупного видимого элемента на странице. Обычно это hero-изображение или заголовок. Цель: менее 2.5 секунды.",
        },
        {
          type: "text",
          content:
            "Картинки — самое простое и самое дорогое место в производительности одновременно. Простое потому что с ними нет ложной сложности: форматы, размеры, приоритеты. Дорогое потому что один неправильный атрибут — и LCP уезжает на 2 секунды вверх. Главное, что нужно запомнить: hero-картинка и все картинки ниже сгиба требуют диаметрально противоположного подхода.",
        },
        { type: "heading", content: "Современные форматы" },
        {
          type: "list",
          content: `- **AVIF** (AV1 Image Format) — лучшее сжатие, ≈ −30% к WebP, ≈ −50% к JPEG при том же качестве. Поддержка: Chrome с 2020, Firefox с 2021, Safari **16.4+** (март 2023).
- **WebP** — массовая поддержка с 2020. Безопасный fallback после AVIF.
- **JPEG** / **PNG** — финальный fallback для очень старых браузеров.
- **SVG** — для иконок и логотипов; ноль артефактов на любом DPR.
- **JPEG XL** — лучше AVIF, но без массовой поддержки в браузерах.`,
        },
        {
          type: "code",
          language: "html",
          content: `<picture>
  <source type="image/avif"
    srcset="/hero-400.avif 400w, /hero-800.avif 800w, /hero-1600.avif 1600w"
    sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1600px">
  <source type="image/webp"
    srcset="/hero-400.webp 400w, /hero-800.webp 800w, /hero-1600.webp 1600w"
    sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1600px">
  <img src="/hero-800.jpg" alt="Hero"
       width="1600" height="900"
       fetchpriority="high">
</picture>`,
        },
        { type: "heading", content: "srcset и sizes" },
        {
          type: "text",
          content:
            "`srcset` перечисляет варианты с шириной в `w`, `sizes` — медиа-запросы, по которым браузер выбирает. Это уменьшает payload на mobile в разы: пользователю iPhone не нужна 1600-пиксельная версия, ему достаточно 400 × 2 DPR = 800.",
        },
        {
          type: "text",
          content:
            "Главные враги LCP: медленный TTFB (сервер долго отвечает), блокирующие ресурсы, большие неоптимизированные изображения. Решения: preload для критичных ресурсов, оптимизация изображений (WebP, размеры), быстрый сервер/CDN.",
        },
        {
          type: "text",
          content:
            "Частая ошибка на реальных проектах: разработчик добавляет loading=\"lazy\" на все картинки скопом через CSS-класс или глобальный компонент. Это выглядит как оптимизация, но для LCP-картинки это катастрофа — браузер откладывает её загрузку, и LCP вырастает на 1–2 секунды. На собеседовании именно это спрашивают: «когда lazy вредит?». Ответ — всегда на LCP-кандидате, который виден без скролла.",
        },
        { type: "heading", content: "lazy и Priority Hints" },
        {
          type: "list",
          content: `- \`loading="lazy"\` — для всего, что **ниже сгиба**. Нативный, без библиотек.
- \`fetchpriority="high"\` — для **LCP-кандидата** (обычно одна hero-картинка).
- \`width\` и \`height\` (или \`aspect-ratio\` в CSS) — обязательны для предотвращения **CLS**.
- На LCP-картинку **никогда** не ставить \`loading="lazy"\`: браузер отложит загрузку и LCP вырастет на секунды.`,
        },
        {
          type: "callout",
          calloutType: "tip",
          content:
            "Прод-решение: image CDN (Cloudinary, imgix, Vercel `/_next/image`, Cloudflare Images). Отдают AVIF/WebP по Accept-заголовку, ресайзят на лету, кэшируют у себя. Один URL `/img?w=800&q=80&fmt=auto` обслуживает все DPR и форматы.",
        },
      ],
      flashcardIds: ["sdp-f9"],
      checkpoint: [Q["sdp-q7"]!],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images', title: 'Адаптивные изображения — MDN (ru)' },
      links: [
        {
          url: 'https://web.dev/articles/optimize-lcp',
          title: 'Optimize Largest Contentful Paint — web.dev',
          source: 'web-dev',
          language: 'en',
          note: 'Пошаговый чек-лист улучшения LCP: TTFB, render blocking, preload, fetchpriority, AVIF, CDN.',
        },
      ],
    },

    {
      id: "js-budget",
      title: "JS-бюджет: code splitting, tree shaking, Web Workers",
      estimatedMinutes: 8,
      blocks: [
        {
          type: "text",
          content:
            "INP (Interaction to Next Paint) — метрика отзывчивости. Измеряет время от взаимодействия (клик, нажатие клавиши) до отрисовки обновлённого UI. Цель: менее 200 миллисекунд. Если дольше — пользователь чувствует «тормоза».",
        },
        {
          type: "text",
          content:
            "JavaScript — единственный ресурс, который браузеру нужно не просто скачать, но ещё и разобрать, скомпилировать и выполнить. Картинку можно отобразить сразу как загрузится — JS нет. На Moto G4 (тот самый mid-tier Android, который используют как эталон) 1 МБ скриптов может блокировать main thread на полторы секунды. Это и TTI, и INP, и ощущение «сайт подвис».",
        },
        { type: "heading", content: "Code splitting" },
        {
          type: "text",
          content:
            "Разделение бандла на чанки, загружаемые по требованию. Самый эффективный уровень — **route-based**: каждый роут = отдельный чанк. Следующий уровень — **component-based** для редких компонентов: модалки, графики, редакторы.",
        },
        {
          type: "code",
          language: "tsx",
          content: `// React Router + lazy
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));
const Settings = lazy(() => import('./Settings'));

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/dashboard" element={
    <Suspense fallback={<Spinner />}><Dashboard /></Suspense>
  } />
  <Route path="/settings" element={
    <Suspense fallback={<Spinner />}><Settings /></Suspense>
  } />
</Routes>

// Компонентный split — тяжёлый редактор грузим только при открытии
const RichTextEditor = lazy(() => import('./RichTextEditor'));`,
        },
        {
          type: "text",
          content:
            "Подводный камень code splitting, о котором редко говорят: если ты разбил бандл на чанки, но все они грузятся одновременно при открытии страницы — ничего не изменилось. Смысл в том, чтобы грузить чанк только когда он нужен. Поэтому Suspense fallback не должен быть пустым — это и есть момент когда пользователь ждёт чанк. Плохой fallback = плохой UX, даже при правильном splitting.",
        },
        {
          type: "text",
          content:
            "Главные враги INP: долгие синхронные обработчики событий и задачи блокирующие main thread. Решения: разбивать длинные задачи через setTimeout/scheduler.postTask, тяжёлые вычисления в Web Workers.",
        },
        { type: "heading", content: "Tree shaking" },
        {
          type: "text",
          content:
            'Удаление неиспользуемых экспортов на этапе сборки. Работает только с **ES-модулями** (CommonJS не tree-shake-ится). Включить: production-режим бандлера + `"sideEffects": false` в `package.json` для агрессивного DCE.',
        },
        {
          type: "code",
          language: "json",
          content: `// package.json — разрешить агрессивный tree shaking
{
  "name": "my-lib",
  "type": "module",
  "sideEffects": false,
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  }
}`,
        },
        {
          type: "callout",
          calloutType: "warning",
          content:
            'Подводный камень: импорт `import _ from "lodash"` тащит **всю** библиотеку. Используйте `import debounce from "lodash/debounce"` (cherry-pick) или ESM-версию `lodash-es`. Bundle analyzer покажет, что у вас в чанках.',
        },
        { type: "heading", content: "Web Workers" },
        {
          type: "text",
          content:
            "Когда задача занимает > 50 мс на main thread (парсинг большого JSON, fuzzy search, шифрование, image processing), её стоит вынести в Web Worker. Главный thread остаётся свободным для рендера и взаимодействий — INP не страдает.",
        },
        {
          type: "code",
          language: "javascript",
          content: `// search.worker.js
self.onmessage = (e) => {
  const { items, query } = e.data;
  // Тяжёлый fuzzy-поиск на 100k записей (был 800 мс на main thread)
  const results = fuzzySearch(items, query);
  self.postMessage(results);
};

// main.js
const worker = new Worker(new URL('./search.worker.js', import.meta.url),
                          { type: 'module' });

input.addEventListener('input', (e) => {
  worker.postMessage({ items: catalog, query: e.target.value });
});
worker.onmessage = (e) => renderResults(e.data);`,
        },
        {
          type: "callout",
          calloutType: "info",
          content:
            "Worker не имеет доступа к DOM, `window`, `document`. Доступны: `fetch`, `IndexedDB`, `crypto`, `WebAssembly`. Для больших данных используйте **Transferable Objects** (`postMessage(buf, [buf])`) — передача без копии. Comlink упрощает RPC между main и worker.",
        },
      ],
      playground: {
        starterCode: `// Расчёт performance budget для JS-бандла.
// На mid-tier Android (Moto G4) 1 кБ gzip ≈ 1 мс на parse + execute.
// Хотим уложить parse+execute в 170 мс при загрузке.
// Сколько кБ gzip JS можно отгрузить в первый чанк?

const cpuBudgetMs = 170;
const msPerKb = 1;
const maxKb = /* посчитайте */ 0;

console.log(maxKb);`,
        expectedOutput: "170",
        description:
          "Простая задача на понимание единиц бюджета. 170 мс ÷ 1 мс/кБ = 170 кБ gzip — это и есть индустриальная норма для первого JS-чанка на p75-устройстве вашей аудитории.",
      },
      flashcardIds: ["sdp-f10", "sdp-f11", "sdp-f15"],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/Performance', title: 'Производительность — MDN (ru)' },
      links: [
        {
          url: 'https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading',
          title: 'Lazy loading — MDN',
          source: 'mdn',
          language: 'en',
          note: 'loading="lazy" для img/iframe, IntersectionObserver-фолбэки и динамический импорт модулей.',
        },
      ],
    },

    {
      id: "cheap-css",
      title: "Reflow vs composition: cheap CSS",
      estimatedMinutes: 6,
      blocks: [
        {
          type: "text",
          content:
            "Не все CSS-свойства одинаково дёшевы. Браузер проходит через три этапа при рендеринге: layout (считает размеры), paint (рисует пиксели), composite (накладывает слои). Если анимировать width — перезапускается с нуля. Если transform — только последний шаг. Это кардинально влияет на плавность анимаций.",
        },
        {
          type: "text",
          content:
            "Reflow — это как переверстать всё меню ресторана из-за одной опечатки в одном слове: браузер пересчитывает размеры и позиции всех элементов, которые могут зависеть от изменённого. Repaint — это как перекрасить кнопку в другой цвет без изменения её размера: только пиксели, геометрия не меняется. На собеседовании важно знать что именно вызывает reflow: изменение width/height/margin/padding/font-size и чтение offsetWidth/getBoundingClientRect() в середине JS — «layout thrashing». Ещё одна ловушка: will-change добавленный на всём подряд хуже чем ничего — браузер создаёт отдельный слой на GPU для каждого такого элемента, и при большом количестве это съедает RAM и замедляет composite.",
        },
        {
          type: "heading",
          content: "Cheap CSS — что можно анимировать дёшево",
        },
        {
          type: "list",
          content: `- **transform** (\`translate\`, \`scale\`, \`rotate\`, \`skew\`) — только composite.
- **opacity** — только composite.
- **filter** (большинство) — composite + GPU effect, обычно дёшево.
- **color**, **background-color** — paint без layout (умеренно).
- **width**, **height**, **top**, **left**, **margin**, **padding**, **border** — **reflow** всего поддерева. Дорого.`,
        },
        {
          type: "code",
          language: "css",
          content: `/* 🔴 Дорого — reflow на каждом кадре */
.bad {
  transition: left 200ms, width 200ms;
}
.bad:hover { left: 100px; width: 200px; }

/* ✅ Дёшево — только composite */
.good {
  transition: transform 200ms, opacity 200ms;
  will-change: transform;
}
.good:hover { transform: translateX(100px) scale(1.2); opacity: 0.8; }`,
        },
        {
          type: "text",
          content:
            "На собеседовании могут спросить: «почему анимация через left/top работает, но дёргается?». Ответ — потому что left и top вызывают reflow, браузер пересчитывает позицию всего вокруг элемента, и на слабом устройстве это 50+ мс на каждый кадр. Правильный ответ — перейти на transform: translate(). Этот трюк работает потому что translate не меняет flow документа, а просто смещает уже готовый слой.",
        },
        {
          type: "text",
          content:
            "Классический вопрос на собеседовании: «почему анимация через left дёргается а через transform плавная?». Правильный ответ — потому что left вызывает reflow, а transform работает только на этапе compositing. Это фундаментальное понимание рендер-конвейера браузера, которое отличает junior от middle.",
        },
        { type: "heading", content: "will-change и compositing layer" },
        {
          type: "text",
          content:
            "`will-change: transform` — подсказка браузеру: «этот элемент скоро будет анимирован, подними его на отдельный композитный слой заранее». Без неё первый кадр анимации тратит время на создание слоя — отсюда «прыжок» в начале.",
        },
        {
          type: "callout",
          calloutType: "warning",
          content:
            'Не ставьте `will-change` на много элементов «на всякий случай»: каждый слой стоит видеопамяти. Используйте только для конкретных анимируемых элементов и убирайте после окончания анимации (`element.style.willChange = "auto"`).',
        },
        {
          type: "heading",
          content: "content-visibility — скрытие офскрин-контента",
        },
        {
          type: "code",
          language: "css",
          content: `/* Браузер не делает layout/paint для секций ниже viewport */
.section {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px; /* резерв высоты — против CLS */
}`,
        },
        {
          type: "text",
          content:
            "Для длинных страниц `content-visibility: auto` пропускает layout/paint для секций вне viewport — экономит десятки миллисекунд на первом рендере. Обязателен `contain-intrinsic-size`, иначе будет прыжок при скролле.",
        },
      ],
      flashcardIds: ["sdp-f12", "sdp-f13"],
      checkpoint: [Q["sdp-q11"]!],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/Performance/Critical_rendering_path', title: 'Critical Rendering Path — MDN (ru)' },
      video: {
        source: 'youtube',
        id: '6Ljq-Jn-EgU',
        title: 'Web Performance: Leveraging the Metrics that Most Affect User Experience',
        channel: 'Chrome for Developers',
        language: 'en',
        durationSec: 35 * 60,
        description: 'Связь метрик и реальных KPI продукта (конверсия, отказы). Помогает обосновывать перформанс-инвестиции.',
      },
    },
  ],

  finalQuiz: quizQuestions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  flashcards,

  cheatsheet: `**Core Web Vitals (p75 за 28 дней):**

| Метрика | Что мерит | Хорошо | Плохо |
|---------|-----------|--------|-------|
| LCP | Largest Contentful Paint | < 2.5 с | > 4 с |
| INP | Interaction to Next Paint | < 200 мс | > 500 мс |
| CLS | Cumulative Layout Shift | < 0.1 | > 0.25 |
| TTFB | Time To First Byte | < 600 мс | > 1.5 с |
| FCP | First Contentful Paint | < 1.8 с | > 3 с |

**Чек-лист быстрых побед:**
- LCP-картинка: \`<picture>\` AVIF→WebP→JPEG, \`fetchpriority="high"\`, \`<link rel="preload">\`
- Все \`<img>\`: \`width\`, \`height\`, \`loading="lazy"\` (кроме hero)
- Шрифты: \`font-display: optional\`, preload critical, \`woff2\`
- Скрипты: \`defer\` для зависимых, \`async\` для аналитики, type="module" по умолчанию
- JS-бюджет: < 170 кБ gzip первый чанк, route-level code splitting, tree shaking
- CPU > 50 мс — в Web Worker
- Анимации только через \`transform\` и \`opacity\`, плюс \`will-change\`
- CI: Lighthouse CI + size-limit, RUM через web-vitals → бэкенд`,

  interviewQA: [
    {
      id: "sdp-qa-1",
      question: "Что такое LCP и какие первые три действия для улучшения?",
      shortAnswer:
        'LCP — время до отрисовки самого крупного видимого блока (< 2.5 с). Первые шаги: preload + fetchpriority="high" на hero-картинку, AVIF/WebP, удаление render-blocking CSS/JS.',
      fullAnswer:
        'LCP (Largest Contentful Paint) измеряет момент, когда отрисован самый большой видимый элемент в viewport — обычно hero-картинка, видео-постер или крупный заголовок. Целевой порог Google — < 2.5 с на p75 за 28 дней.\n\nДиагностика: открыть PageSpeed Insights или Lighthouse, посмотреть «LCP element» и таймлайн — что блокирует. Самые частые проблемы: (1) hero-картинка качается с низким приоритетом и поздно, (2) шрифты блокируют текстовый LCP, (3) render-blocking CSS/JS в head.\n\nПервые три действия: преиграть hero-картинку через `<link rel="preload" as="image" fetchpriority="high">`, конвертировать в AVIF/WebP с правильными srcset-размерами, удалить render-blocking ресурсы (defer/async на script, inline critical CSS). Дополнительно — улучшить TTFB (CDN, edge, кеш), убрать `loading="lazy"` с LCP-кандидата.',
      followUps: [
        "Что такое render-blocking ресурс?",
        "Как inline-ить critical CSS, чтобы не раздувать HTML?",
        "Когда CDN не помогает с TTFB?",
      ],
      relatedChapterId: "core-web-vitals",
    },
    {
      id: "sdp-qa-2",
      question: "Чем INP отличается от FID и почему его сложнее улучшать?",
      shortAnswer:
        "FID учитывал только input delay первого взаимодействия. INP меряет полный цикл «ввод → следующий paint» для всех взаимодействий и берёт почти максимум (p98). Сложнее, потому что любое медленное взаимодействие за сессию портит метрику.",
      fullAnswer:
        "FID (First Input Delay) измерял задержку только до **начала** обработчика и только для **первого** взаимодействия. Это плохо отражало реальный UX: страница могла зависать на каждом клике после первого, оставаясь «зелёной».\n\nINP (Interaction to Next Paint), ставший Core Web Vital 12 марта 2024, измеряет полный цикл: input delay + processing time (обработчик) + presentation delay (до следующего paint). Считается почти максимум (p98) из всех взаимодействий за сессию. Цель — < 200 мс.\n\nУлучшать INP сложнее: одно «тяжёлое» взаимодействие (например, открытие большого списка) портит метрику всей сессии. Стратегии: разбивать длинные задачи через `scheduler.yield()` или `setTimeout(0)`, выносить CPU-bound в Web Worker, использовать virtualization для больших списков (react-window), debounce у поиска, оптимизация рендера React (memo, useMemo, useCallback там, где есть реальный bottleneck по профилировке).",
      followUps: [
        "Что такое scheduler.yield() и как его использовать?",
        "Когда useMemo и React.memo вредят, а не помогают?",
        "Как профилировать INP в проде через RUM?",
      ],
      relatedChapterId: "core-web-vitals",
    },
    {
      id: "sdp-qa-3",
      question: "RUM или synthetic — что важнее? Зачем нужны оба?",
      shortAnswer:
        "Оба нужны. Synthetic ловит регрессии в CI до релиза с фиксированной конфигурацией. RUM показывает правду по реальной аудитории и используется в Google ranking. Промстандарт — оба источника одновременно.",
      fullAnswer:
        "Synthetic monitoring (Lighthouse CI, WebPageTest, SpeedCurve) запускает браузер в **контролируемом** окружении: фиксированный CPU-throttle, фиксированная сеть, чистый кэш. Это даёт повторяемое число, которое можно ставить в gate в CI: «merge запрещён, если LCP вырос на 10%». Минус: оно не отражает реальных пользователей.\n\nRUM (Real User Monitoring) собирает метрики у каждого настоящего посетителя через web-vitals.js → ваш бэкенд (или Google CrUX, Datadog RUM, Sentry Performance). Это **правда** про распределение устройств, сетей, географий вашей аудитории. Только RUM используется в Google ranking signal — синтетика не учитывается.\n\nПромстандарт — оба одновременно: synthetic для регрессий в CI и быстрого алертинга после релиза, RUM для подтверждения, что у p75 пользователей метрики действительно «зелёные», и для долгосрочных трендов. Без RUM вы оптимизируете «слепо», без synthetic — узнаёте о регрессиях только после деплоя.",
      followUps: [
        "Какие RUM-сервисы вы знаете и в чём разница?",
        "Что такое CrUX и как его использовать бесплатно?",
        "Как настроить алерт на регрессию p75 LCP в проде?",
      ],
      relatedChapterId: "rum-vs-synthetic",
    },
    {
      id: "sdp-qa-4",
      question: "Как составить performance budget?",
      shortAnswer:
        "Соберите RUM-данные о 75-м перцентиле устройств вашей аудитории, выставьте лимиты на JS-бандл, LCP/INP/CLS, TTFB. Закрепите в CI через Lighthouse CI / size-limit / bundlewatch с error-уровнем.",
      fullAnswer:
        "Performance budget — заранее согласованные жёсткие лимиты, которые блокируют merge при превышении. Этапы:\n\n1. Узнать **аудиторию**: какое p75-устройство, какая сеть, какой браузер. Источники — Google Analytics, RUM, CrUX. Например: «p75 — Moto G4 на slow 4G».\n2. Выставить **бюджет ресурсов** под это устройство. Стандарт: 170 кБ JS gzip первый чанк (≈170 мс parse+execute на mid-tier Android), 100 кБ CSS, 1 МБ images первого экрана.\n3. Выставить **бюджет метрик**: LCP < 2.5 с, INP < 200 мс, CLS < 0.1, TTFB < 600 мс.\n4. Закрепить в **CI**: Lighthouse CI с `assertions: error`, size-limit для каждого чанка, bundlewatch для регрессий. Превышение блокирует PR.\n5. Ввести **процесс waiver**: явное обоснование и одобрение, если бюджет превышается осознанно (например, новый редактор тащит +80 кБ).\n6. Мониторить **тренд** в проде через RUM (CrUX, Datadog, SpeedCurve) и алертить на регрессию p75.\n\nКлюч — превратить перформанс из «полировки в конце» в инженерную дисциплину наравне с покрытием тестами.",
      followUps: [
        "Что делать, если бизнес требует фичу, ломающую бюджет?",
        "Как считать бюджет для SPA с разными роутами?",
        "Сколько изменений в день LCP — это норма?",
      ],
      relatedChapterId: "rum-vs-synthetic",
    },
    {
      id: "sdp-qa-5",
      question: "Когда выносить вычисление в Web Worker?",
      shortAnswer:
        "Когда CPU-bound задача занимает > 50 мс на main thread и блокирует INP/анимации: парсинг больших JSON/CSV, fuzzy search, шифрование, image processing, диффы.",
      fullAnswer:
        "Web Worker — отдельный поток с собственным event loop. Не имеет доступа к DOM/window/document, но доступны fetch, IndexedDB, crypto, WebAssembly. Общается с main thread через postMessage (либо Transferable Objects / SharedArrayBuffer для больших данных).\n\nКогда нужен: CPU-bound задача > 50 мс блокирует main thread → ухудшает INP, ломает 60-FPS анимации, тормозит скролл. Типичные кандидаты: парсинг 10+ МБ JSON/CSV, fuzzy-поиск по 100k записей, шифрование/хеширование, image/audio processing, diff больших структур, layout алгоритмы (графы, маршруты).\n\nКогда **не** нужен: задача < 50 мс — оверхед холодного старта (~10–30 мс) и сериализации не окупается. Простые DOM-операции, обычные fetch, мелкие вычисления — оставьте на main.\n\nСтоимость: postMessage клонирует данные (структурное копирование) — для больших объектов используйте Transferable Objects: `worker.postMessage(buffer, [buffer])` передаёт владение без копии. Comlink (от Google) даёт RPC-обёртку: вместо ручного onmessage можно вызывать функции воркера как промисы.",
      followUps: [
        "В чём разница между Web Worker, Service Worker и Worklet?",
        "Что такое Transferable Objects?",
        "Когда использовать SharedArrayBuffer и какие требования к COOP/COEP?",
      ],
      relatedChapterId: "js-budget",
    },
    {
      id: "sdp-qa-6",
      question: "Как измерить и оптимизировать стоимость hydration?",
      shortAnswer:
        "PerformanceObserver на longtask после FCP, React Profiler, Long Animation Frames API. Снижение — RSC, islands, partial hydration, code splitting, urезание клиентского JS.",
      fullAnswer:
        'Hydration в SSR — главная причина «парадокса SSR»: FCP отличный, но кнопки не нажимаются. Стоимость пропорциональна размеру JS-бандла, который должен быть распарсен, скомпилирован, выполнен и привязан к существующему DOM.\n\nИзмерение:\n- `PerformanceObserver({ type: "longtask", buffered: true })` — ловит блокировки > 50 мс. Самая большая задача после FCP — обычно hydration.\n- Long Animation Frames API (`type: "long-animation-frame"`, Chrome 123+) — детальный breakdown: scripts, styles, layout, paint.\n- React DevTools Profiler — показывает время mount компонентов; в проде используется `<Profiler onRender>` с отправкой в RUM.\n- Связка: `(time of first interactive event) − FCP` ≈ время hydration.\n\nОптимизация:\n- **React Server Components** — серверные компоненты не отправляют свой код в клиентский бандл, hydration не нужна.\n- **Islands architecture** (Astro, Qwik) — гидрируется только маленькие интерактивные островки.\n- **Partial / progressive hydration** — гидрировать только видимое и важное, остальное — лениво (React 18 selective hydration через Suspense).\n- **Урезание клиентского JS**: tree shaking, замена тяжёлых зависимостей (moment → date-fns), code splitting.\n- **Streaming SSR** — не ускоряет hydration саму по себе, но даёт ранний FCP, скрывая её ощущаемое время.',
      followUps: [
        "Чем RSC отличается от SSR в плане hydration?",
        "Что такое selective hydration в React 18?",
        "Какие метрики покажут, что hydration — bottleneck?",
      ],
      relatedChapterId: "js-budget",
    },
    {
      id: "sdp-qa-7",
      question: "Какие CSS-свойства анимировать дёшево, а какие — дорого?",
      shortAnswer:
        "Дёшево — transform и opacity (только composite, на GPU). Дорого — width, height, top, left, margin, padding (reflow всего поддерева). will-change: transform поднимает на отдельный слой.",
      fullAnswer:
        "У браузера три фазы рендера: **layout** (расчёт геометрии — reflow), **paint** (заливка пикселей), **composite** (склейка слоёв на GPU). Чем дальше фаза, тем дешевле.\n\n**Только composite (cheap):**\n- `transform: translate/scale/rotate/skew` — изменение слоя на GPU без пересчёта layout.\n- `opacity` — изменение альфа-канала слоя.\n- `filter` (большинство) — GPU-эффекты.\n\n**Paint без layout (умеренно):**\n- `color`, `background-color`, `border-color`, `box-shadow`, `border-radius` — нужно перекрасить, но не пересчитать геометрию.\n\n**Layout (expensive):**\n- `width`, `height`, `top`, `left`, `right`, `bottom`, `margin`, `padding`, `border-width`, `font-size`, `display` — вызывают reflow всего поддерева, иногда — всей страницы.\n\n**will-change**: хинт «этот элемент скоро будет анимироваться, подними его на отдельный композитный слой заранее». Без него первый кадр тратит время на создание слоя — отсюда «прыжок». Не злоупотреблять: каждый слой стоит видеопамяти.\n\nЦель — 60 FPS = 16.6 мс на кадр. Если анимация трогает layout-свойства, шансов мало. Реализуйте смещения через `transform: translate()` вместо `top/left`, изменение размера — через `transform: scale()` вместо `width/height`.",
      followUps: [
        "Что такое composite layer и сколько их можно создавать?",
        "Что делает CSS containment и зачем он нужен?",
        "Как профилировать reflow в Chrome DevTools?",
      ],
      relatedChapterId: "cheap-css",
    },
  ],

  nextTopics: [
    {
      slug: "sd-rendering",
      reason:
        "Стратегия рендеринга (CSR/SSR/SSG/ISR/RSC) напрямую определяет TTFB, FCP и LCP — следующий уровень после метрик.",
    },
    {
      slug: "sd-caching",
      reason:
        "Кеширование на уровне CDN, HTTP, Service Worker и приложения — главный рычаг улучшения TTFB и повторных загрузок.",
    },
  ],
};
