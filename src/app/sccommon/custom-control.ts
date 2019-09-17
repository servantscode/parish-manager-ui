import { Identifiable } from 'sc-common';

export class CustomControl<T extends Identifiable> {

  constructor(type: string, action: (item:T) => void) {
    this.type = type;
    this.action = action;
  }

  type: string;
  action: (item:T) => void = null;

  invoke(item:T) {
    this.action(item);
  }
}