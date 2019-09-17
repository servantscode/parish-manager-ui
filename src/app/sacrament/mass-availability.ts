import { Identifiable } from 'sc-common';
import { formatDate } from '@angular/common';

export class MassAvailability extends Identifiable {
  constructor() {
    super();
  }

  title:string;
  massTime: Date;

  public identify(): string {
    return this.title + " " + formatDate(this.massTime, "MM/dd/yy hh:mma", "en_US");
  }

  public asTemplate(): MassAvailability {
    this.id=0;
    this.title=null;
    this.massTime=null;
    return this;
  }
}