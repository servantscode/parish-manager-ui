import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

import { JwtModule } from '@auth0/angular-jwt';

import { FileDropModule } from 'ngx-file-drop';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { SCCommonRoutingModule } from './sccommon-routing.module';

import { environment } from '../../environments/environment';

import { PaginatedListComponent } from './paginated-list/paginated-list.component';
import { MessagesComponent } from './messages/messages.component';
import { LoginComponent } from './login/login.component';
import { ScAutoCompleteComponent } from './sc-auto-complete/sc-auto-complete.component';
import { PhotoComponent } from './photo/photo.component';
import { PhotoUploadDialogComponent } from './photo-upload-dialog/photo-upload-dialog.component';
import { NotesComponent } from './notes/notes.component';
import { EmailDialogComponent } from './email-dialog/email-dialog.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { ScEnumComponent } from './sc-enum/sc-enum.component';
import { DateTimeComponent } from './date-time/date-time.component';

import { ApiLocatorService } from './services/api-locator.service';
import { EmailService } from './services/email.service';
import { LoginService } from './services/login.service';
import { PersonService } from './services/person.service';
import { PhotoService } from './services/photo.service';
import { DownloadService } from './services/download.service';
import { AdminOverrideDialogComponent } from './admin-override-dialog/admin-override-dialog.component';
import { ScSelectComponent } from './sc-select/sc-select.component';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
import { ScPhoneNumberComponent } from './sc-phone-number/sc-phone-number.component';

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
    PhotoUploadDialogComponent,
    NotesComponent,
    EmailDialogComponent,
    DeleteDialogComponent,
    ScEnumComponent,
    DateTimeComponent,
    AdminOverrideDialogComponent,
    ScSelectComponent,
    SearchDialogComponent,
    ScPhoneNumberComponent
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
    MatCheckboxModule,
    MatDatepickerModule,
    MatSelectModule,
    MatRadioModule,

    //JWT
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: environment.whitelistedDomains,
        blacklistedRoutes: []
      }
    }),

    FileDropModule,
    CKEditorModule
  ],
  exports: [
    PaginatedListComponent,
    MessagesComponent,
    LoginComponent,
    ScAutoCompleteComponent,
    PhotoComponent,
    NotesComponent,
    ScEnumComponent,
    DateTimeComponent,
    ScSelectComponent,
    ScPhoneNumberComponent
  ],
  providers: [ 
    ApiLocatorService,
    EmailService,
    LoginService,
    PersonService,
    PhotoService,
    DownloadService
  ],
  entryComponents: [
    PhotoUploadDialogComponent,
    EmailDialogComponent,
    DeleteDialogComponent,
    AdminOverrideDialogComponent,
    SearchDialogComponent
  ]
})
export class SCCommonModule { }
