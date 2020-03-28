const recipesService = {
  getAllRecipes(knex) {
    return knex
      .from('recipes AS r')
      .join('recipeingredients AS ri', 'ri.recipe_id', 'r.recipe_id')
      .distinct('r.title', 'r.recipe_description', 'r.instructions')
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
  },
  updateRecipe(knex, recipe_id, newFields) {
    return knex('recipes')
      .where({ recipe_id })
      .update(newFields)
      .catch(err => console.log(err))
  }
}

module.exports = recipesService;