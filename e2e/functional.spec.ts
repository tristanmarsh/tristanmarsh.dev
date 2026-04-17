import { test, expect, type Page } from '@playwright/test';

// ---------- helpers ----------

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work/' },
  { label: 'About', href: '/about/' },
];

async function setTheme(page: Page, theme: 'light' | 'dark') {
  if (theme === 'dark') {
    await page.evaluate(() => document.documentElement.classList.add('theme-dark'));
  } else {
    await page.evaluate(() => document.documentElement.classList.remove('theme-dark'));
  }
}

/** On mobile the theme toggle is inside the hamburger menu — open it first. */
async function ensureThemeToggleVisible(page: Page) {
  const menuButton = page.locator('menu-button button');
  const isMenuButtonVisible = await menuButton.isVisible().catch(() => false);
  if (isMenuButtonVisible) {
    const menuContent = page.locator('#menu-content');
    const isMenuHidden = await menuContent.isHidden();
    if (isMenuHidden) {
      await menuButton.click();
      await expect(menuContent).toBeVisible();
    }
  }
}

// ---------- Navigation ----------

test.describe('Navigation', () => {
  test('desktop: all nav links exist and navigate correctly', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'Desktop-only test');
    await page.goto('/');
    for (const { label, href } of navLinks) {
      const link = page.locator(`nav a.link:has-text("${label}")`);
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', href);
    }
    // Click a link and verify navigation
    await page.locator('nav a.link:has-text("Work")').click();
    await expect(page).toHaveURL(/\/work\/?/);
  });

  test('mobile: hamburger menu opens and contains nav links', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only test');
    await page.goto('/');
    // Menu should be hidden initially
    const menuContent = page.locator('#menu-content');
    await expect(menuContent).toBeHidden();

    // Click the hamburger button
    const menuButton = page.locator('menu-button button');
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    // Menu should be visible now
    await expect(menuContent).toBeVisible();

    // All nav links present in the menu
    for (const { label } of navLinks) {
      const link = menuContent.locator(`a.link:has-text("${label}")`);
      await expect(link).toBeVisible();
    }
  });
});

// ---------- Theme toggle ----------

for (const startTheme of ['light', 'dark'] as const) {
  test.describe(`Theme toggle (starting ${startTheme})`, () => {
    test('clicking toggle switches theme', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await setTheme(page, startTheme);

      const html = page.locator('html');
      if (startTheme === 'dark') {
        await expect(html).toHaveClass(/theme-dark/);
      } else {
        await expect(html).not.toHaveClass(/theme-dark/);
      }

      // On mobile, open the hamburger menu to reveal the toggle
      await ensureThemeToggleVisible(page);

      // Click the theme toggle button
      await page.locator('theme-toggle button').click();

      if (startTheme === 'dark') {
        await expect(html).not.toHaveClass(/theme-dark/);
      } else {
        await expect(html).toHaveClass(/theme-dark/);
      }
    });

    test('theme persists across navigation', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await setTheme(page, startTheme);

      // On mobile, open the hamburger menu to reveal the toggle
      await ensureThemeToggleVisible(page);

      // Toggle theme
      await page.locator('theme-toggle button').click();
      const expectedDark = startTheme === 'light';

      // Navigate to another page
      await page.goto('/about/');

      const html = page.locator('html');
      if (expectedDark) {
        await expect(html).toHaveClass(/theme-dark/);
      } else {
        await expect(html).not.toHaveClass(/theme-dark/);
      }
    });
  });
}

// ---------- Command palette ----------

test.describe('Command palette', () => {
  test('opens via Cmd/Ctrl+K and shows options', async ({ page }) => {
    await page.goto('/');
    // Wait for the React component to hydrate
    await page.waitForLoadState('networkidle');

    // Open command palette with keyboard shortcut
    await page.keyboard.press('Meta+k');

    // The cmdk dialog should be visible
    const dialog = page.locator('[cmdk-dialog]');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Should have a search input
    const input = page.locator('[cmdk-input]');
    await expect(input).toBeVisible();

    // Should display page options
    await expect(page.locator('[cmdk-item]:has-text("Home")')).toBeVisible();
    await expect(page.locator('[cmdk-item]:has-text("Work")')).toBeVisible();
  });

  test('can search and filter items', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Meta+k');

    const dialog = page.locator('[cmdk-dialog]');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Type to filter
    const input = page.locator('[cmdk-input]');
    await input.fill('about');

    // Should show matching item
    await expect(page.locator('[cmdk-item]:has-text("About")')).toBeVisible();
  });

  test('can navigate with keyboard and select', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.keyboard.press('Meta+k');

    const dialog = page.locator('[cmdk-dialog]');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Filter to About
    const input = page.locator('[cmdk-input]');
    await input.fill('about');

    // Press Enter to select
    await page.keyboard.press('Enter');

    // Should navigate to about page
    await expect(page).toHaveURL(/\/about\/?/, { timeout: 5000 });
  });
});

// ---------- Blog (fixme until task 0001) ----------

test.describe('Blog index', () => {
  test.fixme(true, 'Blog routes not yet implemented (task 0001)');

  test('lists posts with links', async ({ page }) => {
    await page.goto('/blog/');
    const postLinks = page.locator('a[href^="/blog/"]');
    const count = await postLinks.count();
    expect(count).toBeGreaterThan(0);

    // Each link should point to a valid post path
    for (let i = 0; i < count; i++) {
      const href = await postLinks.nth(i).getAttribute('href');
      expect(href).toMatch(/^\/blog\/.+/);
    }
  });
});

test.describe('Blog post', () => {
  test.fixme(true, 'Blog routes not yet implemented (task 0001)');

  test('renders title, date, tags, and body content', async ({ page }) => {
    // Navigate to blog index first to find a post link
    await page.goto('/blog/');
    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    await firstPostLink.click();

    // Verify structural elements exist
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('time')).toBeVisible();
    // Body content should have meaningful text
    const article = page.locator('article, main');
    await expect(article).toBeVisible();
    const textContent = await article.textContent();
    expect(textContent?.length).toBeGreaterThan(50);
  });
});
