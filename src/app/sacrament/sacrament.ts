import { Identifiable } from '../sccommon/identifiable';

export class Identity {
  name: string;
  id: number;
}

export class Baptism extends Identifiable {
  constructor() {
    super();
  }

  person: Identity;
  baptismLocation: string;
  baptismDate: Date;
  birthLocation: string;
  birthDate: Date;
  minister: Identity;
  father: Identity;
  mother: Identity;
  godfather: Identity;
  godmother: Identity;
  witness: Identity;
  conditional: boolean;
  reception: boolean;
  notations: string[];

  identify(): string {
    return this.person.name;
  }

  public asTemplate(): Baptism {
    this.id=0;
    this.person = null;
    this.baptismLocation = null;
    this.baptismDate = null;
    this.birthLocation = null;
    this.birthDate = null;
    this.minister = null;
    this.father = null;
    this.mother = null;
    this.godfather = null;
    this.godmother = null;
    this.witness = null;
    this.conditional = false;
    this.reception = false;
    this.notations = [];
    return this;
  } 
}