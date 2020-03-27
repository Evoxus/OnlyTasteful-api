const recipesService = {
  getAllRecipes(knex) {
    return knex.select('*').from('recipes').catch(err => console.log(err))
  },
}