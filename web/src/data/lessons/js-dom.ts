import type { Lesson } from '../../types/lesson';
import { jsDomQuiz } from '../quizzes/js-dom';
import { jsDomFlashcards } from '../flashcards/js-dom';

// Index existing quiz questions for reuse as checkpoints.
const Q = Object.fromEntries(jsDomQuiz.questions.map((q) => [q.id, q]));

// Questions used as in-chapter checkpoints (must NOT appear in finalQuiz).
const CHECKPOINT_IDS = new Set(['jsdom-q1', 'jsdom-q4', 'jsdom-q6', 'jsdom-q9', 'jsdom-q11']);

export const jsDomLesson: Lesson = {
  topicId: 'js-dom',

  intro: {
    whyItMatters: `DOM — это **программная модель** документа, которую браузер строит после парсинга HTML. Важно понимать, что DOM **не равен** исходному HTML: парсер исправляет невалидную разметку, добавляет недостающие \`html/head/body\`, а скрипты и CSS могут менять дерево ещё до того, как пользователь увидит страницу. Дерево DOM состоит не только из элементов: между ними живут текстовые узлы, комментарии и whitespace, и обход \`childNodes\` это покажет.

Любой запрос к DOM — это переход через мост между движком JavaScript и движком рендеринга. Геометрические свойства (\`offsetHeight\`, \`getBoundingClientRect\`, \`scrollTop\`) форсируют синхронный пересчёт layout, если до этого что-то менялось в стилях. Чередование чтений и записей в цикле порождает классический **layout thrashing**: каждое чтение после записи заставляет браузер заново считать раскладку. Поэтому опытные разработчики группируют чтения, потом записи, и используют \`DocumentFragment\` для пакетной вставки.

Модель событий — вторая опора темы. Событие проходит три фазы: **capture** (от \`window\` вниз к цели), **target** и **bubble** (обратно вверх). На фазе всплытия строится **делегирование событий**: один обработчик на родителе обслуживает тысячи дочерних элементов и автоматически работает для динамически добавленных. Без делегирования таблица на 10 000 строк аллоцирует 10 000 обработчиков, каждый со своим замыканием, — это ощутимая нагрузка на память и на парсинг кода. Понимание разницы \`event.target\` и \`event.currentTarget\`, \`stopPropagation\` и \`preventDefault\` — обязательный минимум на собеседовании по фронтенду.`,
    estimatedMinutes: 35,
    interviewAngle:
      'Интервьюер проверяет, понимаете ли вы три фазы события, умеете ли реализовать делегирование через closest, отличаете ли target/currentTarget и stopPropagation/preventDefault, знаете ли причины layout thrashing и оптимизации через DocumentFragment, requestAnimationFrame и IntersectionObserver.',
    prerequisites: [
      { slug: 'js-closures', title: 'Замыкания' },
      { slug: 'js-this', title: 'this и контекст' },
    ],
  },

  resources: {
    videos: [
      {
        source: 'youtube',
        id: 'XF1_MlZ5l6M',
        title: 'Learn JavaScript Event Listeners In 18 Minutes',
        channel: 'Web Dev Simplified',
        language: 'en',
        durationSec: 18 * 60,
        description:
          'Полный обзор addEventListener, фаз capture/bubble, опций once/passive и делегирования событий с примерами в браузере.',
      },
      {
        source: 'youtube',
        id: 'YL1F4dCUlLc',
        title: 'How LocalStorage and Event Delegation work — JavaScript30 #15',
        channel: 'Wes Bos',
        language: 'en',
        durationSec: 21 * 60,
        description:
          'Wes Bos на live-кодинге показывает event delegation в действии: один обработчик на родителе перехватывает события от ещё не созданных детей. Практическое дополнение к теории Web Dev Simplified.',
      },
    ],
    links: [
      {
        url: 'https://developer.mozilla.org/ru/docs/Web/API/Document_Object_Model/Introduction',
        title: 'Введение в DOM — MDN',
        source: 'mdn',
        language: 'ru',
        note: 'Канонический разбор: что такое узлы, как браузер строит дерево, какие интерфейсы есть у элементов.',
      },
      {
        url: 'https://developer.mozilla.org/ru/docs/Web/API/Event',
        title: 'Event и фазы распространения — MDN',
        source: 'mdn',
        language: 'ru',
        note: 'Описание объекта Event, capture/target/bubble, stopPropagation, preventDefault и опций addEventListener.',
      },
      {
        url: 'https://learn.javascript.ru/event-delegation',
        title: 'Делегирование событий — учебник learn.javascript.ru',
        source: 'learn-js',
        language: 'ru',
        note: 'Глава Ильи Кантора с примерами «меню на одном обработчике» и поиском по data-атрибутам.',
      },
      {
        url: 'https://learn.javascript.ru/bubbling-and-capturing',
        title: 'Всплытие и погружение — учебник learn.javascript.ru',
        source: 'learn-js',
        language: 'ru',
        note: 'Подробно о трёх фазах события и о том, как event.target отличается от event.currentTarget.',
      },
      {
        url: 'https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing',
        title: 'Avoid large, complex layouts and layout thrashing — web.dev',
        source: 'web-dev',
        language: 'en',
        note: 'Команда Chrome объясняет, что заставляет браузер считать layout, и как избежать «layout thrashing».',
      },
    ],
  },

  chapters: [
    {
      id: 'dom-basics',
      title: 'Что такое DOM и как браузер его строит',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'DOM (Document Object Model) — это **дерево объектов**, которое браузер строит из HTML-документа. Каждый узел дерева реализует один из интерфейсов: `Document`, `Element`, `Text`, `Comment`. JavaScript видит DOM через глобальный объект `document` и может читать и менять его в любой момент.',
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'DOM — это **не** исходный HTML. Парсер исправляет несбалансированные теги, добавляет `html/head/body`, нормализует регистр, преобразует сущности. Если на странице есть `document.write` или скрипты, меняющие дерево до load — итоговое DOM-дерево может сильно отличаться от того, что вы написали в файле.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Поиск элементов
const el = document.getElementById('app');           // O(1) по id
const links = document.querySelectorAll('a.active'); // CSS-селектор, статический NodeList
const first = document.querySelector('.item');       // первый совпавший

// Создание и наполнение
const div = document.createElement('div');
div.className = 'card';
div.textContent = 'Hello';
div.setAttribute('data-id', '42');

// Вставка
document.body.appendChild(div);
document.body.prepend(div);                              // в начало
el.insertAdjacentElement('afterend', div);               // рядом

// Удаление
div.remove();

// Изменение классов
div.classList.add('active');
div.classList.toggle('open');
div.classList.contains('active'); // true`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            '`querySelectorAll` возвращает **статический** NodeList — список фиксируется в момент запроса. `getElementsByClassName` возвращает **живую** HTMLCollection, которая обновляется при изменении DOM. На горячих участках живые коллекции обходить опасно: каждое обращение к `.length` может пересобрать список.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// childNodes vs children
const ul = document.querySelector('ul');
ul.children;     // только Element-узлы (HTMLCollection)
ul.childNodes;   // ВСЕ узлы: элементы + текстовые (даже whitespace) + комментарии

// nodeType
Node.ELEMENT_NODE;  // 1
Node.TEXT_NODE;     // 3
Node.COMMENT_NODE;  // 8`,
        },
      ],
      flashcardIds: ['jsdom-f3'],
    },

    {
      id: 'events-phases',
      title: 'События: capture, target, bubble',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            'Когда пользователь кликает по элементу, браузер не просто вызывает обработчик на нём. Событие идёт по DOM в **три фазы**: **capture** — от `window` вниз к цели, **target** — на самой цели, **bubble** — обратно вверх до `window`. По умолчанию обработчики, добавленные через `addEventListener`, срабатывают на фазе bubble.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Третий аргумент addEventListener — capture (или объект опций)
el.addEventListener('click', fn, true);            // capture
el.addEventListener('click', fn, false);           // bubble (default)
el.addEventListener('click', fn, { capture: true }); // то же, что true

// Опции addEventListener:
el.addEventListener('click', fn, {
  capture: false,
  once: true,      // удалить обработчик после первого срабатывания
  passive: true,   // обещание не вызывать preventDefault → браузер не ждёт
  signal: ac.signal, // отвязать через AbortController
});`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            '`event.target` — элемент, **на котором произошло** событие (источник). `event.currentTarget` — элемент, **на котором висит** обработчик. В стрелочных функциях `this` равен внешнему контексту, в обычных — `event.currentTarget`.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// HTML: <ul id="list"><li><span>item</span></li></ul>
list.addEventListener('click', function (e) {
  console.log(e.target.tagName);       // 'SPAN' — куда кликнули
  console.log(e.currentTarget.tagName);// 'UL'   — на ком обработчик
  console.log(this === e.currentTarget); // true — для обычной функции
});`,
        },
        { type: 'heading', content: 'stopPropagation vs preventDefault' },
        {
          type: 'list',
          content: `- **\`event.preventDefault()\`** — отменяет действие браузера по умолчанию (переход по ссылке, отправка формы, прокрутка по пробелу). Распространение события **не останавливает**.
- **\`event.stopPropagation()\`** — прекращает дальнейшее распространение. Обработчики на родителях не вызовутся, но другие обработчики **на этом же элементе** ещё сработают.
- **\`event.stopImmediatePropagation()\`** — то же + блокирует остальные обработчики на этом же элементе.
- В jQuery \`return false\` из обработчика = \`preventDefault + stopPropagation\`. В нативном API — это разные вещи.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// HTML: <a id="link" href="/page">Click me</a>
link.addEventListener('click', (e) => {
  e.preventDefault();   // не уходим по ссылке
  e.stopPropagation();  // document не получит событие
  console.log('clicked');
});

document.addEventListener('click', () => console.log('document'));
// Кликают по link → выводится только 'clicked'`,
        },
      ],
      flashcardIds: ['jsdom-f2', 'jsdom-f5'],
      checkpoint: [Q['jsdom-q1']!, Q['jsdom-q6']!, Q['jsdom-q4']!],
    },

    {
      id: 'delegation',
      title: 'Делегирование событий',
      estimatedMinutes: 7,
      blocks: [
        {
          type: 'text',
          content:
            '**Делегирование** — паттерн, в котором один обработчик на общем предке обслуживает события от множества дочерних элементов. Это работает благодаря фазе всплытия: событие, начавшись на `<li>`, по очереди проходит через всех предков и попадает на `<ul>`, где висит обработчик.',
        },
        {
          type: 'list',
          content: `- **Меньше памяти.** Один обработчик вместо N — особенно ощутимо на списках 1000+ элементов.
- **Работает для динамических элементов.** Добавили \`<li>\` через \`appendChild\` — обработчик уже работает, переподписываться не нужно.
- **Один источник правды.** Проще поддерживать, логировать, отлаживать.`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// ❌ N обработчиков — каждый держит своё замыкание
document.querySelectorAll('.btn').forEach((btn) => {
  btn.addEventListener('click', handleClick);
});

// ✅ Один обработчик на родителе
document.querySelector('.button-group').addEventListener('click', (e) => {
  // closest идёт от e.target вверх до first match (включая сам target)
  const btn = e.target.closest('.btn');
  if (!btn) return;            // клик мимо кнопки — игнорируем
  if (!e.currentTarget.contains(btn)) return; // защита от чужих кнопок
  handleClick(btn);
});`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Используйте `e.target.closest(selector)` вместо `e.target.matches(selector)`. Если внутри `<li>` лежит `<span>`, прямой `matches` на target вернёт false — а `closest` поднимется до ближайшего `<li>`.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// data-action — удобный способ диспетчеризации
list.addEventListener('click', (e) => {
  const item = e.target.closest('[data-action]');
  if (!item) return;
  const action = item.dataset.action; // 'delete' | 'edit' | 'open'
  handlers[action]?.(item);
});`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Не все события всплывают: `focus`, `blur`, `mouseenter`, `mouseleave` по умолчанию **не всплывают**. Для делегирования fokus используйте `focusin`/`focusout` или установите `capture: true`.',
        },
      ],
      playground: {
        starterCode: `// Реализуйте делегирование: один обработчик на ul
// должен выводить data-id того <li>, по которому кликнули.
// HTML (виртуальный):
//   <ul id="list">
//     <li data-id="1"><span>One</span></li>
//     <li data-id="2"><span>Two</span></li>
//   </ul>

const ul = document.createElement('ul');
ul.innerHTML = '<li data-id="1"><span>One</span></li><li data-id="2"><span>Two</span></li>';

ul.addEventListener('click', (e) => {
  // ваш код: найти ближайший li и вывести его data-id
});

// Эмулируем клик на <span> внутри <li data-id="2">
const span = ul.querySelector('li[data-id="2"] span');
span.dispatchEvent(new MouseEvent('click', { bubbles: true }));`,
        expectedOutput: '2',
        description:
          'Используйте closest, чтобы найти li даже когда e.target — это вложенный span. Это типовая задача с собеседования.',
      },
      flashcardIds: ['jsdom-f1'],
      checkpoint: [Q['jsdom-q9']!],
    },

    {
      id: 'custom-events-observer',
      title: 'CustomEvent и MutationObserver',
      estimatedMinutes: 5,
      blocks: [
        {
          type: 'text',
          content:
            'Кроме встроенных событий браузер позволяет создавать свои — через `CustomEvent`. Поле `detail` несёт произвольные данные, флаги `bubbles` и `cancelable` управляют распространением и возможностью отмены.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const event = new CustomEvent('user:login', {
  detail: { userId: 42, name: 'Alice' },
  bubbles: true,
  cancelable: true,
});

document.addEventListener('user:login', (e) => {
  console.log(e.detail.name); // 'Alice'
});

document.dispatchEvent(event);`,
        },
        {
          type: 'text',
          content:
            '`MutationObserver` — асинхронный наблюдатель за изменениями DOM. Колбэк вызывается на микрозадачах после серии мутаций — браузер сам батчит изменения, поэтому несколько `appendChild` подряд обычно дают **один** вызов с массивом мутаций.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `const observer = new MutationObserver((mutations) => {
  for (const m of mutations) {
    if (m.type === 'childList') console.log('children changed');
    if (m.type === 'attributes') console.log('attr', m.attributeName);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeOldValue: true,
});

observer.disconnect(); // когда больше не нужен`,
        },
        {
          type: 'callout',
          calloutType: 'info',
          content:
            'Для отслеживания появления элементов в области видимости используйте `IntersectionObserver` (lazy-load изображений, бесконечная прокрутка) — он эффективнее, чем обработчик `scroll`.',
        },
      ],
    },

    {
      id: 'performance',
      title: 'Layout, reflow и батчинг операций',
      estimatedMinutes: 8,
      blocks: [
        {
          type: 'text',
          content:
            'Каждое изменение размера, позиции или содержимого DOM может вызвать **reflow** (пересчёт раскладки) и **repaint** (перерисовку). Reflow синхронный и дорогой: чем больше дерево, тем дольше. Худшее, что можно сделать — чередовать чтения и записи в цикле.',
        },
        { type: 'heading', content: 'Layout thrashing' },
        {
          type: 'code',
          language: 'javascript',
          content: `// ❌ Layout thrashing — N reflow вместо 1
for (const el of elements) {
  const h = el.offsetHeight;        // READ форсирует layout
  el.style.height = (h * 2) + 'px'; // WRITE инвалидирует layout
  // следующий offsetHeight снова форсирует пересчёт!
}

// ✅ Сначала все READ, потом все WRITE
const heights = elements.map((el) => el.offsetHeight); // батч чтений
elements.forEach((el, i) => {
  el.style.height = heights[i] * 2 + 'px';             // батч записей
});`,
        },
        {
          type: 'callout',
          calloutType: 'warning',
          content:
            'Геометрические свойства, форсирующие layout: `offsetTop/Left/Width/Height`, `client*`, `scroll*`, `getBoundingClientRect()`, `getComputedStyle()`. Чтение любого из них после записи стиля вызовет немедленный reflow.',
        },
        { type: 'heading', content: 'DocumentFragment для пакетной вставки' },
        {
          type: 'code',
          language: 'javascript',
          content: `const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li');
  li.textContent = 'Item ' + i;
  fragment.appendChild(li); // в фрагменте, не в DOM
}
list.appendChild(fragment); // один reflow вместо 1000`,
        },
        { type: 'heading', content: 'requestAnimationFrame' },
        {
          type: 'text',
          content:
            'Анимации через `setTimeout(fn, 16)` рассинхронизированы с кадрами браузера. `requestAnimationFrame(cb)` гарантирует вызов перед очередной отрисовкой — кадр не пропустится, и батч изменений применится единым reflow.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `function tick() {
  el.style.transform = 'translateX(' + x++ + 'px)';
  if (x < 200) requestAnimationFrame(tick);
}
requestAnimationFrame(tick);`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'XSS-безопасность: `innerHTML = userInput` парсит HTML и может выполнить вредоносный код. Используйте `textContent` для текста и `createElement + setAttribute` для разметки. Для трастового HTML — DOMPurify или новый `Sanitizer API`.',
        },
      ],
      playground: {
        starterCode: `// Перепишите цикл так, чтобы избежать layout thrashing.
// Реализуйте функцию doubleHeights(elements), которая удваивает
// высоту каждого элемента БЕЗ чередования read/write.

function doubleHeights(elements) {
  // ваш код
}

// Эмулятор:
const elems = [
  { offsetHeight: 10, style: {} },
  { offsetHeight: 20, style: {} },
  { offsetHeight: 30, style: {} },
];
doubleHeights(elems);
console.log(elems.map((e) => e.style.height).join(','));`,
        expectedOutput: '20px,40px,60px',
        description:
          'Сначала прочитайте все offsetHeight в массив, потом одним проходом запишите style.height. Это снимает layout thrashing.',
      },
      flashcardIds: ['jsdom-f4'],
      checkpoint: [Q['jsdom-q11']!],
    },
  ],

  // Все вопросы из старого квиза, кроме тех, что ушли в checkpoint.
  finalQuiz: jsDomQuiz.questions.filter((q) => !CHECKPOINT_IDS.has(q.id)),

  // Реюзаем существующие карточки.
  flashcards: jsDomFlashcards.cards,

  cheatsheet: `### Шпаргалка по DOM и событиям

- DOM — дерево объектов. Не путать с исходным HTML: парсер нормализует, скрипты могут менять.
- Поиск: \`getElementById\` (O(1)) → \`querySelector(All)\` (CSS) → \`closest\` (вверх по дереву).
- Создание: \`createElement\` + \`textContent\` безопаснее, чем \`innerHTML\` (XSS).
- Фазы события: **capture** → **target** → **bubble**. Третий аргумент addEventListener — capture.
- \`event.target\` — где случилось; \`event.currentTarget\` — где висит обработчик.
- \`preventDefault\` ≠ \`stopPropagation\`. Первое отменяет дефолт, второе блокирует распространение.
- Делегирование: один обработчик на родителе + \`closest(selector)\`. Меньше памяти, работает для новых элементов.
- Не всплывают: focus/blur/mouseenter/mouseleave (используйте focusin/focusout или capture).
- Опции \`addEventListener\`: \`once\`, \`passive\`, \`capture\`, \`signal\` (AbortController).
- Layout thrashing: чередование read (offsetHeight) и write (style) в цикле. Решение — батчить.
- Пакетная вставка: \`DocumentFragment\` → один reflow вместо N.
- Анимации: \`requestAnimationFrame\`, не \`setTimeout\`.
- \`MutationObserver\` асинхронен, \`IntersectionObserver\` для видимости.`,

  interviewQA: [
    {
      id: 'jsdom-iq1',
      question: 'Опишите три фазы события: capture, target, bubble. Как их контролировать?',
      shortAnswer:
        'Событие проходит сверху вниз (capture), достигает цели (target), затем поднимается обратно (bubble). По умолчанию обработчики срабатывают на bubble; третий аргумент addEventListener=true переключает на capture.',
      fullAnswer: `Когда пользователь кликает по элементу, браузер не просто вызывает обработчик «на нём». Событие проходит через DOM в три последовательные фазы:

1. **Capture (погружение).** Событие движется от \`window\` через всех предков вниз к целевому элементу. Обработчики, добавленные с третьим аргументом \`true\` или \`{ capture: true }\`, срабатывают именно здесь.
2. **Target.** Событие достигает элемента-цели. Обработчики, добавленные на саму цель, вызываются независимо от того, capture они или bubble.
3. **Bubble (всплытие).** Событие поднимается обратно вверх до \`window\`. Обработчики без флага capture срабатывают здесь — это поведение по умолчанию.

Контроль: \`event.stopPropagation()\` прекращает дальнейшее движение по дереву (но обработчики, уже стоящие в очереди на текущем элементе, выполнятся). \`event.stopImmediatePropagation()\` дополнительно блокирует другие обработчики на том же элементе. \`event.preventDefault()\` отменяет действие браузера, но фазы события идут как обычно.

Не все события поддерживают всплытие: \`focus\`, \`blur\`, \`mouseenter\`, \`mouseleave\` по умолчанию не всплывают. Для делегирования таких событий используйте \`focusin\`/\`focusout\` или регистрируйте обработчик на фазе capture.`,
      followUps: [
        'Как событие ведёт себя в Shadow DOM?',
        'Что произойдёт, если несколько обработчиков подписаны на один и тот же элемент и фазу?',
      ],
      relatedChapterId: 'events-phases',
    },
    {
      id: 'jsdom-iq2',
      question: 'Что такое делегирование событий и зачем оно нужно?',
      shortAnswer:
        'Делегирование — один обработчик на общем предке вместо обработчиков на каждом дочернем элементе. Опирается на фазу всплытия и решает три задачи: меньше памяти, работа для динамических элементов, единая точка диспетчеризации.',
      fullAnswer: `Делегирование событий — паттерн, в котором обработчик регистрируется не на каждом дочернем элементе, а на их общем предке. Внутри обработчика мы определяем настоящий источник события через \`event.target\` и часто используем \`closest(selector)\`, чтобы найти ближайшего предка нужного типа.

\`\`\`js
list.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  handlers[btn.dataset.action]?.(btn);
});
\`\`\`

Зачем это нужно:
- **Память и инициализация.** На таблице из 10 000 строк один обработчик вместо десяти тысяч. Каждое \`addEventListener\` — это объект с замыканием в памяти.
- **Динамика.** Любой \`<li>\`, добавленный через \`appendChild\` после регистрации обработчика, сразу обслуживается без переподписки.
- **Единая логика.** Один обработчик легче логировать, отлаживать и снимать через \`AbortController\`.

Подводные камни. События \`focus\`, \`blur\`, \`mouseenter\`, \`mouseleave\` не всплывают — для них берут \`focusin\`/\`focusout\` или фазу capture. На \`<form>\` со вложенными подформами стоит проверять \`event.currentTarget.contains(target)\`, чтобы не обрабатывать чужие клики.`,
      followUps: [
        'Чем closest лучше прямой проверки event.target.matches?',
        'Когда делегирование вредно или избыточно?',
      ],
      relatedChapterId: 'delegation',
    },
    {
      id: 'jsdom-iq3',
      question: 'Чем addEventListener отличается от свойства onclick?',
      shortAnswer:
        'addEventListener позволяет несколько обработчиков на одно событие, поддерживает фазу capture и опции (once, passive, signal). Свойство onclick хранит только один обработчик и вызывается только на bubble.',
      fullAnswer: `Различия лежат сразу в нескольких плоскостях.

**Множественность.** \`element.onclick = fn\` — это присваивание свойства, поэтому второе присваивание затрёт первое. \`addEventListener\` хранит список и позволяет повесить сколько угодно независимых обработчиков.

**Фаза.** \`onclick\` всегда срабатывает на фазе bubble. \`addEventListener\` принимает третий аргумент или объект опций — можно подписаться на capture, что важно для делегирования невсплывающих событий.

**Опции.** В addEventListener доступны \`once\` (автоудаление после первого срабатывания), \`passive\` (обещание не вызывать preventDefault — без этого браузеры на touch-событиях ждут синхронной отработки и страдает скролл), \`signal\` (отвязка через AbortController) и \`capture\`.

**Снятие.** \`element.onclick = null\` снимает обработчик. У addEventListener нужно передать в \`removeEventListener\` ту же ссылку на функцию — стрелочная функция, созданная заново, не подойдёт.

**this.** В обоих случаях \`this\` равен \`event.currentTarget\`, если функция не стрелочная. У стрелочной функции \`this\` лексический, что часто становится источником багов.

В современном коде \`onclick\` остаётся только в очень простых сценариях и в JSX (где это синтаксический сахар над addEventListener).`,
      followUps: [
        'Что такое passive listeners и почему Chrome ругается на их отсутствие?',
        'Как AbortController помогает снимать сразу пачку обработчиков?',
      ],
      relatedChapterId: 'events-phases',
    },
    {
      id: 'jsdom-iq4',
      question: 'Что вызывает layout thrashing и как его избежать?',
      shortAnswer:
        'Layout thrashing — серия принудительных reflow из-за чередования чтений геометрии и записей стилей в цикле. Лечится группировкой: сначала все READ, потом все WRITE. Дополнительно — DocumentFragment для пакетной вставки и requestAnimationFrame для анимаций.',
      fullAnswer: `Браузер старается отложить reflow до конца текущей задачи: сгруппировать все изменения стилей и пересчитать раскладку один раз. Но при чтении геометрических свойств (\`offsetTop/Width/Height\`, \`clientWidth\`, \`getBoundingClientRect\`, \`getComputedStyle\` и т.п.) он обязан выполнить пересчёт **синхронно**, потому что значение зависит от актуальной раскладки.

\`\`\`js
// ❌ N reflow
for (const el of elements) {
  const h = el.offsetHeight;            // READ — форсирует layout
  el.style.height = h * 2 + 'px';       // WRITE — инвалидирует layout
}
\`\`\`

После записи следующий \`offsetHeight\` снова требует пересчёта. На 1000 элементов это 1000 reflow.

**Решение** — разделить чтения и записи:

\`\`\`js
// 1. собираем все размеры
const heights = elements.map((el) => el.offsetHeight);
// 2. одним проходом пишем
elements.forEach((el, i) => (el.style.height = heights[i] * 2 + 'px'));
\`\`\`

Дополнительные приёмы:
- **DocumentFragment** для вставки множества узлов — один reflow вместо N.
- **requestAnimationFrame** для анимаций — браузер сам сгруппирует изменения с кадром.
- **CSS transform/opacity** вместо top/left/width/height — эти свойства не вызывают reflow и часто обрабатываются на GPU (composited layer).
- **will-change** или \`transform: translateZ(0)\` — подсказка браузеру вынести элемент в отдельный слой.

Профилирование: вкладка Performance в Chrome DevTools покажет фиолетовые блоки «Layout» и предупреждения о принудительных reflow.`,
      followUps: [
        'Какие CSS-свойства анимируются без reflow?',
        'Как ContentVisibility и contain помогают изолировать пересчёт?',
      ],
      relatedChapterId: 'performance',
    },
    {
      id: 'jsdom-iq5',
      question: 'В чём разница между event.target и event.currentTarget?',
      shortAnswer:
        'event.target — элемент, на котором событие изначально произошло. event.currentTarget — элемент, на котором сейчас вызван обработчик. В делегировании target — это конкретный «лист», currentTarget — общий родитель.',
      fullAnswer: `Внутри обработчика доступны два разных свойства, и путать их — типичная ошибка.

**event.target** — элемент-источник. Если пользователь кликнул по \`<span>\` внутри \`<li>\`, то \`event.target\` — это именно \`<span>\`, даже если обработчик висит выше.

**event.currentTarget** — элемент, на котором зарегистрирован выполняющийся сейчас обработчик. Он совпадает с \`this\` для обычных функций (не стрелочных). Когда событие всплывает, currentTarget меняется на каждом уровне, а target остаётся тем же.

Практический пример с делегированием:

\`\`\`js
// HTML: <ul><li><span>Item</span></li></ul>
ul.addEventListener('click', (e) => {
  e.target;        // <span> — где кликнули
  e.currentTarget; // <ul> — где висит обработчик
  const li = e.target.closest('li'); // ищем «логический» элемент
});
\`\`\`

Когда что использовать:
- **target** — когда вы хотите узнать конкретный «лист», по которому кликнули. Сюда же относится \`closest\` для поиска ближайшего предка.
- **currentTarget** — когда нужно сослаться на «контейнер». Особенно полезно, если один и тот же обработчик регистрируется на нескольких элементах и нужно отличать их.

Стрелочные функции не имеют собственного \`this\`, поэтому если вы хотите получить элемент-обработчик, всегда используйте \`event.currentTarget\` — это надёжнее.`,
      followUps: [
        'Что такое event.relatedTarget и для каких событий он есть?',
        'Что выведет event.target внутри обработчика, поднявшегося в фазе capture?',
      ],
      relatedChapterId: 'events-phases',
    },
    {
      id: 'jsdom-iq6',
      question: 'Зачем нужны DocumentFragment и requestAnimationFrame?',
      shortAnswer:
        'DocumentFragment — буфер для пакетной вставки множества узлов одним reflow. requestAnimationFrame синхронизирует изменения с кадром браузера и группирует их перед отрисовкой.',
      fullAnswer: `**DocumentFragment** — это лёгкий контейнер-узел без привязки к документу. Манипуляции с ним не вызывают reflow, потому что он не на странице. При \`parent.appendChild(fragment)\` все его дети **переезжают** в parent одной операцией.

\`\`\`js
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li');
  li.textContent = 'Item ' + i;
  fragment.appendChild(li);
}
list.appendChild(fragment); // один reflow
\`\`\`

Альтернативы — \`element.append(...nodes)\` принимает несколько аргументов сразу и тоже даёт один reflow; библиотеки типа React работают через viewdom-diff.

**requestAnimationFrame** даёт колбэк, который браузер вызовет перед очередной отрисовкой — обычно 60 раз в секунду. Все изменения, сделанные в колбэке, попадают в один кадр без промежуточных reflow.

\`\`\`js
function step(ts) {
  el.style.transform = 'translateX(' + (x += 1) + 'px)';
  if (x < 200) requestAnimationFrame(step);
}
requestAnimationFrame(step);
\`\`\`

Преимущества перед \`setTimeout(fn, 16)\`:
- Синхронизирован с частотой обновления экрана (на ноутбуке 60 Гц, на ProMotion 120 Гц).
- Не выполняется в неактивных вкладках — экономит батарею.
- Естественно вписывается в pipeline рендеринга: \`scripting → style → layout → paint → composite\`.

Дополнительный приём — \`requestIdleCallback\` для низкоприоритетной работы между кадрами.`,
      followUps: [
        'Чем requestAnimationFrame отличается от requestIdleCallback?',
        'Когда полезен MessageChannel для шедулинга задач?',
      ],
      relatedChapterId: 'performance',
    },
    {
      id: 'jsdom-iq7',
      question: 'Чем innerHTML опасен и какие есть альтернативы?',
      shortAnswer:
        'innerHTML парсит произвольную HTML-строку, поэтому при вставке пользовательских данных открывает XSS. Альтернативы: textContent, createElement+setAttribute, шаблонные движки с экранированием, Sanitizer API или DOMPurify.',
      fullAnswer: `Свойство \`innerHTML\` принимает строку и парсит её как HTML. Если в строке окажется \`<img src=x onerror="alert(1)">\` или скрипт-вставка через \`<svg onload>\`, браузер выполнит атакующий код в контексте сайта.

\`\`\`js
// ❌ XSS, если userInput пришёл из URL/комментария
el.innerHTML = '<div>' + userInput + '</div>';
\`\`\`

Безопасные альтернативы:

1. **textContent** для текста — теги превращаются в литералы, ничего не выполняется.
2. **createElement + setAttribute + appendChild** — программная сборка дерева, нет парсинга.
3. **Шаблоны с автоэкранированием** — JSX (React), template-engine с \`{{ value }}\`, lit-html.
4. **DOMPurify** — самая популярная библиотека-санитайзер; превращает «грязный» HTML в безопасный по белому списку тегов и атрибутов.
5. **Sanitizer API** (\`element.setHTML(str, { sanitizer })\`) — встроенный API, постепенно появляющийся в браузерах. Нужно проверять поддержку.

Дополнительно стоит включить **Content Security Policy** на сервере: \`script-src 'self'\` блокирует инлайновые скрипты и сильно ослабляет последствия XSS.

Скорость. \`innerHTML\` иногда быстрее, чем серия \`appendChild\`, потому что один парсинг + одно построение дерева. Но для пользовательского ввода это не аргумент: безопасность важнее.`,
      followUps: [
        'Чем insertAdjacentHTML отличается от innerHTML?',
        'Как CSP защищает от XSS и какие у него ограничения?',
      ],
      relatedChapterId: 'performance',
    },
  ],

  nextTopics: [
    {
      slug: 'js-network',
      reason:
        'Реальные DOM-приложения общаются с сервером через fetch — следующий шаг после освоения событий.',
    },
    {
      slug: 'js-browser',
      reason:
        'Critical Rendering Path и пайплайн reflow/repaint объясняют, почему делегирование и батчинг ускоряют интерфейс.',
    },
  ],

  related: [
    { kind: 'bug-hunt', id: 'bh-dom-1', label: 'Bug hunt: removeEventListener не снимает обработчик' },
  ],
};
