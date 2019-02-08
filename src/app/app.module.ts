import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms'
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { AppComponent } from './app.component';
import { AutofocusDirective } from './autofocus.directive';
import { NotFoundComponent } from './not-found/not-found.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { MetricsComponent } from './metrics/metrics.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DateInterceptor } from './services/date-interceptor';

import { SCCommonModule } from './sccommon/sccommon.module';
import { AdminModule } from './admin/admin.module';
import { MinistryModule } from './ministry/ministry.module';
import { FinanceModule } from './finance/finance.module';
import { PersonModule } from './person/person.module';
import { ScheduleModule } from './schedule/schedule.module';

import { AppRoutingModule } from './app-routing.module';

export function tokenGetter() {
  return localStorage.getItem('jwt-token');
}

@NgModule({
  declarations: [
    AppComponent,
    AutofocusDirective,
    NotFoundComponent,
    UserMenuComponent,
    MetricsComponent
  ],
  imports: [
    SCCommonModule,
    AdminModule,
    MinistryModule,
    FinanceModule,
    PersonModule,
    ScheduleModule,
    AppRoutingModule,

    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
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
    MatSelectModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
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
  bootstrap: [AppComponent]
})
export class AppModule { }
