import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { LoginService } from '../../sccommon/services/login.service';

import { PasswordService } from '../services/password.service';

import { PasswordRequest } from '../password-request';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  public resetToken: string;

  passwordResetForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });

  constructor(private fb: FormBuilder,
              private passwordService: PasswordService,
              private loginService: LoginService,
              private router: Router,
              private route: ActivatedRoute) { 

    this.resetToken = this.route.snapshot.paramMap.get('token');

    if(!this.resetToken && !this.loginService.isAuthenticated())
      this.router.navigate(['login']);
  }

  ngOnInit() {
    if(this.resetToken)
      this.passwordResetForm.get('oldPassword').setValidators(null);

  }

  submit() {
    var reset = this.passwordResetForm.value;
    if(reset.newPassword !== reset.confirmPassword)
      return;

    var req = new PasswordRequest();
    req.oldPassword = reset.oldPassword;
    req.newPassword = reset.newPassword;
    req.passwordToken = this.resetToken;

    this.passwordService.updatePassword(req).subscribe(
      resp => {
        this.loginService.logout();
        this.router.navigate(['login']);
      },
      err => {
        this.passwordResetForm.reset();
      }, 
      () => {
        this.loginService.logout();
        this.router.navigate(['login']);
      });
  }
}
