import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';

import { LoginService } from '../../sccommon/services/login.service';
import { DeleteDialogComponent } from '../../sccommon/delete-dialog/delete-dialog.component';

import { EmailConfigService } from '../services/email-config.service';

@Component({
  selector: 'app-email-config',
  templateUrl: './email-config.component.html',
  styleUrls: ['./email-config.component.scss']
})
export class EmailConfigComponent implements OnInit {

  configForm = this.fb.group({
      smtpHost: ['', Validators.required],
      smtpPort: ['', Validators.required],
      useSsl: false,
      useTls: false,
      requireAuth: false,
      emailAccount:  [{value:'', disabled: true}, Validators.required],
      accountPassword:  [{value:'', disabled: true}, Validators.required]
    });

  authRequired= false;

  openDialogRef = null;
  disabled = false;

  constructor(private fb: FormBuilder,
              private dialog: MatDialog,
              private loginService: LoginService,
              private emailConfigService: EmailConfigService) { }

  ngOnInit() {
    this.getConfig();

    this.configForm.get('requireAuth').valueChanges.subscribe(value => {
        this.authRequired = value;
        if(value && !this.disabled) {
          this.configForm.get('emailAccount').enable();
          this.configForm.get('accountPassword').enable();
        } else {
          this.configForm.get('emailAccount').disable();
          this.configForm.get('accountPassword').disable();
        }
      });

    if(!this.loginService.userCan("admin.mail.config.update")) {
      this.disabled=true;
      for(let control in this.configForm.controls)
        this.configForm.get(control).disable();
    }
  }

  getConfig() {
    this.emailConfigService.getEmailConfig().subscribe(resp => {
      this.configForm.patchValue(resp);
      this.configForm.markAsPristine();
    });
  }


  setConfig() {
    if(!this.configForm.valid)
      return;

    if(!this.loginService.userCan("admin.email.config.update"))
      return;

    this.emailConfigService.setEmailConfig(this.configForm.value).subscribe(() => 
      this.configForm.markAsPristine());
  }

  reset() {
    this.getConfig();
  }

  delete(directive: FormGroupDirective) {
    if(!this.loginService.userCan("admin.email.config.delete"))
      return;

    this.openDialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: {"title": "Confirm Delete",
             "text" : "Are you sure you want to clear the email configuration?",
             "delete": (): Observable<void> => { 
                 return this.emailConfigService.deleteEmailConfig(); 
               }
            }
    });

    this.openDialogRef.afterClosed().subscribe(result => {
        this.openDialogRef= null;
        directive.resetForm();
      });
  }
}
