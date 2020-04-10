const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Recipes Endpoints', function () {
  let db;

  const {
    testRecipes,
    testUsers,
    testIngredients,
    testMeasurements,
    testRelations,
  } = helpers.makeRecipeFixtures();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe(`GET /api/recipes`, () => {
    context(`Given no recipes`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get('/api/recipes').expect(200, []);
      });
    });
    context(`Given recipes`, () => {
      beforeEach('insert recipes into db', () =>
        helpers.seedRecipeTables(
          db,
          testUsers,
          testRecipes,
          testIngredients,
          testMeasurements,
          testRelations
        )
      );

      it(`responds with 200 and all recipes`, () => {
        const expectedResult = testRecipes.map((recipe, idx) =>
          helpers.makeExpectedRecipe(recipe, idx + 1)
        );
        return supertest(app).get('/api/recipes').expect(200, expectedResult);
      });
    });
  });

  describe(`GET /api/recipe/:recipe_id`, () => {
    context('Given there are recipe in the database', () => {
      beforeEach('insert recipe', () =>
        helpers.seedRecipeTables(
          db,
          testUsers,
          testRecipes,
          testIngredients,
          testMeasurements,
          testRelations
        )
      );
      it(`responds with 404`, () => {
        const recipeId = 123456;
        return supertest(app)
          .get(`/api/recipes/${recipeId}`)
          .expect(404, { error: `Recipe doesn't exist` });
      });

      it('responds with 200 and the specified recipe', () => {
        const recipeId = 2;
        const expectedRecipe = {
          recipe: helpers.makeExpectedRecipe(testRecipes[1], 2),
          ingredients: [
            {
              ingredient_name: 'Food',
              quantity: '2',
              measurement: 'Unit',
            },
          ],
        };
        return supertest(app).get(`/api/recipes/${recipeId}`).expect(200, expectedRecipe);
      });
    });
  });

  describe(`POST /api/recipes`, () => {
    beforeEach(`insert users`, () => helpers.seedUsers(db, testUsers));

    it('creates new recipe responding with 201', () => {
      const testUser = testUsers[0];
      const newRecipe = {
        user_id: 1,
        title: 'testTitle',
        recipe_description: 'testDescription',
        instructions: 'testInstructions',
        ingredients: {
          ingredient_name: 'food',
          measurement: 'unit',
          quantity: 1,
        },
      };
      return supertest(app)
        .post('/api/recipes')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(newRecipe)
        .expect(201)
        .expect((res) => {
          expect(res.body).to.have.property('id');
          expect(res.body.title).to.eql(newRecipe.title);
          expect(res.body.recipe_description).to.eql(newRecipe.recipe_description);
          expect(res.body.instructions).to.eql(newRecipe.instructions);
          expect(res.body.user_id).to.eql(testUser.user_id);
          expect(res.headers.location).to.eql(`/api/recipes/${res.body.id}`);
        })
        .expect((res) =>
          db
            .from('recipes')
            .select('*')
            .where({ recipe_id: res.body.recipe_id })
            .first()
            .then((row) => {
              expect(row.title).to.eql(newRecipe.title);
              expect(row.recipe_description).to.eql(newRecipe.recipe_description);
              expect(row.instructions).to.eql(newRecipe.instructions);
              expect(row.user.user_id).to.eql(testUser.user_id);
            })
        );
    });
  });

  describe(`PATCH /api/recipes/:recipe_id`, () => {
    beforeEach('insert recipe', () =>
      helpers.seedRecipeTables(
        db,
        testUsers,
        testRecipes,
        testIngredients,
        testMeasurements,
        testRelations
      )
    );
    it(`updates recipe and responds with 204`, () => {
      const recipeId = 2;
      const updateRecipe = {
        title: 'updateTitle',
        recipe_description: 'updateDescription',
        instructions: 'updateInstructions',
        ingredients: [
          {
            ingredient_name: 'food',
            measurement: 'unit',
            quantity: 1,
          },
        ],
      };
      const expectedRecipe = {
        recipe: helpers.makeExpectedRecipe(updateRecipe, 2),
        ingredients: [
          {
            ingredient_name: 'Food',
            quantity: '2',
            measurement: 'Unit',
          },
        ],
      };
      return supertest(app)
        .patch(`/api/recipes/${recipeId}`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
        .send(updateRecipe)
        .expect(204)
        .expect((res) =>
          db
            .from('recipes')
            .select('*')
            .where({ recipe_id: recipeId })
            .first()
            .then((row) => {
              expect(row.title).to.eql(expectedRecipe.title);
              expect(row.recipe_description).to.eql(expectedRecipe.recipe_description);
              expect(row.instructions).to.eql(expectedRecipe.instructions);
            })
        );
    });
  });

  describe(`DELETE /api/recipe/:recipe_id`, () => {
    // Not sure why after each not functioning properly here
    // but ensuring cleanup fixed
    before('cleanup', () => helpers.cleanTables(db));

    beforeEach('insert recipe', () =>
      helpers.seedRecipeTables(
        db,
        testUsers,
        testRecipes,
        testIngredients,
        testMeasurements,
        testRelations
      )
    );
    it(`deletes recipe responding with 204`, () => {
      const recipeId = 2;
      return supertest(app)
        .delete(`/api/recipes/${recipeId}`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
        .expect(204)
        .expect((res) =>
          db
            .from('recipes')
            .select('*')
            .where({ recipe_id: recipeId })
            .first()
            .then((row) => {
              expect(row.length === 0);
            })
        );
    });
  });
});
