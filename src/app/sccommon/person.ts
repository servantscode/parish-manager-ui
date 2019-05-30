import { Autocompletable } from './identifiable';

import { Family } from './family';

export class Person extends Autocompletable {

  constructor() {
    super();
    this.family=new Family();
  }

  name: string;
  email: string;
  male: boolean;
  phoneNumber: string;
  headOfHousehold: boolean;
  family: Family;
  birthdate: Date;
  memberSince: Date;
  photoGuid: string;
  inactive: boolean;
  parishioner: boolean;
  baptized: boolean;
  confession: boolean;
  communion: boolean;
  confirmed: boolean;
  maritalStatus: string;
  ethnicity: string;
  primaryLanguage: string;

  public identify(): string { 
    return this.name;
  }

  public identifyAs(identity: string): Person {
    this.name=identity;
    return this;
  }

  public asTemplate(): Person {
    this.id=0;
    this.name="";
    this.male=false;
    this.email="";
    this.phoneNumber="";
    this.headOfHousehold =false;
    this.birthdate=new Date();
    this.memberSince=new Date();
    this.photoGuid="";
    this.inactive=false;
    this.parishioner=false;
    this.baptized=false;
    this.confession=false;
    this.communion=false;
    this.confirmed=false;
    this.maritalStatus=null;
    this.ethnicity=null;
    this.primaryLanguage=null;
    return this;
  }
}
