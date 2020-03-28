require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV, CLIENT_ORIGIN } = require('./config');
const recipesRouter = require('./recipes/recipes-router');
const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');

// TODO: Build GET /api/recipes endpoint, setup but not selecting properly
// TODO: Build GET /api/recipes/:recipeId endpoint, router setup but need to figure out joining
// TODO: Build POST /api/recipes endpoint (protected) Basic setup, service needs correcting
// TODO: Build PATCH /api/recipes/:recipeId endpoint (protected) 
// TODO: Build DELETE /api/recipes/:recipeId endpoint (protected) Basic setup, service may need correcting


const app = express();

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors({
    origin: CLIENT_ORIGIN
}));

// ROUTERS
app.use('/api/recipes', recipesRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

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