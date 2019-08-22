import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SacramentalGroupDialogComponent } from './sacramental-group-dialog.component';

describe('SacramentalGroupDialogComponent', () => {
  let component: SacramentalGroupDialogComponent;
  let fixture: ComponentFixture<SacramentalGroupDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SacramentalGroupDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SacramentalGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
