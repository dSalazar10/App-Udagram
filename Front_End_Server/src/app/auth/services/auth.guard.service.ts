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
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
    ) {}

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): boolean
                    | UrlTree
                    | Observable<boolean
                    | UrlTree>
                    | Promise<boolean | UrlTree> {
   if (!this.auth.currentUser$.value) {
      this.router.navigateByUrl('/login');
    }

    return this.auth.currentUser$.value !== null;
    }

}

// import { Injectable } from '@angular/core';
// import { Router, CanActivate } from '@angular/router';
// import { Events } from '@ionic/angular';

// import { AmplifyService } from 'aws-amplify-angular';
// import { CognitoUser } from 'amazon-cognito-identity-js';
// import { AuthState } from 'aws-amplify-angular/dist/src/providers/auth.state';
// import { BehaviorSubject } from 'rxjs';
// import { Auth } from 'aws-amplify';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuardService implements CanActivate {
//   authState: AuthState;
//   loggedIn = false;
//   loggedInChanged$: BehaviorSubject<boolean> = new BehaviorSubject<boolean> (this.loggedIn);
//   currentUser: CognitoUser;

//   constructor(
//     public router: Router,
//     public events: Events,
//     public amplify: AmplifyService
//     ) {
//       this.amplify.authStateChange$
//           .subscribe(async (authState) => {
//             if (authState) {
//               this.loggedIn = authState.state === 'signedIn';
//               this.loggedInChanged$.next(this.loggedIn);
//               this.authState = authState;
//               this.events.publish('data:AuthState', this.authState);


//               this.currentUser = await Auth.currentAuthenticatedUser();
//             }
//           });
//     }

//   retry() {
//   }

//   canActivate() {
//     if (!this.loggedIn) {
//       this.router.navigateByUrl('/signin');
//     }

//     return this.loggedIn;
//   }

//   signOut() {
//     return this.amplify.auth().signOut().then(() => {
//       window.location.href = '/#/signin';
//       // TODO maybe additional cleanup
//     });
//   }

//   init() {
//     return;
//   }
// }
