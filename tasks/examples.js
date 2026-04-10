// =====================================================
// Задача Авито: Чемпионы шагов
// =====================================================
// Запуск: node avito.js
//
// Мы в Авито любим проводить соревнования, — недавно мы устроили
// чемпионат по шагам. И вот настало время подводить итоги!
//
// Необходимо определить userIds участников, которые прошли
// наибольшее количество шагов steps за все дни,
// не пропустив ни одного дня соревнований.
//
// Пример 1:
// # вход
// statistics = [
//   [{ userId: 1, steps: 1000 }, { userId: 2, steps: 1500 }],
//   [{ userId: 2, steps: 1000 }]
// ]
//
// # выход
// champions = { userIds: [2], steps: 2500 }
//
// Пример 2:
// # вход
// statistics = [
//   [{ userId: 1, steps: 2000 }, { userId: 3, steps: 1500 }],
//   [{ userId: 2, steps: 4000 }, { userId: 1, steps: 3500 }]
// ]
//
// # выход
// champions = { userIds: [1, 2], steps: 5500 }

// function assert(condition, message) {
//   if (!condition) {
//     console.error("❌ " + message);
//   } else {
//     console.log("✅ " + message);
//   }
// }
//
// function assertDeepEqual(a, b, message) {
//   assert(
//     JSON.stringify(a) === JSON.stringify(b),
//     message +
//       " | got: " +
//       JSON.stringify(a) +
//       ", expected: " +
//       JSON.stringify(b),
//   );
// }
//
// let statistics = [
//   [
//     { userId: 1, steps: 2000 },
//     { userId: 3, steps: 1500 },
//   ],
//   [
//     { userId: 2, steps: 4000 },
//     { userId: 1, steps: 3500 },
//   ],
// ];
//
// function findChampions(statistics) {
//   const usersArr = [];
//   const result = { userIds: [], steps: 0 };
//
//   statistics.forEach((day) => {
//     day.forEach((user) => {
//       if (usersArr[user.userId]) {
//         usersArr[user.userId].steps += user.steps;
//         usersArr[user.userId].days++;
//       } else {
//         usersArr[user.userId] = { steps: user.steps, days: 1, id: user.userId };
//       }
//     });
//   });
//
//   const available = usersArr.filter((item) => item.days === statistics.length);
//
//   let maxSteps = 0;
//
//   for (const item of available) {
//     if (item.steps > maxSteps) maxSteps = item.steps;
//   }
//
//   for (const item of available) {
//     if (item.steps === maxSteps) result.userIds.push(item.id);
//   }
//
//   result.steps = maxSteps;
//
//   return result;
// }
//
// // --- Тесты задача 1 ---
// assertDeepEqual(
//   findChampions([
//     [
//       { userId: 1, steps: 1000 },
//       { userId: 2, steps: 1500 },
//     ],
//     [{ userId: 2, steps: 1000 }],
//   ]),
//   { userIds: [2], steps: 2500 },
//   "Пример 1: userId 2 ходил все дни",
// );
//
// assertDeepEqual(
//   findChampions([
//     [
//       { userId: 1, steps: 2000 },
//       { userId: 3, steps: 1500 },
//     ],
//     [
//       { userId: 2, steps: 4000 },
//       { userId: 1, steps: 3500 },
//     ],
//   ]),
//   { userIds: [1], steps: 5500 },
//   "Пример 2: только userId 1 ходил все дни",
// );
//
// assertDeepEqual(
//   findChampions([
//     [
//       { userId: 1, steps: 3000 },
//       { userId: 2, steps: 3000 },
//     ],
//     [
//       { userId: 1, steps: 2000 },
//       { userId: 2, steps: 2000 },
//     ],
//   ]),
//   { userIds: [1, 2], steps: 5000 },
//   "Два чемпиона с одинаковым количеством шагов",
// );
//
// assertDeepEqual(
//   findChampions([[{ userId: 1, steps: 5000 }]]),
//   { userIds: [1], steps: 5000 },
//   "Один день, один участник",
// );
//
// assertDeepEqual(
//   findChampions([
//     [
//       { userId: 1, steps: 1000 },
//       { userId: 2, steps: 2000 },
//       { userId: 3, steps: 3000 },
//     ],
//     [
//       { userId: 1, steps: 1000 },
//       { userId: 2, steps: 2000 },
//       { userId: 3, steps: 3000 },
//     ],
//     [
//       { userId: 1, steps: 1000 },
//       { userId: 2, steps: 2000 },
//       { userId: 3, steps: 3000 },
//     ],
//   ]),
//   { userIds: [3], steps: 9000 },
//   "Три дня, все участвовали, userId 3 лидер",
// );
//
// assertDeepEqual(
//   findChampions([
//     [
//       { userId: 1, steps: 500 },
//       { userId: 2, steps: 1000 },
//     ],
//     [
//       { userId: 1, steps: 500 },
//       { userId: 3, steps: 2000 },
//     ],
//     [
//       { userId: 1, steps: 500 },
//       { userId: 2, steps: 800 },
//     ],
//   ]),
//   { userIds: [1], steps: 1500 },
//   "Только userId 1 ходил все 3 дня",
// );

// =====================================================
// Задача Авито: Неудовлетворённость покупателей
// =====================================================
//
// На Авито размещено множество товаров, каждый из которых
// представлен числом.
// У каждого покупателя есть потребность в товаре, также
// выраженная числом.
// Если точного товара нет, покупатель выбирает ближайший
// по значению товар, что вызывает неудовлетворённость =
// разницу между его потребностью и купленным товаром.
// Количество каждого товара не ограничено, и один товар
// могут купить несколько покупателей.
//
// Рассчитайте суммарную неудовлетворённость всех покупателей.
//
// Нужно написать функцию, которая примет на вход два массива:
// массив товаров и массив потребностей покупателей,
// вычислит сумму неудовлетворённости всех покупателей
// и вернёт результат в виде числа.
//
// Пример:
// # вход
// goods = [8, 3, 5]
// buyerNeeds = [5, 6]
//
// # выход
// res = 1
// # первый покупатель покупает товар 5, неудовлетворённость = 0
// # второй покупатель тоже покупает товар 5 (ближайший к 6),
// # неудовлетворённость = 6 - 5 = 1
// # итого: 0 + 1 = 1

function assert(condition, message) {
  if (!condition) {
    console.error("❌ " + message);
  } else {
    console.log("✅ " + message);
  }
}

function calcDissatisfaction(goods, buyerNeeds) {
  const sorted = goods.sort((a, b) => a - b);

  return buyerNeeds.reduce((acc, need) => {
    let left = 0;
    let right = sorted.length - 1;

    if (need >= sorted[right]) return acc + (need - sorted[right]);
    if (need <= sorted[left]) return acc + (sorted[left] - need);

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (sorted[mid] === need) return acc;
      else if (sorted[mid] < need) left = mid + 1;
      else right = mid - 1;
    }

    // [...4, R5, (7), 8L...]
    // 2 curr - arr[right]
    // 1 arr[left] - curr
    // if (curr - arr[right] < arr[left] - curr) return curr - arr[right]
    // else return arr[left] - curr

    if (need - sorted[right] <= sorted[left] - need)
      return (acc += need - sorted[right]);

    return (acc += sorted[left] - need);
  }, 0);
}

// --- Тесты задача 2 ---
assert(
  calcDissatisfaction([8, 3, 5], [5, 6]) === 1,
  "Пример: goods=[8,3,5] needs=[5,6] → 1",
);
assert(
  calcDissatisfaction([1, 10], [5]) === 4,
  "Один покупатель, ближайший товар: → 4",
);
assert(calcDissatisfaction([5], [5]) === 0, "Точное совпадение → 0");
assert(
  calcDissatisfaction([1, 2, 3, 4, 5], [3, 3, 3]) === 0,
  "Все покупатели находят точный товар → 0",
);
assert(
  calcDissatisfaction([10, 20, 30], [1, 25, 35]) === 9 + 5 + 5,
  "Разные потребности: → 19",
);
assert(
  calcDissatisfaction([1, 100], [50]) === 49,
  "Ровно посередине, ближе к 1 или 100: → 49",
);
assert(
  calcDissatisfaction([3, 7, 15], [1, 5, 10, 20]) === 2 + 2 + 3 + 5,
  "Четыре покупателя: → 12",
);
