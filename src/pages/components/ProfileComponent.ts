import { Page, Locator } from '@playwright/test';

/**
 * ProfileComponent - Represents the sidebar profile section
 *
 * Demonstrates: Component isolation and reusability
 * Contains author information, avatar, and social links.
 */
export class ProfileComponent {
  private readonly page: Page;

  // Profile elements
  private readonly profileContainer: Locator;
  private readonly avatar: Locator;
  private readonly authorName: Locator;
  private readonly tagline: Locator;
  private readonly location: Locator;
  private readonly followButton: Locator;

  // Social links
  private readonly socialLinksContainer: Locator;
  private readonly githubLink: Locator;
  private readonly linkedinLink: Locator;
  private readonly websiteLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators (based on actual page structure - minimal-mistakes theme)
    this.profileContainer = page.locator('.sidebar, .author__avatar, [itemtype*="Person"]').first();
    this.avatar = page.locator('.author__avatar img, img[alt*="Alejandro"]').first();
    this.authorName = page.locator('.author__name, h3.author__name').first();
    this.tagline = page.locator('.author__bio, p[itemprop="description"]').first();
    this.location = page.locator('[itemprop="homeLocation"] span, span[itemprop="name"]:has-text("Spain")').first();
    this.followButton = page.locator('.author__urls-wrapper button, button.btn--inverse');

    // Social links
    this.socialLinksContainer = page.locator('.author__urls, ul.social-icons');
    this.githubLink = page.locator('a[href*="github.com/Othrondir"]').first();
    this.linkedinLink = page.locator('a[href*="linkedin.com"]').first();
    this.websiteLink = page.locator('.author__urls a').first();
  }

  /**
   * Check if profile section is visible
   */
  async isVisible(): Promise<boolean> {
    return this.profileContainer.isVisible();
  }

  /**
   * Get author name
   */
  async getAuthorName(): Promise<string> {
    const text = await this.authorName.textContent();
    return text?.trim() ?? '';
  }

  /**
   * Get tagline/bio
   */
  async getTagline(): Promise<string> {
    const text = await this.tagline.textContent();
    return text?.trim() ?? '';
  }

  /**
   * Check if avatar is displayed
   */
  async isAvatarDisplayed(): Promise<boolean> {
    return this.avatar.isVisible();
  }

  /**
   * Get avatar source URL
   */
  async getAvatarSrc(): Promise<string | null> {
    return this.avatar.getAttribute('src');
  }

  /**
   * Click on author name (navigates to home)
   */
  async clickAuthorName(): Promise<void> {
    await this.authorName.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click GitHub link
   */
  async clickGithubLink(): Promise<string | null> {
    const href = await this.githubLink.getAttribute('href');
    await this.githubLink.click();
    return href;
  }

  /**
   * Click LinkedIn link
   */
  async clickLinkedinLink(): Promise<string | null> {
    const href = await this.linkedinLink.getAttribute('href');
    await this.linkedinLink.click();
    return href;
  }

  /**
   * Get GitHub link URL
   */
  async getGithubUrl(): Promise<string | null> {
    return this.githubLink.getAttribute('href');
  }

  /**
   * Get LinkedIn link URL
   */
  async getLinkedinUrl(): Promise<string | null> {
    return this.linkedinLink.getAttribute('href');
  }

  /**
   * Get all social link URLs
   */
  async getAllSocialUrls(): Promise<string[]> {
    const links = this.socialLinksContainer.locator('a');
    const count = await links.count();
    const urls: string[] = [];

    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      if (href) {
        urls.push(href);
      }
    }

    return urls;
  }

  /**
   * Get avatar locator (for assertions)
   */
  getAvatarLocator(): Locator {
    return this.avatar;
  }

  /**
   * Get author name locator (for assertions)
   */
  getAuthorNameLocator(): Locator {
    return this.authorName;
  }

  /**
   * Get tagline locator (for assertions)
   */
  getTaglineLocator(): Locator {
    return this.tagline;
  }

  /**
   * Get GitHub link locator (for assertions)
   */
  getGithubLinkLocator(): Locator {
    return this.githubLink;
  }

  /**
   * Get LinkedIn link locator (for assertions)
   */
  getLinkedinLinkLocator(): Locator {
    return this.linkedinLink;
  }
}
