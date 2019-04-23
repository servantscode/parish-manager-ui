import { Identifiable } from '../sccommon/identifiable';

export class Identity {
  name: string;
  id: number;
}

export abstract class Sacrament extends Identifiable {
  constructor() {
    super();
  }

  person:Identity;
  notations: string[];

  identify(): string {
    return this.person.name;
  }
}

export class Baptism extends Sacrament {
  constructor() {
    super();
  }

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

  public asTemplate(): Baptism {
    this.id = 0;
    this.person = null;
    this.notations = [];
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
    return this;
  } 
}

export class Confirmation extends Sacrament {
  constructor() {
    super();
  }

  father: Identity;
  mother: Identity;
  baptismLocation: string;
  baptismDate: Date;
  sponsor: Identity;
  confirmationLocation: string;
  confirmationDate: Date;
  minister: Identity;

  public asTemplate(): Confirmation {
    this.id = 0;
    this.person = null;
    this.notations = [];
    this.father = null;
    this.mother = null;
    this.baptismLocation = null;
    this.baptismDate = null;
    this.sponsor = null;
    this.confirmationLocation = null;
    this.confirmationDate = null;
    this.minister = null;
    return this;
  } 
}