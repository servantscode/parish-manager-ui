import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, filter, debounceTime, switchMap } from 'rxjs/operators'

import { SCValidation, FamilyService } from 'sc-common';

import { DonationService } from '../services/donation.service';
import { FundService } from '../services/fund.service';

@Component({
  selector: 'app-donation-dialog',
  templateUrl: './donation-dialog.component.html',
  styleUrls: ['./donation-dialog.component.scss']
})
export class DonationDialogComponent implements OnInit {

  form = this.fb.group({
      id: [''],
      familyId: ['', Validators.required],
      fundId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern(SCValidation.USD)]],
      deductibleAmount: ['', [Validators.pattern(SCValidation.USD)]],
      donationDate: [new Date(), Validators.required],
      donationType: ['', Validators.required],
      checkNumber: ['', Validators.pattern(SCValidation.NUMBER)],
      transactionId: ['', Validators.pattern(SCValidation.NUMBER)]
    });

  public donationTypes = this.donationService.getDonationTypes.bind(this.donationService);

  constructor(public dialogRef: MatDialogRef<DonationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private donationService: DonationService,
              public familyService: FamilyService,
              public fundService: FundService) { }
  
  ngOnInit() {
    if(this.data.item)
      this.form.patchValue(this.data.item);

    const checkNumber = this.form.get('checkNumber');
    this.form.get('donationType').valueChanges.subscribe(
      (type: string) => {
          if (type === 'CHECK') {
              checkNumber.setValidators([Validators.required, Validators.pattern(SCValidation.NUMBER)]);
          }
          else {
              checkNumber.setValidators([Validators.pattern(SCValidation.NUMBER)]);
          }
          checkNumber.updateValueAndValidity();
      });

    this.form.get('amount').valueChanges.subscribe(value => {
        const deductible = this.form.get('deductibleAmount');
        if(!deductible.touched)
          deductible.setValue(value);
      });
  }

  donationType(): string {
    return this.form.get('donationType').value;
  }

  save() {
    if(!this.form.valid) {
      this.cancel();
      return;
    }

    if(this.form.get("id").value > 0) {
      this.donationService.update(this.form.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    } else {
      this.donationService.create(this.form.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  cancel() {
    this.dialogRef.close();    
  }
}
