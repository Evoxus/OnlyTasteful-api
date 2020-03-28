const recipesService = {
  getAllRecipes(knex) {
    return knex
      .from('recipes')
      .join('recipeingredients', 'recipes.recipe_id', 'recipeingredients.recipe_id')
      .select('*')
      .catch(err => console.log(err))
  },
  getRecipeById(knex, recipe_id) {
    return knex
      .from('recipes')
      .select('*')
      .catch(err => console.log(err))
  },
  createRecipe(knex, newRecipe) {
    return knex
      .insert(newRecipe)
      .into('recipes')
      .returning('*')
      .then(([recipe]) => recipe)
      .then(recipe => 
        recipesService.getRecipeById(knex, recipe.recipe_id)
      )
      .catch(err => console.log(err))
  },
}

module.exports = recipesService;