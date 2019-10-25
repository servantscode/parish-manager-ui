import { Identifiable } from 'sc-common';

export class Pledge extends Identifiable {
  constructor() {
    super();
  }

  familyId: number;
  familyName: string;
  fundId: number;
  fundName: string;
  pledgeType: string;
  pledgeDate: Date;
  pledgeStart: Date;
  pledgeEnd: Date;
  pledgeFrequency: string;
  pledgeAmount: number;
  annualPledgeAmount: number;

  collectedAmount: number;
  collectedPct: number;
  timePct: number;
  completionScore: number;
  pledgeStatus: string;

  public identify(): string {
    return this.pledgeFrequency.toLowerCase() + " pledge of $" + this.pledgeAmount;
  }

  public asTemplate(): Pledge {
    this.id=0;
    this.familyId=0;
    this.familyName=null;
    this.fundId=0;
    this.fundName=null;
    this.pledgeType="";
    this.pledgeDate=null;
    this.pledgeStart=null;
    this.pledgeEnd=null;
    this.pledgeFrequency="";
    this.pledgeAmount=0;
    this.annualPledgeAmount=0;
    this.collectedAmount=0;
    this.collectedPct=0;
    this.timePct=0;
    this.completionScore=0;
    this.pledgeStatus=null;
    return this;
  }
}
