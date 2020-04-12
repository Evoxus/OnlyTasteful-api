const path = require('path');
const express = require('express');
const xss = require('xss');
const { requireAuth } = require('../middleware/jwt-auth');
const recipesService = require('./recipes-service.js');

const recipesRouter = express.Router();
const jsonParser = express.json();

const serializeRecipe = (recipe) => ({
  id: recipe.recipe_id,
  user_id: recipe.user_id,
  user_name: xss(recipe.user_name),
  title: xss(recipe.title),
  recipe_description: xss(recipe.recipe_description),
  instructions: xss(recipe.instructions),
});

const serializeIngredients = (ingredient) => ({
  id: ingredient.id,
  ingredient_name: xss(ingredient.ingredient_name),
  quantity: xss(ingredient.quantity),
  measurement: xss(ingredient.measurement_name),
});

recipesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    recipesService
      .getAllRecipes(knexInstance)
      .then((recipes) => {
        res.json(recipes.map(serializeRecipe));
      })
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const { title, recipe_description, instructions, ingredients } = req.body;
    const newRecipe = { title, recipe_description, instructions };
    // Validate presence of needed values for new recipe
    for (const [key, value] of Object.entries(newRecipe))
      if (value == null) {
        return res.status(400).json({
          error: `Missing '${key}' in request body`,
        });
      }
    // Attach the logged in user to the new recipe
    newRecipe.user_id = req.user.user_id;
    // Post to the DB and return the Id of the new recipe
    recipesService
      .createRecipe(knexInstance, newRecipe)
      .then((recipe) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${recipe.recipe_id}`))
          .json(serializeRecipe(recipe));
        return recipe;
      })
      .then((recipe) => {
        // Check if the ingredients & measurements are already in the DB
        // Adding them if not and returning the Id in either case
        ingredients.map(function (item) {
          Promise.all([
            recipesService.addIngredient(knexInstance, item.ingredient_name),
            recipesService.addMeasurement(knexInstance, item.measurement),
          ])
            .then((response) => {
              // Take those Ids and pass into the reference table along with quantities
              const newReferences = {
                recipe_id: recipe.recipe_id,
                ingredient_id: response[0],
                measure_id: response[1],
                quantity: item.quantity,
              };
              recipesService.addRecipeIngredients(knexInstance, newReferences);
            })
            .catch((err) => console.log(err));
        });
      })
      .catch(next);
  });

recipesRouter
  .route('/:recipe_id')
  .all(checkRecipeExists)
  .all((req, res, next) => {
    recipesService
      .getIngredientsForRecipe(req.app.get('db'), req.params.recipe_id)
      .then((ingredients) => {
        if (!ingredients) {
          return res.status(404).json({
            error: { message: `Ingredients doesn't exist` },
          });
        }
        res.ingredients = ingredients;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.status(200).json({
      recipe: serializeRecipe(res.recipe),
      ingredients: res.ingredients.map((ingredient) => serializeIngredients(ingredient)),
    });
  })
  .delete(requireAuth, (req, res, next) => {
    recipesService
      .deleteRecipeIngredients(req.app.get('db'), parseInt(req.params.recipe_id))
      .then(recipesService.deleteRecipe(req.app.get('db'), parseInt(req.params.recipe_id)))
      .then((rows) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(requireAuth, jsonParser, (req, res, next) => {
    const { title, recipe_description, instructions, ingredients } = req.body;
    const recipeToUpdate = { title, recipe_description, instructions };
    const numberOfValues = Object.values(recipeToUpdate).filter(Boolean).length;
    // Validate existence of recipe data
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'title', 'description', 'instructions' or 'ingredients'`,
        },
      });
    if (ingredients.length === 0)
      return res.status(400).json({
        error: {
          message: `Request must contain at least 1 ingredient`,
        },
      });
    Promise.all([
      recipesService.updateRecipe(req.app.get('db'), req.params.recipe_id, recipeToUpdate),
      // Clear relation table before rebuilding
      // (Interviewer suggested this may be why we have to timeout before loading on client side)
      recipesService.deleteRecipeIngredients(req.app.get('db'), req.params.recipe_id),
    ])
      .then((response) => {
        ingredients.map((ingredient) => {
          Promise.all([
            // These both check for item and either add it if it doesn't exist or get the Id if it does
            recipesService.addIngredient(req.app.get('db'), ingredient.ingredient_name),
            recipesService.addMeasurement(req.app.get('db'), ingredient.measurement),
          ]).then((response) => {
            const update = {
              recipe_id: req.params.recipe_id,
              ingredient_id: response[0],
              measure_id: response[1],
              quantity: ingredient.quantity,
            };
            // Rebuilding the relations table
            recipesService.addRecipeIngredients(req.app.get('db'), update);
          });
        });
      })
      .then((rows) => {
        res.status(204).end();
      })
      .catch(next);
  });

async function checkRecipeExists(req, res, next) {
  try {
    await recipesService.getRecipeById(req.app.get('db'), req.params.recipe_id).then((recipe) => {
      if (!recipe)
        return res.status(404).json({
          error: `Recipe doesn't exist`,
        });

      res.recipe = recipe;
      next();
    });
  } catch (error) {
    next(error);
  }
}

module.exports = recipesRouter;
