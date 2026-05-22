import type { TopicFlashcards } from '../../types/flashcard';

export const jsBrowserFlashcards: TopicFlashcards = {
  topicId: 'js-browser',
  cards: [
    {
      id: 'jsbr-f1',
      question: 'Что такое Critical Rendering Path? Опишите основные шаги.',
      answer:
        'CRP — последовательность шагов браузера от получения HTML до первого пикселя на экране: HTML→DOM, CSS→CSSOM, объединение в Render Tree, Layout (геометрия), Paint (пиксели), Composite (слои).',
      keyPoints: [
        'JS блокирует парсинг HTML! Используйте defer/async',
        'CSS блокирует рендер — критические стили инлайни',
        'defer: выполняется после парсинга, в порядке',
        'async: выполняется сразу как загрузится, порядок не гарантирован',
        'preload: загрузить ресурс заранее, но не выполнять',
      ],
    },
    {
      id: 'jsbr-f2',
      question: 'Чем Reflow отличается от Repaint и Composite? Что самое «дорогое»?',
      answer:
        'Reflow (Layout) — пересчёт геометрии всего дерева. Repaint — перерисовка пикселей без геометрии. Composite — перекомпозиция слоёв на GPU. Reflow > Repaint > Composite по стоимости.',
      keyPoints: [
        'Reflow вызывает: width/height/font/top/left, add/remove DOM',
        'Repaint вызывает: color/background/visibility',
        'Composite только: transform/opacity (если есть свой layer)',
        'Animate transform/opacity — самый быстрый путь',
        'will-change: transform — подсказка браузеру создать отдельный layer',
      ],
    },
    {
      id: 'jsbr-f3',
      question: 'Что такое Layout Thrashing? Как его обнаружить и исправить?',
      answer:
        'Layout Thrashing — чередование записей стилей и чтения геометрических свойств в цикле. Каждое чтение (offsetWidth, getBoundingClientRect) после записи стиля принудительно запускает reflow.',
      keyPoints: [
        'Браузер откладывает reflow до конца JS-кода, но чтение геометрии принудительно запускает его',
        'Исправление: сначала все чтения, потом все записи',
        'requestAnimationFrame группирует изменения к следующему кадру',
        'fastdom — библиотека для батчинга read/write',
      ],
      code: `// ❌ Layout Thrashing:
elements.forEach(el => {
  const w = el.offsetWidth; // чтение → reflow
  el.style.width = w + 'px'; // запись
});

// ✅ Сначала все чтения, потом записи:
const widths = elements.map(el => el.offsetWidth);
elements.forEach((el, i) => el.style.width = widths[i] + 'px');`,
    },
    {
      id: 'jsbr-f4',
      question: 'Что такое Core Web Vitals? Назови ключевые метрики и их пороговые значения.',
      answer:
        'Core Web Vitals — набор метрик Google для измерения UX: LCP (загрузка контента), INP (отклик), CLS (стабильность макета). Влияют на SEO-ранжирование.',
      keyPoints: [
        'LCP < 2.5s: когда загружается самый большой видимый элемент',
        'INP < 200ms: время от взаимодействия до следующего кадра',
        'CLS < 0.1: суммарный балл сдвигов макета',
        'CLS улучшить: резервировать место под изображения (width/height атрибуты)',
        'LCP улучшить: preload, CDN, SSR, оптимизация изображений',
      ],
    },
    {
      id: 'jsbr-f5',
      question: 'Зачем requestAnimationFrame вместо setInterval для анимаций?',
      answer:
        'rAF синхронизируется с частотой обновления монитора (60/120fps), не тратит ресурсы когда вкладка неактивна, и позволяет браузеру объединить несколько изменений в один кадр.',
      keyPoints: [
        'setInterval(fn, 16) — не гарантирует совпадение с refresh rate',
        'rAF приостанавливается на неактивных вкладках — экономит батарею',
        'callback получает timestamp — можно считать прошедшее время',
        'Для CSS анимаций — лучше CSS transitions/animations (на compositor thread)',
      ],
    },
    {
      id: 'jsbr-f6',
      question: 'Что такое Virtual Scrolling и когда его применять?',
      answer:
        'Virtual Scrolling — рендеринг только видимых элементов списка + небольшой буфер. Остальные элементы не добавляются в DOM. Применяется для списков от нескольких тысяч элементов.',
      keyPoints: [
        'DOM с 10000 элементами — медленный scroll, большое потребление памяти',
        'Контейнер имеет полную высоту (totalItems * itemHeight)',
        'Рендерятся только items[start..end], позиционируются через translateY',
        'Библиотеки: TanStack Virtual, react-window, react-virtualized',
      ],
    },
  ],
};
