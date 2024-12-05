import { NutritionalValue } from './nutritional-value.interface';

export interface NutritionalValues {
  calories: NutritionalValue;
  caloriesPerServing: NutritionalValue;
  fats: NutritionalValue;
  carbohydrates: NutritionalValue;
  fiber: NutritionalValue;
  proteins: NutritionalValue;
}
