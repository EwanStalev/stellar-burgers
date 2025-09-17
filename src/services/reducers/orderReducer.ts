import {
  getIngredientsApi,
  getOrdersApi,
  orderBurgerApi,
  TIngredientsResponse
} from '@api';
import { IngredientDetails } from '@components';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { error } from 'console';
import { v4 } from 'uuid';

interface IinitialState {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderModalData: TOrder | null;
  orderRequest: boolean;
  orders: TOrder[];
  ordersLoading: boolean;
  ordersError: string | null;
}

const initialState: IinitialState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orders: [],
  orderRequest: false,

  orderModalData: null,

  ordersLoading: false,
  ordersError: null
};

export const getOrders = createAsyncThunk('order/getOrders', getOrdersApi);
export const orderBurger = createAsyncThunk(
  'order/orderBurger',
  (data: string[]) => orderBurgerApi(data)
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addIngredient: (state, action) => {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = action.payload;
      } else {
        state.constructorItems.ingredients.push({
          ...action.payload,
          id: v4()
        });
      }
    },
    removeIngredient: (state, action) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
    },
    moveIngredientUp: (state, action) => {
      const newIngredients = [...state.constructorItems.ingredients];
      const [movedIngredient] = newIngredients.splice(action.payload, 1);
      newIngredients.splice(action.payload - 1, 0, movedIngredient);
      state.constructorItems.ingredients = newIngredients;
    },
    moveIngredientDown: (state, action) => {
      const newIngredients = [...state.constructorItems.ingredients];
      const [movedIngredient] = newIngredients.splice(action.payload, 1);
      newIngredients.splice(action.payload + 1, 0, movedIngredient);
      state.constructorItems.ingredients = newIngredients;
    },

    clearModalData: (state) => {
      state.orderModalData = null;
      state.constructorItems = { bun: null, ingredients: [] };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getOrders.pending, (state, action) => {
      state.ordersLoading = true;
      state.ordersError = null;
    });
    builder.addCase(getOrders.fulfilled, (state, action) => {
      state.ordersLoading = false;
      state.ordersError = null;
      state.orders = action.payload;
    });
    builder.addCase(getOrders.rejected, (state, action) => {
      state.ordersLoading = false;
      state.ordersError = 'server error';
    });

    builder.addCase(orderBurger.pending, (state, action) => {
      state.orderRequest = true;
      state.ordersError = null;
    });
    builder.addCase(orderBurger.fulfilled, (state, action) => {
      state.orderRequest = false;
      state.ordersError = null;
      state.orderModalData = action.payload.order;
    });
    builder.addCase(orderBurger.rejected, (state, action) => {
      state.orderRequest = false;
      state.ordersError = 'server error';
      state.orderModalData = null;
    });
  }
});

export const {
  addIngredient,
  moveIngredientUp,
  moveIngredientDown,
  removeIngredient,
  clearModalData
} = orderSlice.actions;

export const orderReducer = orderSlice.reducer;
