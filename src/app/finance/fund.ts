import { Identifiable } from 'sc-common';

export class Fund extends Identifiable {
  constructor() {
    super();
  }

  name: string;

  public identify() {
    return this.name;
  }

  public asTemplate(): Fund {
    this.id=0;
    this.name=null;
    return this;
  }
}
