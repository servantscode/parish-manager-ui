import { Address } from './address';
import { Person } from './person';

export class Family {

  constructor() {
    this.address = new Address();
  }

  id: number;
  surname: string;
  address: Address;
  members: Person[];
}
