import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

import { LoginService, MessageService } from 'sc-common';

import { CustomControl } from '../../sccommon/custom-control';

import { AutomationDialogComponent } from '../automation-dialog/automation-dialog.component';
import { IntegrationDialogComponent } from '../integration-dialog/integration-dialog.component';

import { AutomationService } from '../services/automation.service';
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

  refresh = new Subject<any>();

  controls: CustomControl<Integration>[] = [
    new CustomControl("gear", (item: Integration) => {
      if(item.automationId) {
        this.automationService.get(item.automationId).subscribe(automation => {
          const dialogRef = this.dialog.open(AutomationDialogComponent, {
              width: '400px',
              data: {item: automation}
            });

          dialogRef.afterClosed().subscribe(result => {
             this.refresh.next();
            });
          });
      } else {
        const dialogRef = this.dialog.open(AutomationDialogComponent, {
            width: '400px',
            data: {item: {integrationId: item.id}}
          });

        dialogRef.afterClosed().subscribe(result => {
           this.refresh.next();
          });
      }
    }),
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

  constructor(private dialog: MatDialog,
              private activatedRoute: ActivatedRoute,
              public automationService: AutomationService,
              public integrationService: IntegrationService,
              public messageService: MessageService,
              public loginService: LoginService) { 
  }

  ngOnInit() {
      this.activatedRoute.queryParams.subscribe(params => {
        const failure = params['failure'];
        if(failure)
          this.messageService.error(failure);
      });
  }

}
