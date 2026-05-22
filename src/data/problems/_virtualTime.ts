/**
 * Префикс для `testHelperCode` тех задач, чьи тесты завязаны на реальное время.
 *
 * Песочница песочница (`<iframe sandbox="allow-scripts">` с `display: none`)
 * жёстко тротлит `setTimeout` (минимум ~1с в Chrome для скрытых iframe).
 * Из-за этого тесты с цепочками задержек выходят за 5-секундный бюджет
 * и падают с «Превышено время выполнения».
 *
 * Префикс подменяет глобальные `setTimeout`/`clearTimeout` на очередь
 * с виртуальными часами и даёт хелпер `advance(ms)`, который двигает
 * это время вперёд и поочерёдно вызывает дозревшие callbacks.
 *
 * Использование в тестах:
 *   testHelperCode: `${VIRTUAL_TIME_PRELUDE}
 *     async function fn_test(scenario) {
 *       resetVirtualTime(); // в начале каждого сценария
 *       // ... код теста, который вызывает user-функцию ...
 *       await advance(500); // прогнать виртуальное время вперёд
 *       // ... проверки ...
 *     }`
 *
 * Внутри пользовательской функции (debounce, promiseTimeout и т.п.)
 * `setTimeout`/`clearTimeout` берутся из `globalThis` — они уже подменены,
 * никаких изменений в решении не требуется.
 */
export const VIRTUAL_TIME_PRELUDE = `
(function () {
  let virtualNow = 0;
  let nextId = 1;
  let queue = [];

  globalThis.resetVirtualTime = function () {
    virtualNow = 0;
    nextId = 1;
    queue = [];
  };

  // Текущее виртуальное время в миллисекундах — для тестов,
  // которые меряют интервалы между событиями.
  globalThis.getNow = function () {
    return virtualNow;
  };

  globalThis.setTimeout = function (cb, delay) {
    const id = nextId++;
    queue.push({ id, time: virtualNow + (delay || 0), cb });
    return id;
  };

  globalThis.clearTimeout = function (id) {
    const i = queue.findIndex((t) => t.id === id);
    if (i !== -1) queue.splice(i, 1);
  };

  // Двигает виртуальное время на ms вперёд, поочерёдно вызывая
  // все callbacks, у которых scheduled time <= virtualNow + ms.
  // Между callbacks — await Promise.resolve(), чтобы микротаски
  // (например, .then() пользовательских промисов) успевали отработать.
  globalThis.advance = async function (ms) {
    const target = virtualNow + ms;
    while (true) {
      queue.sort((a, b) => a.time - b.time);
      if (queue.length === 0 || queue[0].time > target) break;
      const t = queue.shift();
      virtualNow = t.time;
      t.cb();
      await Promise.resolve();
    }
    virtualNow = target;
  };

  // Хелпер: интегрированный pump — крутит таймеры по одному, yield'ит микротаски,
  // пока промис p не settle (или не упрёмся в safety-лимит).
  // Это правильный паттерн, когда user-код добавляет таймеры лениво в .then-цепочках:
  // мы НЕ пробегаем виртуальное время вперёд один раз, а синхронно вьём это с user-цепочкой.
  // Возвращает { ok: true, value } либо { ok: false, reason }.
  globalThis.settle = async function (p, ms) {
    const deadline = virtualNow + (ms != null ? ms : 1e9);
    let outcome = null;
    p.then(
      (v) => { outcome = { ok: true, value: v }; },
      (e) => { outcome = { ok: false, reason: e && e.message ? e.message : String(e) }; }
    );
    let safety = 0;
    while (outcome === null && safety < 10000) {
      await Promise.resolve();
      queue.sort((a, b) => a.time - b.time);
      if (queue.length > 0 && queue[0].time <= deadline) {
        const t = queue.shift();
        virtualNow = t.time;
        t.cb();
      } else if (queue.length > 0 && queue[0].time > deadline) {
        // Следующий таймер за deadline — дальше ждать смысла нет.
        break;
      }
      safety++;
    }
    return outcome;
  };
})();
`;
