import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { LoginService } from '../services/login.service';
import { CredentialDialogComponent } from '../credential-dialog/credential-dialog.component';

@Component({
  selector: 'app-user-credentials',
  templateUrl: './user-credentials.component.html',
  styleUrls: ['./user-credentials.component.scss']
})
export class UserCredentialsComponent implements OnInit, OnChanges {
  @Input() personId: number;
  private hasLogin: boolean;
  private role: string;

  constructor(private loginService: LoginService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.checkCredentials();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.checkCredentials();
  }

  public revokeLogin() {
    this.loginService.deleteCredentials(this.personId).
      subscribe(success => {
        if(success) {
          this.hasLogin = false;
          this.role = null;
        }
      });
  }

  public openLoginForm() {
    const dialogRef = this.dialog.open(CredentialDialogComponent, {
      width: '400px',
      data: {"id": this.personId}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.checkCredentials();
    });
  }

  private checkCredentials() {
    if(this.personId <= 0)
      return;

    this.loginService.getCredentials(this.personId).
        subscribe(credentials => {
            if( credentials !== null && 'role' in credentials) {
              this.role = credentials.role;
              this.hasLogin = true;
            } else {
              this.hasLogin = false;
            }
          },
          error => {
            this.hasLogin = false;
          }
        );
  }
}
