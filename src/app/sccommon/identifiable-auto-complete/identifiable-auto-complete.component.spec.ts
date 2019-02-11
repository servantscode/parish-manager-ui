import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentifiableAutoCompleteComponent } from './identifiable-auto-complete.component';

describe('IdentifiableAutoCompleteComponent', () => {
  let component: IdentifiableAutoCompleteComponent;
  let fixture: ComponentFixture<IdentifiableAutoCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdentifiableAutoCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentifiableAutoCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
