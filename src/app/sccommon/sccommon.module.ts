import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

import { SCCommonRoutingModule } from './sccommon-routing.module';

import { PaginatedListComponent } from './paginated-list/paginated-list.component';
import { MessagesComponent } from './messages/messages.component';
import { LoginComponent } from './login/login.component';

import { LoginService } from './services/login.service';

@NgModule({
  declarations: [
    PaginatedListComponent,
    MessagesComponent,
    LoginComponent
  ],
  imports: [
    SCCommonRoutingModule,

    //Angular basics
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    
    //Bootstrap
    NgbModule,
    NgbModalModule,

    //Material
    MatDialogModule,
    MatInputModule
  ],
  exports: [
    PaginatedListComponent,
    MessagesComponent,
    LoginComponent
  ],
  providers: [ LoginService ]
})
export class SCCommonModule { }
