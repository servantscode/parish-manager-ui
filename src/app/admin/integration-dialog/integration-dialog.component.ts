import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, filter, debounceTime, switchMap } from 'rxjs/operators'

import { AvailableIntegrationService } from '../services/available-integration.service';

import { AvailableIntegration } from '../integration';

@Component({
  selector: 'app-integration-dialog',
  templateUrl: './integration-dialog.component.html',
  styleUrls: ['./integration-dialog.component.scss']
})
export class IntegrationDialogComponent implements OnInit {

  form = this.fb.group({
      integration: ['', Validators.required],
    });

  selectedIntegration: AvailableIntegration;

  constructor(public dialogRef: MatDialogRef<IntegrationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              public aailableIntegrationService: AvailableIntegrationService) { }

  ngOnInit() {
    if(this.data.item) {
      this.form.patchValue(this.data.item);
    }

    this.form.get("integration").valueChanges.subscribe(i => {
        this.selectedIntegration = i;
      });
  }

  doAuthorize() {
    if(this.selectedIntegration.authorizationUrl)
      window.open(this.selectedIntegration.authorizationUrl, "_blank");

    this.cancel();
  }

  cancel() {
    this.dialogRef.close();    
  }
}
