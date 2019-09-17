import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { LoginService } from 'sc-common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(public login: LoginService, 
    public router: Router) {}

  canActivate(): boolean {
    if (!this.login.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }

    if(this.login.userMust("password.reset")) {
      this.router.navigate(['account', 'reset']);
      return false;
    }

    return true;
  }
}