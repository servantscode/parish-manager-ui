import { Component, OnInit } from '@angular/core';

import { SystemIntegrationDialogComponent } from '../system-integration-dialog/system-integration-dialog.component';

import { SystemIntegrationService } from '../services/system-integration.service';

@Component({
  selector: 'app-system-integration',
  templateUrl: './system-integration.component.html',
  styleUrls: ['./system-integration.component.scss']
})
export class SystemIntegrationComponent implements OnInit {

  SystemIntegrationDialogComponent = SystemIntegrationDialogComponent;

  constructor(public systemIntegrationService: SystemIntegrationService) { 
  }

  ngOnInit() {}

}
