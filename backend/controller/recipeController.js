const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');
const Recipe = require('../models/recipeModel');

//@desc     Get all recipes for user
//@route    GET /api/recipes
//access    Private (access with json web token)
const getRecipes = asyncHandler(async (req, res) => {
  //get the user id in the JWT
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }
  const recipe = await Recipe.find({ user: req.user.id });
  res.status(200).json(recipe);

  //test
  //   res.send('getRecipes');
});

//@desc     Get all recipes by search text
//@route    GET /api/recipes/search/recipe
//access    public
const searchRecipes = asyncHandler(async (req, res) => {
  const s = req.body.text;
  console.log(s);
  const regex = new RegExp(s, 'i'); // i for case insensitive
  const recipes = await Recipe.find({ title: { $regex: regex } });
  res.status(200).json(recipes);

  //test
  // res.send('searchRecipes');
});

//@desc     Get single recipe
//@route    GET /api/recipes/:id
//access    Private (access with json web token)
const getRecipe = asyncHandler(async (req, res) => {
  //get the user id in the JWT
  // const user = await User.findById(req.user.id);
  // if (!user) {
  //   res.status(401);
  //   throw new Error('User not found');
  // }

  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404);
    throw new Error('Recipe not found');
  }
  // if (recipe.user.toString() !== req.user.id) {
  //   res.status(401);
  //   throw new Error('User Not Authorized');
  // }
  res.status(200).json(recipe);
});

//@desc     Create new recipe
//@route    PORT /api/recipes
//access    Private
const createRecipe = asyncHandler(async (req, res) => {
  const {
    title,
    summary,
    steps,
    servings,
    readyInMinutes,
    ingredients,
    image,
  } = req.body;
  if (
    !title ||
    !summary ||
    !steps ||
    !servings ||
    !readyInMinutes ||
    !ingredients ||
    !image
  ) {
    res.status(400);
    throw new Error('Please input all field');
  }

  // Get user using the id in the JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  const recipe = await Recipe.create({
    title,
    summary,
    user: req.user.id,
    steps,
    servings,
    readyInMinutes,
    ingredients,
    image,
  });

  res.status(201).json(recipe);
  //test
  //   res.send('createRecipes');
});

//@desc     add Recipe to user Fav collection
//@route    PORT /api/recipes/:id
//access    Private
const addToFav = asyncHandler(async (req, res) => {
  const {
    title,
    summary,
    steps,
    servings,
    readyInMinutes,
    ingredients,
    image,
  } = req.body;
  if (
    !title ||
    !summary ||
    !steps ||
    !servings ||
    !readyInMinutes ||
    !ingredients ||
    !image
  ) {
    res.status(400);
    throw new Error('Please input all field');
  }
  // Get user using the id in the JWT
  const favItem = {
    _id: req.params.id,
    title,
    summary,
    user: req.user.id,
    steps,
    servings,
    readyInMinutes,
    ingredients,
    image,
  };

  const user = await User.updateOne(
    { _id: req.user.id },
    { $push: { favCollection: favItem } }
  );
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }
  res.send(user);
});

//@desc     delete recipe from favCollection
//@route    /api/users/collection/:id
//access    Private (access with json web token)
const deleteFavItem = asyncHandler(async (req, res) => {
  // console.log('user id');
  // console.log(req.user.id);
  // console.log('param id');
  // console.log(req.params.id);
  const user = await User.updateOne(
    { _id: req.user.id },
    { $pull: { favCollection: { _id: req.params.id } } }
  );

  if (!user) {
    res.status(404);
    throw new Error('user not found');
  }

  res.status(200).json(user);
});

//@desc     Delete User recipe
//@route    DELETE /api/recipes/:id
//access    Private (access with json web token)
const deleteRecipe = asyncHandler(async (req, res) => {
  //get user id in JWT
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404);
    throw new Error('Recipe not found');
  }
  if (recipe.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User Not Authorized');
  }
  await recipe.remove();

  const updatedRecipe = await Recipe.find({ user: req.user.id });
  res.status(200).json(updatedRecipe);
});

//@desc     Update User Ticket
//@route    PUT /api/recipes/:id
//access    Private (access with json web token)
const updateRecipe = asyncHandler(async (req, res) => {
  //get the user id in the JWT
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }
  //get the recipe by user id
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    res.status(404);
    throw new Error('Recipe not found');
  }
  if (recipe.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User Not Authorized');
  }

  const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body);

  res.status(200).json(updatedRecipe);
});

module.exports = {
  getRecipes,
  getRecipe,
  createRecipe,
  deleteRecipe,
  updateRecipe,
  searchRecipes,
  addToFav,
  deleteFavItem,
};
