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
import { ScheduleModule } from '../schedule/schedule.module';

import { FormationRoutingModule } from './formation-routing.module';

import { ProgramComponent } from './program/program.component';
import { ProgramDialogComponent } from './program-dialog/program-dialog.component';
import { ProgramTabsComponent } from './program-tabs/program-tabs.component';
import { SectionComponent } from './section/section.component';
import { SectionDialogComponent } from './section-dialog/section-dialog.component';
import { ProgramGroupComponent } from './program-group/program-group.component';
import { ProgramGroupDialogComponent } from './program-group-dialog/program-group-dialog.component';
import { RegistrationComponent } from './registration/registration.component';
import { RegistrationDialogComponent } from './registration-dialog/registration-dialog.component';
import { SacramentalGroupComponent } from './sacramental-group/sacramental-group.component';
import { SacramentalGroupDialogComponent } from './sacramental-group-dialog/sacramental-group-dialog.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { AttendanceDialogComponent } from './attendance-dialog/attendance-dialog.component';

@NgModule({
  declarations: [
    ProgramComponent, 
    ProgramDialogComponent, 
    ProgramTabsComponent, 
    SectionComponent, 
    SectionDialogComponent, ProgramGroupComponent, ProgramGroupDialogComponent, RegistrationComponent, RegistrationDialogComponent, SacramentalGroupComponent, SacramentalGroupDialogComponent, AttendanceComponent, AttendanceDialogComponent
  ],
  imports: [
    FormationRoutingModule,

    SCCommonModule,
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
    SectionDialogComponent,
    ProgramGroupDialogComponent,
    RegistrationDialogComponent,
    SacramentalGroupDialogComponent,
    AttendanceDialogComponent
  ]
})
export class FormationModule { }
