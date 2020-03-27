const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Recipes Endpoints', function() {
  let db

  const {
    testRecipes,
    testUsers,
  } = helpers.makeRecipesFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
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
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, [])
      })
    })

}