const recipesService = {
  getAllRecipes(knex) {
    return knex
      .select('*')
      .from('recipes')
      .join('recipeIngredients', 'recipes.recipe_id', '=', 'recipe_id')
      .catch(err => console.log(err))
  },
}

module.exports = recipesService;