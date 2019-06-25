import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { SCCommonModule } from '../sccommon/sccommon.module';
import { MinistryModule } from '../ministry/ministry.module';

import { ScheduleRoutingModule } from './schedule-routing.module';

import { CalendarComponent } from './calendar/calendar.component';
import { SettingsComponent } from './settings/settings.component';
import { RoomDialogComponent } from './room-dialog/room-dialog.component';
import { EquipmentDialogComponent } from './equipment-dialog/equipment-dialog.component';
import { AvailabilityComponent } from './availability/availability.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { RecurringEditDialogComponent } from './recurring-edit-dialog/recurring-edit-dialog.component';

import { SelectedEvent } from './event';
import { RoomAvailabilityDialogComponent } from './room-availability-dialog/room-availability-dialog.component';
import { RecurrenceComponent } from './recurrence/recurrence.component';
import { DaysOfWeekComponent } from './days-of-week/days-of-week.component';
import { ReservationComponent } from './reservation/reservation.component';
import { DateSeriesComponent } from './date-series/date-series.component';
import { CustomDateSeriesComponent } from './custom-date-series/custom-date-series.component';
import { CustomEventDialogComponent } from './custom-event-dialog/custom-event-dialog.component';

@NgModule({
  declarations: [
    CalendarComponent,
    SettingsComponent,
    RoomDialogComponent,
    EquipmentDialogComponent,
    AvailabilityComponent,
    EventDetailsComponent,
    RecurringEditDialogComponent,
    RoomAvailabilityDialogComponent,
    RecurrenceComponent,
    DaysOfWeekComponent,
    ReservationComponent,
    DateSeriesComponent,
    CustomDateSeriesComponent,
    CustomEventDialogComponent
  ],
  imports: [
    ScheduleRoutingModule,

    SCCommonModule,
    MinistryModule,

    //Angular basics
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    
    //Bootstrap
    NgbModule,

    //Material
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatTooltipModule,
    
    //Calendar
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })

  ],
  entryComponents: [
    RoomDialogComponent,
    EquipmentDialogComponent,
    RecurringEditDialogComponent,
    RoomAvailabilityDialogComponent,
    CustomEventDialogComponent
  ],
  providers: [
    SelectedEvent
  ]
})
export class ScheduleModule { }
