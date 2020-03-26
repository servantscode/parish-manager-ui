import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { MatSelectModule } from '@angular/material/select';
// import { MatTooltipModule } from '@angular/material/tooltip';

import { SCCommonModule } from '../sccommon/sccommon.module';
import { ScCommonModule } from 'sc-common';

import { ScheduleModule } from '../schedule/schedule.module';

import { FormationRoutingModule } from './formation-routing.module';

import { ProgramComponent } from './program/program.component';
import { ProgramDialogComponent } from './program-dialog/program-dialog.component';
import { ProgramTabsComponent } from './program-tabs/program-tabs.component';
import { ClassroomComponent } from './classroom/classroom.component';
import { ClassroomDialogComponent } from './classroom-dialog/classroom-dialog.component';
import { ProgramGroupComponent } from './program-group/program-group.component';
import { ProgramGroupDialogComponent } from './program-group-dialog/program-group-dialog.component';
import { RegistrationComponent } from './registration/registration.component';
import { RegistrationDialogComponent } from './registration-dialog/registration-dialog.component';
import { SacramentalGroupComponent } from './sacramental-group/sacramental-group.component';
import { SacramentalGroupDialogComponent } from './sacramental-group-dialog/sacramental-group-dialog.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { AttendanceDialogComponent } from './attendance-dialog/attendance-dialog.component';
import { SessionComponent } from './session/session.component';
import { LinkSessionDialogComponent } from './link-session-dialog/link-session-dialog.component';

@NgModule({
  declarations: [
    ProgramComponent, 
    ProgramDialogComponent, 
    ProgramTabsComponent, 
    ClassroomComponent, 
    ClassroomDialogComponent, 
    ProgramGroupComponent, 
    ProgramGroupDialogComponent, 
    RegistrationComponent, 
    RegistrationDialogComponent, 
    SacramentalGroupComponent, 
    SacramentalGroupDialogComponent, 
    AttendanceComponent, 
    AttendanceDialogComponent, 
    SessionComponent, 
    LinkSessionDialogComponent
  ],
  imports: [
    FormationRoutingModule,

    SCCommonModule,
    ScCommonModule,
    
    ScheduleModule,

    //Angular basics
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    
    //Bootstrap
    NgbModule,

    //Material
    MatInputModule,
    MatToolbarModule,
    MatCheckboxModule
  ],
  entryComponents: [
    ProgramDialogComponent,
    ClassroomDialogComponent,
    ProgramGroupDialogComponent,
    RegistrationDialogComponent,
    SacramentalGroupDialogComponent,
    AttendanceDialogComponent,
    LinkSessionDialogComponent
  ]
})
export class FormationModule { }
