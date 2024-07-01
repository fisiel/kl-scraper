import { LoggerProvider } from '../../../logger/logger.provider';
import { Logger } from '../../../logger/types/interface/logger.interface';
import { RecipesListPage } from '../../types/interface/recipes-list-page.interface';
import { RecipesListPagePaginatedRangeResolver } from '../recipes-list-page-paginated-range/recipes-list-page-paginated-range.resolver';

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

    const lastRecipeIndex = (numberOfAllRecipes % numberOfRecipesPerPage) - 1;

    this.logger.silly(`Last recipe index: ${lastRecipeIndex}`);

    const startSliceIndex =
      startPageNumber === numberOfAllPages
        ? lastRecipeIndex - startRecipePathIndex
        : numberOfRecipesPerPage - startRecipePathIndex;

    this.logger.silly(`Start slice index: ${startSliceIndex}`);

    let recipesList = recipesListPages.flatMap(({ recipesPaths }) => recipesPaths.reverse());

    recipesList =
      stopRecipePathIndex === 0
        ? recipesList.slice(startSliceIndex)
        : recipesList.slice(startSliceIndex, -stopRecipePathIndex);

    this.logger.silly(`Recipes list: ${recipesList}`);

    return recipesList;
  }
}
