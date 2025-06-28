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
    console.log('[AuthEffects] actions$ =', this.actions$);

    this.login$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.login),
        mergeMap(({ credentials }) =>
          this.authService.login(credentials).pipe(
            map(res => {
              // ✅ حفظ التوكن في الكوكيز
              if (res.token) {
                this.cookieService.set('auth_token', res.token);
              }
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
            this.router.navigate(['/auth/login']);
          })
        ),
      { dispatch: false }
    );
  }
}
