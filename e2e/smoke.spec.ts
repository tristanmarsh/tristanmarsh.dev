import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  { name: 'home', path: '/' },
  { name: 'work', path: '/work/' },
  { name: 'about', path: '/about/' },
  { name: 'uses', path: '/uses/' },
];

for (const { name, path } of pages) {
  test.describe(`${name} (${path})`, () => {
    test('returns 200', async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
    });

    test('no console errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      expect(errors).toEqual([]);
    });

    test('has title and meta description', async ({ page }) => {
      await page.goto(path);
      const title = await page.title();
      expect(title).toBeTruthy();
      const description = page.locator('meta[name="description"]');
      await expect(description).toHaveAttribute('content', /.+/);
    });

    test('accessibility check (soft)', async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).analyze();
      if (results.violations.length > 0) {
        console.warn(
          `[a11y] ${name}: ${results.violations.length} violation(s) — ${results.violations.map((v) => v.id).join(', ')}`
        );
      }
      // Soft check: does not fail by default.
      // Use test:e2e:a11y to make this a hard gate.
    });

    test('accessibility hard gate @a11y', async ({ page }) => {
      test.skip(!process.env.PW_A11Y, 'Run with PW_A11Y=1 to enable hard a11y gate');
      await page.goto(path);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  });
}

// Blog pages — fixme until task 0001 lands
test.describe('blog index (/blog)', () => {
  test.fixme(true, 'Blog routes not yet implemented (task 0001)');

  test('returns 200', async ({ page }) => {
    const response = await page.goto('/blog/');
    expect(response?.status()).toBe(200);
  });

  test('has title and meta description', async ({ page }) => {
    await page.goto('/blog/');
    const title = await page.title();
    expect(title).toBeTruthy();
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /.+/);
  });
});
