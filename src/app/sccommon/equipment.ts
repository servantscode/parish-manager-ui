import { Autocompletable } from 'sc-common';

export class Equipment extends Autocompletable {
  constructor() {
    super();
  }

  name: string;
  manufacturer: string;
  description: string;

  public identify(): string {
    return this.name;
  }

  public identifyAs(identity: string): Equipment {
    this.name=identity;
    return this;
  }

  public asTemplate(): Equipment {
    this.id=0;
    this.name="";
    this.manufacturer="";
    this.description="";
    return this;
  }
}