import { Page } from 'playwright';
import { LoggerProvider } from '../../logger/logger.provider';
import { Logger } from '../../logger/types/interface/logger.interface';
import { PageElementAttribute } from '../../page/types/enum/page-element-attribute.enum';
import { RecipePageElementResolver } from './recipe-page-element.resolver';
import { RecipePageNutritionalValueName } from './types/enum/recipe-page-element-nutritional-value-name.enum';
import { RecipePageNutritionalValueUnit } from './types/enum/recipe-page-element-nutritional-value-unit.enum';
import { RecipePageElementSelector } from './types/enum/recipe-page-element-selector.enum';
import { CookingStep } from './types/interface/cooking-step.interface';
import { Ingredient } from './types/interface/ingredient.interface';
import { NutritionalValue } from './types/interface/nutritional-value.interface';
import { NutritionalValues } from './types/interface/nutritional-values.interface';
import { RecipePart } from './types/interface/recipe-part.interface';

export class RecipePageElementParser {
  private readonly logger: Logger;

  private readonly recipePageElementResolver: RecipePageElementResolver;

  constructor(loggerProvider: LoggerProvider) {
    this.logger = loggerProvider.provide(RecipePageElementParser.name);

    this.recipePageElementResolver = new RecipePageElementResolver(loggerProvider);
  }

  public async parseTitle(page: Page): Promise<string> {
    const titleElementAttribute = await page
      .locator(RecipePageElementSelector.TITLE)
      .getAttribute(PageElementAttribute.CONTENT);

    this.logger.silly(
      `Title element ${RecipePageElementSelector.TITLE} attribute ${PageElementAttribute.CONTENT}: ${titleElementAttribute}`,
    );

    return this.recipePageElementResolver.resolveTitle(titleElementAttribute as string);
  }

  public async parseTimeOfPreparation(page: Page): Promise<string> {
    const timeOfPreparationElementInnerText = await page
      .locator(RecipePageElementSelector.TIME_OF_PREPARATION)
      .innerText();

    this.logger.silly(
      `Time of preparation element ${RecipePageElementSelector.TIME_OF_PREPARATION} inner text: ${timeOfPreparationElementInnerText}`,
    );

    return timeOfPreparationElementInnerText;
  }

  public async parseNumberOfServings(page: Page): Promise<number> {
    const numberOfServingsElementInnerText = await page
      .locator(RecipePageElementSelector.NUMBER_OF_SERVINGS)
      .innerText();

    this.logger.silly(
      `Number of servings element ${RecipePageElementSelector.NUMBER_OF_SERVINGS} inner text: ${numberOfServingsElementInnerText}`,
    );

    return this.recipePageElementResolver.resolveNumberOfServings(numberOfServingsElementInnerText);
  }

  public async parseRecipeParts(page: Page): Promise<RecipePart[]> {
    const numberOfRecipePartsElements = await page
      .locator(RecipePageElementSelector.PART_NAME)
      .count();

    this.logger.silly(
      `Number of recipe parts elements ${RecipePageElementSelector.PART_NAME}: ${numberOfRecipePartsElements}`,
    );

    if (numberOfRecipePartsElements === 0) {
      const recipePartIngredients = await this.parseRecipePartIngredients(page);

      return [
        {
          ingredients: recipePartIngredients,
        },
      ];
    }

    const recipeParts: RecipePart[] = [];
    for (let i = 0; i < numberOfRecipePartsElements; i++) {
      const recipePartNameElementInnerText = await page
        .locator(RecipePageElementSelector.PART_NAME)
        .nth(i)
        .innerText();
      this.logger.silly(
        `Recipe part name element ${RecipePageElementSelector.PART_NAME} inner text: ${recipePartNameElementInnerText}`,
      );

      const recipePartIngredients = await this.parseRecipePartIngredients(page);

      recipeParts.push({
        name: recipePartNameElementInnerText,
        ingredients: recipePartIngredients,
      });
    }

    return recipeParts;
  }

  private async parseRecipePartIngredients(page: Page): Promise<Ingredient[]> {
    const numberOfRecipePartIngredientsElements = await page
      .locator(RecipePageElementSelector.PART_INGREDIENT)
      .count();

    this.logger.silly(
      `Number of recipe part ingredients elements ${RecipePageElementSelector.PART_INGREDIENT}: ${numberOfRecipePartIngredientsElements}`,
    );

    const recipePartIngredients: Ingredient[] = [];
    for (let i = 0; i < numberOfRecipePartIngredientsElements; i++) {
      const recipePartIngredientElementInnerText = await page
        .locator(RecipePageElementSelector.PART_INGREDIENT)
        .nth(i)
        .innerText();

      this.logger.silly(
        `Recipe part ingredient element ${RecipePageElementSelector.PART_INGREDIENT} inner text: ${recipePartIngredientElementInnerText}'`,
      );

      recipePartIngredients.push(
        this.recipePageElementResolver.resolveRecipePartIngredient(
          recipePartIngredientElementInnerText,
        ),
      );
    }

    return recipePartIngredients;
  }

  public async parseNutritionalValues(page: Page): Promise<NutritionalValues> {
    let calories: NutritionalValue = { value: 0, unit: RecipePageNutritionalValueUnit.KCAL };
    let caloriesPerServing: NutritionalValue = {
      value: 0,
      unit: RecipePageNutritionalValueUnit.KCAL,
    };
    let fats: NutritionalValue = { value: 0, unit: RecipePageNutritionalValueUnit.GRAM };
    let carbohydrates: NutritionalValue = { value: 0, unit: RecipePageNutritionalValueUnit.GRAM };
    let fiber: NutritionalValue = { value: 0, unit: RecipePageNutritionalValueUnit.GRAM };
    let proteins: NutritionalValue = { value: 0, unit: RecipePageNutritionalValueUnit.GRAM };

    const numberOfNutritionalValuesElements = await page
      .locator(RecipePageElementSelector.NUTRITIONAL_VALUE_NAME)
      .count();
    this.logger.silly(
      `Number of nutritional values elements ${RecipePageElementSelector.NUTRITIONAL_VALUE_NAME}: ${numberOfNutritionalValuesElements}`,
    );

    for (let i = 0; i < numberOfNutritionalValuesElements; i++) {
      const nutritionalValueNameElementInnerText = await page
        .locator(RecipePageElementSelector.NUTRITIONAL_VALUE_NAME)
        .nth(i)
        .innerText();
      this.logger.silly(
        `Nutritional value name element ${RecipePageElementSelector.NUTRITIONAL_VALUE_NAME} inner text: ${nutritionalValueNameElementInnerText}`,
      );

      const nutritionalValueValueUnitElementInnerText = await page
        .locator(RecipePageElementSelector.NUTRITIONAL_VALUE_VALUE_UNIT)
        .nth(i)
        .innerText();
      this.logger.silly(
        `Nutritional value value/unit element ${RecipePageElementSelector.NUTRITIONAL_VALUE_VALUE_UNIT} inner text: ${nutritionalValueValueUnitElementInnerText}`,
      );

      const nutritionalValue = this.recipePageElementResolver.resolveNutritionalValue(
        nutritionalValueValueUnitElementInnerText,
      );

      switch (nutritionalValueNameElementInnerText) {
        case RecipePageNutritionalValueName.CALORIES:
          calories = nutritionalValue;
          break;
        case RecipePageNutritionalValueName.CALORIES_PER_SERVING:
          caloriesPerServing = nutritionalValue;
          break;
        case RecipePageNutritionalValueName.FATS:
          fats = nutritionalValue;
          break;
        case RecipePageNutritionalValueName.CARBOHYDRATES:
          carbohydrates = nutritionalValue;
          break;
        case RecipePageNutritionalValueName.FIBER:
          fiber = nutritionalValue;
          break;
        case RecipePageNutritionalValueName.PROTEINS:
          proteins = nutritionalValue;
          break;
        default:
          break;
      }
    }

    return {
      calories,
      caloriesPerServing,
      fats,
      carbohydrates,
      fiber,
      proteins,
    };
  }

  public async parseBeforeCookingSteps(page: Page): Promise<string[]> {
    const numberOfBeforeCookingStepsElements = await page
      .locator(RecipePageElementSelector.BEFORE_COOKING_STEP)
      .count();
    this.logger.silly(
      `Number of before cooking steps elements ${RecipePageElementSelector.BEFORE_COOKING_STEP}: ${numberOfBeforeCookingStepsElements}`,
    );

    const beforeCookingSteps: string[] = [];
    for (let i = 0; i < numberOfBeforeCookingStepsElements; i++) {
      const beforeCookingStepElementInnerText = await page
        .locator(RecipePageElementSelector.BEFORE_COOKING_STEP)
        .nth(i)
        .innerText();
      this.logger.silly(
        `Before cooking step element ${RecipePageElementSelector.BEFORE_COOKING_STEP} inner text: ${beforeCookingStepElementInnerText}`,
      );

      const beforeCookingStep = this.recipePageElementResolver.resolveBeforeCookingStep(
        beforeCookingStepElementInnerText,
      );

      beforeCookingSteps.push(beforeCookingStep);
    }

    return beforeCookingSteps;
  }

  public async parseCookingSteps(
    page: Page,
    numberOfBeforeCookingSteps: number,
  ): Promise<CookingStep[]> {
    const numberOfCookingStepsElements = await page
      .locator(RecipePageElementSelector.COOKING_STEP_DESCRIPTION)
      .count();
    this.logger.silly(
      `Number of cooking steps elements ${RecipePageElementSelector.COOKING_STEP_DESCRIPTION}: ${numberOfCookingStepsElements}`,
    );

    const cookingSteps: CookingStep[] = [];
    for (let i = 0; i < numberOfCookingStepsElements; i++) {
      const cookingStepTitleElementInnerText = await page
        .locator(RecipePageElementSelector.COOKING_STEP_TITLE)
        .nth(numberOfBeforeCookingSteps > 0 ? i + 1 : i) // because first element is header
        .innerText();
      this.logger.silly(
        `Cooking step title element ${RecipePageElementSelector.COOKING_STEP_TITLE} inner text: ${cookingStepTitleElementInnerText}`,
      );

      const cookingStepDescriptionElementInnerText = await page
        .locator(RecipePageElementSelector.COOKING_STEP_DESCRIPTION)
        .nth(i)
        .innerText();
      this.logger.silly(
        `Cooking step description element ${RecipePageElementSelector.COOKING_STEP_DESCRIPTION} inner text: ${cookingStepDescriptionElementInnerText}`,
      );

      const description = this.recipePageElementResolver.resolveCookingStepDescription(
        cookingStepDescriptionElementInnerText,
      );

      cookingSteps.push({
        title: cookingStepTitleElementInnerText,
        description,
      });
    }

    return cookingSteps;
  }
}
