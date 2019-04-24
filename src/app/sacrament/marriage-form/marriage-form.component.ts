import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'

import { LoginService } from '../../sccommon/services/login.service';
import { PersonService } from '../../sccommon/services/person.service';

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
          this.marriageForm.get('groom').setValue({name:resp.name, id:resp.id});
        });

      this.baptismService.getByPerson(personId).subscribe(resp =>{
          if(resp) {
            this.marriageForm.get('groomBaptismId').setValue(resp.id);
            this.marriageForm.get('groomBaptismLocation').setValue(resp.baptismLocation);
            this.marriageForm.get('groomBaptismDate').setValue(resp.baptismDate);
            this.marriageForm.get('groomFather').setValue(resp.father);
            this.marriageForm.get('groomMother').setValue(resp.mother);
          }
        });
    }
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