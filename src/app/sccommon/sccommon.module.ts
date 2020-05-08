import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CountdownModule } from 'ngx-countdown';

import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { SCCommonRoutingModule } from './sccommon-routing.module';

import { environment } from '../../environments/environment';

import { PaginatedListComponent } from './paginated-list/paginated-list.component';
import { LoginComponent } from './login/login.component';
import { NotesComponent } from './notes/notes.component';
import { MessagesComponent } from './messages/messages.component';
import { EmailDialogComponent } from './email-dialog/email-dialog.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';

import { EmailService } from './services/email.service';
import { DepartmentService } from './services/department.service';
import { CategoryService } from './services/category.service';
import { EventService } from './services/event.service';
import { RoomService } from './services/room.service';
import { EquipmentService } from './services/equipment.service';

import { AdminOverrideDialogComponent } from './admin-override-dialog/admin-override-dialog.component';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';

import { ScSearchBarComponent } from './sc-search-bar/sc-search-bar.component';
import { SaveSearchDialogComponent } from './save-search-dialog/save-search-dialog.component';

import { ScCommonModule } from 'sc-common';
import { CalendarComponent } from './calendar/calendar.component';

export function jwtOptionsFactory() {
  const domains = environment.whitelistedDomains;
  console.log("apiUrl is: " + environment.apiUrl);
  console.log("api domains are " + JSON.stringify(domains));
  return {
    tokenGetter: () => {
      return localStorage.getItem('jwt-token');
    },
    whitelistedDomains: domains
  }
}

@NgModule({
  declarations: [
    PaginatedListComponent,
    LoginComponent,
    MessagesComponent,
    NotesComponent,
    EmailDialogComponent,
    DeleteDialogComponent,
    AdminOverrideDialogComponent,
    SearchDialogComponent,
    SaveSearchDialogComponent,
    ScSearchBarComponent,
    CalendarComponent
  ],
  imports: [
    SCCommonRoutingModule,

    ScCommonModule,

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

    //Calendar
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),

    //JWT
    // JwtModule.forRoot({
    //   config: {
    //     tokenGetter: tokenGetter,
    //     whitelistedDomains: environment.whitelistedDomains,
    //     blacklistedRoutes: []
    //   }
    // }),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory
      }
    }),

    CKEditorModule,
    CountdownModule
  ],
  exports: [
    PaginatedListComponent,
    LoginComponent,
    NotesComponent,
    ScSearchBarComponent,
    MessagesComponent, 
    CalendarComponent
  ],
  providers: [ 
    EmailService,
    DepartmentService,
    CategoryService, 
    EventService,
    RoomService,
    EquipmentService
  ],
  entryComponents: [
    EmailDialogComponent,
    DeleteDialogComponent,
    AdminOverrideDialogComponent,
    SearchDialogComponent,
    SaveSearchDialogComponent
  ]
})
export class SCCommonModule { }
