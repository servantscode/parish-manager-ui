import { Identifiable } from '../sccommon/identifiable';

import { Family } from './family';

export class Person extends Identifiable {

  constructor() {
    super();
    this.family = new Family();
  }

  name: string;
  email: string;
  phoneNumber: string;
  headOfHousehold: boolean;
  family: Family;
  birthdate: Date;
  memberSince: Date;

  public identify(): string { 
    return name;
  }
}
