import { Identifiable } from '../sccommon/identifiable';

export class Enrollment {

  personId: number;
  personName: string;
  ministryId: number;
  ministryName: string;
  roleId: number;
  role: string;
}

export class MinistryRole extends Identifiable {

  constructor() {
    super();
  }

  public identify(): string {
    return this.name;
  }

  name: string;
  ministryId: number;
  contact: boolean;
  leader: boolean;

  public asTemplate(): MinistryRole {
    this.id=0;
    this.name=null;
    this.ministryId=0;
    this.contact=false;
    this.leader=false;
    return this;
  }
}