import { CookingStep } from '../../recipe-page-element/types/interface/cooking-step.interface';
import { NutritionalValues } from '../../recipe-page-element/types/interface/nutritional-values.interface';
import { RecipePart } from '../../recipe-page-element/types/interface/recipe-part.interface';

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
