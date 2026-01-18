import { Page, Locator } from '@playwright/test';

/**
 * FooterComponent - Represents the page footer section
 *
 * Demonstrates: Component encapsulation for footer elements
 */
export class FooterComponent {
  private readonly page: Page;

  // Footer elements
  private readonly footerContainer: Locator;
  private readonly copyrightText: Locator;
  private readonly rssLink: Locator;
  private readonly footerLinks: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators (based on actual page structure)
    this.footerContainer = page.locator('footer');
    this.copyrightText = page.locator('footer .page__footer-copyright, footer p, .page__footer-follow').first();
    this.rssLink = page.locator('a[href*="feed.xml"], a.fa-rss-square, a[href*="feed"]');
    this.footerLinks = page.locator('footer a, .page__footer a');
  }

  /**
   * Check if footer is visible
   */
  async isVisible(): Promise<boolean> {
    return this.footerContainer.isVisible();
  }

  /**
   * Get copyright text
   */
  async getCopyrightText(): Promise<string> {
    const text = await this.copyrightText.textContent();
    return text?.trim() ?? '';
  }

  /**
   * Check if copyright contains expected year
   */
  async containsYear(year: string): Promise<boolean> {
    const text = await this.getCopyrightText();
    return text.includes(year);
  }

  /**
   * Check if RSS link exists
   */
  async hasRssLink(): Promise<boolean> {
    return this.rssLink.isVisible();
  }

  /**
   * Get RSS feed URL
   */
  async getRssFeedUrl(): Promise<string | null> {
    if (await this.rssLink.isVisible()) {
      return this.rssLink.getAttribute('href');
    }
    return null;
  }

  /**
   * Click RSS link
   */
  async clickRssLink(): Promise<void> {
    await this.rssLink.click();
  }

  /**
   * Get all footer link URLs
   */
  async getAllFooterLinks(): Promise<string[]> {
    const urls: string[] = [];
    const count = await this.footerLinks.count();

    for (let i = 0; i < count; i++) {
      const href = await this.footerLinks.nth(i).getAttribute('href');
      if (href) {
        urls.push(href);
      }
    }

    return urls;
  }

  /**
   * Get footer container locator (for assertions)
   */
  getFooterLocator(): Locator {
    return this.footerContainer;
  }

  /**
   * Get copyright text locator (for assertions)
   */
  getCopyrightLocator(): Locator {
    return this.copyrightText;
  }

  /**
   * Get RSS link locator (for assertions)
   */
  getRssLinkLocator(): Locator {
    return this.rssLink;
  }

  /**
   * Scroll footer into view
   */
  async scrollIntoView(): Promise<void> {
    await this.footerContainer.scrollIntoViewIfNeeded();
  }
}
