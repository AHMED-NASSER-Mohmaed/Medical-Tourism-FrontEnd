import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
  userId: string | null;
  token: string | null;
  loading: boolean;
  error: any;
  isAuthenticated: boolean;
}

export const initialState: AuthState = {
  userId: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false
};

export const authReducer = createReducer(
  initialState,

  /* login start */
  on(AuthActions.login,  state => ({ ...state, loading: true,  error: null })),

  /* login success */
  on(AuthActions.loginSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    isAuthenticated: response.success,
    userId: response.userId,
    token: response.token,
    error: null
  })),

  /* login failure */
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    isAuthenticated: false,
    userId: null,
    token: null,
    error
  })),

  /* logout */
  on(AuthActions.logout, () => initialState)
);
