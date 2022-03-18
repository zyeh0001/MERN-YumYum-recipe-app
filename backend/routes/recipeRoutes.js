const express = require('express');
const router = express.Router();

const {
  getRecipes,
  createRecipe,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
} = require('../controller/recipeController');

const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getRecipes).post(protect, createRecipe);

router
  .route('/:id')
  .get(getRecipe)
  .delete(protect, deleteRecipe)
  .put(protect, updateRecipe);

router.route('/search/recipe').post(searchRecipes);

module.exports = router;
