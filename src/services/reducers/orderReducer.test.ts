import { v4 as uuidv4 } from 'uuid';
import {
  orderReducer,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearModalData,
  getOrders,
  orderBurger
} from './orderReducer';
import { TOrder } from '@utils-types';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-id')
}));

jest.mock('@api', () => ({
  getOrdersApi: jest.fn(),
  orderBurgerApi: jest.fn()
}));

import { getOrdersApi, orderBurgerApi } from '@api';

const initialState = orderReducer(undefined, { type: '' });

const mockBun = {
  _id: '1',
  name: 'Булка',
  type: 'bun',
  price: 100,
  image: 'img',
  image_large: 'img_large',
  image_mobile: 'img_mobile',
  calories: 300,
  proteins: 10,
  fat: 5,
  carbohydrates: 50
};

const mockIngredient = {
  _id: '2',
  name: 'Котлета',
  type: 'main',
  price: 50,
  image: 'img',
  image_large: 'img_large',
  image_mobile: 'img_mobile',
  calories: 200,
  proteins: 5,
  fat: 3,
  carbohydrates: 30
};

const mockOrders = [
  {
    _id: '101',
    status: 'done',
    name: 'Тест-бургер',
    createdAt: '',
    updatedAt: '',
    number: 1,
    ingredients: []
  }
];

const mockOrderResponse = {
  success: true,
  order: mockOrders[0],
  name: 'Test order'
};

describe('orderSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state', () => {
    expect(orderReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should add bun', () => {
    const state = orderReducer(initialState, addIngredient(mockBun));
    expect(state.constructorItems.bun).toEqual(mockBun);
  });

  it('should add ingredient', () => {
    const state = orderReducer(initialState, addIngredient(mockIngredient));
    expect(state.constructorItems.ingredients).toEqual([
      { ...mockIngredient, id: 'mocked-id' }
    ]);
  });

  it('should remove ingredient', () => {
    const init = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: [{ ...mockIngredient, id: 'x' }]
      }
    };

    const state = orderReducer(init, removeIngredient('x'));
    expect(state.constructorItems.ingredients).toEqual([]);
  });

  it('should move ingredient up', () => {
    const init = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: [
          { ...mockIngredient, id: '1' },
          { ...mockIngredient, id: '2' }
        ]
      }
    };

    const state = orderReducer(init, moveIngredientUp(1));
    expect(state.constructorItems.ingredients[0].id).toBe('2');
  });

  it('should move ingredient down', () => {
    const init = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: [
          { ...mockIngredient, id: '1' },
          { ...mockIngredient, id: '2' }
        ]
      }
    };

    const state = orderReducer(init, moveIngredientDown(0));
    expect(state.constructorItems.ingredients[1].id).toBe('1');
  });

  it('should clear constructor and modal', () => {
    const init = {
      ...initialState,
      constructorItems: {
        bun: { ...mockBun, id: 'test-bun-id' },
        ingredients: [{ ...mockIngredient, id: 'test-ingredient-id' }]
      },
      orderModalData: mockOrders[0]
    };

    const state = orderReducer(init, clearModalData());
    expect(state).toEqual(initialState);
  });

  // ------ async tests ------

  it('should handle getOrders.fulfilled', () => {
    const state = orderReducer(
      initialState,
      getOrders.fulfilled(mockOrders, 'reqId')
    );
    expect(state.orders).toEqual(mockOrders);
    expect(state.ordersLoading).toBe(false);
  });

  it('should handle orderBurger.fulfilled', () => {
    const state = orderReducer(
      initialState,
      orderBurger.fulfilled(mockOrderResponse, 'reqId', ['123'])
    );

    expect(state.orderModalData).toEqual(mockOrders[0]);
    expect(state.orderRequest).toBe(false);
  });
});
