import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { AuthService } from '../services/auth.service';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthEffects {
  login$;
  logout$;

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.login$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.login),
        mergeMap(({ credentials }) =>
          this.authService.login(credentials).pipe(
map(res => {
  if (res.token) {
    const remember = credentials.rememberMe;
    if (remember) {

      this.cookieService.set('auth_token', res.token, 30, '/');
    } else {

      this.cookieService.set('auth_token', res.token, undefined, '/');
    }
  }

  this.authService.setLoggedIn(true);
  //this.router.navigate(['/']);
  return AuthActions.loginSuccess({ response: res });
            }),
            catchError(err => of(AuthActions.loginFailure({ error: err })))
          )
        )
      )
    );

    this.logout$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(AuthActions.logout),
          tap(() => {
            this.cookieService.delete('auth_token');
            this.authService.setLoggedIn(false);
            this.router.navigate(['/auth/login']);
          })
        ),
      { dispatch: false }
    );
  }
}
