import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { ApiLocatorService } from '../services/api-locator.service';
import { LoginService } from '../services/login.service';
import { OrganizationService } from '../services/organization.service';

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
              private loginService: LoginService,
              public organizationService: OrganizationService,
              private apiService: ApiLocatorService ) { }

  ngOnInit() {
  }

  getBackgroundImage(): string {
    const activeOrg = this.organizationService.activeOrg();

    if(!activeOrg || !activeOrg.photoGuid)
      return '../../../assets/images/church.png';

    return this.apiService.prefaceUrl('/rest/photo/public/' + activeOrg.photoGuid);
  }

  login() {
    this.loginService.login(this.loginForm.value).
      subscribe(
        () => {
          this.router.navigate(['person']);
        },
        err => {
          this.loginForm.get("password").setValue(null);
      });
  }
}
