import { Autocompletable } from '../sccommon/identifiable';

export class Program extends Autocompletable {
  constructor() {
    super();
  }

  name: string;
  groupId: number;
  coordinatorId: number;
  coordinatorName: string;

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
  