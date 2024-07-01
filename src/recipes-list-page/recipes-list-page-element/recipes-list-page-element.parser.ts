import { Page } from 'playwright';
import { LoggerProvider } from '../../logger/logger.provider';
import { Logger } from '../../logger/types/interface/logger.interface';
import { PageElementAttribute } from '../../page/types/enum/page-element-attribute.enum';
import { RecipesListPageElementResolver } from './recipes-list-page-element.resolver';
import { RecipesListPageElementSelector } from './types/enum/recipes-list-page-element-selector.enum';

export class RecipesListPageElementParser {
  private readonly logger: Logger;
  private readonly recipesListPageElementResolver: RecipesListPageElementResolver;

  constructor(loggerProvider: LoggerProvider) {
    this.logger = loggerProvider.provide(RecipesListPageElementParser.name);

    this.recipesListPageElementResolver = new RecipesListPageElementResolver(loggerProvider);
  }

  public async parseNumberOfAllRecipes(page: Page): Promise<number> {
    const numberOfAllRecipesElementInnerText = await page
      .locator(RecipesListPageElementSelector.NUMBER_OF_ALL_RECIPES)
      .innerText();

    this.logger.silly(
      `Number of all recipes element ${RecipesListPageElementSelector.NUMBER_OF_ALL_RECIPES} inner text: ${numberOfAllRecipesElementInnerText}`,
    );

    const numberOfAllRecipes = this.recipesListPageElementResolver.resolveNumberOfAllRecipes(
      numberOfAllRecipesElementInnerText,
    );

    return numberOfAllRecipes;
  }

  public async parseNumberOfRecipes(page: Page): Promise<number> {
    const numberOfRecipesElements = await page
      .locator(RecipesListPageElementSelector.RECIPE)
      .count();

    this.logger.silly(
      `Number of recipes elements ${RecipesListPageElementSelector.RECIPE} per page: ${numberOfRecipesElements}`,
    );

    return numberOfRecipesElements;
  }

  public async parseRecipesPaths(page: Page, numberOfRecipes: number): Promise<string[]> {
    const recipesPaths: string[] = [];
    for (let i = 0; i < numberOfRecipes; i++) {
      const recipePathElementAttribute = (await page
        .locator(RecipesListPageElementSelector.RECIPE_PATH)
        .nth(i)
        .getAttribute(PageElementAttribute.HREF)) as string;

      this.logger.silly(
        `Recipe path element ${RecipesListPageElementSelector.RECIPE_PATH} attribute ${PageElementAttribute.HREF}: ${recipePathElementAttribute}`,
      );

      recipesPaths.push(recipePathElementAttribute);
    }

    return recipesPaths;
  }
}
