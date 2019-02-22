import { Autocompletable } from '../sccommon/identifiable';

export class Room extends Autocompletable {
  constructor() {
    super();
  }

  name: string;
  type: string;
  capacity: number;

  public identify(): string {
    return name;
  }

  public identifyAs(identity: string): Room {
    this.name=identity;
    return this;
  }

  public asTemplate(): Room {
    this.id=0;
    this.name="";
    this.type="";
    this.capacity=0;
    return this;
  }
}