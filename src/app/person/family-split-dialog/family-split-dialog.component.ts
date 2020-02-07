import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { differenceInYears } from 'date-fns';

import { Family, Person } from 'sc-common';
import { FamilyService, LoginService } from 'sc-common';

import { DataCleanupService } from '../../sccommon/services/data-cleanup.service';

@Component({
  selector: 'app-family-split-dialog',
  templateUrl: './family-split-dialog.component.html',
  styleUrls: ['./family-split-dialog.component.scss']
})
export class FamilySplitDialogComponent implements OnInit {

  availablePeople: Person[];

  selectedPeople: Person[] = [];

  headIndex = 0;

  familyForm = this.fb.group({
      family: null
    });


  constructor(public dialogRef: MatDialogRef<FamilySplitDialogComponent>,
              private fb: FormBuilder,
              public familyService: FamilyService,
              public loginService: LoginService,
              private cleanupService: DataCleanupService,
              @Inject(MAT_DIALOG_DATA) public data: any) { 
    this.availablePeople = data.availablePeople;
    this.selectedPeople = data.selectedPeople;
  }

  ngOnInit() {
  }

  toggleSelection(person: Person) {
    const index = this.selectedPeople.indexOf(person);
    if(index == -1)
      this.selectedPeople.push(person);
    else
      this.selectedPeople.splice(index, 1);

    if(this.selectedPeople.length == 1)
      this.headIndex = this.availablePeople.indexOf(this.selectedPeople[0]);
  }

  selectHead(event, headIndex: number) {
    this.headIndex = headIndex;
    event.stopPropagation();
  }

  performSplit() {
    if(!this.loginService.userCan("family.create"))
      this.dialogRef.close();

    const family = this.familyForm.get("family").value;

    //Set HeadOfHousehold
    this.availablePeople.forEach(p => p.headOfHousehold = false);
    this.availablePeople[this.headIndex].headOfHousehold=true;

    family.members = this.selectedPeople.map(person => this.cleanupService.prune(person, new Person().asTemplate()));
    this.dialogRef.close(family);
  }

  cancel() {
    this.dialogRef.close();    
  }

  currentAge(birthdate: Date): number {
    return differenceInYears(new Date(), birthdate);
  }
}
