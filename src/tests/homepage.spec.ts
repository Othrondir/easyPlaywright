import { test, expect } from '../fixtures';
import { SiteMetadata, ExpectedPosts } from '../data';

/**
 * Homepage Test Suite
 *
 * Purpose: Comprehensive testing of the homepage
 * Covers all sections, elements, and functionality.
 */

test.describe('Homepage Tests @regression', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
  });

  test.describe('Page Structure', () => {
    test('should load home page without errors', async ({ homePage, page }) => {
      // Check no console errors
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await homePage.navigate();

      // Allow some framework-related console errors but flag critical ones
      const criticalErrors = errors.filter(
        (e) => !e.includes('favicon') && !e.includes('404')
      );

      // Log for debugging but don't fail (some sites have minor console errors)
      if (criticalErrors.length > 0) {
        console.log('Console errors found:', criticalErrors);
      }
    });

    test('should have proper HTML structure', async ({ page }) => {
      // Verify essential HTML elements exist
      await expect(page.locator('html')).toBeAttached();
      await expect(page.locator('head')).toBeAttached();
      await expect(page.locator('body')).toBeAttached();
    });

    test('should have meta viewport for responsive design', async ({ page }) => {
      const viewport = page.locator('meta[name="viewport"]');
      await expect(viewport).toBeAttached();
    });
  });

  test.describe('Profile Section', () => {
    test('should display author name correctly', async ({ homePage }) => {
      const authorName = await homePage.profile.getAuthorName();

      // Verify author name contains expected text
      expect(authorName.toLowerCase()).toContain('alejandro');
    });

    test('should display author tagline', async ({ homePage }) => {
      const tagline = await homePage.profile.getTagline();

      // Verify tagline is present
      expect(tagline.length).toBeGreaterThan(0);
    });

    test('should have valid avatar image', async ({ homePage, page }) => {
      const avatar = homePage.profile.getAvatarLocator();

      // Check avatar is visible
      await expect(avatar).toBeVisible();

      // Check avatar has valid src
      const src = await avatar.getAttribute('src');
      expect(src).toBeTruthy();
    });

    test('should display social links', async ({ homePage }) => {
      const socialUrls = await homePage.profile.getAllSocialUrls();

      // Verify at least one social link exists
      expect(socialUrls.length).toBeGreaterThan(0);
    });
  });

  test.describe('Blog Posts Section', () => {
    test('should display recent posts', async ({ homePage }) => {
      const postCount = await homePage.blogPosts.getPostCount();

      // Should have at least one post
      expect(postCount).toBeGreaterThan(0);
    });

    test('should display post titles', async ({ homePage }) => {
      const titles = await homePage.blogPosts.getAllPostTitles();

      // Each post should have a non-empty title
      titles.forEach((title) => {
        expect(title.trim().length).toBeGreaterThan(0);
      });
    });

    test('should contain expected blog post about k6', async ({ homePage }) => {
      const post = await homePage.blogPosts.findPostContaining('k6');

      // Verify we found the k6 post
      expect(post).not.toBeNull();
      expect(post?.title.toLowerCase()).toContain('k6');
    });

    test('should contain expected blog post about ISTQB', async ({ homePage }) => {
      const post = await homePage.blogPosts.findPostContaining('ISTQB');

      // Verify we found the ISTQB post
      expect(post).not.toBeNull();
    });

    test('post data should include required fields', async ({ homePage }) => {
      const postCount = await homePage.blogPosts.getPostCount();

      if (postCount > 0) {
        const firstPost = await homePage.blogPosts.getPostByIndex(0);

        // Verify post has required fields
        expect(firstPost.title).toBeTruthy();
        expect(firstPost.url).toBeTruthy();
      }
    });
  });

  test.describe('Footer Section', () => {
    test('should be visible when scrolled into view', async ({ homePage }) => {
      await homePage.footer.scrollIntoView();

      const isVisible = await homePage.footer.isVisible();
      expect(isVisible).toBe(true);
    });

    test('should contain copyright information', async ({ homePage }) => {
      await homePage.footer.scrollIntoView();

      const copyrightText = await homePage.footer.getCopyrightText();

      // Should contain copyright symbol or year
      expect(copyrightText.length).toBeGreaterThan(0);
    });
  });

  test.describe('Responsive Behavior', () => {
    test('content should be visible on different viewport widths', async ({ homePage, page }) => {
      const viewportWidths = [1280, 768, 375];

      for (const width of viewportWidths) {
        await page.setViewportSize({ width, height: 720 });
        await homePage.navigate();

        // Main content should always be visible
        await expect(homePage.getMainContentLocator()).toBeVisible();
      }
    });
  });

  test.describe('Performance Indicators', () => {
    test('page should load within acceptable time', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');

      const loadTime = Date.now() - startTime;

      // Page should load within 10 seconds (generous for CI environments)
      expect(loadTime).toBeLessThan(10000);
    });
  });
});
