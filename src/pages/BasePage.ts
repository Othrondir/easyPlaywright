import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage - Abstract base class for all Page Objects
 *
 * Implements common functionality and patterns shared across all pages.
 * Demonstrates: Encapsulation, DRY principle, and reusable methods.
 */
export abstract class BasePage {
  protected readonly page: Page;
  protected abstract readonly pageUrl: string;
  protected abstract readonly pageTitle: RegExp | string;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to the page
   */
  async navigate(): Promise<void> {
    await this.page.goto(this.pageUrl);
    await this.waitForPageLoad();
  }

  /**
   * Wait for the page to fully load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get the current page URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Get the page title
   */
  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Verify the page title matches expected
   */
  async verifyPageTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(this.pageTitle);
  }

  /**
   * Wait for an element to be visible
   */
  async waitForElement(locator: Locator, timeout = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Check if an element is visible
   */
  async isElementVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  /**
   * Get text content from an element
   */
  async getElementText(locator: Locator): Promise<string> {
    return (await locator.textContent()) ?? '';
  }

  /**
   * Click an element with optional wait
   */
  async clickElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  /**
   * Scroll to an element
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Take a screenshot of the current page
   */
  async takeScreenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({
      path: `test-results/screenshots/${name}.png`,
      fullPage: true,
    });
  }

  /**
   * Get an attribute value from an element
   */
  async getAttribute(locator: Locator, attribute: string): Promise<string | null> {
    return locator.getAttribute(attribute);
  }

  /**
   * Verify element has specific text
   */
  async verifyElementText(locator: Locator, expectedText: string | RegExp): Promise<void> {
    await expect(locator).toHaveText(expectedText);
  }

  /**
   * Verify element is visible
   */
  async verifyElementVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  /**
   * Verify element has specific attribute value
   */
  async verifyElementAttribute(
    locator: Locator,
    attribute: string,
    value: string | RegExp
  ): Promise<void> {
    await expect(locator).toHaveAttribute(attribute, value);
  }

  /**
   * Get count of elements matching locator
   */
  async getElementCount(locator: Locator): Promise<number> {
    return locator.count();
  }

  /**
   * Hover over an element
   */
  async hoverElement(locator: Locator): Promise<void> {
    await locator.hover();
  }

  /**
   * Press a keyboard key
   */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}
