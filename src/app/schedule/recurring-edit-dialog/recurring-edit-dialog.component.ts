import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-recurring-edit-dialog',
  templateUrl: './recurring-edit-dialog.component.html',
  styleUrls: ['./recurring-edit-dialog.component.scss']
})
export class RecurringEditDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RecurringEditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {
                count: number
              }) { }

  ngOnInit() {
  }

  future() {
    this.dialogRef.close(true);
  }

  single() {
    this.dialogRef.close(false);
  }
}
