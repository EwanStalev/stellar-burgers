import { feedReducer, getAllFeeds, getOrderByNumber } from './feedReducer';
import { TOrder } from '@utils-types';

const initialState = feedReducer(undefined, { type: '' });

const mockOrder: TOrder = {
  _id: '1',
  ingredients: [],
  status: 'done',
  name: 'Order 1',
  createdAt: '',
  updatedAt: '',
  number: 1
};

const mockFeedData = {
  orders: [mockOrder],
  total: 10,
  totalToday: 5
};

describe('feedReducer', () => {
  it('should return initial state', () => {
    expect(feedReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle getAllFeeds.pending', () => {
    const state = feedReducer(initialState, { type: getAllFeeds.pending.type });
    expect(state.isOrdersLoading).toBe(true);
  });

  it('should handle getAllFeeds.fulfilled', () => {
    const action = { type: getAllFeeds.fulfilled.type, payload: mockFeedData };
    const state = feedReducer(initialState, action);

    expect(state.orders).toEqual(mockFeedData.orders);
    expect(state.feed.total).toBe(10);
    expect(state.feed.totalToday).toBe(5);
  });

  it('should handle getAllFeeds.rejected', () => {
    const state = feedReducer(initialState, {
      type: getAllFeeds.rejected.type
    });
    expect(state.isOrdersLoading).toBe(false);
    expect(state.orders).toEqual([]);
    expect(state.feed.total).toBe(0);
  });

  it('should handle getOrderByNumber.fulfilled', () => {
    const action = {
      type: getOrderByNumber.fulfilled.type,
      payload: { orders: [mockOrder] }
    };
    const state = feedReducer(initialState, action);
    expect(state.orderData).toEqual(mockOrder);
  });
});
