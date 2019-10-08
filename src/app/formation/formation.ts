import { formatDate } from '@angular/common';

import { Autocompletable, Identifiable } from 'sc-common';

export class Program extends Autocompletable {
  constructor() {
    super();
  }

  name: string;
  groupId: number;
  coordinatorId: number;
  coordinatorName: string;
  registrations: number;

  public identify(): string {
    return this.name;
  }

  public identifyAs(identity: string): Program {
    this.name=identity;
    return this;
  }

  public asTemplate(): Program {
    this.id=0;
    this.name="";
    this.groupId=0;
    this.coordinatorId=0
    this.coordinatorName="";
    this.registrations=0; 
    return this;
  }
}

export class Session extends Autocompletable {
  constructor() {
    super();
  }

  programId: number;
  eventId: number;
  startTime: Date;
  endTime: Date;

  public identify(): string {
    return formatDate(this.startTime, "MM/dd", "en_US")
  }

  public identifyAs(identity: string): Session {
    /*Not sure if this will work... if you see it here, then it does ;) */
    return this;
  }

  public asTemplate(): Session {
    this.id=0;
    this.programId=0;
    this.eventId=0;
    this.startTime=null;
    this.endTime=null;
    return this;
  }
}

export class ProgramGroup extends Autocompletable {
  constructor() {
    super();
  }

  name: string;
  complete: boolean;

  public identify(): string {
    return this.name;
  }

  public identifyAs(identity: string): ProgramGroup {
    this.name=identity;
    return this;
  }

  public asTemplate(): ProgramGroup {
    this.id=0;
    this.name="";
    this.complete=false;
    return this;
  }
}
  
export class Section extends Autocompletable {
  constructor() {
    super();
  }

  name: string;
  programId: number;
  instructorId: number;
  instructorName: string;
  roomId: number;
  roomName: string;
  studentCount: number;
  complete: boolean;

  public identify(): string {
    return this.name;
  }

  public identifyAs(identity: string): Section {
    this.name=identity;
    return this;
  }

  public asTemplate(): Section {
    this.id=0;
    this.name="";
    this.programId=0;
    this.instructorId=0;
    this.instructorName='';
    this.roomId=0;
    this.roomName='';
    this.studentCount=0;
    this.complete=false;
    return this;
  }
}
  
export class SacramentalGroup extends Autocompletable {
  constructor() {
    super();
  }

  name: string;

  public identify(): string {
    return this.name;
  }

  public identifyAs(identity: string): SacramentalGroup {
    this.name=identity;
    return this;
  }

  public asTemplate(): SacramentalGroup {
    this.id=0;
    this.name="";
    return this;
  }
}

export class Registration extends Identifiable {
  constructor() {
    super();
  }

  enrolleeId: number;
  enrolleeName: string;
  programId: number;
  sectionId: number;
  sectionName: string;
  enrolleeAge: number;
  schoolGrade: string;
  sacramentalGroupId: number;
  sacramentalGroupName: string;

  public identify(): string {
    return this.enrolleeName;
  }

  public asTemplate(): Registration {
    this.id=0;
    this.enrolleeId=0;
    this.enrolleeName="";
    this.programId=0;
    this.sectionId=0;
    this.sectionName='';
    this.enrolleeAge=0;
    this.schoolGrade="";
    this.sacramentalGroupId=0;
    this.sacramentalGroupName='';
    return this;
  }
}