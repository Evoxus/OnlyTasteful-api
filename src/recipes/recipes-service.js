const recipesService = {
  getAllRecipes(knex) {
    return knex
      .from('recipes AS r')
      .select(
        'r.recipe_id',
        'r.title',
        'r.recipe_description',
        'r.instructions',
        'r.user_id',
        'u.user_id',
        'u.user_name')
      .leftJoin('users AS u', 'r.user_id', 'u.user_id')
      .groupBy('r.recipe_id', 'u.user_id')
      .catch(err => console.log(err))
  },
  getRecipeById(knex, recipe_id) {
    return knex
      .from('recipes AS r')
      .select(
        'r.recipe_id',
        'r.title',
        'r.recipe_description',
        'r.instructions',
        'r.user_id',
        'u.user_id',
        'u.user_name')
      .leftJoin('users AS u', 'r.user_id', 'u.user_id')
      .groupBy('r.recipe_id', 'u.user_id')
      .where('r.recipe_id', recipe_id)
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
  addIngredient(knex, ingredient) {
    return knex('ingredients')
      .select('*')
      .where({ ingredient_name: ingredient })
      .then(item => {
        if (item.length === 0) {
          return knex
            .insert({ ingredient_name: ingredient })
            .into('ingredients')
            .returning('id')
            .then(([item]) => item)
        } else {
          return item[0].id
        }
      })
      .catch(err => console.log(err))
  },
  addMeasurement(knex, measurement) {
    return knex('measurements')
      .select('*')
      .where({ measurement_name: measurement })
      .then(item => {
        if (item.length === 0) {
          return knex
            .insert({ measurement_name: measurement })
            .into('measurements')
            .returning('id')
            .then(([item]) => item)
        } else {
          return item[0].id
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
  deleteRecipeIngredients(knex, recipe_id) {
    return knex('recipeingredients')
      .where({ recipe_id })
      .delete()
      .catch(err => console.log(err))
  },
  updateRecipe(knex, recipe_id, newFields) {
    return knex('recipes')
      .where({ recipe_id })
      .update(newFields)
      .catch(err => console.log(err))
  },
}

module.exports = recipesService;