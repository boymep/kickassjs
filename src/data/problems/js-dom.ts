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
      "Дескриптор задаёт тег, атрибуты и потомков (которые сами могут быть такими же дескрипторами). Какая фундаментальная техника естественна для обхода структур, ссылающихся на самих себя?",
      "Используйте `document.createElement(tag)` для узла, `setAttribute` для атрибутов и рекурсивный вызов для каждого ребёнка. Строковые дети — это `document.createTextNode(child)`, объектные — рекурсивный вызов `createElement`.",
      `Тонкость с атрибутами: \`setAttribute('class', ...)\` и \`el.className = ...\` дают разный результат для SVG-элементов и нестандартных свойств — \`setAttribute\` универсальнее и работает с произвольными именами, включая \`data-*\` и \`aria-*\`. Ещё момент: текстовые дети нужно создавать именно через \`document.createTextNode\`, а не через \`innerHTML\`, иначе содержимое вроде \`<script>\` или \`&amp;\` будет интерпретироваться как HTML, что открывает дыру для XSS.

С чего начать:
\`\`\`js
function createElement(descriptor) {
  const el = document.createElement(descriptor.tag);
  // ...
  return el;
}
\`\`\``,
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
      "События всплывают: клик по `<span>` внутри `<li>` дойдёт и до `<ul>`. В обработчике на родителе можно посмотреть, откуда событие началось, и подняться вверх до ближайшего интересующего элемента.",
      "В обработчике используйте `e.target.closest(selector)` — он вернёт ближайший подходящий элемент (включая сам target). Проверьте, что найденный элемент находится внутри `parent` через `parent.contains(target)`, чтобы не сработать на узлах вне области.",
      `Главное в делегировании — обработчик висит на родителе, а реальную цель определяете через \`event.target.closest(selector)\`. Без \`closest\` вы пропустите клики по вложенным детям: например, по иконке внутри карточки \`target\` будет уже иконкой, а не карточкой. Проверка \`parent.contains(target)\` отсекает редкий, но возможный случай — \`closest\` поднялся выше \`parent\` и нашёл совпадение там (например, если parent сам подходит под селектор и обернут в такой же контейнер). И ещё: \`addEventListener\` ставится **один раз**, поэтому динамически добавленные элементы работают без перепривязки.

С чего начать:
\`\`\`js
function delegate(parent, selector, eventType, handler) {
  parent.addEventListener(eventType, (e) => {
    const target = e.target.closest(selector);
    // ...
  });
}
\`\`\``,
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
      "У формы есть встроенная коллекция всех её полей. Пройдитесь по ней и для каждого поля решите три вопроса: есть ли у него имя, активно ли оно, относится ли оно к специальным типам (checkbox/radio) — и если да, выбрано ли оно.",
      "Используйте `form.elements`. Пропускайте поля без `name` и с `disabled = true`. Для `checkbox`/`radio` берите значение только если `checked`. Значение поля — `el.value`; если оно пустое для отмеченного checkbox, по контракту подставляйте `'on'`.",
      `Почему \`form.elements\`, а не \`form.querySelectorAll('input, select, textarea')\`? Первый — это живая коллекция, которую браузер сам собирает по правилам HTML-форм: туда попадают именно «отправляемые» поля, включая \`<button name>\` и \`<fieldset>\`, и в правильном порядке. Тонкость с радиокнопками: у группы с одним \`name\` будет несколько элементов, и нужно учесть только тот, у которого \`checked === true\`. Если же ни один не выбран — ключа в результате быть не должно, как и в нативной отправке формы.

С чего начать:
\`\`\`js
function serialize(form) {
  const result = {};
  for (const el of form.elements) {
    // ...
  }
  return result;
}
\`\`\``,
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
      "Вам нужно обойти все текстовые узлы внутри корня — даже глубоко вложенные — и для каждого подходящего разделить его так, чтобы оборачивались только совпадения, а соседний текст оставался обычным текстом.",
      "Используйте `document.createTreeWalker(root, NodeFilter.SHOW_TEXT)` — он выдаёт только текстовые узлы любой глубины. Сначала соберите все подходящие в массив (чтобы замена не сбила обход), потом для каждого узла разбейте текст регуляркой с флагом `gi` и соберите `DocumentFragment` из текстовых узлов и `<mark>`.",
      `Главная ловушка — нельзя менять DOM прямо во время обхода \`TreeWalker\`: как только вы замените текстовый узел на фрагмент с \`<mark>\`, walker может «потерять» позицию или пройти по новым узлам и обернуть их повторно. Поэтому сначала собираем все целевые узлы в массив и только потом их трогаем. Ещё момент: \`innerHTML += ...\` для подсветки тоже искушение, но он пересоздаёт всё поддерево и сбрасывает обработчики событий, \`selection\`, фокус — в реальном приложении это критично.

С чего начать:
\`\`\`js
function highlight(root, word) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  // ...
}
\`\`\``,
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
      "Дерево DOM состоит из узлов разных типов: элементы — это полноценные теги с атрибутами и детьми, текстовые узлы — это просто строки. Решение должно «разветвляться» на эти два случая и рекурсивно обходить всех детей.",
      "Проверяйте `node.nodeType === Node.TEXT_NODE` — для них верните `document.createTextNode(node.textContent)`. Для элементов создайте новый узел через `document.createElement(el.tagName)`, скопируйте `el.attributes` через `setAttribute`, и рекурсивно обойдите `el.childNodes` (не только `children`, чтобы захватить текстовые узлы).",
      `Существенная разница между \`el.children\` и \`el.childNodes\`: первая отдаёт только дочерние **элементы**, а вторая — все узлы, включая текстовые и комментарии. Если перебирать только \`children\`, в клоне исчезнет весь обычный текст между тегами. Ещё нюанс: \`cloneNode(true)\` копирует атрибуты, но **не копирует** обработчики событий, добавленные через \`addEventListener\`, — и наша рукотворная реализация тем более этого не делает. Это особенность DOM-копирования, а не баг.

С чего начать:
\`\`\`js
function deepCloneNode(el) {
  if (el.nodeType === Node.TEXT_NODE) {
    return document.createTextNode(el.textContent);
  }
  // ...
}
\`\`\``,
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
      "Шаг 1: каждое событие в DOM проходит три фазы — capture (сверху вниз от корня к цели), target (на самой цели) и bubble (снизу вверх обратно к корню). Третий аргумент `addEventListener` равный `true` ставит обработчик в фазу capture, иначе — в фазу bubble.",
      "Шаг 2: расставьте обработчики по фазам. Capture в порядке прохождения: `outer-capture`, `middle-capture`. Затем фаза target — на самой кнопке: `btn`. Затем bubble в обратном порядке (от цели наверх): `middle-bubble`, `outer-bubble`.",
      "Шаг 3: итоговый вывод по строкам — `outer-capture`, `middle-capture`, `btn`, `middle-bubble`, `outer-bubble`.",
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
    title: 'Найдите баг: отписка от события не работает',
    difficulty: 'medium',
    isContextual: false,
    kind: 'find-bug',
    description: `Функция \`subscribe(emitter, type, fn)\` вешает обработчик на эмиттер и возвращает функцию-отписку. После вызова отписки обработчик **не должен** срабатывать.

Тесты используют упрощённый эмиттер с API \`addEventListener\` / \`removeEventListener\`. Найдите и исправьте баг.`,
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
      "Стрелочные функции в строках `addEventListener(...)` и `removeEventListener(...)` записаны одинаково, но это не одно и то же выражение, а два разных. Сравнение по ссылке даст `false`.",
      "`removeEventListener` ищет обработчик по ссылке. Если передать туда заново созданную функцию — он ничего не найдёт и тихо ничего не сделает. Решение: вынести стрелочную функцию в переменную и использовать одну и ту же ссылку при подписке и отписке.",
      "Эта же ошибка возникает каждый раз, когда обработчик «оборачивают» в стрелочную функцию прямо в `addEventListener`: `el.addEventListener('click', () => fn(e))` — отписаться от такого вы уже не сможете в принципе, ссылка на функцию потеряна. Тот же подвох с `.bind(this)`: каждый вызов `.bind` возвращает **новую** функцию. Правило простое — любая обёртка вокруг обработчика должна храниться в переменной (или в поле класса), чтобы в `removeEventListener` шла та же самая ссылка.",
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
      "Поскольку события поднимаются от потомка к предку, один обработчик на общем родителе может «обслужить» все элементы списка. Внутри обработчика нужно понять, чей именно клик мы получили.",
      "Используйте делегирование: повесьте один listener на `container`. В обработчике берите `event.target` и проверяйте, что он принадлежит набору `items`. Удобно завести `Set(items)` — проверка через `.has(target)` за O(1).",
      `Почему делегирование лучше для длинных списков: каждый \`addEventListener\` — это не только память под функцию, но и запись в таблице обработчиков узла. На 100 элементах это незаметно, на 10 000 (виртуальные списки, чаты, фид) — уже ощутимо тормозит и съедает память. Бонус делегирования: новые items, добавленные позже, начинают работать без дополнительной подписки. Граничный случай — клик в пустом месте контейнера: его \`target\` не входит в \`Set\`, поэтому \`onPick\` корректно не вызывается.

С чего начать:
\`\`\`js
function attachHandlers(container, items, onPick) {
  const known = new Set(items);
  container.addEventListener('click', (e) => {
    // ...
  });
}
\`\`\``,
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
      "Идите от самого элемента вверх по дереву, на каждом шаге проверяя, соответствует ли он переданному селектору. Селектор бывает четырёх видов — нужно научиться различать их по первому символу.",
      "Двигайтесь по `el.parentElement` в цикле до `null`. Функция-матчер: если строка начинается с `#` — сравните `el.id`, с `.` — `el.classList.contains`, с `[` — `el.hasAttribute(...)`, иначе — сравните `el.tagName.toLowerCase()`.",
      `Важная деталь, в которой легко ошибиться: \`closest\` обязан проверить **сам элемент тоже**, не только предков. Если кликнули по \`.item\`, и мы ищем \`.item\`, ответ — этот же узел, а не его родитель. Поэтому цикл начинается с самого \`element\`, и только потом идёт \`parentElement\`. Ещё нюанс — \`tagName\` всегда в верхнем регистре для HTML (\`'DIV'\`), но в нижнем для XML/SVG; для надёжности сравнение делается через \`toLowerCase()\` с обеих сторон.

С чего начать:
\`\`\`js
function closestBySelector(element, selector) {
  let cur = element;
  while (cur) {
    // ...
    cur = cur.parentElement;
  }
  return null;
}
\`\`\``,
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
      "При сравнении двух vnode возможны три случая: типы разные (один — строка, другой — объект, или теги отличаются) — нужна полная замена узла; типы и теги совпадают — узел остаётся, обновляются только атрибуты и дети; узлы идентичны — ничего не делаем.",
      "При совпадающих тегах: пройдитесь по новым атрибутам и через `setAttribute` обновите только изменившиеся; удалите атрибуты, которых нет в новом vnode; затем рекурсивно `patch` каждого ребёнка. Лишние старые дети удаляйте `removeChild`, новые — добавляйте `appendChild`.",
      `Главная идея VDOM-патча — минимизировать дорогие операции с реальным DOM (каждое \`appendChild\`/\`setAttribute\` потенциально вызывает reflow). Поэтому атрибуты сравниваются и трогаются точечно: если значение не изменилось — не пишем вовсе. Слабое место наивного diff детей по индексу — перестановка элементов: при удалении первого ребёнка все остальные «сдвинутся» и будут перерисованы зря. Реальные библиотеки решают это через \`key\`-атрибуты, сопоставляя старые и новые узлы по ключу, а не по позиции.

С чего начать:
\`\`\`js
function patch(parent, oldVNode, newVNode, domNode) {
  if (oldVNode.tag !== newVNode.tag) {
    // ...
  }
  // ...
}
\`\`\``,
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

  // Одинаковые теги — обновляем узел на месте
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
  {
    id: 'jsdom-e2',
    topicId: 'js-dom',
    kind: 'predict-output',
    title: 'Что выведет код: event.target vs event.currentTarget',
    difficulty: 'easy',
    isContextual: false,
    description: `На \`<div id="outer">\` повесили обработчик клика. Внутри лежит \`<button id="btn">\`. Пользователь кликнул по кнопке.

В обработчике логируются \`event.target.id\` и \`event.currentTarget.id\`. Что выведется?`,
    code: `document.body.innerHTML = '<div id="outer"><button id="btn">click</button></div>';

document.getElementById('outer').addEventListener('click', (e) => {
  console.log(e.target.id);
  console.log(e.currentTarget.id);
});

document.getElementById('btn').click();`,
    expected: 'btn\nouter',
    hints: [
      "Шаг 1: при всплытии событие проходит несколько элементов. Браузер запоминает в одном свойстве «откуда оно началось» (исходный источник), а в другом — «на каком элементе мы сейчас выполняем код».",
      "Шаг 2: `event.target` — это самый внутренний элемент, по которому реально кликнули (`<button id=\"btn\">`). `event.currentTarget` — это элемент, на котором висит конкретный обработчик (`<div id=\"outer\">`).",
      "Шаг 3: первая строка — `e.target.id` → `'btn'`. Вторая — `e.currentTarget.id` → `'outer'`.",
    ],
    solutionCode: `// event.target.id === 'btn'         (исходный источник события)
// event.currentTarget.id === 'outer' (элемент, на котором висит обработчик)`,
  },
  {
    id: 'jsdom-h3',
    topicId: 'js-dom',
    kind: 'implement',
    title: 'waitForElement — дождаться появления элемента в DOM',
    difficulty: 'hard',
    isContextual: false,
    description: `Реализуйте \`waitForElement(selector, timeoutMs)\` — функцию, которая возвращает Promise, резолвящийся **появившимся** в DOM элементом, удовлетворяющим CSS-селектору.

Если элемент уже есть на момент вызова — резолвитесь сразу. Если не появляется за \`timeoutMs\` мс — реджектитесь с \`new Error('Timeout')\`.

Полезное упражнение на знание DOM API и асинхронного программирования.

Пример:
\`\`\`
const promise = waitForElement('.dynamic', 1000);
setTimeout(() => {
  const div = document.createElement('div');
  div.className = 'dynamic';
  document.body.appendChild(div);
}, 200);
const el = await promise;
el.className;  // 'dynamic'
\`\`\``,
    functionName: 'waitForElement_test',
    starterCode: `function waitForElement(selector, timeoutMs) {
  // ваш код — MutationObserver, не setInterval
}`,
    testCases: [
      { id: 'jsdom-h3-t1', inputDisplay: "элемент уже есть → резолв сразу", inputArgs: ['already-there'], expected: 'PRESENT' },
      { id: 'jsdom-h3-t2', inputDisplay: "элемент появляется позже → резолв", inputArgs: ['appears-later'], expected: 'LATE' },
      { id: 'jsdom-h3-t3', inputDisplay: "не появляется → Timeout", inputArgs: ['never-appears'], expected: 'Error: Timeout' },
      { id: 'jsdom-h3-t4', inputDisplay: "после резолва observer отключается", inputArgs: ['observer-cleanup'], expected: true },
    ],
    hints: [
      "Сначала проверьте, не появился ли элемент уже. Если нет — нужно эффективно реагировать на изменения DOM, не опрашивая его в цикле. И не забудьте про дедлайн.",
      "Используйте `MutationObserver` с `{ childList: true, subtree: true }` на `document.body`. В колбэке снова делайте `document.querySelector(selector)`. Параллельно запустите `setTimeout(timeoutMs)` для реджекта. И при резолве, и при таймауте — обязательно вызывайте `observer.disconnect()` и `clearTimeout`.",
      `\`MutationObserver\` срабатывает по факту изменения DOM, без поллинга — это эффективнее, чем \`setInterval\` с \`querySelector\`. Но колбэк observer вызывается на **изменения**, а не на текущее состояние, поэтому сначала проверьте элемент через \`document.querySelector\`, и только потом подписывайтесь — иначе уже существующий элемент будет ждать вечно. После резолва обязательно вызовите \`disconnect()\` и \`clearTimeout\`, иначе observer останется висеть в памяти, а таймер однажды реджектит уже отрезолвленный промис (это безопасно, но утечка ресурсов налицо).

С чего начать:
\`\`\`js
function waitForElement(selector, timeoutMs) {
  return new Promise((resolve, reject) => {
    const observer = new MutationObserver(() => {
      // ...
    });
    // ...
  });
}
\`\`\``,
    ],
    solutionCode: `function waitForElement(selector, timeoutMs) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(selector);
    if (existing) {
      resolve(existing);
      return;
    }
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        clearTimeout(timer);
        resolve(el);
      }
    });
    const timer = setTimeout(() => {
      observer.disconnect();
      reject(new Error('Timeout'));
    }, timeoutMs);
    observer.observe(document.body, { childList: true, subtree: true });
  });
}`,
    testHelperCode: `async function waitForElement_test(scenario) {
  document.body.innerHTML = '';
  if (scenario === 'already-there') {
    const d = document.createElement('div');
    d.id = 'present';
    document.body.appendChild(d);
    const el = await waitForElement('#present', 500);
    return el && el.id ? el.id.toUpperCase() : 'NO';
  }
  if (scenario === 'appears-later') {
    setTimeout(() => {
      const d = document.createElement('div');
      d.id = 'late';
      document.body.appendChild(d);
    }, 100);
    const el = await waitForElement('#late', 1000);
    return el && el.id ? el.id.toUpperCase() : 'NO';
  }
  if (scenario === 'never-appears') {
    try {
      await waitForElement('.absent', 100);
      return 'no-throw';
    } catch (e) {
      return 'Error: ' + e.message;
    }
  }
  if (scenario === 'observer-cleanup') {
    // Проверяем, что после успешного резолва добавление новых узлов
    // не вызывает побочного эффекта. Косвенно: после await элемент один.
    setTimeout(() => {
      const d = document.createElement('div');
      d.id = 'cleanup-target';
      document.body.appendChild(d);
    }, 50);
    await waitForElement('#cleanup-target', 1000);
    // добавляем ещё один такой же элемент — мы не должны "сломаться"
    const d2 = document.createElement('div');
    d2.id = 'cleanup-target-2';
    document.body.appendChild(d2);
    return document.querySelectorAll('div').length >= 2;
  }
}`,
  },
  {
    id: 'jsdom-h4',
    topicId: 'js-dom',
    kind: 'implement',
    title: 'createElementTree — построить дерево DOM из описания',
    difficulty: 'hard',
    isContextual: false,
    description: `Реализуйте \`createElementTree(spec)\` — функцию, которая принимает JSON-описание дерева элементов и возвращает **корневой DOM-элемент** этого дерева. Это упрощённая версия React.createElement / JSX.

Формат \`spec\`:
\`\`\`ts
type Spec = string | {
  tag: string;
  attrs?: Record<string, string>;
  events?: Record<string, (e: Event) => void>;
  children?: Spec[];
}
\`\`\`

- Строки превращаются в текстовые узлы.
- \`attrs\` устанавливаются через \`setAttribute\`.
- \`events\` — ключ это имя события (без префикса \`on\`), значение — обработчик.
- \`children\` — массив, в котором могут быть как другие spec-объекты, так и строки.

Пример:
\`\`\`
const root = createElementTree({
  tag: 'div',
  attrs: { class: 'card' },
  children: [
    { tag: 'h2', children: ['Title'] },
    { tag: 'p', children: ['Hello, world!'] },
    { tag: 'button', events: { click: () => alert('clicked') }, children: ['OK'] },
  ],
});
\`\`\``,
    functionName: 'tree_test',
    starterCode: `function createElementTree(spec) {
  // ваш код
}`,
    testCases: [
      { id: 'jsdom-h4-t1', inputDisplay: "плоский div с текстом", inputArgs: ['simple'], expected: '<div>hi</div>' },
      { id: 'jsdom-h4-t2', inputDisplay: "вложенные элементы", inputArgs: ['nested'], expected: '<div class="card"><h2>Title</h2><p>Body</p></div>' },
      { id: 'jsdom-h4-t3', inputDisplay: "обработчик события вызывается", inputArgs: ['event'], expected: 'clicked' },
      { id: 'jsdom-h4-t4', inputDisplay: "несколько атрибутов", inputArgs: ['multi-attrs'], expected: '<a href="/x" target="_blank">Link</a>' },
      { id: 'jsdom-h4-t5', inputDisplay: "только строка → текстовый узел", inputArgs: ['string-only'], expected: 'plain text' },
    ],
    hints: [
      "Спецификация рекурсивна: дети элемента — тоже спецификации. Решение тоже должно быть рекурсивным, с двумя ветками — строка и объект.",
      "Если `spec` — строка, верните `document.createTextNode(spec)`. Иначе создайте `document.createElement(spec.tag)`, пройдитесь по `spec.attrs` через `setAttribute`, по `spec.events` через `addEventListener(name, handler)` (без префикса `on`), и рекурсивно создайте детей.",
      `Важное отличие \`addEventListener('click', fn)\` от \`el.onclick = fn\` или \`setAttribute('onclick', ...)\`: первый позволяет навесить **несколько** обработчиков на одно событие и не зависит от конкретных свойств элемента, второй и третий — перетирают друг друга, а \`setAttribute('onclick')\` к тому же исполняет переданную строку как код в глобальном scope (источник XSS). Поэтому в реализации события обрабатываются именно через \`addEventListener\`, без префикса \`on\`. И не забывайте про XSS-безопасность: значения из \`attrs\` идут через \`setAttribute\`, а не через \`innerHTML\`.

С чего начать:
\`\`\`js
function createElementTree(spec) {
  if (typeof spec === 'string') {
    return document.createTextNode(spec);
  }
  const el = document.createElement(spec.tag);
  // ...
}
\`\`\``,
    ],
    solutionCode: `function createElementTree(spec) {
  if (typeof spec === 'string') {
    return document.createTextNode(spec);
  }
  const el = document.createElement(spec.tag);
  if (spec.attrs) {
    for (const [k, v] of Object.entries(spec.attrs)) {
      el.setAttribute(k, v);
    }
  }
  if (spec.events) {
    for (const [k, handler] of Object.entries(spec.events)) {
      el.addEventListener(k, handler);
    }
  }
  if (spec.children) {
    for (const child of spec.children) {
      el.appendChild(createElementTree(child));
    }
  }
  return el;
}`,
    testHelperCode: `function tree_test(scenario) {
  document.body.innerHTML = '';
  if (scenario === 'simple') {
    const n = createElementTree({ tag: 'div', children: ['hi'] });
    document.body.appendChild(n);
    return n.outerHTML;
  }
  if (scenario === 'nested') {
    const n = createElementTree({
      tag: 'div',
      attrs: { class: 'card' },
      children: [
        { tag: 'h2', children: ['Title'] },
        { tag: 'p', children: ['Body'] },
      ],
    });
    document.body.appendChild(n);
    return n.outerHTML;
  }
  if (scenario === 'event') {
    let clicked = '';
    const n = createElementTree({
      tag: 'button',
      events: { click: () => { clicked = 'clicked'; } },
      children: ['OK'],
    });
    document.body.appendChild(n);
    n.click();
    return clicked;
  }
  if (scenario === 'multi-attrs') {
    const n = createElementTree({
      tag: 'a',
      attrs: { href: '/x', target: '_blank' },
      children: ['Link'],
    });
    return n.outerHTML;
  }
  if (scenario === 'string-only') {
    const t = createElementTree('plain text');
    return t.textContent;
  }
}`,
  },
];
