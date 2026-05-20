import type { TopicFlashcards } from '../../types/flashcard';

export const jsDomFlashcards: TopicFlashcards = {
  topicId: 'js-dom',
  cards: [
    {
      id: 'jsdom-f1',
      question: 'Что такое делегирование событий? Зачем оно нужно?',
      answer:
        'Делегирование — добавление одного обработчика на родительский элемент вместо обработчиков на каждый дочерний. Работает за счёт всплытия событий. Эффективно для динамических списков и больших таблиц.',
      keyPoints: [
        'Одни слушатель вместо N — меньше памяти, быстрее добавление',
        'Автоматически работает для новых дочерних элементов',
        'event.target — реальный элемент, на котором произошло событие',
        'event.currentTarget — элемент с обработчиком (родитель)',
      ],
      code: `// ✅ Делегирование — один обработчик
document.querySelector('#list').addEventListener('click', (e) => {
  const item = e.target.closest('.item');
  if (item) handleItemClick(item);
});

// ❌ Без делегирования — N обработчиков
document.querySelectorAll('.item')
  .forEach(el => el.addEventListener('click', handleItemClick));`,
    },
    {
      id: 'jsdom-f2',
      question: 'Что такое всплытие (bubbling) и погружение (capturing)? Как их контролировать?',
      answer:
        'Событие проходит три фазы: захват (от document вниз к цели), цель, всплытие (от цели вверх к document). По умолчанию обработчики срабатывают на фазе всплытия.',
      keyPoints: [
        'Третий аргумент addEventListener(ev, fn, true) — фаза захвата',
        'event.stopPropagation() — остановить распространение',
        'event.stopImmediatePropagation() — остановить + другие обработчики на том же элементе',
        'event.preventDefault() — отменить действие браузера по умолчанию (не остановка)',
      ],
      code: `// Фаза захвата:
el.addEventListener('click', fn, true);

// Всплытие (по умолчанию):
el.addEventListener('click', fn);
el.addEventListener('click', fn, { capture: false });`,
    },
    {
      id: 'jsdom-f3',
      question: 'Чем createElement + appendChild отличается от innerHTML? Когда что использовать?',
      answer:
        'innerHTML удобен, но опасен XSS-атаками при вставке пользовательских данных. createElement создаёт DOM-узел программно — безопасно, но многословно. textContent для текста — всегда безопасен.',
      keyPoints: [
        'innerHTML парсит HTML-строку — риск XSS если данные от пользователя',
        'createElement — безопасно, нет риска инъекций',
        'textContent устанавливает только текст, HTML-теги не интерпретируются',
        'insertAdjacentHTML — быстрее innerHTML для вставки рядом',
      ],
      code: `// ❌ XSS-уязвимость:
el.innerHTML = userInput; // если userInput = '<img onerror=alert(1)>'

// ✅ Безопасно:
const span = document.createElement('span');
span.textContent = userInput; // теги экранируются
el.appendChild(span);`,
    },
    {
      id: 'jsdom-f4',
      question: 'Что такое DocumentFragment и когда его использовать?',
      answer:
        'DocumentFragment — «виртуальный» DOM-контейнер. При вставке через appendChild/append — добавляются только его дети, без самого fragment. Используется для батчинга DOM-операций без лишних reflow.',
      keyPoints: [
        'Манипуляции с Fragment не вызывают reflow',
        'При вставке — Fragment исчезает, его дети переходят в DOM',
        'Полезен при создании списков из N элементов в цикле',
        'React Virtual DOM — похожая идея, но сложнее',
      ],
      code: `const fragment = document.createDocumentFragment();

for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li');
  li.textContent = \`Item \${i}\`;
  fragment.appendChild(li); // не трогает DOM
}

list.appendChild(fragment); // один reflow!`,
    },
    {
      id: 'jsdom-f5',
      question: 'Чем stopPropagation отличается от preventDefault?',
      answer:
        'stopPropagation останавливает распространение события вверх/вниз по дереву DOM. preventDefault отменяет действие браузера по умолчанию (переход по ссылке, отправка формы), но событие продолжает всплывать.',
      keyPoints: [
        'stopPropagation: другие обработчики на родителях не вызовутся',
        'preventDefault: браузер не выполнит действие по умолчанию',
        'Можно вызвать оба одновременно',
        'return false в jQuery = stopPropagation + preventDefault вместе',
      ],
    },
  ],
};
