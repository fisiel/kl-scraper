import { LoggerProvider } from '../logger/logger.provider';
import { Logger } from '../logger/types/interface/logger.interface';
import { PageProvider } from '../page/page.provider';
import { DEFAULT_PAGINATION_CURSOR, DEFAULT_PAGINATION_LIMIT } from './constant';
import { RecipesListPageElementParser } from './recipes-list-page-element/recipes-list-page-element.parser';
import { RecipesListPagePaginatedNextCursorResolver } from './recipes-list-page-paginated/recipes-list-page-paginated-next-cursor/recipes-list-page-paginated-next-cursor.resolver';
import { RecipesListPagePaginatedRangeResolver } from './recipes-list-page-paginated/recipes-list-page-paginated-range/recipes-list-page-paginated-range.resolver';
import { RecipesListPagePaginatedRecipesPathsResolver } from './recipes-list-page-paginated/recipes-list-page-paginated-recipes-paths/recipes-list-page-paginated-recipes-paths.resolver';
import { RecipesListPaginated } from './recipes-list-page-paginated/types/type/recipes-list-paginated.type';
import { RecipesListPageUrlResolver } from './recipes-list-page-url/recipes-list-page-url.resolver';
import { RecipesListPage } from './types/interface/recipes-list-page.interface';

export class RecpiesListPageScraper {
  private readonly logger: Logger;

  private readonly recipesListPageUrlResolver: RecipesListPageUrlResolver;

  private readonly recipesListPageElementParser: RecipesListPageElementParser;

  private readonly recipesListPagePaginatedRangeResolver: RecipesListPagePaginatedRangeResolver;
  private readonly recipesListPagePaginatedNextCursorResolver: RecipesListPagePaginatedNextCursorResolver;
  private readonly recipesListPagePaginatedRecipesPathsResolver: RecipesListPagePaginatedRecipesPathsResolver;

  constructor(
    private readonly pageProvider: PageProvider,
    loggerProvider: LoggerProvider,
  ) {
    this.logger = loggerProvider.provide(RecpiesListPageScraper.name);

    this.recipesListPageUrlResolver = new RecipesListPageUrlResolver(loggerProvider);

    this.recipesListPageElementParser = new RecipesListPageElementParser(loggerProvider);

    this.recipesListPagePaginatedRangeResolver = new RecipesListPagePaginatedRangeResolver(
      loggerProvider,
    );
    this.recipesListPagePaginatedNextCursorResolver =
      new RecipesListPagePaginatedNextCursorResolver(loggerProvider);
    this.recipesListPagePaginatedRecipesPathsResolver =
      new RecipesListPagePaginatedRecipesPathsResolver(
        loggerProvider,
        this.recipesListPagePaginatedRangeResolver,
      );
  }

  public async scrapOne(pageNumber?: number): Promise<RecipesListPage> {
    this.logger.info(`Scraping recipes list page with page number: ${pageNumber}`);

    const url = this.recipesListPageUrlResolver.resolve(pageNumber);

    const page = await this.pageProvider.provide(url);

    const numberOfRecipes = await this.recipesListPageElementParser.parseNumberOfRecipes(page);

    const recipeListPage: RecipesListPage = {
      recipesPaths: await this.recipesListPageElementParser.parseRecipesPaths(
        page,
        numberOfRecipes,
      ),
      numberOfAllRecipes: await this.recipesListPageElementParser.parseNumberOfAllRecipes(page),
    };

    await page.close();

    this.logger.debug(`Scraped recipes list page:\n${JSON.stringify(recipeListPage, null, 2)}`);

    return recipeListPage;
  }

  public async scrapMany(
    startPageNumber: number,
    stopPageNumber: number,
  ): Promise<RecipesListPage[]> {
    this.logger.info(`Scraping recipes list pages from ${startPageNumber} to ${stopPageNumber}`);

    const recipesListPages: RecipesListPage[] = [];
    for (let pageNumber = startPageNumber; pageNumber >= stopPageNumber; pageNumber--) {
      recipesListPages.push(await this.scrapOne(pageNumber));
    }

    return recipesListPages;
  }

  public async scrapPaginatedRecipesPaths(
    cursor: number = DEFAULT_PAGINATION_CURSOR,
    limit: number = DEFAULT_PAGINATION_LIMIT,
  ): Promise<RecipesListPaginated> {
    this.logger.info(`Scraping paginated recipes paths with cursor: ${cursor} and limit: ${limit}`);

    const {
      numberOfAllRecipes,
      recipesPaths: { length: numberOfRecipesPerPage },
    } = await this.scrapOne();

    if (cursor >= numberOfAllRecipes) {
      this.logger.warn(
        `Cursor ${cursor} is greater than or equal to number of all recipes: ${numberOfAllRecipes}`,
      );

      return { recipesPaths: [], nextCursor: 1, total: numberOfAllRecipes };
    }

    const [
      { pageNumber: startPageNumber, pathIndex: startRecipePathIndex },
      { pageNumber: stopPageNumber, pathIndex: stopRecipePathIndex },
    ] = this.recipesListPagePaginatedRangeResolver.resolve(
      numberOfAllRecipes,
      numberOfRecipesPerPage,
      cursor,
      limit,
    );

    const recipesListPages = await this.scrapMany(startPageNumber, stopPageNumber);

    const recipesListPaginated = {
      recipesPaths: this.recipesListPagePaginatedRecipesPathsResolver.resolve(
        recipesListPages,
        numberOfAllRecipes,
        numberOfRecipesPerPage,
        startPageNumber,
        startRecipePathIndex,
        stopRecipePathIndex,
      ),
      nextCursor: this.recipesListPagePaginatedNextCursorResolver.resolve(
        cursor,
        limit,
        numberOfAllRecipes,
        stopPageNumber,
        stopRecipePathIndex,
      ),
      total: numberOfAllRecipes,
    };

    this.logger.debug(
      `Scraped recipes list paginated:\n${JSON.stringify(recipesListPaginated, null, 2)}`,
    );

    return recipesListPaginated;
  }
}
