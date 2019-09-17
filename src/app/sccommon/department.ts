import { Observable } from 'rxjs';

import { Autocompletable } from 'sc-common';

export class Department extends Autocompletable {

  constructor() {
    super();
  }

  name: string;
  departmentHeadId: number;
  departmentHeadName: string;

  public identify(): string { 
    return this.name;
  }

  public identifyAs(identity: string): Department {
    this.name=identity;
    return this;
  }

  public asTemplate(): Department {
    this.id=0;
    this.name="";
    this.departmentHeadId=0;
    this.departmentHeadName="";
    return this;
  }
}