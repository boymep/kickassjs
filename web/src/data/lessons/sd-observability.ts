import type { Lesson } from '../../types/lesson';
import type { QuizQuestion } from '../../types/quiz';
import type { Flashcard } from '../../types/flashcard';

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
// Flashcards
// =============================================================================

const flashcards: Flashcard[] = [
  {
    id: 'sdo-f1',
    question: 'Что такое observability и чем она отличается от monitoring?',
    answer:
      'Monitoring отвечает на заранее заданные вопросы по dashboards и алертам («жив ли сервис, какова latency»). Observability — это свойство системы, при котором по её внешним сигналам можно отвечать на новые, неизвестные заранее вопросы («почему именно у пользователей из Канады в Safari тормозит чекаут после релиза 4.12»). Разница — в способности дебажить unknown-unknowns без выкатки нового кода.',
    keyPoints: [
      'Monitoring → known-unknowns, observability → unknown-unknowns',
      'Required: высокая кардинальность измерений и связь сигналов',
      'Charity Majors (Honeycomb): «wide events» как единый сигнал',
      'Метрики дешёвые, но агрегированы; трейсы дороже, но детальны',
      'Хорошая observability сокращает MTTR в разы',
    ],
  },
  {
    id: 'sdo-f2',
    question: 'Три столпа observability: что собирают metrics, logs и traces?',
    answer:
      'Metrics — агрегированные числовые временные ряды (RPS, error rate, p95 latency). Дешёвы в хранении, идеальны для dashboards и алертинга. Logs — структурированные записи событий с контекстом, помогают восстановить, что именно произошло. Traces — деревья спанов одного запроса через все сервисы, отвечают на вопрос «где мы потеряли 200 мс».',
    keyPoints: [
      'Metrics: Prometheus, Datadog, CloudWatch — низкая кардинальность',
      'Logs: structured JSON, индексация по полям, не по строкам',
      'Traces: OpenTelemetry, Jaeger, Honeycomb — связаны trace id',
      'Сильная observability возникает на пересечении трёх сигналов',
      'Альтернативный подход — wide events (Honeycomb) вместо трёх отдельных потоков',
    ],
  },
  {
    id: 'sdo-f3',
    question: 'Чем RUM отличается от synthetic monitoring?',
    answer:
      'RUM (field data) — телеметрия, собираемая на устройствах реальных пользователей: их сети, девайсы, локации, версии браузеров. Synthetic monitoring (lab data) — повторяемые проверки из контролируемой среды (Lighthouse CI, Playwright-боты, k6). RUM показывает «как живут реальные пользователи», synthetic — «не сломали ли мы базовый сценарий».',
    keyPoints: [
      'RUM: web-vitals, navigation timing, longtasks, errors',
      'Synthetic: Lighthouse CI, Playwright, Datadog Synthetics',
      'Google ранжирует по CrUX (RUM-данные за последние 28 дней)',
      'Synthetic стабильнее, но не отражает реальный мир',
      'Лучшая практика — оба сразу: RUM в проде + synthetic в CI',
    ],
  },
  {
    id: 'sdo-f4',
    question: 'Что такое Core Web Vitals и какие три метрики туда входят сейчас?',
    answer:
      'Core Web Vitals — набор метрик Google, по которым ранжируются страницы. С марта 2024: LCP (Largest Contentful Paint, ≤ 2.5 с) — отрисовка крупнейшего видимого элемента, INP (Interaction to Next Paint, ≤ 200 мс) — задержка интерактивности (заменил FID), CLS (Cumulative Layout Shift, ≤ 0.1) — суммарный сдвиг макета.',
    keyPoints: [
      'LCP — load: HTML, картинки, шрифты, рендер-блокирующий JS',
      'INP — interactivity: p98 всех взаимодействий за сессию',
      'CLS — visual stability: width/height на медиа, font-display',
      'Целевая планка — «good» на 75% сессий по 28-дневному окну',
      'TTFB и FCP — supporting metrics, не Core Vitals',
    ],
    code: `import { onLCP, onINP, onCLS } from 'web-vitals';

function send(metric) {
  navigator.sendBeacon('/rum', JSON.stringify(metric));
}

onLCP(send);
onINP(send);
onCLS(send);`,
    codeLanguage: 'javascript',
  },
  {
    id: 'sdo-f5',
    question: 'Зачем нужны source maps в Sentry и чем они опасны?',
    answer:
      'Source map — описание соответствия минифицированного кода исходному. Sentry разворачивает по нему стек-трейс из `a.b.c:1:2345` в осмысленные имена файлов и функций. Опасность — утечка кода: если source map доступен по публичному URL, любой может скачать исходники. Решение — загружать карты как артефакты релиза в Sentry и не публиковать их в вебе.',
    keyPoints: [
      '@sentry/vite-plugin / sentry-cli автоматически загружают карты в релиз',
      'Удаляйте `//# sourceMappingURL` из бандла или указывайте приватный путь',
      'Релиз связывает map ↔ commit ↔ deploy через release name',
      'Без карт triage в проде — это гадание по строке вида t.x.f',
      'Альтернатива — серверный обфускатор без минификации (хуже, но безопаснее)',
    ],
  },
  {
    id: 'sdo-f6',
    question: 'Что такое session replay и какие у него этические проблемы?',
    answer:
      'Session replay (LogRocket, Sentry Replay, FullStory) — DOM-уровневая запись пользовательской сессии: клики, скролл, ввод, изменения DOM. Помогает воспроизводить баги, которые «не повторяются у нас». Главные проблемы — приватность (PII в записях) и юридика (GDPR, 152-ФЗ): нужно явное согласие, маскирование чувствительных полей и хранение с ограниченным сроком.',
    keyPoints: [
      'По умолчанию маскируйте весь текст/ввод — открывайте только нужное',
      'data-sentry-mask / data-private / sentry-mask класс',
      'Sampling: записывать 1–10% сессий, 100% — только сессии с ошибкой',
      'TTL: 30–90 дней, после удалять',
      'Согласие пользователя через cookie banner с категорией «session replay»',
    ],
  },
  {
    id: 'sdo-f7',
    question: 'Что такое feature flag и какие у него типичные применения?',
    answer:
      'Feature flag (toggle) — условие в коде, включающее/отключающее путь без redeploy. Применения: gradual rollout (выкатка по проценту), kill switch (мгновенно выключить сломанную фичу), dark launch (фоновое тестирование без UI), entitlement (платный доступ). Платформы: Unleash (open source), LaunchDarkly, Statsig, Flagsmith, ConfigCat.',
    keyPoints: [
      'Release flags — короткоживущие, удаляются после 100%',
      'Ops flags — долгоживущие kill-switches на риск-критичных интеграциях',
      'Permission flags — постоянные, управляют доступом по сегментам',
      'Хранилище конфига должно отдавать ответ за единицы мс (edge/CDN)',
      'Антипаттерн — флаги без срока жизни → код превращается в спагетти',
    ],
    code: `import { isEnabled } from '@unleash/proxy-client-react';

if (isEnabled('new-checkout')) {
  return <NewCheckout />;
}
return <LegacyCheckout />;`,
    codeLanguage: 'tsx',
  },
  {
    id: 'sdo-f8',
    question: 'Чем A/B-тест отличается от feature flag?',
    answer:
      'Feature flag — инженерный инструмент управления выкаткой и kill-switch. A/B-тест — продуктово-аналитический процесс: пользователи случайно распределяются между вариантами (control/B/C), и по прошествии достаточного времени выбирается победитель по статистическому критерию. Один и тот же движок (LaunchDarkly, Statsig) может реализовывать оба, но цели разные.',
    keyPoints: [
      'A/B нужны: гипотеза, primary metric, MDE, размер выборки, критерий',
      'Длительность теста ≥ полного бизнес-цикла (≥ 1 неделя)',
      'Никогда не подсматривать промежуточные результаты — peeking → false positive',
      'Sample Ratio Mismatch (SRM) — индикатор того, что распределение сломано',
      'Antipattern: остановиться, как только p < 0.05; правильный путь — sequential testing или фиксированная длительность',
    ],
  },
  {
    id: 'sdo-f9',
    question: 'Что такое SLI, SLO и SLA?',
    answer:
      'SLI (Service Level Indicator) — конкретная метрика (доля успешных запросов, p95 latency). SLO (Service Level Objective) — внутренняя целевая планка по SLI (например, 99.9% запросов успешны за месяц). SLA (Service Level Agreement) — внешний контракт с клиентом, в котором за нарушение полагается компенсация.',
    keyPoints: [
      'SLO жёстче SLA на 1–2 «девятки» — запас для команды',
      'Error budget = 1 − SLO; израсходован → freeze фичей',
      '«Девятки»: 99% = 7.2 ч / мес, 99.9% = 43 мин, 99.99% = 4.3 мин',
      'SLO задаются на user-centric метрики, не на CPU/RAM',
      'Multi-window, multi-burn-rate alerts (Google SRE workbook)',
    ],
  },
  {
    id: 'sdo-f10',
    question: 'Что такое distributed tracing и trace context?',
    answer:
      'Distributed tracing — техника, при которой каждый пользовательский запрос получает уникальный trace id, и все участвующие сервисы создают связанные «спаны». Получается дерево вызовов, по которому видно, где потерялись миллисекунды. Стандарт W3C Trace Context (заголовок `traceparent`) гарантирует переносимость между сервисами и вендорами.',
    keyPoints: [
      'trace id (128 бит) + span id (64 бит) + parent span id',
      'Заголовок traceparent: 00-<trace>-<span>-<flags>',
      'OpenTelemetry — open-source SDK + протокол OTLP',
      'Sampling: head-based (на старте) или tail-based (по результату)',
      'Корреляция: trace id обязательно записывать в каждый лог-event',
    ],
  },
  {
    id: 'sdo-f11',
    question: 'Что такое alert fatigue и как с ним бороться?',
    answer:
      'Alert fatigue — состояние, когда дежурный получает столько оповещений, что перестаёт реагировать на любое из них. Возникает от шумных алертов на технические детали («CPU > 80%»), от не-actionable событий и от каждого исключения. Лечится переходом к symptom-based алертам по SLO и multi-window burn rate.',
    keyPoints: [
      'Алерт должен быть actionable: есть конкретное действие',
      'Symptom-based, а не cause-based: «пользователь не может купить»',
      'Burn-rate alerts: предупреждение, когда бюджет тратится в N раз быстрее нормы',
      'Дежурство: лимит 1–2 алерта за смену, иначе пересматривайте пороги',
      'Регулярно проводите alert review — удаляйте бесполезные триггеры',
    ],
  },
  {
    id: 'sdo-f12',
    question: 'Что такое error budget policy?',
    answer:
      'Error budget policy — заранее согласованное правило, что команда делает при израсходовании error budget. Типичный шаблон: фичи замораживаются, ресурсы переключаются на надёжность; SRE получает право блокировать релизы; после восстановления — постмортем и план улучшений. Делает дискуссию «фичи vs стабильность» предсказуемой и неэмоциональной.',
    keyPoints: [
      'Бюджет = 1 − SLO за выбранное окно (обычно 30 дней)',
      'Burn rate показывает, как быстро тратится бюджет',
      'Истощение бюджета → автоматический freeze фичей',
      'Подписывается всеми — продукт, инженерия, бизнес',
      'Без policy SLO превращается в декорацию',
    ],
  },
  {
    id: 'sdo-f13',
    question: 'Как организовать сбор RUM на фронте без потери данных?',
    answer:
      'На сайте подключают `web-vitals` и Performance Observer; перед уходом со страницы (`pagehide`/`visibilitychange === hidden`) отправляют батч через `navigator.sendBeacon` — он гарантированно уйдёт, даже если пользователь закрыл вкладку. Бекенд агрегирует события, считает p75/p95 и сохраняет в OLAP-хранилище.',
    keyPoints: [
      'sendBeacon вместо fetch — не блокирует unload и не отменяется',
      'Слушайте pagehide и visibilitychange, не unload',
      'Сохраняйте connection.effectiveType, deviceMemory, hardwareConcurrency',
      'Сэмплирование редкое: RUM-события «дёшевы», нужны почти все',
      'Корреляция с release version — ключ для регрессий',
    ],
    code: `import { onLCP, onINP, onCLS } from 'web-vitals';

const queue: any[] = [];
const send = (m: any) => queue.push(m);

onLCP(send);
onINP(send);
onCLS(send);

addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden' && queue.length) {
    navigator.sendBeacon('/rum', JSON.stringify(queue.splice(0)));
  }
});`,
    codeLanguage: 'typescript',
  },
  {
    id: 'sdo-f14',
    question: 'Что обязательно собирать в JS error tracking, помимо самой ошибки?',
    answer:
      'Чтобы из ошибки получить полезный сигнал, нужны: stack trace с применённым source map, release version и git sha, environment (prod/staging), user id (или анонимный hash), browser/device, breadcrumbs (последние действия), trace id для связи с бэкендом, и бизнес-контекст (например, страница чекаута). Дедупликация — по fingerprint, чтобы одна ошибка не порождала миллион тикетов.',
    keyPoints: [
      'release + dist + sha → группировка по версиям',
      'breadcrumbs (нажатия, сетевые запросы, route changes)',
      'fingerprint = file + line + message → дедупликация',
      'tags: locale, plan, role — для фильтрации в UI',
      'beforeSend: scrubbing PII перед отправкой',
    ],
  },
  {
    id: 'sdo-f15',
    question: 'Какие метрики качества фронта стоит вывести на главный dashboard?',
    answer:
      'Минимальный набор: Core Web Vitals (LCP/INP/CLS) p75 за 24 часа в разрезе устройств; JS errors per session с группировкой по релизу; конверсия ключевых сценариев (signup, checkout) с разбиением по релизу и feature flag; время до отрисовки критичного контента; долю сессий с replay; SLO availability + burn rate. Алертинг строится только поверх этих метрик.',
    keyPoints: [
      'p75, не average — average скрывает хвост',
      'Разрез по device class и сети (Effective Connection Type)',
      'Сравнение релизов автоматически — анти-регрессия',
      'Бизнес-метрики (конверсия) рядом с техническими — корреляция',
      'Один dashboard = одна история; не делайте «помойку из 100 графиков»',
    ],
  },
];

// =============================================================================
// Lesson
// =============================================================================

export const sdObservabilityLesson: Lesson = {
  topicId: 'sd-observability',

  intro: {
    whyItMatters: `Обычный мониторинг отвечает на вопрос «всё ли работает?» — CPU, uptime, количество ошибок. Observability идёт дальше: она отвечает на вопрос «почему именно у пользователей из Канады в Safari после релиза 4.12 чекаут стал на 800 мс медленнее?». Разница принципиальная — второй вопрос возникает уже после инцидента, и без правильно настроенной системы сбора данных на него просто нельзя ответить без новой выкатки кода.

Observability строится на **трёх источниках данных**. **Метрики** — числа во времени: сколько запросов, какой p99 latency, процент ошибок. Хороши для алертов и дашбордов. **Логи** — текстовые события с контекстом: «пользователь 42 не смог оплатить, ошибка X». Хороши для детального разбора. **Трейсы** — путь одного запроса через все микросервисы, с временем на каждом шаге. Хороши для поиска, где именно тормозит.

Для фронтенда к этому добавляется **RUM** (Real User Monitoring) — данные с реальных устройств пользователей: скорость загрузки, ошибки JS, клики. Это противоположность синтетическому мониторингу (Lighthouse CI, Playwright), который гоняет тесты в управляемой среде. Google для ранжирования в поиске использует именно RUM-данные.

Из инструментов важно знать: **Sentry / Bugsnag** — ловят ошибки JS с контекстом и стектрейсом; **LogRocket / FullStory** — записывают сессии пользователей (с обязательным скрытием персональных данных); **LaunchDarkly / Unleash** — feature flags, плавный rollout; **Statsig / LaunchDarkly Experiments** — A/B-тесты. На интервью важно не просто перечислить эти инструменты, а объяснить, чем feature flag отличается от A/B-теста и почему source maps нельзя публиковать в open access.`,
    estimatedMinutes: 45,
    interviewAngle:
      'Senior-интервьюер проверяет, умеете ли вы строить observability как систему, а не как набор подключённых SDK. Сильный ответ показывает связь между сигналами (RUM ↔ ошибки ↔ трейсы ↔ feature flag), уважение к приватности пользователя (PII redaction, согласия), понимание SRE-практик (SLO, error budget, burn rate) и привычку думать о шуме (alert fatigue, дедупликация, sampling).',
    prerequisites: [
      { slug: 'sd-performance', title: 'Производительность фронтенда' },
    ],
  },

  resources: {
    videos: [
      {
        source: 'youtube',
        id: 'mjO0n1EeMiI',
        title: 'What is observability? Charity Majors explains',
        channel: 'Honeycomb',
        language: 'en',
        durationSec: 3 * 60,
        description:
          'Короткий клип Charity Majors (Honeycomb): observability как способность отвечать на новые вопросы без выкатки кода. Лучшее введение в концепцию за три минуты.',
      },
      {
        source: 'youtube',
        id: 'x5t3bF5IcXw',
        title: 'Observability Helps You See What Looks Weird',
        channel: 'The New Stack',
        language: 'en',
        durationSec: 30 * 60,
        description:
          'Расширенный разговор Charity Majors о том, чем observability отличается от monitoring и почему «wide events» с высокой кардинальностью важнее, чем красивые dashboards.',
      },
      {
        source: 'youtube',
        id: 'AQqFZ5t8uNc',
        title: 'Optimize for Core Web Vitals',
        channel: 'Chrome for Developers',
        language: 'en',
        durationSec: 14 * 60,
        description:
          'Команда Chrome объясняет, как RUM-данные CrUX используются для ранжирования и как настроить web-vitals в проде, чтобы p75 LCP/INP/CLS укладывались в «good».',
      },
      {
        source: 'youtube',
        id: 'NuFEsUGK93g',
        title: 'Application Monitoring 101: Getting Started with Sentry',
        channel: 'Sentry',
        language: 'en',
        durationSec: 10 * 60,
        description:
          'Официальный обзор Sentry: error tracking, source maps, performance, release tracking. Хорошая отправная точка перед погружением в SDK.',
      },
    ],
    links: [
      {
        url: 'https://docs.sentry.io/platforms/javascript/sourcemaps/',
        title: 'Source Maps for JavaScript — Sentry docs',
        source: 'article',
        language: 'en',
        note: 'Канонический гайд: как загружать source maps как артефакты релиза и не утечь исходники в браузер.',
      },
      {
        url: 'https://opentelemetry.io/docs/concepts/observability-primer/',
        title: 'Observability primer — OpenTelemetry',
        source: 'spec',
        language: 'en',
        note: 'Официальное определение трёх столпов и базовых терминов: SLI/SLO, telemetry, trace context.',
      },
      {
        url: 'https://github.com/GoogleChrome/web-vitals',
        title: 'web-vitals — GoogleChrome/web-vitals',
        source: 'github',
        language: 'en',
        note: 'Официальная библиотека Google для сбора Core Web Vitals в проде. ~2 кБ, поддерживает onLCP/onINP/onCLS.',
      },
      {
        url: 'https://web.dev/articles/vitals-measurement-getting-started',
        title: 'Getting started with measuring Web Vitals — web.dev',
        source: 'web-dev',
        language: 'en',
        note: 'Пошаговый разбор: как собрать RUM, отличия field vs lab data и где их хранить.',
      },
      {
        url: 'https://sre.google/workbook/alerting-on-slos/',
        title: 'Alerting on SLOs — Google SRE Workbook',
        source: 'article',
        language: 'en',
        note: 'Multi-window, multi-burn-rate alerts: как строить алерты, чтобы избегать ложных срабатываний и alert fatigue.',
      },
      {
        url: 'https://www.honeycomb.io/blog/observability-3-0-is-coming',
        title: 'Observability 3.0 — Honeycomb blog',
        source: 'article',
        language: 'en',
        note: 'Charity Majors про эволюцию от трёх столпов к wide events. Полезный контекст для senior-обсуждений.',
      },
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
      flashcardIds: ['sdo-f1', 'sdo-f2'],
      checkpoint: [Q['sdo-q1']!],
      docsLink: { url: 'https://habr.com/ru/hub/monitoring/', title: 'Мониторинг и observability — Habr' },
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
            'Никогда не используйте `unload` для отправки RUM — событие ненадёжное в Safari/iOS и блокирует Back-Forward Cache. Слушайте `visibilitychange === "hidden"` или `pagehide` и шлите через `sendBeacon`.',
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
      flashcardIds: ['sdo-f3', 'sdo-f4', 'sdo-f13'],
      checkpoint: [Q['sdo-q3']!],
      docsLink: { url: 'https://web.dev/i18n/ru/vitals/', title: 'Web Vitals — web.dev (ru)' },
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
      flashcardIds: ['sdo-f5', 'sdo-f14'],
      docsLink: { url: 'https://habr.com/ru/hub/monitoring/', title: 'Мониторинг и observability — Habr' },
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
      flashcardIds: ['sdo-f6'],
      docsLink: { url: 'https://habr.com/ru/hub/monitoring/', title: 'Мониторинг и observability — Habr' },
    },

    {
      id: 'flags-experiments',
      title: 'Feature flags и A/B-тесты',
      estimatedMinutes: 7,
      blocks: [
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
      flashcardIds: ['sdo-f7', 'sdo-f8'],
      docsLink: { url: 'https://habr.com/ru/hub/monitoring/', title: 'Мониторинг и observability — Habr' },
    },

    {
      id: 'traces-slo',
      title: 'Распределённые трейсы, SLO и алертинг',
      estimatedMinutes: 8,
      blocks: [
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
      flashcardIds: ['sdo-f9', 'sdo-f10', 'sdo-f11', 'sdo-f12'],
      checkpoint: [Q['sdo-q8']!, Q['sdo-q11']!],
      docsLink: { url: 'https://habr.com/ru/hub/monitoring/', title: 'Мониторинг и observability — Habr' },
    },

    {
      id: 'dashboards',
      title: 'Что выводить на dashboard',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Хороший dashboard рассказывает одну историю и помещается на один экран. Антипаттерн — «помойка из 100 графиков», в которую никто не смотрит. Минимальный набор для фронта senior-уровня:',
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
      flashcardIds: ['sdo-f15'],
      docsLink: { url: 'https://web.dev/i18n/ru/vitals/', title: 'Web Vitals — web.dev (ru)' },
    },
  ],

  finalQuiz: quizQuestions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  flashcards,

  cheatsheet: `### Чек-лист «что добавить в observability»

**Errors (Sentry):** SDK + DSN, release = git sha; source maps грузим в Sentry как артефакт релиза и удаляем из публичного бандла; beforeSend — scrubbing PII; trace id в каждом логе.

**RUM:** web-vitals (onLCP/onINP/onCLS); отправка через sendBeacon на visibilitychange='hidden'; рядом — release, route, device, connection, anonymous user id, активные flags и A/B-варианты; дашборд по p75 в разрезе device и сети.

**Session replay:** maskAllText/Inputs/blockAllMedia по умолчанию; sample 5% + 100% on error; TTL 30–90 дней; cookie consent для replay-категории; аудит-лог доступа к плееру.

**Feature flags:** платформа (Unleash/LaunchDarkly), gradual rollout 1/5/25/100%, kill switches на интеграциях, cleanup флагов после 100%. Flag ≠ A/B-тест.

**SLO + alerting:** SLI/SLO на user-facing метриках; multi-window burn-rate alerts (Google SRE); symptom-based, actionable, ≤ 2 алерта на дежурство; error budget policy подписана продактом и инженерией.`,

  interviewQA: [
    {
      id: 'sdo-iq1',
      question: 'Что собирать в RUM на фронте и почему именно это?',
      shortAnswer:
        'Core Web Vitals (LCP/INP/CLS), TTFB/FCP, JS-ошибки, longtasks. Рядом обязательно: release, route, device, сеть, anonymous user id, активные flags и A/B-варианты. Отправляем через sendBeacon на visibilitychange.',
      fullAnswer: `Минимальный честный RUM — это не «накидать SDK Sentry», а спроектированный поток событий, по которому можно объяснить регрессию.

**Что меряем:**
- Core Web Vitals: \`onLCP\`, \`onINP\`, \`onCLS\` из \`web-vitals\` — это то, по чему ранжирует Google.
- Supporting: \`onTTFB\`, \`onFCP\` — для диагностики LCP.
- JS-ошибки и unhandled rejections (отдельно от error tracking — нужны как метрика «errors per session»).
- Longtasks (\`PerformanceObserver({ type: 'longtask' })\`) — индикатор jank.

**Контекст рядом с каждым событием:**
- \`release\` (git sha) — без него регрессии не видны.
- \`route\` — без неё дашборд бесполезен.
- \`device\` (mobile/desktop), \`effectiveType\` (4g/3g) — главный разрез качества.
- Anonymous user id (UUID в localStorage) — стабильный, без PII.
- Активные feature flags и A/B-варианты — ключ к корреляции «фича X → INP +30 мс».

**Как отправлять:**
- Слушаем \`visibilitychange === 'hidden'\` (или \`pagehide\`), батч уходит через \`navigator.sendBeacon\`. \`unload\` ненадёжен в Safari/iOS и ломает Back-Forward Cache.
- Для INP важно ловить событие до выгрузки страницы — \`web-vitals\` это делает за вас.

**Чего НЕ собирать:**
- IP, email, точные геолокации без согласия — это PII.
- Полный URL с query-параметрами, в которых могут быть токены.
- Любой ввод пользователя — это для replay, не для RUM.`,
      followUps: [
        'Почему отправлять RUM на unload — плохая идея?',
        'Как считать конверсию по релизам, имея только RUM-события?',
        'Чем отличается p75 от average и почему Google смотрит на p75?',
      ],
      relatedChapterId: 'rum',
    },
    {
      id: 'sdo-iq2',
      question:
        'Как защитить пользовательскую приватность, собирая ошибки и session replay?',
      shortAnswer:
        'PII redaction в beforeSend (Sentry) и mask-all-by-default в replay; точечно открывать безопасные элементы. Сэмплирование, TTL 30–90 дней, явное согласие в cookie banner. Доступ к плееру — с аудитом.',
      fullAnswer: `Error tracking и session replay — самые рискованные классы инструментов с точки зрения GDPR и 152-ФЗ. Подход — «маскировать всё по умолчанию, открывать точечно».

**Error tracking (Sentry):**
- В \`beforeSend\` удаляем \`user.email\`, \`user.ip_address\`, токены из URL, заголовки авторизации, payload запросов с потенциально чувствительными полями.
- В breadcrumbs не пишем содержимое инпутов — только тип события и target.
- Включаем \`sendDefaultPii: false\` (по умолчанию в современных SDK).

**Session replay:**
- Стартуем с \`maskAllText: true\`, \`maskAllInputs: true\`, \`blockAllMedia: true\`. Запись становится «анонимным каркасом», по которому видно поведение, но не данные.
- Точечно открываем безопасные элементы через класс \`sentry-unmask\` (например, кнопки навигации).
- Дополнительно маскируем чувствительное (\`data-sentry-mask\` на полях с паспортом, картой).
- \`replaysSessionSampleRate: 0.05\` (5%) + \`replaysOnErrorSampleRate: 1.0\` (100% сессий с ошибкой).

**Юридика и хранение:**
- Согласие в cookie banner с категорией «session replay» — без него запись не стартует.
- TTL 30–90 дней, потом данные удаляются.
- Отдельная роль для доступа к плееру + аудит-лог: кто и зачем смотрел запись.

**Что нельзя выпускать в прод:**
- Незамаскированные формы с паспортом, картой, медицинскими данными.
- Стек-трейсы с полным URL, в котором JWT в query.
- Source maps на публичном CDN — это утечка кода.`,
      followUps: [
        'Что делать, если PII случайно попал в Sentry — как очистить ретроактивно?',
        'Как организовать DPA (Data Processing Agreement) с Sentry?',
        'В каких юрисдикциях запись DOM считается «персональными данными»?',
      ],
      relatedChapterId: 'session-replay',
    },
    {
      id: 'sdo-iq3',
      question: 'Чем feature flag отличается от A/B-теста?',
      shortAnswer:
        'Feature flag — инженерный инструмент управления выкаткой и kill-switch. A/B-тест — продуктово-аналитический процесс со статистической значимостью. Один движок может реализовывать оба, но цели и метрики успеха разные.',
      fullAnswer: `Это любимый «вилочный» вопрос на собеседовании, потому что многие путают.

**Feature flag** решает инженерную задачу: безопасно выкатить фичу.
- Сценарии: gradual rollout (1% → 5% → 25% → 100%), kill switch (мгновенно отключить сломанную интеграцию), dark launch (фоновое выполнение нового пути без UI), entitlement (платный доступ).
- Успех — выкатили без инцидента и в случае проблемы откатились flag-ом за секунды без deploy.
- Платформы: Unleash, LaunchDarkly, Statsig, Flagsmith, ConfigCat.

**A/B-тест** решает продуктовую задачу: какой вариант лучше для бизнес-метрики.
- Перед стартом обязательны: гипотеза, primary metric, MDE (minimum detectable effect), мощность, рассчитанный размер выборки и длительность.
- Пользователи случайно распределяются между вариантами; распределение проверяется на SRM (Sample Ratio Mismatch).
- Длительность — фиксированная (≥ полного бизнес-цикла, обычно ≥ 1 недели). Подсматривать промежуточные результаты — peeking, который повышает false positive в десятки раз.
- Успех — статистически значимый эффект на primary metric с проверкой guardrail-метрик (latency, error rate).

**Где они пересекаются:** один и тот же движок (LaunchDarkly Experiments, Statsig) умеет и flag, и тест. Но запускать A/B без явной гипотезы и расчёта мощности — это не A/B, а «просто включили на 50%».

**Антипаттерны:**
- «Тест идёт уже месяц, давайте остановим, p < 0.05» → ложный позитив.
- «Долгоживущий feature flag» → код превращается в спагетти из вложенных if без срока жизни.
- «A/B-тест без guardrail-метрик» → выиграли по конверсии, потеряли по latency и не заметили.`,
      followUps: [
        'Что такое Sample Ratio Mismatch и как его обнаружить?',
        'Как правильно прекратить A/B-тест досрочно (sequential testing)?',
        'Как организовать cleanup feature flags, чтобы они не накапливались?',
      ],
      relatedChapterId: 'flags-experiments',
    },
    {
      id: 'sdo-iq4',
      question: 'Что такое SLO и зачем нужен error budget?',
      shortAnswer:
        'SLO — внутренняя целевая планка по SLI (например, 99.9% успешных запросов за 30 дней). Error budget = 1 − SLO; израсходован — фичи замораживаются, команда чинит надёжность. Делает дискуссию «фичи vs стабильность» предсказуемой.',
      fullAnswer: `SLO/SLI/SLA — практика, формализованная Google в книгах SRE. Без неё разговор «нам нужно стабильнее vs нам нужны фичи» превращается в эмоциональный спор.

**Термины:**
- **SLI** (Service Level Indicator) — конкретная метрика: доля успешных запросов, p95 latency, доля сессий с LCP < 2.5 c.
- **SLO** (Service Level Objective) — внутренняя планка: «99.9% запросов успешны за 30 дней». SLO жёстче SLA на 1–2 «девятки», чтобы у команды был запас.
- **SLA** (Service Level Agreement) — внешний контракт с клиентом, нарушение которого влечёт компенсации.

**Error budget:**
- Бюджет = 1 − SLO. Для 99.9% за месяц — это ~43 минуты допустимого «нездорового» времени.
- Расходуется ошибками и медленностью; виден через **burn rate** (как быстро тратится).
- При истощении — **error budget policy**: фичи замораживаются, ресурсы переключаются на надёжность, SRE получает право блокировать релизы. Подписана инженерией, продактом и бизнесом.

**Зачем это нужно:**
- Делает trade-off между скоростью и надёжностью **числовым**.
- Команда сама решает, как тратить бюджет (рискованный деплой в пятницу = осознанный расход).
- Алерты строятся не на «CPU > 80%», а на **multi-window burn-rate** — это убирает большую часть alert fatigue.

**Типичные ошибки:**
- SLO на серверные метрики (CPU, RAM) вместо user-facing — бесполезно для бизнеса.
- SLO без error budget policy — превращается в декорацию.
- SLO с горизонтом 1 неделя — слишком короткий для realistic burn-rate анализа.
- Алерт на каждое событие, превышающее SLI, вместо алерта на расход бюджета.`,
      followUps: [
        'Как именно работает multi-window multi-burn-rate alerting?',
        'Какой SLO выбрать для нового сервиса, если данных по latency ещё нет?',
        'Что делать, если SLO постоянно нарушается, а команда не может его выполнить?',
      ],
      relatedChapterId: 'traces-slo',
    },
    {
      id: 'sdo-iq5',
      question: 'Как избежать alert fatigue?',
      shortAnswer:
        'Symptom-based алерты по SLO, multi-window burn-rate, лимит 1–2 алерта на дежурство, регулярный alert review. Все алерты обязаны быть actionable; cause-based триггеры (CPU/RAM) — на dashboard, не в pager.',
      fullAnswer: `Alert fatigue — задокументированный феномен в SRE: дежурный, получающий 50 оповещений в день, перестаёт реагировать на любое. Реальные инциденты тонут в шуме, MTTR растёт.

**Ключевые принципы (по Google SRE Workbook):**
1. **Actionable** — у каждого алерта есть конкретное действие. Если действия нет, это не алерт, это график.
2. **Symptom-based**, не cause-based: «пользователь не может купить», а не «CPU > 80%». CPU может быть высоким во время штатного бэкапа.
3. **User-facing** — алерт на нарушение SLO (extracts user pain), не на внутренние метрики.
4. **Multi-window burn-rate**: page при быстром расходе бюджета (2% за час), ticket при медленном (5% за 6 часов). Это снижает ложные срабатывания на 1–2 порядка.

**Организационные практики:**
- Лимит на дежурство: ≤ 1–2 алерта за смену. Больше — пересматривайте пороги и дедуплицируйте.
- Регулярный **alert review** (раз в квартал): удаляйте триггеры, по которым никто не действовал.
- Postmortem для каждого пейджа: это был реальный сигнал или шум? Если шум — почему он сработал?
- Бюджет на улучшение алертов закладывается в спринты как обычная работа.

**Типичные источники шума:**
- Алерт на каждое исключение (миллион тикетов в день).
- Cause-based триггеры на технические детали (CPU, RAM, queue depth).
- «Flaky» метрики без сглаживания (короткие пики срабатывают регулярно).
- Дублирующие алерты на разных уровнях стека (db + service + LB → один инцидент = три пейджа).

**Как выглядит зрелый pager-flow:**
- Алерт пришёл → дежурный точно знает, что сломано (симптом) и кому это болит (пользователь).
- В алерте — ссылка на runbook с шагами триажа.
- Если действий нет — алерт удаляется или переводится в ticket.
- За 30 дней — ≤ 5 пейджей на сервис; всё сверху — повод пересмотреть SLO.`,
      followUps: [
        'Как формализовать «runbook» для алерта?',
        'Чем pager отличается от ticket в multi-window burn-rate?',
        'Как обосновать продакту, что час работы инженера на улучшение алертов важнее новой фичи?',
      ],
      relatedChapterId: 'traces-slo',
    },
    {
      id: 'sdo-iq6',
      question:
        'Как организовать source maps в production, не утекая исходный код?',
      shortAnswer:
        'Карты грузим в Sentry как артефакт релиза через CLI/Vite/Webpack-плагин, удаляем `.map`-файлы из публичного бандла и убираем `//# sourceMappingURL`. Релиз привязываем к git sha — Sentry автоматически расшифровывает stack trace.',
      fullAnswer: `Это любимый вопрос с подвохом: кандидат говорит «загрузим source maps», а интервьюер уточняет «куда именно?». Если ответ — «в \`/dist/\` рядом с бандлом», это утечка исходного кода. Любой может скачать \`app.js.map\`, открыть в DevTools и читать ваш код.

**Как делать правильно:**
1. На этапе сборки включаем \`sourcemap: true\` (Vite/Rollup) или \`devtool: 'source-map'\` (Webpack).
2. Используем \`@sentry/vite-plugin\` / \`@sentry/webpack-plugin\` / \`sentry-cli releases files upload-sourcemaps\`. Карты загружаются в Sentry как артефакт **конкретного релиза**.
3. После загрузки — **удаляем** \`.map\`-файлы из артефактов деплоя (\`filesToDeleteAfterUpload\` в Vite-плагине).
4. Из бандла убираем директиву \`//# sourceMappingURL=...\` — иначе браузер всё равно полезет за картой и получит 404 в проде, а в DevTools будут предупреждения.

**Связь с релизом:**
- Имя релиза = git sha (или \`tag-sha\`). Sentry привязывает ошибку к коммиту и показывает «suspect commits».
- Релиз связывается с deploy-environment (\`production\`, \`staging\`).
- При откате достаточно указать предыдущий релиз — стек-трейсы по нему останутся читаемыми.

**Альтернативные подходы:**
- Минификация без source maps — стек-трейсы нечитаемы, debugging невозможен.
- Только обфускация без минификации — код читаем, но bundle тяжелее (плохой trade-off).
- «Hidden» source maps в /private-dir на CDN с auth — сложнее в поддержке, чем загрузка в Sentry.

**Чек:** в инкогнито откройте DevTools → Sources → проверьте, что код **минифицирован** (\`a.b.c\`), а не разворачивается в исходные \`Component.tsx\`. Если разворачивается — карты в проде, утечка.`,
      followUps: [
        'Что произойдёт, если в Sentry загружены карты от другого билда?',
        'Как связать Sentry release с CI/CD pipeline (GitHub Actions, GitLab)?',
        'Можно ли использовать source maps для серверного Node.js и какие там нюансы?',
      ],
      relatedChapterId: 'errors',
    },
    {
      id: 'sdo-iq7',
      question:
        'Опишите архитектуру observability для нового SaaS-приложения с нуля.',
      shortAnswer:
        'OpenTelemetry SDK на бэке + web-vitals/Sentry на фронте; structured JSON-логи с trace id; SLO на user-facing запросы с multi-window burn-rate; feature flags для безопасной выкатки; dashboard p75 + конверсия по релизам.',
      fullAnswer: `Senior-вопрос: ожидается план, а не перечень SDK. Я бы строил так.

**Сбор сигналов:**
- **Бэкенд:** OpenTelemetry SDK для каждого сервиса; экспорт по OTLP в Honeycomb / Datadog / self-hosted (Tempo + Loki + Mimir). Sampling head-based 5% + tail-based 100% для медленных и ошибочных трейсов.
- **Фронт:** \`web-vitals\` + Sentry для ошибок и performance. \`traceparent\` пробрасывается с фронта в backend для end-to-end трейсов.
- **Логи:** structured JSON с обязательными полями \`trace_id\`, \`span_id\`, \`user_id\` (anonymous hash), \`release\`. Никаких unstructured \`console.log\`.

**Релизы и flags:**
- Каждый деплой создаёт Sentry release = git sha. Source maps грузятся в Sentry, удаляются с CDN.
- Unleash или Statsig для feature flags. Все фичи выкатываются через gradual rollout (1% → 5% → 25% → 100%) с проверкой метрик на каждом шаге.

**SLO:**
- На user-facing endpoints: availability 99.9%, p95 latency < 500 мс. Окно — 30 дней.
- Error budget policy подписана продактом и инженерией.
- Алерты multi-window burn-rate (page при 2%/час, ticket при 5%/6ч).

**Privacy:**
- PII redaction в Sentry beforeSend.
- Session replay: maskAllText/Inputs by default, sample 5% + 100% on error, TTL 60 дней.
- Cookie consent с отдельной категорией для replay.

**Dashboard:**
- Один экран, одна история: Core Web Vitals p75 (LCP/INP/CLS), errors per session по релизам, конверсия signup/checkout по релизам и flags, SLO availability + burn rate, top routes by p75 latency.

**Процессы:**
- On-call: ≤ 2 пейджа за смену, runbook в каждом алерте.
- Postmortem на каждый пейдж и каждый incident affecting users.
- Quarterly alert review: удаляем шум.

**Чего я НЕ делаю на старте:**
- Не запускаю A/B-тесты, пока нет фундаментальной телеметрии. Тест без guardrail-метрик опаснее, чем отсутствие теста.
- Не подключаю 5 SaaS-инструментов сразу — начинаю с одного (Sentry + web-vitals + Honeycomb) и расширяюсь по необходимости.
- Не строю custom in-house solution — это работа на годы, которая не нужна, пока MAU < миллиона.`,
      followUps: [
        'Как развести Sentry Performance и OpenTelemetry, чтобы не дублировать данные?',
        'Когда пора заводить отдельную observability-команду?',
        'Сколько в среднем тратится бюджета на observability как % от инфраструктуры?',
      ],
      relatedChapterId: 'dashboards',
    },
    {
      id: 'sdo-iq8',
      question:
        'Что делать, если после релиза вырос INP, но Sentry молчит и ошибок нет?',
      shortAnswer:
        'Это классический кейс «нет ошибок, но пользователю плохо». Ищем в RUM разрез по релизу и устройству, проверяем longtasks и Sentry Performance, смотрим bundle size diff, активные feature flags. Чаще всего — новый тяжёлый JS на main thread.',
      fullAnswer: `Отсутствие ошибок не равно отсутствию проблемы. INP — метрика отзывчивости, и она ломается от тяжёлых синхронных задач, а не от исключений.

**Шаги триажа:**

1. **Подтвердить регрессию в RUM.** Открываем dashboard, фильтруем по \`release = новый sha\` vs предыдущий. Смотрим p75 INP в разрезе route, device, connection. Если INP вырос на конкретном route или device — нашли область поиска.

2. **Сравнить bundle size.** \`next build\` / \`vite build\` показывают сравнение со снапшотом. Резкий рост main-bundle на 50+ кБ — почти всегда корень. Возможные причины: новый npm-пакет, импортированный с побочными эффектами; \`import\` всей библиотеки вместо tree-shakable subpath; CSS-in-JS с runtime-инъекцией.

3. **Longtasks в RUM.** \`PerformanceObserver({ type: 'longtask' })\` показывает задачи > 50 мс на main thread. Если их стало больше после релиза — ищем источник в Sentry Performance или в Chrome DevTools Performance Insights.

4. **Sentry Performance.** Разрез по транзакциям, p75 на route checkout. Видно, что именно тормозит: рендер компонента, fetch, JSON.parse большого ответа, hydration.

5. **Активные feature flags.** Если регрессия только у пользователей с включённым флагом X — выключаем флаг, INP возвращается, причина найдена за 30 секунд. Это и есть смысл хранить активные flags рядом с RUM-метриками.

6. **A/B-варианты.** Аналогично: если новый вариант сильнее старого по INP — это guardrail-метрика, тест останавливаем.

**Самые частые причины:**
- Новый \`useEffect\` с тяжёлой синхронной работой на mount.
- Подключение чужого скрипта (analytics, A/B-движок) без \`async\`/\`defer\`.
- Большой JSON, парсящийся синхронно при роуте.
- Hydration mismatch, который раньше был на 5% страниц, а теперь на 50%.
- Регрессия в зависимости (обновили \`react-router\` мажор и hydration стал дороже).

**Превентивные меры:**
- В CI — performance budget на bundle size, fail PR при росте > 5%.
- Lighthouse CI на synthetic-сценариях.
- RUM с разрезом по релизу — must-have, без него такие регрессии замечают через неделю и обвинения.`,
      followUps: [
        'Как настроить performance budget в Lighthouse CI?',
        'Как ловить hydration mismatch автоматически в проде?',
        'Какие longtasks считаются «нормальными» и когда стоит беспокоиться?',
      ],
      relatedChapterId: 'rum',
    },
  ],

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
