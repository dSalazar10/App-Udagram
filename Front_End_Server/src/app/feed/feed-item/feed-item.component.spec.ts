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

import { FeedItemComponent } from './feed-item.component';
import { feedItemMocks } from '../models/feed-item.model';
import { FeedProviderService } from '../services/feed.provider.service';

describe('FeedItemComponent', () => {
  let component: FeedItemComponent;
  let fixture: ComponentFixture<FeedItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedItemComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedItemComponent);
    component = fixture.componentInstance;
    component.feedItem = feedItemMocks[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the image url to the feedItem', () => {
    const app = fixture.nativeElement;
    const img = app.querySelectorAll('ion-img');
    expect(img.length).toEqual(1);
    expect(img[0].src).toEqual(feedItemMocks[0].url);
  });

  it('should display the caption', () => {
    const app = fixture.nativeElement;
    const paragraphs = app.querySelectorAll('p');
    expect(([].slice.call(paragraphs)).map((x) => x.innerText)).toContain(feedItemMocks[0].caption);
  });

  // it('should open a modal when clicked', () => {
  //   de = fixture.debugElement.query(By.css('ion-buttons button'));
  //   de.triggerEventHandler('click', null);
  //   expect(navCtrl.push).toHaveBeenCalledWith(WishlistPage);
  // });

  // it('should open a modal when clicked', () => {
  //   let navCtrl = fixture.debugElement.injector.get(NavController);
  //   spyOn(navCtrl, 'push');
  //   de = fixture.debugElement.query(By.css('ion-buttons button'));
  //   de.triggerEventHandler('click', null);
  //   expect(navCtrl.push).toHaveBeenCalledWith(WishlistPage);
  // });
});
