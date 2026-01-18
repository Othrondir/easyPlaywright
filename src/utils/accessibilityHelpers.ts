import { Page, Locator, expect } from '@playwright/test';

/**
 * Accessibility Testing Helpers
 *
 * Demonstrates: WCAG compliance testing utilities
 * Provides helpers for common accessibility validations.
 */

/**
 * Accessibility violation result
 */
export interface A11yViolation {
  element: string;
  issue: string;
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
}

/**
 * Check images have alt text
 */
export async function checkImagesHaveAlt(page: Page): Promise<A11yViolation[]> {
  const violations: A11yViolation[] = [];
  const images = page.locator('img');
  const count = await images.count();

  for (let i = 0; i < count; i++) {
    const img = images.nth(i);
    const alt = await img.getAttribute('alt');
    const src = await img.getAttribute('src');

    if (alt === null || alt === undefined) {
      violations.push({
        element: `img[src="${src}"]`,
        issue: 'Image missing alt attribute',
        severity: 'critical',
      });
    } else if (alt.trim() === '') {
      // Empty alt is valid for decorative images, log as minor
      violations.push({
        element: `img[src="${src}"]`,
        issue: 'Image has empty alt (verify if decorative)',
        severity: 'minor',
      });
    }
  }

  return violations;
}

/**
 * Check links have accessible names
 */
export async function checkLinksAccessible(page: Page): Promise<A11yViolation[]> {
  const violations: A11yViolation[] = [];
  const links = page.locator('a');
  const count = await links.count();

  for (let i = 0; i < count; i++) {
    const link = links.nth(i);
    const text = await link.textContent();
    const ariaLabel = await link.getAttribute('aria-label');
    const href = await link.getAttribute('href');

    if (!text?.trim() && !ariaLabel) {
      violations.push({
        element: `a[href="${href}"]`,
        issue: 'Link has no accessible name',
        severity: 'critical',
      });
    }
  }

  return violations;
}

/**
 * Check heading hierarchy
 */
export async function checkHeadingHierarchy(page: Page): Promise<A11yViolation[]> {
  const violations: A11yViolation[] = [];
  const headings = await page.evaluate(() => {
    const result: { level: number; text: string }[] = [];
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
      result.push({
        level: parseInt(h.tagName.charAt(1)),
        text: h.textContent?.trim() || '',
      });
    });
    return result;
  });

  let lastLevel = 0;
  for (const heading of headings) {
    if (heading.level > lastLevel + 1 && lastLevel !== 0) {
      violations.push({
        element: `h${heading.level}`,
        issue: `Heading level skipped from h${lastLevel} to h${heading.level}`,
        severity: 'moderate',
      });
    }
    lastLevel = heading.level;
  }

  // Check for multiple h1s
  const h1Count = headings.filter((h) => h.level === 1).length;
  if (h1Count > 1) {
    violations.push({
      element: 'h1',
      issue: `Multiple h1 elements found (${h1Count})`,
      severity: 'moderate',
    });
  }

  if (h1Count === 0) {
    violations.push({
      element: 'h1',
      issue: 'No h1 element found on page',
      severity: 'serious',
    });
  }

  return violations;
}

/**
 * Check color contrast (basic check for text visibility)
 */
export async function checkFocusVisible(page: Page): Promise<A11yViolation[]> {
  const violations: A11yViolation[] = [];

  // Check if interactive elements have focus styles
  const interactiveElements = page.locator('a, button, input, select, textarea, [tabindex]');
  const count = await interactiveElements.count();

  for (let i = 0; i < Math.min(count, 10); i++) {
    const element = interactiveElements.nth(i);
    await element.focus();

    const hasVisibleFocus = await element.evaluate((el) => {
      const style = window.getComputedStyle(el);
      const outlineStyle = style.getPropertyValue('outline-style');
      const outlineWidth = style.getPropertyValue('outline-width');
      const boxShadow = style.getPropertyValue('box-shadow');

      return (
        (outlineStyle !== 'none' && outlineWidth !== '0px') ||
        boxShadow !== 'none'
      );
    });

    if (!hasVisibleFocus) {
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase());
      violations.push({
        element: tagName,
        issue: 'Element may not have visible focus indicator',
        severity: 'serious',
      });
    }
  }

  return violations;
}

/**
 * Check page language is set
 */
export async function checkPageLanguage(page: Page): Promise<A11yViolation[]> {
  const violations: A11yViolation[] = [];

  const lang = await page.evaluate(() => document.documentElement.lang);

  if (!lang) {
    violations.push({
      element: 'html',
      issue: 'Page language not specified',
      severity: 'serious',
    });
  }

  return violations;
}

/**
 * Run all accessibility checks
 */
export async function runAccessibilityChecks(page: Page): Promise<A11yViolation[]> {
  const allViolations: A11yViolation[] = [];

  allViolations.push(...(await checkImagesHaveAlt(page)));
  allViolations.push(...(await checkLinksAccessible(page)));
  allViolations.push(...(await checkHeadingHierarchy(page)));
  allViolations.push(...(await checkPageLanguage(page)));

  return allViolations;
}

/**
 * Assert no critical accessibility violations
 */
export async function assertNoCriticalViolations(page: Page): Promise<void> {
  const violations = await runAccessibilityChecks(page);
  const criticalViolations = violations.filter((v) => v.severity === 'critical');

  if (criticalViolations.length > 0) {
    const messages = criticalViolations
      .map((v) => `${v.element}: ${v.issue}`)
      .join('\n');
    throw new Error(`Critical accessibility violations found:\n${messages}`);
  }
}
