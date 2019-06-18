import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { LoginService } from '../../sccommon/services/login.service';
import { PhotoService } from '../../sccommon/services/photo.service';
import { PersonService } from '../../sccommon/services/person.service';

import { SCValidation } from '../../sccommon/validation';
import { Person } from '../../sccommon/person';
import { Family } from '../../sccommon/family';

import { FamilyService } from '../services/family.service';

import { FamilyMemberListComponent } from '../family-member-list/family-member-list.component'
import { EmailDialogComponent } from '../../sccommon/email-dialog/email-dialog.component';

import { DeleteDialogComponent } from '../../sccommon/delete-dialog/delete-dialog.component';

export enum KEY_CODE {
  ENTER = 13,
  ESCAPE = 27
}

@Component({
  selector: 'app-person-detail',
  templateUrl: './person-detail.component.html',
  styleUrls: ['./person-detail.component.scss']
})
export class PersonDetailComponent implements OnInit {
  private personId: number;
  public person: Person;

  public editMode = false;

  personForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      male: true,
      email: ['', Validators.email],
      phoneNumber: ['', Validators.pattern(SCValidation.PHONE)],
      headOfHousehold: [''],
      birthdate: [''],
      memberSince: [''],
      parishioner: [true],
      baptized: [''],
      confession: [''],
      communion: [''],
      confirmed: [''],
      maritalStatus: [''],
      ethnicity: [''],
      primaryLanguage: [''],
      family: this.fb.group({
        id: [''],
        surname: ['', Validators.required],
        homePhone: ['', Validators.pattern(SCValidation.PHONE)],
        envelopeNumber: ['', Validators.pattern(SCValidation.NUMBER)],
        address: this.fb.group({
          street1: [''],
          city: [''],
          state: ['', [SCValidation.actualState()]],
          zip: ['', [Validators.pattern(/^\d{5}$/)]]
        })
      })
    });
  
  filteredOptions: Observable<string[]>;

  public maritalStatuses = this.personService.getMaritalStatuses.bind(this.personService);
  public ethnicities = this.personService.getEthnicities.bind(this.personService);
  public languages = this.personService.getLanguages.bind(this.personService);

  constructor(private router: Router,
              private route: ActivatedRoute,
              private personService: PersonService,
              private familyService: FamilyService,
              public loginService: LoginService,  
              private photoService: PhotoService,
              private fb: FormBuilder,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.personId = +this.route.snapshot.paramMap.get('id');

    this.route.params.subscribe(
        params => {
            this.getPerson();
        }
    );

    this.filteredOptions = this.personForm.get('family.address.state').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
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

  getPerson(): void {
    this.person = new Person();
    this.person.memberSince = new Date();

    this.personId = +this.route.snapshot.paramMap.get('id');
    const familyId = +this.route.snapshot.queryParamMap.get('familyId');

    if(this.personId > 0) {
      if(!this.loginService.userCan('person.read'))
        this.router.navigate(['not-found']);

      this.personService.get(this.personId).
        subscribe(person => {
          if(person.family == null) {
            person.family = new Family();
          }
          this.person = person;
          this.personForm.patchValue(person);
        });
    } else if (familyId > 0) {
      if(!this.loginService.userCan('person.create'))
        this.router.navigate(['not-found']);

      this.editMode = true;
      this.familyService.get(familyId).
        subscribe(family => {
          this.person.family = family;
          this.personForm.patchValue(this.person);
        });
    } else {
      if(!this.loginService.userCan('person.create'))
        this.router.navigate(['not-found']);

      this.editMode = true;
      this.personForm.patchValue(this.person);        
    }
  }

  guessSurname() {
    const input = this.personForm.get("name").value;
    if(this.person.family.id == undefined) {
      var bits = input.trim().split(" ");
      if(bits.length > 1) {
        this.personForm.get("family.surname").setValue(bits.pop());
      } else {
        this.personForm.get("family.surname").setValue('');
      }
    }
  }

  goBack(): void {
    if(this.editMode && this.person.id > 0) {
      this.editMode = false;
    } else {
      this.router.navigate(['person']);
    }
  }

  save(): void {
    if(this.person.id > 0) {
      this.personService.update(this.personForm.value).
        subscribe(person => {
          this.person = person;
          this.router.navigate(['person', person.id, 'detail']);
          this.editMode=false;
        });
    } else {
      this.personService.create(this.personForm.value).
        subscribe(person => {
          this.person = person;
          this.router.navigate(['person', person.id, 'detail']);
          this.editMode=false;
        });      
    }
  }

  delete(): void {
    if(!this.loginService.userCan('person.delete'))
      return;

    this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: {"title": "Confirm Delete",
             "text" : "Are you sure you want to delete " + this.person.identify() + "?",
             "delete": (): Observable<void> => { 
               return this.personService.delete(this.person); 
             },
             "allowPermaDelete": this.loginService.userCan("admin.person.delete"),
             "permaDelete": (): Observable<void> => { 
               return this.personService.delete(this.person, true); 
             },
             "nav": () => { 
               this.goBack();
             }
        }
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return SCValidation.STATES.filter(option => option.toLowerCase().startsWith(filterValue));
  }

  capitalizeState(): void {
    const stateField = this.personForm.get("family.address.state");
    stateField.setValue(stateField.value.toUpperCase());
  }

  enableEdit(): void {
    this.editMode=true;
  }

  attachPhoto(guid: any): void {
    this.personService.attachPhoto(this.person.id, guid)
    .subscribe(() => {
      this.person.photoGuid = guid
    });
  }

  openMailDialog(): void {
    if(!this.loginService.userCan('email.send'))
      return;

    const emailRef = this.dialog.open(EmailDialogComponent, {
      width: '800px', 
      data: {"to": this.person.email}
    });
  }
}
