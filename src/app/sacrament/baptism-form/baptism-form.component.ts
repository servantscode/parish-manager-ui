import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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

  @Input() baptism: Baptism;
  @Output() baptismStored: EventEmitter<Baptism> = new EventEmitter();

  baptismForm = this.fb.group({
      id: [''],
      person: ['', Validators.required],
      baptismLocation: ['', Validators.required],
      baptismDate: [new Date(), Validators.required],
      birthLocation: [''],
      birthDate: [''],
      minister: ['', Validators.required],
      father: null,
      mother: null,
      godfather: null,
      godmother: null,
      witness: null,
      conditional: [false],
      reception: [false],
      notations: []
    });

  constructor(private router: Router,
              private route: ActivatedRoute,
              public loginService: LoginService,  
              public baptismService: BaptismService,
              public personService: PersonService,
              private fb: FormBuilder) { }

  ngOnInit() {
    if(this.baptism) {
      this.baptismForm.patchValue(this.baptism);
    } else {
      const personId = +this.route.snapshot.paramMap.get('id');

      this.personService.get(personId).subscribe(resp => {
          this.baptismForm.get('person').setValue({name:resp.name, id:resp.id});
        });
    }
  }

  submitForm() {
    if(!this.baptismForm.valid)
      return;

    const formValue = this.baptismForm.value;
    if(formValue.id == 0) {
      if(!this.loginService.userCan("sacrament.baptism.create"))
        return;

      this.baptismService.create(formValue).subscribe(
        resp => {
          this.baptismStored.emit(resp);
        });

    } else {
      if(!this.loginService.userCan("sacrament.baptism.update"))
        return;

      this.baptismService.update(formValue).subscribe(
        resp => {
          this.baptismStored.emit(resp);
        });
    }
  }

  close() {
    this.baptismStored.emit(null);
  }
}
