import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, fromEvent, from, timer, interval, of } from 'rxjs';
import { finalize, map, tap, zip } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';

import { Post } from './models/post.model';
import { User } from './models/user.model';
import * as postActions from './actions/post.actions';
import * as userActions from './actions/user.actions';
import * as Rx from 'rxjs';

interface AppState {
  post: Post;
  user: User;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  post$: Observable<Post>;
  user$: Observable<User>;
  text: string;

  constructor(private store: Store<AppState>, private afs: AngularFirestore) {
    this.afs.firestore.settings({timestampsInSnapshots: true});
    this.post$ = this.store.select('post');
    /*
        const observable = Observable.create(observer => {
          observer.next('hello');
          observer.next('world');
        });
        observable.subscribe(val => console.log(val));

        const clicks = fromEvent(document, 'click');
        clicks.subscribe(click => console.log(click));

        const promise = new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve('resolved');
          }, 1000);
        });
        const obsvPromise = from(promise);
        obsvPromise.subscribe(result => console.log(result));

        const tick = timer(1000);
        tick.pipe(finalize(() => {console.log('All Done!');}))
          .subscribe(done => console.log('ding!!'));

        const ticker = interval(1000);
        const subscription = ticker.subscribe(i => console.log(i));
        subscription.unsubscribe();

        const mashup = of('anything', ['you', 'want'], 23, true, {cool: 'stuff'});
        mashup.subscribe(val => console.log(val));

        const cold = Observable.create(observer => observer.next(Math.random()));
        cold.subscribe(a => console.log(`Subscriber A: ${a}`));
        cold.subscribe(b => console.log(`Subscriber B: ${b}`));

        const x = Math.random();
        const hot = Observable.create(observer => observer.next(x));
        hot.subscribe(a => console.log(`Hot Subscriber A: ${a}`));
        hot.subscribe(b => console.log(`Hot Subscriber B: ${b}`));

        // const hot2 = cold.publish();
        // hot2.subscribe(a => console.log(`Hot2 Subscriber A: ${a}`));
        // hot2.subscribe(b => console.log(`Hot2 Subscriber B: ${b}`));
        // hot2.connect();

        const numbers = from([10, 100, 1000]);
        numbers
          .pipe(
            map(num => Math.log(num)),
          )
          .subscribe(n => console.log(n));

        const names = of('Simon', 'Garfunkle');

        names.pipe(
          tap(name => console.log(`orignial value`, name)),
          map(name => name.toUpperCase()),
          tap(name => console.log(`uppercase value`, name)),
        ).subscribe();

        clicks.switchMap(click => {
          return interval(500);
        })
          .subscribe(i => console.log(i));

        // const yin = of('peanut butter', 'wine', 'rainbows');
        // const yang = of('jelly', 'cheese', 'unicorns');
        //
        // const combo = Rx.Observable.zip(yin, yang);
        //
        // combo.subscribe(arr => console.log(arr));
        */
  }

  ngOnInit() {
    this.user$ = this.store.select('user');
    this.store.dispatch(new userActions.GetUser());
  }

  googleLogin() {
    this.store.dispatch(new userActions.GoogleLogin());
  }

  logout() {
    this.store.dispatch(new userActions.Logout());
  }

  getPost() {
    this.store.dispatch(new postActions.GetPost('testPost'));
  }

  vote(post: Post, val: number) {
    this.store.dispatch(new postActions.VoteUpdate({post, val}));
  }
}
