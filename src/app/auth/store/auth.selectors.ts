import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

/* root key = 'auth' (see StoreModule.forRoot in app.module) */
export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthLoading = createSelector(
  selectAuthState, s => s.loading
);

export const selectAuthError = createSelector(
  selectAuthState, s => s.error
);

export const selectIsAuthenticated = createSelector(
  selectAuthState, s => s.isAuthenticated
);

export const selectAuthToken = createSelector(
  selectAuthState, s => s.token
);

export const selectAuthUserId = createSelector(
  selectAuthState, s => s.userId
);
