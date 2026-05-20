import type { TopicQuiz } from '../../types/quiz';

export const jsDomQuiz: TopicQuiz = {
  topicId: 'js-dom',
  questions: [
    {
      type: 'output',
      id: 'jsdom-q1',
      description: 'Порядок событий: bubbling. Что выведет код?',
      code: `// HTML: <div id="outer"><div id="inner">click</div></div>
outer.addEventListener('click', () => console.log('outer'));
inner.addEventListener('click', () => console.log('inner'));

// Пользователь кликает на #inner`,
      options: ['inner, outer', 'outer, inner', 'только inner', 'только outer'],
      correctIndex: 0,
      explanation: 'По умолчанию обработчики срабатывают в фазе **bubbling** (всплытие). Событие начинается на цели (#inner), затем всплывает вверх. Порядок: inner → outer.',
    },
    {
      type: 'fill-blank',
      id: 'jsdom-q2',
      description: 'Заполните пропуск для реализации делегирования событий.',
      codeWithBlanks: `list.addEventListener('click', (e) => {
  const item = e.target.___BLANK___('.list-item');
  if (item) handleClick(item);
});`,
      options: ['closest', 'querySelector', 'parentElement', 'getAttribute'],
      correctIndex: 0,
      explanation: '`e.target.closest(".list-item")` поднимается по DOM вверх от e.target, пока не найдёт элемент, соответствующий selector. Это позволяет обрабатывать клики на вложенных дочерних элементах, находя ближайший родительский `.list-item`.',
    },
    {
      type: 'output',
      id: 'jsdom-q3',
      description: 'stopPropagation vs preventDefault. Что произойдёт?',
      code: `// HTML: <a id="link" href="/page">Click me</a>
link.addEventListener('click', (e) => {
  e.preventDefault();  // (1)
  e.stopPropagation(); // (2)
  console.log('clicked');
});

document.addEventListener('click', () => console.log('document'));`,
      options: [
        '"clicked" выводится, переход не происходит, document не получает событие',
        '"clicked" выводится, переход происходит, document не получает событие',
        '"clicked" не выводится',
        '"clicked" и "document" выводятся, переход не происходит',
      ],
      correctIndex: 0,
      explanation: '(1) `preventDefault()` отменяет поведение браузера по умолчанию — переход по ссылке не произойдёт. (2) `stopPropagation()` останавливает всплытие — document не получит событие. Сам обработчик на ссылке выполняется: "clicked" выводится.',
    },
    {
      type: 'output',
      id: 'jsdom-q4',
      description: 'e.target vs e.currentTarget. Что выведет код?',
      code: `// HTML: <ul id="list"><li>item</li></ul>
list.addEventListener('click', (e) => {
  console.log(e.target.tagName);
  console.log(e.currentTarget.tagName);
});

// Пользователь кликает на <li>`,
      options: ['"LI" и "UL"', '"UL" и "LI"', '"LI" и "LI"', '"UL" и "UL"'],
      correctIndex: 0,
      explanation: '`e.target` — элемент, на котором **произошло** событие (LI — куда кликнули). `e.currentTarget` — элемент, на котором **установлен** обработчик (UL). В делегировании событий эта разница критически важна.',
    },
    {
      type: 'fill-blank',
      id: 'jsdom-q5',
      description: 'Заполните пропуск: какой метод создаёт виртуальный контейнер для батчинга DOM-операций?',
      codeWithBlanks: `const fragment = document.___BLANK___();
items.forEach((text) => {
  const li = document.createElement('li');
  li.textContent = text;
  fragment.appendChild(li);
});
list.appendChild(fragment); // один reflow вместо N`,
      options: ['createDocumentFragment', 'createElement', 'createNode', 'createRange'],
      correctIndex: 0,
      explanation: '`document.createDocumentFragment()` создаёт DocumentFragment — лёгкий DOM-узел без привязки к документу. Манипуляции с ним не вызывают reflow. При `list.appendChild(fragment)` все дочерние узлы переносятся одной операцией → 1 reflow вместо N. Альтернатива: `innerHTML` (но опасно XSS).',
    },
    {
      type: 'output',
      id: 'jsdom-q6',
      description: 'capture фаза. Что выведет код?',
      code: `// HTML: <div id="outer"><button id="btn">click</button></div>
outer.addEventListener('click', () => console.log('outer-capture'), true);
outer.addEventListener('click', () => console.log('outer-bubble'));
btn.addEventListener('click', () => console.log('btn'));

// Кликают на #btn`,
      options: ['outer-capture, btn, outer-bubble', 'btn, outer-capture, outer-bubble', 'outer-bubble, btn, outer-capture', 'outer-capture, outer-bubble, btn'],
      correctIndex: 0,
      explanation: 'Порядок фаз: capture (сверху вниз) → target → bubble (снизу вверх). outer-capture в фазе capture (третий аргумент true). btn на таргете. outer-bubble в фазе bubble. Итог: outer-capture → btn → outer-bubble.',
    },
    {
      type: 'output',
      id: 'jsdom-q7',
      description: 'MutationObserver. Что произойдёт при выполнении кода?',
      code: `const observer = new MutationObserver((mutations) => {
  console.log('мутации:', mutations.length);
});

observer.observe(document.body, { childList: true });

document.body.appendChild(document.createElement('div'));
document.body.appendChild(document.createElement('span'));
// callback сработает...`,
      options: [
        'Один раз с 2 мутациями (или дважды с 1 мутацией)',
        'Никогда — только для атрибутов',
        'Два раза, по одной мутации каждый раз',
        'Сразу синхронно при каждом appendChild',
      ],
      correctIndex: 0,
      explanation: 'MutationObserver работает асинхронно через микрозадачи. Браузер может батчить несколько мутаций в один callback-вызов. Обычно при синхронных appendChilds подряд — один вызов с 2 мутациями. Но это implementation-specific.',
    },
    {
      type: 'output',
      id: 'jsdom-q8',
      description: 'CustomEvent и detail. Что выведет код?',
      code: `document.addEventListener('app:ready', (e) => {
  console.log(e.detail.version);
  console.log(e.bubbles);
});

document.dispatchEvent(new CustomEvent('app:ready', {
  detail: { version: '2.0' },
  bubbles: false,
}));`,
      options: ['"2.0" и false', '"2.0" и true', 'undefined и false', 'Error'],
      correctIndex: 0,
      explanation: 'CustomEvent передаёт кастомные данные через `detail`. e.detail.version = "2.0". `bubbles: false` — событие не всплывает (хотя здесь это неважно, т.к. обработчик на document). Вывод: "2.0" и false.',
    },
    {
      type: 'tracing',
      id: 'jsdom-q9',
      description: 'Проследите делегирование события с closest.',
      code: `// HTML:
// <ul id="list">
//   <li data-id="1"><span>Item 1</span></li>
//   <li data-id="2"><span>Item 2</span></li>
// </ul>

list.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (li) console.log('id:', li.dataset.id);
});

// Пользователь кликает на <span> внутри первого <li>`,
      steps: [
        { label: 'Клик на <span> внутри <li data-id="1">', variables: { 'e.target': '<span>' } },
        { label: 'e.target.closest("li")', variables: { 'ищем вверх': '<span> → <li data-id="1">', найдено: 'да' } },
        { label: 'li.dataset.id', variables: { значение: '"1"' } },
      ],
      question: 'Что выведет обработчик?',
      options: ['"id: 1"', '"id: undefined"', 'ничего (closest не найдёт li)', '"id: 2"'],
      correctIndex: 0,
      explanation: '`e.target` — это span (куда кликнули). `closest("li")` ищет вверх по DOM: span → li[data-id="1"] (найдено!). `li.dataset.id = "1"`. Вывод: "id: 1". Именно поэтому closest лучше прямой проверки e.target — работает для вложенных структур.',
    },
    {
      type: 'output',
      id: 'jsdom-q10',
      description: 'requestAnimationFrame. Когда выполнится callback?',
      code: `console.log('1');
requestAnimationFrame(() => console.log('2'));
Promise.resolve().then(() => console.log('3'));
console.log('4');`,
      options: ['1, 4, 3, 2', '1, 2, 4, 3', '1, 4, 2, 3', '2, 1, 4, 3'],
      correctIndex: 0,
      explanation: 'rAF-callback выполняется перед следующим кадром рендеринга — после всех задач текущего "тика". Порядок: "1" (sync) → "4" (sync) → "3" (microtask) → "2" (rAF, макрозадача-ish). rAF выполняется после микрозадач.',
    },
    {
      type: 'fill-blank',
      id: 'jsdom-q11',
      description: 'Предотвратите layout thrashing.',
      codeWithBlanks: `// ❌ Плохо: read-write-read-write в цикле
// ✅ Хорошо: сначала все READ, потом все WRITE
const heights = elements.map(el => el.___BLANK___);
elements.forEach((el, i) => {
  el.style.height = (heights[i] * 2) + 'px';
});`,
      options: ['offsetHeight', 'style.height', 'clientHeight', 'scrollHeight'],
      correctIndex: 0,
      explanation: '`offsetHeight` — геометрическое свойство, которое **принудительно вызывает reflow** при чтении (если DOM был изменён). Правило: группируйте все чтения offsetHeight/offsetWidth/getBoundingClientRect перед записями style. Иначе каждая запись + последующее чтение = лишний reflow.',
    },
    {
      type: 'output',
      id: 'jsdom-q12',
      description: 'once: обработчик только один раз. Что выведет код?',
      code: `btn.addEventListener('click', () => console.log('clicked'), { once: true });

btn.click();
btn.click();
btn.click();`,
      options: ['clicked (1 раз)', 'clicked clicked clicked (3 раза)', 'ничего', 'Error'],
      correctIndex: 0,
      explanation: '`{ once: true }` — опция addEventListener, которая автоматически удаляет обработчик после первого срабатывания. После первого `btn.click()` обработчик удаляется. Следующие два клика не вызывают его. Вывод: "clicked" один раз.',
    },
  ],
};
