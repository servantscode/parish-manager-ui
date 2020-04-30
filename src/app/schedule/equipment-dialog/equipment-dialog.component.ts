import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, filter, debounceTime, switchMap } from 'rxjs/operators'

import { SCValidation } from 'sc-common';

import { EquipmentService } from '../../sccommon/services/equipment.service';

@Component({
  selector: 'app-equipment-dialog',
  templateUrl: './equipment-dialog.component.html',
  styleUrls: ['./equipment-dialog.component.scss']
})
export class EquipmentDialogComponent implements OnInit {
 form = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      manufacturer: [''],
      description: ['']
    });

  constructor(public dialogRef: MatDialogRef<EquipmentDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private equipmentService: EquipmentService) { }
  
  ngOnInit() {
    if(this.data.item != null)
      this.form.patchValue(this.data.item)
  }

  save() {
    if(!this.form.valid) {
      this.cancel();
      return;
    }

    if(this.form.get("id").value > 0) {
      this.equipmentService.update(this.form.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    } else {
      this.equipmentService.create(this.form.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  cancel() {
    this.dialogRef.close();    
  }
}
