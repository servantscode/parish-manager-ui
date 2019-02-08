import { Identifiable } from '../sccommon/identifiable';

export class Room extends Identifiable {
  constructor() {
    super();
  }

  name: string;
  type: string;
  capacity: number;

  public identify(): string {
    return name;
  }
}