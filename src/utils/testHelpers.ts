import { Page, Locator, expect } from '@playwright/test';

/**
 * Test Helper Utilities
 *
 * Demonstrates: Utility functions for common testing operations
 * Provides reusable helpers for assertions and validations.
 */

/**
 * Wait for a specific amount of time (use sparingly)
 */
export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function until it succeeds or timeout
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: { maxAttempts?: number; delay?: number } = {}
): Promise<T> {
  const { maxAttempts = 3, delay = 1000 } = options;
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await wait(delay);
      }
    }
  }

  throw lastError;
}

/**
 * Check if URL matches expected pattern
 */
export function urlMatches(url: string, pattern: string | RegExp): boolean {
  if (typeof pattern === 'string') {
    return url.includes(pattern);
  }
  return pattern.test(url);
}

/**
 * Generate random string for test data
 */
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Get current timestamp in ISO format
 */
export function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Verify all links on page are valid (not 404)
 */
export async function verifyLinksNotBroken(page: Page): Promise<string[]> {
  const brokenLinks: string[] = [];
  const links = page.locator('a[href]');
  const count = await links.count();

  for (let i = 0; i < count; i++) {
    const href = await links.nth(i).getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
      try {
        const absoluteUrl = new URL(href, page.url()).toString();
        const response = await page.request.head(absoluteUrl);
        if (response.status() >= 400) {
          brokenLinks.push(`${href} (${response.status()})`);
        }
      } catch {
        // Skip invalid URLs
      }
    }
  }

  return brokenLinks;
}

/**
 * Scroll through entire page
 */
export async function scrollFullPage(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

/**
 * Get all text content from page
 */
export async function getAllPageText(page: Page): Promise<string> {
  return page.evaluate(() => document.body.innerText);
}

/**
 * Check if element is in viewport
 */
export async function isElementInViewport(locator: Locator): Promise<boolean> {
  return locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  });
}

/**
 * Take screenshot with timestamp
 */
export async function takeTimestampedScreenshot(page: Page, name: string): Promise<string> {
  const timestamp = Date.now();
  const filename = `${name}-${timestamp}.png`;
  await page.screenshot({ path: `test-results/screenshots/${filename}`, fullPage: true });
  return filename;
}
