import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { LoginService } from './login.service';

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

    return true;
  }
}