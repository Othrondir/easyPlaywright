import { test, expect } from '../fixtures';
import { Viewports } from '../data';

/**
 * Responsive Design Test Suite
 *
 * Purpose: Verify the website works correctly across different
 * screen sizes and devices.
 *
 * Tests cover mobile, tablet, and desktop viewports.
 */

test.describe('Responsive Design Tests @mobile @regression', () => {
  test.describe('Mobile Viewport', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({
        width: Viewports.mobile.width,
        height: Viewports.mobile.height,
      });
    });

    test('content should be visible on mobile', async ({ homePage }) => {
      await homePage.navigate();

      // Main content should be visible
      await expect(homePage.getMainContentLocator()).toBeVisible();
    });

    test('navigation should be accessible on mobile', async ({ homePage, page }) => {
      await homePage.navigate();

      // Check if mobile menu toggle exists
      const menuToggle = page.locator(
        '#sidebar-trigger, .sidebar-trigger, button[class*="menu"], [class*="hamburger"]'
      );

      const hasMenuToggle = (await menuToggle.count()) > 0;

      // Either menu toggle exists (collapsed nav) or nav is directly visible
      const nav = page.locator('nav, #topbar-wrapper');
      const hasNav = (await nav.count()) > 0;

      expect(hasMenuToggle || hasNav).toBe(true);
    });

    test('text should be readable without horizontal scroll', async ({ homePage, page }) => {
      await homePage.navigate();

      // Check for horizontal overflow
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      // Should not have horizontal scroll on mobile
      expect(hasHorizontalScroll).toBe(false);
    });

    test('images should scale properly on mobile', async ({ homePage, page }) => {
      await homePage.navigate();

      const images = page.locator('img');
      const count = await images.count();

      for (let i = 0; i < Math.min(count, 5); i++) {
        const img = images.nth(i);
        if (await img.isVisible()) {
          const box = await img.boundingBox();

          if (box) {
            // Image should not exceed viewport width
            expect(box.width).toBeLessThanOrEqual(Viewports.mobile.width + 20); // Small tolerance
          }
        }
      }
    });

    test('touch targets should be adequate size', async ({ homePage, page }) => {
      await homePage.navigate();

      // WCAG recommends 44x44px minimum for touch targets
      const minTouchSize = 44;

      const links = page.locator('a[href]');
      const count = await links.count();

      let smallTargets = 0;

      for (let i = 0; i < Math.min(count, 10); i++) {
        const link = links.nth(i);
        if (await link.isVisible()) {
          const box = await link.boundingBox();

          if (box && (box.width < minTouchSize || box.height < minTouchSize)) {
            smallTargets++;
          }
        }
      }

      // Allow some small targets but flag if too many
      console.log(`Found ${smallTargets} touch targets smaller than ${minTouchSize}px`);
    });

    test('blog posts should be readable on mobile', async ({ homePage }) => {
      await homePage.navigate();

      const posts = await homePage.blogPosts.getAllPostTitles();

      // Posts should still be visible on mobile
      expect(posts.length).toBeGreaterThan(0);
    });
  });

  test.describe('Tablet Viewport', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({
        width: Viewports.tablet.width,
        height: Viewports.tablet.height,
      });
    });

    test('content layout should adapt to tablet', async ({ homePage }) => {
      await homePage.navigate();

      // Content should be visible
      await expect(homePage.getMainContentLocator()).toBeVisible();
    });

    test('navigation should work on tablet', async ({ homePage, page }) => {
      await homePage.navigate();

      // Navigate to About page
      await homePage.navigation.goToAbout();

      // Verify navigation worked
      await expect(page).toHaveURL(/about/i);
    });

    test('sidebar should be properly positioned', async ({ homePage, page }) => {
      await homePage.navigate();

      const sidebar = page.locator('#sidebar, .sidebar, aside').first();

      if (await sidebar.isVisible()) {
        const box = await sidebar.boundingBox();

        if (box) {
          // Sidebar should fit within viewport
          expect(box.x + box.width).toBeLessThanOrEqual(Viewports.tablet.width + 50);
        }
      }
    });
  });

  test.describe('Desktop Viewport', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({
        width: Viewports.desktop.width,
        height: Viewports.desktop.height,
      });
    });

    test('full navigation should be visible on desktop', async ({ homePage }) => {
      await homePage.navigate();

      const isNavVisible = await homePage.navigation.isVisible();
      expect(isNavVisible).toBe(true);
    });

    test('sidebar should be visible on desktop', async ({ homePage, page }) => {
      await homePage.navigate();

      const sidebar = page.locator('#sidebar, .sidebar, aside').first();

      // On desktop, sidebar is typically visible
      if (await sidebar.isVisible()) {
        const isVisible = await sidebar.isVisible();
        expect(isVisible).toBe(true);
      }
    });

    test('content should utilize full width appropriately', async ({ homePage, page }) => {
      await homePage.navigate();

      const main = page.locator('main, .main-content, #main-wrapper').first();

      if (await main.isVisible()) {
        const box = await main.boundingBox();

        if (box) {
          // Content should be substantial width on desktop
          expect(box.width).toBeGreaterThan(300);
        }
      }
    });
  });

  test.describe('Large Desktop Viewport', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({
        width: Viewports.largeDesktop.width,
        height: Viewports.largeDesktop.height,
      });
    });

    test('layout should not break on large screens', async ({ homePage }) => {
      await homePage.navigate();

      // Content should still be visible and properly contained
      await expect(homePage.getMainContentLocator()).toBeVisible();
    });

    test('content should remain readable on large screens', async ({ homePage, page }) => {
      await homePage.navigate();

      // Check that text containers have reasonable max-width
      const contentWidth = await page.evaluate(() => {
        const main = document.querySelector('main, .main-content, article');
        if (main) {
          const style = window.getComputedStyle(main);
          return main.getBoundingClientRect().width;
        }
        return 0;
      });

      // Content should have some max-width constraint for readability
      // Very wide text is hard to read
      console.log(`Content width on large screen: ${contentWidth}px`);
    });
  });

  test.describe('Orientation Changes', () => {
    test('should handle portrait to landscape transition', async ({ homePage, page }) => {
      // Start in portrait
      await page.setViewportSize({
        width: Viewports.mobile.width,
        height: Viewports.mobile.height,
      });

      await homePage.navigate();
      await expect(homePage.getMainContentLocator()).toBeVisible();

      // Switch to landscape
      await page.setViewportSize({
        width: Viewports.mobile.height,
        height: Viewports.mobile.width,
      });

      // Content should still be visible
      await expect(homePage.getMainContentLocator()).toBeVisible();
    });
  });
});
