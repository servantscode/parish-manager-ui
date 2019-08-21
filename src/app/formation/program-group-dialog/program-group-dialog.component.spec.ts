import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramGroupDialogComponent } from './program-group-dialog.component';

describe('ProgramGroupDialogComponent', () => {
  let component: ProgramGroupDialogComponent;
  let fixture: ComponentFixture<ProgramGroupDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramGroupDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
