import { Logger, LoggerProvider } from '../logger/logger.module';
import { PageProvider } from '../page/page.module';
import {
  RecipesListPageElementParser,
  RecipesListPageElementResolver,
} from './recipes-list-page-element/recipes-list-page-element.module';
import { RecipesListPageUrlResolver } from './recipes-list-page-url/recipes-list-page-url.module';
import { RecipesListPage } from './types/interface/recipes-list-page.interface';

export class RecpiesListPageScraper {
  private readonly logger: Logger;

  private readonly recipesListPageUrlResolver: RecipesListPageUrlResolver;
  private readonly recipesListPageElementParser: RecipesListPageElementParser;
  private readonly recipesListPageElementResolver: RecipesListPageElementResolver;

  constructor(
    private readonly pageProvider: PageProvider,
    loggerProvider: LoggerProvider,
  ) {
    this.logger = loggerProvider.provide(RecpiesListPageScraper.name);

    this.recipesListPageUrlResolver = new RecipesListPageUrlResolver(loggerProvider);

    this.recipesListPageElementResolver = new RecipesListPageElementResolver(loggerProvider);

    this.recipesListPageElementParser = new RecipesListPageElementParser(
      this.recipesListPageElementResolver,
      loggerProvider,
    );
  }

  public async scrap(pageNumber?: number): Promise<RecipesListPage> {
    this.logger.info(
      pageNumber
        ? `Scraping recipes paths from page number: ${pageNumber}`
        : 'Scraping recipes paths from main recipes list page',
    );

    const url = this.recipesListPageUrlResolver.resolve(pageNumber);

    const page = await this.pageProvider.provide(url);

    const numberOfAllRecipes =
      await this.recipesListPageElementParser.parseNumberOfAllRecipes(page);
    const numberOfRecipes = await this.recipesListPageElementParser.parseNumberOfRecipes(page);

    const recipeListPage = {
      recipesPaths: await this.recipesListPageElementParser.parseRecipesPaths(
        page,
        numberOfRecipes,
      ),
      numberOfAllRecipes,
      numberOfAllPages: this.recipesListPageElementResolver.resolveNumberOfAllPages(
        numberOfAllRecipes,
        numberOfRecipes,
      ),
    };

    await page.close();

    return recipeListPage;
  }
}
