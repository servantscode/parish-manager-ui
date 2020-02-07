import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, startWith, debounceTime } from 'rxjs/operators'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { differenceInYears } from 'date-fns';

import { LoginService } from 'sc-common';
import { PhotoService } from 'sc-common';
import { PersonService } from 'sc-common';

import { SCValidation } from 'sc-common';
import { Person } from 'sc-common';
import { Family } from 'sc-common';

import { FamilyService } from 'sc-common';
import { RelationshipService } from 'sc-common';

import { FamilyMemberListComponent } from '../family-member-list/family-member-list.component'
import { EmailDialogComponent } from '../../sccommon/email-dialog/email-dialog.component';

import { DeleteDialogComponent } from '../../sccommon/delete-dialog/delete-dialog.component';

import { Relationship } from 'sc-common';
import { extractSurname } from '../utils';

import { doLater } from '../../sccommon/utils';

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
      maidenName: [''],
      nickname: [''],
      salutation: ['Mr.', Validators.required],
      suffix: [''],
      male: true,
      email: ['', Validators.pattern(SCValidation.EMAIL)],
      phoneNumbers: [null],
      headOfHousehold: [''],
      birthdate: [''],
      memberSince: [''],
      parishioner: [true],
      inactive: [false],
      inactiveSince: [''],
      deceased: [false],
      deathDate: [''],
      baptized: [''],
      confession: [''],
      communion: [''],
      confirmed: [''],
      holyOrders: [''],
      maritalStatus: [null],
      ethnicity: [null],
      primaryLanguage: [null],
      religion: ['CATHOLIC'],
      specialNeeds: [[]],
      occupation: [''],
      family: this.fb.group({
        id: [''],
        surname: ['', Validators.required],
        homePhone: ['', Validators.pattern(SCValidation.PHONE)],
        envelopeNumber: ['', Validators.pattern(SCValidation.NUMBER)],
        address: null,
        relationships: null
      }), 
    });
  
  filteredOptions: Observable<string[]>;

  public maritalStatuses = this.personService.getMaritalStatuses.bind(this.personService);
  public ethnicities = this.personService.getEthnicities.bind(this.personService);
  public languages = this.personService.getLanguages.bind(this.personService);
  public religions = this.personService.getReligions.bind(this.personService);
  public specialNeeds = this.personService.getSpecialNeeds.bind(this.personService);

  constructor(private router: Router,
              private route: ActivatedRoute,
              private personService: PersonService,
              private familyService: FamilyService,
              public loginService: LoginService,  
              private photoService: PhotoService,
              private relationshipService: RelationshipService,
              private fb: FormBuilder,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.personId = +this.route.snapshot.paramMap.get('id');

    this.route.params.subscribe(
        params => {
            this.getPerson();
        }
    );

    if(!this.personId || this.personId == 0) {
      this.personForm.get('birthdate').valueChanges.pipe(debounceTime(500)).subscribe(date => {
          this.predictRelationships();
        });
    }
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
  salutationAutoUpdater: Subscription;
  salutationListener: Subscription;

  getPerson(): void {
    this.person = new Person();
    //Default values
    this.person.religion = 'CATHOLIC';
    this.person.parishioner = true;
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
          this.personForm.markAllAsTouched();
          this.loadRelationships();
        });
    } else {
      if (familyId > 0) {
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

    this.salutationAutoUpdater = this.personForm.get('male').valueChanges
        .subscribe(isMale => {                                                                         
          // JSON parse needed to parse a boolean from a radio button string value... :(
          const salutation = JSON.parse(isMale)? 'Mr.': 'Ms.';
          this.personForm.get('salutation').setValue(salutation, {emitEvent: false});
        });

    this.salutationListener = this.personForm.get('salutation').valueChanges
        .subscribe(val => {
          this.salutationAutoUpdater.unsubscribe();
          this.salutationListener.unsubscribe();
          this.salutationAutoUpdater = null;
          this.salutationListener = null;
        });
  }

  loadRelationships() {
    this.relationshipService.getRelationships(this.person.id).subscribe(relationships => {
        this.personForm.get("family.relationships").setValue(relationships);
      });
  }

  assignEnvelopeNumber() {
    this.familyService.getNextEnvelope().subscribe(envelopeNum => this.personForm.get('family.envelopeNumber').setValue(envelopeNum));
  }

  guessSurname() {
    if(this.person.family.id == undefined) {
      const input = this.personForm.get("name").value;
      this.personForm.get("family.surname").setValue(extractSurname(input));
    }
  }

  private predictRelationships() {
    const relationships: Relationship[] = [];
    const person = this.personForm.value;
    if(this.person.family.members) {
      var foundParents = 0;
      var firstParentBDay = null;
      for(let member of this.person.family.members) {
        const r = new Relationship();
        r.personId = person.id;
        r.otherId = member.id;

        if(member.headOfHousehold) {
          if(Math.abs(differenceInYears(person.birthdate, member.birthdate)) < 14 &&
              person.male != member.male) {
            r.relationship = "SPOUSE";
            r.contactPreference = 1;
            foundParents++;
            firstParentBDay = member.birthdate;
          } else if(foundParents < 2 && 
              differenceInYears(person.birthdate, member.birthdate) > 15) {

            r.relationship = member.male? "FATHER": "MOTHER";
            r.guardian = true;
            r.contactPreference = 1;

            foundParents++;
            firstParentBDay = member.birthdate;
          } else {
            r.relationship = "OTHER";
            r.guardian = false;
            r.contactPreference = 0;
          }
        } else if(foundParents < 2 && 
              differenceInYears(person.birthdate, member.birthdate) > 15) {

            r.relationship = member.male? "FATHER": "MOTHER";
            r.guardian = true;
            r.contactPreference = 1;

            foundParents++;
            firstParentBDay = member.birthdate;
        } else if (Math.abs(differenceInYears(person.birthdate, member.birthdate)) < 15) {
          r.relationship = "SIBLING";
          r.guardian = false;
          r.contactPreference = 0;
        } else {
          r.relationship = "OTHER";
          r.guardian = false;
          r.contactPreference = 0;
        }
        relationships.push(r);
      }
    }    
    this.personForm.get("family.relationships").setValue(relationships);
  }

  goBack(): void {
    if(this.editMode && this.person.id > 0) {
      this.editMode = false;
    } else {
      this.router.navigate(['person']);
    }
  }

  save(): void {
    const p = this.personForm.value;
    const relationships = p.family.relationships;
    delete p.family.relationships;

    if(p.email)
      p.email = p.email.trim();

    if(this.person.id > 0) {
      this.personService.update(p).
        subscribe(person => {
          this.person = person;
          relationships.forEach(r => r.personId = person.id);
          if(relationships && relationships.length > 0) {
            this.relationshipService.updateRelationships(relationships, true).subscribe(() => {
              this.router.navigate(['person', person.id, 'detail']);
              this.editMode=false;
            });
          } else {
              this.router.navigate(['person', person.id, 'detail']);
              this.editMode=false;            
          }
        });
    } else {
      this.personService.create(p).
        subscribe(person => {
          this.person = person;
          if(relationships && relationships.length > 0) {
            relationships.forEach(r => r.personId = person.id);
            this.relationshipService.updateRelationships(relationships, true).subscribe(() => {
              this.router.navigate(['person', person.id, 'detail']);
              this.editMode=false;
            });
          } else {
            this.router.navigate(['person', person.id, 'detail']);
            this.editMode=false;
          }
        });      
    }
  }

  deactivate(): void {
    if(!this.loginService.userCan('person.delete'))
      return;

    this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: {"title": "Confirm Deactivation",
             "text" : "Are you sure you want to deactivate " + this.person.identify() + "?",
             "delete": (): Observable<void> => { 
               return this.personService.delete(this.person); 
             },
             "actionName":"Deactivate",
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

  delete(): void {
    if(!this.loginService.userCan('admin.person.delete'))
      return;

    this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: {"title": "Confirm Deletion",
             "text" : "Are you sure you want to delete " + this.person.identify() + "?",
             "delete": (): Observable<void> => { 
               return this.personService.delete(this.person, true); 
             },
             "actionName":"Delete",
             "nav": () => { 
               this.goBack();
             }
        }
    });
  }

  activate(): void {
    if(!this.loginService.userCan('person.update'))
      return;

    this.person.inactive=false;
    this.person.inactiveSince=null;
    this.person.family.members=null;
    this.personService.update(this.person).subscribe(person => {
      this.person = person;
      this.personForm.patchValue(person);
    });
  }

  enableEdit(): void {
    this.editMode=true;
    this.loadRelationships();
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

  getAge(): number {    
    return (this.person.birthdate == null)? null: differenceInYears(new Date(),  this.person.birthdate);
  }
}
