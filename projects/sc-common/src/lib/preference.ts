import { Observable } from 'rxjs';

import { Autocompletable } from './identifiable';

export class Preference extends Autocompletable {

  constructor() {
    super();
  }

  name: string;
  type: string;
  objectType: string;
  defaultValue: string;

  public identify(): string { 
    return this.name;
  }

  public identifyAs(identity: string): Preference {
    this.name=identity;
    return this;
  }

  public asTemplate(): Preference {
    this.id=0;
    this.name="";
    this.type="";
    this.objectType="";
    this.defaultValue="";
    return this;
  }
}

export interface PreferenceSource {
  getPreferences(id: number): Observable<any>;

  updatePreferences(id: number, preferences: any): Observable<void>;
}