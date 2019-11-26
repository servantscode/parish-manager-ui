import { Identifiable } from 'sc-common';

export class Donor extends Identifiable {
  constructor() {
    super();
  }
  
  integrationId: number;
  externalId: string;
  personId: number;
  familyId: number;
  name: string;
  email: string;
  phoneNumber: string;

  public identify(): string {
    return this.name;
  }

  public asTemplate(): Donor {
    this.id=0;
    this.integrationId = 0;
    this.externalId = "";
    this.personId = 0;
    this.familyId = 0;
    this.name="";
    this.email="";
    this.phoneNumber="";
    return this;
  }
}

export class IncomingDonation extends Identifiable {
  constructor() {
    super();
  }
  
  integrationId: number;
  externalId: string;
  transactionId: string;
  fund: string;
  donorId: number;
  donorName: string;
  amount: number;
  donationDate: Date;
  taxDeductible: boolean;


  public identify(): string {
    return this.transactionId;
  }

  public asTemplate(): IncomingDonation {
    this.id=0;
    this.integrationId = 0;
    this.externalId = "";
    this.transactionId = "";
    this.fund = "";
    this.donorId = 0;
    this.donorName = "";
    this.amount = 0.0;
    this.donationDate = null;
    this.taxDeductible = false;
    return this;
  }
}