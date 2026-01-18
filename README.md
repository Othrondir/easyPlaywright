# Playwright POM Test Automation Framework

[![Node.js](https://img.shields.io/badge/Node.js-20.11.0-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.40.1-45ba4b.svg)](https://playwright.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A professional-grade test automation framework demonstrating **Page Object Model (POM)** architecture with **Playwright** and **TypeScript**. This repository showcases industry best practices in test automation, designed as a portfolio piece for QA Engineers.

## Requirements

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20.11.0 | JavaScript runtime |
| npm | 10.2.4 | Package manager |
| Playwright | 1.40.1 | Test automation framework |
| TypeScript | 5.3.3 | Type-safe JavaScript |

> All versions are pinned to ensure reproducible builds across environments.

## Key Features

- **Page Object Model (POM)** - Clean separation of test logic and page interactions
- **Component-Based Architecture** - Reusable UI components for maintainable tests
- **Custom Fixtures** - Dependency injection for page objects
- **TypeScript** - Full type safety and IntelliSense support
- **Multi-Browser Testing** - Chrome, Firefox, Safari, and mobile emulation
- **Visual Regression Testing** - Screenshot comparison for UI consistency
- **Accessibility Testing** - WCAG compliance validation
- **CI/CD Integration** - GitHub Actions with parallel execution and sharding
- **Comprehensive Reporting** - HTML reports with traces and screenshots

## Project Structure

```
playwright-pom-showcase/
├── src/
│   ├── pages/                    # Page Object classes
│   │   ├── BasePage.ts           # Abstract base class
│   │   ├── HomePage.ts           # Homepage page object
│   │   ├── AboutPage.ts          # About page object
│   │   ├── PostPage.ts           # Blog post page object
│   │   ├── components/           # Reusable UI components
│   │   │   ├── NavigationComponent.ts
│   │   │   ├── ProfileComponent.ts
│   │   │   ├── BlogPostComponent.ts
│   │   │   └── FooterComponent.ts
│   │   └── index.ts
│   ├── tests/                    # Test suites
│   │   ├── smoke.spec.ts         # Critical path tests
│   │   ├── navigation.spec.ts    # Navigation tests
│   │   ├── homepage.spec.ts      # Homepage functionality
│   │   ├── accessibility.spec.ts # A11y compliance
│   │   ├── visual.spec.ts        # Visual regression
│   │   ├── responsive.spec.ts    # Mobile/tablet tests
│   │   └── e2e.spec.ts           # End-to-end journeys
│   ├── fixtures/                 # Custom Playwright fixtures
│   │   └── pageFixtures.ts
│   ├── utils/                    # Helper utilities
│   │   ├── testHelpers.ts
│   │   └── accessibilityHelpers.ts
│   └── data/                     # Test data
│       └── testData.ts
├── .github/
│   └── workflows/                # CI/CD pipelines
│       ├── playwright.yml
│       └── visual-regression.yml
├── playwright.config.ts          # Playwright configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json
└── README.md
```

## Architecture Highlights

### Page Object Model

The framework implements a robust POM architecture with inheritance and composition:

```typescript
// BasePage provides common functionality
export abstract class BasePage {
  protected readonly page: Page;
  protected abstract readonly pageUrl: string;

  async navigate(): Promise<void> {
    await this.page.goto(this.pageUrl);
    await this.waitForPageLoad();
  }

  async verifyPageTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(this.pageTitle);
  }
}

// HomePage composes multiple components
export class HomePage extends BasePage {
  public readonly navigation: NavigationComponent;
  public readonly profile: ProfileComponent;
  public readonly blogPosts: BlogPostComponent;
  public readonly footer: FooterComponent;

  constructor(page: Page) {
    super(page);
    this.navigation = new NavigationComponent(page);
    this.profile = new ProfileComponent(page);
    // ...
  }
}
```

### Custom Fixtures

Page objects are injected via Playwright fixtures for clean test syntax:

```typescript
// Fixture definition
export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
});

// Clean test usage
test('should display author information', async ({ homePage }) => {
  await homePage.navigate();
  const authorName = await homePage.profile.getAuthorName();
  expect(authorName).toContain('Alejandro');
});
```

### Test Categorization

Tests are tagged for selective execution:

| Tag | Purpose | Command |
|-----|---------|---------|
| `@smoke` | Critical path validation | `npm run test:smoke` |
| `@regression` | Full regression suite | `npm run test:regression` |
| `@accessibility` | WCAG compliance | `npm run test:accessibility` |
| `@visual` | Screenshot comparison | `npm run test:visual` |
| `@mobile` | Mobile viewport tests | `npm run test:mobile` |
| `@e2e` | End-to-end journeys | `npm test -- --grep @e2e` |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/playwright-pom-showcase.git
cd playwright-pom-showcase

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests

```bash
# Run all tests
npm test

# Run with UI mode (interactive)
npm run test:ui

# Run in headed mode (see browser)
npm run test:headed

# Run smoke tests only
npm run test:smoke

# Run on specific browser
npm run test:chrome
npm run test:firefox
npm run test:safari

# Run mobile tests
npm run test:mobile

# Debug mode
npm run test:debug
```

### Viewing Reports

```bash
# Open HTML report
npm run report
```

## Test Suites

### Smoke Tests (`smoke.spec.ts`)
Quick validation of critical functionality:
- Page loading verification
- Navigation functionality
- Profile section display
- Blog posts visibility
- Footer presence

### Navigation Tests (`navigation.spec.ts`)
Comprehensive navigation testing:
- Main menu navigation
- Link attributes validation
- External links (GitHub, LinkedIn)
- Post navigation

### Homepage Tests (`homepage.spec.ts`)
Full homepage functionality:
- Page structure verification
- Profile section (author, avatar, social links)
- Blog posts section
- Responsive behavior
- Performance indicators

### Accessibility Tests (`accessibility.spec.ts`)
WCAG 2.1 compliance validation:
- Page language attribute
- Image alt text
- Link accessibility
- Heading hierarchy
- Keyboard navigation
- Focus management
- ARIA attributes

### Visual Tests (`visual.spec.ts`)
Visual regression testing:
- Desktop/tablet/mobile baselines
- Component screenshots
- Hover and focus states

### Responsive Tests (`responsive.spec.ts`)
Multi-viewport testing:
- Mobile viewport (375x667)
- Tablet viewport (768x1024)
- Desktop viewport (1280x720)
- Large desktop (1920x1080)
- Orientation changes

### E2E Tests (`e2e.spec.ts`)
Complete user journeys:
- Blog browsing flow
- Author profile exploration
- Post reading experience
- Mobile user journey
- Error recovery scenarios

## CI/CD Pipeline

The GitHub Actions workflow provides:

- **Parallel Execution**: 4-way sharding for faster runs
- **Multi-Browser Testing**: Chrome, Firefox, Safari
- **Specialized Jobs**:
  - Smoke tests per browser
  - Accessibility tests
  - Mobile tests
  - Visual regression
- **Artifact Management**: Reports retained for 30 days
- **Scheduled Runs**: Daily execution at 6:00 AM UTC

## Configuration

### Playwright Config (`playwright.config.ts`)

```typescript
export default defineConfig({
  testDir: './src/tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['html'],
    ['list'],
    ['allure-playwright'],
  ],
  use: {
    baseURL: 'https://othrondir.github.io/QAbbalah/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
});
```

## Best Practices Demonstrated

### Code Quality
- TypeScript strict mode
- ESLint + Prettier configuration
- Meaningful naming conventions
- Comprehensive JSDoc comments

### Test Design
- Single responsibility principle
- DRY (Don't Repeat Yourself)
- Arrange-Act-Assert pattern
- Descriptive test names
- Independent test cases

### Maintainability
- Centralized selectors in page objects
- Test data separation
- Reusable utility functions
- Component-based architecture

### Reliability
- Explicit waits over implicit
- Retry mechanisms for flaky scenarios
- Proper error handling
- Meaningful assertions

## Extending the Framework

### Adding a New Page Object

```typescript
// src/pages/NewPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class NewPage extends BasePage {
  protected readonly pageUrl = '/new-page/';
  protected readonly pageTitle = /New Page/;

  private readonly specificElement: Locator;

  constructor(page: Page) {
    super(page);
    this.specificElement = page.locator('.specific-element');
  }

  async performAction(): Promise<void> {
    await this.specificElement.click();
  }
}
```

### Adding a New Test Suite

```typescript
// src/tests/newFeature.spec.ts
import { test, expect } from '../fixtures';

test.describe('New Feature Tests @regression', () => {
  test('should validate new feature', async ({ homePage }) => {
    await homePage.navigate();
    // Test implementation
  });
});
```

## Technologies Used

| Technology | Purpose |
|------------|---------|
| [Playwright](https://playwright.dev/) | Test automation framework |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Node.js](https://nodejs.org/) | Runtime environment |
| [ESLint](https://eslint.org/) | Code linting |
| [Prettier](https://prettier.io/) | Code formatting |
| [GitHub Actions](https://github.com/features/actions) | CI/CD pipeline |
| [Allure](https://allurereport.org/) | Test reporting |

## Author

**QA Engineer Portfolio Project**

This project demonstrates professional test automation skills including:
- Test framework architecture design
- Page Object Model implementation
- CI/CD pipeline configuration
- Multi-browser and responsive testing
- Accessibility compliance testing
- Visual regression testing

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Target Application**: [QAbbalah Blog](https://othrondir.github.io/QAbbalah/)

Built with Playwright and TypeScript
