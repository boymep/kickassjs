import type { Lesson } from '../../types/lesson';
import type { QuizQuestion } from '../../types/quiz';

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
// Lesson
// =============================================================================

export const sdRenderingLesson: Lesson = {
  topicId: 'sd-rendering',

  intro: {
    whyItMatters: `Стратегия рендеринга определяет, где и когда HTML превращается в пиксели на экране. От этого зависит TTFB, FCP, LCP и SEO. CSR перекладывает рендер на браузер, SSR собирает HTML на сервере на каждый запрос, SSG рендерит страницы при build и раздаёт через CDN, ISR обновляет статику в фоне. Streaming SSR (React 18) отправляет HTML по частям.

С 2022 года индустрия возвращается к серверному рендеру: тяжёлые SPA перестали окупаться на мобильных сетях, требования к SEO ужесточились, появились React Server Components и islands-архитектуры. На собеседовании проверяют, как кандидат рассуждает о trade-off между скоростью, свежестью данных и нагрузкой на инфраструктуру.`,
    estimatedMinutes: 35,
    interviewAngle:
      'Интервьюера интересует обоснованный выбор: какую стратегию для лендинга / каталога / личного кабинета и почему, как объясняется trade-off между свежестью и нагрузкой, и понимание разницы между SSR и RSC.',
    prerequisites: [],
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
            'Есть несколько способов доставить HTML пользователю: собрать в браузере (CSR), на сервере при каждом запросе (SSR), один раз при сборке (SSG) или обновлять периодически в фоне (ISR). Каждый вариант — это компромисс между скоростью загрузки, свежестью данных и нагрузкой на сервер. Не существует «лучшей» стратегии — есть правильная для конкретной страницы.',
        },
        {
          type: 'text',
          content:
            'На собеседовании по System Design тебя почти наверняка попросят выбрать стратегию для конкретного продукта. Блог с редко меняющимся контентом → SSG (собрали один раз, CDN отдаёт за 30 мс). Новостная лента → ISR или SSR (данные должны быть свежими). Корзина и личный кабинет → CSR (за авторизацией, SEO не нужен). Хороший ответ — это трейдофф, а не определение.',
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
      checkpoint: [Q['sdr-q1']!, {
        type: 'ordering',
        id: 'sdr-ord1',
        description: 'Расставь этапы Server-Side Rendering (SSR) в правильном порядке',
        items: [
          'Браузер отправляет HTTP запрос на сервер',
          'Сервер рендерит React компоненты в HTML строку',
          'Сервер отправляет готовый HTML браузеру',
          'Браузер показывает HTML (страница видна, но не интерактивна)',
          'Браузер загружает JS бандл',
          'Hydration: React привязывает обработчики к существующему DOM',
        ],
        explanation: 'SSR даёт быстрый FCP (First Contentful Paint) — пользователь видит контент до загрузки JS. Hydration — это процесс \'оживления\' серверного HTML. До hydration страница выглядит нормально но не реагирует на клики.',
      }],
    },

    {
      id: 'csr-vs-ssr',
      title: 'CSR и SSR: компромиссы и метрики',
      estimatedMinutes: 8,
      blocks: [
        {
          type: 'text',
          content:
            'CSR и SSR — два полюса. При CSR сервер отдаёт практически пустой HTML — браузер получает `<div id="root"></div>` и огромный JS-бандл. Контент появится только после того, как JavaScript скачается, распарсится и выполнится. На быстром Wi-Fi это незаметно, на 4G или бюджетном телефоне — белый экран на несколько секунд. SSR решает проблему первого рендера, но создаёт нагрузку на сервер.',
        },
        {
          type: 'text',
          content:
            'Ключевой вопрос, который задают на интервью: «когда SSR хуже CSR»? Ответ неочевидный. Если ты делаешь SSR, но тащишь на клиент 800 кБ JS для гидрации — TTI (время до первого клика) будет таким же плохим, как у CSR. SSR даёт хороший FCP, но не спасает от тяжёлого бандла. Поэтому современный ответ — SSR + RSC, которые уменьшают клиентский бандл.',
        },
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
    },

    {
      id: 'ssg-isr',
      title: 'SSG и ISR: статика как стратегия',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            'SSG — идея простая: собери все страницы заранее, выложи как статичные файлы, раздавай через CDN. Никакого сервера при запросе — пользователь получает готовый HTML напрямую из ближайшего CDN-узла. TTFB обычно 30–80 мс, это самый быстрый вариант из всех. Подходит для блогов, документации, лендингов — всего, что меняется редко.',
        },
        {
          type: 'text',
          content:
            'ISR — это SSG с одной умной добавкой: страница может «протухнуть» и пересобраться в фоне. Ты ставишь `revalidate: 60`, и первый посетитель после истечения минуты получит старую страницу, но в фоне запустится новая сборка. Следующий пользователь уже увидит свежую версию. На интервью часто путают ISR и SSR — запомни: ISR отдаёт статику, SSR пересобирает на каждый запрос.',
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
      checkpoint: [Q['sdr-q5']!, {
        type: 'match-pairs',
        id: 'sdr-mp1',
        description: 'Сопоставь стратегию рендеринга с её лучшим use case',
        pairs: [
          { left: 'CSR (Client-Side Rendering)', right: 'SPA с частыми обновлениями, не критичен SEO' },
          { left: 'SSR (Server-Side Rendering)', right: 'SEO важен, данные меняются при каждом запросе' },
          { left: 'SSG (Static Site Generation)', right: 'Контент редко меняется: блог, документация' },
          { left: 'ISR (Incremental Static Regeneration)', right: 'Статика с периодическим обновлением данных' },
        ],
        explanation: 'CSR — минимальный TTFB, плохой SEO. SSR — хороший SEO, нагрузка на сервер. SSG — максимальная производительность, данные \'запечены\' на этапе билда. ISR — компромисс: статика с ревалидацией через N секунд.',
      }],
    },

    {
      id: 'hydration',
      title: 'Hydration: между HTML и интерактивностью',
      estimatedMinutes: 8,
      blocks: [
        {
          type: 'text',
          content:
            'Гидрация (hydration) — это процесс «оживления» серверного HTML. Сервер отдаёт готовый HTML — пользователь сразу видит страницу. Потом браузер загружает JS и React «прикрепляет» обработчики к DOM. До этого момента страница выглядит нормально, но клики не работают. Это не баг, это архитектурная особенность: ты платишь небольшой задержкой интерактивности ради быстрого первого контента.',
        },
        {
          type: 'text',
          content:
            'Если серверный и клиентский HTML не совпадают — React перерисовывает всё заново (hydration mismatch). Частые причины: Math.random(), Date.now(), браузерные API в коде который запускается на сервере. В dev-режиме React громко ругается, в production — молча перерисовывает, теряя все преимущества SSR. Самая коварная ловушка — localStorage или window: они undefined на сервере.',
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
      checkpoint: [Q['sdr-q3']!],
    },

    {
      id: 'streaming-rsc',
      title: 'Streaming SSR и React Server Components',
      estimatedMinutes: 9,
      blocks: [
        {
          type: 'text',
          content:
            'Обычный SSR работает по принципу «всё или ничего»: сервер рендерит всё дерево, потом отправляет HTML. Если один компонент ждёт медленный запрос к БД — весь пользователь ждёт. Streaming SSR меняет это: сервер начинает отправлять HTML сразу, а медленные части добавляются потом. Пользователь видит заголовок и навигацию пока список постов ещё грузится.',
        },
        {
          type: 'text',
          content:
            'React Server Components — ещё один уровень: компонент исполняется только на сервере и его код вообще не попадает в браузерный бандл. Огромная markdown-библиотека, ORM, криптография — всё это остаётся на сервере. На интервью частый вопрос: «чем RSC отличается от SSR?» — ответ прост: при SSR весь код всё равно отправляется в браузер для гидрации, при RSC — нет.',
        },
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
      checkpoint: [Q['sdr-q9']!],
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
          type: 'text',
          content:
            'Аналогия: типичная новостная статья — это просто текст и картинки, JS там нужен только для кнопки «лайк» и формы подписки. Гидрировать всю страницу ради двух кнопок — расточительно. Islands говорит: остальное пусть остаётся статичным HTML. На интервью по архитектуре этот паттерн — хороший пример того, что знаешь современные альтернативы React SPA.',
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
          type: 'text',
          content:
            'На System Design интервью тебя попросят выбрать стратегию для конкретного продукта. Нет универсального ответа — нужно объяснить трейдоффы. Блог → SSG. Лента новостей → SSR/ISR. Дашборд → CSR. Хороший кандидат не называет одну стратегию для всего приложения, а разбирает каждый тип страницы отдельно и объясняет, почему именно этот выбор.',
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
            'На собеседовании этот блок часто звучит как кейс: «приходит дизайн нового маркетплейса — какие страницы делаются SSR, какие SSG, какие ISR, и почему». Ответ строится не из определений, а из требований к свежести, SEO, персонализации и нагрузке.',
        },
      ],
    },
  ],

  finalQuiz: quizQuestions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

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
