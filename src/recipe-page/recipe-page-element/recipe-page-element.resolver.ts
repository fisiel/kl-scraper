import { Logger, LoggerProvider } from '../../logger/logger.module';
import { RecipePageNutritionalValueUnit } from './types/enum/recipe-page-element-nutritional-value-unit.enum';
import { Ingredient } from './types/interface/ingredient.interface';
import { NutritionalValue } from './types/interface/nutritional-value.interface';

export class RecipePageElementResolver {
  private readonly logger: Logger;

  constructor(loggerProvider: LoggerProvider) {
    this.logger = loggerProvider.provide(RecipePageElementResolver.name);
  }

  public resolveTitle(titleElementAttribute: string): string {
    const title = titleElementAttribute.replace(' - przepis', '');

    this.logger.debug(`Title: ${title}`);

    return title;
  }

  public resolveNumberOfServings(numberOfServingsElementInnerText: string): number {
    const numberOfServings = parseInt(this.trimDoubleQuotes(numberOfServingsElementInnerText), 10);

    this.logger.debug(`Number of servings: ${numberOfServings}`);

    return numberOfServings;
  }

  public resolveRecipePartIngredient(recipePartIngredientElementInnerText: string): Ingredient {
    const ingredient = /(?<name>.*)\s+-\s+(?<amount>.*)\s+(?<unit>.*)$/.exec(
      recipePartIngredientElementInnerText,
    )?.groups as {
      name: string;
      amount: string;
      unit: string;
    };

    this.logger.debug(`Recipe part ingredient:\n${JSON.stringify(ingredient, null, 2)}`);

    return ingredient;
  }

  public resolveNutritionalValue(
    nutritionalValueValueUnitElementInnerText: string,
  ): NutritionalValue {
    const [value, unit] = nutritionalValueValueUnitElementInnerText.split(' ');

    this.logger.debug(`Nutritional value split value: ${value} and unit: ${unit}`);

    const nutritionalValue = {
      value: parseFloat(value.replace(',', '.')),
      unit: unit as RecipePageNutritionalValueUnit,
    };

    this.logger.debug(`Nutritional value:\n${JSON.stringify(nutritionalValue, null, 2)}`);

    return nutritionalValue;
  }

  public resolveBeforeCookingStep(beforeCookingStepElementInnerText: string): string {
    const beforeCookingStep = this.trimDoubleQuotes(beforeCookingStepElementInnerText);

    this.logger.debug(`Before cooking step: ${beforeCookingStep}`);

    return beforeCookingStep;
  }

  public resolveCookingStepDescription(cookingStepDescriptionElementInnerText: string): string {
    const cookingStepDescription = this.trimDoubleQuotes(cookingStepDescriptionElementInnerText);

    this.logger.debug(`Cooking step description: ${cookingStepDescription}`);

    return cookingStepDescription;
  }

  private trimDoubleQuotes(text: string): string {
    return text.replace('"', '');
  }
}
