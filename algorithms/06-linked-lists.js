// =====================================================
// Связные списки — подготовка к собеседованию
// =====================================================
// Запуск: node algorithms/06-linked-lists.js

function assert(condition, message) {
  if (!condition) {
    console.error("❌ " + message);
  } else {
    console.log("✅ " + message);
  }
}

function assertDeepEqual(a, b, message) {
  assert(
    JSON.stringify(a) === JSON.stringify(b),
    message + " | got: " + JSON.stringify(a) + ", expected: " + JSON.stringify(b),
  );
}

// =====================================================
// * КАК РАБОТАЮТ СВЯЗНЫЕ СПИСКИ
// =====================================================
//
// Односвязный список — цепочка узлов, каждый хранит значение
// и ссылку на следующий узел (или null).
//
// Структура узла:
//   { val: число, next: узел | null }
//
// ! Ключевые операции:
//   - Обход: while (node !== null) { ... node = node.next; }
//   - Вставка в начало: O(1)
//   - Вставка/удаление в середине: O(n) для поиска + O(1) для операции.
//
// ! Важные приёмы:
//
// * 1. Dummy head (фиктивная голова):
//    Создаём узел-заглушку перед настоящей головой.
// ?  Избавляет от кучи edge cases при вставке/удалении.
// !  В конце возвращаем dummy.next.
//
//    --- Пример: удалить все узлы со значением 2 из списка 1->2->3->2->5 ---
//
// ?  Без dummy head пришлось бы отдельно обрабатывать случай,
//    когда голова списка сама содержит удаляемое значение.
// ?  С dummy head код единообразный:
//
//    Шаг 0 — создаём dummy и ставим curr на него:
//      dummy -> 1 -> 2 -> 3 -> 2 -> 5 -> null
//      curr = dummy
//
//    Шаг 1 — curr = dummy, curr.next.val = 1 (не 2) -> двигаем curr:
//      dummy -> 1 -> 2 -> 3 -> 2 -> 5 -> null
//               ^curr
//
//    Шаг 2 — curr.next.val = 2 (совпало!) -> перепрыгиваем: curr.next = curr.next.next:
//      dummy -> 1 ------> 3 -> 2 -> 5 -> null
//               ^curr     (узел 2 отцеплен)
//
//    Шаг 3 — curr.next.val = 3 (не 2) -> двигаем curr:
//      dummy -> 1 -> 3 -> 2 -> 5 -> null
//                    ^curr
//
//    Шаг 4 — curr.next.val = 2 (совпало!) -> перепрыгиваем:
//      dummy -> 1 -> 3 ------> 5 -> null
//                    ^curr
//
//    Шаг 5 — curr.next.val = 5 (не 2) -> двигаем curr:
//      dummy -> 1 -> 3 -> 5 -> null
//                         ^curr
//
//    Шаг 6 — curr.next = null -> цикл окончен.
//    Возвращаем dummy.next -> 1 -> 3 -> 5 -> null
//
//    Код:
//      function removeAll(head, val) {
//        const dummy = { val: -1, next: head };
//        let curr = dummy;
//        while (curr.next !== null) {
//          if (curr.next.val === val) {
//            curr.next = curr.next.next;
//          } else {
//            curr = curr.next;
//          }
//        }
//        return dummy.next;
//      }
//
// * 2. Два указателя (быстрый и медленный):
//    slow делает 1 шаг, fast — 2 шага.
// !  Когда fast дойдёт до конца, slow будет в середине.
// ?  Также используется для обнаружения цикла (алгоритм Флойда).
//
//    --- Пример: найти середину списка 1->2->3->4->5 ---
//
//    Начало: slow = head, fast = head
//
//    Итерация 1:
//      slow: 1 -> [2]     (сдвинулся на 1 шаг)
//      fast: 1 -> 2 -> [3] (сдвинулся на 2 шага)
//
//      1 -> 2 -> 3 -> 4 -> 5 -> null
//           ^s        ^f
//
//    Итерация 2:
//      slow: 2 -> [3]     (сдвинулся на 1 шаг)
//      fast: 3 -> 4 -> [5] (сдвинулся на 2 шага)
//
//      1 -> 2 -> 3 -> 4 -> 5 -> null
//                ^s             ^f
//
//    Проверка: fast.next === null -> стоп!
//    slow указывает на узел 3 — это середина.
//
//    Для чётного списка 1->2->3->4->5->6:
//
//    Итерация 1:  slow=2, fast=3
//    Итерация 2:  slow=3, fast=5
//    Итерация 3:  slow=4, fast=null (fast вышел за список)
//      -> стоп, slow=4 (второй из двух средних).
//
//    Код:
//      function middleNode(head) {
//        let slow = head, fast = head;
//        while (fast !== null && fast.next !== null) {
//          slow = slow.next;
//          fast = fast.next.next;
//        }
//        return slow;
//      }
//
// * 3. Переворот списка:
//    prev = null, curr = head.
// !  На каждом шаге: next = curr.next, curr.next = prev, prev = curr, curr = next.
//
//    --- Пример: развернуть список 1->2->3->4 ---
//
//    Начальное состояние:
//      prev = null
//      curr = 1
//
//      null   1 -> 2 -> 3 -> 4 -> null
//      ^prev  ^curr
//
//    Шаг 1: next = 2, curr.next = prev (null), prev = 1, curr = 2
//
//      null <- 1    2 -> 3 -> 4 -> null
//              ^prev ^curr
//
//    Шаг 2: next = 3, curr.next = prev (1), prev = 2, curr = 3
//
//      null <- 1 <- 2    3 -> 4 -> null
//                   ^prev ^curr
//
//    Шаг 3: next = 4, curr.next = prev (2), prev = 3, curr = 4
//
//      null <- 1 <- 2 <- 3    4 -> null
//                        ^prev ^curr
//
//    Шаг 4: next = null, curr.next = prev (3), prev = 4, curr = null
//
//      null <- 1 <- 2 <- 3 <- 4    null
//                              ^prev ^curr
//
//    curr === null -> цикл окончен.
//    Новая голова = prev = 4.
//    Результат: 4 -> 3 -> 2 -> 1 -> null
//
//    Код:
//      function reverseList(head) {
//        let prev = null, curr = head;
//        while (curr !== null) {
//          const next = curr.next;
//          curr.next = prev;
//          prev = curr;
//          curr = next;
//        }
//        return prev;
//      }
//
// * 4. Типичные ошибки при работе со связными списками:
//
// !  a) Забыли сохранить next перед перенаправлением ссылки.
//       НЕПРАВИЛЬНО:
//         curr.next = prev;     // потеряли ссылку на остаток списка!
//         curr = curr.next;     // теперь curr = prev, идём назад
//       ПРАВИЛЬНО:
//         const next = curr.next;  // сначала сохраняем
//         curr.next = prev;
//         curr = next;             // идём по сохранённой ссылке
//
//    b) Неправильная проверка fast pointer — получаем ошибку на null.
//       НЕПРАВИЛЬНО:
//         while (fast.next !== null)   // упадёт, если fast === null
//       ПРАВИЛЬНО:
//         while (fast !== null && fast.next !== null)
//       Порядок проверок важен! Сначала fast !== null, потом fast.next.
//
//    c) Забыли про edge case: пустой список (head === null).
//       Всегда проверяйте: if (!head) return null;
//       Или используйте dummy head — он автоматически обрабатывает этот случай.
//
//    d) Возвращаем head вместо dummy.next при использовании dummy head.
//       Если вы удалили оригинальную голову, head всё ещё указывает
//       на старый (удалённый) узел. Всегда возвращайте dummy.next.
//
//    e) Бесконечный цикл при удалении: забыли НЕ двигать curr,
//       когда удалили узел. После curr.next = curr.next.next
//       не нужно делать curr = curr.next — новый curr.next
//       ещё не проверен и тоже может содержать удаляемое значение.
//
//    f) Мутация входных данных без необходимости.
//       На собеседовании уточните: можно ли менять исходный список
//       или нужно создать новый. Это влияет на решение.
//
// Типичная сложность: O(n) по времени, O(1) по памяти (если без рекурсии).
// =====================================================

// --- Вспомогательные функции (НЕ закомментированы) ---
function makeList(arr) {
  let head = null;
  for (let i = arr.length - 1; i >= 0; i--) {
    head = { val: arr[i], next: head };
  }
  return head;
}

function listToArray(head) {
  const res = [];
  while (head) {
    res.push(head.val);
    head = head.next;
  }
  return res;
}


// ===== ЗАДАЧА 1: Развернуть связный список (Easy) =====
// Дан односвязный список. Разверните его и верните новый head.
// Решение за O(n) по времени и O(1) по памяти (итеративно).
//
// Пример:
// reverseList(1 → 2 → 3 → 4 → null) → 4 → 3 → 2 → 1 → null
// reverseList(null) → null
//
// Оцените сложность по времени и памяти.

// function reverseList(head) {
//   // ваш код
// }

// --- Тесты задача 1 ---
// assertDeepEqual(listToArray(reverseList(makeList([1, 2, 3, 4]))), [4, 3, 2, 1], "reverse: [1,2,3,4]");
// assertDeepEqual(listToArray(reverseList(makeList([1, 2]))), [2, 1], "reverse: [1,2]");
// assertDeepEqual(listToArray(reverseList(makeList([1]))), [1], "reverse: [1]");
// assert(reverseList(null) === null, "reverse: null");


// ===== ЗАДАЧА 2: Найти середину списка (Easy) =====
// Дан односвязный список. Верните средний узел.
// Если узлов чётное количество — верните второй из двух средних.
//
// Пример:
// middleNode(1 → 2 → 3 → 4 → 5) → узел 3
// middleNode(1 → 2 → 3 → 4 → 5 → 6) → узел 4
//
// Подсказка: быстрый указатель делает 2 шага, медленный — 1.
//
// Оцените сложность по времени и памяти.

// function middleNode(head) {
//   // ваш код — вернуть узел (не значение!)
// }

// --- Тесты задача 2 ---
// assert(middleNode(makeList([1, 2, 3, 4, 5])).val === 3, "middle: [1,2,3,4,5] → 3");
// assert(middleNode(makeList([1, 2, 3, 4, 5, 6])).val === 4, "middle: [1,2,3,4,5,6] → 4");
// assert(middleNode(makeList([1])).val === 1, "middle: [1] → 1");
// assert(middleNode(makeList([1, 2])).val === 2, "middle: [1,2] → 2");


// ===== ЗАДАЧА 3: Обнаружить цикл в списке (Easy-Medium) =====
// Дан односвязный список. Определите, есть ли в нём цикл.
// Цикл: некоторый узел указывает next на один из предыдущих узлов.
//
// Пример:
// 1 → 2 → 3 → 4 → 2 (цикл на 2) → true
// 1 → 2 → 3 → null → false
//
// Подсказка: алгоритм Флойда — «черепаха и заяц».
// Если цикл есть, быстрый указатель догонит медленного.
//
// Оцените сложность по времени и памяти.

// function hasCycle(head) {
//   // ваш код
// }

// --- Тесты задача 3 ---
// (создадим списки с циклами вручную)
// function makeCycleList(arr, pos) {
//   // pos — индекс узла, на который указывает last.next (-1 = нет цикла)
//   const head = makeList(arr);
//   if (pos === -1) return head;
//   let tail = head;
//   while (tail.next) tail = tail.next;
//   let target = head;
//   for (let i = 0; i < pos; i++) target = target.next;
//   tail.next = target;
//   return head;
// }
// assert(hasCycle(makeCycleList([1, 2, 3, 4], 1)) === true, "hasCycle: цикл на позиции 1");
// assert(hasCycle(makeCycleList([1, 2, 3, 4], -1)) === false, "hasCycle: нет цикла");
// assert(hasCycle(makeCycleList([1, 2], 0)) === true, "hasCycle: цикл на голову");
// assert(hasCycle(makeCycleList([1], -1)) === false, "hasCycle: один элемент без цикла");
// assert(hasCycle(makeCycleList([1], 0)) === true, "hasCycle: один элемент с циклом на себя");
// assert(hasCycle(null) === false, "hasCycle: null");


// ===== ЗАДАЧА 4: Слияние двух отсортированных списков (Medium) =====
// Даны два отсортированных односвязных списка.
// Объедините их в один отсортированный список и верните его голову.
// Новый список должен состоять из узлов исходных списков.
//
// Пример:
// mergeTwoLists(1→2→4, 1→3→4) → 1→1→2→3→4→4
// mergeTwoLists(null, 1→2) → 1→2
//
// Подсказка: используйте dummy head, чтобы не обрабатывать
// отдельно случай «какой элемент первый».
//
// Оцените сложность по времени и памяти.

// function mergeTwoLists(list1, list2) {
//   // ваш код
// }

// --- Тесты задача 4 ---
// assertDeepEqual(listToArray(mergeTwoLists(makeList([1, 2, 4]), makeList([1, 3, 4]))), [1, 1, 2, 3, 4, 4], "merge: [1,2,4]+[1,3,4]");
// assertDeepEqual(listToArray(mergeTwoLists(null, makeList([1, 2]))), [1, 2], "merge: null+[1,2]");
// assertDeepEqual(listToArray(mergeTwoLists(makeList([1, 2]), null)), [1, 2], "merge: [1,2]+null");
// assert(mergeTwoLists(null, null) === null, "merge: null+null");
// assertDeepEqual(listToArray(mergeTwoLists(makeList([5]), makeList([1, 2, 3]))), [1, 2, 3, 5], "merge: [5]+[1,2,3]");


// ===== ЗАДАЧА 5: Удалить N-й узел с конца (Medium) =====
// Дан односвязный список и число n. Удалите n-й узел с конца
// списка и верните голову. Гарантируется, что n валидно.
//
// Пример:
// removeNthFromEnd(1→2→3→4→5, 2) → 1→2→3→5   (удалён 4)
// removeNthFromEnd(1, 1) → null                 (удалён единственный)
// removeNthFromEnd(1→2, 1) → 1                  (удалён 2)
//
// Подсказка: используйте два указателя с разрывом в n шагов.
// Когда fast дойдёт до конца, slow будет на узле перед удаляемым.
// Не забудьте про dummy head!
//
// Оцените сложность по времени и памяти.

// function removeNthFromEnd(head, n) {
//   // ваш код
// }

// --- Тесты задача 5 ---
// assertDeepEqual(listToArray(removeNthFromEnd(makeList([1, 2, 3, 4, 5]), 2)), [1, 2, 3, 5], "removeNth: удалить 2-й с конца");
// assert(removeNthFromEnd(makeList([1]), 1) === null, "removeNth: удалить единственный");
// assertDeepEqual(listToArray(removeNthFromEnd(makeList([1, 2]), 1)), [1], "removeNth: удалить последний");
// assertDeepEqual(listToArray(removeNthFromEnd(makeList([1, 2]), 2)), [2], "removeNth: удалить первый");
// assertDeepEqual(listToArray(removeNthFromEnd(makeList([1, 2, 3]), 3)), [2, 3], "removeNth: удалить голову");


// ===== ЗАДАЧА 6: Сложить два числа в виде списков (Medium) =====
// Два неотрицательных числа представлены в виде связных списков,
// где цифры хранятся в обратном порядке (единицы — в голове).
// Сложите эти числа и верните результат в виде связного списка.
//
// Пример:
// addTwoNumbers(2→4→3, 5→6→4) → 7→0→8     (342 + 465 = 807)
// addTwoNumbers(0, 0) → 0
// addTwoNumbers(9→9→9, 1) → 0→0→0→1        (999 + 1 = 1000)
//
// Подсказка: проходите оба списка одновременно, складывая цифры
// и учитывая перенос (carry). Не забудьте про разную длину списков
// и финальный carry.
//
// Оцените сложность по времени и памяти.

// function addTwoNumbers(l1, l2) {
//   // ваш код
// }

// --- Тесты задача 6 ---
// assertDeepEqual(listToArray(addTwoNumbers(makeList([2, 4, 3]), makeList([5, 6, 4]))), [7, 0, 8], "add: 342+465=807");
// assertDeepEqual(listToArray(addTwoNumbers(makeList([0]), makeList([0]))), [0], "add: 0+0=0");
// assertDeepEqual(listToArray(addTwoNumbers(makeList([9, 9, 9]), makeList([1]))), [0, 0, 0, 1], "add: 999+1=1000");
// assertDeepEqual(listToArray(addTwoNumbers(makeList([9, 9]), makeList([9, 9, 9]))), [8, 9, 0, 1], "add: 99+999=1098");
// assertDeepEqual(listToArray(addTwoNumbers(makeList([5]), makeList([5]))), [0, 1], "add: 5+5=10");
