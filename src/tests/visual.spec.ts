import { test, expect } from '../fixtures';
import { Viewports } from '../data';

/**
 * Visual Regression Test Suite
 *
 * Purpose: Detect unintended visual changes
 * Uses Playwright's built-in screenshot comparison.
 *
 * Note: First run will generate baseline screenshots.
 * Subsequent runs compare against baselines.
 */

test.describe('Visual Regression Tests @visual', () => {
  test.describe('Homepage Visual Tests', () => {
    test('homepage should match desktop baseline', async ({ homePage, page }) => {
      await page.setViewportSize({
        width: Viewports.desktop.width,
        height: Viewports.desktop.height,
      });

      await homePage.navigate();

      // Wait for all images and content to load
      await page.waitForLoadState('networkidle');

      // Take full page screenshot and compare
      await expect(page).toHaveScreenshot('homepage-desktop.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.1, // Allow 10% difference for dynamic content
      });
    });

    test('homepage should match tablet baseline', async ({ homePage, page }) => {
      await page.setViewportSize({
        width: Viewports.tablet.width,
        height: Viewports.tablet.height,
      });

      await homePage.navigate();
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('homepage-tablet.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.1,
      });
    });

    test('homepage should match mobile baseline', async ({ homePage, page }) => {
      await page.setViewportSize({
        width: Viewports.mobile.width,
        height: Viewports.mobile.height,
      });

      await homePage.navigate();
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('homepage-mobile.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.15, // More tolerance for mobile
      });
    });
  });

  test.describe('Component Visual Tests', () => {
    test('profile section should match baseline', async ({ homePage, page }) => {
      await homePage.navigate();
      await page.waitForLoadState('networkidle');

      const profileSection = homePage.profile.getAvatarLocator();

      if (await profileSection.isVisible()) {
        await expect(profileSection).toHaveScreenshot('profile-avatar.png', {
          maxDiffPixelRatio: 0.1,
        });
      }
    });

    test('navigation should match baseline', async ({ homePage, page }) => {
      await page.setViewportSize({
        width: Viewports.desktop.width,
        height: Viewports.desktop.height,
      });

      await homePage.navigate();
      await page.waitForLoadState('networkidle');

      const nav = page.locator('nav, #topbar-wrapper, .topbar-wrapper').first();

      if (await nav.isVisible()) {
        await expect(nav).toHaveScreenshot('navigation-desktop.png', {
          maxDiffPixelRatio: 0.1,
        });
      }
    });

    test('footer should match baseline', async ({ homePage, page }) => {
      await homePage.navigate();
      await homePage.footer.scrollIntoView();

      const footer = homePage.footer.getFooterLocator();

      if (await footer.isVisible()) {
        await expect(footer).toHaveScreenshot('footer.png', {
          maxDiffPixelRatio: 0.1,
        });
      }
    });
  });

  test.describe('About Page Visual Tests', () => {
    test('about page should match desktop baseline', async ({ aboutPage, page }) => {
      await page.setViewportSize({
        width: Viewports.desktop.width,
        height: Viewports.desktop.height,
      });

      await aboutPage.navigate();
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('about-desktop.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.1,
      });
    });
  });

  test.describe('Interaction State Visual Tests', () => {
    test('link hover state should be visible', async ({ homePage, page }) => {
      await homePage.navigate();

      // Find a navigation link
      const navLink = page.locator('nav a, #topbar-wrapper a').first();

      if (await navLink.isVisible()) {
        // Hover over the link
        await navLink.hover();

        // Take screenshot of hover state
        await expect(navLink).toHaveScreenshot('nav-link-hover.png', {
          maxDiffPixelRatio: 0.2,
        });
      }
    });

    test('focus state should be visible', async ({ homePage, page }) => {
      await homePage.navigate();

      // Find first interactive element
      const firstLink = page.locator('a[href]').first();

      if (await firstLink.isVisible()) {
        // Focus the element
        await firstLink.focus();

        // Take screenshot of focus state
        await expect(firstLink).toHaveScreenshot('link-focus.png', {
          maxDiffPixelRatio: 0.2,
        });
      }
    });
  });
});
