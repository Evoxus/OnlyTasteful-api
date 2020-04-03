require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV, CLIENT_ORIGIN } = require('./config');
const recipesRouter = require('./recipes/recipes-router');
const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');

const app = express();

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
const allowedOrigins = ['http://localhost:3000', 'https://only-tasteful.now.sh/']
app.use(cors(
  // {
  //   origin: function (origin, callback) {
  //     if (!origin) return callback(null, true);
  //     if (allowedOrigins.indexOf(origin) === -1) {
  //       const msg = 
  //       'The CORS policy for this site does not allow access from the specified Origin.';
  //       return callback(new Error(msg), false);
  //     }
  //     return callback(null, true);
  //   }
  // }
));

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