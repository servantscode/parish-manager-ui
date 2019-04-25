import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent implements OnInit {

  deletePermanently = false;

  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {
                title: string,
                text: string,
                delete: () => Observable<void>,
                allowPermaDelete: boolean,
                permaDelete?: () => Observable<void>,
                nav?: () => void
              }) { }

  ngOnInit() {
  }

  delete() {
    if(this.deletePermanently) {
      var call = this.data.permaDelete();
    } else {
      var call = this.data.delete();
    }

    call.subscribe(() =>
      {
        if(this.data.nav)
          this.data.nav();
      });
    this.close();
  }

  cancel() {
    this.close();
  }

  close() {
    this.dialogRef.close();  
  }
}
