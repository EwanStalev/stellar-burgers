import {
  authReducer,
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser
} from './authReducer';
import type { TRegisterData, TLoginData } from '@api'; // если нужно, подставь реальный путь

describe('authSlice', () => {
  const initialState = authReducer(undefined, { type: '' });

  const mockUser = { email: 'test@test.com', name: 'Test User' };

  const mockAuthResponse = {
    success: true,
    accessToken: 'Bearer fakeAccess',
    refreshToken: 'fakeRefresh',
    user: mockUser
  };

  const mockUserResponse = {
    success: true,
    user: mockUser
  };

  // корректные "arg" для thunks
  const registerArg: TRegisterData = {
    email: 'test@test.com',
    password: '123456',
    name: 'Test User'
  };
  const loginArg: TLoginData = { email: 'test@test.com', password: '123456' };
  const updateArg: TRegisterData = {
    email: 'updated@test.com',
    password: '123456',
    name: 'Updated User'
  }; // update thunk expects TRegisterData in твоем код

  it('should return initial state', () => {
    expect(authReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle registerUser.fulfilled', () => {
    const state = authReducer(
      initialState,
      registerUser.fulfilled(mockAuthResponse, 'requestId', registerArg)
    );

    expect(state).toEqual({
      ...initialState,
      isAuth: true,
      isLoading: false,
      user: mockUser,
      error: null
    });
  });

  it('should handle loginUser.fulfilled', () => {
    const state = authReducer(
      initialState,
      loginUser.fulfilled(mockAuthResponse, 'requestId', loginArg)
    );

    expect(state).toEqual({
      ...initialState,
      isAuth: true,
      isLoading: false,
      user: mockUser,
      error: null
    });
  });

  it('should handle getUser.fulfilled', () => {
    const state = authReducer(
      initialState,
      getUser.fulfilled(mockUserResponse, 'requestId')
    );

    expect(state).toEqual({
      ...initialState,
      isAuth: true,
      isLoading: false,
      user: mockUser,
      error: null
    });
  });

  it('should handle updateUser.fulfilled', () => {
    const logged = { ...initialState, user: mockUser, isAuth: true };
    const newUser = { email: 'new@test.com', name: 'New Name' };

    const state = authReducer(
      logged,
      updateUser.fulfilled(
        { success: true, user: newUser },
        'requestId',
        updateArg
      )
    );

    expect(state).toEqual({
      ...initialState,
      isAuth: true,
      user: newUser,
      isLoading: false,
      error: null
    });
  });

  it('should handle logoutUser.fulfilled', () => {
    const authenticated = { ...initialState, user: mockUser, isAuth: true };

    const state = authReducer(
      authenticated,
      logoutUser.fulfilled({ success: true }, 'requestId')
    );

    expect(state).toEqual({
      ...initialState,
      isAuth: false,
      user: null
    });
  });
});
