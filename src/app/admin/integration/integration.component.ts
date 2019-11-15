import { Component, OnInit } from '@angular/core';

import { IntegrationDialogComponent } from '../integration-dialog/integration-dialog.component';

import { IntegrationService } from '../services/integration.service';

@Component({
  selector: 'app-integration',
  templateUrl: './integration.component.html',
  styleUrls: ['./integration.component.scss']
})
export class IntegrationComponent implements OnInit {

  IntegrationDialogComponent = IntegrationDialogComponent;

  constructor(public integrationService: IntegrationService) { 
  }

  ngOnInit() {}

}
