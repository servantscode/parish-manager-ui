import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramGroupComponent } from './program-group.component';

describe('ProgramGroupComponent', () => {
  let component: ProgramGroupComponent;
  let fixture: ComponentFixture<ProgramGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
