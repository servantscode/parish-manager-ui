import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'

import { LoginService } from '../../sccommon/services/login.service';
import { PersonService } from '../../sccommon/services/person.service';

import { BaptismService } from '../services/baptism.service';

import { Baptism } from '../sacrament';

@Component({
  selector: 'app-baptism-form',
  templateUrl: './baptism-form.component.html',
  styleUrls: ['./baptism-form.component.scss']
})
export class BaptismFormComponent implements OnInit {

  baptismForm = this.fb.group({
      id: [''],
      person: ['', Validators.required],
      baptismLocation: ['', Validators.required],
      baptismDate: ['', Validators.required],
      birthLocation: [''],
      birthDate: [''],
      minister: ['', Validators.required],
      father: null,
      mother: null,
      godfather: null,
      godmother: null,
      witness: null,
      conditional: [false],
      reception: [false]
      // notations: ''
    });

  baptism: Baptism;

  constructor(private router: Router,
              private route: ActivatedRoute,
              public loginService: LoginService,  
              public baptismService: BaptismService,
              public personService: PersonService,
              private fb: FormBuilder) { }

  ngOnInit() {
    const personId = +this.route.snapshot.paramMap.get('id');

    this.baptismService.getByPerson(personId).subscribe(
        resp => {
          this.baptism=resp;
          if(resp)
            this.baptismForm.patchValue(resp);
        }
      );
  }

  submitForm() {
    if(!this.baptismForm.valid)
      return;

    const formValue = this.baptismForm.value;
    if(formValue.id == 0) {
      if(!this.loginService.userCan("baptism.create"))
        return;

      this.baptismService.create(formValue).subscribe(
        resp => {
          this.baptism=resp
          this.baptismForm.patchValue(resp);
        });

    } else {
      if(!this.loginService.userCan("baptism.update"))
        return;

      this.baptismService.update(formValue).subscribe(
        resp => {
          this.baptism=resp
          this.baptismForm.patchValue(resp);
        });
    }
  }
}
