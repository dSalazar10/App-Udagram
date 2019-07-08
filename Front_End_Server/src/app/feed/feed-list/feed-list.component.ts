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
import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FeedItem } from '../models/feed-item.model';
import { FeedProviderService } from '../services/feed.provider.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-feed-list',
  templateUrl: './feed-list.component.html',
  styleUrls: ['./feed-list.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedListComponent implements OnInit, OnDestroy {
  @Input() feedItems: FeedItem[];
  subscriptions: Subscription[] = [];
  constructor( private feed: FeedProviderService ) { }

  async ngOnInit() {
    this.subscriptions.push(
      this.feed.currentFeed$.subscribe((items) => {
      this.feedItems = items;
    }));

    await this.feed.getFeed();
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }


}
