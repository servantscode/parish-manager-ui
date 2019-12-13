import { Autocompletable } from './identifiable';

import { Address } from './address';
import { Identity } from './identity';

export class Parish extends Autocompletable {

  constructor() {
    super();
  }

  name: string;
  address: Address;
  phoneNumber: string;
  website: string;
  pastor: Identity;
  fiscalYearStartMonth: number;
  orgId: number;

  bannerGuid: string;
  portraitGuid: string;


 public identify(): string { 
    return this.name;
  }

  public identifyAs(identity: string): Parish {
    this.name=identity;
    return this;
  }

  public asTemplate(): Parish {
    this.id=0;
    this.name="";
    this.address=null;
    this.phoneNumber="";
    this.website="";
    this.pastor=null;
    this.fiscalYearStartMonth=0;
    this.orgId=0;
    this.bannerGuid="";
    this.portraitGuid="";
    return this;
  }
}