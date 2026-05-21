import type { Lesson } from '../../types/lesson';
import type { QuizQuestion } from '../../types/quiz';

// =============================================================================
// Quiz pool. Часть вопросов попадает в checkpoint глав, остальные — в финальный
// квиз. Идентификаторы checkpoint и finalQuiz не пересекаются (см. инвариант
// в src/test/lessons.test.ts).
// =============================================================================

const quizQuestions: QuizQuestion[] = [
  {
    type: 'output',
    id: 'sdo-q1',
    description:
      'Какой из перечисленных сигналов НЕ относится к классическим «трём столпам» observability?',
    code: `// Три столпа: ?
// — metrics
// — logs
// — traces
// — ???`,
    options: [
      'Distributed traces (трассировки)',
      'Structured logs (логи)',
      'Metrics (агрегированные числовые показатели)',
      'Synthetic checks (синтетический мониторинг)',
    ],
    correctIndex: 3,
    explanation:
      'Канонические три столпа — metrics, logs, traces. Synthetic checks — это вид мониторинга (внешние боты ходят по сценариям), но не отдельный «столп» телеметрии. Многие современные авторы (Charity Majors из Honeycomb) вообще считают, что главный сигнал — это «wide events», а metrics/logs/traces — лишь его проекции.',
  },
  {
    type: 'output',
    id: 'sdo-q2',
    description:
      'Чем RUM (Real User Monitoring) отличается от синтетического мониторинга?',
    code: `// RUM: web-vitals на странице → бэкенд аналитики
// Synthetic: cron + Puppeteer/Playwright → симуляция сценария`,
    options: [
      'RUM измеряет реальных пользователей в проде, synthetic — искусственный бот в управляемом окружении',
      'RUM работает только в Chrome, synthetic — в любом браузере',
      'RUM собирает только ошибки, synthetic — только метрики',
      'Это синонимы, термины используются взаимозаменяемо',
    ],
    correctIndex: 0,
    explanation:
      'RUM (field data) — это реальные сессии живых пользователей: разные устройства, сети, локации, версии браузеров. Synthetic (lab data) — повторяемые проверки в одинаковых условиях, удобные для регрессий. Google для ранжирования использует именно RUM-данные через CrUX.',
  },
  {
    type: 'fill-blank',
    id: 'sdo-q3',
    description: 'Допишите имя метрики Core Web Vitals, которая в 2024 году заменила FID.',
    codeWithBlanks: `import { onLCP, onCLS, on__BLANK__ } from 'web-vitals';

on__BLANK__((metric) => navigator.sendBeacon('/rum', JSON.stringify(metric)));`,
    options: ['INP', 'TTI', 'TBT', 'FID'],
    correctIndex: 0,
    explanation:
      'INP (Interaction to Next Paint) стал стабильным Core Web Vital в марте 2024 года и официально заменил FID. INP измеряет p98-задержку всех взаимодействий за сессию, FID — только первое. Цель «good» — INP ≤ 200 мс на 75% сессий.',
  },
  {
    type: 'output',
    id: 'sdo-q4',
    description:
      'Что обязательно загрузить в Sentry, чтобы стек-трейсы из production-сборки были читаемыми?',
    code: `// vite.config.ts
import { sentryVitePlugin } from '@sentry/vite-plugin';
export default defineConfig({
  plugins: [sentryVitePlugin({ org, project, authToken: env.SENTRY_AUTH_TOKEN })],
  build: { sourcemap: true },
});`,
    options: [
      'Минифицированный бандл и больше ничего',
      'Source maps (.js.map) — Sentry развернёт минификацию обратно в исходники',
      'Полный исходный код приложения, который попадёт в браузер',
      'Готовый PDF-отчёт от QA',
    ],
    correctIndex: 1,
    explanation:
      'Без source maps стек-трейс выглядит как `a.b.c:1:2345` — отлаживать невозможно. Source maps загружаются в Sentry как артефакты релиза и используются только сервером Sentry для расшифровки. В браузер сами карты не отдаются (директива `//# sourceMappingURL` отключается или указывает на приватный путь).',
  },
  {
    type: 'fill-blank',
    id: 'sdo-q5',
    description:
      'В session replay перед отправкой нужно скрыть данные пользователя. Допишите имя класса/маркера, который Sentry/LogRocket не записывают.',
    codeWithBlanks: `<input
  className="ssn"
  data-sentry-mask
  data-__BLANK__="true"
  defaultValue="123-45-6789"
/>`,
    options: ['debug', 'private', 'private', 'private'],
    correctIndex: 1,
    explanation:
      'В Sentry Replay есть атрибут `data-sentry-mask`/класс `sentry-mask`, в LogRocket — `data-private`. Любые поля с PII (паспорт, карта, email) должны быть помечены как private/mask, иначе появятся в записи и нарушат GDPR/152-ФЗ. По умолчанию Sentry маскирует весь текст и ввод.',
  },
  {
    type: 'output',
    id: 'sdo-q6',
    description: 'Чем feature flag принципиально отличается от A/B-теста?',
    code: `// Feature flag (Unleash)
if (unleash.isEnabled('new-checkout', { userId })) renderNewCheckout();

// A/B test (LaunchDarkly experiments)
const variant = ld.variation('checkout-button-color', user, 'control');`,
    options: [
      'Feature flag — это способ управлять выкаткой и kill-switch, A/B-тест — способ статистически сравнить варианты для принятия продуктового решения',
      'Это синонимы, отличается только название поставщика',
      'Feature flag измеряет конверсию, A/B-тест включает/выключает фичи',
      'Feature flag работает только на бэке, A/B-тест — только на фронте',
    ],
    correctIndex: 0,
    explanation:
      'Feature flag — инженерный инструмент: gradual rollout, kill switch, dark launch. A/B-тест — продуктово-аналитический: случайное распределение пользователей по вариантам, расчёт статистической значимости и выбор победителя. Многие платформы (LaunchDarkly, Unleash, Statsig) поддерживают оба режима, но это разные процессы.',
  },
  {
    type: 'fill-blank',
    id: 'sdo-q7',
    description:
      'Что такое error budget при SLO 99.9% доступности на месяц (≈ 30 дней)?',
    codeWithBlanks: `// SLO = 99.9% availability
// Месяц = 43 200 минут
// error budget ≈ __BLANK__ минут downtime в месяц`,
    options: ['43.2', '4.32', '432', '0.432'],
    correctIndex: 0,
    explanation:
      '0.1% от 43 200 минут ≈ 43.2 минуты допустимого недоступного времени за месяц. Если бюджет израсходован — команда замораживает фичи и направляет ресурсы на надёжность. Это и есть SRE-практика «error budget policy»: SLO + бюджет + правила реакции.',
  },
  {
    type: 'output',
    id: 'sdo-q8',
    description:
      'Почему алерт на каждое исключение в проде — антипаттерн (alert fatigue)?',
    code: `// 🔴 Алерт на каждый JS-error на любом устройстве:
sentry.on('error', () => pagerduty.page('on-call'));`,
    options: [
      'Это идеальная практика, она всегда оправдана',
      'Шум: дежурный получает сотни оповещений в день, перестаёт реагировать, и реальный инцидент тонет в потоке',
      'PagerDuty не поддерживает Sentry',
      'JS-ошибки нельзя считать сигналом, их вообще не надо собирать',
    ],
    correctIndex: 1,
    explanation:
      'Alert fatigue — задокументированный феномен в SRE. Алерты должны быть: (1) actionable — есть что делать, (2) symptom-based — отражают пользовательскую боль, а не внутренние детали, (3) пороговые — срабатывают при превышении бюджета, а не при единичных событиях. Базовая практика: алерт на нарушение SLO, а не на каждый exception.',
  },
  {
    type: 'fill-blank',
    id: 'sdo-q9',
    description:
      'Допишите тип сигнала, который связывает все спаны одного пользовательского запроса в распределённой системе.',
    codeWithBlanks: `// HTTP-заголовок W3C Trace Context
traceparent: 00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01
//             |    \`-- __BLANK__ id        \`-- span id     \`-- flags`,
    options: ['session', 'trace', 'request', 'user'],
    correctIndex: 1,
    explanation:
      'trace id — глобальный 128-битный идентификатор всей цепочки запроса. Все спаны (frontend → API gateway → service A → DB) разделяют один trace id, но имеют разные span id. Стандарт W3C Trace Context унифицирует распространение между сервисами.',
  },
  {
    type: 'output',
    id: 'sdo-q10',
    description:
      'Что такое sampling в трассировке и зачем он нужен?',
    code: `// OpenTelemetry SDK
const sdk = new NodeSDK({
  sampler: new TraceIdRatioBasedSampler(0.05), // 5%
});`,
    options: [
      'Сохраняем только 5% трейсов, остальное отбрасываем — экономия на хранении и пропускной способности',
      'Sampling делает трейсы быстрее в 20 раз',
      'Это случайный поиск багов в коде',
      'Sampling включает алертинг для 5% пользователей',
    ],
    correctIndex: 0,
    explanation:
      'На больших объёмах хранить 100% трейсов нереально. Sampling сокращает поток: head-based (решение в начале запроса) или tail-based (после завершения, можно сохранять только медленные/ошибочные). Honeycomb и Refinery строят tail-based sampling по бизнес-правилам.',
  },
  {
    type: 'fill-blank',
    id: 'sdo-q11',
    description:
      'Допишите термин: целевой уровень показателя, который команда обязуется поддерживать (например, p95 latency < 300 ms на 99.9% запросов).',
    codeWithBlanks: `// SLI = Service Level Indicator (что измеряем)
// __BLANK__ = Service Level Objective (целевая планка)
// SLA = Service Level Agreement (контракт с клиентом)`,
    options: ['SLO', 'SRE', 'KPI', 'OKR'],
    correctIndex: 0,
    explanation:
      'SLI — индикатор (метрика), SLO — внутренний целевой уровень, SLA — внешний контракт с финансовыми санкциями. Обычно SLO жёстче SLA на 1–2 «девятки», чтобы у команды был запас.',
  },
  {
    type: 'output',
    id: 'sdo-q12',
    description:
      'Какой паттерн уменьшает риск выкатки новой фичи на всю аудиторию сразу?',
    code: `// Unleash strategies
{
  name: 'gradualRolloutUserId',
  parameters: { percentage: '5', groupId: 'new-search' }
}`,
    options: [
      'Gradual rollout: фича включается на 1% → 5% → 25% → 100% с мониторингом метрик на каждом шаге',
      'Полная выкатка с понедельника на всех сразу — самый безопасный способ',
      'Деплой только в пятницу вечером',
      'Включение фичи через прямую правку конфига в проде вручную',
    ],
    correctIndex: 0,
    explanation:
      'Gradual (canary) rollout — фундаментальный паттерн безопасной выкатки. На каждом проценте проверяют метрики (ошибки, latency, бизнес-показатели) и при просадке откатываются flag-ом за секунды без redeploy.',
  },
];

const Q = Object.fromEntries(quizQuestions.map((q) => [q.id, q]));

const CHECKPOINT_IDS = new Set(['sdo-q1', 'sdo-q3', 'sdo-q8', 'sdo-q11']);


// =============================================================================
// Lesson
// =============================================================================

export const sdObservabilityLesson: Lesson = {
  topicId: 'sd-observability',

  intro: {
    whyItMatters: `Мониторинг отвечает на вопрос «всё ли работает». Observability идёт дальше — на вопрос «почему именно у этих пользователей после такого-то релиза что-то стало медленнее». Без правильно настроенного сбора данных на такие вопросы нельзя ответить без новой выкатки.

Observability строится на трёх источниках: метрики (числа во времени), логи (события с контекстом), трейсы (путь запроса через сервисы). Для фронтенда добавляется RUM — данные с реальных устройств пользователей, в противовес синтетическому мониторингу. Стандартные инструменты: Sentry для ошибок, LogRocket для сессий, LaunchDarkly для feature flags и A/B-тестов.`,
    estimatedMinutes: 45,
    interviewAngle:
      'Интервьюера интересует, строится ли observability как система: связь между сигналами (RUM ↔ ошибки ↔ трейсы ↔ feature flag), защита персональных данных, SRE-практики (SLO, error budget), внимание к шуму (дедупликация, sampling).',
    prerequisites: [
      { slug: 'sd-performance', title: 'Производительность фронтенда' },
    ],
  },


  chapters: [
    {
      id: 'pillars',
      title: 'Три столпа observability: metrics, logs, traces',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            'Observability — это **свойство системы**, при котором по её внешним сигналам можно отвечать на новые, заранее не предусмотренные вопросы. Monitoring отвечает на known-unknowns по заданным dashboards, observability — на unknown-unknowns, возникающие в инцидент.',
        },
        {
          type: 'text',
          content:
            'Представь три инструмента: дневник, пульсометр и GPS-трекер маршрута. Логи — это дневник: подробно, с контекстом, но неструктурированный текст превращается в мусор, который никто не читает. Метрики — пульсометр: агрегированное число, идеально для алертов, но без деталей. Трейсы — GPS-трекер: показывает весь маршрут запроса через сервисы и где именно «застрял». На собеседовании ключевой вопрос — когда trace, а когда хватит метрик: трейс нужен когда запрос проходит через несколько сервисов и нужно найти где конкретно потеряли 200 мс, метрика достаточна когда нужно ответить «растёт ли error rate».',
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Charity Majors из Honeycomb формулирует это так: «если для ответа на новый вопрос приходится выкатывать новый код, у вас нет observability — у вас monitoring». Это и есть критерий: можно ли в проде объяснить странное поведение без deploy.',
        },
        { type: 'heading', content: 'Три классических столпа' },
        {
          type: 'list',
          content: `- **Metrics** — агрегированные числовые временные ряды (RPS, error rate, p95 latency, RAM). Дёшевы в хранении, идеальны для dashboards и алертов.
- **Logs** — структурированные события с контекстом (\`{level, ts, traceId, userId, msg, ...}\`). Восстанавливают, что именно произошло.
- **Traces** — деревья спанов одного пользовательского запроса через все сервисы. Отвечают на вопрос «где мы потеряли 200 мс».`,
        },
        {
          type: 'code',
          language: 'typescript',
          content: `// Структурированный лог с trace context — связь логов и трейсов.
import { trace } from '@opentelemetry/api';

function logWithContext(level: string, msg: string, extra: object = {}) {
  const span = trace.getActiveSpan();
  const ctx = span?.spanContext();
  console.log(JSON.stringify({
    level,
    ts: Date.now(),
    msg,
    traceId: ctx?.traceId,
    spanId: ctx?.spanId,
    ...extra,
  }));
}

logWithContext('info', 'checkout-started', { userId: 'u_42', cartTotal: 1290 });`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Сильная observability возникает на **пересечении** сигналов. По метрике видно «что-то сломалось», по логам — «что именно», по трейсу — «где в цепочке». Связующий ключ — trace id, который должен попадать в каждый лог-event.',
        },
        { type: 'heading', content: 'Альтернативный взгляд: wide events' },
        {
          type: 'text',
          content:
            'Honeycomb и подход «observability 3.0» предлагают вместо трёх отдельных потоков один — **wide event**: широкое структурированное событие со всеми атрибутами (десятки и сотни полей). Метрики, логи и трейсы становятся проекциями этого события. Преимущество — высокая кардинальность: можно фильтровать и группировать по любому атрибуту, в том числе \`userId\`.',
        },
      ],
      checkpoint: [Q['sdo-q1']!, {
        type: 'ordering',
        id: 'sdobs-ord1',
        description: 'Расставь путь RUM-метрики от браузера до дашборда',
        items: [
          'Браузер собирает метрику (PerformanceObserver / web-vitals)',
          'JS SDK отправляет метрику на analytics endpoint',
          'Сервер принимает и записывает в time-series БД (InfluxDB, Prometheus)',
          'Aggregation: метрики агрегируются по времени и сегментам',
          'Dashboard (Grafana, DataDog) визуализирует тренды',
        ],
        explanation: 'RUM (Real User Monitoring) — реальные данные от реальных пользователей, в отличие от синтетического мониторинга. Ключевые инструменты: web-vitals.js для сбора, DataDog/New Relic для агрегации и алертов.',
      }],
    },

    {
      id: 'rum',
      title: 'RUM: телеметрия реальных пользователей',
      estimatedMinutes: 8,
      blocks: [
        {
          type: 'text',
          content:
            'RUM (Real User Monitoring) — сбор телеметрии непосредственно с устройств пользователей в проде: web-vitals, navigation timing, longtasks, ошибки, клики. В отличие от синтетического мониторинга (Lighthouse CI, Playwright-боты), RUM показывает «как живут реальные пользователи на их сетях, девайсах и в их браузерах».',
        },
        {
          type: 'text',
          content:
            'Аналогия: RUM — это опрос реальных покупателей в магазине, синтетический мониторинг — тест-драйв в контролируемых условиях на полигоне. RUM-данные шумные по природе: боты, пользователи со старым Android на 3G, офисные сети с прокси — всё это попадает в выборку и искажает среднее. Поэтому нужна сегментация по типу устройства, сети, географии. На собеседовании важно знать: среднее значение LCP — плохая метрика, p75 (или p95) честнее, потому что mean скрывает хвост распределения где сидят самые пострадавшие пользователи.',
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Google для ранжирования использует RUM-данные через CrUX (Chrome User Experience Report) — агрегированные показатели Core Web Vitals за 28 дней. Synthetic-измерения (PageSpeed Insights в lab-режиме) на ранжирование напрямую не влияют.',
        },
        { type: 'heading', content: 'Core Web Vitals (с 2024)' },
        {
          type: 'list',
          content: `- **LCP** — Largest Contentful Paint, ≤ 2.5 с. Время отрисовки крупнейшего видимого элемента.
- **INP** — Interaction to Next Paint, ≤ 200 мс. Заменил FID в марте 2024. Меряет p98 всех взаимодействий за сессию.
- **CLS** — Cumulative Layout Shift, ≤ 0.1. Суммарный сдвиг макета.
- **TTFB**, **FCP** — supporting metrics, помогают диагностировать LCP.
- Цель — попасть в «good» на 75% сессий по 28-дневному окну.`,
        },
        {
          type: 'code',
          language: 'typescript',
          content: `// Базовый RUM на web-vitals + sendBeacon.
import { onLCP, onINP, onCLS, onTTFB, onFCP } from 'web-vitals';

const queue: any[] = [];
const enqueue = (metric: any) => queue.push({
  ...metric,
  release: __APP_VERSION__,
  href: location.pathname,
  conn: (navigator as any).connection?.effectiveType,
  device: (navigator as any).deviceMemory,
});

onLCP(enqueue);
onINP(enqueue);
onCLS(enqueue);
onTTFB(enqueue);
onFCP(enqueue);

addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden' && queue.length) {
    navigator.sendBeacon('/rum', JSON.stringify(queue.splice(0)));
  }
});`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Событие `unload` для отправки RUM использовать не стоит — оно ненадёжно в Safari / iOS и блокирует Back-Forward Cache. Корректный вариант — слушать `visibilitychange === "hidden"` или `pagehide` и отправлять через `sendBeacon`.',
        },
        { type: 'heading', content: 'Что обязательно записывать рядом' },
        {
          type: 'list',
          content: `- Версия релиза и git sha — для регрессионного анализа.
- Effective connection type (4g/3g/slow-2g) и device memory — разрез качества.
- Route / страница — без неё дашборд бесполезен.
- Anonymous user id — стабильный идентификатор без PII (UUID в localStorage).
- A/B-вариант и активные feature flags — корреляция «фича X → INP +30 мс».`,
        },
      ],
      checkpoint: [Q['sdo-q3']!, {
        type: 'match-pairs',
        id: 'sdobs-mp1',
        description: 'Сопоставь инструмент мониторинга с типом данных которые он собирает',
        pairs: [
          { left: 'Sentry', right: 'JavaScript ошибки, stack traces, breadcrumbs' },
          { left: 'DataDog / New Relic', right: 'Метрики, APM трейсы, логи' },
          { left: 'LogRocket / FullStory', right: 'Session replay, действия пользователя' },
          { left: 'LaunchDarkly / GrowthBook', right: 'Feature flags, A/B тесты' },
        ],
        explanation: 'Каждый инструмент специализирован. Sentry — ошибки и их контекст. APM (DataDog) — производительность и трейсинг запросов. Session replay — воспроизведение действий пользователя для отладки UX. Feature flags — безопасное раскатывание.',
      }],
      playground: {
        starterCode: `// Допишите два числа — пороги «good» по версии Core Web Vitals 2024.
//   - LCP good ≤ ?  (миллисекунды)
//   - INP good ≤ ?  (миллисекунды)
const lcpGoodMs = /* число */ 0;
const inpGoodMs = /* число */ 0;

console.log(lcpGoodMs, inpGoodMs);`,
        expectedOutput: '2500 200',
        description:
          'Простая проверка: LCP «good» — ≤ 2500 мс, INP «good» — ≤ 200 мс. CLS измеряется в безразмерных единицах (≤ 0.1) и в этой задаче не участвует.',
      },
    },

    {
      id: 'errors',
      title: 'Error tracking: Sentry, source maps, дедупликация',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            'JS-ошибка в проде без контекста бесполезна: стек-трейс минифицирован, версия неизвестна, действия пользователя забыты. Error tracking (Sentry, Bugsnag, Rollbar) собирает ошибку вместе с release id, breadcrumbs, окружением и применяет source map для расшифровки трейсов.',
        },
        {
          type: 'text',
          content:
            'Хорошая система алертинга на ошибки — это как сигнализация, которая срабатывает только на реальный взлом, а не на каждую кошку. Rate limiting в Sentry — коварная ловушка: если сэмплирование слишком жёсткое, ты пропустишь критическую ошибку в 3 ночи, которая произошла ровно 1001 раз при лимите 1000. На собеседовании вопрос про группировку ошибок — это про fingerprinting: Sentry группирует по стек-трейсу, но одна ошибка с разными динамическими параметрами создаёт тысячи групп. Правильная настройка — кастомные fingerprints, умный сэмплинг и алерты только на новые ошибки или резкий рост частоты.',
        },
        { type: 'heading', content: 'Source maps без утечки кода' },
        {
          type: 'text',
          content:
            'Source map описывает соответствие минифицированного кода исходному. Если положить `app.js.map` рядом с `app.js` и оставить директиву `//# sourceMappingURL=app.js.map`, любой может скачать ваши исходники. Правильный путь — загружать карты **как артефакты релиза в Sentry** через CLI/Vite/Webpack плагин и удалять директиву из публичного бандла.',
        },
        {
          type: 'code',
          language: 'typescript',
          content: `// vite.config.ts — пример с @sentry/vite-plugin
import { defineConfig } from 'vite';
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig({
  build: { sourcemap: true }, // создаём карты на этапе сборки
  plugins: [
    sentryVitePlugin({
      org: 'acme',
      project: 'web',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      release: { name: process.env.RELEASE, deploy: { env: 'production' } },
      sourcemaps: {
        // Загрузить карты в Sentry, потом удалить из артефактов деплоя.
        filesToDeleteAfterUpload: ['./dist/**/*.map'],
      },
    }),
  ],
});`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Хорошая практика: name релиза = git sha. Тогда Sentry автоматически связывает ошибку с конкретным коммитом и показывает «suspect commits» — кто и когда сломал.',
        },
        { type: 'heading', content: 'Дедупликация и шум' },
        {
          type: 'text',
          content:
            'Без дедупликации одна ошибка превратится в миллион тикетов. Sentry группирует по **fingerprint** — обычно `файл + строка + сообщение + минификатор-нормализованный стек`. Можно переопределить fingerprint в `beforeSend` и склеить семантически одинаковые, но текстуально разные ошибки.',
        },
        {
          type: 'code',
          language: 'typescript',
          content: `import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  release: process.env.RELEASE,
  environment: 'production',
  tracesSampleRate: 0.1,
  beforeSend(event, hint) {
    // Убираем PII перед отправкой.
    if (event.user) {
      delete event.user.email;
      delete event.user.ip_address;
    }
    // Ручной fingerprint — все network-ошибки в одну группу.
    if (hint.originalException instanceof TypeError &&
        /Failed to fetch/.test(String(hint.originalException))) {
      event.fingerprint = ['network-error'];
    }
    return event;
  },
});`,
        },
        {
          type: 'list',
          content: `- **release + dist + sha** → группировка по версиям, регрессии видны мгновенно.
- **breadcrumbs** — последние 50 действий пользователя (клики, route changes, network).
- **tags** — locale, plan, role, user-segment — для фильтрации в UI.
- **trace id** — связь с бэкендными трейсами (Sentry Performance, OTLP).
- **scrubbing PII** в beforeSend — обязательный шаг по GDPR/152-ФЗ.`,
        },
      ],
    },

    {
      id: 'session-replay',
      title: 'Session replay и приватность',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Session replay (LogRocket, FullStory, Sentry Replay) записывает DOM-уровневую сессию: клики, скролл, ввод, изменения DOM, сетевые запросы. Помогает воспроизводить баги, которые «не повторяются у нас», и понимать UX-проблемы. Запись — не видеоролик, а упакованный поток DOM-событий, который проигрывается в плеере.',
        },
        {
          type: 'text',
          content:
            'Камера наблюдения в магазине: ты видишь что клиент делал — куда тыкал, где завис, что вводил — но не знаешь кто он. Проблема в том, что без маскировки в эту «камеру» попадают номера карт, пароли, персональные данные — и это прямое нарушение GDPR и 152-ФЗ. Правильная настройка session replay — privacy-first по умолчанию: маскировать все input-поля, отключать запись на страницах с PII, и включать replay только при возникновении ошибки. На собеседовании tradeoff — privacy vs debugging: чем меньше данных пишешь, тем сложнее дебажить; ответ — сэмплирование на ошибках, а не полная запись всех сессий.',
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Session replay — самый чувствительный к приватности класс инструментов. Без аккуратной настройки в записи попадут пароли, номера карт, PII. Это нарушение GDPR/152-ФЗ и риск утечки. Подход — «маскировать всё по умолчанию, открывать точечно».',
        },
        { type: 'heading', content: 'PII redaction' },
        {
          type: 'code',
          language: 'tsx',
          content: `// Sentry Replay: by default — privacy-first.
Sentry.init({
  integrations: [Sentry.replayIntegration({
    maskAllText: true,           // весь текст → ▓▓▓▓
    maskAllInputs: true,         // все input → ▓▓▓▓
    blockAllMedia: true,         // картинки и видео скрыты
  })],
  replaysSessionSampleRate: 0.05, // 5% сессий
  replaysOnErrorSampleRate: 1.0,  // 100% сессий с ошибкой
});

// Открываем точечно безопасные элементы:
<button className="sentry-unmask">Купить</button>

// И закрываем дополнительно чувствительные:
<input data-sentry-mask name="passport" />`,
        },
        { type: 'heading', content: 'Sampling' },
        {
          type: 'list',
          content: `- **Сессии без ошибок** — sample 1–10%, иначе хранилище взорвётся.
- **Сессии с ошибкой** — sample 100%, ради этого инструмент и нужен.
- **TTL** — 30–90 дней, потом удалять.
- **Согласие** — cookie banner с категорией «session replay», без него запись не стартует.
- **Аудит** — логи доступа к плееру: кто из инженеров смотрел запись и зачем.`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Антипаттерн — «давайте записывать всех 100% и смотреть когда понадобится». Это и дорого (терабайты), и юридически опасно. Sample on-error — единственная разумная стратегия по умолчанию.',
        },
      ],
    },

    {
      id: 'flags-experiments',
      title: 'Feature flags и A/B-тесты',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            'Feature flags и A/B-тесты — это инструменты управления риском при деплое. Вместо того чтобы выкатывать изменение всем сразу, можно включать его постепенно: сначала 1% пользователей, потом 10%, потом 100%. Если что-то пошло не так — откат за 30 секунд без редеплоя.',
        },
        {
          type: 'text',
          content:
            'Выключатель на стене — хорошая аналогия: можно включить и выключить свет без вызова электрика и без замены проводки. Главная ловушка — флаг без даты удаления. Через год в коде накапливается 50 мёртвых флагов, которые никто не решается удалить, потому что непонятно, нужны ли они ещё. На собеседовании стратегия rollout 1%→10%→100% — это не только про снижение риска, но и про измерение метрик на каждом шаге: убедиться что конверсия не упала до того как расширять аудиторию.',
        },
        { type: 'heading', content: 'Feature flags' },
        {
          type: 'text',
          content:
            'Feature flag (toggle) — условие в коде, включающее/выключающее путь без redeploy. Сценарии: gradual rollout (1% → 5% → 25% → 100%), kill switch (мгновенно отключить сломанную фичу), dark launch (фоновое выполнение нового пути без UI), entitlement (платный доступ). Платформы: Unleash (open source), LaunchDarkly, Statsig, Flagsmith, ConfigCat.',
        },
        {
          type: 'code',
          language: 'tsx',
          content: `// React + Unleash: gradual rollout новой корзины.
import { useFlag } from '@unleash/proxy-client-react';

function CartPage() {
  const newCart = useFlag('new-cart-ui');
  // На бэке: strategy = gradualRolloutUserId, percentage = 5
  return newCart ? <NewCart /> : <LegacyCart />;
}

// Kill switch на риск-критичной интеграции.
const acquirerEnabled = useFlag('acquirer-stripe');
if (!acquirerEnabled) {
  return <PayPalOnly />; // мгновенный fallback без deploy
}`,
        },
        {
          type: 'list',
          content: `- **Release flags** — короткоживущие, удаляются после 100% (cleanup-задача в спринте).
- **Ops flags** — долгоживущие kill-switches на интеграции третьих сторон.
- **Permission flags** — постоянные, управляют доступом по сегментам/тарифам.
- **Experiment flags** — обслуживают A/B-тесты, удаляются после победителя.
- Антипаттерн — флаги «вечные»: код превращается в спагетти из вложенных if.`,
        },
        { type: 'heading', content: 'A/B-тесты' },
        {
          type: 'text',
          content:
            'A/B-тест — продуктово-аналитический процесс: пользователи случайно распределяются между вариантами (control/B/C), и через достаточное время выбирается победитель по статистическому критерию. Один и тот же движок (LaunchDarkly Experiments, Statsig) реализует и flags, и тесты, но цели разные: flag — управлять выкаткой, A/B — принимать продуктовое решение.',
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Главный антипаттерн — «остановить тест, как только p < 0.05». Это `peeking` и приводит к ложным выводам в десятки раз чаще номинала. Правильный подход: фиксированная длительность (рассчитанная заранее по MDE и трафику) или sequential testing с поправкой на множественные проверки.',
        },
        {
          type: 'list',
          content: `- Подготовка: гипотеза, primary metric, MDE (minimum detectable effect), мощность теста, размер выборки.
- Длительность ≥ полного бизнес-цикла — обычно ≥ 1 недели, чтобы захватить недельную сезонность.
- **Sample Ratio Mismatch (SRM)** — индикатор, что распределение сломано (например, бот-трафик в одной группе).
- Проверяйте guardrail-метрики (latency, error rate), а не только конверсию.
- Сегментация после теста — повышает риск false discovery; объявляйте сегменты заранее.`,
        },
      ],
    },

    {
      id: 'traces-slo',
      title: 'Распределённые трейсы, SLO и алертинг',
      estimatedMinutes: 8,
      blocks: [
        {
          type: 'text',
          content:
            'SLO, SLI и SLA часто путают, но разница принципиальна. SLI — это реальный измеренный факт: «доля запросов быстрее 200 мс за последние 30 дней». SLO — это обещание клиенту: «мы гарантируем, что 99.5% запросов будут быстрее 200 мс». SLA — штрафной договор с юридическими последствиями при нарушении SLO.',
        },
        {
          type: 'text',
          content:
            'SLO 99.99% для MVP — это 4 минуты даунтайма в год. Достичь этого реально только с нулевым downtime deploy, автофейловером и глобальной репликацией — что стоит месяцев работы. Понятие error budget решает это противоречие: если у тебя бюджет 0.5% ошибок в месяц и он исчерпан, разработка новых фич останавливается до починки надёжности. На собеседовании это именно тот ответ, который хочет услышать интервьюер — не «мы стараемся не ломать», а «у нас есть error budget и процесс его расходования».',
        },
        { type: 'heading', content: 'Distributed tracing' },
        {
          type: 'text',
          content:
            'Когда запрос проходит через 5–10 микросервисов, причина медленности теряется в логах. Распределённая трассировка решает это: каждому пользовательскому запросу выдаётся **trace id**, и все сервисы создают связанные **спаны**. Получается дерево вызовов, по которому видно, где осели миллисекунды. Стандарт W3C Trace Context (заголовок `traceparent`) делает трейсы переносимыми между вендорами.',
        },
        {
          type: 'code',
          language: 'http',
          content: `# Заголовок W3C Trace Context, который браузер отправляет на бэкенд:
traceparent: 00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01
#             |  \`-- trace id (128 bit)            \`-- span id    \`-- flags
#             \`-- version`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'OpenTelemetry — open-source SDK и протокол OTLP, поддерживаемый всеми крупными вендорами (Datadog, Honeycomb, New Relic, Jaeger). Инструментировав код один раз, можно переключать backend без переписывания.',
        },
        { type: 'heading', content: 'Sampling трейсов' },
        {
          type: 'list',
          content: `- **Head-based** — решение принимается в начале запроса (sample 5%). Простой, но теряет редкие интересные кейсы.
- **Tail-based** — решение принимается после завершения трейса. Можно сохранять все ошибочные/медленные. Реализация: Refinery, OTel Collector tail sampler.
- Sampling-решение должно быть **консистентным** между сервисами — одно и то же для всех спанов одного trace id.
- Без sampling реалистичный объём трейсов — терабайты в день; стоит дороже, чем сами сервисы.`,
        },
        { type: 'heading', content: 'SLI, SLO, error budget' },
        {
          type: 'text',
          content:
            '**SLI** (Service Level Indicator) — метрика (доля успешных запросов, p95 latency). **SLO** (Service Level Objective) — внутренняя планка по SLI (99.9% запросов успешны за 30 дней). **SLA** (Service Level Agreement) — внешний контракт с компенсациями. **Error budget** = 1 − SLO; израсходован — фичи замораживаются, команда чинит надёжность.',
        },
        {
          type: 'code',
          language: 'yaml',
          content: `# Пример SLO в YAML (sloth, OpenSLO).
slo:
  name: web-checkout-availability
  objective: 99.9        # 99.9% за 30 дней
  sli:
    events:
      error_query:   sum(rate(http_requests_total{status=~"5..",route="/checkout"}[5m]))
      total_query:   sum(rate(http_requests_total{route="/checkout"}[5m]))
  alerting:
    burn_rate:
      - severity: page    # будит дежурного
        long_window:  1h
        short_window: 5m
        burn_rate:    14.4 # 2% бюджета за час
      - severity: ticket   # тикет, без пейджа
        long_window:  6h
        short_window: 30m
        burn_rate:    6`,
        },
        { type: 'heading', content: 'Алертинг и alert fatigue' },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Alert fatigue — реальная угроза. Дежурный, получающий 50 оповещений в день, перестаёт реагировать на любое из них. Лекарство — symptom-based алерты по SLO + multi-window burn-rate (Google SRE Workbook).',
        },
        {
          type: 'list',
          content: `- Алерт обязан быть **actionable**: есть конкретное действие.
- **Symptom-based**, не cause-based: «пользователь не может купить», а не «CPU > 80%».
- **Multi-window burn rate** — page при 2% бюджета за час, ticket при 5% за 6 часов.
- Лимит — 1–2 алерта за смену; больше — пересматривайте пороги или дедуплицируйте.
- Регулярно проводите alert review: удаляйте те, по которым никто не действовал за квартал.`,
        },
      ],
      checkpoint: [Q['sdo-q8']!, Q['sdo-q11']!],
    },

    {
      id: 'dashboards',
      title: 'Что выводить на dashboard',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Хороший dashboard рассказывает одну историю и помещается на один экран. Антипаттерн — «помойка из 100 графиков», в которую никто не смотрит. Минимальный набор для фронта:',
        },
        {
          type: 'text',
          content:
            'Пожарная тревога, которая звонит когда кто-то курит рядом — это alert fatigue: после десятого ложного срабатывания дежурный начинает игнорировать все сигналы. Алертить нужно только на то, что требует немедленного действия человека, остальное — в dashboard для изучения. Google предложил концепцию golden signals: latency (время ответа), traffic (RPS), errors (процент ошибок), saturation (заполненность ресурсов) — четыре метрики, которых хватает для любого сервиса как первый уровень алертинга. На собеседовании упоминание golden signals + error budget сразу выделяет кандидата среди тех, кто просто мониторит «всё подряд».',
        },
        {
          type: 'list',
          content: `- **Core Web Vitals** — p75 LCP/INP/CLS за 24 ч, разрез по device class и сети.
- **JS errors per session** — с группировкой по релизу. Резкий рост после деплоя — регрессия.
- **Конверсия ключевых сценариев** (signup, checkout) с разбиением по релизу и feature flag.
- **Доля сессий с replay** — индикатор покрытия и нагрузки.
- **SLO availability + burn rate** — мгновенно видно, идёт ли расход бюджета.
- **Top routes by p75 latency** — где user-facing медленность.`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'p75/p95, не average. Среднее скрывает «толстый хвост»: 1% пользователей с LCP 12 с не повлияют на average, но это и есть та аудитория, которая уйдёт. Google Core Web Vitals оценивает p75 не случайно.',
        },
        {
          type: 'code',
          language: 'typescript',
          content: `// Пример выгрузки метрик в OLAP — без сложных JOIN-ов.
type RumEvent = {
  ts: number;          // unix ms
  release: string;     // git sha
  route: string;       // /checkout
  metric: 'LCP' | 'INP' | 'CLS' | 'TTFB' | 'FCP';
  value: number;       // ms или CLS-единицы
  device: 'mobile' | 'desktop' | 'tablet';
  conn: '4g' | '3g' | 'slow-2g' | 'unknown';
  flags: string[];     // активные feature flags
  abVariants: Record<string, string>; // { 'checkout-color': 'B' }
  userIdHash: string;  // anonymous, не PII
};`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Корреляция «фича X включена → INP вырос на 30 мс» возможна только если активные flags и A/B-варианты сохраняются рядом с метриками. Это и есть смысл «wide events»: высокая кардинальность даёт ответы на новые вопросы без нового кода.',
        },
      ],
    },
  ],

  finalQuiz: quizQuestions.filter((q) => !CHECKPOINT_IDS.has(q.id)),


  cheatsheet: `### Чек-лист «что добавить в observability»

**Errors (Sentry):** SDK + DSN, release = git sha; source maps грузим в Sentry как артефакт релиза и удаляем из публичного бандла; beforeSend — scrubbing PII; trace id в каждом логе.

**RUM:** web-vitals (onLCP/onINP/onCLS); отправка через sendBeacon на visibilitychange='hidden'; рядом — release, route, device, connection, anonymous user id, активные flags и A/B-варианты; дашборд по p75 в разрезе device и сети.

**Session replay:** maskAllText/Inputs/blockAllMedia по умолчанию; sample 5% + 100% on error; TTL 30–90 дней; cookie consent для replay-категории; аудит-лог доступа к плееру.

**Feature flags:** платформа (Unleash/LaunchDarkly), gradual rollout 1/5/25/100%, kill switches на интеграциях, cleanup флагов после 100%. Flag ≠ A/B-тест.

**SLO + alerting:** SLI/SLO на user-facing метриках; multi-window burn-rate alerts (Google SRE); symptom-based, actionable, ≤ 2 алерта на дежурство; error budget policy подписана продактом и инженерией.`,


  nextTopics: [
    {
      slug: 'sd-performance',
      reason:
        'Observability показывает, что именно тормозит. Дальше — конкретные техники оптимизации фронта: bundle splitting, lazy-загрузка, оптимизация картинок и шрифтов, борьба с longtasks.',
    },
    {
      slug: 'sd-caching',
      reason:
        'SLO часто упирается в latency. Главный рычаг для её снижения после рендера — кеширование на CDN, в браузере и на сервере. Понимание инвалидации напрямую влияет на error budget.',
    },
  ],
};
