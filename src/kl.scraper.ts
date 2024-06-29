import { Browser, chromium } from 'playwright';
import {
  KLScraperOptionsInput,
  KLScraperOptionsProvider,
} from './kl-scraper-options/kl-scraper-options.module';
import { Logger, LoggerProvider } from './logger/logger.module';
import { PageProvider } from './page/page.module';
import { RecipePage, RecipePageScraper } from './recipe-page/recipe-page.module';
import { RecpiesListPageScraper } from './recipes-list-page/recipes-list-page.module';

export class KLScraper {
  private logger: Logger = null as unknown as Logger;

  private browser = null as unknown as Browser;

  private recipePageScraper = null as unknown as RecipePageScraper;
  private recipesListPageScraper = null as unknown as RecpiesListPageScraper;

  public async init(klScraperOptions?: KLScraperOptionsInput): Promise<KLScraper> {
    const {
      browser: { requestTimeout, headless, delayBetweenRequests },
      log: { level },
    } = new KLScraperOptionsProvider().provide(klScraperOptions);

    const loggerProvider = new LoggerProvider(level);

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

    this.logger.info('Scraper initialized');

    return this;
  }

  public async scrap(): Promise<void> {
    this.logger.info('Starting scraping');

    const { numberOfAllPages } = await this.recipesListPageScraper.scrap();

    const recipes: RecipePage[] = [];
    for (let pageNumber = numberOfAllPages; pageNumber > 0; pageNumber--) {
      const { recipesPaths } = await this.recipesListPageScraper.scrap(pageNumber);

      for (let i = recipesPaths.length - 1; i >= 0; i--) {
        recipes.push(await this.recipePageScraper.scrap(recipesPaths[i]));
      }
    }

    this.logger.info('Scraping finished');
  }

  public async close(): Promise<void> {
    this.logger.info('Closing browser');

    await this.browser.close();

    this.logger.info('Browser closed');
  }
}
