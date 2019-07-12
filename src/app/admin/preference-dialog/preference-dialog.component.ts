import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, filter, debounceTime, switchMap } from 'rxjs/operators'

import { PreferencesService } from '../../sccommon/services/preferences.service';

@Component({
  selector: 'app-preference-dialog',
  templateUrl: './preference-dialog.component.html',
  styleUrls: ['./preference-dialog.component.scss']
})
export class PreferenceDialogComponent implements OnInit {

  form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      type: ['BOOLEAN', Validators.required],
      objectType: ['PERSON', Validators.required],
      defaultValue: ['']
    });

  createNew: boolean = true;

  public preferenceTypes = this.preferencesService.getPreferenceTypes.bind(this.preferencesService);
  public objectTypes = this.preferencesService.getObjectTypes.bind(this.preferencesService);

  constructor(public dialogRef: MatDialogRef<PreferenceDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private preferencesService: PreferencesService) { }

  ngOnInit() {
    if(this.data.item) {
      this.form.patchValue(this.data.item);
      if(this.data.item.id)
        this.createNew = false;
    }
  }

  createPreference() {
    if(this.form.valid) {
      if(this.createNew) {
        this.preferencesService.create(this.form.value).
          subscribe(() => {
            this.dialogRef.close();
          });
      } else {
        this.preferencesService.update(this.form.value).
          subscribe(() => {
            this.dialogRef.close();
          });
      }
    } else {
      this.cancel();
    }
  }

  cancel() {
    this.dialogRef.close();    
  }

  formData() {
    alert(JSON.stringify(this.form.value));
  }
}
