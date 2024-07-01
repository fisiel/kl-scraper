import { Browser, chromium } from 'playwright';
import { KLScraperOptionsProvider } from './kl-scraper-options/kl-scraper-options.provider';
import { KLScraperOptions } from './kl-scraper-options/types/interface/kl-scraper-options.interface';
import { LoggerProvider } from './logger/logger.provider';
import { Logger } from './logger/types/interface/logger.interface';
import { PageProvider } from './page/page.provider';
import { RecipePageScraper } from './recipe-page/recipe-page.scraper';
import { RecpiesListPageScraper } from './recipes-list-page/recipes-list-page.scraper';
import { RecipesPaginated } from './types/type/recipes-paginated.type';

export class KLScraper {
  private logger: Logger = null as unknown as Logger;

  private browser: Browser = null as unknown as Browser;

  private recipePageScraper: RecipePageScraper = null as unknown as RecipePageScraper;
  private recipesListPageScraper: RecpiesListPageScraper =
    null as unknown as RecpiesListPageScraper;

  public async init(klScraperOptions?: KLScraperOptions): Promise<KLScraper> {
    const {
      browser: { headless, requestTimeout, delayBetweenRequests },
      log: { level, dir },
    } = new KLScraperOptionsProvider().provide(klScraperOptions);

    const loggerProvider = new LoggerProvider(level, dir);

    this.logger = loggerProvider.provide(KLScraper.name);

    this.logger.info('Initializing scraper');

    this.browser = await chromium.launch({ headless });

    const browserContext = await this.browser.newContext();

    const pageProvider = new PageProvider(
      browserContext,
      requestTimeout,
      loggerProvider,
      delayBetweenRequests,
    );

    this.recipePageScraper = new RecipePageScraper(pageProvider, loggerProvider);
    this.recipesListPageScraper = new RecpiesListPageScraper(pageProvider, loggerProvider);

    return this;
  }

  public async scrapPaginated(cursor?: number, limit?: number): Promise<RecipesPaginated> {
    this.logger.info(`Starting scraping with cursor: ${cursor} and limit: ${limit}`);

    const { recipesPaths, nextCursor, total } =
      await this.recipesListPageScraper.scrapPaginatedRecipesPaths(cursor, limit);

    this.logger.debug(`Scraped recipes paths:\n${JSON.stringify(recipesPaths, null, 2)}`);
    this.logger.debug(`Scraped next cursor: ${nextCursor}`);

    const recipes = await this.recipePageScraper.scrapMany(recipesPaths);

    const recipesPaginated = {
      recipes,
      nextCursor,
      total,
    };

    this.logger.debug(`Scraped recipes paginated:\n${JSON.stringify(recipesPaginated, null, 2)}`);

    return recipesPaginated;
  }

  public async close(): Promise<void> {
    this.logger.info('Closing scraper');

    await this.browser.close();
  }
}
