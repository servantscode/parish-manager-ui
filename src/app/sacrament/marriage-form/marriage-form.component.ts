import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'

import { LoginService } from 'sc-common';
import { PersonService } from 'sc-common';

import { BaptismService } from '../services/baptism.service';
import { MarriageService } from '../services/marriage.service';

import { Baptism, Marriage } from '../sacrament';

@Component({
  selector: 'app-marriage-form',
  templateUrl: './marriage-form.component.html',
  styleUrls: ['./marriage-form.component.scss']
})
export class MarriageFormComponent implements OnInit {

  @Input() marriage: Marriage;
  @Output() marriageStored: EventEmitter<Marriage> = new EventEmitter();

  marriageForm = this.fb.group({
      id: [''],
      groom: ['', Validators.required],
      groomFather: null,
      groomMother: null,
      groomBaptismId: [''],
      groomBaptismLocation: [''],
      groomBaptismDate: [''],

      bride: ['', Validators.required],
      brideFather: null,
      brideMother: null,
      brideBaptismId: [''],
      brideBaptismLocation: [''],
      brideBaptismDate: [''],

      marriageLocation: ['', Validators.required],
      marriageDate: ['', Validators.required],
      minister: ['', Validators.required],
      witness1: null,
      witness2: null,
      notations: []
    });

  constructor(private router: Router,
              private route: ActivatedRoute,
              public loginService: LoginService,  
              public baptismService: BaptismService,
              public marriageService: MarriageService,
              public personService: PersonService,
              private fb: FormBuilder) { }

  ngOnInit() {
    if(this.marriage) {
      this.marriageForm.patchValue(this.marriage);
    } else {
      const personId = +this.route.snapshot.paramMap.get('id');

      this.personService.get(personId).subscribe(resp => {
          const party = resp.male? "groom": "bride";
          this.marriageForm.get(party).setValue({name:resp.name, id:resp.id});
          this.baptismService.getByPerson(personId).subscribe(baptism => {
              if(baptism) 
                this.autofill(baptism, party);
            });
        });

      this.marriageForm.get('groom').valueChanges.subscribe(value => {
          if(value && value.id)
            this.baptismService.getByPerson(value.id).subscribe(baptism =>{
                if(baptism) 
                  this.autofill(baptism, 'groom');
              });
        });

        this.marriageForm.get('bride').valueChanges.subscribe(value => {
          if(value && value.id)
            this.baptismService.getByPerson(value.id).subscribe(baptism => {
                if(baptism) 
                  this.autofill(baptism, 'bride');
              });
        });
    }
  }

  private autofill(baptism: Baptism, party: string) {
      this.marriageForm.get(party + 'BaptismId').setValue(baptism.id);
      this.marriageForm.get(party + 'BaptismLocation').setValue(baptism.baptismLocation);
      this.marriageForm.get(party + 'BaptismDate').setValue(baptism.baptismDate);
      this.marriageForm.get(party + 'Father').setValue(baptism.father);
      this.marriageForm.get(party + 'Mother').setValue(baptism.mother);
  }

  submitForm() {
    if(!this.marriageForm.valid)
      return;

    const formValue = this.marriageForm.value;
    if(formValue.id == 0) {
      if(!this.loginService.userCan("sacrament.marriage.create"))
        return;

      this.marriageService.create(formValue).subscribe(
        resp => {
          this.marriageStored.emit(resp);
        });

    } else {
      if(!this.loginService.userCan("sacrament.marriage.update"))
        return;

      this.marriageService.update(formValue).subscribe(
        resp => {
          this.marriageStored.emit(resp);
        });
    }
  }

  close() {
    this.marriageStored.emit(null);
  }
}