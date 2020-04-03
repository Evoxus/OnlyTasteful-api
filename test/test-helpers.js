const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      user_id: 1,
      user_name: 'test-user-1',
      full_name: 'Test user 1',
      password: 'password',
    },
    {
      user_id: 2,
      user_name: 'test-user-2',
      full_name: 'Test user 2',
      password: 'password',
    },
    {
      user_id: 3,
      user_name: 'test-user-3',
      full_name: 'Test user 3',
      password: 'password',
    },
    {
      user_id: 4,
      user_name: 'test-user-4',
      full_name: 'Test user 4',
      password: 'password',
    },
  ]
}

function makeRecipeArray(users) {
  return [
    {
      recipe_id: 1,
      user_id: users[0].user_id,
      title: 'Recipe1',
      recipe_description: 'Test Recipe 1',
      instructions: 'Lorem ipsum dolor sit amet, consectetur'
    },
    {
      recipe_id: 2,
      user_id: users[1].user_id,
      title: 'Recipe2',
      recipe_description: 'Test Recipe 2',
      instructions: 'Lorem ipsum dolor sit amet, consectetur'
    },
    {
      recipe_id: 3,
      user_id: users[2].user_id,
      title: 'Recipe3',
      recipe_description: 'Test Recipe 3',
      instructions: 'Lorem ipsum dolor sit amet, consectetur'
    },
    {
      recipe_id: 4,
      user_id: users[3].user_id,
      title: 'Recipe4',
      recipe_description: 'Test Recipe 4',
      instructions: 'Lorem ipsum dolor sit amet, consectetur'
    },
  ]
}

function makeIngredientArray() {
  return [
    {
      id: 1,
      ingredient_name: 'Food',
    },
    {
      id: 2,
      ingredient_name: 'Food',
    },
    {
      id: 3,
      ingredient_name: 'Food',
    },
    {
      id: 4,
      ingredient_name: 'Food',
    },
  ]
}

function makeMeasurementArray() {
  return [
    {
      id: 1,
      measurement_name: 'Unit',
    },
    {
      id: 2,
      measurement_name: 'Unit',
    },
    {
      id: 3,
      measurement_name: 'Unit',
    },
    {
      id: 4,
      measurement_name: 'Unit',
    },
  ]
}

function makeRelationsArray(recipes, ingredients, measurements) {
  return [
    {
      recipe_id: recipes[0].recipe_id,
      ingredient_id: ingredients[0].id,
      measure_id: measurements[0].id,
      quantity: 2,
    },
    {
      recipe_id: recipes[1].recipe_id,
      ingredient_id: ingredients[1].id,
      measure_id: measurements[1].id,
      quantity: 2,
    },
    {
      recipe_id: recipes[2].recipe_id,
      ingredient_id: ingredients[2].id,
      measure_id: measurements[2].id,
      quantity: 2,
    },
    {
      recipe_id: recipes[3].recipe_id,
      ingredient_id: ingredients[3].id,
      measure_id: measurements[3].id,
      quantity: 2,
    },
  ]
}

function makeRecipeFixtures() {
  const testUsers = makeUsersArray()
  const testRecipes = makeRecipeArray(testUsers)
  const testIngredients = makeIngredientArray()
  const testMeasurements = makeMeasurementArray()
  const testRelations = makeRelationsArray(testRecipes, testIngredients, testMeasurements)
  return { testUsers, testRecipes, testIngredients, testMeasurements, testRelations }
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      users,
      recipes,
      ingredients,
      measurements,
      recipeIngredients
      RESTART IDENTITY CASCADE;`
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('users').insert(preppedUsers)
}

function seedRecipeTables(db, users, recipes, ingredients, measurements, relations) {
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('recipes').insert(recipes)
    await trx.into('ingredients').insert(ingredients)
    await trx.into('measurements').insert(measurements)
    await trx.into('recipeingredients').insert(relations)
  })
}

function makeExpectedRecipe(recipe, userNum) {
  return {
    id: recipe.recipe_id,
    title: recipe.title,
    recipe_description: recipe.recipe_description,
    instructions: recipe.instructions,
    user_id: recipe.user_id,
    user_name: `test-user-${userNum}`
  }
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makeRecipeArray,
  makeRecipeFixtures,
  makeExpectedRecipe,
  cleanTables,
  seedRecipeTables,
  seedUsers,
  makeAuthHeader,
}
