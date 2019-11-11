import { Identifiable } from 'sc-common';

export class Checkin extends Identifiable {
  constructor() {
    super();
  }

  personId: number;
  personName: string;
  expiration: Date;
  checkedinAt: Date;
  checkedinById: number;
  checkedinByName: string;
  
  public identify(): string {
    return this.personName;
  }

  public asTemplate(): Checkin {
    this.id=0;
    this.personId=0;
    this.personName='';
    this.expiration=null;
    this.checkedinAt=null;
    this.checkedinById=0;
    this.checkedinByName='';
    return this;
  }
}