const express = require('express');
const router = express.Router();

const {
  getRecipes,
  createRecipe,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
  addToFav,
  deleteFavItem,
  getUserFav,
} = require('../controller/recipeController');

const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getRecipes).post(protect, createRecipe);

router
  .route('/:id')
  .get(getRecipe)
  .delete(protect, deleteRecipe)
  .put(protect, updateRecipe)
  .post(protect, addToFav);

router.route('/search/recipe').post(searchRecipes);
router.delete('/fav/:id', protect, deleteFavItem);
router.get('/fav/:id', protect, getUserFav);

module.exports = router;
