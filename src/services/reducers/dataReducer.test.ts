import { dataReducer, getAllIngredients } from './dataReducer';
import { TIngredient } from '@utils-types';

const initialState = {
  ingredients: [],
  buns: [],
  mains: [],
  sauces: [],
  isIngredientsLoading: false,
  ingredientsError: null
};

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    price: 100,
    image: 'img',
    image_large: 'img_large',
    image_mobile: 'img_mobile',
    calories: 100,
    proteins: 10,
    fat: 5,
    carbohydrates: 20
  },
  {
    _id: '2',
    name: 'Соус',
    type: 'sauce',
    price: 50,
    image: 'img2',
    image_large: 'img2_large',
    image_mobile: 'img2_mobile',
    calories: 10,
    proteins: 2,
    fat: 1,
    carbohydrates: 5
  }
];

describe('dataReducer', () => {
  it('should return initial state', () => {
    expect(dataReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle getAllIngredients.pending', () => {
    const state = dataReducer(initialState, {
      type: getAllIngredients.pending.type
    });
    expect(state).toEqual({
      ...initialState,
      isIngredientsLoading: true,
      ingredientsError: null
    });
  });

  it('should handle getAllIngredients.fulfilled', () => {
    const action = {
      type: getAllIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = dataReducer(initialState, action);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.buns.length).toBe(1);
    expect(state.sauces.length).toBe(1);
    expect(state.isIngredientsLoading).toBe(false);
  });

  it('should handle getAllIngredients.rejected', () => {
    const action = { type: getAllIngredients.rejected.type };
    const state = dataReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      ingredientsError: 'произошла ошибкая'
    });
  });
});
