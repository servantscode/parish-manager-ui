import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms'
import { FormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AppComponent } from './app.component';
import { PersonDetailComponent } from './person-detail/person-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { AppRoutingModule } from './app-routing.module';
import { AutofocusDirective } from './autofocus.directive';
import { FamilyDetailComponent } from './family-detail/family-detail.component';
import { FamilyMemberListComponent } from './family-member-list/family-member-list.component';
import { PeopleListComponent } from './people-list/people-list.component';
import { MinistryListComponent } from './ministry-list/ministry-list.component';
import { MinistryDetailComponent } from './ministry-detail/ministry-detail.component';
import { MinistryMemberListComponent } from './ministry-member-list/ministry-member-list.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { UserCredentialsComponent } from './user-credentials/user-credentials.component';
import { CredentialDialogComponent } from './credential-dialog/credential-dialog.component';
import { MetricsComponent } from './metrics/metrics.component';
import { DonationComponent } from './donation/donation.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DateInterceptor } from './services/date-interceptor';
import { DonationDialogComponent } from './donation-dialog/donation-dialog.component';

export function tokenGetter() {
  return localStorage.getItem('jwt-token');
}

@NgModule({
  declarations: [
    AppComponent,
    PersonDetailComponent,
    MessagesComponent,
    AutofocusDirective,
    FamilyDetailComponent,
    FamilyMemberListComponent,
    PeopleListComponent,
    MinistryListComponent,
    MinistryDetailComponent,
    MinistryMemberListComponent,
    NotFoundComponent,
    LoginComponent,
    UserMenuComponent,
    UserCredentialsComponent,
    CredentialDialogComponent,
    MetricsComponent,
    DonationComponent,
    DonationDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    NgbModalModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatMenuModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxChartsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: [/localhost(:\d+)?/i], // Allow any localhost port to be called
        blacklistedRoutes: []
      }
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: DateInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [CredentialDialogComponent, DonationDialogComponent]
})
export class AppModule { }
