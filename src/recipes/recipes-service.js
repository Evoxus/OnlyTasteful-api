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
  getIngredientIdByName(knex, ingredient_name) {
    return knex('ingredients')
      .select('id')
      .where({ ingredient_name })
      .first()
  },
  getMeasurementIdByName(knex, measurement_name) {
    return knex('measurments')
      .select('id')
      .where({ measurement_name })
      .first()
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
          return 'Ingredient already exists, a new one will not be created'
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
          return 'Measurement already exists, a new one will not be created'
        }
      })
      .catch(err => console.log(err))
  },
  addRecipeIngredients(knex, references) {
    return knex
      .insert(references)
      .into('recipeingredients')
      .returning('*')
      .catch(err => console.log(err))
  },
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