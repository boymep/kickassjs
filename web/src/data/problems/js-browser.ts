import type { Problem } from '../../types/problem';

export const jsBrowserProblems: Problem[] = [
  {
    id: 'jsbr-p1',
    topicId: 'js-browser',
    title: 'virtualScroll — вычисление видимых элементов',
    difficulty: 'medium',
    isContextual: true,
    description: `Реализуйте функцию \`getVisibleRange(scrollTop, containerHeight, itemHeight, totalItems)\`, которая вычисляет, какие элементы списка видимы в данный момент.

Возвращает \`{ startIndex, endIndex, offsetY }\`:
- \`startIndex\` — первый видимый элемент (индекс)
- \`endIndex\` — последний видимый элемент (индекс, не включительно)
- \`offsetY\` — отступ сверху для позиционирования видимых элементов

Примеры:
\`\`\`
getVisibleRange(0, 300, 50, 100);
// → { startIndex: 0, endIndex: 6, offsetY: 0 }
// scrollTop=0, высота контейнера 300, элементы по 50px

getVisibleRange(200, 300, 50, 100);
// → { startIndex: 4, endIndex: 10, offsetY: 200 }
\`\`\``,
    functionName: 'getVisibleRange',
    starterCode: `function getVisibleRange(scrollTop, containerHeight, itemHeight, totalItems) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsbr-p1-t1',
        inputDisplay: 'scrollTop=0, height=300, itemH=50 → start=0',
        inputArgs: [0, 300, 50, 100],
        expected: { startIndex: 0, endIndex: 6, offsetY: 0 },
      },
      {
        id: 'jsbr-p1-t2',
        inputDisplay: 'scrollTop=200, height=300, itemH=50 → start=4',
        inputArgs: [200, 300, 50, 100],
        expected: { startIndex: 4, endIndex: 10, offsetY: 200 },
      },
      {
        id: 'jsbr-p1-t3',
        inputDisplay: 'scrollTop=100, height=100, itemH=50 → 2 элемента',
        inputArgs: [100, 100, 50, 100],
        expected: { startIndex: 2, endIndex: 4, offsetY: 100 },
      },
      {
        id: 'jsbr-p1-t4',
        inputDisplay: 'endIndex не превышает totalItems',
        inputArgs: [4800, 300, 50, 100],
        expected: { startIndex: 96, endIndex: 100, offsetY: 4800 },
      },
      {
        id: 'jsbr-p1-t5',
        inputDisplay: 'scrollTop=150, height=200, itemH=50 → start=3',
        inputArgs: [150, 200, 50, 20],
        expected: { startIndex: 3, endIndex: 7, offsetY: 150 },
      },
    ],
    hints: [
      '`startIndex = Math.floor(scrollTop / itemHeight)`. `offsetY = startIndex * itemHeight`.',
      '`visibleCount = Math.ceil(containerHeight / itemHeight) + 1` (плюс один для частично видимых).',
      '`endIndex = Math.min(startIndex + visibleCount, totalItems)`.',
    ],
    solutionCode: `function getVisibleRange(scrollTop, containerHeight, itemHeight, totalItems) {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight) + 1;
  const endIndex = Math.min(startIndex + visibleCount, totalItems);
  const offsetY = startIndex * itemHeight;
  return { startIndex, endIndex, offsetY };
}`,
  },
  {
    id: 'jsbr-p2',
    topicId: 'js-browser',
    title: 'lazyImages — определить видимые изображения',
    difficulty: 'easy',
    isContextual: true,
    description: `Реализуйте функцию \`getVisibleImages(images, viewport, threshold)\`:
- \`images\` — массив объектов \`{ url, top, height }\` (top — расстояние от начала страницы)
- \`viewport\` — объект \`{ scrollY, height }\` (текущая позиция скролла и высота окна)
- \`threshold\` — дополнительный отступ (загружать заранее, до попадания в видимую область)

Возвращает массив \`url\` изображений, которые нужно загрузить.

Примеры:
\`\`\`
getVisibleImages(
  [{ url: 'a.jpg', top: 0, height: 200 }, { url: 'b.jpg', top: 500, height: 200 }],
  { scrollY: 0, height: 400 },
  100
);
// → ['a.jpg'] (b.jpg at 500 не в viewport + threshold 100)
\`\`\``,
    functionName: 'getVisibleImages',
    starterCode: `function getVisibleImages(images, viewport, threshold = 0) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsbr-p2-t1',
        inputDisplay: 'изображение в viewport → включается',
        inputArgs: [[{ url: 'a.jpg', top: 0, height: 200 }], { scrollY: 0, height: 400 }, 0],
        expected: ['a.jpg'],
      },
      {
        id: 'jsbr-p2-t2',
        inputDisplay: 'изображение ниже viewport → не включается',
        inputArgs: [[{ url: 'b.jpg', top: 600, height: 200 }], { scrollY: 0, height: 400 }, 0],
        expected: [],
      },
      {
        id: 'jsbr-p2-t3',
        inputDisplay: 'threshold=200: загружать за 200px до появления',
        inputArgs: [[{ url: 'c.jpg', top: 550, height: 200 }], { scrollY: 0, height: 400 }, 200],
        expected: ['c.jpg'],
      },
      {
        id: 'jsbr-p2-t4',
        inputDisplay: 'scrollY=300: изображения выше уже прошли',
        inputArgs: [[{ url: 'd.jpg', top: 0, height: 200 }], { scrollY: 300, height: 400 }, 0],
        expected: [],
      },
      {
        id: 'jsbr-p2-t5',
        inputDisplay: 'несколько видимых изображений',
        inputArgs: [
          [{ url: 'e.jpg', top: 100, height: 100 }, { url: 'f.jpg', top: 250, height: 100 }],
          { scrollY: 0, height: 400 },
          0,
        ],
        expected: ['e.jpg', 'f.jpg'],
      },
    ],
    hints: [
      'Элемент видим если: `image.top < viewport.scrollY + viewport.height + threshold` (нижний край viewport + threshold) AND `image.top + image.height > viewport.scrollY` (верхний край viewport).',
      'Фильтруйте массив по этому условию и возвращайте `.map(img => img.url)`.',
    ],
    solutionCode: `function getVisibleImages(images, viewport, threshold = 0) {
  const viewBottom = viewport.scrollY + viewport.height + threshold;
  const viewTop = viewport.scrollY;

  return images
    .filter((img) => img.top < viewBottom && img.top + img.height > viewTop)
    .map((img) => img.url);
}`,
  },
  {
    id: 'jsbr-p3',
    topicId: 'js-browser',
    title: 'srcsetPicker — выбор оптимального изображения',
    difficulty: 'medium',
    isContextual: true,
    description: `Напишите функцию \`pickSrcset(srcset, viewportWidth, dpr)\`:
- \`srcset\` — массив объектов \`{ url, width }\` (ширина изображения в пикселях)
- \`viewportWidth\` — ширина viewport в CSS-пикселях
- \`dpr\` — Device Pixel Ratio (обычно 1, 1.5 или 2)

Возвращает \`url\` наименьшего изображения, которое >= нужной ширины (\`viewportWidth * dpr\`). Если такого нет — наибольшее доступное.

Примеры:
\`\`\`
const srcset = [
  { url: 'img-400.jpg', width: 400 },
  { url: 'img-800.jpg', width: 800 },
  { url: 'img-1200.jpg', width: 1200 },
];
pickSrcset(srcset, 375, 2); // нужно 750px → 'img-800.jpg'
pickSrcset(srcset, 375, 1); // нужно 375px → 'img-400.jpg'
pickSrcset(srcset, 600, 2); // нужно 1200px → 'img-1200.jpg'
\`\`\``,
    functionName: 'pickSrcset',
    starterCode: `function pickSrcset(srcset, viewportWidth, dpr) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsbr-p3-t1',
        inputDisplay: 'viewport=375, dpr=2 → нужно 750px → img-800.jpg',
        inputArgs: [
          [{ url: 'img-400.jpg', width: 400 }, { url: 'img-800.jpg', width: 800 }, { url: 'img-1200.jpg', width: 1200 }],
          375, 2,
        ],
        expected: 'img-800.jpg',
      },
      {
        id: 'jsbr-p3-t2',
        inputDisplay: 'viewport=375, dpr=1 → нужно 375px → img-400.jpg',
        inputArgs: [
          [{ url: 'img-400.jpg', width: 400 }, { url: 'img-800.jpg', width: 800 }],
          375, 1,
        ],
        expected: 'img-400.jpg',
      },
      {
        id: 'jsbr-p3-t3',
        inputDisplay: 'нужно больше максимального → взять максимальный',
        inputArgs: [
          [{ url: 'img-400.jpg', width: 400 }, { url: 'img-800.jpg', width: 800 }],
          600, 2,
        ],
        expected: 'img-800.jpg',
      },
      {
        id: 'jsbr-p3-t4',
        inputDisplay: 'точное совпадение по ширине',
        inputArgs: [
          [{ url: 'img-400.jpg', width: 400 }, { url: 'img-800.jpg', width: 800 }],
          400, 1,
        ],
        expected: 'img-400.jpg',
      },
      {
        id: 'jsbr-p3-t5',
        inputDisplay: 'dpr=1.5, viewport=600 → нужно 900px',
        inputArgs: [
          [{ url: 'img-800.jpg', width: 800 }, { url: 'img-1200.jpg', width: 1200 }],
          600, 1.5,
        ],
        expected: 'img-1200.jpg',
      },
    ],
    hints: [
      'Вычислите нужную ширину: `const needed = viewportWidth * dpr`.',
      'Отсортируйте srcset по ширине и найдите первый элемент с `width >= needed`.',
      'Если не нашли — вернуть последний (максимальный).',
    ],
    solutionCode: `function pickSrcset(srcset, viewportWidth, dpr) {
  const needed = viewportWidth * dpr;
  const sorted = [...srcset].sort((a, b) => a.width - b.width);
  const fit = sorted.find((img) => img.width >= needed);
  return (fit ?? sorted[sorted.length - 1]).url;
}`,
  },
  {
    id: 'jsbr-p4',
    topicId: 'js-browser',
    title: 'criticalCSS — фильтрация используемых стилей',
    difficulty: 'medium',
    isContextual: true,
    description: `Напишите функцию \`extractCriticalCSS(rules, usedClasses)\`:
- \`rules\` — массив объектов \`{ selector, styles }\`
- \`usedClasses\` — Set или массив используемых CSS-классов (без точки)

Возвращает массив rules, где selector содержит хотя бы один используемый класс.

Примеры:
\`\`\`
extractCriticalCSS(
  [
    { selector: '.btn', styles: 'color: red' },
    { selector: '.unused', styles: 'display: none' },
    { selector: '.btn.active', styles: 'color: blue' },
  ],
  ['btn']
);
// → [{ selector: '.btn', ... }, { selector: '.btn.active', ... }]
\`\`\``,
    functionName: 'extractCriticalCSS',
    starterCode: `function extractCriticalCSS(rules, usedClasses) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsbr-p4-t1',
        inputDisplay: 'используется только .btn — .unused отфильтрован',
        inputArgs: [
          [{ selector: '.btn', styles: 'a' }, { selector: '.unused', styles: 'b' }],
          ['btn'],
        ],
        expected: [{ selector: '.btn', styles: 'a' }],
      },
      {
        id: 'jsbr-p4-t2',
        inputDisplay: '.btn.active: оба класса — включается если хоть один используется',
        inputArgs: [
          [{ selector: '.btn.active', styles: 'a' }],
          ['btn'],
        ],
        expected: [{ selector: '.btn.active', styles: 'a' }],
      },
      {
        id: 'jsbr-p4-t3',
        inputDisplay: 'нет используемых классов → пустой массив',
        inputArgs: [
          [{ selector: '.btn', styles: 'a' }],
          [],
        ],
        expected: [],
      },
      {
        id: 'jsbr-p4-t4',
        inputDisplay: 'все классы используются → все правила',
        inputArgs: [
          [{ selector: '.a', styles: 'x' }, { selector: '.b', styles: 'y' }],
          ['a', 'b'],
        ],
        expected: [{ selector: '.a', styles: 'x' }, { selector: '.b', styles: 'y' }],
      },
      {
        id: 'jsbr-p4-t5',
        inputDisplay: 'возвращает правильный selector',
        inputArgs: [
          [{ selector: '.hero', styles: 'font-size: 24px' }],
          ['hero'],
        ],
        expected: [{ selector: '.hero', styles: 'font-size: 24px' }],
      },
    ],
    hints: [
      'Для каждого rule: извлеките классы из selector через regex: `/\\.([\\w-]+)/g`.',
      'Проверьте, есть ли хоть один из этих классов в usedClasses (используйте Set для O(1) поиска).',
      'Верните отфильтрованный массив.',
    ],
    solutionCode: `function extractCriticalCSS(rules, usedClasses) {
  const usedSet = new Set(usedClasses);
  return rules.filter((rule) => {
    const classes = [...rule.selector.matchAll(/\\.([\\w-]+)/g)].map((m) => m[1]);
    return classes.some((cls) => usedSet.has(cls));
  });
}`,
  },
  {
    id: 'jsbr-p5',
    topicId: 'js-browser',
    title: 'batchDOMOps — минимизация reflow',
    difficulty: 'easy',
    isContextual: true,
    description: `Напишите функцию \`batchRead(elements, reader)\`, которая:
1. **Сначала** читает свойство у всех элементов через \`reader(el)\`
2. Возвращает массив прочитанных значений

И функцию \`applyStyles(elements, stylesFn)\`, которая:
1. Применяет стили через \`stylesFn(el, index)\` для каждого элемента

Эти функции разделяют read и write фазы, предотвращая layout thrashing.

Примеры:
\`\`\`
const heights = batchRead(elements, el => el.offsetHeight);
// Все прочитано за 1 reflow

applyStyles(elements, (el, i) => {
  el.style.height = (heights[i] * 2) + 'px';
});
// Все записано — 1 reflow
\`\`\``,
    functionName: 'batchRead_test',
    starterCode: `function batchRead(elements, reader) {
  // ваш код
}

function applyStyles(elements, stylesFn) {
  // ваш код
}`,
    testCases: [
      {
        id: 'jsbr-p5-t1',
        inputDisplay: 'batchRead читает все значения',
        inputArgs: ['read-all'],
        expected: [10, 20, 30],
      },
      {
        id: 'jsbr-p5-t2',
        inputDisplay: 'batchRead возвращает массив',
        inputArgs: ['returns-array'],
        expected: true,
      },
      {
        id: 'jsbr-p5-t3',
        inputDisplay: 'applyStyles вызывает fn для каждого элемента',
        inputArgs: ['apply-all'],
        expected: 3,
      },
      {
        id: 'jsbr-p5-t4',
        inputDisplay: 'applyStyles передаёт правильный индекс',
        inputArgs: ['correct-index'],
        expected: [0, 1, 2],
      },
      {
        id: 'jsbr-p5-t5',
        inputDisplay: 'пустой массив — 0 вызовов',
        inputArgs: ['empty'],
        expected: [],
      },
    ],
    hints: [
      '`batchRead` — это `elements.map(reader)`.',
      '`applyStyles` — это `elements.forEach((el, i) => stylesFn(el, i))`.',
    ],
    solutionCode: `function batchRead(elements, reader) {
  return elements.map(reader);
}

function applyStyles(elements, stylesFn) {
  elements.forEach((el, i) => stylesFn(el, i));
}`,
    testHelperCode: `function batchRead_test(arg) {
  if (arg === 'read-all') {
    return batchRead([{ val: 10 }, { val: 20 }, { val: 30 }], el => el.val);
  }
  if (arg === 'returns-array') return Array.isArray(batchRead([1, 2], x => x));
  if (arg === 'apply-all') {
    let count = 0;
    applyStyles([{}, {}, {}], () => { count++; });
    return count;
  }
  if (arg === 'correct-index') {
    const indices = [];
    applyStyles([{}, {}, {}], (el, i) => { indices.push(i); });
    return indices;
  }
  if (arg === 'empty') return batchRead([], el => el);
}`,
  },
];
