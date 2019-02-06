import { Identifiable } from '../sccommon/identifiable';

export class Role extends Identifiable {
  constructor() {
    super();
  }

  name: string;
  permissions: string[];

  public identify(): string {
    return name;
  }
}
