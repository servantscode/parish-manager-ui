import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { PasswordService } from '../services/password.service';

@Component({
  selector: 'app-request-reset',
  templateUrl: './request-reset.component.html',
  styleUrls: ['./request-reset.component.scss']
})
export class RequestResetComponent implements OnInit {

  resetForm = this.fb.group({
      email: ['', Validators.required]
    });

  requestSent:boolean = false;

  constructor(private router: Router,
              private fb: FormBuilder,
              private passwordService: PasswordService) { }

  ngOnInit() {
  }

  requestReset() {
    this.passwordService.requestReset(this.resetForm.value).subscribe(() => {
        this.requestSent = true;
      });
  }
}