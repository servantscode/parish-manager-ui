import { Identifiable } from 'sc-common';

export class Donation extends Identifiable {
  constructor() {
    super();
  }

  familyId: number;
  familyName: string;
  fundId: number;
  fundName: string;
  amount: number
  deductibleAmount: number
  donationDate: Date;
  donationType: string;
  checkNumber: number;
  transactionId: string;

  public identify(): string {
    return this.donationType.toLowerCase() + " donation of $" + this.amount;
  }

  public asTemplate(): Donation {
    this.id=0;
    this.familyId=0;
    this.familyName=null;
    this.fundId=0;
    this.fundName=null;
    this.amount=0;
    this.deductibleAmount=0;
    this.donationDate=new Date();
    this.donationType ="";
    this.checkNumber=0;
    this.transactionId="";
    return this;
  }
}
