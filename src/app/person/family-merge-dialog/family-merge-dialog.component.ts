import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { differenceInYears } from 'date-fns';

import { Family, Person } from 'sc-common';

@Component({
  selector: 'app-family-merge-dialog',
  templateUrl: './family-merge-dialog.component.html',
  styleUrls: ['./family-merge-dialog.component.scss']
})
export class FamilyMergeDialogComponent implements OnInit {

  request: Family;
  existing: Family;
  merged: Family;

  selectedMergedPerson: Person;
  selectedExistingPerson: Person;

  constructor(public dialogRef: MatDialogRef<FamilyMergeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { 
    this.request = data.request;
    this.existing = data.existing;
    this.merged = this.cloneFamily(this.request);
    this.merged.id = this.existing.id;
    if(this.existing.envelopeNumber)
      this.merged.envelopeNumber = this.existing.envelopeNumber;
  }

  ngOnInit() {
  }

  save() {
    this.dialogRef.close(this.merged);
  }

  cancel() {
    this.dialogRef.close();    
  }

  selectMergedPerson(person: Person) {
    this.selectedMergedPerson = person;
    if(this.selectedExistingPerson)
      this.mergePerson(this.selectedMergedPerson, this.selectedExistingPerson);
  }

  selectExistingPerson(person: Person) {
    this.selectedExistingPerson = person;
    if(this.selectedMergedPerson)
      this.mergePerson(this.selectedMergedPerson, this.selectedExistingPerson);
  }

  isLinked(existing: Person): boolean {
    return this.merged.members.some(m => m.id == existing.id);
  }

  currentAge(birthdate: Date): number {
    return differenceInYears(new Date(), birthdate);
  }

  private mergePerson(mergedPerson: Person, existingPerson: Person) {
    this.merged.members.forEach(p => p.id = p.id == existingPerson.id? 0: p.id);
    mergedPerson.id = existingPerson.id;
    this.selectedMergedPerson = null;
    this.selectedExistingPerson = null;
  }

  private cloneFamily(input: Family): Family {
    const resp = new Family().asTemplate();
    for (let key of Object.keys(resp))
      resp[key] = key == 'members'? input[key].map(p => this.clonePerson(p)): input[key];
    return resp;
  }

  private clonePerson(input: Person): Person {
    const resp = new Person().asTemplate();
    for (let key of Object.keys(resp))
      resp[key] = input[key];
    return resp;
  }
}
