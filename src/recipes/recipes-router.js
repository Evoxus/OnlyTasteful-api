const path = require('path');
const express = require('express');
const xss = require('xss');
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
  })
  .get((req, res, next) => {
    res.json(serializeRecipe(res.recipe))
  })

module.exports = recipesRouter;