/**
 * Test Data Constants
 *
 * Demonstrates: Centralized test data management
 * Keeps test data separate from test logic for maintainability.
 */

/**
 * Expected site metadata
 */
export const SiteMetadata = {
  title: 'QAbbalah',
  author: 'Alejandro O. Jiménez',
  tagline: 'QA Engineer, Issue exorcist. I like frogs',
  location: 'Spain',
  baseUrl: 'https://othrondir.github.io/QAbbalah/',
} as const;

/**
 * Navigation link data
 */
export const NavigationLinks = {
  home: {
    text: 'Home',
    href: '/QAbbalah/',
  },
  posts: {
    text: 'Posts',
    href: '/posts/',
  },
  categories: {
    text: 'Categories',
    href: '/categories/',
  },
  tags: {
    text: 'Tags',
    href: '/tags/',
  },
  about: {
    text: 'About',
    href: '/about/',
  },
} as const;

/**
 * Social links data
 */
export const SocialLinks = {
  github: {
    name: 'GitHub',
    urlPattern: /github\.com/,
  },
  linkedin: {
    name: 'LinkedIn',
    urlPattern: /linkedin\.com/,
  },
} as const;

/**
 * Expected blog posts (for validation)
 */
export const ExpectedPosts = [
  {
    titleContains: 'k6',
    datePattern: /2023/,
  },
  {
    titleContains: 'Github',
    datePattern: /2023/,
  },
  {
    titleContains: 'ISTQB',
    datePattern: /2023/,
  },
] as const;

/**
 * Viewport configurations for responsive testing
 */
export const Viewports = {
  mobile: {
    width: 375,
    height: 667,
    name: 'iPhone SE',
  },
  tablet: {
    width: 768,
    height: 1024,
    name: 'iPad',
  },
  desktop: {
    width: 1280,
    height: 720,
    name: 'Desktop',
  },
  largeDesktop: {
    width: 1920,
    height: 1080,
    name: 'Full HD',
  },
} as const;

/**
 * Test timeouts
 */
export const Timeouts = {
  short: 5000,
  medium: 10000,
  long: 30000,
  veryLong: 60000,
} as const;

/**
 * Test tags for categorization
 */
export const TestTags = {
  smoke: '@smoke',
  regression: '@regression',
  accessibility: '@accessibility',
  visual: '@visual',
  performance: '@performance',
  mobile: '@mobile',
  critical: '@critical',
} as const;
