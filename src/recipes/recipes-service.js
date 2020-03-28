const recipesService = {
  getAllRecipes(knex) {
    return knex
      .from('recipeingredients')
      .join('recipes', 'recipeingredients.recipe_id', 'recipes.recipe_id')
      .distinct('recipes.title')
      .catch(err => console.log(err))
  },
  getRecipeById(knex, recipe_id) {
    return recipesService.getAllRecipes(knex)
      .where({ recipe_id })
      .first()
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
  deleteRecipe(knex, recipe_id) {
    return knex('recipes')
      .where({ recipe_id })
      .delete()
      .catch(err => console.log(err))
  }
}

module.exports = recipesService;