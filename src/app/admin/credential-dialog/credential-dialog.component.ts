import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, filter, debounceTime, switchMap } from 'rxjs/operators'

import { PersonService } from '../../person/services/person.service';

import { CredentialService } from '../services/credential.service';
import { RoleService } from '../services/role.service';

@Component({
  selector: 'app-credential-dialog',
  templateUrl: './credential-dialog.component.html',
  styleUrls: ['./credential-dialog.component.scss']
})
export class CredentialDialogComponent implements OnInit {

  credentialForm = this.fb.group({
      id: ['', Validators.required],
      role: ['', Validators.required],
      password: [{value:'', disabled:true}, Validators.required],
      resetPassword: [true],
      sendEmail: [true]
    });

  createNew: boolean = true;
  passwordRequired: boolean = false;

  constructor(public dialogRef: MatDialogRef<CredentialDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private credentialService: CredentialService,
              public roleService: RoleService,
              public personService: PersonService) { }

  ngOnInit() {
    if(this.data.item) {
      this.credentialForm.patchValue(this.data.item);
      if(this.data.item.id) {
        this.createNew = false;
        this.credentialForm.get('id').disable();
        this.credentialForm.get("resetPassword").disable();
        this.credentialForm.get("sendEmail").disable();
        this.passwordRequired=false;
      }
    }

    this.credentialForm.get('sendEmail').valueChanges.subscribe( email => {
      this.passwordRequired = !email;
      if(email) {
        this.credentialForm.get('password').disable();
        this.credentialForm.get('resetPassword').setValue(true);
      }
      else {
        this.credentialForm.get('password').enable();
      }
    });  
  }

  createCredential() {
    if(this.credentialForm.valid) {
      var credentialReq = this.credentialForm.value;
      if(credentialReq.sendEmail)
        credentialReq.resetPassword = true;

      if(this.createNew) {
        this.credentialService.create(credentialReq).
          subscribe(() => {
            this.dialogRef.close();
          });
      } else {
        this.credentialService.update(credentialReq).
          subscribe(() => {
            this.dialogRef.close();
          });
      }
    } else {
      this.cancel();
    }
  }

  cancel() {
    this.dialogRef.close();    
  }

  formData() {
    alert(JSON.stringify(this.credentialForm.value));
  }
}
