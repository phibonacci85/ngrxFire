import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { simpleReducer } from './simple.reducer';
import { postReducer } from './reducers/post.reducer';
import { userReducer } from './reducers/user.reducer';
import { PostEffects } from './effects/post.effects';
import { environment } from '../environments/environment';
import { UserEffects } from './effects/user.effects';
import { PizzaStatusComponent } from './pizza-status/pizza-status.component';

@NgModule({
  declarations: [
    AppComponent,
    PizzaStatusComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    EffectsModule.forRoot([
      PostEffects,
      UserEffects,
    ]),
    StoreModule.forRoot({
      user: userReducer,
      post: postReducer,
      message: simpleReducer,
    }),
    StoreDevtoolsModule.instrument({maxAge: 25}),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
