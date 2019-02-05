import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'

import { Ministry } from '../ministry';
import { MinistryService } from '../services/ministry.service';
import { Event } from '../event';
import { EventService } from '../services/event.service';
import { LoginService } from '../services/login.service';
import { SCValidation } from '../validation';

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
  private upcomingEvents: Event[];
  private highlightedEvent: Event;

  private editMode = false;

  ministryForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: ['']
    });
  
  filteredOptions: Observable<string[]>;


  constructor(private router: Router,
              private route: ActivatedRoute,
              private ministryService: MinistryService,
              private eventService: EventService,
              private loginService: LoginService,
              private fb: FormBuilder) { }

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
    const id = +this.route.snapshot.paramMap.get('id');

    if(id > 0) {
      if(!this.loginService.userCan('ministry.read'))
        this.router.navigate(['not-found']);

      this.ministryService.get(id).
        subscribe(ministry => {
          this.ministry = ministry;
          this.ministryForm.patchValue(ministry);
        });

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
      this.router.navigate(['ministries']);
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

  enableEdit(): void {
    this.editMode=true;
  }

  highlightEvent(event: Event) {
    this.highlightedEvent = event;
  }
}
