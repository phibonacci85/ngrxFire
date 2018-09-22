import { Actions, Effect } from '@ngrx/effects';
import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Observable, from, of } from 'rxjs';

import * as postActions from '../actions/post.actions';
import { catchError, delay, map, mergeMap, switchMap } from 'rxjs/operators';
import { Post } from '../models/post.model';

@Injectable()
export class PostEffects {

  @Effect()
  getPost$: Observable<Action> = this.actions$.ofType(postActions.GET_POST)
    .pipe(
      map((action: postActions.GetPost) => action.payload),
      delay(2000),
      switchMap(id => {
        const ref = this.afs.doc<Post>(`posts/${id}`);
        return from(ref.valueChanges());
      }),
      map(post => new postActions.GetPostSuccess(post)),
    );

  @Effect()
  voteUpdate: Observable<Action> = this.actions$.ofType(postActions.VOTE_UPDATE)
    .pipe(
      map((action: postActions.VoteUpdate) => action.payload),
      switchMap(payload => {
        const ref = this.afs.doc<Post>(`posts/${payload.post.pushKey}`);
        return from(ref.update({votes: payload.post.votes + payload.val}));
      }),
      map(() => new postActions.VoteSuccess()),
      catchError(err => of(new postActions.VoteFail({error: err.message}))),
    );

  constructor(private actions$: Actions, private afs: AngularFirestore) {}
}
