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

import { SelectedEvent } from './event';

@NgModule({
  declarations: [
    CalendarComponent,
    SettingsComponent,
    RoomDialogComponent,
    EquipmentDialogComponent,
    AvailabilityComponent,
    EventDetailsComponent
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
    EquipmentDialogComponent
  ],
  providers: [
    SelectedEvent
  ]
})
export class ScheduleModule { }
