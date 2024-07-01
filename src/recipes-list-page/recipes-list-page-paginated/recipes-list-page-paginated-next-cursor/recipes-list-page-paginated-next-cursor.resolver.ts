import { LoggerProvider } from '../../../logger/logger.provider';
import { Logger } from '../../../logger/types/interface/logger.interface';

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
      (stopRecipePathIndex === 0 && stopPageNumber === 1) ||
      cursor + limit > numberOfAllRecipes
    ) {
      nextCursor = 1;
    } else {
      nextCursor = cursor + limit;
    }

    this.logger.silly(`Next cursor: ${nextCursor}`);

    return nextCursor;
  }
}
