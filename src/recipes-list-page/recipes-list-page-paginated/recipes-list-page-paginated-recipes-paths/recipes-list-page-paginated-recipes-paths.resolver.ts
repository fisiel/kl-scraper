import { LoggerProvider } from '../../../logger/logger.provider';
import { Logger } from '../../../logger/types/interface/logger.interface';
import { RecipesListPage } from '../../types/interface/recipes-list-page.interface';
import { RecipesListPagePaginatedRangeResolver } from '../recipes-list-page-paginated-range/recipes-list-page-paginated-range.resolver';
import { indexify } from '../utils/indexify';

export class RecipesListPagePaginatedRecipesPathsResolver {
  private readonly logger: Logger;

  constructor(
    loggerProvider: LoggerProvider,
    private readonly recipesListPagePaginatedRangeResolver: RecipesListPagePaginatedRangeResolver,
  ) {
    this.logger = loggerProvider.provide(RecipesListPagePaginatedRecipesPathsResolver.name);
  }

  public resolve(
    recipesListPages: RecipesListPage[],
    numberOfAllRecipes: number,
    numberOfRecipesPerPage: number,
    startPageNumber: number,
    startRecipePathIndex: number,
    stopRecipePathIndex: number,
  ): string[] {
    const numberOfAllPages = this.recipesListPagePaginatedRangeResolver.resolvePageNumber(
      numberOfAllRecipes,
      numberOfRecipesPerPage,
    );

    const lastRecipeOnPageIndex = indexify(numberOfAllRecipes % numberOfRecipesPerPage);

    this.logger.silly(`Last recipe on page index: ${lastRecipeOnPageIndex}`);

    const startSliceIndex =
      startPageNumber === numberOfAllPages
        ? lastRecipeOnPageIndex - startRecipePathIndex
        : indexify(numberOfRecipesPerPage) - startRecipePathIndex;

    this.logger.silly(`Start slice index: ${startSliceIndex}`);
    this.logger.silly(`Stop slice index: ${stopRecipePathIndex}`);

    let recipesList = recipesListPages.flatMap(({ recipesPaths }) => recipesPaths.reverse());

    recipesList =
      stopRecipePathIndex === 0
        ? recipesList.slice(startSliceIndex)
        : recipesList.slice(startSliceIndex, -stopRecipePathIndex);

    this.logger.silly(`Recipes list: ${recipesList}`);

    return recipesList;
  }
}
