import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailConfigComponent } from './email-config.component';

describe('EmailConfigComponent', () => {
  let component: EmailConfigComponent;
  let fixture: ComponentFixture<EmailConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
