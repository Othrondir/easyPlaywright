import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { NavigationComponent, ProfileComponent, FooterComponent } from './components';

/**
 * PostPage - Individual blog post page
 *
 * Demonstrates: Dynamic page handling for content pages
 */
export class PostPage extends BasePage {
  protected readonly pageUrl = 'posts/';
  protected readonly pageTitle = /QAbbalah/i;

  // Page components
  public readonly navigation: NavigationComponent;
  public readonly profile: ProfileComponent;
  public readonly footer: FooterComponent;

  // Post-specific elements
  private readonly postContent: Locator;
  private readonly postTitle: Locator;
  private readonly postDate: Locator;
  private readonly postBody: Locator;
  private readonly postTags: Locator;
  private readonly postCategory: Locator;
  private readonly readingTime: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize components
    this.navigation = new NavigationComponent(page);
    this.profile = new ProfileComponent(page);
    this.footer = new FooterComponent(page);

    // Initialize post-specific locators
    this.postContent = page.locator('main article, .post, .post-content, article');
    this.postTitle = page.locator('h1.post-title, article h1, .post-title').first();
    this.postDate = page.locator('.post-meta time, time.dt-published, .post-date').first();
    this.postBody = page.locator('.post-content, article .content, .e-content');
    this.postTags = page.locator('.post-tag, .tag, a[href*="/tags/"]');
    this.postCategory = page.locator('.post-category, a[href*="/categories/"]');
    this.readingTime = page.locator('.reading-time, .read-time');
  }

  /**
   * Navigate to a specific post by slug
   */
  async navigateToPost(slug: string): Promise<void> {
    await this.page.goto(`/posts/${slug}/`);
    await this.waitForPostContent();
  }

  /**
   * Wait for post content to load
   */
  async waitForPostContent(): Promise<void> {
    await this.postContent.waitFor({ state: 'visible', timeout: 15000 });
  }

  /**
   * Get post title
   */
  async getPostTitle(): Promise<string> {
    return (await this.postTitle.textContent())?.trim() ?? '';
  }

  /**
   * Get post date
   */
  async getPostDate(): Promise<string> {
    return (await this.postDate.textContent())?.trim() ?? '';
  }

  /**
   * Get post body text
   */
  async getPostBody(): Promise<string> {
    return (await this.postBody.textContent())?.trim() ?? '';
  }

  /**
   * Get all post tags
   */
  async getPostTags(): Promise<string[]> {
    const tags: string[] = [];
    const count = await this.postTags.count();

    for (let i = 0; i < count; i++) {
      const text = await this.postTags.nth(i).textContent();
      if (text?.trim()) {
        tags.push(text.trim());
      }
    }

    return tags;
  }

  /**
   * Check if post has specific tag
   */
  async hasTag(tagName: string): Promise<boolean> {
    const tags = await this.getPostTags();
    return tags.some((tag) => tag.toLowerCase().includes(tagName.toLowerCase()));
  }

  /**
   * Click on a tag to filter posts
   */
  async clickTag(tagName: string): Promise<void> {
    await this.page.locator(`a[href*="/tags/"]:has-text("${tagName}")`).first().click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify post page loaded correctly
   */
  async verifyPageLoaded(): Promise<void> {
    await expect(this.postContent).toBeVisible();
    await expect(this.postTitle).toBeVisible();
  }

  /**
   * Get word count estimate
   */
  async getWordCount(): Promise<number> {
    const bodyText = await this.getPostBody();
    return bodyText.split(/\s+/).filter((word) => word.length > 0).length;
  }

  /**
   * Check if post content contains text
   */
  async contentContains(text: string): Promise<boolean> {
    const bodyText = await this.getPostBody();
    return bodyText.toLowerCase().includes(text.toLowerCase());
  }

  /**
   * Get post title locator
   */
  getPostTitleLocator(): Locator {
    return this.postTitle;
  }

  /**
   * Get post content locator
   */
  getPostContentLocator(): Locator {
    return this.postContent;
  }

  /**
   * Get post body locator
   */
  getPostBodyLocator(): Locator {
    return this.postBody;
  }
}
