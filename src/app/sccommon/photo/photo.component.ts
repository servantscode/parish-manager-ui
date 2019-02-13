import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnChanges {

  @Input() guid: string;
  @Input() altText: string;

  @Output() photoStored: EventEmitter<string> = new EventEmitter();

  imageData: any;
  isImageLoading = false;

  constructor(private photoService: PhotoService) { }

  ngOnChanges() {
    this.loadImage();
  }

  addPhoto() {
    alert("Upload file now!");
    let guid = "5ad74e41-6b71-48cd-a57b-c6bcde84af91";
    this.photoStored.emit(guid);
  }

  // ----- Privates -----
  private loadImage() {
    if(!this.guid)
      return;

    this.isImageLoading = true;
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
