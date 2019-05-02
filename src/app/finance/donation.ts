import { Identifiable } from '../sccommon/identifiable';

export class Donation extends Identifiable {
  constructor() {
    super();
  }

  familyId: number;
  fundId: number;
  fundName: string;
  amount: number
  donationDate: Date;
  donationType: string;
  checkNumber: number;
  transactionId: number;

  public identify(): string {
    return this.donationType.toLowerCase() + " donation of $" + this.amount;
  }

  public asTemplate(): Donation {
    this.id=0;
    this.familyId=0;
    this.fundId=0;
    this.fundName=null;
    this.amount=0;
    this.donationDate=new Date();
    this.donationType ="";
    this.checkNumber=0;
    this.transactionId=0;
    return this;
  }
}
