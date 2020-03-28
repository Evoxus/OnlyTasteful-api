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
    const { title, description, instructions } = req.body
    const newRecipe = { title, description, instructions }
    for(const [key, value] of Object.entries(newRecipe))
      if(value == null) {
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
          .json(recipe.map(recipe => serializeRecipe(recipe)))
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