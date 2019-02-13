import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, filter, debounceTime, switchMap } from 'rxjs/operators'

import { SCValidation } from '../../sccommon/validation';

import { PledgeService } from '../services/pledge.service';

@Component({
  selector: 'app-pledge-dialog',
  templateUrl: './pledge-dialog.component.html',
  styleUrls: ['./pledge-dialog.component.scss']
})
export class PledgeDialogComponent implements OnInit {
  pledgeForm = this.fb.group({
      id: [0],
      familyId: [this.data.id, Validators.required],
      pledgeType: ['', Validators.required], 
      pledgeDate: [new Date(), Validators.required],
      pledgeStart: ['', Validators.required],
      pledgeEnd: ['', Validators.required],
      pledgeFrequency: ['WEEKLY', Validators.required],
      pledgeAmount: ['', [Validators.required, Validators.pattern(SCValidation.NUMBER)]],
      annualPledgeAmount: ['', [Validators.required, Validators.pattern(SCValidation.NUMBER)]]
    });

  pledgeTypes: Observable<string[]>;
  pledgeFrequencies: Observable<string[]>;
  calculatedAnnualPledge: number = 0;

  constructor(public dialogRef: MatDialogRef<PledgeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private pledgeService: PledgeService) { }
  
  ngOnInit() {
    if(this.data.pledge != null) {
      this.pledgeForm.patchValue(this.data.pledge)
      this.calculateAnnual();
    }

    this.pledgeTypes = this.pledgeForm.get('pledgeType').valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => this.pledgeService.getPledgeTypes()
          .pipe(
              map(resp => resp.filter(type => type.startsWith(value.toUpperCase())))              
            ))
      );

    this.pledgeFrequencies = this.pledgeForm.get('pledgeFrequency').valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => this.pledgeService.getPledgeFrequencies()
          .pipe(
              map(resp => resp.filter(type => type.startsWith(value.toUpperCase())))              
            ))
      );

    this.pledgeForm.get('pledgeFrequency').valueChanges
      .subscribe(() => this.calculateAnnual());

    this.pledgeForm.get('pledgeAmount').valueChanges
      .subscribe(() => this.calculateAnnual());
  }

  createDonation() {
    if(!this.pledgeForm.valid) {
      this.cancel();
      return;
    }

    if(this.pledgeForm.get("id").value > 0) {
      this.pledgeService.updatePledge(this.pledgeForm.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    } else {
      this.pledgeService.createPledge(this.pledgeForm.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  calculateAnnual() {
    const freq = this.pledgeForm.get('pledgeFrequency').value;
    const amount = this.pledgeForm.get('pledgeAmount').value;

    this.calculatedAnnualPledge = this.numPayments(freq) * amount; 
    this.pledgeForm.get('annualPledgeAmount').setValue(this.calculatedAnnualPledge);
  }

  numPayments(freq: string): number {
    switch (freq) {
      case "WEEKLY":
        return 52;
      case "MONTHLY": 
        return 12;
      case "QUARTERLY":
        return 4;
      default:
        return 1;
    }
  }

  cancel() {
    this.dialogRef.close();    
  }
}
