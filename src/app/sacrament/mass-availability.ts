import { Identifiable } from '../sccommon/identifiable';
import { formatDate } from '@angular/common';

export class MassAvailability extends Identifiable {
  constructor() {
    super();
  }

  description:string;
  massTime: Date;

  public identify(): string {
    return this.description + " " + formatDate(this.massTime, "MM/dd/yy hh:mma", "en_US");
  }

  public asTemplate(): MassAvailability {
    this.id=0;
    this.description=null;
    this.massTime=null;
    return this;
  }
}