import { getIngredientsApi, TIngredientsResponse } from '@api';
import { IngredientDetails } from '@components';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { error } from 'console';

interface IinitialState {
  ingredients: TIngredient[];
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  isIngredientsLoading: boolean;
  ingredientsError: string | null;
}

const initialState: IinitialState = {
  ingredients: [],
  buns: [],
  mains: [],
  sauces: [],
  isIngredientsLoading: false,
  ingredientsError: null
};

export const getAllIngredients = createAsyncThunk(
  'data/getAllIngredients',
  getIngredientsApi
);

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllIngredients.pending, (state, action) => {
      state.isIngredientsLoading = true;
      state.ingredientsError = null;
    });
    builder.addCase(getAllIngredients.fulfilled, (state, action) => {
      state.isIngredientsLoading = false;
      state.ingredientsError = null;
      state.buns = action.payload.filter(
        (ingredient) => ingredient.type === 'bun'
      );
      state.mains = action.payload.filter(
        (ingredient) => ingredient.type === 'main'
      );
      state.sauces = action.payload.filter(
        (ingredient) => ingredient.type === 'sauce'
      );
      state.ingredients = action.payload;
    });
    builder.addCase(getAllIngredients.rejected, (state, action) => {
      state.isIngredientsLoading = false;
      state.ingredientsError = 'произошла ошибкая';
      state.buns = [];
      state.mains = [];
      state.sauces = [];
      state.ingredients = [];
    });
  }
});

export const dataReducer = dataSlice.reducer;
