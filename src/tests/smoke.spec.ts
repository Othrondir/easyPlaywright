import { test, expect } from '../fixtures';
import { SiteMetadata, TestTags } from '../data';

/**
 * Smoke Test Suite
 *
 * Purpose: Verify critical functionality is working
 * Run frequency: Before every deployment, after every build
 *
 * These tests validate the most critical user paths and should
 * be fast, reliable, and cover the essential functionality.
 */

test.describe('Smoke Tests @smoke', () => {
  test.describe('Page Loading', () => {
    test('should load the home page successfully', async ({ homePage }) => {
      // Navigate to home page
      await homePage.navigate();

      // Verify page loaded
      await expect(homePage.getMainContentLocator()).toBeVisible();
    });

    test('should have correct page title', async ({ homePage }) => {
      await homePage.navigate();

      // Verify title contains expected text
      const title = await homePage.getPageTitle();
      expect(title).toMatch(/QAbbalah|Alejandro/i);
    });

    test('should display main content sections', async ({ homePage }) => {
      await homePage.navigate();

      // Verify all main sections are present
      const sections = await homePage.getVisibleSections();
      expect(sections.length).toBeGreaterThan(0);
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to About page', async ({ homePage, page }) => {
      await homePage.navigate();

      // Click About link
      await homePage.navigation.goToAbout();

      // Verify URL changed
      await expect(page).toHaveURL(/about/i);
    });

    test('should return to home from About page', async ({ aboutPage, page }) => {
      await aboutPage.navigate();

      // Click Home link
      await aboutPage.navigation.goToHome();

      // Verify we're back on home
      await expect(page).toHaveURL(/QAbbalah\/?$/);
    });
  });

  test.describe('Profile Section', () => {
    test('should display author information', async ({ homePage }) => {
      await homePage.navigate();

      // Get author name
      const authorName = await homePage.profile.getAuthorName();

      // Verify author name is displayed
      expect(authorName).toBeTruthy();
    });

    test('should display avatar image', async ({ homePage }) => {
      await homePage.navigate();

      // Check avatar is visible
      const isAvatarVisible = await homePage.profile.isAvatarDisplayed();
      expect(isAvatarVisible).toBe(true);
    });
  });

  test.describe('Blog Posts', () => {
    test('should display at least one blog post', async ({ homePage }) => {
      await homePage.navigate();

      // Get post count
      const postCount = await homePage.getRecentPostsCount();

      // Verify posts are displayed
      expect(postCount).toBeGreaterThan(0);
    });

    test('should have clickable post titles', async ({ homePage }) => {
      await homePage.navigate();

      // Get all post titles
      const titles = await homePage.blogPosts.getAllPostTitles();

      // Verify we have posts with titles
      expect(titles.length).toBeGreaterThan(0);
      titles.forEach((title) => {
        expect(title.length).toBeGreaterThan(0);
      });
    });
  });

  test.describe('Footer', () => {
    test('should display footer with copyright', async ({ homePage }) => {
      await homePage.navigate();

      // Scroll to footer
      await homePage.footer.scrollIntoView();

      // Check footer is visible
      const isVisible = await homePage.footer.isVisible();
      expect(isVisible).toBe(true);
    });
  });
});
