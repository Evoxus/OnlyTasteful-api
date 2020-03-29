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
  .post(requireAuth, jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const { title, recipe_description, instructions, ingredients } = req.body
    const newRecipe = { title, recipe_description, instructions }
    for (const [key, value] of Object.entries(newRecipe))
      if (value == null) {
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
      }

    newRecipe.user_id = req.user_id;

    recipesService.createRecipe(
      knexInstance,
      newRecipe
    )
      .then(recipe => {
        res.status(201).location(path.posix.join(req.originalUrl, `/${recipe.recipe_id}`))
          .json(serializeRecipe(recipe))
        return recipe
      })
      .then(recipe => {
        ingredients.map(function (item) {
          Promise.all([
            recipesService.addIngredient(knexInstance, item.name),
            recipesService.addMeasurement(knexInstance, item.unit)
          ])
            .then(response => {
              const newReferences = {
                recipe_id: recipe.recipe_id,
                ingredient_id: response[0],
                measure_id: response[1],
                quantity: item.quantity
              }
              recipesService.addRecipeIngredients(
                knexInstance,
                newReferences
              )
            })
            .catch(err => console.log(err))
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
        if (!recipe) {
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
          if (!ingredients) {
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
      )
    })
  })
  .delete((req, res, next) => { // requireAuth
    Promise.all([
      recipesService.deleteRecipeIngredients(
        req.app.get('db'),
        parseInt(req.params.recipe_id)
      ),
      recipesService.deleteRecipe(
        req.app.get('db'),
        parseInt(req.params.recipe_id)
      )
    ])
      .then(rows => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch( jsonParser, (req, res, next) => {  // requireAuth,
    const { title, description, instructions, ingredients } = req.body
    const recipeToUpdate = { title, description, instructions }
    const numberOfValues = Object.values(recipeToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'title', 'description', 'instructions' or 'ingredients'`
        }
      })
    Promise.all([
      recipesService.updateRecipe(
        req.app.get('db'),
        req.params.recipe_id,
        recipeToUpdate
      ),
      ingredients.map(ingredient => {
        Promise.all([
          recipesService.addIngredient(req.app.get('db'), ingredient.name),
          recipesService.addMeasurement(req.app.get('db'), ingredient.unit)
        ])
          .then(response => {
            const update = { ingredient_id: response[0], measure_id: response[1]}
            recipesService.updateRecipeIngredients(
              req.app.get('db'),
              req.params.recipe_id,
              update
            )
          })
      })
    ])
      .then(rows => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = recipesRouter;