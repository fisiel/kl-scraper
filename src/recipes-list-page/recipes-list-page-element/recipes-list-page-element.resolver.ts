import { Logger, LoggerProvider } from '../../logger/logger.module';

export class RecipesListPageElementResolver {
  private readonly logger: Logger;

  constructor(private readonly loggerProvider: LoggerProvider) {
    this.logger = this.loggerProvider.provide(RecipesListPageElementResolver.name);
  }

  public resolveNumberOfAllPages(numberOfAllRecipes: number, numberOfRecipes: number): number {
    const numberOfAllPages = Math.ceil(numberOfAllRecipes / numberOfRecipes);

    this.logger.debug(`Number of all pages: ${numberOfAllPages}`);

    return numberOfAllPages;
  }

  public resolveNumberOfAllRecipes(numberOfAllRecipesElementInnerText: string): number {
    const numberOfAllRecipes = parseInt(
      numberOfAllRecipesElementInnerText.replace('liczba przepisów: ', ''),
      10,
    );

    this.logger.debug(`Number of all recipes: ${numberOfAllRecipes}`);

    return numberOfAllRecipes;
  }
}
