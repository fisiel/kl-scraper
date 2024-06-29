import { Ingredient } from './ingredient.interface';

export interface RecipePart {
  name?: string;
  ingredients: Ingredient[];
}
