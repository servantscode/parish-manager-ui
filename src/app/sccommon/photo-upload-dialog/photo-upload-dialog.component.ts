import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, filter, debounceTime, switchMap } from 'rxjs/operators'

import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

import { LoginService } from '../services/login.service';
import { MessageService } from '../services/message.service';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-photo-upload-dialog',
  templateUrl: './photo-upload-dialog.component.html',
  styleUrls: ['./photo-upload-dialog.component.scss']
})
export class PhotoUploadDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PhotoUploadDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private loginService: LoginService,
              private messageService: MessageService,
              private photoService: PhotoService) { }

  ngOnInit() {
    if(!this.loginService.userCan("photo.create"))
      this.cancel();
  }

  uploadFile(files: FileList) {
    let file = files.item(0);
    this.storeFile(file);
  }

  dropped(event: UploadEvent) {
    let droppedFile = event.files[0];
    if (droppedFile.fileEntry.isFile) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
          this.storeFile(file);
        });
    }
  }

  private storeFile(file: File) {
    this.photoService.uploadImage(file).subscribe(guid => {
        this.dialogRef.close(guid);
      });
  }

  cancel() {
    this.dialogRef.close();    
  }
}
