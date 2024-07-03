import { LoggerProvider } from '../../../logger/logger.provider';
import { Logger } from '../../../logger/types/interface/logger.interface';
import { MINIMAL_CURSOR } from '../recipes-list-page-paginated-next-cursor/constant';
import { indexify } from '../utils/indexify';
import { RecipesListPagePaginatedRangeRecipeInfo } from './types/interface/recipes-list-page-paginated-range-recipe-info.interface';
import { RecipesListPagePaginatedRange } from './types/type/recipes-list-page-paginated-range.type';

export class RecipesListPagePaginatedRangeResolver {
  private readonly logger: Logger;

  constructor(loggerProvider: LoggerProvider) {
    this.logger = loggerProvider.provide(RecipesListPagePaginatedRangeResolver.name);
  }

  public resolve(
    numberOfAllRecipes: number,
    numberOfRecipesPerPage: number,
    cursor: number,
    limit: number,
  ): RecipesListPagePaginatedRange {
    const recipeNumber = numberOfAllRecipes - cursor + MINIMAL_CURSOR;

    this.logger.silly(`Recipe number: ${recipeNumber}`);

    const lowestRecipeNumber = Math.max(MINIMAL_CURSOR, recipeNumber - limit);

    this.logger.silly(`Lowest recipe number: ${lowestRecipeNumber}`);

    return [
      this.resolveRecipeInfo(recipeNumber, numberOfRecipesPerPage),
      this.resolveRecipeInfo(lowestRecipeNumber, numberOfRecipesPerPage),
    ];
  }

  private resolveRecipeInfo(
    recipeNumber: number,
    numberOfRecipesPerPage: number,
  ): RecipesListPagePaginatedRangeRecipeInfo {
    return {
      pageNumber: this.resolvePageNumber(recipeNumber, numberOfRecipesPerPage),
      pathIndex: this.resolveRecipePathIndex(recipeNumber, numberOfRecipesPerPage),
    };
  }

  public resolvePageNumber(recipeNumber: number, numberOfRecipesPerPage: number): number {
    const pageNumber = Math.ceil(recipeNumber / numberOfRecipesPerPage);

    this.logger.silly(`Page number: ${pageNumber}`);

    return pageNumber;
  }

  private resolveRecipePathIndex(recipeNumber: number, numberOfRecipesPerPage: number): number {
    let recipePathIndex = indexify(recipeNumber % numberOfRecipesPerPage);

    if (recipePathIndex < 0) {
      recipePathIndex = indexify(numberOfRecipesPerPage);
    }

    this.logger.silly(`Recipe path index: ${recipePathIndex}`);

    return recipePathIndex;
  }
}
