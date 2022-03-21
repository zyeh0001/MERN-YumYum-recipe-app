import axios from 'axios';
const API_URL = '/api/recipes';
const spoonacular_url = 'https://api.spoonacular.com/recipes';

//create new recipe
const createRecipe = async (recipeData, token) => {
  localStorage.removeItem('profile');
  //set up jwt
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, recipeData, config);
  return response.data;
};

//get recipes
const getRecipes = async (token) => {
  const check = localStorage.getItem('profile');
  if (check) {
    return JSON.parse(check);
  } else {
    //set up jwt
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(API_URL, config);
    localStorage.setItem('profile', JSON.stringify(response.data));
    return response.data;
  }
};

//get single recipe from backend or api
const getRecipe = async (recipeId) => {
  const response = await axios.get(`${API_URL}/${recipeId}`);

  if (!response.data.title) {
    const resFromSpoon = await axios.get(
      `${spoonacular_url}/${recipeId}/information?apiKey=${process.env.REACT_APP_RECIPE_API_KEY}`
    );
    return resFromSpoon.data;
  }

  return response.data;
};

//delete backend recipe by recipe id
const deleteRecipe = async (recipeId, token) => {
  localStorage.removeItem('profile');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(`${API_URL}/${recipeId}`, config);
  return response.data;
};

//delete recipe from user favorite collection by recipe id
const deleteFavRecipe = async (recipeId, token) => {
  localStorage.removeItem('favorite');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(`${API_URL}/fav/${recipeId}`, config);
  return response.data;
};

//update backend recipe by recipe id
const updateRecipe = async (recipeData, token) => {
  localStorage.removeItem('profile');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(
    `${API_URL}/${recipeData._id}`,
    recipeData,
    config
  );
  return response.data;
};

//add recipe to user favCollection
const addToUserFav = async (recipeData, token) => {
  localStorage.removeItem('favorite');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(
    `${API_URL}/${recipeData._id}`,
    recipeData,
    config
  );
  return response.data;
};

//get user favCollection
const getUserFav = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/fav/${userId}`, config);
  return response.data;
};

//search recipe from spoonacular api
const searchRecipes = async (searchText) => {
  var params = new URLSearchParams();
  params.append('text', searchText.text);
  const resFromMongo = await axios.post(`${API_URL}/search/recipe`, params);
  let numbers;
  if (searchText.limit > resFromMongo.data.length) {
    numbers = searchText.limit - resFromMongo.data.length;
  } else {
    numbers = 0;
  }

  const resFromSpoon = await axios.get(
    `${spoonacular_url}/complexSearch?apiKey=${process.env.REACT_APP_RECIPE_API_KEY}&query=${searchText.text}&number=${numbers}`
  );
  return resFromMongo.data.concat(resFromSpoon.data.results);
};

//fetch recipe detail from spoonacular
const getRecipeDetail = async (recipeId) => {
  const response = await axios.get(
    `${spoonacular_url}/${recipeId}/information?apiKey=${process.env.REACT_APP_RECIPE_API_KEY}`
  );
  return response.data;
};

const recipeService = {
  createRecipe,
  getRecipe,
  getRecipes,
  searchRecipes,
  getRecipeDetail,
  deleteRecipe,
  updateRecipe,
  addToUserFav,
  deleteFavRecipe,
  getUserFav,
};
export default recipeService;
