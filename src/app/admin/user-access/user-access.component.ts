import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { PasswordDialogComponent } from '../password-dialog/password-dialog.component';
import { CredentialDialogComponent } from '../credential-dialog/credential-dialog.component';
import { CredentialService } from '../services/credential.service';
import { Credentials } from '../credentials';

import { CustomControl } from '../../sccommon/custom-control';

@Component({
  selector: 'app-user-access',
  templateUrl: './user-access.component.html',
  styleUrls: ['./user-access.component.scss']
})
export class UserAccessComponent implements OnInit {

  CredentialDialogComponent = CredentialDialogComponent;

  constructor(private dialog: MatDialog,
              public credentialService: CredentialService) { }

  ngOnInit() {
  }

  controls: CustomControl<Credentials>[] = [
    new CustomControl("password", (item: Credentials) => {
      if(!item)
        return;

      this.dialog.open(PasswordDialogComponent, {
        width: '400px',
        data: {"item": item}
      });
    })
  ];

}
