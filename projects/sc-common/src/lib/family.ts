import { Autocompletable } from './identifiable';
import { Address } from './address';
import { Person } from './person';

export class Family extends Autocompletable {

  constructor() {
    super();
    this.address = new Address();
  }

  surname: string;
  homePhone: string;
  envelopeNumber: number;
  address: Address;
  members: Person[];
  photoGuid: string;
  inactive: boolean;
  inactiveSince: Date;
  preferences: any;

  public identify(): string {
    return this.surname;
  }

  public identifyAs(identity: string): Family {
    this.surname=identity;
    return this;
  }

  public asTemplate(): Family {
    this.id=0;
    this.surname="";
    this.homePhone="";
    this.envelopeNumber=0;
    this.address = new Address();
    this.members = [];
    this.photoGuid = "";
    this.inactive = false;
    this.inactiveSince = new Date();
    this.preferences = {};
    return this;
  }
}
