BEGIN;

TRUNCATE
  users,
  recipes,
  ingredients,
  measurements,
  recipeIngredients
  RESTART IDENTITY CASCADE;

INSERT INTO users (user_name, password, full_name) VALUES
('demo', '$2b$12$UAZpzmcYQ2MPKoaSCRZeGOduDQpt93Ds82TZI.XWux8WxRNoIVPLK', 'John Doe');

INSERT INTO recipes (user_id, title, recipe_description, instructions) VALUES
  (1, 'Spahgetti', 'My take on spahgetti', 
    'In large pot, simmer 2 large jars of plain spaghetti sauce.
      In separate large skillet, melt 2 Tbl butter, sautee chopped onion (1 whole) and galic (4-6 cloves). 
      When onion starts to turn clear, add the chopped bell peppers (1 red, 1 green, 1 yellow), jalepeno (2), 
      serrano (1), mushrooms (1 package), green onion. 
      Continue sauteeing for about 5 minutes.
      Add meat, season with salt, pepper, garlic powder, and brown thoroughly.
      Add a dash of cinnamon to sauce. 
      After browning the meat, add to sauce and simmer all together, the longer the better.'),
  (1, 'Veggie Chilli', 'A real, chunky, chili, without the meat. The right consistency to please your typical meat chili eater or the vegetarian looking for real chili.',
    'Start by bringing the veggie stock to a boil. 
      Pour in the pearl barley. 
      Bring back to a boil then lower heat to a simmer until most of the stock has been absorbed. 
      Usually this takes about as long as the next part of the prep for me.
      Chop all the veggies and slice the mushrooms. 
      Pour the 1/2 Tbs. ancho chili powder, red chili powder, cumin, oregano, parsley, and crushed red pepper into a pan with the 1 Tbs. olive oil, 3oz liquid aminos, and 1 can tomato paste. 
      Stir together under low-med heat for about 2 min. 
      Dump in the package of sliced mushrooms, 1 chopped onion, 2 chopped carrots, 4 minced cloves of garlic and 2 chopped jalapenos and stir together for about 4-5 min.
      Pour all three cans of beans into a colander and rinse. Dump these into a Dutch oven or other large pot. 
      Turn heat to low-med, dump in the veggies from the pan into the pot as well and stir all together with the other can of tomato paste and tomato sauce.  
      When barley and veggie stock has cooked down to very little liquid left (you still want some, if you don’t add some) pour this into the mix. 
      Pour in the beer of your choice, stir well, and let simmer for at least 30 min. 
      Add seasonings to taste.
      Garnish with some chopped onion and shredded cheese if you want.');

INSERT INTO ingredients (ingredient_name) VALUES
  ('Hamburger'),             -- 1
  ('Pasta'),                 -- 2
  ('Jalapeno'),              -- 3
  ('Bell peppers: 1 red, 1 orange, 1 green'), --4
  ('Mushrooms'),             -- 5
  ('Green Onions'),          -- 6
  ('Serrano pepper'),        -- 7
  ('Prego sauce'),           -- 8
  ('Cinnamon'),              -- 9
  ('Onion'),                 -- 10
  ('Carrot'),                -- 11
  ('Garlic'),                -- 12
  ('Mushrooms, chopped'),    -- 13
  ('Jalapenos, chopped'),    -- 14
  ('Roasted Tomatoes'),      -- 15
  ('Unsalted tomato paste'), -- 16
  ('Unsalted kidney beans'), -- 17
  ('Unsalted garbanzo beans'), -- 18
  ('Unsalted black beans'),  -- 19
  ('Ancho chili powder'),    -- 20
  ('Red chili powder'),      -- 21
  ('Cumin'),                 -- 22
  ('Oregano'),               -- 23
  ('Parsley'),               -- 24
  ('Crushed red pepper'),    -- 25
  ('Liquid Aminos'),         -- 26
  ('Olive oil'),             -- 27
  ('Vegetable stock'),       -- 28
  ('Pearl barley'),          -- 29
  ('Dark beer');             -- 30

INSERT INTO measurements (measurement_name) VALUES
  ('Cloves'),      -- 1
  ('16 oz can'),   -- 2
  ('6 oz can'),    -- 3
  ('Can'),         -- 4
  ('Oz'),          -- 5
  ('Tablespoon'),  -- 6
  ('Cups'),        -- 7
  ('Large bottle'),-- 8
  ('Lbs'),         -- 9
  ('Box'),         -- 10
  ('Bunch'),       -- 11
  ('Jars'),        -- 12
  ('Dash');        -- 13

INSERT INTO recipeIngredients (recipe_id, ingredient_id, measure_id, quantity) VALUES
  (1, 1, 9, 3),
  (1, 2, 10, 1),
  (1, 3, NULL, 2),
  (1, 4, NULL, 3),
  (1, 10, NULL, 1),
  (1, 12, 1, 5),
  (1, 5, 5, 16),
  (1, 6, 11, 1),
  (1, 7, NULL, 2),
  (1, 8, 12, 2),
  (1, 9, 13, 1),
  (2, 10, NULL, 1),
  (2, 11, NULL, 1),
  (2, 12, 1, 4),
  (2, 13, 5, 16),
  (2, 14, NULL, 2),
  (2, 15, 2, 1),
  (2, 16, 3, 2),
  (2, 17, 4, 1),
  (2, 18, 4, 1),
  (2, 19, 4, 1),
  (2, 20, 6, 0.5),
  (2, 21, 6, 0.5),
  (2, 22, 6, 0.5),
  (2, 23, 6, 0.5),
  (2, 24, 6, 0.5),
  (2, 25, 6, 0.5),
  (2, 26, 5, 3),
  (2, 27, 6, 1),
  (2, 28, 7, 3),
  (2, 29, 7, 1.5),
  (2, 30, 8, 1);

COMMIT;