import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import recipeService from './recipeService';

const initialState = {
  recipes: [],
  recipe: {},
  isError: false,
  createSuccess: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

//create new recipe
export const createRecipe = createAsyncThunk(
  'recipe/create',
  async (recipeData, thunkAPI) => {
    try {
      //Get the token for user in auth
      const token = thunkAPI.getState().auth.user.token;
      return await recipeService.createRecipe(recipeData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//update  recipe
export const updateRecipe = createAsyncThunk(
  'recipe/update',
  async (recipeData, thunkAPI) => {
    try {
      //Get the token for user in auth
      const token = thunkAPI.getState().auth.user.token;
      return await recipeService.updateRecipe(recipeData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//fetch all recipes
export const getRecipes = createAsyncThunk(
  'recipe/getAll',
  async (_, thunkAPI) => {
    try {
      //get the token from user in auth user
      const token = thunkAPI.getState().auth.user.token;

      return await recipeService.getRecipes(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//fetch single recipe
export const getRecipe = createAsyncThunk(
  'recipe/get',
  async (recipeId, thunkAPI) => {
    try {
      //get the token from user in auth user
      // const token = thunkAPI.getState().auth.user.token;

      return await recipeService.getRecipe(recipeId);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//delete single recipe
export const deleteRecipe = createAsyncThunk(
  'recipe/delete',
  async (recipeId, thunkAPI) => {
    try {
      //get the token from user in auth user
      const token = thunkAPI.getState().auth.user.token;

      return await recipeService.deleteRecipe(recipeId, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//search recipes from spoonacular api
export const searchRecipes = createAsyncThunk(
  'recipe/search',
  async (searchText, thunkAPI) => {
    try {
      console.log(searchText);
      return await recipeService.searchRecipes(searchText);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//search recipes from spoonacular api
export const getRecipeDetail = createAsyncThunk(
  'recipe/search',
  async (recipeId, thunkAPI) => {
    try {
      return await recipeService.getRecipeDetail(recipeId);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const recipeSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRecipe.pending, (state) => {
        state.isLoading = true;
        state.createSuccess = false;
        state.isSuccess = false;
      })
      .addCase(createRecipe.fulfilled, (state) => {
        state.createSuccess = true;
        state.isLoading = false;
      })
      .addCase(createRecipe.rejected, (state, action) => {
        state.isLoading = true;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(getRecipes.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(getRecipes.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.recipes = action.payload;
      })
      .addCase(getRecipes.rejected, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getRecipe.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(getRecipe.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.recipe = action.payload;
      })
      .addCase(getRecipe.rejected, (state, action) => {
        state.isLoading = true;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(searchRecipes.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(searchRecipes.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.recipes = action.payload;
      })
      .addCase(searchRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteRecipe.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.recipes = action.payload;
      })
      .addCase(deleteRecipe.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateRecipe.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.createSuccess = false;
      })
      .addCase(updateRecipe.fulfilled, (state, action) => {
        state.createSuccess = true;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(updateRecipe.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = recipeSlice.actions;
export default recipeSlice.reducer;
