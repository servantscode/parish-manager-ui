import { Address } from './address';

export class Family {

  constructor() {
    this.address = new Address();
  }

  id: number;
  surname: string;
  address: Address;
}
