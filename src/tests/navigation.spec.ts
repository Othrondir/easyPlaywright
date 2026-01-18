import { test, expect } from '../fixtures';
import { NavigationLinks } from '../data';

/**
 * Navigation Test Suite
 *
 * Purpose: Comprehensive navigation testing
 * Validates all navigation paths and link behaviors.
 */

test.describe('Navigation Tests @regression', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
  });

  test.describe('Main Navigation Menu', () => {
    test('should display navigation bar', async ({ homePage }) => {
      const isNavVisible = await homePage.navigation.isVisible();
      expect(isNavVisible).toBe(true);
    });

    test('should navigate to Posts page', async ({ homePage, page }) => {
      await homePage.navigation.goToPosts();

      // Verify navigation (site uses year-archive path for posts)
      await expect(page).toHaveURL(/year-archive|posts/i);
    });

    test('should navigate to Categories page', async ({ homePage, page }) => {
      await homePage.navigation.goToCategories();

      // Verify navigation
      await expect(page).toHaveURL(/categories/i);
    });

    test('should navigate to Tags page', async ({ homePage, page }) => {
      await homePage.navigation.goToTags();

      // Verify navigation
      await expect(page).toHaveURL(/tags/i);
    });

    test('should navigate to About page', async ({ homePage, page }) => {
      await homePage.navigation.goToAbout();

      // Verify navigation
      await expect(page).toHaveURL(/about/i);
    });

    test('should return to Home from any page', async ({ homePage, page }) => {
      // Go to About first
      await homePage.navigation.goToAbout();
      await expect(page).toHaveURL(/about/i);

      // Return to Home
      await homePage.navigation.goToHome();

      // Verify we're on home
      await expect(page).toHaveURL(/QAbbalah\/?$/);
    });
  });

  test.describe('Navigation Link Attributes', () => {
    test('Home link should have correct href', async ({ homePage }) => {
      const homeLink = homePage.navigation.getHomeLinkLocator();
      const href = await homeLink.getAttribute('href');

      expect(href).toMatch(/\/QAbbalah\/?$|\/$/);
    });

    test('Posts link should point to posts section', async ({ homePage }) => {
      const postsLink = homePage.navigation.getPostsLinkLocator();
      const href = await postsLink.getAttribute('href');

      // Site uses year-archive path for posts
      expect(href).toMatch(/year-archive|posts/);
    });

    test('About link should point to about page', async ({ homePage }) => {
      const aboutLink = homePage.navigation.getAboutLinkLocator();
      const href = await aboutLink.getAttribute('href');

      expect(href).toContain('about');
    });
  });

  test.describe('Profile Navigation', () => {
    test('clicking author name should navigate to home', async ({ homePage, page }) => {
      // First go to another page
      await homePage.navigation.goToAbout();

      // Click author name in sidebar
      await homePage.profile.clickAuthorName();

      // Verify navigation to home
      await expect(page).toHaveURL(/QAbbalah/);
    });
  });

  test.describe('Blog Post Navigation', () => {
    test('should navigate to individual post when clicking title', async ({ homePage, page }) => {
      // Get first post title
      const titles = await homePage.blogPosts.getAllPostTitles();

      if (titles.length > 0) {
        // Click first post
        await homePage.blogPosts.clickPostByIndex(0);

        // Verify URL changed (should include 'posts' in URL)
        const url = page.url();
        expect(url).not.toMatch(/QAbbalah\/?$/);
      }
    });

    test('should be able to return from post to home', async ({ homePage, page }) => {
      // Navigate to a post first
      await homePage.blogPosts.clickPostByIndex(0);

      // Wait for post page to load
      await page.waitForLoadState('networkidle');

      // Navigate back to home
      await homePage.navigation.goToHome();

      // Verify we're on home
      await expect(page).toHaveURL(/QAbbalah\/?$/);
    });
  });

  test.describe('External Links', () => {
    test('GitHub link should have correct URL format', async ({ homePage }) => {
      const githubUrl = await homePage.profile.getGithubUrl();

      if (githubUrl) {
        expect(githubUrl).toMatch(/github\.com/);
      }
    });

    test('LinkedIn link should have correct URL format', async ({ homePage }) => {
      const linkedinUrl = await homePage.profile.getLinkedinUrl();

      if (linkedinUrl) {
        expect(linkedinUrl).toMatch(/linkedin\.com/);
      }
    });

    test('external links should be valid URLs', async ({ homePage }) => {
      const githubLink = homePage.profile.getGithubLinkLocator();

      if (await githubLink.isVisible()) {
        const href = await githubLink.getAttribute('href');
        // External links should have valid URLs
        expect(href).toMatch(/^https?:\/\//);
      }
    });
  });
});
