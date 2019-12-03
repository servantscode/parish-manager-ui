import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Observable } from 'rxjs';

import { PhoneNumber } from 'sc-common';

import { CustomControl } from '../../sccommon/custom-control';

import { SelectPersonDialogComponent } from '../../person/select-person-dialog/select-person-dialog.component';
import { PersonDialogComponent } from '../../person/person-dialog/person-dialog.component';

import { DonorService } from '../services/donor.service';
import { IncomingDonationService } from '../services/incoming-donation.service';

import { Donor, IncomingDonation } from '../incoming-donation';

@Component({
  selector: 'app-review-incoming-donations',
  templateUrl: './review-incoming-donations.component.html',
  styleUrls: ['./review-incoming-donations.component.scss']
})
export class ReviewIncomingDonationsComponent implements OnInit {

  constructor(private dialog: MatDialog,
              public donorService: DonorService,
              public incomingDonationService: IncomingDonationService) { }

  ngOnInit() {
  }

  refresh = new Subject<any>();

  controls: CustomControl<IncomingDonation>[] = [
    new CustomControl("link", (item: IncomingDonation) => {
      if(!item)
        return;

      this.donorService.get(item.donorId).subscribe(donor => {
        const dialogRef = this.dialog.open(SelectPersonDialogComponent, {
            width: '400px'
          });

        dialogRef.afterClosed().subscribe(result => {
            if(result) {
              donor.personId = result.id;
              donor.familyId = result.family.id;
              this.donorService.update(donor).subscribe(result => {
                 this.refresh.next();
              });
            }
          });
      });

    }),
    new CustomControl("add", (item: IncomingDonation) => {
      if(!item)
        return;

      this.donorService.get(item.donorId).subscribe(donor => {
          const tempDonor = Object.assign({}, donor);

          const phoneNumber = new PhoneNumber();
          phoneNumber.phoneNumber = donor.phoneNumber;
          phoneNumber.primary = true;
          phoneNumber.type = 'OTHER';
          this.setPhoneNumbers(tempDonor, phoneNumber);


          const dialogRef = this.dialog.open(PersonDialogComponent, {
              width: '400px',
              data: {'item': tempDonor}
            });

          dialogRef.afterClosed().subscribe(result => {
              if(result) {
                donor.personId = result.id;
                donor.familyId = result.family.id;
                this.donorService.update(donor).subscribe(result => {
                   this.refresh.next();
                });
              }
            });

        });
    })
  ];

  setPhoneNumbers(donor:any, number: PhoneNumber) {
    const numbers: PhoneNumber[] = [];
    numbers.push(number);
    donor.phoneNumbers = numbers;
  }
}

