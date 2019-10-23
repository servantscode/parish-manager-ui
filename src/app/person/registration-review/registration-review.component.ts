import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { differenceInYears } from 'date-fns';

import { FamilyService, LoginService } from 'sc-common';
import { Family } from 'sc-common';

import { FamilyMergeDialogComponent } from '../family-merge-dialog/family-merge-dialog.component';

import { RegistrationService } from '../services/registration.service';

import { RegistrationRequest } from '../registration';

@Component({
  selector: 'app-registration-review',
  templateUrl: './registration-review.component.html',
  styleUrls: ['./registration-review.component.scss']
})
export class RegistrationReviewComponent implements OnInit {

  req: RegistrationRequest;
  possibleMatches: Family[];

  refresh: Subject<any> = new Subject<any>();

  constructor(private dialog: MatDialog,
              public loginService: LoginService,
              public familyService: FamilyService,
              public registrationService: RegistrationService) { }

  ngOnInit() {
  }


  select(reg: RegistrationRequest) {
    this.req = reg;
    this.registrationService.getPossibleMatches(reg.id).subscribe(matches => {
        this.possibleMatches = matches;
      });
  }

  currentAge(birthdate: Date): number {
    return differenceInYears(new Date(), birthdate);
  }


  setStatus(status: string) {
    this.registrationService.setStatus(this.req.id, status).subscribe(() => {
        this.req = null;
        this.refresh.next();
      });
  }

  addEnvelopeNumber() {
    this.familyService.getNextEnvelope().subscribe(num => this.req.familyData.envelopeNumber=num);
  }

  merge(existingFamily: Family) {

    const openDialogRef = this.dialog.open(FamilyMergeDialogComponent, {
        width: '800px',
        data: { "request": this.req.familyData,
                "existing": existingFamily
              }
      });

    openDialogRef.afterClosed().subscribe(result => {
        if(!result)
          return;

        this.familyService.update(result).subscribe(() => {
            this.registrationService.setStatus(this.req.id, "MERGED").subscribe(() => {
              this.req = null;
              this.refresh.next();
            });
          });       
      });
  }
}
