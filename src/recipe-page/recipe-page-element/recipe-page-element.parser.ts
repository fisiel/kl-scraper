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
    this.logger.silly(
      `Parsing title element ${RecipePageElementSelector.TITLE} attribute ${PageElementAttribute.CONTENT}`,
    );

    const titleElementAttribute = await page
      .locator(RecipePageElementSelector.TITLE)
      .getAttribute(PageElementAttribute.CONTENT);

    this.logger.silly(`Title element attribute: ${titleElementAttribute}`);

    return this.recipePageElementResolver.resolveTitle(titleElementAttribute as string);
  }

  public async parseTimeOfPreparation(page: Page): Promise<string | null> {
    this.logger.silly(
      `Parsing time of preparation element ${RecipePageElementSelector.TIME_OF_PREPARATION}`,
    );

    const timeOfPreparationElement = page.locator(RecipePageElementSelector.TIME_OF_PREPARATION);

    if (await timeOfPreparationElement.isHidden()) {
      this.logger.silly('Time of preparation element is not available');

      return null;
    }

    const timeOfPreparationElementInnerText = await page
      .locator(RecipePageElementSelector.TIME_OF_PREPARATION)
      .innerText();

    this.logger.silly(
      `Time of preparation element inner text: ${timeOfPreparationElementInnerText}`,
    );

    return timeOfPreparationElementInnerText;
  }

  public async parseNumberOfServings(page: Page): Promise<number | null> {
    this.logger.silly(
      `Parsing number of servings element ${RecipePageElementSelector.NUMBER_OF_SERVINGS}`,
    );

    const numberOfServingsElement = page.locator(RecipePageElementSelector.NUMBER_OF_SERVINGS);

    if (await numberOfServingsElement.isHidden()) {
      this.logger.silly('Number of servings element is not available');

      return null;
    }

    const numberOfServingsElementInnerText = await page
      .locator(RecipePageElementSelector.NUMBER_OF_SERVINGS)
      .innerText();

    this.logger.silly(`Number of servings element inner text: ${numberOfServingsElementInnerText}`);

    return this.recipePageElementResolver.resolveNumberOfServings(numberOfServingsElementInnerText);
  }

  public async parseRecipeParts(page: Page): Promise<RecipePart[]> {
    this.logger.silly(
      `Parsing number of recipe parts elements ${RecipePageElementSelector.PART_NAME}`,
    );

    const numberOfRecipePartsElements = await page
      .locator(RecipePageElementSelector.PART_NAME)
      .count();

    this.logger.silly(`Number of recipe parts elements: ${numberOfRecipePartsElements}`);

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
      this.logger.silly(`Parsing recipe part name element ${RecipePageElementSelector.PART_NAME}`);

      const recipePartNameElementInnerText = await page
        .locator(RecipePageElementSelector.PART_NAME)
        .nth(i)
        .innerText();

      this.logger.silly(`Recipe part name element inner text: ${recipePartNameElementInnerText}`);

      const recipePartIngredients = await this.parseRecipePartIngredients(page);

      recipeParts.push({
        name: recipePartNameElementInnerText,
        ingredients: recipePartIngredients,
      });
    }

    return recipeParts;
  }

  private async parseRecipePartIngredients(page: Page): Promise<Ingredient[]> {
    this.logger.silly(
      `Parsing number of recipe part ingredients elements ${RecipePageElementSelector.PART_INGREDIENT}`,
    );

    const numberOfRecipePartIngredientsElements = await page
      .locator(RecipePageElementSelector.PART_INGREDIENT)
      .count();

    this.logger.silly(
      `Number of recipe part ingredients elements: ${numberOfRecipePartIngredientsElements}`,
    );

    const recipePartIngredients: Ingredient[] = [];
    for (let i = 0; i < numberOfRecipePartIngredientsElements; i++) {
      this.logger.silly(
        `Parsing recipe part ingredient element ${RecipePageElementSelector.PART_INGREDIENT}`,
      );

      const recipePartIngredientElementInnerText = await page
        .locator(RecipePageElementSelector.PART_INGREDIENT)
        .nth(i)
        .innerText();

      this.logger.silly(
        `Recipe part ingredient element inner text: ${recipePartIngredientElementInnerText}'`,
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

    this.logger.silly(
      `Parsing number of nutritional values elements ${RecipePageElementSelector.NUTRITIONAL_VALUE_NAME}`,
    );

    const numberOfNutritionalValuesElements = await page
      .locator(RecipePageElementSelector.NUTRITIONAL_VALUE_NAME)
      .count();

    this.logger.silly(
      `Number of nutritional values elements: ${numberOfNutritionalValuesElements}`,
    );

    for (let i = 0; i < numberOfNutritionalValuesElements; i++) {
      this.logger.silly(
        `Parsing nutritional value name element ${RecipePageElementSelector.NUTRITIONAL_VALUE_NAME}`,
      );

      const nutritionalValueNameElementInnerText = await page
        .locator(RecipePageElementSelector.NUTRITIONAL_VALUE_NAME)
        .nth(i)
        .innerText();

      this.logger.silly(
        `Nutritional value name element inner text: ${nutritionalValueNameElementInnerText}`,
      );

      this.logger.silly(
        `Nutritional value value/unit element ${RecipePageElementSelector.NUTRITIONAL_VALUE_VALUE_UNIT}`,
      );

      const nutritionalValueValueUnitElementInnerText = await page
        .locator(RecipePageElementSelector.NUTRITIONAL_VALUE_VALUE_UNIT)
        .nth(i)
        .innerText();

      this.logger.silly(
        `Nutritional value value/unit element inner text: ${nutritionalValueValueUnitElementInnerText}`,
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
    this.logger.silly(
      `Parsing number of before cooking steps elements ${RecipePageElementSelector.BEFORE_COOKING_STEP}`,
    );

    const numberOfBeforeCookingStepsElements = await page
      .locator(RecipePageElementSelector.BEFORE_COOKING_STEP)
      .count();

    this.logger.silly(
      `Number of before cooking steps elements: ${numberOfBeforeCookingStepsElements}`,
    );

    const beforeCookingSteps: string[] = [];
    for (let i = 0; i < numberOfBeforeCookingStepsElements; i++) {
      this.logger.silly(
        `Parsing before cooking step element ${RecipePageElementSelector.BEFORE_COOKING_STEP}`,
      );

      const beforeCookingStepElementInnerText = await page
        .locator(RecipePageElementSelector.BEFORE_COOKING_STEP)
        .nth(i)
        .innerText();

      this.logger.silly(
        `Before cooking step element inner text: ${beforeCookingStepElementInnerText}`,
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
    this.logger.silly(
      `Parsing number of cooking steps elements ${RecipePageElementSelector.COOKING_STEP_DESCRIPTION}`,
    );

    const numberOfCookingStepsElements = await page
      .locator(RecipePageElementSelector.COOKING_STEP_DESCRIPTION)
      .count();

    this.logger.silly(`Number of cooking steps elements: ${numberOfCookingStepsElements}`);

    const cookingSteps: CookingStep[] = [];
    for (let i = 0; i < numberOfCookingStepsElements; i++) {
      this.logger.silly(
        `Parsing cooking step title element ${RecipePageElementSelector.COOKING_STEP_TITLE}`,
      );

      const cookingStepTitleElementInnerText = await page
        .locator(RecipePageElementSelector.COOKING_STEP_TITLE)
        .nth(numberOfBeforeCookingSteps > 0 ? i + 1 : i) // because first element is header
        .innerText();

      this.logger.silly(
        `Cooking step title element inner text: ${cookingStepTitleElementInnerText}`,
      );

      this.logger.silly(
        `Parsing cooking step description element ${RecipePageElementSelector.COOKING_STEP_DESCRIPTION}`,
      );

      const cookingStepDescriptionElementInnerText = await page
        .locator(RecipePageElementSelector.COOKING_STEP_DESCRIPTION)
        .nth(i)
        .innerText();

      this.logger.silly(
        `Cooking step description element inner text: ${cookingStepDescriptionElementInnerText}`,
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
