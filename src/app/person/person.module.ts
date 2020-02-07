import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';

import { SCCommonModule } from '../sccommon/sccommon.module';
import { MinistryModule } from '../ministry/ministry.module';
import { AdminModule } from '../admin/admin.module';
import { SacramentModule } from '../sacrament/sacrament.module';

import { PersonRoutingModule } from './person-routing.module';

import { PersonDetailComponent } from './person-detail/person-detail.component';
import { FamilyDetailComponent } from './family-detail/family-detail.component';
import { FamilyMemberListComponent } from './family-member-list/family-member-list.component';
import { PeopleListComponent } from './people-list/people-list.component';
import { PersonTabsComponent } from './person-tabs/person-tabs.component';

import { RelationshipDialogComponent } from './relationship-dialog/relationship-dialog.component';
import { FamilyRelationshipsComponent } from './family-relationships/family-relationships.component';
import { PersonDialogComponent } from './person-dialog/person-dialog.component';
import { RegistrationReviewComponent } from './registration-review/registration-review.component';

import { RegistrationService } from './services/registration.service';

import { ScCommonModule } from 'sc-common';
import { FamilyMergeDialogComponent } from './family-merge-dialog/family-merge-dialog.component';
import { SelectPersonDialogComponent } from './select-person-dialog/select-person-dialog.component';
import { FamilyFinancialComponent } from './family-financial/family-financial.component';
import { FamilySplitDialogComponent } from './family-split-dialog/family-split-dialog.component';
import { FamilyFormComponent } from './family-form/family-form.component';

@NgModule({
  declarations: [
    PersonDetailComponent,
    FamilyDetailComponent,  
    FamilyMemberListComponent,
    PeopleListComponent,
    PersonTabsComponent,
    RelationshipDialogComponent,
    FamilyRelationshipsComponent,
    PersonDialogComponent,
    RegistrationReviewComponent,
    FamilyMergeDialogComponent,
    SelectPersonDialogComponent,
    FamilyFinancialComponent,
    FamilySplitDialogComponent,
    FamilyFormComponent
  ],
  imports: [
    PersonRoutingModule,
    ScCommonModule,

    SCCommonModule,
    MinistryModule,
    AdminModule,
    SacramentModule,

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
    MatToolbarModule,
    MatRadioModule
  ],
  exports: [
  ],
  providers: [
      RegistrationService
  ],
  entryComponents: [
    RelationshipDialogComponent,
    PersonDialogComponent,
    FamilyMergeDialogComponent,
    SelectPersonDialogComponent,
    FamilySplitDialogComponent
  ]
})
export class PersonModule { }
