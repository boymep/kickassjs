import type { Lesson } from '../../types/lesson';
import { jsDomQuiz } from '../quizzes/js-dom';

const Q = Object.fromEntries(jsDomQuiz.questions.map((q) => [q.id, q]));

const CHECKPOINT_IDS = new Set(['jsdom-q1', 'jsdom-q4', 'jsdom-q6', 'jsdom-q9', 'jsdom-q11']);

export const jsDomLesson: Lesson = {
  topicId: 'js-dom',

  intro: {
    whyItMatters: `DOM — древовидное представление HTML-документа, с которым работает JavaScript. Из коробки доступны API: \`document.querySelector\`, \`addEventListener\`, \`createElement\`. Понимание модели событий, делегирования и стоимости операций отличает код, который работает плавно, от того, что дёргается на простых страницах.

На собеседовании проверяют разницу между фазами события (capture / target / bubble), как работает делегирование, что вызывает перерасчёт layout, и как реализовать debounce / throttle для обработчиков ввода и скролла.`,
    estimatedMinutes: 26,
    interviewAngle:
      'Интервьюера интересуют фазы событий, делегирование и то, как кандидат измеряет стоимость операций с DOM. Знание API важно меньше, чем понимание, какие действия вызывают layout, а какие — только paint или composite.',
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
            '**DOM** (Document Object Model) — древовидная структура, в которую браузер парсит HTML. Корень — \`document\`, дети — \`<html>\`, \`<head>\`, \`<body>\` и далее. JavaScript видит документ именно как это дерево объектов, а не как текст.',
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

// Удалить
div.remove();`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            '\`querySelector\` принимает CSS-селектор и возвращает первый совпавший элемент или \`null\`. \`querySelectorAll\` возвращает статический \`NodeList\` — он не обновляется при изменении DOM. \`getElementsByClassName\` возвращает живую \`HTMLCollection\`, которая обновляется автоматически.',
        },
        { type: 'heading', content: 'Прохождение по дереву' },
        {
          type: 'list',
          content: `\`parentElement\` — родитель.
\`children\` — дочерние элементы (без текстовых узлов).
\`childNodes\` — все дети, включая текстовые узлы и комментарии.
\`firstElementChild\` / \`lastElementChild\` — первый / последний дочерний элемент.
\`nextElementSibling\` / \`previousElementSibling\` — соседние элементы.
\`closest(selector)\` — поднимается вверх до первого родителя, совпавшего с селектором.`,
        },
      ],
      checkpoint: [Q['jsdom-q1']!],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'events-phases',
      title: 'События: capture, target, bubble',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Когда пользователь нажимает на элемент, событие проходит три фазы: **capture** (от корня вниз до цели), **target** (на самой цели), **bubble** (от цели обратно к корню). Большинство обработчиков работают на bubble. Для capture-фазы используется \`{ capture: true }\` в третьем аргументе \`addEventListener\`.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `document.body.addEventListener('click', () => console.log('body bubble'));
document.body.addEventListener('click', () => console.log('body capture'), { capture: true });

button.addEventListener('click', (e) => {
  console.log('button click, phase =', e.eventPhase);
  // 1 = capturing, 2 = at target, 3 = bubbling
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
\`event.preventDefault()\` — отменяет действие по умолчанию (переход по ссылке, отправка формы). Не отменяет всплытие.`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Чрезмерное использование \`stopPropagation\` ломает делегирование и аналитику кликов. Используется только когда действительно нужно. Для пассивных событий (\`touchstart\`, \`wheel\`) \`preventDefault\` не сработает — нужно \`{ passive: false }\` в опциях \`addEventListener\`.',
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
            '**Делегирование** — один обработчик на родителе вместо отдельного обработчика на каждом ребёнке. Использует bubble-фазу: клик по любому ребёнку всплывает до родителя. Внутри обработчика \`event.target\` определяет, что именно кликнули.',
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
            'Делегирование выгодно по трём причинам: один обработчик вместо тысяч (меньше памяти), работает на динамически добавленных элементах, не требует ручного снятия обработчиков при удалении ребёнка.',
        },
        { type: 'heading', content: 'event.target.closest' },
        {
          type: 'text',
          content:
            '\`event.target\` — конкретный элемент, по которому кликнули. Если клик пришёлся на дочерний \`<span>\` внутри \`<li>\`, \`target\` будет \`<span>\`. Поэтому используют \`event.target.closest(selector)\` — он поднимается вверх до элемента, удовлетворяющего селектору.',
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
      id: 'custom-events-observer',
      title: 'CustomEvent и MutationObserver',
      estimatedMinutes: 4,
      blocks: [
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

// Где-то в другом месте — слушать
document.addEventListener('user:logout', (e) => {
  console.log('user logged out:', e.detail.userId);
});`,
        },
        { type: 'heading', content: 'MutationObserver' },
        {
          type: 'text',
          content:
            '\`MutationObserver\` отслеживает изменения в DOM: добавление и удаление узлов, изменение атрибутов и текста. Срабатывает асинхронно как микрозадача — после завершения текущего синхронного кода.',
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
        {
          type: 'callout',
          calloutType: 'info',
          content:
            '\`MutationObserver\` использует один поток коллбэков на все наблюдатели — браузер батчит изменения. На каждое изменение коллбэк не вызывается, накопленные мутации приходят пакетом.',
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
            'DOM-операции дороги. Чтение свойств вроде \`offsetWidth\`, \`getBoundingClientRect\`, \`offsetTop\` принуждает браузер пересчитать layout — это блокирующая работа на главном потоке. Если в цикле чередуются чтение и запись, происходит **layout thrashing** — десятки лишних перерасчётов.',
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
            'Чтения и записи стоит группировать. Запись в стиль после чтения геометрии заставляет браузер пересчитать layout ещё раз. Если в цикле n итераций — до n перерасчётов вместо одного.',
        },
        { type: 'heading', content: 'requestAnimationFrame и Document Fragment' },
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
            'Если на DOM-узле висит обработчик, замкнутый на большие данные, и узел удаляют со страницы, но ссылка на обработчик остаётся — данные не освобождаются. Решения: \`removeEventListener\` при удалении, \`AbortController\` для группы обработчиков, \`WeakMap\` для метаданных узлов.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// AbortController — снять группу обработчиков одной командой
const controller = new AbortController();
const { signal } = controller;

el.addEventListener('click', onClick, { signal });
el.addEventListener('focus', onFocus, { signal });
el.addEventListener('blur',  onBlur,  { signal });

// Когда компонент уничтожается:
controller.abort(); // снимет все три обработчика`,
        },
        { type: 'heading', content: 'Живые и статические коллекции' },
        {
          type: 'text',
          content:
            '\`getElementsByClassName\` и \`getElementsByTagName\` возвращают **живую** \`HTMLCollection\` — она обновляется при изменении DOM. Итерация по ней с одновременным удалением элементов даёт неожиданные результаты. \`querySelectorAll\` возвращает **статический** \`NodeList\`, который не меняется.',
        },
      ],
    },
  ],

  finalQuiz: jsDomQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  cheatsheet: `### Шпаргалка по DOM и событиям

**Поиск и навигация**
- \`document.querySelector\` / \`querySelectorAll\` — статический \`NodeList\`
- \`getElementById\` — единственный элемент
- \`element.closest(selector)\` — ближайший родитель по селектору
- \`element.matches(selector)\` — проверка совпадения

**Создание и изменение**
- \`document.createElement(tag)\` + \`append\` / \`prepend\`
- \`textContent\` — безопасный текст
- \`innerHTML\` — только для доверенного HTML
- \`classList.add / remove / toggle / contains\`
- \`element.dataset.foo\` ⇄ атрибут \`data-foo\`

**События**
- Три фазы: capture → target → bubble
- \`addEventListener(name, fn, { capture, once, passive, signal })\`
- \`event.target\` — где произошло, \`event.currentTarget\` — где висит обработчик
- \`event.stopPropagation()\` — остановить распространение
- \`event.preventDefault()\` — отменить действие по умолчанию

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

**MutationObserver**
- Асинхронные коллбэки (микрозадача)
- Опции: \`childList\`, \`attributes\`, \`subtree\`, \`characterData\`
- Не забыть \`observer.disconnect()\`

**Производительность**
- Группировать чтения и записи — избегать layout thrashing
- \`DocumentFragment\` для массовой вставки
- \`requestAnimationFrame\` для обработчиков скролла и resize
- \`AbortController\` для группового снятия обработчиков

**Подводные камни**
- \`innerHTML\` + пользовательский ввод → XSS
- Живые коллекции ведут себя неожиданно при изменении DOM
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
