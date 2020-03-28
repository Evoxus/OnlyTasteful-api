const recipesService = {
  getAllRecipes(knex) {
    return knex
      .from('recipes AS r')
      .select('r.title', 'r.recipe_description', 'r.recipe_id',
        'r.user_id', 'r.instructions')
      .distinct()
      .catch(err => console.log(err))
  },
  getRecipeById(knex, recipe_id) {
    return knex
      .from('recipes AS r')
      .select('r.title', 'r.recipe_description', 'r.recipe_id',
        'r.user_id', 'r.instructions')
      .distinct()
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
      .catch(err => console.log(err))
  },
  getIngredients(knex) {
    return knex('ingredients')
      .select('*')
      .catch(err => console.log(err))
  },
  getMeasurements(knex) {
    return knex('measurements')
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
  addIngredients(knex, ingredients) {
    return knex('ingredients')
      .select('*')
      .where(ingredients.map(ingredient => ({ ingredient_name: ingredient })))
      .then(rows => {
        if (rows.length === 0) {
          return knex
            .insert(ingredients.map(ingredient => ({ ingredient_name: ingredient })))
            .into('ingredients')
            .returning('*')
        } else {
          throw new Error('Ingredient exists in database already')
        }
      })
      .catch(err => console.log(err))
  },
  addMeasurements(knex, measurements) {
    return knex('measurements')
      .select('*')
      .where(measurements.map(measurement => ({ measurement_name: measurement })))
      .then(rows => {
        if (rows.length === 0) {
          return knex
            .insert(measurements.map(measurement => ({ measurement_name: measurement })))
            .into('measurements')
            .returning('*')
        } else {
          throw new Error('Measurement exists in database already')
        }
      })
      .catch(err => console.log(err))
  },
  // TODO: addRecipeIngredients (reference row between recipe, ingredients, measurements, and quantities)
  deleteRecipe(knex, recipe_id) {
    return knex('recipes')
      .where({ recipe_id })
      .delete()
      .catch(err => console.log(err))
  },
  // TODO: deleteRecipeIngredients
  updateRecipe(knex, recipe_id, newFields) {
    return knex('recipes')
      .where({ recipe_id })
      .update(newFields)
      .catch(err => console.log(err))
  }
  // TODO: updateRecipeIngredients
}

module.exports = recipesService;