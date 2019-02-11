import { Identifiable } from '../sccommon/identifiable';

export class Credentials extends Identifiable {
  constructor() {
    super();
  }
  
  name: string;
  email: string;
  role: string;

  public identify(): string {
    return name;
  }
}
