import type { Problem } from '../../types/problem';

export const jsDomProblems: Problem[] = [
  {
    id: 'jsdom-p1',
    topicId: 'js-dom',
    title: 'createElement по описанию',
    difficulty: 'easy',
    isContextual: false,
    description: `Напишите функцию \`createElement(descriptor)\`, которая создаёт DOM-элемент по описанию объекта:
\`\`\`ts
{
  tag: string,
  attrs?: Record<string, string>,
  children?: (string | descriptor)[],
}
\`\`\`

Примеры:
\`\`\`
createElement({
  tag: 'div',
  attrs: { class: 'card', 'data-id': '1' },
  children: [
    'Hello, ',
    { tag: 'strong', children: ['World'] },
  ],
});
// → <div class="card" data-id="1">Hello, <strong>World</strong></div>
\`\`\``,
    functionName: 'createElement_test',
    starterCode: `function createElement(descriptor) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsdom-p1-t1',
        inputDisplay: 'createElement({ tag: "div" }) → <div>',
        inputArgs: ['simple-tag'],
        expected: 'DIV',
      },
      {
        id: 'jsdom-p1-t2',
        inputDisplay: 'attrs применяются корректно',
        inputArgs: ['with-attrs'],
        expected: 'text',
      },
      {
        id: 'jsdom-p1-t3',
        inputDisplay: 'текстовые children добавляются',
        inputArgs: ['text-child'],
        expected: 'hello',
      },
      {
        id: 'jsdom-p1-t4',
        inputDisplay: 'вложенные дочерние элементы',
        inputArgs: ['nested-element'],
        expected: 1,
      },
      {
        id: 'jsdom-p1-t5',
        inputDisplay: 'смешанные children: строки и элементы',
        inputArgs: ['mixed-children'],
        expected: 2,
      },
    ],
    hints: [
      'Создайте элемент: `const el = document.createElement(descriptor.tag)`.',
      'Добавьте атрибуты: `for (const [key, val] of Object.entries(attrs)) el.setAttribute(key, val)`.',
      'Рекурсивно обработайте children: если строка — `document.createTextNode(child)`, если объект — рекурсивный вызов `createElement(child)`.',
    ],
    solutionCode: `function createElement(descriptor) {
  const el = document.createElement(descriptor.tag);

  if (descriptor.attrs) {
    for (const [key, val] of Object.entries(descriptor.attrs)) {
      el.setAttribute(key, val);
    }
  }

  if (descriptor.children) {
    for (const child of descriptor.children) {
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child));
      } else {
        el.appendChild(createElement(child));
      }
    }
  }

  return el;
}`,
    testHelperCode: `function createElement_test(arg) {
  if (arg === 'simple-tag') return createElement({ tag: 'div' }).tagName;
  if (arg === 'with-attrs') return createElement({ tag: 'p', attrs: { class: 'text' } }).className;
  if (arg === 'text-child') return createElement({ tag: 'span', children: ['hello'] }).textContent;
  if (arg === 'nested-element') return createElement({ tag: 'div', children: [{ tag: 'strong', children: ['text'] }] }).childElementCount;
  if (arg === 'mixed-children') return createElement({ tag: 'p', children: ['a', { tag: 'b', children: ['b'] }] }).childNodes.length;
}`,
  },
  {
    id: 'jsdom-p2',
    topicId: 'js-dom',
    title: 'delegate — делегирование событий',
    difficulty: 'medium',
    isContextual: false,
    description: `Напишите функцию \`delegate(parent, selector, eventType, handler)\`:
- Добавляет один обработчик на \`parent\`
- \`handler\` вызывается только если клик произошёл на элементе, соответствующем \`selector\` (или его потомке)
- \`handler\` получает элемент, соответствующий \`selector\`, как \`this\` и как первый аргумент

Примеры:
\`\`\`
const list = document.querySelector('ul');
delegate(list, 'li', 'click', function(el) {
  el.classList.toggle('active');
});
// Один обработчик обслуживает все li, включая добавленные позже
\`\`\``,
    functionName: 'delegate_test',
    starterCode: `function delegate(parent, selector, eventType, handler) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsdom-p2-t1',
        inputDisplay: 'клик на соответствующем элементе → handler вызван',
        inputArgs: ['match-click'],
        expected: true,
      },
      {
        id: 'jsdom-p2-t2',
        inputDisplay: 'клик на несоответствующем → handler не вызван',
        inputArgs: ['no-match'],
        expected: false,
      },
      {
        id: 'jsdom-p2-t3',
        inputDisplay: 'handler получает правильный элемент',
        inputArgs: ['correct-element'],
        expected: 'LI',
      },
      {
        id: 'jsdom-p2-t4',
        inputDisplay: 'клик на потомке соответствующего элемента',
        inputArgs: ['child-click'],
        expected: true,
      },
      {
        id: 'jsdom-p2-t5',
        inputDisplay: 'обработчик добавлен на parent, не на children',
        inputArgs: ['parent-handler'],
        expected: true,
      },
    ],
    hints: [
      'Добавьте обработчик на `parent`. В нём: `const target = e.target.closest(selector)` — ищет ближайшего предка, соответствующего selector.',
      'Проверьте, что target не null и является потомком parent: `parent.contains(target)`.',
      'Вызовите `handler.call(target, target)` — передаём найденный элемент как this и аргумент.',
    ],
    solutionCode: `function delegate(parent, selector, eventType, handler) {
  parent.addEventListener(eventType, function(e) {
    const target = e.target.closest(selector);
    if (target && parent.contains(target)) {
      handler.call(target, target);
    }
  });
}`,
    testHelperCode: `function delegate_test(arg) {
  const parent = document.createElement('ul');
  const li = document.createElement('li');
  const div = document.createElement('div');
  const span = document.createElement('span');
  li.appendChild(span);
  parent.appendChild(li);
  parent.appendChild(div);
  document.body.appendChild(parent);
  let result;
  if (arg === 'match-click') {
    let called = false;
    delegate(parent, 'li', 'click', () => { called = true; });
    li.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    result = called;
  } else if (arg === 'no-match') {
    let called = false;
    delegate(parent, 'li', 'click', () => { called = true; });
    div.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    result = called;
  } else if (arg === 'correct-element') {
    let tagName = null;
    delegate(parent, 'li', 'click', (el) => { tagName = el.tagName; });
    li.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    result = tagName;
  } else if (arg === 'child-click') {
    let called = false;
    delegate(parent, 'li', 'click', () => { called = true; });
    span.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    result = called;
  } else if (arg === 'parent-handler') {
    delegate(parent, 'li', 'click', () => {});
    result = true;
  }
  document.body.removeChild(parent);
  return result;
}`,
  },
  {
    id: 'jsdom-p3',
    topicId: 'js-dom',
    title: 'serialize — данные формы в объект',
    difficulty: 'easy',
    isContextual: true,
    description: `Напишите функцию \`serialize(form)\`, которая принимает DOM-элемент формы и возвращает объект \`{ name: value }\` для всех заполненных полей.

Учитывать:
- \`input\`, \`textarea\`, \`select\`
- Поля без атрибута \`name\` — пропустить
- Поля disabled — пропустить
- Чекбоксы: включать только если checked, значение = value или "on"

Примеры:
\`\`\`
serialize(form) → { username: 'alice', age: '25', agree: 'on' }
\`\`\``,
    functionName: 'serialize_test',
    starterCode: `function serialize(form) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsdom-p3-t1',
        inputDisplay: 'input[name=username] → {username: "alice"}',
        inputArgs: ['text-input'],
        expected: { username: 'alice' },
      },
      {
        id: 'jsdom-p3-t2',
        inputDisplay: 'несколько полей → объект',
        inputArgs: ['multiple'],
        expected: { name: 'Alice', age: '30' },
      },
      {
        id: 'jsdom-p3-t3',
        inputDisplay: 'поле без name — пропускается',
        inputArgs: ['no-name'],
        expected: {},
      },
      {
        id: 'jsdom-p3-t4',
        inputDisplay: 'disabled поле — пропускается',
        inputArgs: ['disabled'],
        expected: {},
      },
      {
        id: 'jsdom-p3-t5',
        inputDisplay: 'checkbox checked → включается, unchecked → нет',
        inputArgs: ['checkbox'],
        expected: { agree: 'on' },
      },
    ],
    hints: [
      'Используйте `form.elements` — HTMLCollection всех полей формы.',
      'Для каждого поля: проверьте `el.name`, `el.disabled`, для checkbox — `el.checked`.',
      'Или используйте `new FormData(form)` → `Object.fromEntries(formData.entries())`.',
    ],
    solutionCode: `function serialize(form) {
  const result = {};
  for (const el of form.elements) {
    if (!el.name || el.disabled) continue;
    if ((el.type === 'checkbox' || el.type === 'radio') && !el.checked) continue;
    result[el.name] = el.value || 'on';
  }
  return result;
}`,
    testHelperCode: `function serialize_test(arg) {
  function makeForm(html) {
    const form = document.createElement('form');
    form.innerHTML = html;
    return form;
  }
  if (arg === 'text-input') {
    const form = makeForm('<input name="username" value="alice">');
    return serialize(form);
  }
  if (arg === 'multiple') {
    const form = makeForm('<input name="name" value="Alice"><input name="age" value="30">');
    return serialize(form);
  }
  if (arg === 'no-name') {
    const form = makeForm('<input value="alice">');
    return serialize(form);
  }
  if (arg === 'disabled') {
    const form = makeForm('<input name="username" value="alice" disabled>');
    return serialize(form);
  }
  if (arg === 'checkbox') {
    const form = makeForm('<input type="checkbox" name="agree" checked><input type="checkbox" name="newsletter">');
    return serialize(form);
  }
}`,
  },
  {
    id: 'jsdom-p4',
    topicId: 'js-dom',
    title: 'highlight — подсветить слово в тексте',
    difficulty: 'medium',
    isContextual: true,
    description: `Напишите функцию \`highlight(root, word)\`, которая находит все вхождения строки \`word\` в текстовых узлах внутри \`root\` и оборачивает их в элемент \`<mark>\`.

Ключевые требования:
- Работает только с текстовыми узлами (не атрибутами)
- Рекурсивно обходит всё поддерево
- Регистронезависимый поиск

Примеры:
\`\`\`
// <div>Hello world! Say hello!</div>
highlight(div, 'hello');
// → <div><mark>Hello</mark> world! Say <mark>hello</mark>!</div>
\`\`\``,
    functionName: 'highlight_test',
    starterCode: `function highlight(root, word) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsdom-p4-t1',
        inputDisplay: 'одно вхождение → один <mark>',
        inputArgs: ['one-match'],
        expected: 1,
      },
      {
        id: 'jsdom-p4-t2',
        inputDisplay: 'два вхождения → два <mark>',
        inputArgs: ['two-matches'],
        expected: 2,
      },
      {
        id: 'jsdom-p4-t3',
        inputDisplay: 'регистронезависимый поиск',
        inputArgs: ['case-insensitive'],
        expected: 1,
      },
      {
        id: 'jsdom-p4-t4',
        inputDisplay: 'нет вхождений → 0 <mark>',
        inputArgs: ['no-match'],
        expected: 0,
      },
      {
        id: 'jsdom-p4-t5',
        inputDisplay: 'вложенные элементы — обходит рекурсивно',
        inputArgs: ['nested'],
        expected: 2,
      },
    ],
    hints: [
      'Используйте `TreeWalker` или рекурсивный обход. `document.createTreeWalker(root, NodeFilter.SHOW_TEXT)` — итератор по текстовым узлам.',
      'Для каждого текстового узла: найдите вхождения с помощью regex. Разбейте узел на части через `splitText`, оберните найденную часть в `<mark>`.',
      'Важно: при разбиении текстовых узлов TreeWalker может "потерять" позицию — собирайте все нужные узлы сначала в массив, потом обрабатывайте.',
    ],
    solutionCode: `function highlight(root, word) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];

  let node;
  while ((node = walker.nextNode())) {
    if (node.textContent.toLowerCase().includes(word.toLowerCase())) {
      textNodes.push(node);
    }
  }

  for (const textNode of textNodes) {
    const regex = new RegExp(\`(\${word})\`, 'gi');
    const parts = textNode.textContent.split(regex);
    const fragment = document.createDocumentFragment();

    for (const part of parts) {
      if (part.toLowerCase() === word.toLowerCase()) {
        const mark = document.createElement('mark');
        mark.textContent = part;
        fragment.appendChild(mark);
      } else if (part) {
        fragment.appendChild(document.createTextNode(part));
      }
    }

    textNode.parentNode.replaceChild(fragment, textNode);
  }
}`,
    testHelperCode: `function highlight_test(arg) {
  function makeDiv(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div;
  }
  if (arg === 'one-match') {
    const div = makeDiv('Hello world');
    highlight(div, 'world');
    return div.querySelectorAll('mark').length;
  }
  if (arg === 'two-matches') {
    const div = makeDiv('Hello world, hello again');
    highlight(div, 'hello');
    return div.querySelectorAll('mark').length;
  }
  if (arg === 'case-insensitive') {
    const div = makeDiv('Hello world');
    highlight(div, 'HELLO');
    return div.querySelectorAll('mark').length;
  }
  if (arg === 'no-match') {
    const div = makeDiv('Hello world');
    highlight(div, 'xyz');
    return div.querySelectorAll('mark').length;
  }
  if (arg === 'nested') {
    const div = makeDiv('<p>hello <span>world hello</span></p>');
    highlight(div, 'hello');
    return div.querySelectorAll('mark').length;
  }
}`,
  },
  {
    id: 'jsdom-p5',
    topicId: 'js-dom',
    title: 'deepCloneNode — клонирование DOM-элемента',
    difficulty: 'medium',
    isContextual: false,
    description: `Напишите функцию \`deepCloneNode(el)\`, которая выполняет глубокое клонирование DOM-элемента **без использования** \`cloneNode\`.

Функция должна:
- Создать новый элемент того же типа
- Скопировать все атрибуты
- Рекурсивно клонировать дочерние узлы (элементы и текстовые узлы)

Примеры:
\`\`\`
// <div class="box"><p>Hello <strong>World</strong></p></div>
const clone = deepCloneNode(original);
clone.outerHTML === original.outerHTML; // true
clone !== original;                     // true (другой объект)
\`\`\``,
    functionName: 'deepCloneNode_test',
    starterCode: `function deepCloneNode(el) {
  // ваш код — нельзя использовать cloneNode!
}`,
    testCases: [
      {
        id: 'jsdom-p5-t1',
        inputDisplay: 'созданный элемент того же тега',
        inputArgs: ['tagName'],
        expected: 'DIV',
      },
      {
        id: 'jsdom-p5-t2',
        inputDisplay: 'атрибуты скопированы',
        inputArgs: ['attributes'],
        expected: 'box',
      },
      {
        id: 'jsdom-p5-t3',
        inputDisplay: 'текстовый контент скопирован',
        inputArgs: ['textContent'],
        expected: 'Hello',
      },
      {
        id: 'jsdom-p5-t4',
        inputDisplay: 'клон и оригинал — разные объекты',
        inputArgs: ['different-ref'],
        expected: true,
      },
      {
        id: 'jsdom-p5-t5',
        inputDisplay: 'вложенные дочерние элементы клонированы',
        inputArgs: ['children'],
        expected: 1,
      },
    ],
    hints: [
      'Для текстовых узлов: `document.createTextNode(node.textContent)`.',
      'Для элементов: `document.createElement(el.tagName)`, затем скопируйте атрибуты через `el.attributes`.',
      'Рекурсивно обойдите `el.childNodes` (не `children` — включает текстовые узлы).',
    ],
    solutionCode: `function deepCloneNode(el) {
  if (el.nodeType === Node.TEXT_NODE) {
    return document.createTextNode(el.textContent);
  }

  const clone = document.createElement(el.tagName);

  for (const attr of el.attributes) {
    clone.setAttribute(attr.name, attr.value);
  }

  for (const child of el.childNodes) {
    clone.appendChild(deepCloneNode(child));
  }

  return clone;
}`,
    testHelperCode: `function deepCloneNode_test(arg) {
  const original = document.createElement('div');
  original.className = 'box';
  original.appendChild(document.createTextNode('Hello'));
  const p = document.createElement('p');
  original.appendChild(p);
  if (arg === 'tagName') return deepCloneNode(original).tagName;
  if (arg === 'attributes') return deepCloneNode(original).className;
  if (arg === 'textContent') return deepCloneNode(original).childNodes[0].textContent;
  if (arg === 'different-ref') return deepCloneNode(original) !== original;
  if (arg === 'children') return deepCloneNode(original).childElementCount;
}`,
  },
  {
    id: 'jsd-p1',
    topicId: 'js-dom',
    title: 'Трассировка всплытия события',
    difficulty: 'easy',
    isContextual: false,
    kind: 'predict-output',
    description: `Дано:
\`\`\`html
<div id="outer">
  <div id="middle">
    <button id="btn">click</button>
  </div>
</div>
\`\`\`

\`\`\`js
outer.addEventListener('click', () => console.log('outer-bubble'));
outer.addEventListener('click', () => console.log('outer-capture'), true);
middle.addEventListener('click', () => console.log('middle-bubble'));
middle.addEventListener('click', () => console.log('middle-capture'), true);
btn.addEventListener('click', () => console.log('btn'));

btn.click();
\`\`\`

Что будет выведено в консоль и в каком порядке?

Каждое значение на отдельной строке.`,
    code: `outer.addEventListener('click', () => console.log('outer-bubble'));
outer.addEventListener('click', () => console.log('outer-capture'), true);
middle.addEventListener('click', () => console.log('middle-bubble'));
middle.addEventListener('click', () => console.log('middle-capture'), true);
btn.addEventListener('click', () => console.log('btn'));

btn.click();`,
    expected: 'outer-capture\nmiddle-capture\nbtn\nmiddle-bubble\nouter-bubble',
    hints: [
      'Сначала выполняется фаза capture: от внешнего предка вниз к цели.',
      'Затем — обработчики на самой цели в порядке регистрации.',
      'Наконец — фаза bubble: от цели вверх к внешнему предку.',
    ],
    solutionCode: `// Порядок фаз: capture (сверху вниз) → target → bubble (снизу вверх).
// outer-capture (capture, на самом внешнем) →
// middle-capture (capture, на промежуточном) →
// btn         (target — обработчик на самой кнопке) →
// middle-bubble (bubble, на промежуточном) →
// outer-bubble  (bubble, на самом внешнем)`,
  },
  {
    id: 'jsd-p2',
    topicId: 'js-dom',
    title: 'Найди баг: removeEventListener',
    difficulty: 'medium',
    isContextual: false,
    kind: 'find-bug',
    description: `Функция \`subscribe(emitter, type, fn)\` должна повесить обработчик на эмиттер и вернуть функцию-отписку. После вызова отписки обработчик НЕ должен срабатывать.

Тесты используют упрощённый эмиттер с API \`addEventListener\` / \`removeEventListener\`. Найдите и исправьте баг.

Подсказка: при вызове \`removeEventListener\` важно передать **ту же** ссылку на функцию, что и при добавлении.`,
    functionName: 'subscribe_test',
    buggyCode: `function subscribe(emitter, type, fn) {
  emitter.addEventListener(type, (e) => fn(e));
  return () => {
    emitter.removeEventListener(type, (e) => fn(e));
  };
}`,
    bugSummary:
      'addEventListener и removeEventListener получают РАЗНЫЕ стрелочные функции (новая создаётся на каждой строке). Чтобы отписка работала, нужно сохранить одну функцию и передать её в оба вызова.',
    testCases: [
      {
        id: 'jsd-p2-t1',
        inputDisplay: 'обработчик срабатывает до отписки',
        inputArgs: ['fires-before'],
        expected: 1,
      },
      {
        id: 'jsd-p2-t2',
        inputDisplay: 'после отписки обработчик не срабатывает',
        inputArgs: ['silent-after'],
        expected: 1,
      },
      {
        id: 'jsd-p2-t3',
        inputDisplay: 'subscribe возвращает функцию',
        inputArgs: ['returns-fn'],
        expected: 'function',
      },
      {
        id: 'jsd-p2-t4',
        inputDisplay: 'event передаётся в handler',
        inputArgs: ['passes-event'],
        expected: 'ping',
      },
      {
        id: 'jsd-p2-t5',
        inputDisplay: 'двойная отписка не падает',
        inputArgs: ['double-unsub'],
        expected: true,
      },
    ],
    hints: [
      'Сохраните единственную ссылку на обработчик в переменной до addEventListener.',
      'В замыкании верните функцию, вызывающую removeEventListener с этой же переменной.',
      'Стрелочная функция, созданная заново, — это другой объект, removeEventListener его не найдёт.',
    ],
    solutionCode: `function subscribe(emitter, type, fn) {
  const handler = (e) => fn(e);
  emitter.addEventListener(type, handler);
  return () => {
    emitter.removeEventListener(type, handler);
  };
}`,
    testHelperCode: `function makeEmitter() {
  const map = new Map();
  return {
    addEventListener(type, fn) {
      if (!map.has(type)) map.set(type, new Set());
      map.get(type).add(fn);
    },
    removeEventListener(type, fn) {
      map.get(type)?.delete(fn);
    },
    dispatch(type, payload) {
      const set = map.get(type);
      if (!set) return;
      for (const fn of [...set]) fn(payload);
    },
  };
}

function subscribe_test(arg) {
  const em = makeEmitter();
  if (arg === 'fires-before') {
    let calls = 0;
    subscribe(em, 'tick', () => calls++);
    em.dispatch('tick', null);
    return calls;
  }
  if (arg === 'silent-after') {
    let calls = 0;
    const off = subscribe(em, 'tick', () => calls++);
    em.dispatch('tick', null);
    off();
    em.dispatch('tick', null);
    em.dispatch('tick', null);
    return calls;
  }
  if (arg === 'returns-fn') {
    const off = subscribe(em, 'tick', () => {});
    return typeof off;
  }
  if (arg === 'passes-event') {
    let received = null;
    subscribe(em, 'tick', (e) => { received = e; });
    em.dispatch('tick', 'ping');
    return received;
  }
  if (arg === 'double-unsub') {
    const off = subscribe(em, 'tick', () => {});
    off();
    try { off(); } catch { return false; }
    return true;
  }
}`,
  },
  {
    id: 'jsd-p3',
    topicId: 'js-dom',
    title: 'Рефакторинг: 100 обработчиков → один делегированный',
    difficulty: 'medium',
    isContextual: false,
    kind: 'refactor',
    description: `Функция \`attachHandlers(items, onPick)\` должна для каждого элемента \`items\` (объекты с полем \`id\`) сделать так, чтобы при вызове \`item.click()\` был вызван \`onPick(item.id)\`.

Текущая реализация навешивает отдельный обработчик на каждый item — это работает, но раздувает память на больших списках.

**Задача**: перепишите функцию через **делегирование**. Используйте общий «контейнер» (объект с \`addEventListener\`) и **один** обработчик на нём; при клике определяйте, какой item был источником, и вызывайте \`onPick(item.id)\`.

API контейнера в тестах:
- \`container.addEventListener('click', handler)\` — регистрирует обработчик; в \`event\` будет поле \`target\` с item.
- \`item.click()\` — генерирует click, который доставляется в обработчики контейнера.

Корректное решение должно вызвать \`onPick\` ровно один раз на каждый \`item.click()\` и НЕ должно вызывать \`addEventListener\` на каждом item отдельно.`,
    functionName: 'attachHandlers_test',
    starterCode: `function attachHandlers(container, items, onPick) {
  // Текущая (рабочая, но неэффективная) реализация: обработчик на каждом item.
  for (const item of items) {
    item.addEventListener('click', () => onPick(item.id));
  }
}`,
    testCases: [
      {
        id: 'jsd-p3-t1',
        inputDisplay: 'клик по item вызывает onPick с правильным id',
        inputArgs: ['basic-pick'],
        expected: 'item-2',
      },
      {
        id: 'jsd-p3-t2',
        inputDisplay: 'все 100 items работают через один обработчик',
        inputArgs: ['delegated-count'],
        expected: 1,
      },
      {
        id: 'jsd-p3-t3',
        inputDisplay: 'на items НЕ должны вешаться отдельные обработчики',
        inputArgs: ['no-per-item'],
        expected: 0,
      },
      {
        id: 'jsd-p3-t4',
        inputDisplay: 'каждый клик вызывает onPick ровно один раз',
        inputArgs: ['one-call-per-click'],
        expected: 100,
      },
      {
        id: 'jsd-p3-t5',
        inputDisplay: 'клик по элементу вне списка не вызывает onPick',
        inputArgs: ['outside-click'],
        expected: 0,
      },
    ],
    hints: [
      'Регистрируйте обработчик ОДИН раз — на container, не на каждом item.',
      'В обработчике event.target — это item, который сгенерировал клик. Используйте его id.',
      'Перед вызовом onPick проверьте, что target присутствует в массиве items (защита от чужих кликов).',
    ],
    solutionCode: `function attachHandlers(container, items, onPick) {
  const known = new Set(items);
  container.addEventListener('click', (e) => {
    if (known.has(e.target)) {
      onPick(e.target.id);
    }
  });
}`,
    testHelperCode: `function makeNode(container) {
  const listeners = [];
  return {
    id: null,
    _listeners: listeners,
    addEventListener(type, fn) {
      listeners.push({ type, fn });
    },
    click() {
      const event = { type: 'click', target: this };
      // Делегированные обработчики живут на container — обходим всю цепочку.
      const all = container ? [...container._listeners, ...listeners] : listeners;
      for (const l of all) if (l.type === 'click') l.fn(event);
    },
  };
}

function attachHandlers_test(arg) {
  const container = makeNode(null);
  const items = Array.from({ length: 100 }, (_, i) => {
    const node = makeNode(container);
    node.id = 'item-' + i;
    return node;
  });

  if (arg === 'basic-pick') {
    let last = null;
    attachHandlers(container, items, (id) => { last = id; });
    items[2].click();
    return last;
  }
  if (arg === 'delegated-count') {
    attachHandlers(container, items, () => {});
    return container._listeners.length;
  }
  if (arg === 'no-per-item') {
    attachHandlers(container, items, () => {});
    return items.reduce((sum, it) => sum + it._listeners.length, 0);
  }
  if (arg === 'one-call-per-click') {
    let calls = 0;
    attachHandlers(container, items, () => { calls++; });
    for (const it of items) it.click();
    return calls;
  }
  if (arg === 'outside-click') {
    let calls = 0;
    attachHandlers(container, items, () => { calls++; });
    const stranger = makeNode(container);
    stranger.id = 'stranger';
    stranger.click();
    return calls;
  }
}`,
  },
  {
    id: 'jsdom-h1',
    topicId: 'js-dom',
    kind: 'implement',
    title: 'querySelectorClosest — найти ближайший предок',
    difficulty: 'hard',
    isContextual: false,
    description: `Реализуйте функцию \`closestBySelector(element, selector)\` — аналог нативного \`Element.closest()\`.

Функция обходит \`element\` и его предков снизу вверх (включая сам element), и возвращает первый, соответствующий \`selector\`. Если такого нет — \`null\`.

Поддерживаемые селекторы:
- \`'div'\` — по тегу
- \`'.active'\` — по классу
- \`'#id'\` — по ID
- \`'[data-role]'\` — по наличию атрибута

Примеры:
\`\`\`
// DOM: section#root > div.container > span.item
const item = document.querySelector('.item');
closestBySelector(item, 'div')         // → <div.container>
closestBySelector(item, '#root')       // → <section#root>
closestBySelector(item, '.missing')    // → null
\`\`\``,
    functionName: 'closestBySelector_test',
    starterCode: `function closestBySelector(element, selector) {
  // ваш код — без использования element.closest()!
}`,
    testCases: [
      { id: 'jsdom-h1-t1', inputDisplay: 'closest по тегу', inputArgs: ['tag'], expected: 'DIV' },
      { id: 'jsdom-h1-t2', inputDisplay: 'closest по классу', inputArgs: ['class'], expected: 'container' },
      { id: 'jsdom-h1-t3', inputDisplay: 'closest по id', inputArgs: ['id'], expected: 'root' },
      { id: 'jsdom-h1-t4', inputDisplay: 'сам элемент совпадает → возвращается он', inputArgs: ['self-match'], expected: 'item' },
      { id: 'jsdom-h1-t5', inputDisplay: 'нет совпадения → null', inputArgs: ['no-match'], expected: null },
    ],
    hints: [
      'Цикл: начните с element, на каждом шаге переходите к element.parentElement.',
      'Парсите selector: если начинается с "#" — проверяйте el.id, с "." — el.classList.contains, с "[" — el.hasAttribute, иначе — el.tagName.toLowerCase().',
      'Продолжайте пока element !== null.',
    ],
    solutionCode: `function closestBySelector(element, selector) {
  function matches(el, sel) {
    if (sel.startsWith('#')) return el.id === sel.slice(1);
    if (sel.startsWith('.')) return el.classList && el.classList.contains(sel.slice(1));
    if (sel.startsWith('[')) {
      const attr = sel.slice(1, -1);
      return el.hasAttribute && el.hasAttribute(attr);
    }
    return el.tagName && el.tagName.toLowerCase() === sel.toLowerCase();
  }

  let cur = element;
  while (cur) {
    if (matches(cur, selector)) return cur;
    cur = cur.parentElement;
  }
  return null;
}`,
    testHelperCode: `function closestBySelector_test(scenario) {
  const root = document.createElement('section');
  root.id = 'root';
  const container = document.createElement('div');
  container.className = 'container';
  const item = document.createElement('span');
  item.className = 'item';
  container.appendChild(item);
  root.appendChild(container);
  document.body.appendChild(root);

  let result;
  if (scenario === 'tag') result = closestBySelector(item, 'div')?.tagName;
  if (scenario === 'class') result = closestBySelector(item, '.container')?.className;
  if (scenario === 'id') result = closestBySelector(item, '#root')?.id;
  if (scenario === 'self-match') result = closestBySelector(item, '.item')?.className;
  if (scenario === 'no-match') result = closestBySelector(item, '.missing');

  document.body.removeChild(root);
  return result ?? null;
}`,
  },
  {
    id: 'jsdom-h2',
    topicId: 'js-dom',
    kind: 'implement',
    title: 'Virtual DOM patch — применение diff к реальному DOM',
    difficulty: 'hard',
    isContextual: false,
    description: `Реализуйте функцию \`patch(realNode, oldVNode, newVNode)\`, которая эффективно обновляет реальный DOM минимальным количеством операций.

VNode — это объект:
\`\`\`ts
{ tag: string, attrs?: Record<string,string>, children?: (VNode | string)[] }
\`\`\`

Правила:
1. Если тег изменился — заменить узел целиком (\`replaceChild\`)
2. Если тег тот же — обновить только изменившиеся атрибуты, рекурсивно patch дочерние узлы
3. Если количество children изменилось — добавить/удалить лишние узлы
4. Для текстовых узлов (строки): обновить \`textContent\` если изменилось

Примеры:
\`\`\`js
// Меняем класс кнопки без пересоздания узла
patch(btn, { tag:'button', attrs:{class:'old'} }, { tag:'button', attrs:{class:'new'} });
btn.className // → 'new'
\`\`\``,
    functionName: 'patch_test',
    starterCode: `function patch(parent, oldVNode, newVNode) {
  // ваш код
}`,
    testCases: [
      { id: 'jsdom-h2-t1', inputDisplay: 'обновляет атрибут без замены узла', inputArgs: ['update-attr'], expected: 'new-class' },
      { id: 'jsdom-h2-t2', inputDisplay: 'разные теги — заменяет узел', inputArgs: ['replace-tag'], expected: 'SPAN' },
      { id: 'jsdom-h2-t3', inputDisplay: 'обновляет текстовый узел', inputArgs: ['update-text'], expected: 'updated' },
      { id: 'jsdom-h2-t4', inputDisplay: 'добавляет новый дочерний узел', inputArgs: ['add-child'], expected: 2 },
      { id: 'jsdom-h2-t5', inputDisplay: 'удаляет лишний дочерний узел', inputArgs: ['remove-child'], expected: 1 },
    ],
    hints: [
      'Если oldVNode — строка: обновите textContent если изменилась.',
      'Если теги разные: создайте новый DOM-элемент из newVNode и замените старый через parent.replaceChild.',
      'Если теги совпадают: итерируйтесь по attrs newVNode (setAttribute) и удалите те, что есть в old но нет в new (removeAttribute). Затем рекурсивно patch каждый child.',
    ],
    solutionCode: `function createEl(vnode) {
  if (typeof vnode === 'string') return document.createTextNode(vnode);
  const el = document.createElement(vnode.tag);
  for (const [k, v] of Object.entries(vnode.attrs ?? {})) el.setAttribute(k, v);
  for (const child of vnode.children ?? []) el.appendChild(createEl(child));
  return el;
}

function patch(parent, oldVNode, newVNode, domNode) {
  domNode = domNode ?? parent.firstChild;

  if (typeof oldVNode === 'string' && typeof newVNode === 'string') {
    if (oldVNode !== newVNode) domNode.textContent = newVNode;
    return domNode;
  }

  if (typeof oldVNode !== typeof newVNode ||
      (typeof oldVNode === 'object' && oldVNode.tag !== newVNode.tag)) {
    const newEl = createEl(newVNode);
    parent.replaceChild(newEl, domNode);
    return newEl;
  }

  // Одинаковые теги — патчим in-place
  const oldAttrs = oldVNode.attrs ?? {};
  const newAttrs = newVNode.attrs ?? {};
  for (const [k, v] of Object.entries(newAttrs)) {
    if (oldAttrs[k] !== v) domNode.setAttribute(k, v);
  }
  for (const k of Object.keys(oldAttrs)) {
    if (!(k in newAttrs)) domNode.removeAttribute(k);
  }

  const oldChildren = oldVNode.children ?? [];
  const newChildren = newVNode.children ?? [];
  const max = Math.max(oldChildren.length, newChildren.length);
  let childIdx = 0;
  for (let i = 0; i < max; i++) {
    if (i >= newChildren.length) {
      domNode.removeChild(domNode.childNodes[childIdx]);
    } else if (i >= oldChildren.length) {
      domNode.appendChild(createEl(newChildren[i]));
      childIdx++;
    } else {
      patch(domNode, oldChildren[i], newChildren[i], domNode.childNodes[childIdx]);
      childIdx++;
    }
  }

  return domNode;
}`,
    testHelperCode: `function patch_test(scenario) {
  function render(vnode) {
    const el = document.createElement(vnode.tag);
    for (const [k,v] of Object.entries(vnode.attrs ?? {})) el.setAttribute(k,v);
    for (const c of vnode.children ?? []) {
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : render(c));
    }
    return el;
  }

  const container = document.createElement('div');
  document.body.appendChild(container);
  let result;

  if (scenario === 'update-attr') {
    const old = { tag: 'div', attrs: { class: 'old-class' } };
    const next = { tag: 'div', attrs: { class: 'new-class' } };
    const el = render(old); container.appendChild(el);
    patch(container, old, next, el);
    result = el.className;
  }
  if (scenario === 'replace-tag') {
    const old = { tag: 'div' };
    const next = { tag: 'span' };
    const el = render(old); container.appendChild(el);
    patch(container, old, next, el);
    result = container.firstChild.tagName;
  }
  if (scenario === 'update-text') {
    const old = { tag: 'p', children: ['original'] };
    const next = { tag: 'p', children: ['updated'] };
    const el = render(old); container.appendChild(el);
    patch(container, old, next, el);
    result = el.textContent;
  }
  if (scenario === 'add-child') {
    const old = { tag: 'ul', children: [{ tag: 'li' }] };
    const next = { tag: 'ul', children: [{ tag: 'li' }, { tag: 'li' }] };
    const el = render(old); container.appendChild(el);
    patch(container, old, next, el);
    result = el.childNodes.length;
  }
  if (scenario === 'remove-child') {
    const old = { tag: 'ul', children: [{ tag: 'li' }, { tag: 'li' }] };
    const next = { tag: 'ul', children: [{ tag: 'li' }] };
    const el = render(old); container.appendChild(el);
    patch(container, old, next, el);
    result = el.childNodes.length;
  }

  document.body.removeChild(container);
  return result ?? null;
}`,
  },
];
