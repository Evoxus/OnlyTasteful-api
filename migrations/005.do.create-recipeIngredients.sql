CREATE TABLE recipeIngredients (
  recipe_id INTEGER REFERENCES recipes (recipe_id),
  ingredient_id INTEGER REFERENCES ingredients (id),
  measure_id INTEGER REFERENCES measurements (id),
  quantity INTEGER NOT NULL
);