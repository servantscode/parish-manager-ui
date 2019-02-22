import { Autocompletable } from '../sccommon/identifiable';

import { Family } from './family';

export class Person extends Autocompletable {

  constructor() {
    super();
    this.family=new Family();
  }

  name: string;
  email: string;
  phoneNumber: string;
  headOfHousehold: boolean;
  family: Family;
  birthdate: Date;
  memberSince: Date;
  photoGuid: string;

  public identify(): string { 
    return this.name;
  }

  public identifyAs(identity: string): Person {
    this.name=identity;
    return this;
  }

  public asTemplate(): Person {
    this.id=0;
    this.name=""
    this.email="";
    this.phoneNumber="";
    this.headOfHousehold =false;
    this.birthdate=new Date();
    this.memberSince=new Date();
    this.photoGuid="";
    return this;
  }
}
