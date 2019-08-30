import { Component, OnInit, Input } from '@angular/core';

import { PhoneNumber } from '../../sccommon/person';

@Component({
  selector: 'app-person-phone-number',
  templateUrl: './person-phone-number.component.html',
  styleUrls: ['./person-phone-number.component.scss']
})
export class PersonPhoneNumberComponent implements OnInit {
  @Input() phoneNumbers: PhoneNumber[];

  constructor() { }

  ngOnInit() {
  }

}
