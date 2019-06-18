import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-recurring-edit-dialog',
  templateUrl: './recurring-edit-dialog.component.html',
  styleUrls: ['./recurring-edit-dialog.component.scss']
})
export class RecurringEditDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RecurringEditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {
                title: string,
                text: string
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
