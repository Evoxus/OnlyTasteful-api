const recipesService = {
  getAllRecipes(knex) {
    return knex
      .from('recipes AS r')
      .select('r.title', 'r.recipe_description', 'r.recipe_id',
        'r.user_id', 'r.instructions')
      .distinct()
    // .catch(err => console.log(err))
  },
  getRecipeById(knex, recipe_id) {
    return recipesService.getAllRecipes(knex)
      .where({ recipe_id })
      .first()
      .catch(err => console.log(err))
  },
  getIngredientsForRecipe(knex, recipe_id) {
    return knex('recipeingredients AS ri')
      .select('i.ingredient_name', 'm.measurement_name', 'ri.quantity')
      .join('ingredients AS i', 'ri.ingredient_id', 'i.id')
      .join('measurements AS m', 'ri.measure_id', 'm.id')
      .where({ recipe_id })
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