import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import {
  NavigationComponent,
  ProfileComponent,
  BlogPostComponent,
  FooterComponent,
} from './components';

/**
 * HomePage - Main landing page of the QAbbalah blog
 *
 * Demonstrates: Page Object composition using components
 * Combines multiple components into a cohesive page object.
 */
export class HomePage extends BasePage {
  protected readonly pageUrl = '';
  protected readonly pageTitle = /QAbbalah|Alejandro/i;

  // Page components
  public readonly navigation: NavigationComponent;
  public readonly profile: ProfileComponent;
  public readonly blogPosts: BlogPostComponent;
  public readonly footer: FooterComponent;

  // Page-specific elements
  private readonly mainContent: Locator;
  private readonly recentPostsSection: Locator;
  private readonly masthead: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize components
    this.navigation = new NavigationComponent(page);
    this.profile = new ProfileComponent(page);
    this.blogPosts = new BlogPostComponent(page);
    this.footer = new FooterComponent(page);

    // Initialize page-specific locators (based on actual page structure)
    this.mainContent = page.locator('#main');
    this.recentPostsSection = page.locator('.archive__item').first();
    this.masthead = page.locator('.masthead');
  }

  /**
   * Navigate to home page and wait for content
   */
  async navigate(): Promise<void> {
    await super.navigate();
    await this.waitForHomePageContent();
  }

  /**
   * Wait for home page specific content to load
   */
  async waitForHomePageContent(): Promise<void> {
    await this.mainContent.waitFor({ state: 'visible', timeout: 15000 });
  }

  /**
   * Verify all main sections are visible
   */
  async verifyAllSectionsVisible(): Promise<void> {
    await expect(this.mainContent).toBeVisible();
  }

  /**
   * Get the main heading text
   */
  async getMainHeading(): Promise<string> {
    const heading = this.page.locator('h1, .site-title').first();
    return (await heading.textContent())?.trim() ?? '';
  }

  /**
   * Check if recent posts section exists
   */
  async hasRecentPostsSection(): Promise<boolean> {
    return this.recentPostsSection.isVisible();
  }

  /**
   * Get the number of recent posts displayed
   */
  async getRecentPostsCount(): Promise<number> {
    return this.blogPosts.getPostCount();
  }

  /**
   * Get main content locator
   */
  getMainContentLocator(): Locator {
    return this.mainContent;
  }

  /**
   * Get recent posts section locator
   */
  getRecentPostsSectionLocator(): Locator {
    return this.recentPostsSection;
  }

  /**
   * Verify home page loaded correctly
   */
  async verifyPageLoaded(): Promise<void> {
    await this.verifyPageTitle();
    await this.verifyAllSectionsVisible();
  }

  /**
   * Navigate to a specific post from home page
   */
  async navigateToPost(postTitle: string): Promise<void> {
    await this.blogPosts.clickPostByTitle(postTitle);
  }

  /**
   * Get all visible sections on the page
   */
  async getVisibleSections(): Promise<string[]> {
    const sections: string[] = [];

    if (await this.navigation.isVisible()) sections.push('navigation');
    if (await this.profile.isVisible()) sections.push('profile');
    if (await this.blogPosts.isVisible()) sections.push('blog-posts');
    if (await this.footer.isVisible()) sections.push('footer');

    return sections;
  }
}
