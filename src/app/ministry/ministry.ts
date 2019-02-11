import { Identifiable } from '../sccommon/identifiable';

export class Ministry extends Identifiable {

  constructor() {
    super();
  }

  name: string;

  public identify(): string {
    return name;
  }
}