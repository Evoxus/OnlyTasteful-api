module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://michael@localhost/only-tasteful',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000/',
  JWT_SECRET:process.env.JWT_SECRET || 'thegreenGoblinisnotcrazyatall',
}