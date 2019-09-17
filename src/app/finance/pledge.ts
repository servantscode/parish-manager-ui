import { Identifiable } from 'sc-common';

export class Pledge extends Identifiable {
  constructor() {
    super();
  }

  familyId: number;
  fundId: number;
  fundName: string;
  pledgeType: string;
  pledgeDate: Date;
  pledgeStart: Date;
  pledgeEnd: Date;
  pledgeFrequency: string;
  pledgeAmount: number;
  annualPledgeAmount: number;

  public identify(): string {
    return this.pledgeFrequency.toLowerCase() + " pledge of $" + this.pledgeAmount;
  }

  public asTemplate(): Pledge {
    this.id=0;
    this.familyId=0;
    this.fundId=0;
    this.fundName=null;
    this.pledgeType="";
    this.pledgeDate=null;
    this.pledgeStart=null;
    this.pledgeEnd=null;
    this.pledgeFrequency="";
    this.pledgeAmount=0;
    this.annualPledgeAmount=0;
    return this;
  }
}
