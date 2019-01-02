import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith, reduce } from 'rxjs/operators'
import { MatDialog, MatDialogRef } from '@angular/material';

import { Person } from '../person';
import { Family } from '../family';
import { Donation } from '../donation';
import { Pledge } from '../pledge';
import { FamilyService } from '../services/family.service';
import { DonationService } from '../services/donation.service';
import { PledgeService } from '../services/pledge.service';
import { FamilyMemberListComponent } from '../family-member-list/family-member-list.component';
import { DonationDialogComponent } from '../donation-dialog/donation-dialog.component';
import { PledgeDialogComponent } from '../pledge-dialog/pledge-dialog.component';
import { SCValidation } from '../validation';

@Component({
  selector: 'app-family-detail',
  templateUrl: './family-detail.component.html',
  styleUrls: ['./family-detail.component.scss']
})
export class FamilyDetailComponent implements OnInit {

  family: Family;

  private editMode = false;
  private donations: Donation[];
  private pledge: Pledge;
  private highlightedDonation: Donation;
  private totalDonations: number;

  familyForm = this.fb.group({
      id: '',
      surname: ['', Validators.required],
      address: this.fb.group({
        street1: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', [Validators.required, SCValidation.actualState()]],
        zip: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]]
      })
    });

  filteredOptions: Observable<string[]>;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private familyService: FamilyService,
              private donationService: DonationService,
              private pledgeService: PledgeService,
              private fb: FormBuilder,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.getFamily();
   
    this.filteredOptions = this.familyForm.get('address.state').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  getFamily(): void {
    this.family = new Family();
    const id = +this.route.snapshot.paramMap.get('id');

    if(id > 0) {
      this.familyService.getFamily(id).
        subscribe(family => {
          this.family = family;
          this.familyForm.patchValue(family);
        });

      this.loadDonations(id);

      this.loadPledge(id);

    } else {
      this.editMode = true;
    }
  }

  loadDonations(id): void {
    this.donationService.getFamilyContributions(id).
      subscribe(donations => {
          this.donations = donations;
          this.totalDonations = donations.map(donation => donation.amount).reduce((acc, amount) => acc + amount, 0);
        });
  }

  loadPledge(id): void {
    this.pledgeService.getPledge(id).
      subscribe(pledge => this.pledge = pledge);
  }

  goBack(): void {
    if(this.editMode && this.family.id > 0) {
      this.editMode = false;
    } else {
      this.router.navigate(['people']);
    }
  }

  save(): void {
    if(this.family.id > 0) {
      this.familyService.updateFamily(this.familyForm.value).
        subscribe(family => {
          this.family = family;
          this.editMode = false;
          this.getFamily();
        });
    } else {
      this.familyService.createFamily(this.familyForm.value).
        subscribe(family => {
          this.family = family;
          this.editMode = false;
          this.router.navigate(['family', 'detail', family.id]);
        });
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return SCValidation.STATES.filter(option => option.toLowerCase().startsWith(filterValue));
  }

  enableEdit(): void {
    this.editMode=true;
  }

  highlightDonation(donation: Donation) {
    this.highlightedDonation = donation;
  }

  public openDonationForm() {
    const donationRef = this.dialog.open(DonationDialogComponent, {
      width: '400px',
      data: {"id": this.family.id}
    });

    donationRef.afterClosed().subscribe(result => {
      this.loadDonations(this.family.id);
    });
  }

  public openPledgeForm() {
    const pledgeRef = this.dialog.open(PledgeDialogComponent, {
      width: '800px',
      data: {"id": this.family.id, "pledge": this.pledge}
    });

    pledgeRef.afterClosed().subscribe(result => {
      this.loadPledge(this.family.id);
    });
  }
}
