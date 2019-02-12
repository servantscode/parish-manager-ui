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

  createNew: boolean = true;

  credentialForm = this.fb.group({
      id: ['', Validators.required],
      role: ['', Validators.required],
      password: ['', Validators.required]
    });


  filteredRoles: Observable<string[]>;

  constructor(public dialogRef: MatDialogRef<CredentialDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private credentialService: CredentialService,
              private roleService: RoleService,
              private personService: PersonService) { }

  ngOnInit() {
    if(this.data.item) {
      this.credentialForm.patchValue(this.data.item);
      this.createNew = false;
      this.credentialForm.get("password").clearValidators();
    }
  }

  createCredential() {
    if(this.credentialForm.valid) {
      if(this.createNew) {
        this.credentialService.create(this.credentialForm.value).
          subscribe(() => {
            this.dialogRef.close();
          });
      } else {
        this.credentialService.update(this.credentialForm.value).
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
