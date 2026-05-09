const TIMEOUT_MS = 5000;

export interface StdoutRunResult {
  output: string;
  error?: string;
}

/**
 * Run user-provided JS in a sandboxed iframe, capturing console.log/info/warn/error output.
 * Returns the captured stdout as a single newline-joined string. Resolves on timeout with an error.
 */
export function runStdoutCode(userCode: string): Promise<StdoutRunResult> {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.sandbox.add('allow-scripts');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    let resolved = false;

    const cleanup = () => {
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      window.removeEventListener('message', onMessage);
    };

    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        cleanup();
        resolve({ output: '', error: 'Превышено время выполнения (5 сек). Возможен бесконечный цикл.' });
      }
    }, TIMEOUT_MS);

    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === 'stdout-result' && !resolved) {
        resolved = true;
        clearTimeout(timer);
        cleanup();
        resolve({ output: event.data.output ?? '', error: event.data.error });
      }
    };

    window.addEventListener('message', onMessage);

    const script = `
      <script>
        (async () => {
          const __lines = [];
          const __format = (v) => {
            if (typeof v === 'string') return v;
            try { return JSON.stringify(v); } catch (e) { return String(v); }
          };
          const __push = (...args) => { __lines.push(args.map(__format).join(' ')); };
          console.log = __push;
          console.info = __push;
          console.warn = __push;
          console.error = __push;
          try {
            const __result = (async () => { ${userCode}\n })();
            await __result;
            parent.postMessage({ type: 'stdout-result', output: __lines.join('\\n') }, '*');
          } catch (e) {
            parent.postMessage({
              type: 'stdout-result',
              output: __lines.join('\\n'),
              error: (e && e.message) ? e.message : String(e),
            }, '*');
          }
        })();
      <\/script>
    `;

    iframe.srcdoc = `<!DOCTYPE html><html><head></head><body>${script}</body></html>`;
  });
}

/** Normalize stdout for comparison (trim trailing whitespace per line, drop trailing blank lines). */
export function normalizeOutput(s: string): string {
  return s
    .split('\n')
    .map((line) => line.replace(/\s+$/, ''))
    .join('\n')
    .replace(/\n+$/, '');
}
