import type { Problem } from "../../types/problem";

export const jsBrowserProblems: Problem[] = [
  {
    id: "jsbr-p1",
    topicId: "js-browser",
    title: "virtualScroll — вычисление видимых элементов",
    difficulty: "medium",
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
    functionName: "getVisibleRange",
    starterCode: `function getVisibleRange(scrollTop, containerHeight, itemHeight, totalItems) {
  // ваш код
}`,
    testCases: [
      {
        id: "jsbr-p1-t1",
        inputDisplay: "scrollTop=0, height=300, itemH=50 → start=0",
        inputArgs: [0, 300, 50, 100],
        expected: { startIndex: 0, endIndex: 6, offsetY: 0 },
      },
      {
        id: "jsbr-p1-t2",
        inputDisplay: "scrollTop=200, height=300, itemH=50 → start=4",
        inputArgs: [200, 300, 50, 100],
        expected: { startIndex: 4, endIndex: 10, offsetY: 200 },
      },
      {
        id: "jsbr-p1-t3",
        inputDisplay: "scrollTop=100, height=100, itemH=50 → 2 элемента",
        inputArgs: [100, 100, 50, 100],
        expected: { startIndex: 2, endIndex: 4, offsetY: 100 },
      },
      {
        id: "jsbr-p1-t4",
        inputDisplay: "endIndex не превышает totalItems",
        inputArgs: [4800, 300, 50, 100],
        expected: { startIndex: 96, endIndex: 100, offsetY: 4800 },
      },
      {
        id: "jsbr-p1-t5",
        inputDisplay: "scrollTop=150, height=200, itemH=50 → start=3",
        inputArgs: [150, 200, 50, 20],
        expected: { startIndex: 3, endIndex: 7, offsetY: 150 },
      },
    ],
    hints: [
      "Как определить, какой элемент находится в верхней части видимой области при заданном scrollTop?",
      "Сколько элементов помещается в контейнер одновременно? Как это помогает найти endIndex?",
    ],
    solutionCode: `function getVisibleRange(scrollTop, containerHeight, itemHeight, totalItems) {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount, totalItems);
  const offsetY = startIndex * itemHeight;
  return { startIndex, endIndex, offsetY };
}`,
  },
  {
    id: "jsbr-p2",
    topicId: "js-browser",
    title: "lazyImages — определить видимые изображения",
    difficulty: "easy",
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
    functionName: "getVisibleImages",
    starterCode: `function getVisibleImages(images, viewport, threshold = 0) {
  // ваш код
}`,
    testCases: [
      {
        id: "jsbr-p2-t1",
        inputDisplay: "изображение в viewport → включается",
        inputArgs: [
          [{ url: "a.jpg", top: 0, height: 200 }],
          { scrollY: 0, height: 400 },
          0,
        ],
        expected: ["a.jpg"],
      },
      {
        id: "jsbr-p2-t2",
        inputDisplay: "изображение ниже viewport → не включается",
        inputArgs: [
          [{ url: "b.jpg", top: 600, height: 200 }],
          { scrollY: 0, height: 400 },
          0,
        ],
        expected: [],
      },
      {
        id: "jsbr-p2-t3",
        inputDisplay: "threshold=200: загружать за 200px до появления",
        inputArgs: [
          [{ url: "c.jpg", top: 550, height: 200 }],
          { scrollY: 0, height: 400 },
          200,
        ],
        expected: ["c.jpg"],
      },
      {
        id: "jsbr-p2-t4",
        inputDisplay: "scrollY=300: изображения выше уже прошли",
        inputArgs: [
          [{ url: "d.jpg", top: 0, height: 200 }],
          { scrollY: 300, height: 400 },
          0,
        ],
        expected: [],
      },
      {
        id: "jsbr-p2-t5",
        inputDisplay: "несколько видимых изображений",
        inputArgs: [
          [
            { url: "e.jpg", top: 100, height: 100 },
            { url: "f.jpg", top: 250, height: 100 },
          ],
          { scrollY: 0, height: 400 },
          0,
        ],
        expected: ["e.jpg", "f.jpg"],
      },
    ],
    hints: [
      "Элемент виден, когда его верхний или нижний край попадает в диапазон видимой области. Учитывай threshold как расширение этого диапазона.",
      "Сначала отфильтруй подходящие изображения, потом верни нужное поле.",
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
    id: "jsbr-p3",
    topicId: "js-browser",
    title: "srcsetPicker — выбор оптимального изображения",
    difficulty: "medium",
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
    functionName: "pickSrcset",
    starterCode: `function pickSrcset(srcset, viewportWidth, dpr) {
  // ваш код
}`,
    testCases: [
      {
        id: "jsbr-p3-t1",
        inputDisplay: "viewport=375, dpr=2 → нужно 750px → img-800.jpg",
        inputArgs: [
          [
            { url: "img-400.jpg", width: 400 },
            { url: "img-800.jpg", width: 800 },
            { url: "img-1200.jpg", width: 1200 },
          ],
          375,
          2,
        ],
        expected: "img-800.jpg",
      },
      {
        id: "jsbr-p3-t2",
        inputDisplay: "viewport=375, dpr=1 → нужно 375px → img-400.jpg",
        inputArgs: [
          [
            { url: "img-400.jpg", width: 400 },
            { url: "img-800.jpg", width: 800 },
          ],
          375,
          1,
        ],
        expected: "img-400.jpg",
      },
      {
        id: "jsbr-p3-t3",
        inputDisplay: "нужно больше максимального → взять максимальный",
        inputArgs: [
          [
            { url: "img-400.jpg", width: 400 },
            { url: "img-800.jpg", width: 800 },
          ],
          600,
          2,
        ],
        expected: "img-800.jpg",
      },
      {
        id: "jsbr-p3-t4",
        inputDisplay: "точное совпадение по ширине",
        inputArgs: [
          [
            { url: "img-400.jpg", width: 400 },
            { url: "img-800.jpg", width: 800 },
          ],
          400,
          1,
        ],
        expected: "img-400.jpg",
      },
      {
        id: "jsbr-p3-t5",
        inputDisplay: "dpr=1.5, viewport=600 → нужно 900px",
        inputArgs: [
          [
            { url: "img-800.jpg", width: 800 },
            { url: "img-1200.jpg", width: 1200 },
          ],
          600,
          1.5,
        ],
        expected: "img-1200.jpg",
      },
    ],
    hints: [
      "Физических пикселей больше, чем CSS-пикселей. Как dpr влияет на нужную ширину изображения?",
      "Среди вариантов нужно найти наименьший, который ещё достаточно крупный для экрана.",
    ],
    solutionCode: `function pickSrcset(srcset, viewportWidth, dpr) {
  const needed = viewportWidth * dpr;
  const sorted = [...srcset].sort((a, b) => a.width - b.width);
  const fit = sorted.find((img) => img.width >= needed);
  return (fit ?? sorted[sorted.length - 1]).url;
}`,
  },
  {
    id: "jsbr-p4",
    topicId: "js-browser",
    title: "criticalCSS — фильтрация используемых стилей",
    difficulty: "medium",
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
    functionName: "extractCriticalCSS",
    starterCode: `function extractCriticalCSS(rules, usedClasses) {
  // ваш код
}`,
    testCases: [
      {
        id: "jsbr-p4-t1",
        inputDisplay: "используется только .btn — .unused отфильтрован",
        inputArgs: [
          [
            { selector: ".btn", styles: "a" },
            { selector: ".unused", styles: "b" },
          ],
          ["btn"],
        ],
        expected: [{ selector: ".btn", styles: "a" }],
      },
      {
        id: "jsbr-p4-t2",
        inputDisplay:
          ".btn.active: оба класса — включается если хоть один используется",
        inputArgs: [[{ selector: ".btn.active", styles: "a" }], ["btn"]],
        expected: [{ selector: ".btn.active", styles: "a" }],
      },
      {
        id: "jsbr-p4-t3",
        inputDisplay: "нет используемых классов → пустой массив",
        inputArgs: [[{ selector: ".btn", styles: "a" }], []],
        expected: [],
      },
      {
        id: "jsbr-p4-t4",
        inputDisplay: "все классы используются → все правила",
        inputArgs: [
          [
            { selector: ".a", styles: "x" },
            { selector: ".b", styles: "y" },
          ],
          ["a", "b"],
        ],
        expected: [
          { selector: ".a", styles: "x" },
          { selector: ".b", styles: "y" },
        ],
      },
      {
        id: "jsbr-p4-t5",
        inputDisplay: "возвращает правильный selector",
        inputArgs: [
          [{ selector: ".hero", styles: "font-size: 24px" }],
          ["hero"],
        ],
        expected: [{ selector: ".hero", styles: "font-size: 24px" }],
      },
    ],
    hints: [
      "Как извлечь имена классов из CSS-селектора вида `.foo`, `.bar-item`?",
      "Как эффективно проверить, используется ли хоть один класс правила на странице?",
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
    id: "jsbr-p5",
    topicId: "js-browser",
    title: "batchDOMOps — минимизация reflow",
    difficulty: "easy",
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
    functionName: "batchRead_test",
    starterCode: `function batchRead(elements, reader) {
  // ваш код
}

function applyStyles(elements, stylesFn) {
  // ваш код
}`,
    testCases: [
      {
        id: "jsbr-p5-t1",
        inputDisplay: "batchRead читает все значения",
        inputArgs: ["read-all"],
        expected: [10, 20, 30],
      },
      {
        id: "jsbr-p5-t2",
        inputDisplay: "batchRead возвращает массив",
        inputArgs: ["returns-array"],
        expected: true,
      },
      {
        id: "jsbr-p5-t3",
        inputDisplay: "applyStyles вызывает fn для каждого элемента",
        inputArgs: ["apply-all"],
        expected: 3,
      },
      {
        id: "jsbr-p5-t4",
        inputDisplay: "applyStyles передаёт правильный индекс",
        inputArgs: ["correct-index"],
        expected: [0, 1, 2],
      },
      {
        id: "jsbr-p5-t5",
        inputDisplay: "пустой массив — 0 вызовов",
        inputArgs: ["empty"],
        expected: [],
      },
    ],
    hints: [
      "batchRead должна вернуть результаты для каждого элемента. Какой метод массива трансформирует каждый элемент?",
      "applyStyles применяет функцию к каждому элементу с его индексом. Какой метод массива для этого подходит?",
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
  {
    kind: "predict-output",
    id: "jsb-p6",
    topicId: "js-browser",
    title: "Определи вывод: getBoundingClientRect в цикле и счётчик reflow",
    difficulty: "medium",
    isContextual: false,
    description: `Перед тобой упрощённая модель браузера: переменная \`reflows\` увеличивается каждый раз, когда **читается** геометрия элемента, а layout перед этим стал «грязным» (\`layoutDirty = true\`). Запись стиля помечает layout как «грязный». Чтение \`offsetWidth\` сбрасывает флаг и при необходимости прибавляет \`+1\` к \`reflows\`.

Это рабочая модель **layout thrashing** — ситуации, когда чтения и записи перемешаны и браузер вынужден пересчитывать layout снова и снова. Введи последнюю напечатанную строку: значение \`reflows\` и финальный \`total\`, разделённые пробелом — в том же формате, что выводит \`console.log\`.

**Подсказка:** посмотри, на каждой ли итерации цикла происходит принудительный пересчёт (reflow) и сколько всего раз чтение приходится после «грязной» записи.`,
    code: `let reflows = 0;
let layoutDirty = true;

const elements = [
  { _w: 10 }, { _w: 20 }, { _w: 30 },
];

function readWidth(el) {
  if (layoutDirty) { reflows++; layoutDirty = false; }
  return el._w;
}
function writeWidth(el, val) {
  el._w = val;
  layoutDirty = true;
}

let total = 0;
elements.forEach((el) => {
  const w = readWidth(el);   // READ — может вызвать reflow
  writeWidth(el, w + 1);     // WRITE — делает layout dirty
  total += w;
});

console.log('reflows', reflows, 'total', total);`,
    expected: "reflows 3 total 60",
    hints: [
      "Когда происходит reflow — при каждом чтении, или только когда после записи идёт чтение?",
      "Проследи значение layoutDirty на каждой итерации. Как меняется total?",
    ],
    solutionCode: `// Это predict-output, кода-решения нет. Правильный ответ:
// reflows 3 total 60
// Каждая итерация делает READ после dirty-WRITE предыдущей итерации,
// поэтому каждое чтение принудительно вызывает reflow.`,
  },
  {
    kind: "find-bug",
    id: "jsb-p7",
    topicId: "js-browser",
    title: "Найди баг: слишком много reflow при обходе элементов",
    difficulty: "easy",
    isContextual: false,
    description: `Функция \`doubleWidths(elements)\` должна удвоить ширину каждого элемента. Корректность не страдает, но с производительностью что-то не так.

Тестовый счётчик \`getReflowCount()\` считает reflow-ы. Для массива из 5 элементов функция должна вызывать **ровно 1** reflow. Найди причину и исправь.`,
    buggyCode: `function doubleWidths(elements) {
  elements.forEach((el) => {
    const w = readWidth(el);
    writeWidth(el, w * 2);
  });
}`,
    functionName: "jsb_p7_test",
    bugSummary:
      "Layout thrashing: чередование read/write в одном цикле вынуждает браузер пересчитывать layout на каждой итерации. Решение — разделить фазы: сначала собрать все ширины через map, затем во втором проходе записать удвоенные значения. Тогда reflow срабатывает один раз — на первом READ.",
    testCases: [
      {
        id: "jsb-p7-t1",
        inputDisplay: "все ширины удвоены",
        inputArgs: ["values"],
        expected: [20, 40, 60, 80, 100],
      },
      {
        id: "jsb-p7-t2",
        inputDisplay: "5 элементов → ровно 1 reflow (батчинг)",
        inputArgs: ["reflows"],
        expected: 1,
      },
      {
        id: "jsb-p7-t3",
        inputDisplay: "пустой массив → 0 reflow",
        inputArgs: ["empty"],
        expected: 0,
      },
      {
        id: "jsb-p7-t4",
        inputDisplay: "1 элемент → ровно 1 reflow",
        inputArgs: ["single"],
        expected: 1,
      },
    ],
    hints: [
      "Layout thrashing происходит, когда чтение и запись перемежаются. Что изменится, если разделить их на два отдельных прохода?",
      "Сначала прочитай всё необходимое, потом запиши всё за один проход.",
    ],
    solutionCode: `function doubleWidths(elements) {
  // Сначала все READ — один reflow на всю партию.
  const widths = elements.map((el) => readWidth(el));
  // Затем все WRITE — следующего reflow не будет до выхода из функции.
  elements.forEach((el, i) => writeWidth(el, widths[i] * 2));
}`,
    testHelperCode: `// Mock-окружение browser layout: счётчик reflow.
let __reflows = 0;
let __layoutDirty = true;
function readWidth(el) {
  if (__layoutDirty) { __reflows++; __layoutDirty = false; }
  return el._w;
}
function writeWidth(el, val) {
  el._w = val;
  __layoutDirty = true;
}
function jsb_p7_test(arg) {
  __reflows = 0;
  __layoutDirty = true;
  if (arg === 'values') {
    const els = [{ _w: 10 }, { _w: 20 }, { _w: 30 }, { _w: 40 }, { _w: 50 }];
    doubleWidths(els);
    return els.map((e) => e._w);
  }
  if (arg === 'reflows') {
    const els = [{ _w: 1 }, { _w: 2 }, { _w: 3 }, { _w: 4 }, { _w: 5 }];
    doubleWidths(els);
    return __reflows;
  }
  if (arg === 'empty') {
    doubleWidths([]);
    return __reflows;
  }
  if (arg === 'single') {
    doubleWidths([{ _w: 7 }]);
    return __reflows;
  }
}`,
  },
  {
    kind: "refactor",
    id: "jsb-p8",
    topicId: "js-browser",
    title: "Оптимизируй: серия insertBefore → DocumentFragment",
    difficulty: "medium",
    isContextual: false,
    description: `Функция \`buildList(parent, items, createNode)\` вставляет в \`parent\` новые узлы в порядке \`items\`, используя \`createNode(item)\` для создания каждого. Текущая реализация делает \`parent.insertBefore(node, null)\` в цикле — каждая вставка отдельной операцией. В реальном DOM это запускает reflow и paint после **каждой** вставки.

Перепиши функцию так, чтобы все узлы сначала собирались в **DocumentFragment**, а в конце фрагмент **одной операцией** вставлялся в \`parent\`. Корректность: финальное содержимое \`parent.children\` должно совпадать с прежним — элемент к элементу, в том же порядке.

В тестах используется mock-DOM со счётчиком \`getInsertCount()\`. Правильная реализация делает ровно **1** вставку в \`parent\` (фрагмент), независимо от количества items.`,
    functionName: "jsb_p8_test",
    starterCode: `function buildList(parent, items, createNode) {
  // Антипаттерн: N отдельных вставок в parent.
  // Каждая insertBefore = отдельный reflow в реальном DOM.
  for (const item of items) {
    const node = createNode(item);
    parent.insertBefore(node, null);
  }
}`,
    testCases: [
      {
        id: "jsb-p8-t1",
        inputDisplay: "порядок вставок сохранён",
        inputArgs: ["order"],
        expected: ["a", "b", "c", "d"],
      },
      {
        id: "jsb-p8-t2",
        inputDisplay: "4 items → ровно 1 вставка в parent (фрагмент)",
        inputArgs: ["inserts"],
        expected: 1,
      },
      {
        id: "jsb-p8-t3",
        inputDisplay: "пустой массив → 0 вставок",
        inputArgs: ["empty-inserts"],
        expected: 0,
      },
      {
        id: "jsb-p8-t4",
        inputDisplay: "пустой массив → пустой parent",
        inputArgs: ["empty-children"],
        expected: [],
      },
      {
        id: "jsb-p8-t5",
        inputDisplay: "1 item → 1 вставка",
        inputArgs: ["single"],
        expected: 1,
      },
    ],
    hints: [
      "Что даёт DocumentFragment в сравнении с прямым appendChild в parent на каждой итерации?",
      "Сначала собери все узлы в одном месте, потом вставь всё разом.",
    ],
    solutionCode: `function buildList(parent, items, createNode) {
  const fragment = document.createDocumentFragment();
  for (const item of items) {
    fragment.appendChild(createNode(item));
  }
  parent.appendChild(fragment);
}`,
    testHelperCode: `// Используем реальный DOM iframe-сэндбокса и счётчик прямых вставок в parent.
function __makeCountedParent() {
  const parent = document.createElement('div');
  parent.__inserts = 0;
  const origAppend = parent.appendChild.bind(parent);
  const origInsert = parent.insertBefore.bind(parent);
  parent.appendChild = function (child) {
    parent.__inserts++;
    return origAppend(child);
  };
  parent.insertBefore = function (child, ref) {
    parent.__inserts++;
    return origInsert(child, ref);
  };
  return parent;
}
function jsb_p8_test(arg) {
  if (arg === 'order') {
    const parent = __makeCountedParent();
    buildList(parent, ['a', 'b', 'c', 'd'], (v) => {
      const n = document.createElement('span');
      n.textContent = v;
      return n;
    });
    return Array.from(parent.children).map((n) => n.textContent);
  }
  if (arg === 'inserts') {
    const parent = __makeCountedParent();
    buildList(parent, [1, 2, 3, 4], (v) => {
      const n = document.createElement('span');
      n.textContent = String(v);
      return n;
    });
    return parent.__inserts;
  }
  if (arg === 'empty-inserts') {
    const parent = __makeCountedParent();
    buildList(parent, [], (v) => document.createElement('span'));
    return parent.__inserts;
  }
  if (arg === 'empty-children') {
    const parent = __makeCountedParent();
    buildList(parent, [], (v) => document.createElement('span'));
    return Array.from(parent.children).map((n) => n.textContent);
  }
  if (arg === 'single') {
    const parent = __makeCountedParent();
    buildList(parent, ['x'], (v) => {
      const n = document.createElement('span');
      n.textContent = v;
      return n;
    });
    return parent.__inserts;
  }
}`,
  },
  {
    id: "jsbr-h1",
    topicId: "js-browser",
    kind: "implement",
    title: "Виртуальный скролл — рендерим только видимые элементы",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте функцию \`createVirtualList({ container, itemHeight, items, renderItem })\`, которая реализует **виртуальный скролл**: в DOM в любой момент присутствует только небольшое число видимых элементов.

Параметры:
- \`container\` — DOM-элемент с фиксированной высотой и \`overflow: auto\`
- \`itemHeight\` — высота каждого элемента (px, фиксированная)
- \`items\` — массив данных
- \`renderItem(data, index)\` — функция создания DOM-узла

Функция должна:
1. Создать "spacer" нужной высоты (items.length * itemHeight) для корректного скроллбара
2. При scroll-событии рендерить только видимые элементы (± небольшой overscan = 3)
3. Позиционировать видимые элементы через \`translateY\`

Верните объект \`{ destroy() }\` для очистки.`,
    functionName: "createVirtualList_test",
    starterCode: `function createVirtualList({ container, itemHeight, items, renderItem }) {
  // ваш код
  return { destroy() {} };
}`,
    testCases: [
      {
        id: "jsbr-h1-t1",
        inputDisplay: "изначально рендерит только видимые + overscan",
        inputArgs: ["initial-render"],
        expected: true,
      },
      {
        id: "jsbr-h1-t2",
        inputDisplay: "общее число DOM-узлов намного меньше items.length",
        inputArgs: ["dom-count"],
        expected: true,
      },
      {
        id: "jsbr-h1-t3",
        inputDisplay: "высота spacer = totalHeight",
        inputArgs: ["spacer-height"],
        expected: 10000,
      },
      {
        id: "jsbr-h1-t4",
        inputDisplay: "destroy() удаляет все узлы и события",
        inputArgs: ["destroy"],
        expected: 0,
      },
    ],
    hints: [
      "Как создать иллюзию полного списка, не рендеря все элементы? Что задаёт суммарную высоту прокручиваемой области?",
      "При скролле нужно пересчитать, какие элементы сейчас видны, и позиционировать их абсолютно.",
      "Убедись, что destroy() корректно убирает все побочные эффекты.",
    ],
    solutionCode: `function createVirtualList({ container, itemHeight, items, renderItem }) {
  const overscan = 3;
  const totalHeight = items.length * itemHeight;

  const spacer = document.createElement('div');
  spacer.style.height = totalHeight + 'px';
  spacer.style.position = 'relative';
  container.appendChild(spacer);

  const viewport = document.createElement('div');
  viewport.style.position = 'absolute';
  viewport.style.top = '0';
  viewport.style.width = '100%';
  spacer.appendChild(viewport);

  function render() {
    const scrollTop = container.scrollTop;
    const containerH = container.clientHeight || 300;

    const startIdx = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIdx = Math.min(items.length - 1, Math.ceil((scrollTop + containerH) / itemHeight) + overscan);

    viewport.innerHTML = '';
    for (let i = startIdx; i <= endIdx; i++) {
      const el = renderItem(items[i], i);
      el.style.position = 'absolute';
      el.style.top = '0';
      el.style.transform = 'translateY(' + (i * itemHeight) + 'px)';
      el.style.width = '100%';
      viewport.appendChild(el);
    }
  }

  render();
  container.addEventListener('scroll', render);

  return {
    destroy() {
      container.removeEventListener('scroll', render);
      container.innerHTML = '';
    }
  };
}`,
    testHelperCode: `function createVirtualList_test(scenario) {
  const container = document.createElement('div');
  container.style.height = '300px';
  container.style.overflow = 'auto';
  document.body.appendChild(container);

  const ITEM_H = 50;
  const TOTAL = 200;
  const items = Array.from({ length: TOTAL }, (_, i) => 'Item ' + i);
  const renderItem = (data, i) => {
    const el = document.createElement('div');
    el.style.height = ITEM_H + 'px';
    el.textContent = data;
    el.dataset.idx = String(i);
    return el;
  };

  const vl = createVirtualList({ container, itemHeight: ITEM_H, items, renderItem });

  let result;
  if (scenario === 'initial-render') {
    const rendered = container.querySelectorAll('[data-idx]').length;
    result = rendered > 0 && rendered < TOTAL;
  }
  if (scenario === 'dom-count') {
    const rendered = container.querySelectorAll('[data-idx]').length;
    result = rendered < TOTAL * 0.2; // намного меньше всего списка
  }
  if (scenario === 'spacer-height') {
    const spacer = container.firstChild;
    result = parseInt(spacer?.style?.height ?? '0');
  }
  if (scenario === 'destroy') {
    vl.destroy();
    result = container.children.length;
  }

  if (scenario !== 'destroy') vl.destroy();
  document.body.removeChild(container);
  return result ?? null;
}`,
  },
  {
    id: "jsbr-h2",
    topicId: "js-browser",
    kind: "implement",
    title: "useFetch — хук для отмены устаревших запросов",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте функцию \`createFetchManager()\`, которая возвращает объект с методом \`fetch(url)\`.

Ключевое требование: если \`fetch\` вызван повторно до завершения предыдущего — предыдущий запрос **отменяется** (через \`AbortController\`) и его результат игнорируется.

Это решает проблему race condition при быстром поиске: пользователь набирает текст, каждый символ запускает запрос, но только последний важен.

\`\`\`js
const manager = createFetchManager();

// Быстро один за другим:
manager.fetch('/api?q=h');     // отменяется
manager.fetch('/api?q=he');    // отменяется
manager.fetch('/api?q=hel');   // завершается
\`\`\``,
    functionName: "createFetchManager_test",
    starterCode: `function createFetchManager() {
  return {
    fetch(url) {
      // ваш код — возвращает Promise
    }
  };
}`,
    testCases: [
      {
        id: "jsbr-h2-t1",
        inputDisplay: "последний запрос завершается успешно",
        inputArgs: ["last-succeeds"],
        expected: "last",
      },
      {
        id: "jsbr-h2-t2",
        inputDisplay: "предыдущие запросы отменяются",
        inputArgs: ["prev-aborted"],
        expected: true,
      },
      {
        id: "jsbr-h2-t3",
        inputDisplay: "одиночный запрос возвращает данные",
        inputArgs: ["single"],
        expected: "data",
      },
    ],
    hints: [
      "Как отменить предыдущий запрос, когда приходит новый? Что нужно хранить между вызовами?",
      "fetch принимает параметр, позволяющий прервать запрос извне. Как его подключить к механизму отмены?",
    ],
    solutionCode: `function createFetchManager() {
  let currentController = null;

  return {
    fetch(url) {
      // Отменяем предыдущий
      if (currentController) currentController.abort();

      currentController = new AbortController();
      const { signal } = currentController;

      return globalThis.fetch(url, { signal })
        .then(r => r.text())
        .catch(err => {
          if (err.name === 'AbortError') return new Promise(() => {}); // навсегда «подвисший» промис
          throw err;
        });
    }
  };
}`,
    testHelperCode: `async function createFetchManager_test(scenario) {
  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  if (scenario === 'single') {
    const origFetch = globalThis.fetch;
    globalThis.fetch = async (url, opts) => {
      await delay(10);
      if (opts?.signal?.aborted) throw Object.assign(new Error('abort'), { name: 'AbortError' });
      return { text: async () => 'data' };
    };
    const manager = createFetchManager();
    const result = await manager.fetch('/test');
    globalThis.fetch = origFetch;
    return result;
  }

  if (scenario === 'last-succeeds') {
    const calls = [];
    const origFetch = globalThis.fetch;
    globalThis.fetch = async (url, opts) => {
      await delay(30);
      if (opts?.signal?.aborted) throw Object.assign(new Error('abort'), { name: 'AbortError' });
      return { text: async () => url };
    };
    const manager = createFetchManager();
    const p1 = manager.fetch('first');
    const p2 = manager.fetch('last');
    const result = await p2;
    globalThis.fetch = origFetch;
    return result;
  }

  if (scenario === 'prev-aborted') {
    let abortedCount = 0;
    const origFetch = globalThis.fetch;
    globalThis.fetch = async (url, opts) => {
      await delay(50);
      if (opts?.signal?.aborted) { abortedCount++; throw Object.assign(new Error('abort'), { name: 'AbortError' }); }
      return { text: async () => url };
    };
    const manager = createFetchManager();
    manager.fetch('a');
    manager.fetch('b');
    await manager.fetch('c');
    globalThis.fetch = origFetch;
    return abortedCount >= 1;
  }
}`,
  },
  {
    id: "jsbr-e2",
    topicId: "js-browser",
    title: "classNames — собрать CSS-классы из условий",
    difficulty: "easy",
    isContextual: false,
    description: `Реализуйте утилиту \`classNames(...args)\` — она принимает произвольное число аргументов и собирает из них **строку с CSS-классами**, разделённых пробелом. Это аналог популярной библиотеки [classnames](https://www.npmjs.com/package/classnames).

Поддерживаемые типы аргументов:
- **строка** — добавляется как есть.
- **массив** — рекурсивно обрабатывается.
- **объект** — ключи, значения которых **truthy**, добавляются. Ключи с **falsy** значениями игнорируются.
- **falsy-значения** (\`null\`, \`undefined\`, \`false\`, \`0\`, \`''\`) — игнорируются.

Дубликатов и пробелов в конце быть не должно? — нет, для простоты не дедуплицируем; просто склеиваем непустые сегменты через один пробел.

Пример:
\`\`\`
classNames('a', 'b');                              // → 'a b'
classNames('a', null, undefined, false, 'b');      // → 'a b'
classNames('btn', { primary: true, large: false }); // → 'btn primary'
classNames(['a', 'b'], 'c');                       // → 'a b c'
classNames();                                      // → ''
\`\`\`

Такая утилита постоянно встречается в React-проектах, и её часто просят реализовать на собеседовании.`,
    functionName: 'classNames',
    starterCode: `function classNames(...args) {
  // ваш код
}`,
    testCases: [
      { id: 'jsbr-e2-t1', inputDisplay: "classNames('a', 'b')", inputArgs: ['a', 'b'], expected: 'a b' },
      { id: 'jsbr-e2-t2', inputDisplay: "falsy values пропускаются", inputArgs: ['a', null, undefined, false, 0, '', 'b'], expected: 'a b' },
      { id: 'jsbr-e2-t3', inputDisplay: "object с условиями", inputArgs: ['btn', { primary: true, large: false, disabled: 1 }], expected: 'btn primary disabled' },
      { id: 'jsbr-e2-t4', inputDisplay: "массивы и вложенные", inputArgs: [['a', 'b'], 'c', ['d', ['e']]], expected: 'a b c d e' },
      { id: 'jsbr-e2-t5', inputDisplay: "пустой вызов → ''", inputArgs: [], expected: '' },
      { id: 'jsbr-e2-t6', inputDisplay: "только одно значение", inputArgs: ['x'], expected: 'x' },
    ],
    hints: [
      'Сделайте рекурсивную обработку: для каждого аргумента — собирайте кусочки в массив.',
      'Для object — переберите ключи через `Object.entries` и пропустите те, где значение falsy.',
      'В конце — `result.join(" ")`.',
    ],
    solutionCode: `function classNames(...args) {
  const parts = [];
  function add(x) {
    if (!x) return;
    if (typeof x === 'string') {
      parts.push(x);
    } else if (Array.isArray(x)) {
      for (const item of x) add(item);
    } else if (typeof x === 'object') {
      for (const [k, v] of Object.entries(x)) {
        if (v) parts.push(k);
      }
    }
  }
  for (const a of args) add(a);
  return parts.join(' ');
}`,
  },
  {
    id: "jsbr-h3",
    topicId: "js-browser",
    kind: "implement",
    title: "rafThrottle — троттлинг через requestAnimationFrame",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте \`rafThrottle(fn)\` — обёртку, которая ограничивает частоту вызова \`fn\` **одним вызовом за кадр** (через \`requestAnimationFrame\`):

- если \`throttled()\` вызывается несколько раз внутри одного кадра — \`fn\` вызовется **один раз** в следующем кадре с аргументами **первого** вызова, остальные игнорируются.
- следующий «слот» открывается только после того, как RAF сработал.

Это типичный приём оптимизации обработчиков \`scroll\`, \`mousemove\` и \`resize\`: вместо десятков срабатываний за миллисекунду мы делаем работу ровно один раз перед следующей отрисовкой кадра.

Пример:
\`\`\`
let n = 0;
const t = rafThrottle((x) => { n = x; });
t(1); t(2); t(3);  // три вызова в одном тике
// после requestAnimationFrame: n === 1   (выиграл первый, не последний)
\`\`\``,
    functionName: 'rafThrottle_test',
    starterCode: `function rafThrottle(fn) {
  // ваш код — requestAnimationFrame, не setTimeout
}`,
    testCases: [
      { id: 'jsbr-h3-t1', inputDisplay: "3 быстрых вызова → fn вызвана 1 раз", inputArgs: ['rapid-three'], expected: 1 },
      { id: 'jsbr-h3-t2', inputDisplay: "выигрывает аргумент первого вызова", inputArgs: ['first-wins'], expected: 'A' },
      { id: 'jsbr-h3-t3', inputDisplay: "после кадра — новый слот", inputArgs: ['two-frames'], expected: 2 },
      { id: 'jsbr-h3-t4', inputDisplay: "без вызовов fn не сработает", inputArgs: ['no-calls'], expected: 0 },
    ],
    hints: [
      'Используйте `let scheduled = false` и `requestAnimationFrame` для отложенного вызова.',
      'Запомните аргументы **первого** вызова и используйте их при вызове fn в кадре.',
      'Не забудьте сбросить `scheduled` после вызова, чтобы открыть слот для следующего кадра.',
    ],
    solutionCode: `function rafThrottle(fn) {
  let scheduled = false;
  let savedArgs = null;
  return function (...args) {
    if (scheduled) return;
    scheduled = true;
    savedArgs = args;
    requestAnimationFrame(() => {
      fn(...savedArgs);
      scheduled = false;
      savedArgs = null;
    });
  };
}`,
    testHelperCode: `async function rafThrottle_test(scenario) {
  const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));

  if (scenario === 'rapid-three') {
    let calls = 0;
    const t = rafThrottle(() => { calls++; });
    t(); t(); t();
    await nextFrame();
    await nextFrame();
    return calls;
  }
  if (scenario === 'first-wins') {
    let value = null;
    const t = rafThrottle((x) => { value = x; });
    t('A'); t('B'); t('C');
    await nextFrame();
    await nextFrame();
    return value;
  }
  if (scenario === 'two-frames') {
    let calls = 0;
    const t = rafThrottle(() => { calls++; });
    t();
    await nextFrame();
    await nextFrame();
    t();
    await nextFrame();
    await nextFrame();
    return calls;
  }
  if (scenario === 'no-calls') {
    let calls = 0;
    rafThrottle(() => { calls++; });
    await nextFrame();
    return calls;
  }
}`,
  },
  {
    id: "jsbr-h4",
    topicId: "js-browser",
    kind: "implement",
    title: "formToJSON — сериализация HTML-формы в объект",
    difficulty: "hard",
    isContextual: false,
    description: `Реализуйте \`formToJSON(form)\` — функцию, которая принимает DOM-элемент \`<form>\` и возвращает объект с её значениями:

- Поле \`<input name="email">\` → ключ \`email\`.
- Несколько полей с одним и тем же \`name\` (например, чекбоксы или multi-select) → массив значений.
- Чекбокс **не отмечен** → ключ **отсутствует** в результате.
- Поле \`<input type="number">\` → строковое значение (как и в нативном FormData).
- Не включаются: \`<button>\`, \`<input type="submit">\`, поля без \`name\`.

**Запрещено** использовать \`new FormData()\` — реализуйте через обход \`form.elements\`.

Хорошее упражнение на знание DOM API и работы с формами.`,
    functionName: 'formToJSON_test',
    starterCode: `function formToJSON(form) {
  // ваш код — без new FormData()
}`,
    testCases: [
      { id: 'jsbr-h4-t1', inputDisplay: "простая форма с тремя полями", inputArgs: ['basic'], expected: { name: 'Alice', age: '30', email: 'a@b.com' } },
      { id: 'jsbr-h4-t2', inputDisplay: "неотмеченный чекбокс — ключ отсутствует", inputArgs: ['unchecked'], expected: { agree: 'on' } },
      { id: 'jsbr-h4-t3', inputDisplay: "несколько чекбоксов с тем же name → массив", inputArgs: ['multi-checkbox'], expected: { hobby: ['code', 'read'] } },
      { id: 'jsbr-h4-t4', inputDisplay: "select-one + textarea", inputArgs: ['select-textarea'], expected: { country: 'RU', bio: 'Hello' } },
      { id: 'jsbr-h4-t5', inputDisplay: "поля без name и кнопки пропускаются", inputArgs: ['skip-noname-and-button'], expected: { used: 'yes' } },
    ],
    hints: [
      'Обойдите `form.elements` — это коллекция всех элементов формы.',
      'Пропускайте: элементы без `name`, кнопки (`type==="submit"`/`"button"`), неотмеченные чекбоксы/радио.',
      'Для multi-полей (несколько с одним name) собирайте значения в массив.',
    ],
    solutionCode: `function formToJSON(form) {
  const result = {};
  for (const el of form.elements) {
    if (!el.name) continue;
    if (el.type === 'submit' || el.type === 'button' || el.type === 'reset') continue;
    if ((el.type === 'checkbox' || el.type === 'radio') && !el.checked) continue;
    const value = el.value;
    if (result[el.name] !== undefined) {
      if (Array.isArray(result[el.name])) {
        result[el.name].push(value);
      } else {
        result[el.name] = [result[el.name], value];
      }
    } else {
      result[el.name] = value;
    }
  }
  return result;
}`,
    testHelperCode: `function formToJSON_test(scenario) {
  document.body.innerHTML = '';
  const form = document.createElement('form');
  const add = (html) => { form.insertAdjacentHTML('beforeend', html); };

  if (scenario === 'basic') {
    add('<input name="name" value="Alice">');
    add('<input name="age" value="30">');
    add('<input name="email" value="a@b.com">');
    document.body.appendChild(form);
    return formToJSON(form);
  }
  if (scenario === 'unchecked') {
    add('<input type="checkbox" name="agree" checked>');
    add('<input type="checkbox" name="news">');
    document.body.appendChild(form);
    return formToJSON(form);
  }
  if (scenario === 'multi-checkbox') {
    add('<input type="checkbox" name="hobby" value="code" checked>');
    add('<input type="checkbox" name="hobby" value="read" checked>');
    add('<input type="checkbox" name="hobby" value="run">');
    document.body.appendChild(form);
    return formToJSON(form);
  }
  if (scenario === 'select-textarea') {
    add('<select name="country"><option value="RU" selected>RU</option><option value="US">US</option></select>');
    add('<textarea name="bio">Hello</textarea>');
    document.body.appendChild(form);
    return formToJSON(form);
  }
  if (scenario === 'skip-noname-and-button') {
    add('<input value="no-name-field">');
    add('<button type="submit" name="submit-btn">Send</button>');
    add('<input name="used" value="yes">');
    document.body.appendChild(form);
    return formToJSON(form);
  }
}`,
  },
];
