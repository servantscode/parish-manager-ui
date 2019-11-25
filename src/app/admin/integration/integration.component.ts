import { Component, OnInit } from '@angular/core';

import { LoginService, MessageService } from 'sc-common';

import { CustomControl } from '../../sccommon/custom-control';

import { IntegrationDialogComponent } from '../integration-dialog/integration-dialog.component';

import { IntegrationService } from '../services/integration.service';

import { Integration } from '../integration';

@Component({
  selector: 'app-integration',
  templateUrl: './integration.component.html',
  styleUrls: ['./integration.component.scss']
})
export class IntegrationComponent implements OnInit {

  IntegrationDialogComponent = IntegrationDialogComponent;

  activeSyncs = [];

  controls: CustomControl<Integration>[] = [
    new CustomControl("sync", (item: Integration) => {
      if(!item)
        return;

      this.activeSyncs.push(item);
      this.integrationService.syncPushpay().subscribe( () => {
          this.messageService.add( item.name + "sync complete.");
          this.activeSyncs = this.activeSyncs.filter(s => s != item);
        });
    },
    (item: Integration) => {
      return this.loginService.userCan("admin.integration.sync");
    },
    (item: Integration) => {
      return this.activeSyncs.includes(item);
    })
  ];

  constructor(public integrationService: IntegrationService,
              public messageService: MessageService,
              public loginService: LoginService) { 
  }

  ngOnInit() {}

}
