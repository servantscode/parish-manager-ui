import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith, reduce } from 'rxjs/operators'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { DownloadService, FamilyService, LoginService } from 'sc-common';
import { SCValidation } from 'sc-common';
import { Family, Person } from 'sc-common';

import { Donation } from '../../finance/donation';
import { Pledge } from '../../finance/pledge';
import { DonationDialogComponent } from '../../finance/donation-dialog/donation-dialog.component';
import { PledgeDialogComponent } from '../../finance/pledge-dialog/pledge-dialog.component';
import { DonationService } from '../../finance/services/donation.service';
import { PledgeService } from '../../finance/services/pledge.service';

import { FamilyMemberListComponent } from '../family-member-list/family-member-list.component';

import { DeleteDialogComponent } from '../../sccommon/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-family-detail',
  templateUrl: './family-detail.component.html',
  styleUrls: ['./family-detail.component.scss']
})
export class FamilyDetailComponent implements OnInit {

  DonationDialogComponent = DonationDialogComponent;

  family: Family;

  public editMode = false;
  private pledges: Pledge[];

  familyForm = this.fb.group({
      id: '',
      surname: ['', Validators.required],
      homePhone: ['', Validators.pattern(SCValidation.PHONE)],
      envelopeNumber: ['', Validators.pattern(SCValidation.NUMBER)],
      address: null,
      preferences: {}
    });

  filteredOptions: Observable<string[]>;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private familyService: FamilyService,
              private donationService: DonationService,
              private pledgeService: PledgeService,
              public loginService: LoginService,
              public downloadService: DownloadService,
              private fb: FormBuilder,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.getFamily();
  }

  getFamily(): void {
    this.family = new Family();
    const id = +this.route.snapshot.paramMap.get('id');

    if(id > 0) {
      if(!this.loginService.userCan('family.read'))
        this.router.navigate(['not-found']);

      this.familyService.get(id, true).
        subscribe(family => {
          this.family = family;
          this.familyForm.patchValue(family);
          this.familyService.getPreferences(id).subscribe(prefs => this.familyForm.get("preferences").setValue(prefs));
        });

      this.loadPledges(id);
      this.familyForm.disable();

    } else {
      if(!this.loginService.userCan('family.create'))
        this.router.navigate(['not-found']);

      this.editMode = true;
    }
  }

  loadPledges(id): void {
    if(!this.loginService.userCan('pledge.read'))
      return;

    this.pledgeService.getPledges(id).
      subscribe(pledges => this.pledges = pledges);
  }

  assignEnvelopeNumber() {
    this.familyService.getNextEnvelope().subscribe(envelopeNum => this.familyForm.get('envelopeNumber').setValue(envelopeNum));
  }

  goBack(): void {
    if(this.editMode && this.family.id > 0) {
      this.familyForm.disable();
      this.editMode = false;
    } else {
      this.router.navigate(['person']);
    }
  }

  save(): void {
    if(this.family.id > 0) {
      if(!this.loginService.userCan('family.update'))
        this.router.navigate(['not-found']);

      this.familyService.update(this.familyForm.value).
        subscribe(family => {
          this.family = family;
          this.familyForm.disable();
          this.editMode = false;
          this.getFamily();
        });
    } else {
      if(!this.loginService.userCan('family.create'))
        this.router.navigate(['not-found']);

      this.familyService.create(this.familyForm.value).
        subscribe(family => {
          this.family = family;
          this.familyForm.disable();
          this.editMode = false;
          this.router.navigate(['family', 'detail', family.id]);
        });
    }
  }

  enableEdit(): void {
    this.familyForm.enable();
    this.editMode=true;
  }

  public openPledgeForm(pledge: Pledge) {
    if(!this.loginService.userCan('pledge.create'))
      return;

    var item = pledge;
    if(!item) {
      item = new Pledge();
      item.familyId=this.family.id;
    }

    const pledgeRef = this.dialog.open(PledgeDialogComponent, {
      width: '800px',
      data: {"item": item}
    });

    pledgeRef.afterClosed().subscribe(result => {
      this.loadPledges(this.family.id);
    });
  }

  deactivate(): void {
    this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: {"title": "Confirm Deactivation",
             "text" : "Are you sure you want to deactivate " + this.family.identify() + "?",
             "delete": (): Observable<void> => { 
               return this.familyService.delete(this.family); 
             },
             "actionName":"Deactivate",
             "allowPermaDelete": this.loginService.userCan("admin.family.delete"),
             "permaDelete": (): Observable<void> => { 
               return this.familyService.delete(this.family, true); 
             },
             "nav": () => { 
               this.goBack();
             }
        }
    });
  }

  delete(): void {
    if(!this.loginService.userCan('admin.family.delete'))
      return;

    this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: {"title": "Confirm Deletion",
             "text" : "Are you sure you want to delete " + this.family.identify() + "?",
             "delete": (): Observable<void> => { 
               return this.familyService.delete(this.family, true); 
             },
             "actionName":"Delete",
             "nav": () => { 
               this.goBack();
             }
        }
    });
  }

  deletePledge(pledge: Pledge): void {
    if(!this.loginService.userCan('pledge.delete'))
      return;

    this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: {"title": "Confirm Deletion",
             "text" : "Are you sure you want to delete " + pledge.identify() + "?",
             "delete": (): Observable<void> => { 
               return this.pledgeService.delete(pledge, true); 
             },
             "actionName":"Delete",
             "nav": () => { 
               this.loadPledges(this.family.id);
             }
        }
    });
  }


  activate(): void {
    if(!this.loginService.userCan('family.update'))
      return;

    this.family.inactive=false;
    this.family.inactiveSince=null;
    this.family.members.forEach(m => {
        m.inactive = false;
        delete m['relationship'];
      });
    this.familyService.update(this.family).subscribe(family => {
      this.family = family;
      this.familyForm.patchValue(family);
    });
  }

  attachPhoto(guid: any): void {
    this.familyService.attachPhoto(this.family.id, guid)
    .subscribe(() => {
      this.family.photoGuid = guid
    });
  }

  downloadAnnualReport(): void {
    const filename = this.family.surname + "-annual-report-2019.pdf";
    this.downloadService.downloadPdf(this.donationService.annualReport(this.family.id, 2019), filename);
  }
}
