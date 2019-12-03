import { Identifiable } from 'sc-common';

export class Integration extends Identifiable {
  constructor() {
    super();
  }
  
  name: string;
  systemIntegrationId: number;
  automationId: number;
  failure: string;
  lastSync: Date;
  nextScheduledSync: Date;
  config: string;

  public identify(): string {
    return this.name;
  }

  public asTemplate(): Integration {
    this.id=0;
    this.name="";
    this.systemIntegrationId=0;
    this.automationId=0;
    this.failure="";
    this.lastSync=null;
    this.nextScheduledSync=null;
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

export class Automation extends Identifiable {
  constructor() {
    super();
  }

  integrationId: number;
  integrationName: string;
  cycle: string;
  frequency: number;
  weeklyDays: string[];
  scheduleStart: Date;
  nextScheduled: Date;

  public identify(): string {
    return this.integrationName;
  }

  public asTemplate(): Automation {
    this.id=0;
    this.integrationId=0;
    this.integrationName="";
    this.cycle="";
    this.frequency=0;
    this.weeklyDays=[];
    this.scheduleStart=null;
    this.nextScheduled=null;
    return this;
  }
}