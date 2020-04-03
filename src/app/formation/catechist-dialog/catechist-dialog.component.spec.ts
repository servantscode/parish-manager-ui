import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatechistDialogComponent } from './catechist-dialog.component';

describe('CatechistDialogComponent', () => {
  let component: CatechistDialogComponent;
  let fixture: ComponentFixture<CatechistDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatechistDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatechistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
