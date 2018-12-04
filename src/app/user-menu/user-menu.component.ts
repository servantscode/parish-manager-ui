import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {

  public userName: string;

  constructor(private loginService: LoginService,
              private router: Router) { }

  ngOnInit() {
    this.userName = this.loginService.getUserName();
    this.loginService.loginEmitter.subscribe(name => {this.userName = name;});
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['login']);
  }
}
