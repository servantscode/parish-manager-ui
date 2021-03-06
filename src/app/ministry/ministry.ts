import { Autocompletable } from 'sc-common';

export class Ministry extends Autocompletable {

  constructor() {
    super();
  }

  name: string;
  description: string

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
    this.description="";
    return this;
  }
}
