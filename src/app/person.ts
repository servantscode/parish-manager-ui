import { Family } from './family';

export class Person {

  constructor() {
    this.family = new Family();
  }

  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  headOfHousehold: boolean;
  family: Family;
  birthdate: Date;
  memberSince: Date;
}
