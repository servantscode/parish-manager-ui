import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith, reduce } from 'rxjs/operators'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { FamilyService, LoginService } from 'sc-common';
import { SCValidation } from 'sc-common';
import { Family, Person } from 'sc-common';

import { DeleteDialogComponent } from '../../sccommon/delete-dialog/delete-dialog.component';

import { FamilyMemberListComponent } from '../family-member-list/family-member-list.component';

@Component({
  selector: 'app-family-detail',
  templateUrl: './family-detail.component.html',
  styleUrls: ['./family-detail.component.scss']
})
export class FamilyDetailComponent implements OnInit {

  family: Family;

  public editMode = false;

  familyForm = this.fb.group({
      family: [null, Validators.required]
    });

  constructor(private router: Router,
              private route: ActivatedRoute,
              private familyService: FamilyService,
              public loginService: LoginService,
              private fb: FormBuilder,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.getFamily();

    this.route.params.subscribe(
        params => {
            this.getFamily();
        }
    );

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
          this.familyForm.get("family").setValue(this.family);
        });

      this.familyForm.disable();

    } else {
      if(!this.loginService.userCan('family.create'))
        this.router.navigate(['not-found']);

      this.editMode = true;
    }
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

      this.familyService.update(this.familyForm.get("family").value).
        subscribe(family => {
          this.family = family;
          this.familyForm.disable();
          this.editMode = false;
          this.getFamily();
        });
    } else {
      if(!this.loginService.userCan('family.create'))
        this.router.navigate(['not-found']);

      this.familyService.create(this.familyForm.get("family").value).
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
      this.familyForm.get("family").setValue(family);
    });
  }

  attachPhoto(guid: any): void {
    this.familyService.attachPhoto(this.family.id, guid)
    .subscribe(() => {
      this.family.photoGuid = guid
    });
  }
}
