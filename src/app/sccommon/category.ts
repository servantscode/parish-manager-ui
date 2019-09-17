import { Observable } from 'rxjs';

import { Autocompletable } from 'sc-common';

export class Category extends Autocompletable {

  constructor() {
    super();
  }

  name: string;
 
  public identify(): string { 
    return this.name;
  }

  public identifyAs(identity: string): Category {
    this.name=identity;
    return this;
  }

  public asTemplate(): Category {
    this.id=0;
    this.name="";
    return this;
  }
}