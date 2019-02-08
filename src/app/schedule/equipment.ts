import { Identifiable } from '../sccommon/identifiable';

export class Equipment extends Identifiable {
  constructor() {
    super();
  }

  name: string;
  manufacturer: string;
  description: string;

  public identify(): string {
    return name;
  }
}