import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './sccommon/services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isDev: boolean = false;
  isDemo: boolean = false;

  constructor(private router: Router,
              public loginService: LoginService) { }

  ngOnInit() {
    const href = window.location.href;

    this.isDev = href.indexOf("localhost") > -1;
    this.isDemo = href.startsWith("https://demo");
  }
}