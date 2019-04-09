import { Component, OnInit } from '@angular/core';

import { CredentialDialogComponent } from '../credential-dialog/credential-dialog.component';
import { CredentialService } from '../services/credential.service';

@Component({
  selector: 'app-user-access',
  templateUrl: './user-access.component.html',
  styleUrls: ['./user-access.component.scss']
})
export class UserAccessComponent implements OnInit {

  CredentialDialogComponent = CredentialDialogComponent;

  constructor(public credentialService: CredentialService) { }

  ngOnInit() {
  }

}
