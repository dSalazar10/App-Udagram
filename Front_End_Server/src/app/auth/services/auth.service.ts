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
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { ApiService } from 'src/app/api/api.service';
import { catchError, tap } from 'rxjs/operators';

const JWT_LOCALSTORE_KEY = 'jwt';
const USER_LOCALSTORE_KEY = 'user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  constructor( private api: ApiService ) {
    this.initToken();
  }

  initToken() {
    const token = localStorage.getItem(JWT_LOCALSTORE_KEY);
    const user = <User> JSON.parse(localStorage.getItem(USER_LOCALSTORE_KEY));
    if (token && user) {
      this.setTokenAndUser(token, user);
    }
  }

  setTokenAndUser(token: string, user: User) {
    localStorage.setItem(JWT_LOCALSTORE_KEY, token);
    localStorage.setItem(USER_LOCALSTORE_KEY, JSON.stringify(user));
    this.api.setAuthToken(token);
    this.currentUser$.next(user);
  }

  async login(email: string, password: string): Promise<any> {
    return this.api.post('/users/auth/login',
              {email: email, password: password})
              .then((res) => {
                this.setTokenAndUser(res.token, res.user);
                return res;
              })
              .catch((e) => { throw e; });
      // return user !== undefined;
  }

  logout(): boolean {
    this.setTokenAndUser(null, null);
    return true;
  }

  register(user: User, password: string): Promise<any> {
    return this.api.post('/users/auth/',
              {email: user.email, password: password})
              .then((res) => {
                this.setTokenAndUser(res.token, res.user);
                return res;
              })
              .catch((e) => { throw e; });
  }
}
