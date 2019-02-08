import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { SCCommonModule } from '../sccommon/sccommon.module';
import { MinistryModule } from '../ministry/ministry.module';
import { AdminModule } from '../admin/admin.module';

import { PersonDetailComponent } from './person-detail/person-detail.component';
import { FamilyDetailComponent } from './family-detail/family-detail.component';
import { FamilyMemberListComponent } from './family-member-list/family-member-list.component';
import { PeopleListComponent } from './people-list/people-list.component';

import { PersonService } from './services/person.service';
import { FamilyService } from './services/family.service';

import { PersonRoutingModule } from './person-routing.module';

@NgModule({
  declarations: [
    PersonDetailComponent,
    FamilyDetailComponent,  
    FamilyMemberListComponent,
    PeopleListComponent
  ],
  imports: [
    PersonRoutingModule,

    SCCommonModule,
    MinistryModule,
    AdminModule,

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
    MatAutocompleteModule
  ],
  exports: [
  ],
  providers: [
    PersonService,
    FamilyService
  ]
})
export class PersonModule { }
