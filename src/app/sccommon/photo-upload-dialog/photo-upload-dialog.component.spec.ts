import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoUploadDialogComponent } from './photo-upload-dialog.component';

describe('PhotoUploadDialogComponent', () => {
  let component: PhotoUploadDialogComponent;
  let fixture: ComponentFixture<PhotoUploadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoUploadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
