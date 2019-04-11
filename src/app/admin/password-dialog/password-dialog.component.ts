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
      password: ['', Validators.required],
      resetPassword: [false],
      sendEmail: [false]
    });

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
        this.passwordForm.get('password').setValidators(email? []: [Validators.required]);
      });
  }

  updatePassword() {
    if(this.passwordForm.valid) {
      this.credentialService.update(this.passwordForm.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  cancel() {
    this.dialogRef.close();    
  }

}
