import { LoggerProvider } from '../../../logger/logger.provider';
import { Logger } from '../../../logger/types/interface/logger.interface';
import { MINIMAL_CURSOR, MINIMAL_RECIPE_LIST_PAGE_NUMBER } from './constant';

export class RecipesListPagePaginatedNextCursorResolver {
  private readonly logger: Logger;

  constructor(loggerProvider: LoggerProvider) {
    this.logger = loggerProvider.provide(RecipesListPagePaginatedNextCursorResolver.name);
  }

  public resolve(
    cursor: number,
    limit: number,
    numberOfAllRecipes: number,
    stopPageNumber: number,
    stopRecipePathIndex: number,
  ): number {
    let nextCursor;

    if (
      (stopRecipePathIndex === 0 && stopPageNumber === MINIMAL_RECIPE_LIST_PAGE_NUMBER) ||
      cursor + limit > numberOfAllRecipes
    ) {
      nextCursor = MINIMAL_CURSOR;
    } else {
      nextCursor = cursor + limit;
    }

    this.logger.silly(`Next cursor: ${nextCursor}`);

    return nextCursor;
  }
}
