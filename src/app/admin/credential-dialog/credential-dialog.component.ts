import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, filter, debounceTime, switchMap } from 'rxjs/operators'

import { LoginService } from '../../sccommon/services/login.service';

import { CredentialService } from '../services/credential.service';
import { RoleService } from '../services/role.service';

export interface PersonData {
  id: number;
}

@Component({
  selector: 'app-credential-dialog',
  templateUrl: './credential-dialog.component.html',
  styleUrls: ['./credential-dialog.component.scss']
})
export class CredentialDialogComponent implements OnInit {

  credentialForm = this.fb.group({
      personId: ['', Validators.required],
      role: ['', Validators.required],
      password: ['', Validators.required]
    });


  filteredRoles: Observable<string[]>;

  constructor(public dialogRef: MatDialogRef<CredentialDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: PersonData,
              private fb: FormBuilder,
              private loginService: LoginService,
              private credentialService: CredentialService,
              private roleService: RoleService) { }

  ngOnInit() {
    this.credentialForm.get('personId').setValue(this.data.id);

    this.filteredRoles = this.credentialForm.get('role').valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => this.roleService.getRoleNames()
          .pipe(
              map(resp => resp.filter(role => role.startsWith(value)))              
            ))
      );
  }

  createCredential() {
    if(this.credentialForm.valid) {
      this.credentialService.createCredentials(this.credentialForm.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    } else {
      this.cancel();
    }
  }

  cancel() {
    this.dialogRef.close();    
  }
}
