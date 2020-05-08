import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Registration } from 'sc-common';

import { RegistrationDialogComponent } from '../registration-dialog/registration-dialog.component';

import { RegistrationService } from '../services/registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  RegistrationDialogComponent = RegistrationDialogComponent;

  activeProgram: number;

  constructor(public registrationService: RegistrationService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.activeProgram = +this.route.snapshot.paramMap.get('id');
  }
}
