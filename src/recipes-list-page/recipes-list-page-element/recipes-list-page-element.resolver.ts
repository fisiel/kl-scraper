import { LoggerProvider } from '../../logger/logger.provider';
import { Logger } from '../../logger/types/interface/logger.interface';

export class RecipesListPageElementResolver {
  private readonly logger: Logger;

  constructor(private readonly loggerProvider: LoggerProvider) {
    this.logger = this.loggerProvider.provide(RecipesListPageElementResolver.name);
  }

  public resolveNumberOfAllRecipes(numberOfAllRecipesElementInnerText: string): number {
    const numberOfAllRecipes = parseInt(
      numberOfAllRecipesElementInnerText.replace('liczba przepisów: ', ''),
      10,
    );

    this.logger.silly(`Number of all recipes: ${numberOfAllRecipes}`);

    return numberOfAllRecipes;
  }
}
