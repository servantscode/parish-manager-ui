import { NgModule } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SCCommonModule } from './sccommon/sccommon.module';
import { AdminModule } from './admin/admin.module';
import { MinistryModule } from './ministry/ministry.module';
import { FinanceModule } from './finance/finance.module';
import { PersonModule } from './person/person.module';
import { ScheduleModule } from './schedule/schedule.module';
import { MetricsModule } from './metrics/metrics.module';
import { AccountModule } from './account/account.module';
import { SystemModule } from './system/system.module';
import { FormationModule } from './formation/formation.module';
import { VolunteerModule } from './volunteer/volunteer.module';

import { AutofocusDirective } from './autofocus.directive';
import { DateInterceptor } from './services/date-interceptor';
import { NotFoundComponent } from './not-found/not-found.component';
import { UserMenuComponent } from './user-menu/user-menu.component';

import { environment } from '../environments/environment'

import { ScCommonModule, AddOrgRequestInterceptor } from 'sc-common';

@NgModule({
  declarations: [
    AppComponent,
    AutofocusDirective,
    NotFoundComponent,
    UserMenuComponent
  ],
  imports: [
    ScCommonModule,
    
    SCCommonModule,
    AdminModule,
    MinistryModule,
    FinanceModule,
    PersonModule,
    ScheduleModule,
    MetricsModule,
    AccountModule,
    SystemModule,
    FormationModule,
    VolunteerModule,

    AppRoutingModule,

    HttpClientModule,

    BrowserModule,
    BrowserAnimationsModule,

    MatMenuModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: 'environment', useValue: environment },
    { provide: HTTP_INTERCEPTORS, useClass: DateInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AddOrgRequestInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
