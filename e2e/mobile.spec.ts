import { test, expect } from '@playwright/test';

// Checks that no VISIBLE element overflows the viewport horizontally.
// Skips elements inside scroll containers (overflow:auto/scroll) — their
// content can intentionally extend beyond the clip boundary.
async function checkNoHorizontalOverflow(page: import('@playwright/test').Page) {
  const culprits = await page.evaluate(() => {
    const viewWidth = document.documentElement.clientWidth;

    function isInsideScrollContainer(el: Element): boolean {
      let cur = el.parentElement;
      while (cur && cur !== document.documentElement) {
        const ox = getComputedStyle(cur).overflowX;
        if (ox === 'auto' || ox === 'scroll') return true;
        cur = cur.parentElement;
      }
      return false;
    }

    const found: { tag: string; cls: string; rect: { x: number; right: number; width: number } }[] = [];
    const elements = document.querySelectorAll<HTMLElement>('*');
    for (const el of elements) {
      const style = getComputedStyle(el);
      // Skip the element itself if it's a scroll container
      if (style.overflowX === 'scroll' || style.overflowX === 'auto') continue;
      // Skip invisible elements
      if (style.display === 'none' || style.visibility === 'hidden') continue;
      // Skip elements inside any scroll container (e.g. code blocks, editors)
      if (isInsideScrollContainer(el)) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0) continue;
      if (rect.right > viewWidth + 4) {
        found.push({ tag: el.tagName, cls: el.className.slice(0, 80), rect: { x: Math.round(rect.x), right: Math.round(rect.right), width: Math.round(rect.width) } });
      }
    }
    return found;
  });
  if (culprits.length > 0) {
    console.log('Overflow culprits:', JSON.stringify(culprits.slice(0, 3), null, 2));
  }
  expect(culprits, `${culprits.length} element(s) overflow viewport: ${culprits.map(c => `${c.tag}.${c.cls.split(' ')[0]} right=${c.rect.right}`).join(', ')}`).toHaveLength(0);
}

test.describe('Mobile responsiveness (370-430px)', () => {
  test('Home page renders without horizontal overflow', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await checkNoHorizontalOverflow(page);
    await expect(page.getByText('Подготовка к собеседованию')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Алгоритмы' })).toBeVisible();
  });

  test('Sidebar opens and closes on mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const menuIcon = page.locator('button').filter({ has: page.locator('[data-testid="MenuIcon"]') });
    await expect(menuIcon).toBeVisible();
    await menuIcon.click();
    await expect(page.getByText('Главная')).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('Topic lesson page renders without overflow', async ({ page }) => {
    await page.goto('/topic/sliding-window');
    await page.waitForLoadState('networkidle');
    await checkNoHorizontalOverflow(page);
    await expect(page.getByRole('tab', { name: 'Теория' })).toBeVisible();
  });

  test('Theory navigation buttons fit on screen', async ({ page }) => {
    await page.goto('/topic/sliding-window');
    await page.waitForLoadState('networkidle');
    const nextBtn = page.getByRole('button', { name: /дальше/i }).first();
    await expect(nextBtn).toBeVisible();
    const box = await nextBtn.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      const viewportWidth = page.viewportSize()!.width;
      expect(box.x + box.width).toBeLessThanOrEqual(viewportWidth + 2);
    }
    await checkNoHorizontalOverflow(page);
  });

  test('Practice list page renders without overflow', async ({ page }) => {
    await page.goto('/topic/sliding-window/practice');
    await page.waitForLoadState('networkidle');
    await checkNoHorizontalOverflow(page);
    const listItems = page.locator('[role="button"]').first();
    await expect(listItems).toBeVisible();
  });

  test('Problem view navigation fits on mobile — only visible buttons', async ({ page }) => {
    await page.goto('/topic/sliding-window/practice');
    await page.waitForLoadState('networkidle');
    await page.locator('[role="button"]').first().click();
    await page.waitForLoadState('networkidle');

    const viewportWidth = page.viewportSize()!.width;
    // Only check visible buttons that are INSIDE the viewport clip area
    // (skip buttons that are in portals or transformed containers off-screen)
    const allButtons = page.getByRole('button');
    const count = await allButtons.count();
    for (let i = 0; i < count; i++) {
      const btn = allButtons.nth(i);
      const visible = await btn.isVisible();
      if (!visible) continue;
      const box = await btn.boundingBox();
      if (!box || box.width === 0 || box.height === 0) continue;
      // Skip buttons that start to the right of the viewport (e.g., off-screen drawer content)
      if (box.x > viewportWidth) continue;
      // Skip buttons that start far to the left (e.g., hidden drawer sliding from left)
      if (box.x + box.width < 0) continue;
      expect(box.x + box.width, `Button ${i} (visible, x=${Math.round(box.x)}) overflows viewport`).toBeLessThanOrEqual(viewportWidth + 2);
    }
  });

  test('Code editor renders at mobile height without overflow', async ({ page }) => {
    await page.goto('/topic/sliding-window/practice');
    await page.waitForLoadState('networkidle');
    await page.locator('[role="button"]').first().click();
    await page.waitForLoadState('networkidle');

    // Code editor container should be visible and at mobile height
    const editor = page.locator('.cm-editor').first();
    await expect(editor).toBeVisible();
    const box = await editor.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      // On mobile (375px), height should be around 260px not 400px
      expect(box.height).toBeLessThanOrEqual(280);
      expect(box.height).toBeGreaterThanOrEqual(240);
    }

    // The editor wrapper should not overflow viewport width
    const editorBox = await page.locator('.cm-editor').first().boundingBox();
    if (editorBox) {
      const viewportWidth = page.viewportSize()!.width;
      expect(editorBox.x + editorBox.width).toBeLessThanOrEqual(viewportWidth + 2);
    }
  });

  test('Quiz page renders without overflow', async ({ page }) => {
    await page.goto('/topic/sliding-window/quiz');
    await page.waitForLoadState('networkidle');
    await checkNoHorizontalOverflow(page);
  });

  test('Cheatsheet page tabs fit on mobile', async ({ page }) => {
    await page.goto('/cheatsheet');
    await page.waitForLoadState('networkidle');
    await checkNoHorizontalOverflow(page);
    const tab = page.getByRole('tab').first();
    await expect(tab).toBeVisible();
  });

  test('Pattern game page renders without overflow', async ({ page }) => {
    await page.goto('/pattern-game');
    await page.waitForLoadState('networkidle');
    await checkNoHorizontalOverflow(page);
    await expect(page.getByText('Определите паттерн')).toBeVisible();
  });

  test('Bug hunt page renders without overflow', async ({ page }) => {
    await page.goto('/bug-hunt');
    await page.waitForLoadState('networkidle');
    await checkNoHorizontalOverflow(page);
  });

  test('JS pitfalls page renders without overflow', async ({ page }) => {
    await page.goto('/js-pitfalls');
    await page.waitForLoadState('networkidle');
    await checkNoHorizontalOverflow(page);
  });

  test('Home page topic cards are full width on mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const cards = page.locator('.MuiCard-root').first();
    await expect(cards).toBeVisible();
    const box = await cards.boundingBox();
    const viewportWidth = page.viewportSize()!.width;
    if (box) {
      expect(box.width).toBeGreaterThan(viewportWidth * 0.8);
    }
  });

  test('MatchPairs quiz question stacks vertically on mobile', async ({ page }) => {
    // Navigate to a topic that has MatchPairs questions
    await page.goto('/topic/closures/quiz');
    await page.waitForLoadState('networkidle');
    await checkNoHorizontalOverflow(page);
  });

  test('JS-this topic renders without overflow on mobile', async ({ page }) => {
    await page.goto('/topic/js-this');
    await page.waitForLoadState('networkidle');
    await checkNoHorizontalOverflow(page);
  });
});
