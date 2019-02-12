import { Identifiable } from '../sccommon/identifiable';

export class Equipment extends Identifiable {
  constructor() {
    super();
  }

  name: string;
  manufacturer: string;
  description: string;

  public identify(): string {
    return name;
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