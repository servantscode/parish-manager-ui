import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-override-dialog',
  templateUrl: './admin-override-dialog.component.html',
  styleUrls: ['./admin-override-dialog.component.scss']
})
export class AdminOverrideDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AdminOverrideDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {
                title: string,
                text: string,
                confirm: () => void,
                nav?: () => void
              }) { }

  ngOnInit() {
  }

  confirm() {
    this.data.confirm();
    if(this.data.nav)
      this.data.nav();
    this.close();
  }

  cancel() {
    this.close();
  }

  close() {
    this.dialogRef.close();  
  }
}
