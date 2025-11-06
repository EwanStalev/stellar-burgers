import store from '../store';
import { combineReducers } from '@reduxjs/toolkit';
import { dataReducer } from './dataReducer';
import { feedReducer } from './feedReducer';
import { orderReducer } from './orderReducer';
import { authReducer } from './authReducer';

const rootReducer = combineReducers({
  data: dataReducer,
  feed: feedReducer,
  order: orderReducer,
  auth: authReducer,
});

describe('rootReducer', () => {
  it('должен возвращать корректное начальное состояние', () => {
    const initAction = { type: '@@INIT' };
    const state = rootReducer(undefined, initAction);

    expect(state).toEqual({
      data: dataReducer(undefined, initAction),
      feed: feedReducer(undefined, initAction),
      order: orderReducer(undefined, initAction),
      auth: authReducer(undefined, initAction),
    });
  });

  it('должен возвращать то же состояние при неизвестном экшене', () => {
    const prevState = store.getState();
    const state = rootReducer(prevState, { type: 'UNKNOWN_ACTION' });

    expect(state).toBe(prevState);
  });
});
