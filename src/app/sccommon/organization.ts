import { Autocompletable } from '../sccommon/identifiable';

export class Organization extends Autocompletable {
  constructor() {
    super();
  }

  name: string;
  hostName: string;
  photoGuid: string;

  public identify(): string {
    return this.name;
  }

  public identifyAs(identity: string): Organization {
    this.name=identity;
    return this;
  }

  public asTemplate(): Organization {
    this.id=0;
    this.name="";
    this.hostName="";
    this.photoGuid="";
    return this;
  }
}