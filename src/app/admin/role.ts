import { Identifiable } from '../sccommon/identifiable';

export class Role extends Identifiable {
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
