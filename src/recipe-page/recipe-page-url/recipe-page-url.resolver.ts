import { LoggerProvider } from '../../logger/logger.provider';
import { Logger } from '../../logger/types/interface/logger.interface';
import { BASE_URL } from '../../shared/constant';

export class RecipePageUrlResolver {
  private readonly logger: Logger;

  constructor(loggerProvider: LoggerProvider) {
    this.logger = loggerProvider.provide(RecipePageUrlResolver.name);
  }

  public resolve(recipePath: string): string {
    const recipeUrl = `${BASE_URL}${recipePath}`;

    this.logger.silly(`Recipe URL: ${recipeUrl}`);

    return recipeUrl;
  }
}
