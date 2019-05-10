import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MassIntentionComponent } from './mass-intention.component';

describe('MassIntentionComponent', () => {
  let component: MassIntentionComponent;
  let fixture: ComponentFixture<MassIntentionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MassIntentionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MassIntentionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
