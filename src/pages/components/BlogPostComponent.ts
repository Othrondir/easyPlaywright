import { Page, Locator } from '@playwright/test';

/**
 * BlogPostCard - Represents an individual blog post preview card
 *
 * Demonstrates: Dynamic component pattern for repeated elements
 */
export interface BlogPostData {
  title: string;
  date: string;
  description: string;
  tags: string[];
  url: string | null;
}

/**
 * BlogPostComponent - Handles blog post listings and interactions
 */
export class BlogPostComponent {
  private readonly page: Page;

  // Post listing elements
  private readonly postsContainer: Locator;
  private readonly postCards: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators (based on actual page structure - archive__item pattern)
    this.postsContainer = page.locator('#main, .entries-list, .archive').first();
    this.postCards = page.locator('article.archive__item, .archive__item');
  }

  /**
   * Get total number of posts displayed
   */
  async getPostCount(): Promise<number> {
    // Wait for posts to be visible
    await this.postsContainer.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    return this.postCards.count();
  }

  /**
   * Get all post titles
   */
  async getAllPostTitles(): Promise<string[]> {
    const titles: string[] = [];
    const titleLocators = this.page.locator('.archive__item-title a, .archive__item h2 a, article.archive__item a[rel="permalink"]');
    const count = await titleLocators.count();

    for (let i = 0; i < count; i++) {
      const text = await titleLocators.nth(i).textContent();
      if (text?.trim()) {
        titles.push(text.trim());
      }
    }

    return titles;
  }

  /**
   * Get post data by index
   */
  async getPostByIndex(index: number): Promise<BlogPostData> {
    const posts = this.postCards;
    const post = posts.nth(index);

    const titleElement = post.locator('.archive__item-title a, h2 a, a[rel="permalink"]').first();
    const dateElement = post.locator('time, .page__meta-date, .archive__item-excerpt time').first();
    const descElement = post.locator('.archive__item-excerpt p, p.archive__item-excerpt').first();
    const tagElements = post.locator('.page__taxonomy a, .archive__item-tags a');

    const title = (await titleElement.textContent())?.trim() ?? '';
    const date = (await dateElement.textContent())?.trim() ?? '';
    const description = (await descElement.textContent())?.trim() ?? '';
    const url = await titleElement.getAttribute('href');

    const tags: string[] = [];
    const tagCount = await tagElements.count();
    for (let i = 0; i < tagCount; i++) {
      const tagText = await tagElements.nth(i).textContent();
      if (tagText?.trim()) {
        tags.push(tagText.trim());
      }
    }

    return { title, date, description, tags, url };
  }

  /**
   * Click on a post by title
   */
  async clickPostByTitle(title: string): Promise<void> {
    const postLink = this.page.locator(`.archive__item-title a:has-text("${title}"), a[rel="permalink"]:has-text("${title}")`).first();
    await postLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click on a post by index
   */
  async clickPostByIndex(index: number): Promise<void> {
    const posts = this.page.locator('.archive__item-title a, article.archive__item a[rel="permalink"]');
    await posts.nth(index).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if posts section is visible
   */
  async isVisible(): Promise<boolean> {
    return this.postsContainer.isVisible();
  }

  /**
   * Get posts container locator (for assertions)
   */
  getPostsContainerLocator(): Locator {
    return this.postsContainer;
  }

  /**
   * Get all post card locators
   */
  getPostCardsLocator(): Locator {
    return this.postCards;
  }

  /**
   * Search for post containing specific text
   */
  async findPostContaining(searchText: string): Promise<BlogPostData | null> {
    const posts = await this.getAllPostTitles();
    const matchingIndex = posts.findIndex((title) =>
      title.toLowerCase().includes(searchText.toLowerCase())
    );

    if (matchingIndex >= 0) {
      return this.getPostByIndex(matchingIndex);
    }

    return null;
  }
}
