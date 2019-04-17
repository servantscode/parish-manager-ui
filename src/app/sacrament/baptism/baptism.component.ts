import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'
import { MatDialog, MatDialogRef } from '@angular/material';

import { LoginService } from '../../sccommon/services/login.service';
import { PersonService } from '../../sccommon/services/person.service';

import { BaptismService } from '../services/baptism.service';

import { Baptism } from '../sacrament';

@Component({
  selector: 'app-baptism',
  templateUrl: './baptism.component.html',
  styleUrls: ['./baptism.component.scss']
})
export class BaptismComponent implements OnInit {

  baptismForm = this.fb.group({
      id: [''],
      person: ['', Validators.required],
      baptismLocation: ['', Validators.required],
      baptismDate: ['', Validators.required],
      birthLocation: [''],
      birthDate: [''],
      minister: ['', Validators.required],
      father: '',
      mother: '',
      godfather: '',
      godmother: '',
      witness: '',
      conditional: [false],
      reception: [false],
      notations: ''
    });

  constructor(private router: Router,
              private route: ActivatedRoute,
              public loginService: LoginService,  
              public baptismService: BaptismService,
              public personService: PersonService,
              private fb: FormBuilder) { }

  ngOnInit() {
  }

  submitForm() {
    if(!this.baptismForm.valid)
      return;

    alert("Baptism is: " + JSON.stringify(this.baptismForm.value));
  }
}
