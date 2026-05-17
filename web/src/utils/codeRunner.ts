import type { TestCase, TestResult } from '../types/problem';

const TIMEOUT_MS = 5000;

function runInIframe(srcdoc: string, onMessage: (e: MessageEvent) => void, timeoutResult: () => TestResult[]): Promise<TestResult[]> {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.sandbox.add('allow-scripts');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    let resolved = false;

    const cleanup = () => {
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      window.removeEventListener('message', handler);
    };

    const handler = (event: MessageEvent) => {
      const result = onMessage(event);
      if (result !== undefined) {
        resolved = true;
        clearTimeout(timer);
        cleanup();
        resolve(result as unknown as TestResult[]);
      }
    };

    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        cleanup();
        resolve(timeoutResult());
      }
    }, TIMEOUT_MS);

    window.addEventListener('message', handler);
    iframe.srcdoc = srcdoc;
  });
}

function buildSrcdoc(userCode: string, testHelperCode: string | undefined, body: string): string {
  return `<!DOCTYPE html><html><head></head><body><script>(async () => { try { ${userCode}\n${testHelperCode ?? ''}\n${body} } catch(e) { parent.postMessage({ type: 'fatal', error: e.message }, '*'); } })();<\/script></body></html>`;
}

function runNormalCases(
  userCode: string,
  functionName: string,
  testCases: TestCase[],
  testHelperCode?: string,
): Promise<TestResult[]> {
  const casesJson = JSON.stringify(testCases);
  const body = `
    const __testCases = ${casesJson};
    const __results = [];
    for (const tc of __testCases) {
      try {
        let actual = ${functionName}(...tc.inputArgs);
        if (actual !== null && actual !== undefined && typeof actual.then === 'function') {
          try { actual = await actual; } catch(e) { actual = 'Error: ' + e.message; }
        }
        const passed = JSON.stringify(actual) === JSON.stringify(tc.expected);
        __results.push({ testCaseId: tc.id, passed, actual, expected: tc.expected });
      } catch(e) {
        __results.push({ testCaseId: tc.id, passed: false, actual: null, expected: tc.expected, error: e.message });
      }
    }
    parent.postMessage({ type: 'results', results: __results }, '*');
  `;

  return runInIframe(
    buildSrcdoc(userCode, testHelperCode, body),
    (event) => {
      if (event.data?.type === 'results') return event.data.results;
      if (event.data?.type === 'fatal') {
        return testCases.map((tc) => ({
          testCaseId: tc.id, passed: false, actual: null, expected: tc.expected, error: event.data.error,
        }));
      }
    },
    () => testCases.map((tc) => ({
      testCaseId: tc.id, passed: false, actual: null, expected: tc.expected,
      error: 'Превышено время выполнения (5 сек). Возможен бесконечный цикл.',
    })),
  );
}

function runPerfCase(
  userCode: string,
  functionName: string,
  tc: TestCase,
  testHelperCode?: string,
): Promise<TestResult> {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.sandbox.add('allow-scripts');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    let resolved = false;

    const cleanup = () => {
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      window.removeEventListener('message', handler);
    };

    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        cleanup();
        resolve({ testCaseId: tc.id, passed: false, actual: TIMEOUT_MS, expected: tc.maxMs, error: 'Превышено время выполнения (5 сек).' });
      }
    }, TIMEOUT_MS);

    const handler = (event: MessageEvent) => {
      if (resolved || event.data?.type !== 'perf-result') return;
      resolved = true;
      clearTimeout(timer);
      cleanup();
      if (event.data.error) {
        resolve({ testCaseId: tc.id, passed: false, actual: null, expected: tc.maxMs, error: event.data.error });
      } else {
        const ms = event.data.ms as number;
        resolve({ testCaseId: tc.id, passed: ms <= tc.maxMs!, actual: ms, expected: tc.maxMs });
      }
    };

    window.addEventListener('message', handler);

    // Iframe measures time itself — host-side timing doesn't work because both
    // postMessages arrive in the same event-loop tick for synchronous functions.
    const script = `<script>
      (() => {
        try {
          ${userCode}
          ${testHelperCode ?? ''}
          const __t0 = Date.now();
          try {
            ${functionName}(...${JSON.stringify(tc.inputArgs)});
            parent.postMessage({ type: 'perf-result', ms: Date.now() - __t0 }, '*');
          } catch(e) {
            parent.postMessage({ type: 'perf-result', error: e.message }, '*');
          }
        } catch(e) {
          parent.postMessage({ type: 'perf-result', error: e.message }, '*');
        }
      })();
    <\/script>`;

    iframe.srcdoc = `<!DOCTYPE html><html><head></head><body>${script}</body></html>`;
  });
}

export async function runCode(
  userCode: string,
  functionName: string,
  testCases: TestCase[],
  testHelperCode?: string,
): Promise<TestResult[]> {
  const normalCases = testCases.filter((tc) => tc.maxMs === undefined);
  const perfCases = testCases.filter((tc) => tc.maxMs !== undefined);

  const normalResults = normalCases.length > 0
    ? await runNormalCases(userCode, functionName, normalCases, testHelperCode)
    : [];

  const perfResults = await Promise.all(
    perfCases.map((tc) => runPerfCase(userCode, functionName, tc, testHelperCode)),
  );

  return [...normalResults, ...perfResults];
}
