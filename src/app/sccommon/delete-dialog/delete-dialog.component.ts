import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, filter, debounceTime, switchMap } from 'rxjs/operators'

import { LoginService } from '../services/login.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {
                title: string,
                text: string,
                delete: () => Observable<void>,
                nav?: () => void
              },
              public messageService: MessageService,
              public loginService: LoginService) { }

  ngOnInit() {
  }

  delete() {
    this.data.delete().subscribe(() =>
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
