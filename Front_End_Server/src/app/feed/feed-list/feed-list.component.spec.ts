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
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FeedListComponent} from './feed-list.component';
import {FeedProviderService} from '../services/feed.provider.service';
import {feedItemMocks} from '../models/feed-item.model';

describe('FeedListComponent', () => {
  let component: FeedListComponent;
  let fixture: ComponentFixture<FeedListComponent>;
  let feedProvider: FeedProviderService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedListComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedListComponent);

    // SET UP SPIES AND MOCKS
    feedProvider = fixture.debugElement.injector.get(FeedProviderService);
    // spyOn(feedProvider, 'fetch').and.returnValue(Promise.resolve(feedItemMocks));

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch on load', () => {
    expect(feedProvider.getFeed).toHaveBeenCalled();
  });

  it('should display all of the fetched items', () => {
    component.feedItems = feedItemMocks;
    fixture.detectChanges();
    const app = fixture.nativeElement;
    const items = app.querySelectorAll('app-feed-item');
    expect(items.length).toEqual(feedItemMocks.length);
  });
});
