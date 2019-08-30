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
  phoneNumbers: PhoneNumber[];
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
  religion: string;
  specialNeeds: string[];
  occupation: string;

  public identify(): string { 
    return this.name;
  }

  public identifyAs(identity: string): Person {
    this.name=identity;
    return this;
  }

  public getPrimaryPhone(): String {
    return this.phoneNumbers.find(n => n.primary).phoneNumber;
  }

  public asTemplate(): Person {
    this.id=0;
    this.name="";
    this.male=false;
    this.email="";
    this.phoneNumbers=[];
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
    this.religion=null;
    this.specialNeeds=null;
    this.occupation=null;
    return this;
  }
}

export class PhoneNumber {
  phoneNumber:string;
  type:string;
  primary: boolean;
}