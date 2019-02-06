import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

  constructor(private router: Router,
              private fb: FormBuilder,
              private loginService: LoginService) { }

  ngOnInit() {
  }

  login() {
    this.loginService.login(this.loginForm.value).
      subscribe(
        () => {
          this.router.navigate(['people']);
        },
        err => {
          this.loginForm.get("password").setValue(null);
      });
  }
}
