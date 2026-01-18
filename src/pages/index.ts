/**
 * Page Objects Barrel Export
 *
 * Centralizes all page object exports for clean imports.
 * Usage: import { HomePage, AboutPage } from '@pages';
 */

export { BasePage } from './BasePage';
export { HomePage } from './HomePage';
export { AboutPage } from './AboutPage';
export { PostPage } from './PostPage';

// Re-export components
export * from './components';
