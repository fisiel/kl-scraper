import { LoggerProvider } from '../../logger/logger.provider';
import { Logger } from '../../logger/types/interface/logger.interface';
import { BASE_URL } from '../../shared/constant';

export class RecipesListPageUrlResolver {
  private readonly logger: Logger;

  constructor(loggerProvider: LoggerProvider) {
    this.logger = loggerProvider.provide(RecipesListPageUrlResolver.name);
  }

  public resolve(pageNumber?: number): string {
    const baseRecipesListUrl = `${BASE_URL}/przepisy/nowe/rosnaco`;

    const recipesListUrl =
      pageNumber && pageNumber > 0
        ? `${baseRecipesListUrl}/${pageNumber}#lista`
        : baseRecipesListUrl;

    this.logger.silly(`Recipes list URL: ${recipesListUrl}`);

    return recipesListUrl;
  }
}
