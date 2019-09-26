import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, filter, debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators'

import { DataCleanupService } from '../../sccommon/services/data-cleanup.service';

import { SCValidation, Family, FamilyService } from 'sc-common';

import { DonationService } from '../services/donation.service';
import { FundService } from '../services/fund.service';

import { Donation } from '../donation';
import { DonationPrediction } from '../donation-prediction';

import { doLater } from '../../sccommon/utils';

export enum KEY_CODE {
  PLUS = 107,
}

@Component({
  selector: 'app-record-donation',
  templateUrl: './record-donation.component.html',
  styleUrls: ['./record-donation.component.scss']
})
export class RecordDonationComponent implements OnInit {

  donationTypes = this.donationService.getDonationTypes.bind(this.donationService);

  donationForm = this.fb.group({
      donationDate: [new Date(), Validators.required],
      fundId: [this.defaultFund(), Validators.required],
      donations: this.fb.array([
          this.newRow()
        ])
    });

  constructor(private fb: FormBuilder,
              private donationService: DonationService,
              public fundService: FundService,
              private familyService: FamilyService,
              private cleaningService: DataCleanupService) { }
  
  ngOnInit() {
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): boolean {    
    if (event.keyCode === KEY_CODE.PLUS) {
      this.addRow();
      return false;
    }
  }

  addRow() {
    const control = this.donationControls();
    
    for(let donation of control.controls) {
      for(let key of Object.keys((<FormGroup>donation).controls)) {
        (<FormGroup>donation).controls[key].markAsTouched();
      }
    }

    const rowNum = control.length;
    control.push(this.newRow());

    doLater(function() {document.getElementById("envelope-" + rowNum).focus()}.bind(this));
  }

  donationControls(): FormArray {
    return <FormArray>this.donationForm.controls['donations'];
  }

  deleteRow(i: number) {
    const control = this.donationControls();
    control.removeAt(i);
    if(control.length == 0) {
      this.donationControls().push(this.newRow());
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

    const checkNumber = group.get('checkNumber');
    const transactionId = group.get('transactionId');
    group.get('donationType').valueChanges.subscribe(
      (type: string) => {
          if (type === 'CHECK') {
              checkNumber.setValidators([Validators.required, Validators.pattern(SCValidation.NUMBER)]);
          }
          else {
              checkNumber.setValidators([Validators.pattern(SCValidation.NUMBER)]);
              checkNumber.setValue(null);
          }

          if (type === 'CHECK' || type === 'CASH') {
            transactionId.setValue(null);
          }
          checkNumber.updateValueAndValidity();
      });


    group.get('envelopeNumber').valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => this.predictGroup(group, 'envelopeNumber'));

    group.get('familyId').valueChanges.pipe(distinctUntilChanged())
      .subscribe(() => this.predictGroup(group, 'familyId'));

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
    if(!this.donationForm.valid)
      return;

    var donations: Donation[] = [];
    const donationDate = this.donationForm.get('donationDate').value;
    const fundId = this.donationForm.get('fundId').value;

    for(let control of (<FormArray>this.donationForm.controls['donations']).controls) {
      var tempDon = this.cleaningService.prune(control.value, new Donation().asTemplate());
      tempDon.donationDate = donationDate;
      tempDon.fundId = fundId;
      donations.push(tempDon);
    }
    
    localStorage.setItem('donation-fund', fundId);

    this.donationService.createDonations(donations).
      subscribe(() => {
        const controls = this.donationControls();
        controls.clear();
        controls.push(this.newRow());
      });
  }

  predictGroup(group, type:string) {
    var familyId = (type === 'familyId')? group.get("familyId").value: 0;
    var envelopeNumber = (type === 'envelopeNumber')? group.get("envelopeNumber").value: 0;

    if(familyId == 0 && envelopeNumber == 0)
      return;

    const fundId = this.donationForm.get('fundId').value;
    this.donationService.getDonationPrediction(fundId, familyId, envelopeNumber)
      .subscribe( prediction => {
          if(!prediction) {
            group.get("envelopeNumber").setErrors({'Envelope number not found': true});
            group.get("familyId").reset();
            group.get("amount").reset();
            group.get("donationType").reset();
          } else {
            group.patchValue(prediction, {emitEvent: false});
            this.clearZero(group.get("envelopeNumber"));
            this.clearZero(group.get("amount"));
          }
        });
  }

  clearZero(field: AbstractControl) {
    if(field.value == 0)
      field.reset();
  }

  private defaultFund(): number {
    const fundId = localStorage.getItem('donation-fund');
    return fundId? +fundId: 1;
  }
}
