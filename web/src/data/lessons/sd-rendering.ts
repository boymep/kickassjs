import type { Lesson } from '../../types/lesson';
import type { QuizQuestion } from '../../types/quiz';
import type { Flashcard } from '../../types/flashcard';

// =============================================================================
// Quiz pool. Часть вопросов идёт в checkpoint глав, остальные — в финальный
// квиз. Идентификаторы checkpoint и finalQuiz не пересекаются (см. инвариант
// в src/test/lessons.test.ts).
// =============================================================================

const quizQuestions: QuizQuestion[] = [
  {
    type: 'output',
    id: 'sdr-q1',
    description: 'Какую роль выполняет HTML, который браузер получает в чистом CSR-приложении (например, классический Create React App)?',
    code: `<!doctype html>
<html>
  <head><title>App</title></head>
  <body>
    <div id="root"></div>
    <script src="/static/bundle.js"></script>
  </body>
</html>`,
    options: [
      'HTML уже содержит готовую разметку и пригоден для индексации без JavaScript',
      'HTML — это пустая «оболочка»: контент появится только после загрузки и выполнения JS-бандла',
      'HTML рендерится на сервере при каждом запросе, JS отвечает только за интерактивность',
      'HTML генерируется на этапе сборки, на сервере его нет',
    ],
    correctIndex: 1,
    explanation:
      'В чистом CSR сервер отдаёт минимальную «обёртку» с пустым контейнером и ссылкой на бандл. Контент рендерится в браузере после загрузки и парсинга JavaScript — это и определяет долгий FCP/LCP и проблемы с SEO-краулерами без рендеринга JS.',
  },
  {
    type: 'fill-blank',
    id: 'sdr-q2',
    description: 'Допишите подход рендеринга, при котором HTML генерируется заранее на этапе сборки и кешируется на CDN.',
    codeWithBlanks: `// Next.js App Router
export const dynamic = 'force-static'; // фактически __BLANK__
export default async function Page() {
  const posts = await fetchPosts();
  return <List posts={posts} />;
}`,
    options: ['SSR', 'SSG', 'ISR', 'CSR'],
    correctIndex: 1,
    explanation:
      'force-static в App Router включает Static Site Generation: страница рендерится один раз при build и кладётся как статический файл на CDN. SSR пересобирает HTML на каждом запросе, ISR обновляет уже задеплоенный HTML по расписанию, CSR не рендерит на сервере вовсе.',
  },
  {
    type: 'output',
    id: 'sdr-q3',
    description: 'Что произойдёт во время гидрации (hydration) после получения SSR-HTML?',
    code: `// Сервер вернул готовый HTML с разметкой <button>Like</button>.
// Затем пришёл JS-бандл, и React выполняет:
hydrateRoot(document.getElementById('root'), <App />);`,
    options: [
      'React стирает серверный HTML и рендерит DOM с нуля',
      'React сопоставляет уже существующий DOM с виртуальным деревом и навешивает обработчики событий',
      'React отправляет ещё один запрос на сервер и подменяет HTML',
      'Браузер просто загружает HTML повторно через fetch и заменяет body',
    ],
    correctIndex: 1,
    explanation:
      'hydrateRoot не перерисовывает DOM — он «оживляет» существующую разметку: проходит по дереву, привязывает обработчики и инициализирует состояние. Если серверный и клиентский рендер расходятся, появляется ошибка hydration mismatch.',
  },
  {
    type: 'output',
    id: 'sdr-q4',
    description: 'Почему страница с долгим SSR может ощущаться «зависшей» до завершения hydration?',
    code: `// 1. Сервер собрал полный HTML, отправил браузеру.
// 2. Браузер показал FCP — пользователь видит контент.
// 3. Бандл скачивается и парсится.
// 4. React делает hydrate. Кнопки и формы пока НЕ реагируют.`,
    options: [
      'Hydration не нужна и блокирует рендер только в SPA',
      'До завершения hydration JS-обработчики не привязаны, поэтому нажатия игнорируются',
      'Браузер не показывает HTML, пока не завершится hydration',
      'Hydration выполняется на сервере и не влияет на клиент',
    ],
    correctIndex: 1,
    explanation:
      'Между FCP и TTI есть «слепая зона»: HTML уже виден, но JS ещё не привязал обработчики. Любые клики до конца hydration теряются. Решения — partial hydration, islands и React Server Components, которые уменьшают объём кода, нуждающегося в гидрации.',
  },
  {
    type: 'fill-blank',
    id: 'sdr-q5',
    description: 'Какая стратегия описывается: страница собрана статически, но Vercel пересобирает её в фоне раз в N секунд при наличии трафика?',
    codeWithBlanks: `// Next.js App Router
export const revalidate = 60; // __BLANK__
export default async function Page() { ... }`,
    options: ['CSR', 'SSR', 'ISR', 'SSG без revalidate'],
    correctIndex: 2,
    explanation:
      'Incremental Static Regeneration: первый посетитель получает закэшированную статику (как SSG), но если страница «протухла», в фоне запускается новая сборка. Следующий запрос увидит свежую версию. Это компромисс между скоростью SSG и свежестью SSR.',
  },
  {
    type: 'output',
    id: 'sdr-q6',
    description: 'Что делает streaming SSR с использованием React 18 (renderToPipeableStream)?',
    code: `import { renderToPipeableStream } from 'react-dom/server';
const { pipe } = renderToPipeableStream(<App />, { onShellReady() { pipe(res); } });`,
    options: [
      'Дожидается полного рендера всего дерева и одной строкой пишет в response',
      'Отправляет HTML по частям: сначала «оболочку», затем по мере готовности — Suspense-границы',
      'Отключает SSR и переходит на CSR при медленном соединении',
      'Кеширует HTML в Redis и стримит из кеша',
    ],
    correctIndex: 1,
    explanation:
      'Streaming SSR начинает писать HTML в сокет, как только готова shell (всё, что вне Suspense). Медленные части отправляются позже отдельными чанками с инструкциями для клиента. Это улучшает TTFB и FCP без потери SEO.',
  },
  {
    type: 'output',
    id: 'sdr-q7',
    description: 'Чем React Server Components отличаются от классического SSR?',
    code: `// app/page.tsx — Server Component (по умолчанию в App Router)
import db from '@/db';

export default async function Page() {
  const posts = await db.posts.findMany();
  return <List posts={posts} />; // List — тоже server component
}`,
    options: [
      'RSC отправляют клиенту JS-бандл компонента, а сервер только отдаёт props',
      'RSC рендерятся только на сервере, не отправляют свой код в браузер и сериализуются в специальный формат',
      'RSC — это просто синоним SSR, никакой разницы нет',
      'RSC рендерятся в браузере, но после первого SSR-запроса',
    ],
    correctIndex: 1,
    explanation:
      'Server-компонент исполняется только на сервере: его JS-код не попадает в бандл клиента, а результат рендеринга сериализуется в специальный поток (RSC payload). Клиентский React получает уже готовое дерево и не тратит ресурсы на повторное выполнение этой части. Это уменьшает размер бандла и время гидрации.',
  },
  {
    type: 'fill-blank',
    id: 'sdr-q8',
    description: 'Какой паттерн описывается: статическая страница, которой не нужен JS, кроме небольших независимых интерактивных «островков»?',
    codeWithBlanks: `// Astro
---
import LikeButton from './LikeButton.tsx';
---
<article>...</article>
<LikeButton client:visible /> {/* __BLANK__ */}`,
    options: ['Streaming', 'Islands architecture', 'ISR', 'CSR'],
    correctIndex: 1,
    explanation:
      'Архитектура островков (Astro, Marko, Fresh) гидрирует только отдельные интерактивные блоки, а остальной HTML остаётся статичным. client:visible — директива Astro, которая гидрирует компонент только при попадании в viewport. Объём JS на странице минимизируется в разы.',
  },
  {
    type: 'complexity',
    id: 'sdr-q9',
    description: 'Каковы характеристики SSR с точки зрения нагрузки на сервер?',
    code: `// Каждый запрос → обработчик собирает HTML
app.get('*', async (req, res) => {
  const html = await renderToString(<App url={req.url} />);
  res.send(html);
});`,
    options: [
      'O(1) на запрос — сервер просто отдаёт файл',
      'Линейная нагрузка на CPU: рендер дерева на каждый запрос; масштабируется горизонтально',
      'Нет нагрузки на сервер, всё считает клиент',
      'Постоянная нагрузка только при первом запросе, дальше работает кеш браузера',
    ],
    correctIndex: 1,
    explanation:
      'SSR — самая дорогая стратегия по CPU: на каждый уникальный запрос запускается React-рендер, парсинг данных, сериализация. Поэтому SSR-приложения масштабируют горизонтально и активно используют кеширование (HTTP-кеш, edge-cache, ISR) для разгрузки.',
  },
  {
    type: 'output',
    id: 'sdr-q10',
    description: 'Когда выбор «чистый CSR (SPA)» оправдан?',
    code: `// Внутренняя CRM/админка для авторизованных пользователей.`,
    options: [
      'Когда нужны идеальный SEO и LCP < 1s на 4G',
      'Когда страница за пейволом, SEO не важен, а UX — это длинные сессии и сложные формы',
      'Когда сайт состоит из миллионов товаров и должен индексироваться',
      'Когда мы не хотим использовать JavaScript',
    ],
    correctIndex: 1,
    explanation:
      'CSR хорошо подходит для приложений за авторизацией: SEO не нужен, первый paint всё равно происходит после логина, а нагрузка на сервер минимальна. Для публичных, контентных страниц CSR проигрывает SSR/SSG/ISR по SEO, перформансу на мобильных и Core Web Vitals.',
  },
  {
    type: 'output',
    id: 'sdr-q11',
    description: 'Что чаще всего вызывает hydration mismatch в Next.js / React 18?',
    code: `function Now() {
  return <span>{new Date().toLocaleTimeString()}</span>;
}`,
    options: [
      'Сервер и клиент рендерят разный текст: на сервере одно время, в браузере уже другое',
      'Next.js всегда рендерит компонент дважды и это норма',
      'Ошибка возникает только в production-сборке',
      'Это проблема CSS, а не React',
    ],
    correctIndex: 0,
    explanation:
      'Любые источники недетерминизма (Date.now, Math.random, window/localStorage, локаль) дают разный HTML на сервере и клиенте. Решения: useEffect для отложенного рендера, suppressHydrationWarning для коротких текстовых отличий, или вынос в Client Component.',
  },
  {
    type: 'fill-blank',
    id: 'sdr-q12',
    description: 'Какую метрику страдает в первую очередь при больших клиентских JS-бандлах в SSR-приложении?',
    codeWithBlanks: `// SSR + 800 кБ JS:
// FCP ≈ 0.6s (HTML пришёл быстро)
// __BLANK__ ≈ 4–6s (JS долго парсится и hydrate-ится)`,
    options: ['LCP', 'TTI (Time To Interactive)', 'TTFB', 'CLS'],
    correctIndex: 1,
    explanation:
      'TTI зависит от того, когда JS-бандл загрузился, распарсился и завершилась hydration. На медленных мобильных устройствах TTI часто в 5–10 раз больше FCP — пользователь видит контент, но не может с ним взаимодействовать. Это причина появления RSC и islands-архитектур.',
  },
];

const Q = Object.fromEntries(quizQuestions.map((q) => [q.id, q]));

const CHECKPOINT_IDS = new Set(['sdr-q1', 'sdr-q3', 'sdr-q5', 'sdr-q9']);

// =============================================================================
// Flashcards
// =============================================================================

const flashcards: Flashcard[] = [
  {
    id: 'sdr-f1',
    question: 'Что такое CSR (Client-Side Rendering)?',
    answer:
      'Сервер отдаёт «пустой» HTML с контейнером и ссылкой на бандл. Весь рендер происходит в браузере после загрузки и выполнения JavaScript. Хорошо подходит для приложений за авторизацией, плохо — для SEO и первой загрузки на медленных сетях.',
    keyPoints: [
      'HTML минимален: <div id="root"></div> + <script>',
      'FCP зависит от размера и скорости JS-бандла',
      'SEO работает только если краулер исполняет JS (Googlebot — да, многие — нет)',
      'Низкая нагрузка на сервер: статика + API',
      'Идеально для SPA-админок, CRM, дашбордов за логином',
    ],
  },
  {
    id: 'sdr-f2',
    question: 'Что такое SSR (Server-Side Rendering)?',
    answer:
      'Сервер на каждый запрос рендерит React-дерево в строку HTML и отдаёт её браузеру. Хороший FCP и SEO «из коробки», но высокая нагрузка на CPU и сложная инфраструктура (нужен Node.js на хостинге).',
    keyPoints: [
      'Запрос → renderToString/renderToPipeableStream → HTML',
      'Хорош для контентных и e-commerce сайтов',
      'TTFB растёт пропорционально сложности страницы',
      'Требует кеширования (CDN, ISR-эффект, Redis-кеш)',
      'После HTML начинается hydration, и до её завершения страница «не кликается»',
    ],
  },
  {
    id: 'sdr-f3',
    question: 'Что такое SSG (Static Site Generation)?',
    answer:
      'HTML собирается один раз во время build и раздаётся как статика — обычно через CDN. Минимальный TTFB, нулевой расход серверных ресурсов в рантайме. Подходит для блогов, документации, лендингов с редко меняющимся контентом.',
    keyPoints: [
      'Билд: vite/next build → HTML-файлы',
      'CDN-раздача → TTFB обычно 30–80 мс',
      'Контент устаревает до следующего build',
      'Плохо масштабируется по числу страниц (миллион товаров → миллион билдов)',
      'В Next.js: export const dynamic = "force-static"',
    ],
  },
  {
    id: 'sdr-f4',
    question: 'Что такое ISR (Incremental Static Regeneration)?',
    answer:
      'Гибрид SSG и SSR: страница хранится как статика, но раз в N секунд (или по on-demand revalidate) пересобирается в фоне. Первый посетитель видит «старую» версию, следующий — обновлённую.',
    keyPoints: [
      'Next.js: export const revalidate = 60',
      'Не блокирует ответ — старый HTML отдаётся мгновенно',
      'Решает проблему SSG для часто меняющегося контента',
      'On-demand revalidate: revalidatePath(path), revalidateTag(tag)',
      'Хорошо работает на edge с распределённым кешем',
    ],
    code: `export const revalidate = 60;
export default async function Page() {
  const data = await fetch('https://api.example.com/posts')
    .then((r) => r.json());
  return <List posts={data} />;
}`,
    codeLanguage: 'tsx',
  },
  {
    id: 'sdr-f5',
    question: 'Что такое hydration?',
    answer:
      'Процесс, при котором клиентский React «оживляет» уже отрисованный сервером HTML: сопоставляет узлы с виртуальным деревом, восстанавливает state, навешивает обработчики событий. До конца hydration страница не интерактивна.',
    keyPoints: [
      'hydrateRoot(container, <App />) вместо createRoot',
      'Мисматч сервера и клиента → ошибка hydration mismatch',
      'TTI = FCP + время загрузки/парсинга/hydration JS',
      'Решения для дорогой hydration: partial, islands, RSC',
      'Источники мисматча: Date.now, Math.random, window, локаль, темы',
    ],
  },
  {
    id: 'sdr-f6',
    question: 'Что такое streaming SSR?',
    answer:
      'Сервер отдаёт HTML по частям: сначала «оболочку» (header, layout), затем по готовности — содержимое внутри Suspense-границ. Браузер начинает отображать страницу до того, как сервер закончит работу.',
    keyPoints: [
      'React 18: renderToPipeableStream / renderToReadableStream',
      'Suspense-границы — это явные «контрольные точки» стрима',
      'TTFB ≈ время до первой Suspense-границы, не до полного дерева',
      'Браузер ждёт <head> до отрисовки, поэтому head должен попасть в первый чанк',
      'Не путать с потоковой передачей файлов: это HTTP chunked transfer',
    ],
  },
  {
    id: 'sdr-f7',
    question: 'Что такое React Server Components (RSC)?',
    answer:
      'Серверный тип компонента, чей код не попадает в клиентский бандл. Его результат сериализуется в специальный поток (RSC payload) и встраивается в дерево вместе с обычными Client Components. Уменьшает объём JS на клиенте.',
    keyPoints: [
      'Без "use client" — компонент по умолчанию серверный (Next.js App Router)',
      'Доступ к БД, файлам, секретам прямо в компоненте',
      'Нельзя использовать useState/useEffect и обработчики событий',
      'Composable: server → client → server иерархии работают',
      'RSC payload — это не HTML, а сериализованное виртуальное дерево',
    ],
  },
  {
    id: 'sdr-f8',
    question: 'Что такое islands architecture?',
    answer:
      'Подход, при котором страница в основном статична, а интерактивность реализуется отдельными «островками» — независимыми компонентами с собственной hydration. Применяется в Astro, Marko, Fresh, Qwik.',
    keyPoints: [
      'Большая часть страницы — обычный HTML без JS',
      'Каждый «островок» гидрируется лениво (visible/idle/load)',
      'Размер JS-бандла на странице падает в разы',
      'Хорошо сочетается с SSG для блогов и landing-страниц',
      'Astro: <Component client:visible />',
    ],
  },
  {
    id: 'sdr-f9',
    question: 'Когда выбирать CSR, SSR, SSG или ISR?',
    answer:
      'CSR — закрытое за логином приложение. SSR — динамичный персонализированный контент с требованием SEO. SSG — редко меняющиеся страницы с массовым трафиком. ISR — частично динамичный контент, который должен быстро отдаваться, но не должен быть слишком устаревшим.',
    keyPoints: [
      'CSR: админка, редактор, dashboard за авторизацией',
      'SSR: персонализированная лента, личные кабинеты с SEO',
      'SSG: блог, документация, лендинг, маркетинговые страницы',
      'ISR: каталог товаров, новостной портал, агрегаторы',
      'Реальные приложения комбинируют стратегии для разных страниц',
    ],
  },
  {
    id: 'sdr-f10',
    question: 'Что такое hydration mismatch и как с ним бороться?',
    answer:
      'Ошибка, когда HTML, сгенерированный сервером, не совпадает с тем, что отрендерил клиент при первом проходе. React в dev-режиме ругается, в prod молча перерисовывает дерево, теряя преимущества SSR.',
    keyPoints: [
      'Источники: Date.now(), Math.random(), window/localStorage, локаль/таймзона',
      'Решение 1: useEffect → отрисовать значение только на клиенте',
      'Решение 2: suppressHydrationWarning для коротких отличий вроде времени',
      'Решение 3: вынос в Client Component с заглушкой на сервере',
      'Логирование ошибок в prod через console + Sentry',
    ],
  },
  {
    id: 'sdr-f11',
    question: 'Что такое partial / progressive hydration?',
    answer:
      'Стратегия, при которой компоненты гидрируются не все сразу, а постепенно — по приоритету (видимы, простаивают, при взаимодействии). Уменьшает блокировку main thread сразу после первого рендера.',
    keyPoints: [
      'React lazy + Suspense на границах',
      'Селективная hydration в React 18: важные компоненты гидрируются раньше',
      'Astro/Qwik делают это нативно через директивы',
      'Цель — снизить TTI, особенно на мобильных устройствах',
      'Не путать с SSR streaming: streaming — про отправку HTML, hydration — про оживление',
    ],
  },
  {
    id: 'sdr-f12',
    question: 'Чем resumability в Qwik отличается от hydration?',
    answer:
      'Resumability — подход, при котором сервер сериализует не только HTML, но и состояние/обработчики прямо в DOM. Клиент не выполняет hydration: при первом клике подгружается ровно тот код, который нужен этому обработчику.',
    keyPoints: [
      'Qwik: HTML содержит атрибуты на://qrl с ссылками на код обработчика',
      'Нет общей фазы hydration → TTI ≈ FCP',
      'Цена: сложнее модель программирования, кодсплит на каждом обработчике',
      'Сравнимо с lazy на стероидах',
      'Подходит для очень больших публичных сайтов',
    ],
  },
  {
    id: 'sdr-f13',
    question: 'Какие метрики отвечают за рендеринг и за что они отвечают?',
    answer:
      'TTFB — время до первого байта (отвечает сервер/CDN). FCP — первый видимый контент. LCP — самый большой видимый блок (картинка, заголовок). TTI — когда страница становится отзывчивой. INP — задержка следующего взаимодействия.',
    keyPoints: [
      'TTFB: SSG ≈ 30 мс, SSR — 100–600 мс, ISR ≈ SSG для cache hit',
      'FCP: первый текст/картинка, чувствителен к шрифтам',
      'LCP — Core Web Vital, цель < 2.5s на 75% сессий',
      'TTI — особенно страдает у больших SPA с долгой hydration',
      'INP заменил FID в 2024, измеряет p75 всех взаимодействий',
    ],
  },
  {
    id: 'sdr-f14',
    question: 'Как edge-rendering отличается от классического SSR?',
    answer:
      'Edge-функции выполняются на CDN-узлах ближе к пользователю — TTFB сокращается до десятков миллисекунд. Платой служит ограниченное окружение: нет доступа к Node API, ограничения на размер кода и время выполнения.',
    keyPoints: [
      'Cloudflare Workers, Vercel Edge, Deno Deploy',
      'Веб-стандартные API: fetch, Request, Response — нет fs/net',
      'Холодный старт ≈ 0 (V8 isolate, не Lambda-контейнер)',
      'Лимиты: CPU time (10–50 мс), память',
      'Идеально для геолокализированных страниц и A/B-тестов',
    ],
  },
];

// =============================================================================
// Lesson
// =============================================================================

export const sdRenderingLesson: Lesson = {
  topicId: 'sd-rendering',

  intro: {
    whyItMatters: `Стратегия рендеринга определяет, **где** и **когда** ваш HTML превращается в пиксели на экране пользователя. От этого зависит почти всё, что измеряют Core Web Vitals: TTFB, FCP, LCP, TTI, INP. CSR (Client-Side Rendering) перекладывает рендер на браузер: сервер отдаёт пустую обёртку и большой JS-бандл, контент появляется только после его загрузки и выполнения. SSR (Server-Side Rendering) собирает HTML на сервере на каждый запрос — лучший FCP и SEO, но высокая нагрузка на CPU и сложная инфраструктура. SSG (Static Site Generation) рендерит страницы один раз при build и раздаёт их через CDN — мгновенный TTFB, но устаревший контент до следующего build. ISR (Incremental Static Regeneration) — гибрид: статика + фоновое обновление. Streaming SSR (React 18) отправляет HTML по частям, сокращая TTFB и позволяя браузеру начать рендер до того, как сервер закончит работу.

С 2022–2024 годов индустрия отчётливо возвращается к серверному рендеру: пухлые SPA на 800+ кБ JS перестали окупаться на мобильных сетях, требования к SEO ужесточились (Google официально подтвердил, что Core Web Vitals — фактор ранжирования), а появление React Server Components и islands-архитектур (Astro, Qwik, Fresh) дало инженерам инструменты, которые раньше требовали написания собственного фреймворка. Понимание hydration становится критичным: до её завершения страница «зависает» — пользователь видит контент, но клики игнорируются. Чем больше JS гидрируется, тем хуже TTI и INP.

В этом уроке вы научитесь подбирать стратегию под требования продукта (CSR для админок, SSR для персонализации, SSG/ISR для контентных страниц), читать архитектурные диаграммы Next.js App Router, объяснять, почему RSC уменьшают клиентский бандл, и грамотно отвечать на вопросы senior-интервьюера про trade-off'ы между скоростью, свежестью и стоимостью инфраструктуры.`,
    estimatedMinutes: 45,
    interviewAngle:
      'Senior-интервьюер проверяет не определения, а умение делать обоснованный выбор: какую стратегию вы предложите для лендинга / каталога / личного кабинета и почему, как объясните trade-off между свежестью и нагрузкой, понимаете ли разницу между SSR и RSC, и знаете ли вы, как hydration влияет на TTI и INP.',
    prerequisites: [],
  },

  resources: {
    videos: [
      {
        source: 'youtube',
        id: 'PN1HgvAOmi8',
        title: 'Advanced Rendering Patterns — Lydia Hallie',
        channel: 'Real World React',
        language: 'en',
        durationSec: 30 * 60,
        description:
          'Лучший обзорный доклад: Lydia Hallie сравнивает CSR, SSR, SSG, ISR, streaming, islands и progressive hydration на одних и тех же диаграммах. Must-watch перед углублением в Next.js.',
      },
      {
        source: 'youtube',
        id: 'DuSa5E-GgwU',
        title: 'React Server Components (with Next.js Demo)',
        channel: 'leerob',
        language: 'en',
        durationSec: 30 * 60,
        description:
          'Lee Robinson на живом проекте показывает, чем RSC отличаются от классического SSR: что не попадает в клиентский бандл, как работают Client/Server-границы и почему это меняет подход к data fetching.',
      },
      {
        source: 'youtube',
        id: 'hma6jzXoGtU',
        title: 'Next.js Rendering Strategies Explained — CSR vs SSR vs SSG vs ISR',
        channel: 'My Digital Diaries',
        language: 'en',
        durationSec: 18 * 60,
        description:
          'Прикладной разбор четырёх стратегий на примерах Next.js App Router: где какую директиву ставить, как конфигурируется revalidate и когда какую стратегию выбирать.',
      },
    ],
    links: [
      {
        url: 'https://www.patterns.dev/vanilla/rendering-patterns',
        title: 'Rendering Patterns — patterns.dev',
        source: 'article',
        language: 'en',
        note: 'Канонический справочник по CSR, SSR, SSG, ISR, streaming и hydration с диаграммами и кодом.',
      },
      {
        url: 'https://web.dev/articles/rendering-on-the-web',
        title: 'Rendering on the Web — web.dev',
        source: 'web-dev',
        language: 'en',
        note: 'Классическая статья Jason Miller и Addy Osmani: где провести границу между статикой, динамикой и гидрацией.',
      },
      {
        url: 'https://nextjs.org/docs/app/building-your-application/rendering',
        title: 'Rendering — Next.js docs (App Router)',
        source: 'article',
        language: 'en',
        note: 'Официальная документация: Server vs Client Components, Static/Dynamic/Streaming, revalidate, edge runtime.',
      },
      {
        url: 'https://react.dev/reference/rsc/server-components',
        title: 'Server Components — React docs',
        source: 'article',
        language: 'en',
        note: 'Официальная спецификация RSC от команды React: модель, ограничения, сериализация payload.',
      },
      {
        url: 'https://docs.astro.build/en/concepts/islands/',
        title: 'Islands Architecture — Astro docs',
        source: 'article',
        language: 'en',
        note: 'Лучшее введение в островную архитектуру с разбором директив client:load / client:idle / client:visible.',
      },
    ],
  },

  chapters: [
    {
      id: 'overview',
      title: 'Карта стратегий рендеринга',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            'Стратегия рендеринга — это ответ на вопрос: **где** и **когда** ваш React/Vue/Svelte превращается в HTML, а затем — в интерактивный DOM. Все варианты лежат на двух осях: «build-time vs request-time vs client-time» и «полная hydration vs частичная vs её отсутствие».',
        },
        {
          type: 'list',
          content: `- **CSR** — рендер в браузере, HTML почти пустой.
- **SSR** — рендер на сервере на каждый запрос, плюс hydration на клиенте.
- **SSG** — рендер один раз во время build, отдача статики через CDN.
- **ISR** — SSG с фоновой пересборкой по таймеру или on-demand.
- **Streaming SSR** — SSR, который отдаёт HTML по частям через chunked transfer.
- **RSC** — серверные компоненты, чей код не попадает в клиентский бандл.
- **Islands** — статика + точечная hydration отдельных интерактивных «островков».`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Реальные приложения почти никогда не используют одну стратегию. Next.js App Router и Remix позволяют выбирать стратегию **на уровне роута**: лендинг — SSG, каталог — ISR, личный кабинет — SSR, поисковая выдача — streaming, админка — CSR.',
        },
        { type: 'heading', content: 'Шкала «свежесть vs скорость»' },
        {
          type: 'text',
          content:
            'Чем «дальше» рендер от запроса пользователя — тем быстрее ответ, но тем труднее показать актуальные данные. SSG отвечает за десятки миллисекунд, но может показать вчерашнюю цену. SSR отвечает за сотни миллисекунд, но всегда показывает текущее состояние. ISR — компромисс: «достаточно свежо, очень быстро».',
        },
        {
          type: 'code',
          language: 'tsx',
          content: `// Next.js App Router: одна и та же страница, четыре стратегии.

// CSR: всё рендерится на клиенте.
'use client';
export default function Page() {
  const { data } = useSWR('/api/posts', fetcher);
  return <List posts={data} />;
}

// SSR (динамический): пересобирается на каждый запрос.
export const dynamic = 'force-dynamic';
export default async function Page() {
  const posts = await db.posts.findMany();
  return <List posts={posts} />;
}

// SSG: собирается один раз при build.
export const dynamic = 'force-static';
export default async function Page() {
  const posts = await db.posts.findMany();
  return <List posts={posts} />;
}

// ISR: SSG + фоновое обновление раз в 60 секунд.
export const revalidate = 60;
export default async function Page() {
  const posts = await db.posts.findMany();
  return <List posts={posts} />;
}`,
        },
      ],
      flashcardIds: ['sdr-f1', 'sdr-f9'],
      checkpoint: [Q['sdr-q1']!],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/Performance', title: 'Производительность — MDN (ru)' },
    },

    {
      id: 'csr-vs-ssr',
      title: 'CSR и SSR: компромиссы и метрики',
      estimatedMinutes: 8,
      blocks: [
        { type: 'heading', content: 'CSR — рендер в браузере' },
        {
          type: 'text',
          content:
            'В чистом CSR сервер отдаёт минимальный HTML — `<div id="root"></div>` плюс ссылку на бандл. Браузер скачивает JS, парсит, исполняет, и только потом появляется первый контент. Это худшее, что можно показать на 4G на мобильном — белый экран на 3–8 секунд.',
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'CSR оправдан только за авторизацией: админки, дашборды, IDE-подобные приложения. В этих кейсах SEO не важен, первый paint всё равно происходит после логина, а нагрузка на сервер минимальна — он отдаёт только статику и API.',
        },
        { type: 'heading', content: 'SSR — рендер на сервере' },
        {
          type: 'text',
          content:
            'SSR собирает HTML на каждый запрос через `renderToString` или `renderToPipeableStream`. Пользователь видит контент сразу (FCP ≈ TTFB), краулеры получают полную разметку без выполнения JS. Платой служит CPU-нагрузка: на каждый запрос запускается полный React-рендер с парсингом, обходом дерева и сериализацией.',
        },
        {
          type: 'code',
          language: 'tsx',
          content: `// Минимальный SSR на Express.
import express from 'express';
import { renderToString } from 'react-dom/server';
import App from './App';

const app = express();
app.get('*', (req, res) => {
  const html = renderToString(<App url={req.url} />);
  res.send(\`<!doctype html>
    <html>
      <head><title>SSR</title></head>
      <body>
        <div id="root">\${html}</div>
        <script src="/bundle.js"></script>
      </body>
    </html>\`);
});`,
        },
        { type: 'heading', content: 'Метрики, на которые они влияют' },
        {
          type: 'list',
          content: `- **TTFB** (Time To First Byte): SSR — 100–600 мс, CSR — мгновенно (статика).
- **FCP** (First Contentful Paint): SSR — близко к TTFB, CSR — после загрузки и парсинга бандла.
- **LCP** (Largest Contentful Paint): SSR обычно выигрывает из-за раннего FCP.
- **TTI** (Time To Interactive): зависит от размера JS и времени hydration в обоих случаях.
- **INP** (Interaction to Next Paint): обе стратегии страдают одинаково при больших бандлах.`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Сравнивать CSR и SSR корректно только при равном размере бандла. Если SSR-приложение тащит на клиент те же 800 кБ JS, hydration съедает преимущество в FCP, а TTI остаётся таким же. Поэтому современный ответ — SSR + урезание клиентского бандла через RSC.',
        },
      ],
      flashcardIds: ['sdr-f1', 'sdr-f2', 'sdr-f13'],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Learn/Server-side/First_steps/Introduction', title: 'Серверный рендеринг — MDN (ru)' },
    },

    {
      id: 'ssg-isr',
      title: 'SSG и ISR: статика как стратегия',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            'SSG — самая старая и самая быстрая стратегия рендера. Во время `next build` или `astro build` фреймворк проходит по всем известным маршрутам, рендерит каждый и сохраняет HTML на диск. CDN раздаёт эти файлы как статику — TTFB обычно 30–80 мс, нагрузка на сервер нулевая.',
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'SSG ломается на двух паттернах: «миллион страниц» (миллион build-job-ов нерационально) и «часто меняющиеся данные» (между билдами контент устаревает). Для первого случая решением стал ISR, для второго — гибридные подходы.',
        },
        { type: 'heading', content: 'ISR — Incremental Static Regeneration' },
        {
          type: 'text',
          content:
            'ISR от Vercel — это SSG, который умеет «протухать». Вы помечаете страницу как `revalidate: 60`, и она ведёт себя как обычная статика, пока не пройдут 60 секунд. После этого первый посетитель получает закешированный HTML, но в фоне запускается новый build — следующий посетитель увидит свежую версию.',
        },
        {
          type: 'code',
          language: 'tsx',
          content: `// app/blog/[slug]/page.tsx
export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await db.posts.findMany({ select: { slug: true } });
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await db.posts.findUnique({ where: { slug: params.slug } });
  if (!post) notFound();
  return <Article post={post} />;
}`,
        },
        { type: 'heading', content: 'On-demand revalidation' },
        {
          type: 'text',
          content:
            'Иногда не хочется ждать таймера. В Next.js есть `revalidatePath(path)` и `revalidateTag(tag)`: вы вызываете их из webhook-а CMS, и кеш для конкретной страницы или группы страниц мгновенно протухает.',
        },
        {
          type: 'code',
          language: 'tsx',
          content: `// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache';

export async function POST(req: Request) {
  const { tag, secret } = await req.json();
  if (secret !== process.env.REVALIDATE_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }
  revalidateTag(tag);
  return Response.json({ revalidated: true });
}`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Грамотный паттерн для каталога товаров: ISR с большим revalidate (час) + on-demand revalidate из вебхука админки. Покупатели видят страницы за 30 мс, контент-менеджеры — обновления через 1–2 секунды после изменения.',
        },
      ],
      playground: {
        starterCode: `// Какой revalidate выбрать для блог-поста?
// Допишите два числа в секундах так, чтобы:
//   - blog: пост обновляется не чаще раза в час;
//   - news: новостная лента обновляется каждую минуту.
const blogRevalidate = /* число секунд */ 0;
const newsRevalidate = /* число секунд */ 0;

console.log(blogRevalidate, newsRevalidate);`,
        expectedOutput: '3600 60',
        description:
          'Простая задача на понимание единиц измерения revalidate (секунды). Час = 3600, минута = 60. На реальных проектах эти значения подбираются по бизнес-требованиям.',
      },
      flashcardIds: ['sdr-f3', 'sdr-f4'],
      checkpoint: [Q['sdr-q5']!],
      docsLink: { url: 'https://habr.com/ru/hub/next_js/', title: 'SSG и ISR — Habr' },
    },

    {
      id: 'hydration',
      title: 'Hydration: между HTML и интерактивностью',
      estimatedMinutes: 8,
      blocks: [
        {
          type: 'text',
          content:
            'Hydration — процесс «оживления» серверного HTML в браузере. React не перерендеривает дерево с нуля: он проходит по существующему DOM, сопоставляет узлы с виртуальным деревом, восстанавливает state и навешивает обработчики событий. Между моментами «HTML виден» и «страница реагирует на клики» есть слепая зона, в течение которой пользователь видит контент, но взаимодействие игнорируется.',
        },
        {
          type: 'code',
          language: 'tsx',
          content: `// React 17:
import { hydrate } from 'react-dom';
hydrate(<App />, document.getElementById('root'));

// React 18:
import { hydrateRoot } from 'react-dom/client';
hydrateRoot(document.getElementById('root')!, <App />);`,
        },
        { type: 'heading', content: 'Hydration mismatch' },
        {
          type: 'text',
          content:
            'Самая частая ошибка при SSR — «hydration mismatch»: HTML, сгенерированный на сервере, не совпадает с тем, что отрендерил клиент при первом проходе. React в dev-режиме громко предупреждает, в prod молча перерисовывает дерево, теряя все преимущества SSR.',
        },
        {
          type: 'code',
          language: 'tsx',
          content: `// 🔴 Источники недетерминизма
function Now() {
  return <span>{new Date().toLocaleTimeString()}</span>;
  // На сервере: 12:00:00. На клиенте через 200 мс: 12:00:00.2 → mismatch.
}

function ThemeToggle() {
  const dark = localStorage.getItem('theme') === 'dark';
  // localStorage не существует на сервере → undefined ≠ 'dark' → mismatch.
  return <button data-dark={dark}>...</button>;
}

// ✅ Правильный подход: рендер только после mount.
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <>{children}</>;
}`,
        },
        { type: 'heading', content: 'Стоимость hydration' },
        {
          type: 'list',
          content: `- Hydration **синхронна** по умолчанию: блокирует main thread.
- Время hydration пропорционально размеру JS-бандла, не размеру DOM.
- Пока не закончилась — клики, скролл-эффекты, формы не работают.
- На медленных мобильных это десятки секунд для крупных SPA.
- React 18 ввёл селективную hydration: важные интерактивные части гидрируются раньше остальных.`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Большие SSR-приложения часто хуже CSR по TTI: сервер уже всё посчитал, а клиент всё равно вынужден прогнать тот же React-рендер заново для hydration. Это источник «парадокса SSR»: FCP отличный, но кнопки не нажимаются.',
        },
      ],
      flashcardIds: ['sdr-f5', 'sdr-f10', 'sdr-f11'],
      checkpoint: [Q['sdr-q3']!],
      docsLink: { url: 'https://habr.com/ru/hub/reactjs/', title: 'Гидратация — Habr' },
    },

    {
      id: 'streaming-rsc',
      title: 'Streaming SSR и React Server Components',
      estimatedMinutes: 9,
      blocks: [
        { type: 'heading', content: 'Streaming SSR' },
        {
          type: 'text',
          content:
            'Streaming SSR разрезает рендер на части и отправляет HTML по мере готовности. Браузер начинает разбирать `<head>` и показывать «оболочку» страницы до того, как сервер закончит работу. React 18 реализует это через `renderToPipeableStream` (Node.js) и `renderToReadableStream` (Edge).',
        },
        {
          type: 'code',
          language: 'tsx',
          content: `// Node.js
import { renderToPipeableStream } from 'react-dom/server';

app.get('*', (req, res) => {
  const { pipe } = renderToPipeableStream(<App />, {
    onShellReady() {
      // Готова "оболочка" (всё, что вне Suspense) → начинаем стримить.
      res.setHeader('Content-Type', 'text/html');
      pipe(res);
    },
    onError(err) { console.error(err); },
  });
});

// Любой компонент в <Suspense> "разрезает" стрим.
function App() {
  return (
    <Layout>
      <Suspense fallback={<Skeleton />}>
        <SlowFeed /> {/* долгая выборка из БД */}
      </Suspense>
    </Layout>
  );
}`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'TTFB при streaming SSR ≈ время до первой Suspense-границы, а не до полного дерева. На странице с одним медленным компонентом из десяти быстрых пользователь увидит 90% контента почти мгновенно.',
        },
        { type: 'heading', content: 'React Server Components (RSC)' },
        {
          type: 'text',
          content:
            'RSC — фундаментально новый тип компонента: его код **не попадает в клиентский бандл**. Сервер рендерит компонент, сериализует результат в специальный поток (RSC payload) и отправляет клиенту. Клиентский React встраивает этот поток в дерево вместе с обычными Client Components. По умолчанию в Next.js App Router каждый компонент — серверный.',
        },
        {
          type: 'code',
          language: 'tsx',
          content: `// app/posts/page.tsx — серверный компонент (по умолчанию).
import db from '@/db';

export default async function Posts() {
  const posts = await db.posts.findMany(); // прямой доступ к БД!
  return (
    <ul>
      {posts.map((p) => (
        <li key={p.id}>
          <h3>{p.title}</h3>
          <LikeButton postId={p.id} /> {/* Client Component */}
        </li>
      ))}
    </ul>
  );
}

// app/posts/LikeButton.tsx
'use client';
import { useState } from 'react';

export function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(true)}>{liked ? '♥' : '♡'}</button>;
}`,
        },
        {
          type: 'list',
          content: `- Server-компонент исполняется **только** на сервере, его код не отправляется в браузер.
- Внутри можно делать \`await\`, обращаться к БД, читать секреты — это безопасно.
- Нельзя использовать \`useState\`, \`useEffect\`, обработчики событий, browser API.
- Граница «Server → Client» помечается директивой \`'use client'\` в начале файла.
- RSC payload — это **не HTML**, а сериализованное виртуальное дерево с плейсхолдерами для Client Components.`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Главный выигрыш RSC — не скорость рендера, а **размер клиентского бандла**. Огромные npm-зависимости (markdown-парсер, ORM, шаблонизатор) больше не попадают в браузер. Результат — лучше TTI и INP, особенно на мобильных.',
        },
      ],
      flashcardIds: ['sdr-f6', 'sdr-f7', 'sdr-f14'],
      checkpoint: [Q['sdr-q9']!],
      docsLink: { url: 'https://habr.com/ru/hub/reactjs/', title: 'React Server Components — Habr' },
    },

    {
      id: 'islands',
      title: 'Islands и resumability',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Islands architecture (Astro, Marko, Fresh) переворачивает идею SSR: страница по умолчанию **полностью статична** и не содержит JS, а интерактивность реализуется отдельными «островками» — независимыми компонентами с собственной hydration. Объём JS на странице падает в разы.',
        },
        {
          type: 'code',
          language: 'astro',
          content: `---
import LikeButton from './LikeButton.tsx';
import Newsletter from './Newsletter.tsx';
const post = await fetchPost(Astro.params.slug);
---

<article>
  <h1>{post.title}</h1>
  <p>{post.body}</p>

  {/* Островок: гидрируется при попадании в viewport */}
  <LikeButton client:visible postId={post.id} />

  {/* Другой островок: гидрируется в idle */}
  <Newsletter client:idle />
</article>`,
        },
        {
          type: 'list',
          content: `- \`client:load\` — гидрируется сразу.
- \`client:idle\` — после requestIdleCallback.
- \`client:visible\` — при попадании в viewport (IntersectionObserver).
- \`client:media\` — по media-query (например, только на десктопе).
- \`client:only\` — рендерится только на клиенте, без SSR.`,
        },
        { type: 'heading', content: 'Resumability (Qwik)' },
        {
          type: 'text',
          content:
            'Qwik идёт дальше: он отказывается от hydration вообще. Сервер сериализует не только HTML, но и состояние с обработчиками прямо в DOM-атрибуты. Когда пользователь кликает, Qwik по требованию подгружает ровно тот код, который нужен этому обработчику. TTI ≈ FCP даже на огромных страницах.',
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Resumability платит сложностью разработки: каждый обработчик становится отдельным lazy-чанком, требуется специальный компилятор. Это оправдано для очень больших публичных сайтов; для типичного SaaS islands-подхода Astro обычно достаточно.',
        },
      ],
      flashcardIds: ['sdr-f8', 'sdr-f12'],
      docsLink: { url: 'https://habr.com/ru/hub/next_js/', title: 'Islands Architecture — Habr' },
    },

    {
      id: 'choosing',
      title: 'Как выбрать стратегию',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Стратегия рендера выбирается **на уровне роута**, а не приложения. Современный фреймворк (Next.js App Router, Remix, Nuxt 3) позволяет смешивать подходы. Опорные вопросы при выборе:',
        },
        {
          type: 'list',
          content: `- Нужен ли SEO? → Да: SSR/SSG/ISR. Нет: CSR подойдёт.
- Часто ли меняются данные? → Раз в сутки: SSG. Раз в час: ISR. На каждый запрос: SSR.
- Контент персонализирован? → Да: SSR (или CSR за логином). Нет: SSG/ISR.
- Сколько у вас страниц? → Тысячи: SSG ок. Миллионы: ISR + on-demand revalidate.
- Какова цена сервера? → Дешёво: SSG. Дорого: ограничьте SSR кеш-слоем.`,
        },
        { type: 'heading', content: 'Типичные комбинации' },
        {
          type: 'code',
          language: 'tsx',
          content: `// E-commerce
//   /                       → SSG     (главная редко меняется)
//   /catalog                → ISR 60s (каталог обновляется по часу)
//   /product/[id]           → ISR + on-demand revalidate (вебхук от админки)
//   /cart                   → CSR     (персональная корзина, SEO не нужен)
//   /checkout               → SSR     (нужны актуальные цены и наличие)
//   /admin/*                → CSR     (за авторизацией)

// Контентный портал
//   /                       → ISR 5m  (главная с новостями)
//   /article/[slug]         → ISR 1h + on-demand
//   /search?q=...           → SSR     (свежий поиск, плюс SEO)
//   /profile                → CSR     (личный кабинет)

// SaaS-приложение
//   /landing                → SSG     (маркетинговая страница)
//   /pricing                → SSG     (цены меняются раз в квартал)
//   /docs/*                 → SSG     (документация)
//   /app/*                  → CSR     (само приложение за логином)`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Типичная антипаттерн-история: команда делает «всё на SSR», потому что «так модно», и через год обнаруживает, что 80% страниц можно было бы отдавать как статику с CDN. Counter-антипаттерн: «всё на SSG», после чего personalization появляется только через CSR-flicker. Подбирайте стратегию на каждый роут.',
        },
        {
          type: 'text',
          content:
            'На собеседовании senior-уровня этот блок звучит как кейс: «вам приносят дизайн нового маркетплейса — какие страницы делаете SSR, какие SSG, какие ISR, и почему». Ответ строится не из определений, а из требований к свежести, SEO, персонализации и нагрузке.',
        },
      ],
      flashcardIds: ['sdr-f9'],
      docsLink: { url: 'https://developer.mozilla.org/ru/docs/Web/Performance', title: 'Производительность — MDN (ru)' },
    },
  ],

  finalQuiz: quizQuestions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  flashcards,

  cheatsheet: `### Шпаргалка по стратегиям рендеринга

- **CSR** — пустой HTML + JS-бандл; SEO плохой, нагрузка минимальна. Подходит для админок за логином.
- **SSR** — HTML на сервере на каждый запрос; SEO отличный, CPU-нагрузка высокая. Подходит для персонализации.
- **SSG** — HTML собирается при build, раздаётся CDN; TTFB ≈ 30 мс, контент устаревает до перебилда.
- **ISR** — SSG + фоновое обновление через \`revalidate: N\` или \`revalidateTag()\`. Лучший компромисс «свежесть/скорость».
- **Streaming SSR** — \`renderToPipeableStream\`, отправка HTML по частям через Suspense; снижает TTFB.
- **RSC** — серверные компоненты, чей код не попадает в клиентский бандл; уменьшают TTI и INP.
- **Islands (Astro/Qwik)** — статика + точечная hydration. Минимум JS на странице.
- **Hydration** = «оживление» SSR-HTML на клиенте; до её завершения страница не реагирует на клики.
- **Mismatch** = расхождение SSR/CSR HTML (Date, random, localStorage, локаль) → \`useEffect\` или \`'use client'\`.
- Стратегия выбирается на каждый роут: главная — SSG, каталог — ISR, личный кабинет — CSR/SSR.`,

  interviewQA: [
    {
      id: 'sdr-iq1',
      question: 'Объясните разницу между CSR, SSR, SSG и ISR. Когда какую стратегию использовать?',
      shortAnswer:
        'CSR рендерит в браузере, SSR — на сервере на каждый запрос, SSG — при build, ISR — гибрид (статика + фоновое обновление). Выбор зависит от SEO, частоты изменений и персонализации.',
      fullAnswer: `Это базовый вопрос «на разогрев», но senior-уровень определяется деталями.

**CSR** — сервер отдаёт пустой HTML и JS-бандл, рендер происходит в браузере. Плюсы: минимальная нагрузка на сервер. Минусы: плохой SEO (если краулер не выполняет JS), долгий FCP/LCP, белый экран на мобильных. Подходит для приложений за авторизацией, где SEO не требуется.

**SSR** — на каждый запрос сервер рендерит React-дерево в строку HTML. Плюсы: отличный FCP, рабочий SEO, актуальные данные. Минусы: высокая CPU-нагрузка, нужен Node.js на хостинге, после HTML начинается hydration. Подходит для персонализированных страниц с требованием SEO.

**SSG** — HTML собирается один раз во время \`build\` и раздаётся через CDN. Плюсы: TTFB ≈ 30 мс, нулевая стоимость рантайма, идеальные Core Web Vitals. Минусы: контент устаревает до следующего build, не масштабируется на миллионы страниц. Подходит для блогов, документации, лендингов.

**ISR** — SSG с фоновой пересборкой по таймеру (\`revalidate: 60\`) или on-demand (\`revalidatePath\`/\`revalidateTag\`). Решает проблему свежести SSG, сохраняя TTFB. Подходит для каталогов товаров, новостных порталов.

В реальном проекте стратегии **смешиваются на уровне роута**: главная — SSG, каталог — ISR, корзина — CSR, чекаут — SSR.`,
      followUps: [
        'Какие метрики Core Web Vitals страдают сильнее всего у CSR-приложений и почему?',
        'Как ISR обрабатывает запрос, когда кеш уже протух, но новая сборка ещё не завершилась?',
        'Почему SSR не решает все проблемы CSR — от чего зависит TTI?',
      ],
      relatedChapterId: 'overview',
    },
    {
      id: 'sdr-iq2',
      question: 'Что такое hydration и какие проблемы она создаёт? Как с ними бороться?',
      shortAnswer:
        'Hydration — процесс «оживления» SSR-HTML в браузере: React сопоставляет DOM с виртуальным деревом и навешивает обработчики. До её завершения страница не интерактивна; типичные проблемы — mismatch и долгий TTI.',
      fullAnswer: `Hydration — фаза, в которой клиентский React превращает уже отрендеренный сервером HTML в полноценное интерактивное приложение. \`hydrateRoot\` не перерендеривает дерево, а проходит по существующему DOM, сопоставляет его с виртуальным деревом, восстанавливает state и навешивает обработчики событий.

**Проблема 1 — mismatch.** HTML, сгенерированный сервером, должен **точно** совпадать с тем, что вернёт первый клиентский render. Источники недетерминизма: \`new Date()\`, \`Math.random()\`, обращение к \`window\`/\`localStorage\`, локаль и таймзона, темы. В dev-режиме React громко предупреждает, в prod — молча перерисовывает дерево, теряя выгоду от SSR.

Решения:
- \`useEffect\` для отрисовки значения только на клиенте (паттерн ClientOnly).
- \`suppressHydrationWarning\` для коротких отличий (например, текущее время).
- Вынос компонента в Client Component с заглушкой во время SSR.

**Проблема 2 — долгий TTI.** Hydration синхронна, она блокирует main thread, и пока не закончилась, клики и формы не работают. На большом SPA это десятки секунд на медленном мобильном. Ощущается как «кнопки не нажимаются», хотя контент виден.

Решения:
- Урезать клиентский бандл (RSC, code splitting, tree shaking).
- Селективная hydration React 18: важные интерактивные части гидрируются раньше.
- Перейти на islands (Astro) или resumability (Qwik), которые гидрируют по частям или вообще не гидрируют.`,
      followUps: [
        'Как именно React 18 решает, какие компоненты гидрировать раньше других?',
        'Почему useEffect помогает избежать hydration mismatch?',
        'Чем отличается hydration от resumability в Qwik?',
      ],
      relatedChapterId: 'hydration',
    },
    {
      id: 'sdr-iq3',
      question: 'Чем React Server Components отличаются от классического SSR?',
      shortAnswer:
        'SSR рендерит компоненты на сервере, но их код всё равно отправляется в клиентский бандл для hydration. RSC исполняются только на сервере, в браузер уходит сериализованный результат — клиентский бандл уменьшается.',
      fullAnswer: `Классический SSR не уменьшает клиентский бандл: сервер исполняет React-рендер, но затем тот же компонентный код отправляется в браузер и снова исполняется во время hydration. Это «двойная работа»: рендер дважды, парсинг JS на клиенте, увеличенный TTI.

**RSC меняют модель.** Server Component исполняется **только** на сервере, и его JS-код **не попадает** в клиентский бандл. Результат рендеринга сериализуется в специальный поток (RSC payload) — это не HTML, а сериализованное виртуальное дерево с плейсхолдерами для Client Components. Браузер получает payload, встраивает его в дерево и рендерит без повторного выполнения серверного кода.

Архитектурные следствия:
- В Server Component можно делать \`await db.findMany()\`, читать файлы, обращаться к секретам — этот код никогда не попадёт в браузер.
- В Server Component нельзя использовать \`useState\`, \`useEffect\`, обработчики событий и browser API.
- Граница помечается директивой \`'use client'\` в начале файла; такие компоненты ведут себя как обычные React-компоненты с hydration.
- Server Component может рендерить Client Component и передавать ему props, но не наоборот напрямую (только через children).

Главный практический выигрыш — **размер клиентского бандла**. Тяжёлые зависимости (markdown-парсер, ORM, шаблонизатор) остаются на сервере. Это улучшает TTI и INP, особенно на мобильных. Также упрощается data fetching: больше не нужен отдельный API-слой для собственного фронта, данные читаются прямо в компоненте.`,
      followUps: [
        'Что именно отправляется в RSC payload? Чем он отличается от HTML?',
        'Как работает граница Server → Client → Server в RSC?',
        'Почему в Server Component нельзя использовать useState?',
      ],
      relatedChapterId: 'streaming-rsc',
    },
    {
      id: 'sdr-iq4',
      question: 'Что такое streaming SSR и какие метрики он улучшает?',
      shortAnswer:
        'Streaming SSR (\`renderToPipeableStream\` в React 18) отправляет HTML по частям через chunked transfer: сначала «оболочку», затем по мере готовности — куски внутри Suspense. Сильно сокращает TTFB и FCP.',
      fullAnswer: `В классическом SSR с \`renderToString\` сервер ждёт, пока полностью отрендерится дерево и сериализуется в строку, и только потом отправляет ответ. Если в дереве есть медленный компонент (запрос в БД, вызов внешнего API), пользователь ждёт самого долгого блока.

Streaming SSR разрезает этот процесс на части:
1. Сервер начинает рендер и отправляет в сокет «оболочку» (всё, что вне \`Suspense\`) — обычно \`<head>\`, layout, header.
2. Браузер получает первый чанк, парсит \`<head>\`, начинает грузить CSS и шрифты.
3. По мере того как готовы Suspense-границы, сервер отправляет дополнительные чанки. React добавляет туда HTML и небольшой инлайн-скрипт, который вставляет содержимое в нужное место в DOM.
4. Когда всё дерево готово, сервер закрывает соединение.

Реализация в React 18: \`renderToPipeableStream\` (Node.js) и \`renderToReadableStream\` (Edge). Колбэк \`onShellReady\` вызывается, когда оболочка готова, и в нём начинается стриминг.

**Метрики.** TTFB ≈ время до первой Suspense-границы, а не до полного дерева — на странице с одним медленным компонентом из десяти быстрых пользователь увидит 90% контента почти мгновенно. FCP сокращается соответственно. На LCP влияет, попал ли крупнейший элемент в первый чанк или нет — это важно для SEO-ранжирования.

Streaming хорошо сочетается с RSC: серверный поток одновременно содержит HTML (для FCP) и RSC payload (для последующих обновлений). Next.js App Router использует это по умолчанию.`,
      followUps: [
        'Как именно React встраивает поздние Suspense-чанки в правильное место DOM?',
        'Что произойдёт, если медленный компонент отвалится с ошибкой посреди стрима?',
        'Можно ли использовать streaming SSR на edge-runtime, и какие там ограничения?',
      ],
      relatedChapterId: 'streaming-rsc',
    },
    {
      id: 'sdr-iq5',
      question: 'Что такое islands architecture и в чём её преимущество перед обычным SSR + hydration?',
      shortAnswer:
        'Islands — подход, при котором страница в основном статична, а интерактивность реализуется отдельными независимыми компонентами с собственной hydration. Объём JS на странице падает в разы, TTI улучшается.',
      fullAnswer: `В классическом SSR-приложении на странице работает один корневой компонент, и hydration выполняется для **всего дерева целиком**. Это приводит к парадоксу: на лендинге с одной кнопкой «подписаться» в браузер всё равно отгружается весь React-рантайм, роутер, стейт-менеджер и все вложенные компоненты.

Islands переворачивает модель. Каждая интерактивная часть страницы — отдельный «островок» со своей мини-hydration; остальное остаётся статичным HTML без JS. Astro, Marko, Fresh и ряд других фреймворков реализуют этот паттерн.

\`\`\`astro
---
import LikeButton from './LikeButton.tsx';
const post = await fetchPost(Astro.params.slug);
---
<article>
  <h1>{post.title}</h1>
  <p>{post.body}</p>
  <LikeButton client:visible postId={post.id} />
</article>
\`\`\`

Директивы Astro управляют, **когда** гидрировать остров: \`client:load\` (сразу), \`client:idle\` (в простой), \`client:visible\` (при попадании в viewport), \`client:media\` (по media-query), \`client:only\` (вообще без SSR).

**Преимущества:**
- В JS-бандл попадает только код интерактивных островков, а не всей страницы.
- Каждый остров изолирован: можно использовать React, Vue и Svelte на одной странице.
- TTI улучшается в разы для контентных сайтов с редкой интерактивностью.

**Ограничения:**
- Сложнее организовать общий стейт между островками (нужны явные стор-решения вроде nanostores).
- Не подходит для приложений, где почти всё интерактивно (SaaS-дашборды).

В 2024 индустрия осознала, что обычные SaaS-страницы редко требуют тотальной интерактивности — и islands плюс RSC вытесняют классический «всё на React» подход.`,
      followUps: [
        'Чем resumability в Qwik отличается от islands в Astro?',
        'Как организовать общее состояние между двумя островками?',
        'Когда islands не подходят и нужен обычный SSR?',
      ],
      relatedChapterId: 'islands',
    },
    {
      id: 'sdr-iq6',
      question: 'Как стратегии рендеринга влияют на Core Web Vitals (LCP, INP, CLS)?',
      shortAnswer:
        'SSR/SSG дают лучший LCP за счёт раннего HTML. INP страдает от размера клиентского бандла независимо от стратегии — RSC и islands его уменьшают. CLS зависит от структуры HTML и шрифтов, не от стратегии.',
      fullAnswer: `**LCP (Largest Contentful Paint)** — время появления самого крупного видимого элемента (заголовок, картинка). На него прямо влияет, как быстро пришёл HTML.
- SSG/ISR: TTFB 30–80 мс, LCP обычно укладывается в 1.5 с при адекватных ресурсах.
- SSR: TTFB 100–600 мс, LCP — 1.5–3 с.
- CSR: LCP ≥ времени загрузки и парсинга бандла, легко уезжает за 4 с на 4G.

**INP (Interaction to Next Paint)** — задержка между взаимодействием и следующим paint. Зависит от того, сколько работы выполняет main thread:
- Стратегия рендера сама по себе на INP не влияет; влияет **размер клиентского JS** и качество кода.
- Большая SPA с сотнями компонентов и тяжёлыми обработчиками показывает INP > 500 мс независимо от того, CSR это или SSR.
- RSC и islands улучшают INP, потому что уменьшают объём JS, который выполняется при каждом взаимодействии.

**CLS (Cumulative Layout Shift)** — суммарный «прыжок» содержимого после первого paint. Зависит от:
- Заявленных размеров изображений (атрибут \`width/height\` или CSS).
- Стратегии загрузки шрифтов (\`font-display: optional\` или preload).
- Поведения скелетонов и плейсхолдеров.

Стратегия рендера на CLS почти не влияет, но при streaming SSR появляется специфичный риск: поздние Suspense-чанки могут «толкать» уже отрисованный контент, если не зарезервировано место под них (skeleton с фиксированной высотой решает проблему).

**TTFB** не входит в Core Web Vitals, но Google использует его как ранжирующий фактор. SSG/ISR здесь вне конкуренции.`,
      followUps: [
        'Почему INP заменил FID в 2024 году?',
        'Как preload-инг шрифтов влияет на CLS и почему \`font-display: optional\` помогает?',
        'Какие конкретные оптимизации улучшают INP в Next.js приложении?',
      ],
      relatedChapterId: 'csr-vs-ssr',
    },
    {
      id: 'sdr-iq7',
      question: 'Опишите архитектуру рендеринга для маркетплейса (главная, каталог, карточка товара, корзина, чекаут, админка).',
      shortAnswer:
        'Главная — SSG, каталог — ISR с on-demand revalidate, карточка товара — ISR + on-demand, корзина — CSR, чекаут — SSR, админка — CSR. Стратегии смешиваются на уровне роута.',
      fullAnswer: `Это типичный системный кейс на senior-собеседовании. Сильный ответ строится не из определений, а из требований к свежести, SEO и нагрузке.

**Главная страница (\`/\`)** — маркетинговый блок, баннеры, подборки. Меняется раз в сутки силами маркетинга. Идеально подходит **SSG** с пересборкой по вебхуку CMS.

**Каталог (\`/catalog\`, \`/catalog/[category]\`)** — миллионы товаров, нужен SEO, цены и наличие меняются. Решение: **ISR** с \`revalidate: 3600\` (час) плюс on-demand \`revalidateTag('catalog:' + categoryId)\` из вебхука админки. Покупатели получают страницы за 30 мс, обновления цен — через 1–2 секунды.

**Карточка товара (\`/product/[id]\`)** — критичен для SEO, чувствительна к свежести цены. **ISR** с большим revalidate + on-demand revalidate при изменении товара. Если товаров миллионы, используем \`generateStaticParams\` только для топ-N популярных, остальные генерируются по первому запросу (fallback: blocking).

**Корзина (\`/cart\`)** — приватная, SEO не нужен, требует мгновенной реакции на действия пользователя. Здесь подходит **CSR** или Client Component внутри Next.js App Router. Данные держим в локальном сторе плюс синк на сервер.

**Чекаут (\`/checkout\`)** — нужны актуальные цены, наличие, доступные способы оплаты. **SSR** с \`force-dynamic\`: без кеширования, но быстро благодаря streaming.

**Поиск (\`/search?q=...\`)** — динамичный, разные результаты на каждый запрос. **SSR**, желательно на edge для низкой латентности.

**Админка (\`/admin/*\`)** — за авторизацией, SEO не нужен, сложный UI. **CSR** или клиентское приложение со своим роутером.

В Next.js App Router всё это конфигурируется директивами \`dynamic\` и \`revalidate\` на уровне сегмента роута. Команда платит когнитивную цену за разнообразие, но получает выигрыш в Core Web Vitals и стоимости инфраструктуры.`,
      followUps: [
        'Как организовать инвалидацию кеша при изменении товара в этой архитектуре?',
        'Что произойдёт с ISR-страницей при первом запросе после деплоя нового build?',
        'Как разделить логику авторизации между SSR-страницами и CSR-приложением?',
      ],
      relatedChapterId: 'choosing',
    },
    {
      id: 'sdr-iq8',
      question: 'Как edge-rendering меняет картину? В чём его сильные и слабые стороны?',
      shortAnswer:
        'Edge-функции (Cloudflare Workers, Vercel Edge) выполняются на CDN-узлах ближе к пользователю — TTFB сокращается до десятков миллисекунд. Платой служит ограниченное окружение: нет Node API, лимиты CPU и размера кода.',
      fullAnswer: `Классический SSR разворачивается в одном или нескольких регионах. Пользователь из Сингапура, обращающийся к серверу в Франкфурте, платит сетевую латентность 200+ мс ещё до того, как сервер начнёт работать.

**Edge-rendering** размещает функции на сотнях CDN-узлов. Запрос обрабатывается в ближайшем к пользователю PoP, TTFB ≈ 30–80 мс независимо от региона. Платформы: Cloudflare Workers, Vercel Edge Functions, Deno Deploy, AWS Lambda@Edge.

**Сильные стороны:**
- Низкая латентность для глобальной аудитории.
- Нет «холодного старта» в классическом смысле — V8 isolate стартует за единицы миллисекунд.
- Идеально для геолокализированных страниц, A/B-тестов, заголовков безопасности.
- Хорошо сочетается со streaming SSR: каждый чанк уходит сразу.

**Слабые стороны:**
- **Ограниченное окружение.** Доступны только веб-стандартные API: \`fetch\`, \`Request\`, \`Response\`, \`Crypto\`, \`Streams\`. Нет \`fs\`, \`net\`, нативных модулей Node.
- **Лимиты CPU.** Workers — 10 мс CPU time на бесплатном плане, до 30 с на платном. Жирный SSR на edge запускать нельзя.
- **Размер кода.** Worker-бандл ограничен 1–10 МБ; большие npm-зависимости могут не влезть.
- **Доступ к БД.** Нужен HTTP-протокол (Postgres через Neon/PlanetScale, Redis через Upstash) — обычные TCP-клиенты не работают.
- **Регионально-зависимый стейт.** Если БД в одном регионе, edge-функция в Сингапуре платит латентность за каждый запрос — теряется смысл.

**Практический паттерн:** edge-rendering для лёгких страниц (главная, лендинг, поиск с кешем), классический SSR — для тяжёлых (чекаут, личный кабинет). Next.js позволяет указать runtime на уровне сегмента: \`export const runtime = 'edge'\` или \`'nodejs'\`.`,
      followUps: [
        'Как edge-функции работают с базой данных в другом регионе?',
        'Какие конкретные npm-пакеты нельзя использовать на edge и почему?',
        'Чем V8 isolate в Cloudflare Workers отличается от контейнера AWS Lambda?',
      ],
      relatedChapterId: 'choosing',
    },
  ],

  nextTopics: [
    {
      slug: 'sd-caching',
      reason:
        'Все стратегии рендера, кроме чистого CSR, опираются на кеширование (CDN, ISR-кеш, edge-cache, HTTP-заголовки). Без понимания инвалидации кеша грамотно настроить ISR не получится.',
    },
    {
      slug: 'sd-performance',
      reason:
        'Выбор стратегии рендеринга — главный рычаг для Core Web Vitals. После выбора стратегии разговор переходит к бюджету бандла, lazy-загрузке и оптимизации картинок.',
    },
  ],
};
