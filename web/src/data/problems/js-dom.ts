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
    functionName: 'createElement',
    starterCode: `function createElement(descriptor) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsdom-p1-t1',
        inputDisplay: 'createElement({ tag: "div" }) → <div>',
        inputArgs: [{ tag: 'div' }],
        expected: 'DIV',
      },
      {
        id: 'jsdom-p1-t2',
        inputDisplay: 'attrs применяются корректно',
        inputArgs: [{ tag: 'p', attrs: { class: 'text' } }],
        expected: 'text',
      },
      {
        id: 'jsdom-p1-t3',
        inputDisplay: 'текстовые children добавляются',
        inputArgs: [{ tag: 'span', children: ['hello'] }],
        expected: 'hello',
      },
      {
        id: 'jsdom-p1-t4',
        inputDisplay: 'вложенные дочерние элементы',
        inputArgs: [{ tag: 'div', children: [{ tag: 'strong', children: ['text'] }] }],
        expected: 1,
      },
      {
        id: 'jsdom-p1-t5',
        inputDisplay: 'смешанные children: строки и элементы',
        inputArgs: [{ tag: 'p', children: ['a', { tag: 'b', children: ['b'] }] }],
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
    functionName: 'delegate',
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
    functionName: 'serialize',
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
    functionName: 'highlight',
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
    functionName: 'deepCloneNode',
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
  },
];
