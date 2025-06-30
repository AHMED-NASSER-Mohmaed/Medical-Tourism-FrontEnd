import { createAction, props } from '@ngrx/store';
import { LoginRequest, LoginResponse } from '../models/auth.model';

/* ─── Login ─── */
export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginRequest & { rememberMe: boolean } }>()
);


export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ response: LoginResponse }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: any }>()
);

/* ─── Logout ─── */
export const logout = createAction('[Auth] Logout');
