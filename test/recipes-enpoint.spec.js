const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Recipes Endpoints', function () {
  let db

  const {
    testRecipes,
    testUsers,
    testIngredients,
    testMeasurements,
    testRelations,
  } = helpers.makeRecipeFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`GET /api/recipes`, () => {
    context(`Given no recipes`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/recipes')
          .expect(200, [])
      })
    })
    context(`Given recipes`, () => {
      beforeEach('insert recipes into db', () =>
        helpers.seedRecipeTables(
          db,
          testUsers,
          testRecipes,
          testIngredients,
          testMeasurements,
          testRelations,
        )
      )

      it.only(`responds with 200 and all recipes`, () => {
        const expectedResult = testRecipes.map((recipe, idx) => helpers.makeExpectedRecipe(recipe, idx + 1))
        return supertest(app)
          .get('/api/recipes')
          .expect(200, expectedResult)
      })
    })
  })
})

