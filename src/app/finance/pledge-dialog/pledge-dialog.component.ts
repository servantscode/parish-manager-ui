import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { addYears, addDays } from 'date-fns';

import { SCValidation } from '../../sccommon/validation';
import { DataCleanupService } from '../../sccommon/services/data-cleanup.service';
import { LoginService } from 'sc-common';
import { DeleteDialogComponent } from '../../sccommon/delete-dialog/delete-dialog.component';

import { FundService } from '../services/fund.service';
import { PledgeService } from '../services/pledge.service';

import { Pledge } from '../pledge';

@Component({
  selector: 'app-pledge-dialog',
  templateUrl: './pledge-dialog.component.html',
  styleUrls: ['./pledge-dialog.component.scss']
})
export class PledgeDialogComponent implements OnInit {
  pledgeForm = this.fb.group({
      id: [0],
      familyId: [this.data.id, Validators.required],
      fundId: [1, Validators.required],
      pledgeType: ['', Validators.required], 
      pledgeDate: [new Date(), Validators.required],
      pledgeStart: ['', Validators.required],
      pledgeEnd: ['', Validators.required],
      pledgeFrequency: ['WEEKLY', Validators.required],
      pledgeAmount: ['', [Validators.required, Validators.pattern(SCValidation.NUMBER)]],
      annualPledgeAmount: ['', [Validators.required, Validators.pattern(SCValidation.NUMBER)]]
    });

  public pledgeTypes = this.pledgeService.getPledgeTypes.bind(this.pledgeService);
  public pledgeFrequencies = this.pledgeService.getPledgeFrequencies.bind(this.pledgeService);

  calculatedAnnualPledge: number = 0;

  constructor(public dialogRef: MatDialogRef<PledgeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private dialog: MatDialog,
              public fundService: FundService,
              private pledgeService: PledgeService,
              public loginService: LoginService,
              private dataCleanup: DataCleanupService) { }
  
  ngOnInit() {
    if(this.data.pledge != null) {
      this.pledgeForm.patchValue(this.data.pledge)
      this.calculateAnnual();
    }
    
    this.pledgeForm.get('pledgeFrequency').valueChanges
      .subscribe(() => this.calculateAnnual());

    this.pledgeForm.get('pledgeAmount').valueChanges
      .subscribe(() => this.calculateAnnual());

    this.pledgeForm.get('pledgeStart').valueChanges
      .subscribe(start => this.pledgeForm.get('pledgeEnd').setValue(addDays(addYears(start, 1), -1)));
  }

  createDonation() {
    if(!this.pledgeForm.valid) {
      this.cancel();
      return;
    }

    if(this.pledgeForm.get("id").value > 0) {
      this.pledgeService.update(this.pledgeForm.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    } else {
      this.pledgeService.create(this.pledgeForm.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  delete(): void {
    if(!this.loginService.userCan('pledge.delete'))
      return;

    var pledge = this.dataCleanup.prune<Pledge>(this.pledgeForm.value, new Pledge().asTemplate());
    this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: {"title": "Confirm Delete",
             "text" : "Are you sure you want to delete " + pledge.identify() + "?",
             "delete": (): Observable<void> => { 
               return this.pledgeService.delete(pledge); 
             },
             "nav": () => { 
               this.cancel();
             }
        }
    });
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
      case "SEMI_MONTHLY":
        return 24;
      case "MONTHLY": 
        return 12;
      case "QUARTERLY":
        return 4;
      case "SEMI_ANNUALLY":
        return 2;
      default:
        return 1;
    }
  }

  cancel() {
    this.dialogRef.close();    
  }
}
