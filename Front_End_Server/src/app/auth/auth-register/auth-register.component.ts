/* MIT License

Copyright (c) 2019 Daniel Salazar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-auth-register',
  templateUrl: './auth-register.component.html',
  styleUrls: ['./auth-register.component.scss'],
})
export class AuthRegisterComponent implements OnInit {

  registerForm: FormGroup;
  error: string;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private modal: ModalController
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      password_confirm: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+$')
      ]))
    }, { validators: this.passwordsMatch });
  }

  onSubmit($event) {
    $event.preventDefault();

    if (!this.registerForm.valid) { return; }

    const newuser: User = {
      email: this.registerForm.controls.email.value,
      name: this.registerForm.controls.name.value
    };

    this.auth.register(newuser, this.registerForm.controls.password.value)
              .then((user) => {
                this.modal.dismiss();
              })
             .catch((e) => {
              this.error = e.statusText;
              throw e;
             });
  }

  passwordsMatch(group: FormGroup) {
    return group.controls.password.value === group.controls.password_confirm.value ? null : { passwordsMisMatch: true };
  }
}
