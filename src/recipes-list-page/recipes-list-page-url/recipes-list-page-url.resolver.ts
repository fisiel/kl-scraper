import { Logger, LoggerProvider } from '../../logger/logger.module';
import { BASE_URL } from '../../shared/constant';

export class RecipesListPageUrlResolver {
  private readonly logger: Logger;

  constructor(loggerProvider: LoggerProvider) {
    this.logger = loggerProvider.provide(RecipesListPageUrlResolver.name);
  }

  public resolve(pageNumber?: number): string {
    const baseRecipesListUrl = `${BASE_URL}/przepisy/nowe/rosnaco`;

    const recipesListUrl = pageNumber
      ? `${baseRecipesListUrl}/${pageNumber}#lista`
      : baseRecipesListUrl;

    this.logger.debug(`Recipes list URL: ${recipesListUrl}`);

    return recipesListUrl;
  }
}
