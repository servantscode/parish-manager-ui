import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'
import { MatDialog, MatDialogRef } from '@angular/material';

import { LoginService } from '../../sccommon/services/login.service';
import { SCValidation } from '../../sccommon/validation';

import { Event } from '../../schedule/event';
import { EventService } from '../../schedule/services/event.service';

import { MetricsService } from '../../metrics/services/metrics.service';
import { MinistryEnrollmentStats } from '../../metrics/metrics-response';

import { Ministry } from '../ministry';
import { MinistryService, ContactType } from '../services/ministry.service';
import { MinistryRoleService } from '../services/ministry-role.service';

import { DeleteDialogComponent } from '../../sccommon/delete-dialog/delete-dialog.component';
import { EmailDialogComponent } from '../../sccommon/email-dialog/email-dialog.component';
import { MinistryRoleDialogComponent } from '../ministry-role-dialog/ministry-role-dialog.component';

export enum KEY_CODE {
  ENTER = 13,
  ESCAPE = 27
}


@Component({
  selector: 'app-ministry-detail',
  templateUrl: './ministry-detail.component.html',
  styleUrls: ['./ministry-detail.component.scss']
})
export class MinistryDetailComponent implements OnInit {
  private ministry: Ministry;
  public upcomingEvents: Event[];
  private highlightedEvent: Event;

  private ministryStats: MinistryEnrollmentStats;

  public editMode = false;

  MinistryRoleDialogComponent = MinistryRoleDialogComponent;
  ContactType = ContactType;

  ministryForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: ['']
    });
  
  filteredOptions: Observable<string[]>;


  constructor(private router: Router,
              private route: ActivatedRoute,
              private ministryService: MinistryService,
              public ministryRoleService: MinistryRoleService,
              private eventService: EventService,
              public loginService: LoginService,
              private metricsService: MetricsService,
              private fb: FormBuilder,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.getMinistry();

    this.route.params.subscribe(
        params => {
            this.getMinistry();
        }
    );
  }

//Disabled until I can capture events from autocomplete without taking form action as well...
  // @HostListener('window:keyup', ['$event'])
  // keyEvent(event: KeyboardEvent) {    
  //   if (event.keyCode === KEY_CODE.ENTER) {
  //     this.save();
  //   }

  //   if (event.keyCode === KEY_CODE.ESCAPE) {
  //     this.goBack();
  //   }
  // }

  getMinistry(): void {
    this.ministry = new Ministry();
    const id = this.ministryId();

    if(id > 0) {
      if(!this.loginService.userCan('ministry.read'))
        this.router.navigate(['not-found']);

      this.ministryService.get(id).
        subscribe(ministry => {
          this.ministry = ministry;
          this.ministryForm.patchValue(ministry);
        });

      this.metricsService.getMinistryEnrollment(id).subscribe(stats => this.ministryStats = stats);

      this.eventService.getUpcomingEvents(id).
        subscribe(events => {
          this.upcomingEvents = events;
        });
    } else {
      if(!this.loginService.userCan('ministry.create'))
        this.router.navigate(['not-found']);
      this.editMode = true;
    }
  }

  goBack(): void {
    if(this.editMode && this.ministry.id > 0) {
      this.editMode = false;
    } else {
      this.router.navigate(['ministry']);
    }
  }

  save(): void {
    if(this.ministry.id > 0) {
      if(!this.loginService.userCan('ministry.update'))
        this.goBack();
      this.ministryService.update(this.ministryForm.value).
        subscribe(ministry => {
          this.ministry = ministry;
          this.editMode = false;
          this.router.navigate(['ministry', 'detail', ministry.id]);
        });
    } else {
      if(!this.loginService.userCan('ministry.create'))
        this.goBack();

      this.ministryService.create(this.ministryForm.value).
        subscribe(ministry => {
          this.ministry = ministry;
          this.editMode = false;
          this.router.navigate(['ministry', 'detail', ministry.id]);
        });      
    }
  }

  delete(): void {
    this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: {"title": "Confirm Delete",
             "text" : "Are you sure you want to delete " + this.ministry.identify() + "?",
             "delete": (): Observable<void> => { 
               return this.ministryService.delete(this.ministry); 
             },
             "nav": () => { 
               this.goBack();
             }
        }
    });
  }

  openMailDialog(contactType: ContactType) {
    if(!this.loginService.userCan('email.send'))
      return;

    this.ministryService.getEmailList(this.ministryId(), contactType).subscribe(list => {
        const donationRef = this.dialog.open(EmailDialogComponent, {
          width: '800px', 
          data: {"to": list}
        });
      });
  }

  enableEdit(): void {
    this.editMode=true;
  }

  highlightEvent(event: Event) {
    this.highlightedEvent = event;
  }

  ministryId() {
    return +this.route.snapshot.paramMap.get('id');
  }

  pathParams() {
    return {'id': this.ministryId()};
  }
}
