import { Address } from './address';
import { Person } from './person';

import { Identifiable } from '../sccommon/identifiable';

export class Family extends Identifiable {

  constructor() {
    super();
    this.address = new Address();
  }

  surname: string;
  address: Address;
  members: Person[];

  public identify(): string {
    return this.surname;
  }

  public identifyAs(identity: string): Family {
    this.surname=identity;
    return this;
  }

  public asTemplate(): Family {
    this.id=0;
    this.surname=""
    this.address = new Address();
    this.members = [];
    return this;
  }
}
