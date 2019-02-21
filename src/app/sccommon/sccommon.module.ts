import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { JwtModule } from '@auth0/angular-jwt';

import { FileDropModule } from 'ngx-file-drop';

import { SCCommonRoutingModule } from './sccommon-routing.module';

import { PaginatedListComponent } from './paginated-list/paginated-list.component';
import { MessagesComponent } from './messages/messages.component';
import { LoginComponent } from './login/login.component';

import { ApiLocatorService } from './services/api-locator.service';
import { LoginService } from './services/login.service';
import { PhotoService } from './services/photo.service';
import { ScAutoCompleteComponent } from './sc-auto-complete/sc-auto-complete.component';
import { PhotoComponent } from './photo/photo.component';
import { PhotoUploadDialogComponent } from './photo-upload-dialog/photo-upload-dialog.component';
import { environment } from '../../environments/environment';

export function tokenGetter() {
  return localStorage.getItem('jwt-token');
}

@NgModule({
  declarations: [
    PaginatedListComponent,
    MessagesComponent,
    LoginComponent,
    ScAutoCompleteComponent,
    PhotoComponent,
    PhotoUploadDialogComponent
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
    MatInputModule,
    MatAutocompleteModule,

    //JWT
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: environment.whitelistedDomains,
        blacklistedRoutes: []
      }
    }),

    FileDropModule
  ],
  exports: [
    PaginatedListComponent,
    MessagesComponent,
    LoginComponent,
    ScAutoCompleteComponent,
    PhotoComponent
  ],
  providers: [ 
    LoginService,
    PhotoService,
    ApiLocatorService
  ],
  entryComponents: [
    PhotoUploadDialogComponent
  ]
})
export class SCCommonModule { }
