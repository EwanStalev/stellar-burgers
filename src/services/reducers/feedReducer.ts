import {
  getFeedsApi,
  getIngredientsApi,
  getOrderByNumberApi,
  TIngredientsResponse
} from '@api';
import { IngredientDetails } from '@components';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TFeed, TIngredient, TOrder } from '@utils-types';
import { error } from 'console';

interface IinitialState {
  feed: TFeed;
  orders: TOrder[];
  isOrdersLoading: boolean;
  orderData: TOrder;
  isOrderDataLoading: boolean;
}

const initialState: IinitialState = {
  feed: { total: 0, totalToday: 0 },
  orders: [],
  isOrdersLoading: false,
  orderData: {
    createdAt: '',
    ingredients: [],
    _id: '',
    status: '',
    name: '',
    updatedAt: '',
    number: 0
  },
  isOrderDataLoading: false
};

export const getOrderByNumber = createAsyncThunk(
  'data/getOrderByNumber',
  (number: number) => getOrderByNumberApi(number)
);

export const getAllFeeds = createAsyncThunk('data/getAllFeeds', getFeedsApi);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllFeeds.pending, (state, action) => {
      state.isOrdersLoading = true;
    });
    builder.addCase(getAllFeeds.fulfilled, (state, action) => {
      state.isOrdersLoading = false;
      state.orders = action.payload.orders;
      state.feed.total = action.payload.total;
      state.feed.totalToday = action.payload.totalToday;
    });
    builder.addCase(getAllFeeds.rejected, (state, action) => {
      state.orders = [];
      state.feed.total = 0;
      state.feed.totalToday = 0;
      state.isOrdersLoading = false;
    });

    builder.addCase(getOrderByNumber.pending, (state, action) => {
      state.isOrderDataLoading = true;
    });
    builder.addCase(getOrderByNumber.fulfilled, (state, action) => {
      state.isOrderDataLoading = false;
      state.orderData = action.payload.orders[0];
    });
    builder.addCase(getOrderByNumber.rejected, (state, action) => {
      state.isOrderDataLoading = false;
    });
  }
});

export const feedReducer = feedSlice.reducer;
