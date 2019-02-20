import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './sccommon/services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private router: Router,
              public loginService: LoginService) { }
}