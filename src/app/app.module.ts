import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material';

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

import { AutofocusDirective } from './autofocus.directive';
import { DateInterceptor } from './services/date-interceptor';
import { NotFoundComponent } from './not-found/not-found.component';
import { UserMenuComponent } from './user-menu/user-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    AutofocusDirective,
    NotFoundComponent,
    UserMenuComponent
  ],
  imports: [
    SCCommonModule,
    AdminModule,
    MinistryModule,
    FinanceModule,
    PersonModule,
    ScheduleModule,
    MetricsModule,
    AccountModule,

    AppRoutingModule,

    HttpClientModule,

    BrowserModule,
    BrowserAnimationsModule,

    MatMenuModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: DateInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
