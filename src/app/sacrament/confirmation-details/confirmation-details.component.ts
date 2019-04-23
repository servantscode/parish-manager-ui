import { Component, OnInit, Input } from '@angular/core';

import { ConfirmationService } from '../services/confirmation.service';

import { Confirmation } from '../sacrament';

@Component({
  selector: 'app-confirmation-details',
  templateUrl: './confirmation-details.component.html',
  styleUrls: ['./confirmation-details.component.scss']
})
export class ConfirmationDetailsComponent implements OnInit {
  @Input() confirmation: Confirmation;

  constructor(public confirmationService: ConfirmationService) { }

  ngOnInit() {
  }

}
