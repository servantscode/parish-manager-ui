import { Identifiable } from 'sc-common';

export class Integration extends Identifiable {
  constructor() {
    super();
  }
  
  name: string;
  systemIntegrationId: number;
  failure: string;
  lastSync: Date;
  config: string;

  public identify(): string {
    return this.name;
  }

  public asTemplate(): Integration {
    this.id=0;
    this.name="";
    this.systemIntegrationId=0;
    this.failure="";
    this.lastSync=null;
    this.config="";
    return this;
  }
}

export class AvailableIntegration extends Identifiable {
  constructor() {
    super();
  }
  
  name: string;
  authorizationUrl: string;

  public identify(): string {
    return this.name;
  }

  public asTemplate(): AvailableIntegration {
    this.id=0;
    this.name="";
    this.authorizationUrl="";
    return this;
  }
}