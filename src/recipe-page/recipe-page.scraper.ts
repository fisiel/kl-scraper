import { Logger, LoggerProvider } from '../logger/logger.module';
import { PageProvider } from '../page/page.module';
import { RecipePageElementParser } from './recipe-page-element/recipe-page-element.module';
import { RecipePageUrlResolver } from './recipe-page-url/recipe-page-url.module';
import { RecipePage } from './types/interface/recipe-page.interface';

export class RecipePageScraper {
  private readonly logger: Logger;

  private readonly recipePageUrlResolver: RecipePageUrlResolver;
  private readonly recipePageElementParser: RecipePageElementParser;

  constructor(
    private readonly pageProvider: PageProvider,
    loggerProvider: LoggerProvider,
  ) {
    this.logger = loggerProvider.provide(RecipePageScraper.name);

    this.recipePageUrlResolver = new RecipePageUrlResolver(loggerProvider);
    this.recipePageElementParser = new RecipePageElementParser(loggerProvider);
  }

  public async scrap(recipePath: string): Promise<RecipePage> {
    this.logger.info(`Scraping recipe with path: ${recipePath}`);

    const url = this.recipePageUrlResolver.resolve(recipePath);

    const page = await this.pageProvider.provide(url);

    const beforeCookingSteps = await this.recipePageElementParser.parseBeforeCookingSteps(page);

    const recipe = {
      path: recipePath,
      title: await this.recipePageElementParser.parseTitle(page),
      timeOfPreparation: await this.recipePageElementParser.parseTimeOfPreparation(page),
      numberOfServings: await this.recipePageElementParser.parseNumberOfServings(page),
      recipeParts: await this.recipePageElementParser.parseRecipeParts(page),
      nutritionalValues: await this.recipePageElementParser.parseNutritionalValues(page),
      beforeCookingSteps,
      cookingSteps: await this.recipePageElementParser.parseCookingSteps(
        page,
        beforeCookingSteps.length,
      ),
    };

    await page.close();

    this.logger.info(`Recipe scraped from page ${url} :\n${JSON.stringify(recipe, null, 2)}`);

    return recipe;
  }
}
