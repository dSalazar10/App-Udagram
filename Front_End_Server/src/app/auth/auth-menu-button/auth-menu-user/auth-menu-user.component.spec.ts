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
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthMenuUserComponent } from './auth-menu-user.component';
import { ModalController } from '@ionic/angular';

describe('AuthMenuUserPage', () => {
  let component: AuthMenuUserComponent;
  let fixture: ComponentFixture<AuthMenuUserComponent>;
  let modalSpy;
  let modalCtrlSpy;

  beforeEach(async(() => {
    modalSpy = jasmine.createSpyObj('Modal', ['dismiss']);
    modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);
    modalCtrlSpy.create.and.callFake(function () {
        return modalSpy;
    });


    TestBed.configureTestingModule({
      providers: [
        {
          provide: ModalController,
          useValue: modalCtrlSpy
        }
      ],
      declarations: [ AuthMenuUserComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthMenuUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('#dismiss() should hide the modal', () => {
  //     .........
  //     expect(modalSpy.dismiss).toHaveBeenCalled();
  //     .........
  // });
});
