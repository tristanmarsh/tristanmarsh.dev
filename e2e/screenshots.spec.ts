import { test } from '@playwright/test';

const pages = [
  { name: 'home', path: '/' },
  { name: 'work', path: '/work/' },
  { name: 'about', path: '/about/' },
  { name: 'uses', path: '/uses/' },
];

const themes = ['light', 'dark'] as const;

for (const { name, path } of pages) {
  for (const theme of themes) {
    test(`${name} - ${theme}`, async ({ page }, testInfo) => {
      await page.goto(path);

      if (theme === 'dark') {
        await page.evaluate(() => document.documentElement.classList.add('theme-dark'));
      } else {
        await page.evaluate(() => document.documentElement.classList.remove('theme-dark'));
      }

      // Wait 200ms for theme CSS custom properties and transitions to finish applying
      await page.waitForTimeout(200);

      const viewport = testInfo.project.name; // 'desktop' or 'mobile'
      await page.screenshot({
        path: `test-results/screenshots/${name}-${theme}-${viewport}.png`,
        fullPage: true,
      });
    });
  }
}
