import { Page, Locator } from '@playwright/test';

/**
 * NavigationComponent - Represents the main navigation bar
 *
 * Demonstrates: Component-based Page Object Pattern
 * Reusable component that can be composed into different pages.
 */
export class NavigationComponent {
  private readonly page: Page;

  // Navigation container
  private readonly navContainer: Locator;

  // Navigation links
  private readonly homeLink: Locator;
  private readonly postsLink: Locator;
  private readonly categoriesLink: Locator;
  private readonly tagsLink: Locator;
  private readonly aboutLink: Locator;

  // Mobile menu
  private readonly mobileMenuToggle: Locator;
  private readonly mobileMenu: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators (based on actual page structure - greedy-nav pattern)
    this.navContainer = page.locator('#site-nav');
    this.homeLink = page.locator('.visible-links a[href="/QAbbalah/"], .masthead__menu-item a:has-text("Home")').first();
    this.postsLink = page.locator('.visible-links a[href*="year-archive"], .masthead__menu-item a:has-text("Posts")').first();
    this.categoriesLink = page.locator('.visible-links a[href*="categories"], .masthead__menu-item a:has-text("Categories")').first();
    this.tagsLink = page.locator('.visible-links a[href*="tags"], .masthead__menu-item a:has-text("Tags")').first();
    this.aboutLink = page.locator('.visible-links a[href*="about"], .masthead__menu-item a:has-text("About")').first();
    this.mobileMenuToggle = page.locator('.greedy-nav__toggle, button.navicon');
    this.mobileMenu = page.locator('.hidden-links');
  }

  /**
   * Check if navigation is visible
   */
  async isVisible(): Promise<boolean> {
    return this.navContainer.isVisible();
  }

  /**
   * Navigate to Home page
   */
  async goToHome(): Promise<void> {
    // Try clicking the logo first (works on all viewports)
    const logo = this.page.locator('.site-logo, a.site-logo').first();
    if (await logo.isVisible()) {
      await logo.click();
    } else if (await this.mobileMenuToggle.isVisible()) {
      await this.mobileMenuToggle.click();
      await this.page.waitForTimeout(300);
      await this.homeLink.click();
    } else {
      await this.homeLink.click();
    }
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to Posts page
   */
  async goToPosts(): Promise<void> {
    await this.postsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to Categories page
   */
  async goToCategories(): Promise<void> {
    await this.categoriesLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to Tags page
   */
  async goToTags(): Promise<void> {
    await this.tagsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to About page
   */
  async goToAbout(): Promise<void> {
    // Handle mobile navigation - click menu toggle if visible
    if (await this.mobileMenuToggle.isVisible()) {
      await this.mobileMenuToggle.click();
      await this.page.waitForTimeout(300); // Wait for menu animation
    }
    await this.aboutLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get all navigation link texts
   */
  async getNavLinkTexts(): Promise<string[]> {
    const links = this.page.locator('#topbar-wrapper a, .nav-item a');
    const count = await links.count();
    const texts: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = await links.nth(i).textContent();
      if (text?.trim()) {
        texts.push(text.trim());
      }
    }

    return texts;
  }

  /**
   * Toggle mobile menu (for responsive testing)
   */
  async toggleMobileMenu(): Promise<void> {
    if (await this.mobileMenuToggle.isVisible()) {
      await this.mobileMenuToggle.click();
    }
  }

  /**
   * Check if mobile menu is expanded
   */
  async isMobileMenuExpanded(): Promise<boolean> {
    return this.mobileMenu.isVisible();
  }

  /**
   * Get home link locator (for assertions)
   */
  getHomeLinkLocator(): Locator {
    return this.homeLink;
  }

  /**
   * Get posts link locator (for assertions)
   */
  getPostsLinkLocator(): Locator {
    return this.postsLink;
  }

  /**
   * Get categories link locator (for assertions)
   */
  getCategoriesLinkLocator(): Locator {
    return this.categoriesLink;
  }

  /**
   * Get tags link locator (for assertions)
   */
  getTagsLinkLocator(): Locator {
    return this.tagsLink;
  }

  /**
   * Get about link locator (for assertions)
   */
  getAboutLinkLocator(): Locator {
    return this.aboutLink;
  }
}
