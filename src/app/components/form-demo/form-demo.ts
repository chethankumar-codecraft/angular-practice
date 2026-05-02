import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast-service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-form-demo',
  imports: [ReactiveFormsModule],
  templateUrl: './form-demo.html',
  styleUrl: './form-demo.css',
})
export class FormDemo {
  formBuilder = inject(FormBuilder);
  name = new FormControl('');

  // profileForm = new FormGroup({
  //   firstName: new FormControl(''),
  //   lastName: new FormControl(''),
  //   address: new FormGroup({
  //     street: new FormControl(''),
  //     city: new FormControl(''),
  //     state: new FormControl(''),
  //     zip: new FormControl(''),
  //   }),
  // });

  profileForm = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.minLength(6)]],
    lastName: [''],
    email: ['', Validators.email],
    address: this.formBuilder.group({
      street: [''],
      city: [''],
      state: [''],
      zip: [''],
    }),
  });

  handleChange($event: Event) {
    console.log(event?.target);
  }

  updateName() {
    this.name.setValue('hiiii');
  }
  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.profileForm.value);
  }
  updateForm() {
    this.profileForm.patchValue({ lastName: 'Kumar', address: { zip: '574267' } });
  }
}
