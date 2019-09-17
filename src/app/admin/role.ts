import { Autocompletable } from 'sc-common';

export class Role extends Autocompletable {
  constructor() {
    super();
  }

  name: string;
  permissions: string[];

  public identify(): string {
    return this.name;
  }

  public identifyAs(identity: string): Role {
    this.name=identity;
    return this;
  }

  public asTemplate(): Role {
    this.id=0;
    this.name="";
    this.permissions=[];
    return this;
  }
}
