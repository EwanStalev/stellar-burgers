import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

interface IinitialState {
  isAuth: boolean;
  isLoading: boolean;
  error: string | null;
  user: TUser | null;
}

const initialState: IinitialState = {
  isAuth: false,
  isLoading: false,
  error: null,
  user: null
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  (data: TRegisterData) => registerUserApi(data)
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  (data: TRegisterData) => updateUserApi(data)
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  (data: TLoginData) => loginUserApi(data)
);

export const logoutUser = createAsyncThunk('auth/logoutUser', logoutApi);
export const getUser = createAsyncThunk('auth/getUser', getUserApi);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.user = action.payload.user;

      state.isAuth = true;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = 'Произошла ошибка';
      state.isAuth = false;
      state.user = null;
    });

    builder.addCase(loginUser.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.user = action.payload.user;

      state.isAuth = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = 'Произошла ошибка';
      state.isAuth = false;
      state.user = null;
    });

    builder.addCase(logoutUser.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(logoutUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.isAuth = false;
      state.user = null;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = 'Произошла ошибка';
      state.isAuth = false;
      state.user = null;
    });

    builder.addCase(getUser.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.isAuth = true;
      state.user = action.payload.user;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = 'Произошла ошибка';
      state.isAuth = false;
      state.user = null;
    });

    builder.addCase(updateUser.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.user = action.payload.user;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = 'Произошла ошибка';
    });
  }
});

export const {} = authSlice.actions;

export const authReducer = authSlice.reducer;
