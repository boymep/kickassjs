import type { TestCase, TestResult } from '../types/problem';

const TIMEOUT_MS = 5000;

export function runCode(
  userCode: string,
  functionName: string,
  testCases: TestCase[],
): Promise<TestResult[]> {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.sandbox.add('allow-scripts');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    let resolved = false;

    const cleanup = () => {
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
      window.removeEventListener('message', onMessage);
    };

    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        cleanup();
        resolve(
          testCases.map((tc) => ({
            testCaseId: tc.id,
            passed: false,
            actual: null,
            expected: tc.expected,
            error: 'Превышено время выполнения (5 сек). Возможен бесконечный цикл.',
          })),
        );
      }
    }, TIMEOUT_MS);

    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === 'results' && !resolved) {
        resolved = true;
        clearTimeout(timer);
        cleanup();
        resolve(event.data.results);
      }
    };

    window.addEventListener('message', onMessage);

    const script = `
      <script>
        try {
          ${userCode}

          const __testCases = ${JSON.stringify(testCases)};
          const __results = [];

          for (const tc of __testCases) {
            try {
              const actual = ${functionName}(...tc.inputArgs);
              const passed = JSON.stringify(actual) === JSON.stringify(tc.expected);
              __results.push({ testCaseId: tc.id, passed, actual, expected: tc.expected });
            } catch (e) {
              __results.push({ testCaseId: tc.id, passed: false, actual: null, expected: tc.expected, error: e.message });
            }
          }

          parent.postMessage({ type: 'results', results: __results }, '*');
        } catch (e) {
          const __testCases = ${JSON.stringify(testCases)};
          parent.postMessage({
            type: 'results',
            results: __testCases.map(tc => ({
              testCaseId: tc.id,
              passed: false,
              actual: null,
              expected: tc.expected,
              error: e.message
            }))
          }, '*');
        }
      <\/script>
    `;

    iframe.srcdoc = `<!DOCTYPE html><html><head></head><body>${script}</body></html>`;
  });
}
