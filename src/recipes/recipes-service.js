const recipesService = {
  getAllRecipes(knex) {
    return knex
      .from('recipes')
      .join('recipeingredients', 'recipes.recipe_id', 'recipeingredients.recipe_id')
      .select('*')
      .catch(err => console.log(err))
  },
}

module.exports = recipesService;