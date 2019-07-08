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
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,  HttpErrorResponse, HttpRequest, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { FeedItem } from '../feed/models/feed-item.model';
import { catchError, tap, map } from 'rxjs/operators';

// If you plan to move this to the cloud
// change the environment variable to environment.webHost
const API_HOST = environment.apiHost;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  token: string;

  constructor(private http: HttpClient) {
  }

  handleError(error: Error) {
    alert(error.message);
  }

  setAuthToken(token) {
    this.httpOptions.headers = this.httpOptions.headers.append('Authorization', `jwt ${token}`);
    this.token = token;
  }

  get(endpoint): Promise<any> {
    const url = `${API_HOST}${endpoint}`;
    const req = this.http.get(url, this.httpOptions).pipe(map(this.extractData));

    return req
            .toPromise()
            .catch((e) => {
              this.handleError(e);
              throw e;
            });
  }

  post(endpoint, data): Promise<any> {
    const url = `${API_HOST}${endpoint}`;
    return this.http.post<HttpEvent<any>>(url, data, this.httpOptions)
            .toPromise()
            .catch((e) => {
              this.handleError(e);
              throw e;
            });
  }

  async upload(endpoint: string, file: File, payload: any): Promise<any> {
    const signed_url = (await this.get(`${endpoint}/signed-url/${file.name}`)).url;

    const headers = new HttpHeaders({'Content-Type': file.type});
    const req = new HttpRequest( 'PUT', signed_url, file,
                                  {
                                    headers: headers,
                                    reportProgress: true, // track progress
                                  });

    return new Promise ( resolve => {
        this.http.request(req).subscribe((resp) => {
        if (resp && (<any> resp).status && (<any> resp).status === 200) {
          resolve(this.post(endpoint, payload));
        }
      });
    });
  }

  /// Utilities
  private extractData(res: HttpEvent<any>) {
    const body = res;
    return body || { };
  }
}
