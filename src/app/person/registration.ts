import { Family, Identifiable } from 'sc-common';

export class RegistrationRequest implements Identifiable {
  id: number
  requestTime: Date;
  familyName: string;
  familyData: Family;

  approverId: number;
  approverName: string;
  approvalTime: Date;
  approvalStatus: string;

  identify(): string {
    return this.familyName;
  }

  asTemplate(): RegistrationRequest {
    this.id=0;
    this.requestTime=null;
    this.familyName='';
    this.familyData=null;
    this.approverId=0;
    this.approverName='';
    this.approvalTime=null;
    this.approvalStatus='';
    return this;
  }
}
