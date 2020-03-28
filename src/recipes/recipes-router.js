const path = require('path');
const express = require('express');
const xss = require('xss');
const { requireAuth } = require('../middleware/jwt-auth');
const recipesService = require('./recipes-service.js');

const recipesRouter = express.Router();
const jsonParser = express.json();

const serializeRecipe = recipe => ({
  id: recipe.recipe_id,
  user_id: recipe.user_id,
  title: xss(recipe.title),
  recipe_description: xss(recipe.recipe_description),
  instructions: xss(recipe.instructions)
});

const serializeIngredients = ingredient => ({
  id: ingredient.id,
  ingredient_name: xss(ingredient.ingredient_name),
  quantity: ingredient.quantity,
  measurement: ingredient.measurement_name
})

recipesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    recipesService.getAllRecipes(knexInstance)
      .then(recipe => {
        res.json(recipe.map(serializeRecipe))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const { title, recipe_description, instructions, ingredients } = req.body
    const newRecipe = { title, recipe_description, instructions }
    for(const [key, value] of Object.entries(newRecipe))
      if(value == null) {
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
      }
    
    newRecipe.user_id = 1 // req.user_id;
    /* NOTES: 
    * need to get id's for ingredients and measurements after create recipe, store recipeId and
    * then pass that info into addRecipeIngredients for each ingredient
    * as this stands it will post the recipe but the recipeIngredients are not being posted. Right now 
    * getting unhandled promise rejection error.
    * previous console.logs seemed to indicate the addIngredient() and addMeasurement() methods
    * were hanging and not returning Id's as intended.
    */

    recipesService.createRecipe(
      knexInstance,
      newRecipe
    )
      .then(recipe => {
        res.status(201).location(path.posix.join(req.originalUrl, `/${recipe.recipe_id}`))
          .json(serializeRecipe(recipe))
      })
      .then(recipe => {
        ingredients.map(async function(item) {
          const ingredient = await function(item) {
            recipesService.addIngredient(knexInstance, item.name)
          }
          const measurement = await function(item) {
            recipesService.addMeasurement(knexInstance, item.unit)
          }
          const newReferences = {
            recipe_id: recipe.id,
            ingredient_id: ingredient,
            measure_id: measurement,
            quantity: item.quantity
          }
          recipesService.addRecipeIngredients(
            knexInstance,
            newReferences
          )
        })
      })
      .catch(next)
  })

recipesRouter
  .route('/:recipe_id')
  .all((req, res, next) => {
    recipesService.getRecipeById(
      req.app.get('db'),
      req.params.recipe_id
    )
    .then(recipe => {
      if(!recipe) {
        return res.status(404).json({
          error: { message: `Recipe doesn't exist` }
        })
      }
      res.recipe = recipe
      next()
    })
    .catch(next)
  },
  (req, res, next) => {
    recipesService.getIngredientsForRecipe(
      req.app.get('db'),
      req.params.recipe_id
    )
    .then(ingredients => {
        if(!ingredients) {
          return res.status(404).json({
            error: { message: `Ingredients doesn't exist` }
          })
        }
        res.ingredients = ingredients
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.status(200).json({
      recipe: serializeRecipe(res.recipe), 
      ingredients: res.ingredients.map(ingredient => serializeIngredients(ingredient)
    )})
  })
  .delete(requireAuth, (req, res, next) => {
    recipesService.deleteRecipe(
      req.app.get('db'),
      req.params.recipe_id
    )
    .then(rows => {
      res.status(204).end()
    })
    .catch(next)
  })
  .patch(requireAuth, jsonParser, (req, res, next) => {
    const { title, description, instructions, ingredients } = req.body
    const recipeToUpdate = { title, description, instructions, ingredients }

    const numberOfValues = Object.values(recipeToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'title', 'description', 'instructions' or 'ingredients'`
        }
      })

    recipeService.updateRecipe(
      req.app.get('db'),
      req.params.recipe_id,
      recipeToUpdate
    )
      .then(rows => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = recipesRouter;