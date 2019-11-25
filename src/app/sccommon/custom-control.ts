import { Identifiable } from 'sc-common';

export class CustomControl<T extends Identifiable> {

  constructor(type: string, action: (item:T) => void, enabled?: (item:T) => boolean, busy?: (item:T) => boolean) {
    this.type = type;
    this.action = action;
    this.enabled = enabled;
    this.busy = busy;
  }

  type: string;
  action: (item:T) => void = null;
  enabled: (item:T) => boolean = null;
  busy: (item:T) => boolean = null;

  isBusy(item:T): boolean {
    return this.busy? this.busy(item): false;
  }

  isEnabled(item:T): boolean {
    return this.enabled? this.enabled(item): true;
  }

  invoke(item:T) {
    this.action(item);
  }
}