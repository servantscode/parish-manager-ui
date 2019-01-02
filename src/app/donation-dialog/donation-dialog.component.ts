import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, filter, debounceTime, switchMap } from 'rxjs/operators'

import { DonationService } from '../services/donation.service';
import { SCValidation } from '../validation';

@Component({
  selector: 'app-donation-dialog',
  templateUrl: './donation-dialog.component.html',
  styleUrls: ['./donation-dialog.component.scss']
})
export class DonationDialogComponent implements OnInit {


  donationForm = this.fb.group({
      familyId: [this.data.id, Validators.required],
      amount: ['', [Validators.required, Validators.pattern(/^\d*(\.\d{0,2})?$/)]],
      donationDate: [new Date(), Validators.required],
      donationType: ['', Validators.required],
      checkNumber: ['', Validators.pattern(SCValidation.NUMBER)],
      transactionId: ['', Validators.pattern(SCValidation.NUMBER)]
    });

  filteredTypes: Observable<string[]>;

  constructor(public dialogRef: MatDialogRef<DonationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private donationService: DonationService) { }
  
  ngOnInit() {
    this.filteredTypes = this.donationForm.get('donationType').valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => this.donationService.getDonationTypes()
          .pipe(
              map(resp => resp.filter(type => type.startsWith(value.toUpperCase())))              
            ))
      );

    const checkNumber = this.donationForm.get('checkNumber');
    this.donationForm.get('donationType').valueChanges.subscribe(
      (type: string) => {
          if (type === 'CHECK') {
              checkNumber.setValidators([Validators.required, Validators.pattern(SCValidation.NUMBER)]);
          }
          else {
              checkNumber.setValidators([Validators.pattern(SCValidation.NUMBER)]);
          }
          checkNumber.updateValueAndValidity();
      });
  }

  donationType(): string {
    return this.donationForm.get('donationType').value;
  }

  createDonation() {
    if(this.donationForm.valid) {
      this.donationService.createDonation(this.donationForm.value).
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
}
