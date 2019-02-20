import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs';

import { RoleDialogComponent } from '../role-dialog/role-dialog.component';
import { CredentialDialogComponent } from '../credential-dialog/credential-dialog.component';

import { CredentialService } from '../services/credential.service';
import { RoleService } from '../services/role.service';

import { Role } from '../role';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  RoleDialogComponent = RoleDialogComponent;
  CredentialDialogComponent = CredentialDialogComponent;

  private refreshNeeded = new Subject<string>();

  public selectedRole: Role;

  constructor(public roleService: RoleService,
              private credentialService: CredentialService) { }

  ngOnInit() {
  }

  roleSelected(role: Role) {
    this.credentialService.selectedRole=role;
    this.selectedRole=role;
    this.refreshNeeded.next(role.name);
  }

  ngOnDestroy() {
    this.refreshNeeded.complete();
  }
}
