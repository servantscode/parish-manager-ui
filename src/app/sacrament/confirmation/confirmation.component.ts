import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { LoginService } from '../../sccommon/services/login.service';

import { ConfirmationService } from '../services/confirmation.service';

import { Confirmation } from '../sacrament';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              public loginService: LoginService,
              public confirmationService: ConfirmationService) { }

  confirmation: Confirmation;
  showForm= false;

  ngOnInit() {
    const personId = +this.route.snapshot.paramMap.get('id');

    if(personId && personId > 0 && this.loginService.userCan("sacrament.confirmation.read"))
      this.confirmationService.getByPerson(personId).subscribe(resp => this.confirmation=resp);
  }

  openForm() {
    this.showForm = true;
  }

  closeForm(storedConfirmation:Confirmation) {
    this.showForm = false;

    if(storedConfirmation)
      this.confirmation = storedConfirmation;
  }
}
