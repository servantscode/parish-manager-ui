import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormArray, FormGroup, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, filter, debounceTime, switchMap } from 'rxjs/operators'

import { SCValidation } from '../../sccommon/validation';
import { DataCleanupService } from '../../sccommon/services/data-cleanup.service';

import { FamilyService } from '../../person/services/family.service';
import { Family } from '../../person/family';

import { DonationService } from '../services/donation.service';
import { Donation } from '../donation';
import { DonationPrediction } from '../donation-prediction';


@Component({
  selector: 'app-bulk-donation-dialog',
  templateUrl: './bulk-donation-dialog.component.html',
  styleUrls: ['./bulk-donation-dialog.component.scss']
})
export class BulkDonationDialogComponent implements OnInit {

  filteredTypes: Observable<string[]>[] = [];

  donationForm = this.fb.group({
      donationDate: [new Date(), Validators.required],
      donations: this.fb.array([
          this.newRow()
        ])
    });

  constructor(public dialogRef: MatDialogRef<BulkDonationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private donationService: DonationService,
              private familyService: FamilyService,
              private cleaningService: DataCleanupService) { }
  
  ngOnInit() {
  }

  addRow() {
    const control = <FormArray>this.donationForm.controls['donations'];
    
    for(let donation of control.controls) {
      for(let key of Object.keys((<FormGroup>donation).controls)) {
        (<FormGroup>donation).controls[key].markAsTouched();
      }
    }

    control.push(this.newRow());
  }

  deleteRow(i: number) {
    const control = <FormArray>this.donationForm.controls['donations'];
    control.removeAt(i);
    this.filteredTypes.splice(i, 1);
    if(control.length == 0) {
      this.cancel();
    }
  }

  newRow() {
    var group = this.fb.group({
      envelopeNumber: [''],
      familyId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern(SCValidation.USD)]],
      donationType: ['', Validators.required],
      checkNumber: ['', Validators.pattern(SCValidation.NUMBER)],
      transactionId: ['', Validators.pattern(SCValidation.NUMBER)]
    });

    this.filteredTypes.push(
      group.get('donationType').valueChanges
        .pipe(
          debounceTime(300),
          switchMap(value => (value === null)? null: this.donationService.getDonationTypes()
            .pipe(
                map(resp => resp.filter(type => type.startsWith(value.toUpperCase())))              
              ))
        ));

    const checkNumber = group.get('checkNumber');
    group.get('donationType').valueChanges.subscribe(
      (type: string) => {
          if (type === 'CHECK') {
              checkNumber.setValidators([Validators.required, Validators.pattern(SCValidation.NUMBER)]);
          }
          else {
              checkNumber.setValidators([Validators.pattern(SCValidation.NUMBER)]);
          }
          checkNumber.updateValueAndValidity();
      });

    return group;
  }

  hasDirtyOrInvalidFields(donation: FormGroup): boolean {
    for(let key of Object.keys((<FormGroup>donation).controls)) {
      if(!donation.controls[key].valid && donation.controls[key].touched) 
        return true;
    }
    return false;
  }

  donationType(i: number): string {
    return (<FormArray>this.donationForm.controls['donations']).controls[i].get('donationType').value;
  }

  createDonations() {
    if(this.donationForm.valid) {
      var donations: Donation[] = [];
      const donationDate = this.donationForm.get('donationDate').value;

      for(let control of (<FormArray>this.donationForm.controls['donations']).controls) {
        var tempDon = this.cleaningService.prune(control.value, Donation.template());
        tempDon.donationDate = donationDate;
        donations.push(tempDon);
      }
      
      this.donationService.createDonations(donations).
        subscribe(() => {
          this.dialogRef.close();
        });
    } else {
      this.cancel();
    }
  }

  cancel() {
    this.dialogRef.close();    
  }

  // selectFamily(event: any, i: number): void {
  //   var selected = event.option.value;
  //   (<FormArray>this.donationForm.controls['donations']).controls[i].get('familyId').setValue(selected.id);
  //   this.predict(i, 'familyId');
  // }

  // selectFamilyName(family?: Family): string | undefined {
  //   return family ? typeof family === 'string' ? family : family.surname : undefined;
  // }

  predict(i: number, type: string): void {
    var group = (<FormArray>this.donationForm.controls['donations']).controls[i];
    var familyId = (type === 'familyId')? group.get("familyId").value: 0;
    var envelopeNumber = (type === 'envelopeNumber')? group.get("envelopeNumber").value: 0;
    this.donationService.getDonationPrediction(familyId, envelopeNumber)
      .subscribe( prediction => {
          group.patchValue(prediction);
          this.clearZero(group.get("envelopeNumber"));
          this.clearZero(group.get("amount"));
        });
  }

  clearZero(field: AbstractControl) {
    if(field.value == 0)
      field.reset();
  }
}