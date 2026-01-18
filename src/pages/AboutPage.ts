import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { NavigationComponent, ProfileComponent, FooterComponent } from './components';

/**
 * AboutPage - About/Bio page of the QAbbalah blog
 *
 * Demonstrates: Page-specific locators with shared components
 */
export class AboutPage extends BasePage {
  protected readonly pageUrl = 'about/';
  protected readonly pageTitle = /About|QAbbalah/i;

  // Page components
  public readonly navigation: NavigationComponent;
  public readonly profile: ProfileComponent;
  public readonly footer: FooterComponent;

  // Page-specific elements
  private readonly aboutContent: Locator;
  private readonly aboutHeading: Locator;
  private readonly bioText: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize components
    this.navigation = new NavigationComponent(page);
    this.profile = new ProfileComponent(page);
    this.footer = new FooterComponent(page);

    // Initialize page-specific locators
    this.aboutContent = page.locator('main, .post-content, article, .content');
    this.aboutHeading = page.locator('h1, .post-title, article h1').first();
    this.bioText = page.locator('.post-content p, article p, .content p').first();
  }

  /**
   * Navigate to about page
   */
  async navigate(): Promise<void> {
    await super.navigate();
    await this.waitForAboutContent();
  }

  /**
   * Wait for about page content to load
   */
  async waitForAboutContent(): Promise<void> {
    await this.aboutContent.waitFor({ state: 'visible', timeout: 15000 });
  }

  /**
   * Get page heading text
   */
  async getHeadingText(): Promise<string> {
    return (await this.aboutHeading.textContent())?.trim() ?? '';
  }

  /**
   * Get bio/about text
   */
  async getBioText(): Promise<string> {
    return (await this.bioText.textContent())?.trim() ?? '';
  }

  /**
   * Check if about content is visible
   */
  async isContentVisible(): Promise<boolean> {
    return this.aboutContent.isVisible();
  }

  /**
   * Verify about page loaded correctly
   */
  async verifyPageLoaded(): Promise<void> {
    await expect(this.aboutContent).toBeVisible();
  }

  /**
   * Get about content locator
   */
  getAboutContentLocator(): Locator {
    return this.aboutContent;
  }

  /**
   * Get about heading locator
   */
  getAboutHeadingLocator(): Locator {
    return this.aboutHeading;
  }
}
