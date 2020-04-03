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

      it(`responds with 200 and all recipes`, () => {
        const expectedResult = testRecipes.map((recipe, idx) => helpers.makeExpectedRecipe(recipe, idx + 1))
        return supertest(app)
          .get('/api/recipes')
          .expect(200, expectedResult)
      })
    })
  })

  describe.only(`GET /api/recipe/:recipe_id`, () => {
    context('Given there are recipe in the database', () => {
      beforeEach('insert recipe', () =>
        helpers.seedRecipeTables(
          db,
          testUsers,
          testRecipes,
          testIngredients,
          testMeasurements,
          testRelations,
        )
      )
      it(`responds with 404`, () => {
        const recipeId = 123456
        return supertest(app)
          .get(`/api/recipes/${recipeId}`)
          .expect(404, { error: `Recipe doesn't exist` })
      })

      it('responds with 200 and the specified recipe', () => {
        const recipeId = 2
        const expectedRecipe =
        {
          recipe: helpers.makeExpectedRecipe(
            testRecipes[1],
            2
          ),
          ingredients: [
            {
              ingredient_name: 'Food',
              quantity: '2',
              measurement: 'Unit'
            }
          ]
        }

        return supertest(app)
          .get(`/api/recipes/${recipeId}`)
          .expect(200, expectedRecipe)
      })
    })
  })
  // TODO: need create, update, and delete
})

