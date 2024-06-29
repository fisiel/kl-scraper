import {
  CookingStep,
  NutritionalValues,
  RecipePart,
} from '../../recipe-page-element/recipe-page-element.module';

export interface RecipePage {
  path: string;
  title: string;
  timeOfPreparation: string;
  numberOfServings: number;
  recipeParts: RecipePart[];
  nutritionalValues: NutritionalValues;
  beforeCookingSteps: string[];
  cookingSteps: CookingStep[];
}
