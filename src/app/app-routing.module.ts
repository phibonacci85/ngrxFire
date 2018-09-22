import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PizzaStatusComponent } from './pizza-status/pizza-status.component';

const routes: Routes = [
  {path: '', component: PizzaStatusComponent, pathMatch: 'full'},
  {path: 'pizza-status', component: PizzaStatusComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
