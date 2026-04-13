import type { TopicTheory } from '../../types/topic';

export const jsDomTheory: TopicTheory = {
  topicId: 'js-dom',
  sections: [
    {
      title: 'DOM — основы работы',
      blocks: [
        {
          type: 'text',
          content:
            'DOM (Document Object Model) — программный интерфейс для работы с HTML-документом. Браузер парсит HTML и строит дерево узлов. JS может читать и изменять это дерево в реальном времени.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Поиск элементов
const el = document.getElementById('app');
const links = document.querySelectorAll('a.active');
const first = document.querySelector('.item');

// Создание элементов
const div = document.createElement('div');
div.className = 'card';
div.textContent = 'Hello';
div.setAttribute('data-id', '42');

// Добавление в DOM
document.body.appendChild(div);
document.body.prepend(div);        // в начало
el.insertAdjacentElement('afterend', div); // рядом

// Удаление
div.remove();
el.removeChild(div); // старый способ

// Изменение
div.classList.add('active');
div.classList.remove('hidden');
div.classList.toggle('open');
div.classList.contains('active'); // true`,
        },
        {
          type: 'callout',
          calloutType: 'tip',
          content:
            'Для вставки множества элементов используйте `DocumentFragment` — позволяет построить поддерево в памяти и добавить его одним вызовом, что вызывает только одну перерисовку.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// DocumentFragment — батчинг операций
const fragment = document.createDocumentFragment();

const items = ['a', 'b', 'c', 'd', 'e'];
items.forEach((text) => {
  const li = document.createElement('li');
  li.textContent = text;
  fragment.appendChild(li); // добавляем в fragment, не в DOM
});

// Один reflow вместо 5:
document.querySelector('ul').appendChild(fragment);`,
        },
      ],
    },
    {
      title: 'События: всплытие, перехват, делегирование',
      blocks: [
        {
          type: 'text',
          content:
            'При возникновении события браузер проходит три фазы: **capture** (сверху вниз), **target** (элемент-цель), **bubble** (снизу вверх). По умолчанию обработчики срабатывают в фазе bubble.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// Фазы событий
document.addEventListener('click', handler, true);  // capture
document.addEventListener('click', handler, false); // bubble (default)
document.addEventListener('click', handler);        // bubble (default)

// Остановка распространения
element.addEventListener('click', (e) => {
  e.stopPropagation();      // не всплывает выше
  e.stopImmediatePropagation(); // + не срабатывают другие обработчики на этом элементе
  e.preventDefault();       // отменить действие браузера (переход по ссылке и т.д.)
});`,
        },
        {
          type: 'heading',
          content: 'Делегирование событий',
        },
        {
          type: 'text',
          content:
            'Вместо добавления обработчика на каждый дочерний элемент — добавляем один обработчик на родителя. Благодаря всплытию, события дочерних элементов поднимаются до родителя.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// ❌ Плохо: N обработчиков для N кнопок
document.querySelectorAll('.btn').forEach((btn) => {
  btn.addEventListener('click', handleClick);
});

// ✅ Хорошо: один обработчик на родителе
document.querySelector('.button-group').addEventListener('click', (e) => {
  // e.target — элемент на котором произошёл клик
  if (e.target.classList.contains('btn')) {
    handleClick(e.target);
  }
  // Или через closest для вложенных структур:
  const btn = e.target.closest('.btn');
  if (btn) handleClick(btn);
});

// Преимущества делегирования:
// 1. Меньше обработчиков → меньше памяти
// 2. Работает для динамически добавляемых элементов
// 3. Легче управлять (один обработчик)`,
        },
      ],
    },
    {
      title: 'Кастомные события и MutationObserver',
      blocks: [
        {
          type: 'code',
          language: 'javascript',
          content: `// Кастомные события
const event = new CustomEvent('user:login', {
  detail: { userId: 42, name: 'Alice' },
  bubbles: true,       // всплывает
  cancelable: true,    // можно отменить
});

document.dispatchEvent(event);

// Подписка:
document.addEventListener('user:login', (e) => {
  console.log(e.detail.name); // 'Alice'
});`,
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// MutationObserver — следим за изменениями DOM
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      console.log('Добавлено:', mutation.addedNodes);
    }
    if (mutation.type === 'attributes') {
      console.log('Изменён атрибут:', mutation.attributeName);
    }
  });
});

observer.observe(document.body, {
  childList: true,   // следить за добавлением/удалением дочерних узлов
  subtree: true,     // наблюдать за всем поддеревом
  attributes: true,  // следить за атрибутами
});

// Остановить наблюдение:
observer.disconnect();`,
        },
      ],
    },
    {
      title: 'Оптимизация работы с DOM',
      blocks: [
        {
          type: 'list',
          content:
            '**Минимизируйте reflow**: чтение и запись стилей чередуются — каждое чтение после записи вызывает reflow. Группируйте чтения, затем записи.\n**DocumentFragment** для батчинга вставок.\n**requestAnimationFrame** для анимаций — выполняется перед каждым кадром рендеринга.\n**IntersectionObserver** для lazy-loading — эффективнее чем scroll-событие.\n**Virtual DOM** (React, Vue) — diff-алгоритм минимизирует реальные DOM-операции.',
        },
        {
          type: 'code',
          language: 'javascript',
          content: `// ❌ Layout thrashing — чередование read/write
for (const el of elements) {
  const height = el.offsetHeight; // READ — вызывает reflow
  el.style.height = (height * 2) + 'px'; // WRITE
  // На следующей итерации READ снова вызывает reflow!
}

// ✅ Читать всё, потом писать всё
const heights = elements.map((el) => el.offsetHeight); // все READ
elements.forEach((el, i) => {
  el.style.height = (heights[i] * 2) + 'px'; // все WRITE
}); // Один reflow

// requestAnimationFrame для плавной анимации:
function animate() {
  // Изменить стиль
  el.style.left = (parseFloat(el.style.left) + 1) + 'px';
  requestAnimationFrame(animate); // следующий кадр
}
requestAnimationFrame(animate);`,
        },
      ],
    },
  ],
};
