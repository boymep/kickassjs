import type { Lesson } from '../../types/lesson';
import { jsDomQuiz } from '../quizzes/js-dom';

const Q = Object.fromEntries(jsDomQuiz.questions.map((q) => [q.id, q]));

const CHECKPOINT_IDS = new Set(['jsdom-q1', 'jsdom-q4', 'jsdom-q6', 'jsdom-q9', 'jsdom-q11']);

export const jsDomLesson: Lesson = {
  topicId: 'js-dom',

  intro: {
    whyItMatters: `DOM — древовидное представление HTML-документа, с которым работает JavaScript. В стандартном API браузера доступны методы поиска (\`document.querySelector\`), регистрации обработчиков (\`addEventListener\`) и создания узлов (\`document.createElement\`). Понимание модели событий, делегирования и стоимости операций отличает плавно работающий код от того, который вызывает заметные задержки рендеринга даже на простых страницах.

На собеседовании проверяют разницу между фазами события (capture, target, bubble), как работает делегирование, что вызывает перерасчёт layout, и как реализовать debounce и throttle для обработчиков ввода и скролла.`,
    estimatedMinutes: 26,
    interviewAngle:
      'Интервьюера интересуют фазы событий, делегирование, момент готовности DOM (\`DOMContentLoaded\` против \`load\`) и то, как кандидат измеряет стоимость операций. Знание API важно меньше, чем понимание, какие действия вызывают layout, а какие — только paint или composite.',
    prerequisites: [{ slug: 'js-event-loop', title: 'Event Loop' }],
  },

  chapters: [
    // ─────────────────────────────────────────────────────────────
    {
      id: 'dom-basics',
      title: 'Что такое DOM и как с ним работать',
      estimatedMinutes: 4,
      blocks: [
        {
          type: 'text',
          content:
            'DOM (Document Object Model) — древовидная структура, в которую браузер парсит HTML. Корень — \`document\`, дети — \`<html>\`, \`<head>\`, \`<body>\` и далее. JavaScript видит документ именно как это дерево объектов, а не как текст.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Поиск
const heading = document.querySelector('h1');
const items   = document.querySelectorAll('li');
const byId    = document.getElementById('main');

// Создать и вставить
const div = document.createElement('div');
div.textContent = 'Новый блок';
div.classList.add('card');
document.body.append(div);

// Изменить
heading.textContent = 'Новый заголовок';
heading.style.color = 'red';
heading.setAttribute('data-state', 'active');
// dataset: data-* атрибуты доступны как свойства
heading.dataset.state;        // 'active'

// Удалить
div.remove();`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            '\`querySelector\` принимает CSS-селектор и возвращает первый совпавший элемент или \`null\`. \`querySelectorAll\` возвращает статический \`NodeList\` — он не обновляется при изменении DOM. \`getElementsByClassName\` и \`getElementsByTagName\` возвращают живые \`HTMLCollection\`, которые обновляются автоматически. \`Node.childNodes\` тоже живой — это часто путают.',
        },
        { type: 'heading', content: 'Прохождение по дереву' },
        {
          type: 'list',
          content: `\`parentElement\` — родитель.
\`children\` — дочерние элементы (без текстовых узлов).
\`childNodes\` — все дети, включая текстовые узлы и комментарии (живая коллекция).
\`firstElementChild\` / \`lastElementChild\` — первый / последний дочерний элемент.
\`nextElementSibling\` / \`previousElementSibling\` — соседние элементы.
\`closest(selector)\` — поднимается вверх до первого родителя, совпавшего с селектором.
\`matches(selector)\` — проверка, удовлетворяет ли сам элемент селектору.`,
        },
        { type: 'heading', content: 'Когда DOM готов: DOMContentLoaded и load' },
        {
          type: 'text',
          content:
            'Событие \`DOMContentLoaded\` срабатывает на \`document\` после полного построения DOM и парсинга всех скриптов без \`defer\` / \`async\`. Стили, изображения и внешние \`<script async>\` к этому моменту могут быть ещё не загружены. Событие \`load\` срабатывает на \`window\` после полной загрузки страницы вместе со всеми ресурсами. Текущее состояние можно прочитать в \`document.readyState\`: \`loading\`, \`interactive\`, \`complete\`.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init(); // DOM уже готов
}

window.addEventListener('load', () => {
  // все ресурсы (шрифты, картинки) загружены
});`,
        },
      ],
      checkpoint: [Q['jsdom-q1']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'events-phases',
      title: 'События: capture, target, bubble',
      estimatedMinutes: 6,
      blocks: [
        {
          type: 'text',
          content:
            'Когда пользователь нажимает на элемент, событие проходит три фазы: capture (от корня вниз до цели), target (на самой цели), bubble (от цели обратно к корню). Большинство обработчиков работают на bubble. Для capture-фазы используется \`{ capture: true }\` в третьем аргументе \`addEventListener\`.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `document.body.addEventListener('click', () => console.log('body bubble'));
document.body.addEventListener('click', () => console.log('body capture'), { capture: true });

button.addEventListener('click', (e) => {
  console.log('button click, phase =', e.eventPhase);
  // 1 = capturing, 2 = at target, 3 = bubbling
  // Значение 2 (at target) ставится для обработчиков, висящих на самой цели —
  // независимо от того, регистрировались они на capture или bubble.
});

// Клик по button даёт:
// 'body capture'   — capture идёт от document вниз
// 'button click'   — фаза target
// 'body bubble'    — bubble идёт от button вверх`,
        },
        { type: 'heading', content: 'stopPropagation и preventDefault' },
        {
          type: 'list',
          content: `\`event.stopPropagation()\` — останавливает дальнейшее распространение по фазам.
\`event.stopImmediatePropagation()\` — плюс отменяет остальные обработчики того же события на текущем элементе.
\`event.preventDefault()\` — отменяет действие по умолчанию (переход по ссылке, отправка формы). Не отменяет всплытие.
\`event.composedPath()\` — возвращает массив элементов, через которые прошло событие (полезно при работе с Shadow DOM).
\`event.isTrusted\` — \`true\` для событий, инициированных пользователем; \`false\` для созданных через \`new Event\` и \`dispatchEvent\`.`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            '\`stopPropagation\` следует применять только при реальной необходимости: он ломает делегирование на родительских элементах и системы аналитики, которые опираются на всплытие кликов.',
        },
        { type: 'heading', content: 'Passive listeners' },
        {
          type: 'text',
          content:
            'Опция \`{ passive: true }\` обещает браузеру, что обработчик не вызовет \`preventDefault()\`. Благодаря этому браузер не ждёт выполнения обработчика и может сразу начать скролл — это даёт плавную прокрутку даже на тяжёлых страницах. С 2017 года Chrome применяет \`passive: true\` по умолчанию к слушателям \`touchstart\` и \`touchmove\` на корневых узлах. Если в таком обработчике вызвать \`preventDefault\`, он не сработает и в консоли появится предупреждение. Решение: явно передать \`{ passive: false }\`.',
        },
        { type: 'heading', content: 'CustomEvent' },
        {
          type: 'text',
          content:
            'Любой элемент может сгенерировать пользовательское событие и передать данные через \`detail\`. Это удобно для коммуникации между компонентами без прямой ссылки друг на друга.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const event = new CustomEvent('user:logout', {
  detail: { userId: 42 },
  bubbles: true,
});
element.dispatchEvent(event);

document.addEventListener('user:logout', (e) => {
  console.log('user logged out:', e.detail.userId);
});`,
        },
        { type: 'heading', content: 'AbortController для группы обработчиков' },
        {
          type: 'text',
          content:
            'Опция \`signal\` у \`addEventListener\` позволяет снять обработчик через \`AbortController\`. Это особенно удобно, когда нужно отписаться сразу от нескольких событий — например, при уничтожении компонента.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const controller = new AbortController();
const { signal } = controller;

el.addEventListener('click', onClick, { signal });
el.addEventListener('focus', onFocus, { signal });
el.addEventListener('blur',  onBlur,  { signal });

controller.abort(); // снимает все три обработчика`,
        },
      ],
      checkpoint: [Q['jsdom-q4']!, {
        type: 'ordering',
        id: 'jsdom-ord1',
        description: 'Расставьте фазы распространения события в порядке, в котором они происходят',
        items: [
          'Capture: от document к ближайшему родителю цели',
          'Target: обработчики на самой цели',
          'Bubble: от цели обратно вверх к document',
        ],
        explanation:
          'События распространяются capture → target → bubble. По умолчанию обработчики ловят bubble — это удобно для делегирования. Capture нужен редко, например для перехвата событий до того, как их обработают дочерние элементы.',
      }],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'delegation',
      title: 'Делегирование событий',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Делегирование — один обработчик на родителе вместо отдельного обработчика на каждом ребёнке. Использует bubble-фазу: клик по любому ребёнку всплывает до родителя. Внутри обработчика \`event.target\` определяет, что именно кликнули, а \`event.target.closest(selector)\` поднимается до нужного уровня.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Без делегирования: n обработчиков
document.querySelectorAll('.item').forEach((item) => {
  item.addEventListener('click', () => console.log('clicked', item.dataset.id));
});

// С делегированием: один обработчик
document.querySelector('.list').addEventListener('click', (e) => {
  const item = e.target.closest('.item');
  if (!item) return;
  console.log('clicked', item.dataset.id);
});`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Делегирование выгодно по трём причинам: один обработчик вместо n по числу детей (меньше памяти), автоматически работает на динамически добавленных элементах, не требует ручного снятия обработчиков при удалении ребёнка.',
        },
        { type: 'heading', content: 'event.target.closest и контейнер' },
        {
          type: 'text',
          content:
            '\`event.target\` — конкретный элемент, по которому кликнули. Если клик пришёлся на дочерний \`<span>\` внутри \`<li>\`, \`target\` будет \`<span>\`. \`closest(selector)\` поднимается вверх до элемента, удовлетворяющего селектору. Этот метод может «вылететь» за пределы делегирующего контейнера — поэтому полезна дополнительная проверка \`container.contains(item)\`.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `list.addEventListener('click', (e) => {
  const item = e.target.closest('.item');
  if (!item) return;
  if (!list.contains(item)) return; // защита от closest за пределами list
  handleClick(item);
});`,
        },
      ],
      checkpoint: [Q['jsdom-q6']!, {
        type: 'match-pairs',
        id: 'jsdom-mp1',
        description: 'Сопоставьте свойство события с тем, что оно возвращает',
        pairs: [
          { left: 'event.target', right: 'Элемент, на котором событие произошло' },
          { left: 'event.currentTarget', right: 'Элемент, к которому привязан текущий обработчик' },
          { left: 'event.eventPhase', right: 'Текущая фаза: 1 (capture), 2 (target), 3 (bubble)' },
          { left: 'event.defaultPrevented', right: 'true, если ранее вызывали preventDefault' },
        ],
        explanation:
          'Разница между \`target\` и \`currentTarget\` — главный момент в делегировании. \`target\` — самый «глубокий» элемент. \`currentTarget\` — тот, к которому привязан текущий обработчик.',
      }],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'observers',
      title: 'Наблюдатели: MutationObserver и IntersectionObserver',
      estimatedMinutes: 5,
      blocks: [
        { type: 'heading', content: 'MutationObserver' },
        {
          type: 'text',
          content:
            '\`MutationObserver\` отслеживает изменения в DOM: добавление и удаление узлов, изменение атрибутов и текста. Браузер накапливает изменения и передаёт их одним вызовом — коллбэк ставится в очередь микрозадач.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const observer = new MutationObserver((mutations) => {
  for (const m of mutations) {
    console.log(m.type, m.addedNodes, m.removedNodes);
  }
});

observer.observe(targetNode, {
  childList: true,   // следить за добавлением и удалением детей
  attributes: true,  // следить за изменением атрибутов
  subtree: true,     // следить за всеми потомками
});

observer.disconnect(); // не забыть отключить`,
        },
        { type: 'heading', content: 'IntersectionObserver' },
        {
          type: 'text',
          content:
            '\`IntersectionObserver\` сообщает, когда отслеживаемый элемент попадает во вьюпорт или другую заданную область. Используется для lazy-loading изображений, infinite scroll, sticky-эффектов, аналитики «видимости» баннеров. Срабатывает асинхронно и не блокирует главный поток.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const io = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target); // больше не нужно следить
    }
  }
}, { rootMargin: '100px', threshold: 0.1 });

document.querySelectorAll('.card').forEach((el) => io.observe(el));`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Рядом с этими двумя API часто упоминают \`ResizeObserver\` (изменение размеров элемента) и \`PerformanceObserver\` (метрики производительности). Все они построены по одному принципу: \`observe\`, асинхронные коллбэки, \`disconnect\` в финале.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'performance',
      title: 'Производительность DOM',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Часть DOM-операций запускает дорогие этапы рендер-конвейера. Layout — этап вычисления размеров и позиций элементов; paint — отрисовка пикселей; composite — наложение слоёв на GPU. Чтение свойств вроде \`offsetWidth\`, \`getBoundingClientRect\`, \`offsetTop\` принуждает браузер пересчитать layout прямо здесь и сейчас — это блокирующая работа на главном потоке. Если в цикле чередуются чтение и запись, происходит layout thrashing — десятки лишних перерасчётов.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// АНТИПАТТЕРН: layout thrashing
for (const el of items) {
  const w = el.offsetWidth;          // чтение (force layout)
  el.style.width = (w * 2) + 'px';   // запись (инвалидирует layout)
}

// Лучше: сначала все чтения, потом все записи
const widths = items.map((el) => el.offsetWidth);
items.forEach((el, i) => {
  el.style.width = (widths[i] * 2) + 'px';
});`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Чтения и записи стоит группировать. Запись в стиль после чтения геометрии заставляет браузер пересчитать layout ещё раз. Если в цикле n итераций, происходит до n перерасчётов вместо одного.',
        },
        { type: 'heading', content: 'requestAnimationFrame и DocumentFragment' },
        {
          type: 'code',
          language: 'javascript',
          content: `// rAF: одно обновление на кадр
let rafId = null;
window.addEventListener('scroll', () => {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(() => {
    updateHeader();
    rafId = null;
  });
});

// DocumentFragment: одна вставка вместо n
const fragment = document.createDocumentFragment();
for (const data of items) {
  const li = document.createElement('li');
  li.textContent = data.name;
  fragment.appendChild(li);
}
list.appendChild(fragment); // один reflow`,
        },
      ],
      checkpoint: [Q['jsdom-q9']!, Q['jsdom-q11']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'accessibility-and-shadow',
      title: 'Доступность и Shadow DOM',
      estimatedMinutes: 4,
      blocks: [
        { type: 'heading', content: 'Управление фокусом и клавиатурой' },
        {
          type: 'text',
          content:
            'Кастомные интерактивные элементы (выпадающие меню, диалоги, табы) должны корректно вести себя с клавиатурой и со скринридерами. Базовый минимум: \`tabindex="0"\` делает элемент фокусируемым в обычном порядке, \`tabindex="-1"\` — фокусируемым только программно. Событие \`keydown\` обрабатывает нажатия (Enter, Space, Escape, стрелки). \`element.focus()\` перемещает фокус.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Диалог: ловим Escape, ставим фокус на кнопку закрытия
dialog.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') close();
});
dialog.querySelector('.close').focus();`,
        },
        { type: 'heading', content: 'ARIA-атрибуты' },
        {
          type: 'text',
          content:
            'ARIA-атрибуты (\`role\`, \`aria-label\`, \`aria-expanded\`, \`aria-hidden\`) описывают семантику и состояние элемента для вспомогательных технологий. Используются, когда стандартного HTML-тега недостаточно — например, для пользовательского \`<div>\`, выполняющего роль кнопки. По возможности предпочитают семантические теги (\`<button>\`, \`<nav>\`, \`<dialog>\`) — у них доступность реализована из коробки.',
        },
        { type: 'heading', content: 'Shadow DOM' },
        {
          type: 'text',
          content:
            'Shadow DOM — изолированное поддерево, прикреплённое к элементу через \`element.attachShadow({ mode: \'open\' })\`. Стили внутри shadow root не «вытекают» наружу и не подвержены внешним стилям; селекторы \`querySelector\` снаружи не видят узлы внутри. Эта изоляция используется в Web Components. Событие, поднимающееся из shadow root, на пути наружу теряет конкретный \`target\` (становится самим компонентом) — узнать реальный путь можно через \`event.composedPath()\`.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'pitfalls',
      title: 'Подводные камни',
      estimatedMinutes: 4,
      blocks: [
        { type: 'heading', content: 'innerHTML и XSS' },
        {
          type: 'code',
          language: 'javascript',
          content: `// АНТИПАТТЕРН: вставка пользовательского ввода
container.innerHTML = '<div>' + userInput + '</div>';
// Если userInput содержит <script>, он выполнится

// Безопасно — textContent
const div = document.createElement('div');
div.textContent = userInput;
container.append(div);`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Пользовательский ввод нельзя вставлять через \`innerHTML\` без санитизации — это классический вектор XSS. Альтернативы: \`textContent\`, \`element.append\` с DOM-узлами, или \`DOMPurify\`, если HTML действительно нужен.',
        },
        { type: 'heading', content: 'Утечки памяти через обработчики' },
        {
          type: 'text',
          content:
            'Если на DOM-узле висит обработчик, замкнутый на большие данные, и узел удалён со страницы, но ссылка на обработчик остаётся, данные не освобождаются. Решения: \`removeEventListener\` при удалении, опция \`signal\` от \`AbortController\` (см. главу про события), \`WeakMap\` для метаданных узлов.',
        },
        { type: 'heading', content: 'Итерация по живой коллекции с удалением' },
        {
          type: 'text',
          content:
            'Удаление элементов во время итерации по \`HTMLCollection\` (например, по \`getElementsByClassName\`) приводит к пропуску элементов или бесконечному циклу: индексы сдвигаются по мере удаления. Решения: предварительно сделать снимок коллекции через \`Array.from(...)\` или \`querySelectorAll\` (статический \`NodeList\`).',
        },
        { type: 'heading', content: 'Сравнение event.target и event.currentTarget' },
        {
          type: 'text',
          content:
            'В обработчике делегирования \`event.currentTarget\` — это контейнер, к которому привязан слушатель, а \`event.target\` — фактический источник события. Чтение размеров или классов из \`currentTarget\` вместо \`target\` приводит к багам, когда обработчик «срабатывает», но действует на родителя.',
        },
      ],
    },
  ],

  finalQuiz: jsDomQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  cheatsheet: `### Шпаргалка по DOM и событиям

**Поиск и навигация**
- \`document.querySelector\` / \`querySelectorAll\` — статический \`NodeList\`
- \`getElementsByClassName\` / \`getElementsByTagName\` — живой \`HTMLCollection\`
- \`getElementById\` — единственный элемент
- \`element.closest(selector)\` — ближайший родитель по селектору
- \`element.matches(selector)\` — проверка совпадения

**Создание и изменение**
- \`document.createElement(tag)\` + \`append\` / \`prepend\`
- \`textContent\` — безопасный текст
- \`innerHTML\` — только для доверенного HTML
- \`classList.add / remove / toggle / contains\`
- \`element.dataset.foo\` ⇄ атрибут \`data-foo\`

**Готовность DOM**
- \`document.readyState\`: loading → interactive → complete
- \`DOMContentLoaded\` — DOM построен (стили/картинки ещё могут грузиться)
- \`load\` (на window) — все ресурсы загружены

**События**
- Три фазы: capture → target → bubble
- \`addEventListener(name, fn, { capture, once, passive, signal })\`
- \`event.target\` — где произошло, \`event.currentTarget\` — где висит обработчик
- \`event.stopPropagation()\` — остановить распространение
- \`event.preventDefault()\` — отменить действие по умолчанию
- \`event.composedPath()\` — путь события (важно для Shadow DOM)
- \`event.isTrusted\` — пользовательское или синтетическое

**Passive listeners**
- \`{ passive: true }\` — браузер не ждёт обработчик, скролл плавный
- \`touchstart\` / \`touchmove\` в Chrome по умолчанию passive
- Для \`preventDefault\` нужно явно \`{ passive: false }\`

**Делегирование**
\`\`\`js
parent.addEventListener('click', (e) => {
  const item = e.target.closest('.item');
  if (item && parent.contains(item)) handle(item);
});
\`\`\`

**CustomEvent**
\`\`\`js
const event = new CustomEvent('app:ready', { detail: {...}, bubbles: true });
el.dispatchEvent(event);
\`\`\`

**Наблюдатели**
- \`MutationObserver\` — изменения DOM (микрозадача)
- \`IntersectionObserver\` — попадание во вьюпорт
- \`ResizeObserver\` — изменение размеров
- Все требуют \`disconnect()\` при ненадобности

**Производительность**
- Группировать чтения и записи — избегать layout thrashing
- \`DocumentFragment\` для массовой вставки
- \`requestAnimationFrame\` для обработчиков скролла и resize
- \`AbortController\` для группового снятия обработчиков

**Доступность**
- \`tabindex="0"\` / \`tabindex="-1"\`, \`element.focus()\`
- Семантические теги перед ARIA-атрибутами
- Shadow DOM изолирует стили и DOM, \`composedPath\` для пути события

**Подводные камни**
- \`innerHTML\` + пользовательский ввод → XSS
- Удаление в живой коллекции при итерации → пропуски и зависание
- Утечки памяти через незакрытые обработчики`,

  nextTopics: [
    {
      slug: 'js-network',
      reason:
        'После DOM-событий логично разобрать сеть: \`fetch\`, CORS, cookies — все они подаются на страницу через обработчики и обновляют DOM.',
    },
    {
      slug: 'js-browser',
      reason:
        'Полная картина: критический рендеринг, layout, paint и composite. Объясняет, почему одни DOM-операции дорогие, а другие почти бесплатные.',
    },
  ],
};
