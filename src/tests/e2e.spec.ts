import { test, expect } from '../fixtures';

/**
 * End-to-End Test Suite
 *
 * Purpose: Test complete user journeys through the application
 * Simulates real user behavior and workflows.
 */

test.describe('End-to-End Tests @e2e @regression', () => {
  test.describe('User Journey: Browse Blog', () => {
    test('should complete full blog browsing journey', async ({ homePage, page }) => {
      // Step 1: Land on homepage
      await homePage.navigate();
      await expect(homePage.getMainContentLocator()).toBeVisible();

      // Step 2: View author information
      const authorName = await homePage.profile.getAuthorName();
      expect(authorName).toBeTruthy();

      // Step 3: Browse recent posts
      const posts = await homePage.blogPosts.getAllPostTitles();
      expect(posts.length).toBeGreaterThan(0);

      // Step 4: Click on a blog post
      if (posts.length > 0) {
        const homeUrl = page.url();
        await homePage.blogPosts.clickPostByIndex(0);

        // Verify we're on a post page
        await page.waitForLoadState('networkidle');
        const postUrl = page.url();
        expect(postUrl).not.toEqual(homeUrl);
      }

      // Step 5: Return to homepage
      await homePage.navigation.goToHome();
      await expect(page).toHaveURL(/QAbbalah/);
    });

    test('should explore navigation sections', async ({ homePage, page }) => {
      await homePage.navigate();

      // Visit each main section
      const sections = ['Posts', 'Categories', 'Tags', 'About'];

      for (const section of sections) {
        // Navigate based on section
        switch (section) {
          case 'Posts':
            await homePage.navigation.goToPosts();
            break;
          case 'Categories':
            await homePage.navigation.goToCategories();
            break;
          case 'Tags':
            await homePage.navigation.goToTags();
            break;
          case 'About':
            await homePage.navigation.goToAbout();
            break;
        }

        // Verify navigation occurred
        await page.waitForLoadState('networkidle');

        // Return to home for next iteration
        await homePage.navigation.goToHome();
        await expect(page).toHaveURL(/QAbbalah\/?$/);
      }
    });
  });

  test.describe('User Journey: Learn About Author', () => {
    test('should view author profile and social links', async ({ homePage, page }) => {
      await homePage.navigate();

      // Step 1: View profile section
      const authorName = await homePage.profile.getAuthorName();
      expect(authorName.toLowerCase()).toContain('alejandro');

      // Step 2: Check tagline
      const tagline = await homePage.profile.getTagline();
      expect(tagline).toBeTruthy();

      // Step 3: View social links
      const socialUrls = await homePage.profile.getAllSocialUrls();
      expect(socialUrls.length).toBeGreaterThan(0);

      // Step 4: Navigate to About page for more info
      await homePage.navigation.goToAbout();
      await expect(page).toHaveURL(/about/i);
    });

    test('should verify social link destinations', async ({ homePage, page, context }) => {
      await homePage.navigate();

      // Get GitHub URL
      const githubUrl = await homePage.profile.getGithubUrl();

      if (githubUrl) {
        // Verify it's a valid GitHub URL
        expect(githubUrl).toMatch(/github\.com/);
      }

      // Get LinkedIn URL
      const linkedinUrl = await homePage.profile.getLinkedinUrl();

      if (linkedinUrl) {
        // Verify it's a valid LinkedIn URL
        expect(linkedinUrl).toMatch(/linkedin\.com/);
      }
    });
  });

  test.describe('User Journey: Read Blog Post', () => {
    test('should read a complete blog post', async ({ homePage, postPage, page }) => {
      await homePage.navigate();

      // Step 1: Find an interesting post
      const post = await homePage.blogPosts.findPostContaining('k6');

      if (post) {
        // Step 2: Click to read the post
        await homePage.blogPosts.clickPostByTitle(post.title);
        await page.waitForLoadState('networkidle');

        // Step 3: Verify post content loaded
        await postPage.waitForPostContent();

        // Step 4: Check post has content
        const title = await postPage.getPostTitle();
        expect(title).toBeTruthy();

        // Step 5: Verify can return to home
        await postPage.navigation.goToHome();
        await expect(page).toHaveURL(/QAbbalah\/?$/);
      }
    });
  });

  test.describe('User Journey: Mobile User', () => {
    test('should complete journey on mobile device', async ({ homePage, page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Step 1: Load homepage
      await homePage.navigate();
      await expect(homePage.getMainContentLocator()).toBeVisible();

      // Step 2: View posts
      const posts = await homePage.blogPosts.getAllPostTitles();
      expect(posts.length).toBeGreaterThan(0);

      // Step 3: Navigate to About
      await homePage.navigation.goToAbout();
      await expect(page).toHaveURL(/about/i);

      // Step 4: Return home
      await homePage.navigation.goToHome();
      await expect(page).toHaveURL(/QAbbalah/);
    });
  });

  test.describe('User Journey: Search for Content', () => {
    test('should find specific blog posts', async ({ homePage }) => {
      await homePage.navigate();

      // Search for k6 content
      const k6Post = await homePage.blogPosts.findPostContaining('k6');
      expect(k6Post).not.toBeNull();
      expect(k6Post?.title.toLowerCase()).toContain('k6');

      // Search for ISTQB content
      const istqbPost = await homePage.blogPosts.findPostContaining('ISTQB');
      expect(istqbPost).not.toBeNull();
    });
  });

  test.describe('Cross-Browser Journey', () => {
    test('core functionality should work consistently', async ({ homePage, page }) => {
      // This test runs across all configured browsers
      await homePage.navigate();

      // Verify core elements
      await expect(homePage.getMainContentLocator()).toBeVisible();

      // Verify navigation works
      await homePage.navigation.goToAbout();
      await expect(page).toHaveURL(/about/i);

      // Verify can return home
      await homePage.navigation.goToHome();
      await expect(page).toHaveURL(/QAbbalah/);

      // Verify posts are displayed
      const posts = await homePage.blogPosts.getAllPostTitles();
      expect(posts.length).toBeGreaterThan(0);
    });
  });

  test.describe('Error Recovery', () => {
    test('should handle navigation to non-existent page', async ({ page }) => {
      // Try to navigate to a non-existent page
      const response = await page.goto('/non-existent-page-12345');

      // Page should return 404 or redirect
      if (response) {
        expect([200, 404]).toContain(response.status());
      }
    });

    test('should recover from failed navigation', async ({ homePage, page }) => {
      // First, navigate successfully
      await homePage.navigate();
      await expect(homePage.getMainContentLocator()).toBeVisible();

      // Try invalid navigation
      await page.goto('/invalid-path');

      // Navigate back to valid page
      await homePage.navigate();
      await expect(homePage.getMainContentLocator()).toBeVisible();
    });
  });
});
