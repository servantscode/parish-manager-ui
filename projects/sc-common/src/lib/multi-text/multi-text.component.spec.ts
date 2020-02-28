import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiTextComponent } from './multi-text.component';

describe('MultiTextComponent', () => {
  let component: MultiTextComponent;
  let fixture: ComponentFixture<MultiTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
