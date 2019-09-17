import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'

import { LoginService } from 'sc-common';
import { PersonService } from 'sc-common';

import { BaptismService } from '../services/baptism.service';
import { ConfirmationService } from '../services/confirmation.service';

import { Baptism, Confirmation } from '../sacrament';

@Component({
  selector: 'app-confirmation-form',
  templateUrl: './confirmation-form.component.html',
  styleUrls: ['./confirmation-form.component.scss']
})
export class ConfirmationFormComponent implements OnInit {

  @Input() confirmation: Confirmation;
  @Output() confirmationStored: EventEmitter<Confirmation> = new EventEmitter();

  confirmationForm = this.fb.group({
      id: [''],
      person: ['', Validators.required],
      father: null,
      mother: null,
      baptismId: [''],
      baptismLocation: [''],
      baptismDate: [''],
      sponsor: null,
      confirmationLocation: ['', Validators.required],
      confirmationDate: ['', Validators.required],
      minister: ['', Validators.required],
      notations: []
    });

  constructor(private router: Router,
              private route: ActivatedRoute,
              public loginService: LoginService,  
              public baptismService: BaptismService,
              public confirmationService: ConfirmationService,
              public personService: PersonService,
              private fb: FormBuilder) { }

  ngOnInit() {
    if(this.confirmation) {
      this.confirmationForm.patchValue(this.confirmation);
    } else {
      const personId = +this.route.snapshot.paramMap.get('id');

      this.personService.get(personId).subscribe(resp => {
          this.confirmationForm.get('person').setValue({name:resp.name, id:resp.id});
        });

      this.baptismService.getByPerson(personId).subscribe(resp =>{
          if(resp) {
            this.confirmationForm.get('baptismId').setValue(resp.id);
            this.confirmationForm.get('baptismLocation').setValue(resp.baptismLocation);
            this.confirmationForm.get('baptismDate').setValue(resp.baptismDate);
            this.confirmationForm.get('father').setValue(resp.father);
            this.confirmationForm.get('mother').setValue(resp.mother);
          }
        });
    }
  }

  submitForm() {
    if(!this.confirmationForm.valid)
      return;

    const formValue = this.confirmationForm.value;
    if(formValue.id == 0) {
      if(!this.loginService.userCan("sacrament.confirmation.create"))
        return;

      this.confirmationService.create(formValue).subscribe(
        resp => {
          this.confirmationStored.emit(resp);
        });

    } else {
      if(!this.loginService.userCan("sacrament.confirmation.update"))
        return;

      this.confirmationService.update(formValue).subscribe(
        resp => {
          this.confirmationStored.emit(resp);
        });
    }
  }

  close() {
    this.confirmationStored.emit(null);
  }
}
