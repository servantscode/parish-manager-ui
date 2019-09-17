import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { LoginService } from 'sc-common';
import { PhotoService } from '../services/photo.service';

import { PhotoUploadDialogComponent } from '../photo-upload-dialog/photo-upload-dialog.component'

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnChanges {

  @Input() guid: string;
  @Input() altText: string;
  @Input() editable: boolean = false;
  @Input() publicPhoto: boolean = false;

  @Output() photoStored: EventEmitter<string> = new EventEmitter();

  imageData: any;
  isImageLoading = false;

  private openDialogRef = null;

  constructor(private dialog: MatDialog,
              public loginService: LoginService,
              private photoService: PhotoService) { }

  ngOnChanges() {
    this.loadImage();
  }

  addPhoto() {
    if(this.openDialogRef != null)
      return;

    if(!this.loginService.userCan("photo.create"))
      return;

    this.openDialogRef = this.dialog.open(PhotoUploadDialogComponent, {
      width: '400px',
      data: {'publicPhoto': this.publicPhoto}
    });

   this.openDialogRef.afterClosed().subscribe(guid => {
      this.openDialogRef= null;
      if(guid)
        this.photoStored.emit(guid);
    });
  }

  // ----- Privates -----
  private loadImage() {
    this.imageData = null;
    if(!this.guid)
      return;

    this.isImageLoading = true;
    if(this.publicPhoto) {
      this.photoService.getPublicImage(this.guid).subscribe(
        data => {
          this.createImageFromBlob(data);
          this.isImageLoading = false;
        },
        error => {
          this.isImageLoading = false;
          console.log(error);
        });
    } else {
      this.photoService.getImage(this.guid).subscribe(
        data => {
          this.createImageFromBlob(data);
          this.isImageLoading = false;
        },
        error => {
          this.isImageLoading = false;
          console.log(error);
        });
    }
  }

  private createImageFromBlob(image: Blob) {
    if(!image) 
      return;

    let reader = new FileReader();
    reader.addEventListener("load", () => {
        this.imageData = reader.result;
      }, false);

    reader.readAsDataURL(image);
  }
}
