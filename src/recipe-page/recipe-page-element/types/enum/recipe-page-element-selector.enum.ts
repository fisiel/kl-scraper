export enum RecipePageElementSelector {
  TIME_OF_PREPARATION = 'div.recipe_main div.recipe_meta li.meta_time strong',
  NUMBER_OF_SERVINGS = 'div.recipe_main div.recipe_meta li.meta_size',
  TITLE = 'head meta[property="og:title"]',
  PART_NAME = 'div#details div.skladniki:not(.wartosci) h2',
  PART_INGREDIENT = 'div#details div.skladniki:not(.wartosci) ul li',
  NUTRITIONAL_VALUE_NAME = 'div#details div.skladniki.wartosci table tr td:first-of-type',
  NUTRITIONAL_VALUE_VALUE_UNIT = 'div#details div.skladniki.wartosci table tr td+td',
  BEFORE_COOKING_STEP = 'div.recipe_main div#opis h2+ul li',
  COOKING_STEP_TITLE = 'div.recipe_main div#opis h2',
  COOKING_STEP_DESCRIPTION = 'div.recipe_main div#opis h2+p',
}
