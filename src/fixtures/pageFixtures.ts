import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { AboutPage } from '../pages/AboutPage';
import { PostPage } from '../pages/PostPage';

/**
 * Custom Playwright Fixtures
 *
 * Demonstrates: Fixture pattern for dependency injection
 * Provides pre-configured page objects to tests automatically.
 *
 * Benefits:
 * - Automatic page object instantiation
 * - Consistent test setup
 * - Reduced boilerplate in tests
 * - Easy to extend with new pages
 */

// Define custom fixture types
type PageFixtures = {
  homePage: HomePage;
  aboutPage: AboutPage;
  postPage: PostPage;
};

/**
 * Extended test with page object fixtures
 */
export const test = base.extend<PageFixtures>({
  /**
   * HomePage fixture - provides initialized HomePage instance
   */
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  /**
   * AboutPage fixture - provides initialized AboutPage instance
   */
  aboutPage: async ({ page }, use) => {
    const aboutPage = new AboutPage(page);
    await use(aboutPage);
  },

  /**
   * PostPage fixture - provides initialized PostPage instance
   */
  postPage: async ({ page }, use) => {
    const postPage = new PostPage(page);
    await use(postPage);
  },
});

export { expect } from '@playwright/test';
