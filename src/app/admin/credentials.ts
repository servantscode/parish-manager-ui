import { Identifiable } from '../sccommon/identifiable';

export class Credentials extends Identifiable {
  constructor() {
    super();
  }
  
  name: string;
  email: string;
  role: string;

  public identify(): string {
    return this.name;
  }

  public asTemplate(): Credentials {
    this.id=0;
    this.name="";
    this.email="";
    this.role="";
    return this;
  }
}
