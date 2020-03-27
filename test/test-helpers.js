const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      user_id: 1,
      user_name: 'test-user-1',
      full_name: 'Test user 1',
      password: 'password',
    },
    {
      user_id: 2,
      user_name: 'test-user-2',
      full_name: 'Test user 2',
      password: 'password',
    },
    {
      user_id: 3,
      user_name: 'test-user-3',
      full_name: 'Test user 3',
      password: 'password',
    },
    {
      user_id: 4,
      user_name: 'test-user-4',
      full_name: 'Test user 4',
      password: 'password',
    },
  ]
}

function makeRecipeArray(users) {
  return [
      {
        id: 1,
        title: 'Spaghetti',
        user_id: 1,
        description: 'My take on spaghetti. A mix of spice and sweet makes this dish a crowd pleaser.',
        ingredients: [
          {
            quantity: '2-3',
            unit: 'lbs',
            name: 'hamburger'
          },
          {
            quantity: '1',
            unit: 'box',
            name: 'pasta'
          },
          {
            quantity: 2,
            unit: '',
            name: 'jalapeno'
          },
          {
            quantity: 3,
            unit: '',
            name: 'bell peppers: 1 red, 1 orange, 1 green'
          },
          {
            quantity: 1,
            unit: '',
            name: 'onion'
          },
          {
            quantity: 5,
            unit: 'cloves',
            name: 'garlic'
          },
          {
            quantity: 16,
            unit: 'oz',
            name: 'mushrooms'
          },
          {
            quantity: 1,
            unit: 'bunch',
            name: 'green onions'
          },
          {
            quantity: 2,
            unit: '',
            name: 'Serrano pepper'
          },
          {
            quantity: 2,
            unit: 'jars',
            name: 'Prego sauce'
          },
          {
            quantity: 1,
            unit: 'dash',
            name: 'Cinnamon'
          },
        ],
        instructions:
          `
          In large pot, simmer 2 large jars of plain spaghetti sauce.
          In separate large skillet, melt 2 Tbl butter, sautee chopped onion (1 whole) and galic (4-6 cloves). 
          When onion starts to turn clear, add the chopped bell peppers (1 red, 1 green, 1 yellow), jalepeno (2), 
          serrano (1), mushrooms (1 package), green onion. Continue sauteeing for about 5 minutes.
          Add meat, season with salt, pepper, garlic powder, and brown thoroughly.
          Add a dash of cinnamon to sauce. After browning the meat, add to sauce and simmer all together, 
          the longer the better.
        `
      },
      {
        id: 2,
        title: 'Spinach and Artichoke Lasagna',
        user_id: 3,
        description: 'A great meal to make at the beginning of the week and eat leftovers throughout.',
        ingredients: [
          {
            quantity: 1,
            unit: '28 oz can',
            name: 'Diced tomatoes'
          },
          {
            quantity: 0.25,
            unit: 'cup',
            name: 'Fresh basil'
          },
          {
            quantity: 2,
            unit: 'tablespoons',
            name: 'olive oil'
          },
          {
            quantity: 2,
            unit: 'cloves',
            name: 'garlic'
          },
          {
            quantity: 0.25,
            unit: 'teaspoon',
            name: 'salt'
          },
          {
            quantity: 0.25,
            unit: 'teaspoon',
            name: 'Red pepper flakes'
          },
          {
            quantity: 16,
            unit: 'oz',
            name: 'Low fat cottage cheese'
          },
          {
            quantity: 1,
            unit: '',
            name: 'Red onion'
          },
          {
            quantity: 0.25,
            unit: 'teaspoon',
            name: 'Salt'
          },
          {
            quantity: 4,
            unit: 'cloves',
            name: 'Garlic'
          },
          {
            quantity: 1,
            unit: 'cup',
            name: 'Jarred artichokes'
          },
          {
            quantity: 12,
            unit: 'oz',
            name: 'Baby spinach'
          },
          {
            quantity: 'To taste',
            unit: '',
            name: 'Black pepper'
          },
          {
            quantity: 1,
            unit: 'box',
            name: 'No-boil lasagna noodles'
          },
          {
            quantity: 5,
            unit: 'oz',
            name: 'Mozzarella'
          },
        ],
        instructions:
          `
          Preheat oven to 425 degrees Fahrenheit. To prepare the tomato sauce, first pour the tomatoes into a 
          mesh sieve or fine colander and let them drain off excess juice for a minute. Transfer drained 
          tomatoes to the bowl of a food processor. Add the basil, olive oil, garlic, salt and pepper flakes. 
          Pulse the mixture about 10 times, until the tomatoes have broken down to an easily spreadable 
          consistency. Pour the mixture into a bowl for later (you should have about 2 cups sauce).
          Rinse out the food processor and return it to the machine. Pour half of the cottage cheese (1 cup) 
          into the processor and blend it until smooth, about 1 minute. Transfer the mixture to large mixing 
          bowl. No need to rinse out the bowl of the food processor this time; just put it back onto the machine 
          because you’ll need it later.
          Warm 2 tablespoons olive oil a large skillet over medium heat. Once the oil is shimmering, add the 
          chopped onion and ¼ teaspoon salt. Cook, stirring often, until the onion is tender and translucent, 
          about 4 to 5 minutes. Add the garlic and cook, stirring constantly, until fragrant, about 30 seconds.
          Add the artichoke to the skillet, then add a few large handfuls of spinach. Cook, stirring and tossing 
          frequently, until the spinach has wilted. Repeat with remaining spinach. Continue cooking for about 12 
          minutes, stirring frequently, until the spinach has dramatically reduce in volume and very little 
          moisture remains in the bottom of the pan.
          Transfer the spinach artichoke mixture to the bowl of the food processor and pulse until the contents 
          are finely chopped (but not puréed!), about 12 to 15 times. Transfer the mixture to the bowl of whipped 
          cottage cheese. Top with remaining cottage cheese and mix well. Season to taste with salt and pepper. 
          Now it’s lasagna assembly time!
          Spread ½ cup tomato sauce evenly over the bottom of an 8-by-8 or 9-by-9 inch square baker. Layer three 
          lasagna noodles on top, overlapping their edges as necessary. Spread half of the spinach mixture evenly 
          over the noodles. Top with ½ cup tomato sauce, then sprinkle ½ cup shredded cheese on top.
          Top with three more noodles, followed by the remaining spinach mixture. Sprinkle ½ cup shredded cheese 
          on top. (We’re skipping the tomato sauce in this layer.) Top with three more noodles, then spread the 
          remaining tomato sauce over the top so the noodles are evenly covered. Sprinkle evenly with 1 cup 
          shredded cheese.
          Wrap the lasagna with a layer of parchment paper over the top (or cover tightly with aluminum foil, 
          but don’t let the foil touch the cheese). Bake, covered, for 18 minutes, then remove the cover, 
          rotate the pan by 180 degrees and continue cooking for about 12 more minutes, until the top is 
          turning spotty brown. Remove from oven and let the lasagna cool for 15 minutes before sprinkling 
          with chopped basil and slicing.
        `
      },
      {
        id: 3,
        title: 'Cheesy Rice',
        user_id: 2,
        description: 'A great meal to make at the beginning of the week and eat leftovers throughout.',
        ingredients: [
          {
            quantity: 4,
            unit: 'tablespoons',
            name: 'Butter'
          },
          {
            quantity: 4,
            unit: 'cloves',
            name: 'Garlic'
          },
          {
            quantity: 0.25,
            unit: 'cup',
            name: 'Flour'
          },
          {
            quantity: 2,
            unit: 'cups',
            name: 'Milk'
          },
          {
            quantity: 1,
            unit: 'teaspoon',
            name: 'Dijon mustard'
          },
          {
            quantity: 0.5,
            unit: 'teaspoon',
            name: 'Salt and pepper'
          },
          {
            quantity: 2.5,
            unit: 'cups',
            name: 'Sharp cheddar cheese, shredded'
          },
          {
            quantity: 0.33,
            unit: 'cup',
            name: 'Parmesan cheese, shredded'
          },
          {
            quantity: 3,
            unit: 'cups',
            name: 'Cooked rice'
          },
          {
            quantity: '2-3',
            unit: 'cups',
            name: 'Cooked broccoli florets'
          },
        ],
        instructions:
          `
          1. Grease a 9x13-inch casserole pan. Preheat oven to 400 degrees F 
          2. In a large saucepan melt
          the butter over low heat. add garlic and saute
          until fragrant. Whisk in flour and cook 3-4 minutes. whisking constantly
          Slowly whisk in milk. mustard and season with salt and pepper, bring to
          a simmer 4 minutes, whisking occasionally. Add 2 cups of cheddar
          cheese and parmesan: Stir until mostly melted. remove from heat
          3. Stir in rice and broccoli florets, pour into casserole pan. sprinkle in remaining 1/2 cup cheese over top Bake 30 minutes 
          until bubbly lightly golden on top. Allow to set 5 minutes before serving
          `
      },
      {
        id: 4,
        title: 'Veggie Chilli',
        user_id: 1,
        description: 'A real, chunky, chili, without the meat. The right consistency to please your typical meat chili eater or the vegetarian looking for real chili.',
        ingredients: [
          {
            quantity: 1,
            unit: '',
            name: 'Onion'
          },
          {
            quantity: 2,
            unit: '',
            name: 'Carrot'
          },
          {
            quantity: 4,
            unit: 'cloves',
            name: 'Garlic'
          },
          {
            quantity: 16,
            unit: 'oz',
            name: 'Mushrooms, chopped'
          },
          {
            quantity: 2,
            unit: '',
            name: 'Jalapenos, chopped'
          },
          {
            quantity: 1,
            unit: '16 oz can',
            name: 'Roasted Tomatoes'
          },
          {
            quantity: 2,
            unit: '6 oz can',
            name: 'Unsalted tomato paste'
          },
          {
            quantity: 1,
            unit: 'can',
            name: 'Unsalted kidney beans'
          },
          {
            quantity: 1,
            unit: 'can',
            name: 'Unsalted garbanzo beans'
          },
          {
            quantity: 1,
            unit: 'can',
            name: 'Unsalted black beans'
          },
          {
            quantity: 0.5,
            unit: 'tablespoon',
            name: 'Ancho chili powder'
          },
          {
            quantity: 0.5,
            unit: 'tablespoon',
            name: 'Red chili powder'
          },
          {
            quantity: 0.5,
            unit: 'tablespoon',
            name: 'Cumin'
          },
          {
            quantity: 0.5,
            unit: 'tablespoon',
            name: 'Oregano'
          },
          {
            quantity: 0.5,
            unit: 'tablespoon',
            name: 'Parsley'
          },
          {
            quantity: 0.5,
            unit: 'tablespoon',
            name: 'Crushed red pepper'
          },
          {
            quantity: 3,
            unit: 'oz',
            name: 'Liquid Aminos'
          },
          {
            quantity: 1,
            unit: 'tablespoon',
            name: 'Olive oil'
          },
          {
            quantity: 3,
            unit: 'cups',
            name: 'Vegetable stock'
          },
          {
            quantity: 1.5,
            unit: 'cups',
            name: 'Pearl barley'
          },
          {
            quantity: 1,
            unit: 'large bottle',
            name: 'Dark beer'
          },
        ],
        instructions:
          `
          Start by bringing the veggie stock to a boil. Pour in the pearl barley. Bring back to a boil then lower heat to a simmer until 
          most of the stock has been absorbed. Usually this takes about as long as the next part of the prep for me.
          Chop all the veggies and slice the mushrooms. Pour the 1/2 Tbs. ancho chili powder, red chili powder, cumin, oregano, parsley, 
          and crushed red pepper into a pan with the 1 Tbs.olive oil, 3oz liquid aminos, and 1 can tomato paste. Stir together under 
          low-med heat for about 2 min. Dump in the package of sliced mushrooms, 1 chopped onion, 2 chopped carrots, 4 minced cloves of 
          garlic and 2 chopped jalapenos and stir together for about 4-5 min.
          Pour all three cans of beans into a colander and rinse. Dump these into a Dutch oven or other large pot. Turn heat to low-med, 
          dump in the veggies from the pan into the pot as well and stir all together with the other can of tomato paste and tomato sauce.  
          When barley and veggie stock has cooked down to very little liquid left (you still want some, if you don’t add some) pour this into 
          the mix. Pour in the beer of your choice, stir well, and let simmer for at least 30 min. Add seasonings to taste.
          Garnish with some chopped onion and shredded cheese if you want.
          `
      },
  ]
}

function makeRecipeFixtures() {
  const testUsers = makeUsersArray()
  const testRecipe = makeRecipeArray(testUsers)
  return { testUsers, testRecipe }
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      users,
      recipes,
      ingredients,
      measurements,
      recipeIngredients
      RESTART IDENTITY CASCADE;`
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('users').insert(preppedUsers)
}

function seedRecipeTables(db, users, recipes) {
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('recipes').insert(recipes)
  })
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makeRecipeArray,
  makeRecipeFixtures,
  cleanTables,
  seedRecipeTables,
  seedUsers,
  makeAuthHeader,
}
