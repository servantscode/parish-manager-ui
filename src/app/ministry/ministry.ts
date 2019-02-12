import { Identifiable } from '../sccommon/identifiable';

export class Ministry extends Identifiable {

  constructor() {
    super();
  }

  name: string;

  public identify(): string {
    return this.name;
  }

  public identifyAs(identity: string): Ministry {
    this.name=identity;
    return this;
  }

  public asTemplate(): Ministry {
    this.id=0;
    this.name="";
    return this;
  }
}
