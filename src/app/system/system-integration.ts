import { Identifiable } from 'sc-common';

export class SystemIntegration extends Identifiable {
  constructor() {
    super();
  }
  
  name: string;
  config: any;

  public identify(): string {
    return this.name;
  }

  public asTemplate(): SystemIntegration {
    this.id=0;
    this.name="";
    this.config=null;
    return this;
  }
}