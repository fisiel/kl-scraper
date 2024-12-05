import { LoggerProvider } from '../logger/logger.provider';
import { Logger } from '../logger/types/interface/logger.interface';
import { PageProvider } from '../page/page.provider';
import { RecipePageElementParser } from './recipe-page-element/recipe-page-element.parser';
import { RecipePageUrlResolver } from './recipe-page-url/recipe-page-url.resolver';
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

  public async scrapOne(recipePath: string): Promise<RecipePage> {
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

    this.logger.debug(`Scraped recipe :\n${JSON.stringify(recipe, null, 2)}`);

    return recipe;
  }

  public async scrapMany(recipesPaths: string[]): Promise<RecipePage[]> {
    this.logger.info(`Scraping ${recipesPaths.length} recipes`);

    const recipes: RecipePage[] = [];
    for (const recipePath of recipesPaths) {
      recipes.push(await this.scrapOne(recipePath));
    }

    return recipes;
  }
}
