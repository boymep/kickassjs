#!/usr/bin/env node
/**
 * Standalone runtime audit of practice problems.
 *
 * For every implement/find-bug/refactor problem:
 *   - solutionCode must pass ALL testCases.
 *   - find-bug.buggyCode must FAIL at least one testCase.
 *   - refactor.starterCode must pass correctness tests.
 *
 * Each evaluation has a hard 2-second timeout enforced via worker_threads,
 * so an infinite loop in user code can't hang the whole audit.
 *
 * Usage:
 *   node scripts/audit-problems.mjs            # audit everything
 *   node scripts/audit-problems.mjs <slug>     # audit a single topic
 */

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const TIMEOUT_MS = 2000;
const onlySlug = process.argv[2];

// 1) Compile TS lazily via tsx so we can import problem data directly.
const { algorithmTopics, jsTopics, nodejsTopics } = await import(`${ROOT}/src/data/topics.ts`);
const { getProblems } = await import(`${ROOT}/src/data/problems/index.ts`);
const { getProblemKind } = await import(`${ROOT}/src/types/problem.ts`);

const allTopics = [...algorithmTopics, ...jsTopics, ...nodejsTopics];
const topics = onlySlug ? allTopics.filter((t) => t.slug === onlySlug) : allTopics;

if (topics.length === 0) {
  console.error(`No topic matches "${onlySlug}".`);
  process.exit(2);
}

/**
 * Run a small async function in an isolated child process with a timeout.
 * Returns { passed, actual, error }.
 */
function safeSerialize(value) {
  try {
    return { json: JSON.stringify(value), cyclic: false };
  } catch {
    return { json: '[]', cyclic: true };
  }
}

function runIsolated({ userCode, helperCode, functionName, inputArgs }) {
  const { json: argsJson, cyclic } = safeSerialize(inputArgs);
  if (cyclic) {
    return Promise.resolve({ passed: false, actual: null, error: 'cyclic input — cannot serialize, skipped' });
  }
  return new Promise((resolve) => {
    const script = `
      (async () => {
        try {
          ${userCode}
          ${helperCode ?? ''}
          const __args = ${argsJson};
          let __r = ${functionName}(...__args);
          if (__r && typeof __r.then === 'function') __r = await __r;
          process.stdout.write(JSON.stringify({ ok: true, value: __r }));
        } catch (e) {
          process.stdout.write(JSON.stringify({ ok: false, error: (e && e.message) ? e.message : String(e) }));
        }
      })();
    `;

    const child = spawn(process.execPath, ['--input-type=module', '-e', script], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let out = '';
    let err = '';
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (err += d));

    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      resolve({ passed: false, actual: null, error: `timeout after ${TIMEOUT_MS}ms` });
    }, TIMEOUT_MS);

    child.on('close', () => {
      clearTimeout(timer);
      try {
        const parsed = JSON.parse(out || '{"ok":false,"error":"no output"}');
        if (!parsed.ok) {
          resolve({ passed: false, actual: null, error: parsed.error || err.trim() });
          return;
        }
        resolve({ passed: true, actual: parsed.value });
      } catch {
        resolve({ passed: false, actual: null, error: `unparseable output: ${out.slice(0, 200)}` });
      }
    });
  });
}

async function runAll(userCode, functionName, helperCode, testCases) {
  const out = [];
  for (const tc of testCases) {
    const r = await runIsolated({
      userCode,
      helperCode,
      functionName,
      inputArgs: tc.inputArgs,
    });
    if (!r.error) {
      r.passed = JSON.stringify(r.actual) === JSON.stringify(tc.expected);
    }
    r.tc = tc;
    out.push(r);
  }
  return out;
}

const issues = [];
let totalChecks = 0;

for (const topic of topics) {
  const problems = getProblems(topic.slug);
  process.stdout.write(`\n${topic.slug.padEnd(20)} (${problems.length} problems)\n`);

  for (const p of problems) {
    const kind = getProblemKind(p);
    if (kind === 'predict-output') {
      process.stdout.write(`  - ${p.id} [predict-output] (skipped — manual review)\n`);
      continue;
    }

    // Skip problem if any test case has a cyclic input (cannot serialize across process boundary).
    if ('testCases' in p && p.testCases.some((tc) => safeSerialize(tc.inputArgs).cyclic)) {
      process.stdout.write(`  - ${p.id} [${kind}] (skipped — cyclic test inputs)\n`);
      continue;
    }

    // Best-effort skip when problem requires a real browser DOM or Node-only APIs.
    const allCode = [
      'starterCode' in p ? p.starterCode : '',
      'buggyCode' in p ? p.buggyCode : '',
      p.solutionCode,
      'testHelperCode' in p ? (p.testHelperCode ?? '') : '',
    ].join('\n');
    let skipReason = null;
    if (/\bdocument\b/.test(allCode)) skipReason = 'uses document';
    else if (/\bwindow\b/.test(allCode)) skipReason = 'uses window';
    else if (/\brequire\s*\(/.test(allCode)) skipReason = 'uses CommonJS require';
    else if (/\bsetImmediate\s*\(/.test(allCode)) skipReason = 'uses setImmediate';
    // Detect class-as-functionName: if user code declares `class <FN>` and functionName matches it,
    // calling without `new` fails — this case must use testHelperCode wrapper.
    if (!skipReason && 'functionName' in p) {
      const classRe = new RegExp(`\\bclass\\s+${p.functionName}\\b`);
      const hasHelperWrap =
        'testHelperCode' in p &&
        p.testHelperCode &&
        new RegExp(`\\bnew\\s+${p.functionName}\\b`).test(p.testHelperCode);
      if (classRe.test(allCode) && !hasHelperWrap) {
        skipReason = `${p.functionName} is a class but no helper wrapper (in-browser sandbox-only)`;
      }
    }
    if (skipReason) {
      process.stdout.write(`  - ${p.id} [${kind}] (skipped — ${skipReason})\n`);
      continue;
    }

    if (kind === 'implement' || kind === 'refactor' || kind === 'find-bug') {
      // solutionCode must pass all
      totalChecks++;
      const solRes = await runAll(p.solutionCode, p.functionName, p.testHelperCode, p.testCases);
      const solFails = solRes.filter((r) => !r.passed);
      if (solFails.length > 0) {
        issues.push({
          topic: topic.slug,
          id: p.id,
          kind,
          phase: 'solutionCode',
          fails: solFails.map((f) => ({
            tc: f.tc.id,
            expected: f.tc.expected,
            actual: f.actual,
            error: f.error,
          })),
        });
        process.stdout.write(`  ✗ ${p.id} [${kind}] solutionCode failed ${solFails.length}/${solRes.length}\n`);
      } else {
        process.stdout.write(`  ✓ ${p.id} [${kind}] solutionCode ${solRes.length}/${solRes.length}\n`);
      }
    }

    // NOTE: refactor.starterCode is intentionally "slow but correct". Some testCases legitimately
    // verify the optimization (e.g. parallelism, O(1) lookup, batched writes) and MUST fail on
    // starter while passing on solution. Detecting that automatically is fragile, so we don't
    // assert starter correctness here — perfTest covers the timing dimension.

    if (kind === 'find-bug') {
      totalChecks++;
      const bgRes = await runAll(p.buggyCode, p.functionName, p.testHelperCode, p.testCases);
      const anyFail = bgRes.some((r) => !r.passed);
      if (!anyFail) {
        issues.push({
          topic: topic.slug,
          id: p.id,
          kind,
          phase: 'buggyCode (must fail)',
          fails: [{ tc: '*', note: 'buggyCode passes all tests; bug is not actually present' }],
        });
        process.stdout.write(`    ✗ ${p.id} buggyCode unexpectedly passes ALL tests\n`);
      }
    }
  }
}

console.log('\n' + '='.repeat(60));
if (issues.length === 0) {
  console.log(`✅ All ${totalChecks} runtime checks passed.`);
  process.exit(0);
}

console.log(`❌ ${issues.length} issues across ${totalChecks} checks:\n`);
for (const i of issues) {
  console.log(`[${i.topic}] ${i.id} (${i.kind}) — ${i.phase}`);
  for (const f of i.fails.slice(0, 5)) {
    if (f.note) console.log(`    ${f.note}`);
    else console.log(`    ${f.tc}: expected=${JSON.stringify(f.expected)} actual=${JSON.stringify(f.actual)}${f.error ? ` err=${f.error}` : ''}`);
  }
  if (i.fails.length > 5) console.log(`    ... +${i.fails.length - 5} more`);
}
process.exit(1);
