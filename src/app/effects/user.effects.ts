import { Actions, Effect } from '@ngrx/effects';
import { AngularFireAuth } from 'angularfire2/auth';

import * as userActions from '../actions/user.actions';
import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { catchError, delay, map, switchMap } from 'rxjs/operators';
import { User } from '../models/user.model';
import * as firebase from 'firebase';

export type Action = userActions.All;

@Injectable()
export class UserEffects {

  @Effect()
  getUser$: Observable<Action> = this.actions$.ofType(userActions.GET_USER)
    .pipe(
      map((action: userActions.GetUser) => action.payload),
      switchMap(payload => this.afAuth.authState),
      delay(2000),
      map(authData => {
        if (authData) {
          const user = new User(authData.uid, authData.displayName);
          return new userActions.Authenticated(user);
        } else {
          return new userActions.NotAuthenticated();
        }
      }),
      catchError(err => of(new userActions.AuthError())),
    );

  @Effect()
  login$: Observable<Action> = this.actions$.ofType(userActions.GOOGLE_LOGIN)
    .pipe(
      map((action: userActions.GoogleLogin) => action.payload),
      switchMap(payload => from(this.googleLogin())),
      map(credential => new userActions.GetUser()),
      catchError(err => of(new userActions.AuthError({error: err.message}))),
    );

  @Effect()
  logout$: Observable<Action> = this.actions$.ofType(userActions.LOGOUT)
    .pipe(
      map((action: userActions.Logout) => action.payload),
      switchMap(payload => of(this.afAuth.auth.signOut())),
      map(authData => new userActions.NotAuthenticated()),
      catchError(err => of(new userActions.AuthError({error: err.message}))),
    );

  constructor(private actions$: Actions, private afAuth: AngularFireAuth) {}

  private googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.afAuth.auth.signInWithPopup(provider);
  }
}