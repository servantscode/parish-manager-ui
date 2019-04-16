import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, filter, debounceTime, switchMap } from 'rxjs/operators'

import { CredentialService } from '../services/credential.service';

@Component({
  selector: 'app-password-dialog',
  templateUrl: './password-dialog.component.html',
  styleUrls: ['./password-dialog.component.scss']
})
export class PasswordDialogComponent implements OnInit {

  passwordForm = this.fb.group({
      id: ['', Validators.required],
      sendEmail: [true],
      resetPassword: [true],
      password: [{value:'', disabled: true}, Validators.required]
    });

  passwordRequired: boolean = false;

  constructor(public dialogRef: MatDialogRef<PasswordDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private credentialService: CredentialService) { }

  ngOnInit() {
    if(this.data.item) {
      this.passwordForm.patchValue(this.data.item);
      if(this.passwordForm.get("id").value == 0)
        this.cancel();
    }

    this.passwordForm.get('sendEmail').valueChanges.subscribe( email => {
        this.passwordRequired = !email;
        if(email) {
          this.passwordForm.get('password').disable();
          this.passwordForm.get('resetPassword').setValue(true);
        }
        else
          this.passwordForm.get('password').enable();
      });
  }

  updatePassword() {
    if(this.passwordForm.valid) {
      var form = this.passwordForm.value;
      //Ensure that reset is always set if sending email.
      if(form.sendEmail)
        form.resetPassword = true;
      this.credentialService.update(form).
        subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  cancel() {
    this.dialogRef.close();    
  }

}
