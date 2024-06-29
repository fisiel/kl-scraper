import { BrowserContext, Page } from 'playwright';
import { Logger, LoggerProvider } from '../logger/logger.module';
import { PageDelayResolver } from './page-delay/page-delay.module';
import { PageElementSelector } from './types/enum/page-element-selector.enum';

export class PageProvider {
  private readonly logger: Logger;

  private readonly pageDelayResolver: PageDelayResolver;

  constructor(
    private readonly browserContext: BrowserContext,
    private readonly requestTimeout: number,
    loggerProvider: LoggerProvider,
    delayBetweenRequests: [number, number],
  ) {
    this.logger = loggerProvider.provide(PageProvider.name);

    this.pageDelayResolver = new PageDelayResolver(delayBetweenRequests);
  }

  public async provide(url: string): Promise<Page> {
    this.logger.debug(`Opening new tab with page: ${url}`);

    const page = await this.browserContext.newPage();

    page.once('domcontentloaded', async () => {
      await this.assertCookiesAreRejected(page);
    });

    await page.goto(url, {
      timeout: this.requestTimeout,
      waitUntil: 'load',
    });

    await page.waitForTimeout(this.pageDelayResolver.resolve());

    return page;
  }

  private async assertCookiesAreRejected(page: Page): Promise<void> {
    if (await page.isVisible(PageElementSelector.REJECT_COOKIES_BUTTON)) {
      this.logger.debug('Clicking reject cookies button');

      await page.locator(PageElementSelector.REJECT_COOKIES_BUTTON).click();

      this.logger.debug('Reject cookies button clicked');
    }
  }
}
