import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

import { SCValidation } from '../../sccommon/validation';

import { RoomService } from '../services/room.service';

@Component({
  selector: 'app-room-dialog',
  templateUrl: './room-dialog.component.html',
  styleUrls: ['./room-dialog.component.scss']
})
export class RoomDialogComponent implements OnInit {
  form = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      type: ['', Validators.required],
      capacity: ['', Validators.pattern(SCValidation.NUMBER)]
    });

  public roomTypes = this.roomService.getRoomTypes.bind(this.roomService);

  constructor(public dialogRef: MatDialogRef<RoomDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private roomService: RoomService) { }
  
  ngOnInit() {
    if(this.data.item != null) {
      this.form.patchValue(this.data.item)
    }
  }

  save() {
    if(!this.form.valid) {
      this.cancel();
      return;
    }

    if(this.form.get("id").value > 0) {
      this.roomService.update(this.form.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    } else {
      this.roomService.create(this.form.value).
        subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  cancel() {
    this.dialogRef.close();    
  }
}
