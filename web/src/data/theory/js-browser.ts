import type { TopicTheory } from '../../types/topic';

export const jsBrowserTheory: TopicTheory = {
  topicId: 'js-browser',
  sections: [
    {
      title: 'Critical Rendering Path',
      blocks: [
        {
          type: 'text',
          content:
            'Когда браузер получает HTML, он проходит через **Critical Rendering Path** — цепочку шагов до отрисовки первого пикселя:',
        },
        {
          type: 'list',
          content:
            '**1. HTML → DOM** — парсинг HTML, построение дерева DOM-узлов.\n**2. CSS → CSSOM** — парсинг CSS, построение модели стилей.\n**3. DOM + CSSOM → Render Tree** — объединение: только видимые элементы + вычисленные стили.\n**4. Layout (Reflow)** — вычисление геометрии: размеры, позиции каждого элемента.\n**5. Paint** — растеризация: пиксели на слои (layers).\n**6. Composite** — сборка слоёв в финальное изображение GPU.',
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'JavaScript блокирует парсинг HTML! Браузер приостанавливает парсинг при встрече `<script>`. Решения: `defer` (выполняется после парсинга), `async` (выполняется как только загрузится), `<script>` в конце `<body>`.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Оптимизация CRP:
// 1. Минимизировать блокирующие ресурсы
<link rel="stylesheet" href="critical.css">  <!-- блокирует рендер -->
<script defer src="app.js"></script>           <!-- не блокирует -->

// 2. Inline critical CSS для скорости
<style>/* Критические стили выше fold */</style>

// 3. Resource hints
<link rel="preload" href="font.woff2" as="font">
<link rel="prefetch" href="/next-page.js">
<link rel="preconnect" href="https://api.example.com">`,
        },
      ],
    },
    {
      title: 'Reflow, Repaint и Composite',
      blocks: [
        {
          type: 'text',
          content:
            'Изменение DOM или стилей запускает часть или весь CRP заново. Важно понимать, что именно вызывает каждый тип обновления:',
        },
        {
          type: 'list',
          content:
            '**Reflow (Layout)** — самый дорогой: пересчёт геометрии. Запускается при изменении: размеров, позиций, шрифтов, добавлении/удалении DOM-узлов, чтении геометрических свойств (offsetHeight, getBoundingClientRect).\n**Repaint** — дешевле: перерисовка пикселей без изменения геометрии. Запускается при изменении: color, background, visibility, border-color.\n**Composite** — самый быстрый: только перекомпозиция слоёв. Свойства: transform, opacity (если на отдельном слое).',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// ❌ Layout Thrashing — чередование read/write
function badMove(elements) {
  elements.forEach((el) => {
    // READ → запускает reflow для актуального значения
    const width = el.offsetWidth;
    // WRITE → инвалидирует layout
    el.style.width = (width + 10) + 'px';
    // На следующей итерации: READ снова вызывает reflow!
  });
}

// ✅ Батчинг: все чтения, затем все записи
function goodMove(elements) {
  const widths = elements.map((el) => el.offsetWidth); // все READ
  elements.forEach((el, i) => {
    el.style.width = (widths[i] + 10) + 'px'; // все WRITE
  });
}

// ✅ Использовать transform вместо left/top (Composite, не Reflow)
el.style.transform = 'translateX(100px)'; // только Composite!
el.style.left = '100px'; // вызывает Reflow`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Свойства **transform** и **opacity** — на отдельном compositor layer — не вызывают Reflow и Repaint. Используйте `will-change: transform` или `transform: translateZ(0)` для "продвижения" элемента на GPU layer (осторожно — память).',
        },
      ],
    },
    {
      title: 'Оптимизация изображений',
      blocks: [
        {
          type: 'code',
          language: 'javascript',
          content: `<!-- srcset — адаптивные изображения по ширине -->
<img
  src="image-400.jpg"
  srcset="image-400.jpg 400w, image-800.jpg 800w, image-1200.jpg 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 900px) 800px, 1200px"
  alt="photo"
>

<!-- Браузер выбирает нужный размер: -->
<!-- экран 375px, dpr=2 → нужно 750px → выберет image-800.jpg -->

<!-- WebP с fallback: -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="photo">
</picture>

<!-- Lazy loading: -->
<img src="photo.jpg" loading="lazy" alt="...">
<!-- или через IntersectionObserver для кастомного контроля -->`,
        },
        {
          type: 'list',
          content:
            '**WebP** — 25-35% меньше PNG/JPEG при том же качестве. Поддерживается всеми современными браузерами.\n**AVIF** — ещё эффективнее WebP, но поддержка уже.\n**Lazy loading** — `loading="lazy"` (нативный) или IntersectionObserver (кастомный).\n**Responsive images** — srcset + sizes для разных DPR и viewport.\n**Blur placeholder** — показывать маленькое размытое изображение до загрузки оригинала.',
        },
      ],
    },
    {
      title: 'JavaScript Performance',
      blocks: [
        {
          type: 'code',
          language: 'javascript',
          content: `// requestAnimationFrame для плавной анимации
// Выполняется перед каждым кадром (~60fps = каждые 16ms)
function animate() {
  element.style.transform = \`translateX(\${pos++}px)\`;
  if (pos < 300) requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// Web Workers для CPU-intensive задач
// НЕ блокирует главный поток
const worker = new Worker('worker.js');
worker.postMessage({ data: bigArray });
worker.onmessage = (e) => {
  console.log('Результат:', e.data.result);
};

// worker.js:
self.onmessage = (e) => {
  const result = heavyComputation(e.data.data);
  self.postMessage({ result });
};`,
        },
        {
          type: 'list',
          content:
            '**requestAnimationFrame** — синхронизация с частотой обновления экрана, лучше setInterval для анимаций.\n**Web Workers** — параллельные вычисления в отдельном потоке без доступа к DOM.\n**IntersectionObserver** — эффективно (без scroll-события) отслеживать видимость элементов.\n**ResizeObserver** — отслеживать изменения размеров элементов.\n**Performance API** — `performance.now()`, `performance.mark()` для профилирования.',
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Избегайте "Forced Synchronous Layout": чтение `offsetWidth`, `scrollTop`, `getBoundingClientRect` после записи стиля принудительно запускает reflow синхронно. Используйте `requestAnimationFrame` для батчинга записей.',
        },
      ],
    },
    {
      title: 'Core Web Vitals и метрики производительности',
      blocks: [
        {
          type: 'text',
          content:
            'Google Core Web Vitals — стандартные метрики UX, которые Google учитывает в ранжировании и которые часто спрашивают на собеседованиях по frontend:',
        },
        {
          type: 'list',
          content: `**LCP (Largest Contentful Paint)** — когда загружается самый большой видимый элемент. Цель: < 2.5s. Улучшить: preload изображений, CDN, server-side rendering.
**FID (First Input Delay)** / **INP (Interaction to Next Paint)** — задержка первого взаимодействия. Цель: FID < 100ms, INP < 200ms. Улучшить: разбить долгий JS на чанки.
**CLS (Cumulative Layout Shift)** — суммарный сдвиг макета (элементы прыгают). Цель: < 0.1. Улучшить: резервировать место под изображения/рекламу (width/height атрибуты).
**TTFB (Time to First Byte)** — время до первого байта от сервера. Цель: < 800ms. Улучшить: CDN, кеширование, edge computing.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Измерение Core Web Vitals через Performance API:
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'largest-contentful-paint') {
      console.log('LCP:', entry.startTime);
    }
    if (entry.entryType === 'layout-shift') {
      console.log('CLS contribution:', entry.value);
    }
  }
});

observer.observe({ type: 'largest-contentful-paint', buffered: true });
observer.observe({ type: 'layout-shift', buffered: true });

// Библиотека web-vitals от Google:
// import { getLCP, getFID, getCLS } from 'web-vitals';
// getCLS(metric => sendToAnalytics(metric));`,
        },
        {
          type: 'heading',
          content: 'requestAnimationFrame vs setTimeout для анимаций',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// ❌ setTimeout — может пропускать кадры или работать вне синхронизации
let x = 0;
function animateBad() {
  x += 1;
  element.style.left = x + 'px';
  setTimeout(animateBad, 16); // ~60fps, но не точно
}

// ✅ requestAnimationFrame — синхронизируется с refresh rate монитора
function animateGood(timestamp) {
  x += 1;
  element.style.transform = \`translateX(\${x}px)\`; // composite ← быстрее!
  requestAnimationFrame(animateGood);
}
requestAnimationFrame(animateGood);

// ✅ Остановка анимации:
let rafId;
function start() { rafId = requestAnimationFrame(animateGood); }
function stop()  { cancelAnimationFrame(rafId); }`,
        },
        {
          type: 'heading',
          content: 'Virtual Scrolling — для больших списков',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Проблема: рендерить 10000 элементов → DOM перегружен
// Решение: рендерить только видимые элементы + небольшой буфер

function getVisibleRange(scrollTop, containerHeight, itemHeight) {
  const start = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const end = Math.min(start + visibleCount + 1, totalItems);
  const offsetY = start * itemHeight;
  return { start, end, offsetY };
}

// Container имеет totalItems * itemHeight высоту
// Рендерим только items[start..end]
// Сдвигаем через transform: translateY(offsetY)
// Это подход React Virtualized, TanStack Virtual`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Типичный вопрос на собеседованиях: как оптимизировать список из 10000 элементов? Ответ: virtual scrolling + `transform: translateY()` вместо `top` (composite vs layout).',
        },
      ],
    },
  ],
};
