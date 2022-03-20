import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

//Get user from localStorage if exist
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ? user : null,
  username: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

//register user
export const register = createAsyncThunk(
  'auth/register',
  async (user, thunkAPI) => {
    try {
      return await authService.register(user);
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

//login user
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

//logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

//get username
export const getUsername = createAsyncThunk(
  'auth/username',
  async (id, thunkAPI) => {
    try {
      return await authService.getUsername(id);
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

//get username
export const getUserFav = createAsyncThunk(
  'auth/getUserFav',
  async (id, thunkAPI) => {
    try {
      return await authService.getUserFav(id);
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

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getUsername.pending, (state) => {
        state.isLoading = true;
        // state.username = null;
      })
      .addCase(getUsername.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.username = action.payload;
      })
      .addCase(getUsername.rejected, (state, action) => {
        state.isLoading = false;
        state.username = null;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getUserFav.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserFav.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user.favCollection = action.payload;
      })
      .addCase(getUserFav.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
