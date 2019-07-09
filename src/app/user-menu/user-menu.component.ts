import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../sccommon/services/login.service';

import { MatMenu } from '@angular/material/menu';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {

  public userName: string;

  constructor(private loginService: LoginService,
              private router: Router) {}

  ngOnInit() {
    this.userName = this.loginService.getUserName();
    this.loginService.loginEmitter.subscribe(name => {this.userName = name;});
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['login']);
  }

  userCanAdmin(): boolean {
    return this.loginService.hasAny('admin');
  }

  userCanSystem(): boolean {
    return this.loginService.isSystem();
  }
}
