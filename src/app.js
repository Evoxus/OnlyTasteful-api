require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const recipesRouter = require('./recipes/recipes-router');
const { NODE_ENV, CLIENT_ORIGIN } = require('./config');

// TODO: Build GET /api/recipes endpoint
// TODO: Build GET /api/recipes/:recipeId endpoint
// TODO: Build POST /api/auth/login endpoint
// TODO: Build POST /api/users endpoint
// TODO: Build POST /api/recipes endpoint (protected)
// TODO: Build PATCH /api/recipes/:recipeId endpoint (protected)
// TODO: Build DELETE /api/recipes/:recipeId endpoint (protected)


const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors({
    origin: CLIENT_ORIGIN
}));

// ROUTERS

app.use('/recipes', recipesRouter);

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
});

module.exports = app