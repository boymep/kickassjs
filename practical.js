// ===== Задача 1: Расчёт зарплаты =====
// Напишите функцию calcSalary(hourlyRate, startDate, endDate)
// Считает зарплату за период. Условия:
// - Будни (пн–пт): оплата = hourlyRate * 8 часов
// - Выходные (сб, вс): оплата = hourlyRate * 8 * 1.5 (полуторная ставка)
// - startDate и endDate включительно

// function calcSalary(hourlyRate, startDate, endDate) {
//   let total = 0;
//   const date = new Date(startDate);
//
//   while (date <= endDate) {
//     if (date.getDay() === 6 || date.getDay() === 0)
//       total += hourlyRate * 8 * 1.5;
//     else total += hourlyRate * 8;
//     date.setDate(date.getDate() + 1);
//   }
//
//   return total;
// }

// Тесты:
// console.log(calcSalary(500, new Date("2023-11-06"), new Date("2023-11-10"))); // 20000
// console.log(calcSalary(500, new Date("2023-11-10"), new Date("2023-11-12"))); // 16000

// ===== Задача 2: Ближайший рабочий день =====
// Напишите функцию nextWorkday(date)
// Принимает дату. Если это будний день — возвращает её же.
// Если выходной — возвращает ближайший понедельник.
// Возвращает новый объект Date (не мутирует входной).
//
// Примеры:
// nextWorkday(new Date("2023-11-08")) → Wed Nov 08 2023 (среда — уже рабочий)
// nextWorkday(new Date("2023-11-11")) → Mon Nov 13 2023 (суббота → понедельник)
// nextWorkday(new Date("2023-11-12")) → Mon Nov 13 2023 (воскресенье → понедельник)

// function nextWorkday(date) {
//   const newDate = new Date(date);
//
//   if (newDate.getDay() !== 0 && newDate.getDay() !== 6) return newDate;
//   else {
//     while (newDate.getDay() !== 1) {
//       newDate.setDate(newDate.getDate() + 1);
//     }
//   }
//
//   return newDate;
// }

// Тесты:
// console.log(nextWorkday(new Date("2023-11-08")).toDateString()); // "Wed Nov 08 2023"
// console.log(nextWorkday(new Date("2023-11-11")).toDateString()); // "Mon Nov 13 2023"
// console.log(nextWorkday(new Date("2023-11-12")).toDateString()); // "Mon Nov 13 2023"
// const original = new Date("2023-11-11");
// nextWorkday(original);
// console.log(original.toDateString()); // "Sat Nov 11 2023" (не изменился)

// ===== Задача 3: Парковка =====
// Напишите функцию parkingCost(startTime, endTime)
// Считает стоимость парковки. Условия:
// - Первые 15 минут — бесплатно
// - С 15 мин до 1 часа — 100 руб (фиксировано)
// - Каждый следующий час — +80 руб (неполный час считается как полный)
// - startTime и endTime — объекты Date
//
// Примеры:
// parkingCost(new Date("2023-11-11 10:00"), new Date("2023-11-11 10:10")) → 0
//   (10 минут — бесплатно)
// parkingCost(new Date("2023-11-11 10:00"), new Date("2023-11-11 10:30")) → 100
//   (30 минут — фиксированная ставка)
// parkingCost(new Date("2023-11-11 10:00"), new Date("2023-11-11 12:15")) → 260
//   (2ч 15мин: 100 за первый час + 80 за второй + 80 за неполный третий)

// function parkingCost(startTime, endTime) {
//   const diff = endTime - startTime;
//   const diffInMinutes = diff / 60000;
//
//   if (diffInMinutes <= 15) return 0;
//   if (diffInMinutes <= 60) return 100;
//   else return Math.ceil((diffInMinutes - 60) / 60) * 80 + 100;
// }

// Тесты:
// console.log(parkingCost(new Date("2023-11-11 10:00"), new Date("2023-11-11 10:10"))); // 0
// console.log(parkingCost(new Date("2023-11-11 10:00"), new Date("2023-11-11 10:30"))); // 100
// console.log(parkingCost(new Date("2023-11-11 10:00"), new Date("2023-11-11 11:00"))); // 100
// console.log(parkingCost(new Date("2023-11-11 10:00"), new Date("2023-11-11 12:15"))); // 260
// console.log(parkingCost(new Date("2023-11-11 10:00"), new Date("2023-11-11 10:15"))); // 0
