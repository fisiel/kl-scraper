import { RecipePage } from '../../recipe-page/types/interface/recipe-page.interface';
import { BasePaginated } from '../../shared/types/type/base-paginated.type';

export type RecipesPaginated = BasePaginated<'recipes', RecipePage>;
