import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

import { SCValidation } from 'sc-common';

import { SystemIntegrationService } from '../services/system-integration.service';

@Component({
  selector: 'app-system-integration-dialog',
  templateUrl: './system-integration-dialog.component.html',
  styleUrls: ['./system-integration-dialog.component.scss']
})
export class SystemIntegrationDialogComponent implements OnInit {

  form = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      config: ['']
    });

  constructor(public dialogRef: MatDialogRef<SystemIntegrationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private systemIntegrationService: SystemIntegrationService) { }
  
  ngOnInit() {
    if(this.data.item != null) {
      const integration = this.data.item;
      integration.config = JSON.stringify(integration.config);
      this.form.patchValue(integration);
    }
  }

  save() {
    if(!this.form.valid) {
      this.cancel();
      return;
    }

    const integration = this.form.value;
    integration.config = JSON.parse(integration.config);

    if(this.form.get("id").value > 0) {
      this.systemIntegrationService.update(integration).
        subscribe(() => {
          this.dialogRef.close();
        });
    } else {
      this.systemIntegrationService.create(integration).
        subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  cancel() {
    this.dialogRef.close();    
  }
}
