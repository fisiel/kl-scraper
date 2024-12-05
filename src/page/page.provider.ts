import { BrowserContext, Page } from 'playwright';
import { LoggerProvider } from '../logger/logger.provider';
import { Logger } from '../logger/types/interface/logger.interface';
import { DEFAULT_REQUEST_TIMEOUT } from './constant';
import { PageDelayResolver } from './page-delay/page-delay.resolver';
import { DelayBetweenRequests } from './page-delay/types/type/delay-between-requests.type';
import { PageElementSelector } from './types/enum/page-element-selector.enum';
import { PageEvent } from './types/enum/page-event.enum';

export class PageProvider {
  private readonly logger: Logger;

  private readonly pageDelayResolver: PageDelayResolver;

  constructor(
    private readonly browserContext: BrowserContext,
    private readonly requestTimeout: number = DEFAULT_REQUEST_TIMEOUT,
    loggerProvider: LoggerProvider,
    delayBetweenRequests?: DelayBetweenRequests,
  ) {
    this.logger = loggerProvider.provide(PageProvider.name);

    this.pageDelayResolver = new PageDelayResolver(loggerProvider, delayBetweenRequests);
  }

  public async provide(url: string): Promise<Page> {
    this.logger.debug(`Opening new tab with page: ${url}`);

    const page = await this.browserContext.newPage();

    page.once(PageEvent.DOMCONTENTLOADED, async () => {
      await this.assertCookiesAreRejected(page);
    });

    await page.goto(url, {
      timeout: this.requestTimeout,
      waitUntil: PageEvent.LOAD,
    });

    await page.waitForTimeout(this.pageDelayResolver.resolve());

    return page;
  }

  private async assertCookiesAreRejected(page: Page): Promise<void> {
    if (await page.isVisible(PageElementSelector.REJECT_COOKIES_BUTTON)) {
      this.logger.silly('Clicking reject cookies button');

      await page.locator(PageElementSelector.REJECT_COOKIES_BUTTON).click();
    }
  }
}
