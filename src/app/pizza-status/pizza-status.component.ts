import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import { Pizza } from '../models/pizza.model';

@Component({
  selector: 'app-pizza-status',
  templateUrl: './pizza-status.component.html',
  styleUrls: ['./pizza-status.component.css'],
})
export class PizzaStatusComponent implements OnInit {

  numberForm: FormGroup;
  order: any;
  pizza: Pizza;

  constructor(private afs: AngularFirestore, private fb: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    this.order = this.afs.doc<Pizza>('/orders/testPizza123');
    this.pizza = this.order.valueChanges()
      .subscribe(pizza => this.pizza = pizza);
  }

  updatePhoneNumber() {
    this.order.update({phoneNumber: this.e164});
  }

  buildForm() {
    this.numberForm = this.fb.group({
      country: this.validateMinMax(1, 2),
      area: this.validateMinMax(3, 3),
      prefix: this.validateMinMax(3, 3),
      line: this.validateMinMax(4, 4),
    });
  }

  cooking() {
    this.order.update({status: 'cooking'});
  }

  delivered() {
    this.order.update({status: 'delivered'});
  }

  validateMinMax(min, max) {
    return [
      '',
      [
        Validators.required,
        Validators.minLength(min),
        Validators.maxLength(max),
        Validators.pattern('[0-9]+'),
      ],
    ];
  }

  get e164() {
    const form = this.numberForm.value;
    const num = form.country + form.area + form.prefix + form.line;
    return `+${num}`;
  }

}
