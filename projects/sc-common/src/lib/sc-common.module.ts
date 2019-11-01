import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
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

import { NgxFileDropModule } from 'ngx-file-drop';

import { DisplayCamelCasePipe } from './pipes/display-camel-case.pipe';
import { TimesPipe } from './pipes/times.pipe';
import { ScEnumPipe } from './pipes/sc-enum.pipe';

import { ApiLocatorService } from './services/api-locator.service';
import { DownloadService } from './services/download.service';
import { LoginService } from './services/login.service';
import { MessageService } from './services/message.service';
import { OrganizationService } from './services/organization.service';
import { PersonService } from './services/person.service';
import { PhotoService } from './services/photo.service';
import { PreferencesService } from './services/preferences.service';

import { AddressComponent } from './address/address.component';
import { DateTimeComponent } from './date-time/date-time.component';
import { MultiPhoneNumberComponent } from './multi-phone-number/multi-phone-number.component';
import { PhotoComponent } from './photo/photo.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { PreferenceFormComponent } from './preference-form/preference-form.component';
import { ScAutoCompleteComponent } from './sc-auto-complete/sc-auto-complete.component';
import { ScEnumComponent } from './sc-enum/sc-enum.component';
import { ScMultiEnumComponent } from './sc-multi-enum/sc-multi-enum.component';
import { ScMultiSelectComponent } from './sc-multi-select/sc-multi-select.component';
import { ScPhoneNumberComponent } from './sc-phone-number/sc-phone-number.component';
import { ScSelectComponent } from './sc-select/sc-select.component';

import { PhotoUploadDialogComponent } from './photo-upload-dialog/photo-upload-dialog.component';

@NgModule({
  declarations: [
    DisplayCamelCasePipe,
    TimesPipe,
    ScEnumPipe,

    AddressComponent,
    DateTimeComponent,
    MultiPhoneNumberComponent,
    PhotoComponent,
    PreferencesComponent,
    PreferenceFormComponent,
    ScAutoCompleteComponent,
    ScEnumComponent,
    ScMultiEnumComponent,
    ScMultiSelectComponent,
    ScPhoneNumberComponent,
    ScSelectComponent,

    PhotoUploadDialogComponent
  ],
  imports: [
    //Angular basics
    CommonModule,
    HttpClientModule,
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

    NgxFileDropModule
  ],
  exports: [
    DisplayCamelCasePipe,
    TimesPipe,
    ScEnumPipe,

    AddressComponent,
    DateTimeComponent,
    MultiPhoneNumberComponent,
    PhotoComponent,
    PreferencesComponent,
    PreferenceFormComponent,
    ScAutoCompleteComponent,
    ScEnumComponent,
    ScMultiEnumComponent,
    ScMultiSelectComponent,
    ScPhoneNumberComponent,
    ScSelectComponent,

    HttpClientModule,
    MatDialogModule
  ],
  providers: [ 
    ApiLocatorService,
    DownloadService,
    LoginService,
    MessageService,
    OrganizationService,
    PersonService,
    PhotoService,
    PreferencesService,
  ], 
  entryComponents: [
    PhotoUploadDialogComponent
  ]
})
export class ScCommonModule { }
