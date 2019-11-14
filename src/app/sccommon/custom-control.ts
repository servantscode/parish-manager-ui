import { Identifiable } from 'sc-common';

export class CustomControl<T extends Identifiable> {

  constructor(type: string, action: (item:T) => void, enabled?: (item:T) => boolean) {
    this.type = type;
    this.action = action;
    this.enabled = enabled;
  }

  type: string;
  action: (item:T) => void = null;
  enabled: (item:T) => boolean = null;

  isEnabled(item:T): boolean {
    return this.enabled? this.enabled(item): true;
  }

  invoke(item:T) {
    this.action(item);
  }
}