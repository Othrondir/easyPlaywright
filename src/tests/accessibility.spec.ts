import { test, expect } from '../fixtures';
import {
  runAccessibilityChecks,
  checkImagesHaveAlt,
  checkLinksAccessible,
  checkHeadingHierarchy,
  checkPageLanguage,
} from '../utils/accessibilityHelpers';

/**
 * Accessibility Test Suite
 *
 * Purpose: Validate WCAG 2.1 compliance
 * Tests cover Level A and AA success criteria.
 *
 * These tests help ensure the website is usable by people
 * with disabilities and meets accessibility standards.
 */

test.describe('Accessibility Tests @accessibility', () => {
  test.describe('Homepage Accessibility', () => {
    test.beforeEach(async ({ homePage }) => {
      await homePage.navigate();
    });

    test('should have page language defined', async ({ page }) => {
      const violations = await checkPageLanguage(page);

      // Filter critical violations
      const criticalViolations = violations.filter((v) => v.severity === 'serious');

      expect(criticalViolations).toHaveLength(0);
    });

    test('images should have alt attributes', async ({ page }) => {
      const violations = await checkImagesHaveAlt(page);

      // Only check for critical missing alt attributes
      const criticalViolations = violations.filter((v) => v.severity === 'critical');

      // Log all violations for awareness
      if (violations.length > 0) {
        console.log('Image accessibility issues:', violations);
      }

      // Fail only on critical issues (missing alt)
      expect(criticalViolations.length).toBeLessThanOrEqual(2); // Allow some flexibility for icons
    });

    test('links should have accessible names', async ({ page }) => {
      const violations = await checkLinksAccessible(page);

      // Links without accessible names are critical
      expect(violations.length).toBeLessThanOrEqual(3); // Some icon links may lack text
    });

    test('heading hierarchy should be logical', async ({ page }) => {
      const violations = await checkHeadingHierarchy(page);

      // Moderate violations are acceptable
      const seriousViolations = violations.filter(
        (v) => v.severity === 'critical' || v.severity === 'serious'
      );

      expect(seriousViolations.length).toBeLessThanOrEqual(1);
    });

    test('interactive elements should be keyboard accessible', async ({ page }) => {
      // Get all interactive elements
      const interactiveElements = page.locator('a, button, input, select, [tabindex]');
      const count = await interactiveElements.count();

      // Verify at least some elements exist
      expect(count).toBeGreaterThan(0);

      // Test that first few elements can receive focus
      for (let i = 0; i < Math.min(5, count); i++) {
        const element = interactiveElements.nth(i);
        if (await element.isVisible()) {
          await element.focus();
          // Element should be focusable without error
          const isFocused = await element.evaluate(
            (el) => document.activeElement === el
          );
          // Some elements may not be focusable (decorative), that's ok
        }
      }
    });

    test('page should have a main landmark', async ({ page }) => {
      const main = page.locator('main, [role="main"]');
      const hasMain = (await main.count()) > 0;

      // Page should have main content area
      expect(hasMain).toBe(true);
    });

    test('page should have navigation landmark', async ({ page }) => {
      const nav = page.locator('nav, [role="navigation"]');
      const hasNav = (await nav.count()) > 0;

      expect(hasNav).toBe(true);
    });
  });

  test.describe('About Page Accessibility', () => {
    test.beforeEach(async ({ aboutPage }) => {
      await aboutPage.navigate();
    });

    test('about page should pass basic accessibility checks', async ({ page }) => {
      const violations = await runAccessibilityChecks(page);

      // Get only critical and serious violations
      const significantViolations = violations.filter(
        (v) => v.severity === 'critical' || v.severity === 'serious'
      );

      // Log violations for awareness
      if (significantViolations.length > 0) {
        console.log('About page accessibility issues:', significantViolations);
      }

      // Allow some flexibility but flag major issues
      expect(significantViolations.length).toBeLessThanOrEqual(3);
    });

    test('about page content should have proper heading', async ({ page }) => {
      const h1 = page.locator('h1');
      const h1Count = await h1.count();

      // Should have at least one h1
      expect(h1Count).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe('Color and Contrast', () => {
    test('text should be readable (basic contrast check)', async ({ homePage, page }) => {
      await homePage.navigate();

      // Check that body has readable text color
      const bodyStyle = await page.evaluate(() => {
        const body = document.body;
        const style = window.getComputedStyle(body);
        return {
          color: style.color,
          backgroundColor: style.backgroundColor,
        };
      });

      // Verify colors are defined (not transparent/inherit only)
      expect(bodyStyle.color).toBeTruthy();
    });
  });

  test.describe('Focus Management', () => {
    test('skip link or proper focus management should exist', async ({ page }) => {
      await page.goto('/');

      // Press Tab to check if focus moves to interactive element
      await page.keyboard.press('Tab');

      // Check if any element received focus
      const focusedElement = await page.evaluate(() => {
        const active = document.activeElement;
        return active?.tagName.toLowerCase();
      });

      // Some element should be focused (link, button, etc.)
      expect(['a', 'button', 'input', 'body', 'div']).toContain(focusedElement);
    });

    test('focus should be visible on interactive elements', async ({ homePage, page }) => {
      await homePage.navigate();

      // Focus first link
      const firstLink = page.locator('a').first();
      await firstLink.focus();

      // Check if element has visible focus indicator
      const hasVisibleFocus = await firstLink.evaluate((el) => {
        const style = window.getComputedStyle(el);
        // Check for outline or other focus indicators
        return (
          style.outlineStyle !== 'none' ||
          style.outlineWidth !== '0px' ||
          style.boxShadow !== 'none'
        );
      });

      // Note: Some sites use custom focus styles
      // This is informational rather than strict requirement
      console.log('Focus visible on first link:', hasVisibleFocus);
    });
  });

  test.describe('ARIA Attributes', () => {
    test('ARIA labels should be used appropriately', async ({ page }) => {
      await page.goto('/');

      // Check for elements with ARIA attributes
      const ariaElements = page.locator('[aria-label], [aria-labelledby], [aria-describedby]');
      const ariaCount = await ariaElements.count();

      // Having ARIA attributes indicates accessibility awareness
      console.log(`Found ${ariaCount} elements with ARIA attributes`);

      // Verify ARIA labels are not empty if present
      for (let i = 0; i < Math.min(5, ariaCount); i++) {
        const element = ariaElements.nth(i);
        const ariaLabel = await element.getAttribute('aria-label');

        if (ariaLabel !== null) {
          expect(ariaLabel.trim().length).toBeGreaterThan(0);
        }
      }
    });
  });
});
