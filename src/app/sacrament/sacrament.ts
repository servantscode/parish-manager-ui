import { Identifiable } from '../sccommon/identifiable';

export class Identity {
  name: string;
  id: number;

  identify(): string {
    return this.name;
  }
}

export abstract class Sacrament extends Identifiable {
  constructor() {
    super();
  }

  notations: string[];
}

export class Baptism extends Sacrament {
  constructor() {
    super();
  }

  person:Identity;
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

  identify(): string {
    return this.person.name;
  }

  public asTemplate(): Baptism {
    this.id = 0;
    this.notations = [];
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
    return this;
  } 
}

export class Confirmation extends Sacrament {
  constructor() {
    super();
  }

  person:Identity;
  father: Identity;
  mother: Identity;
  baptismId: number;
  baptismLocation: string;
  baptismDate: Date;
  sponsor: Identity;
  confirmationLocation: string;
  confirmationDate: Date;
  minister: Identity;

  identify(): string {
    return this.person.name;
  }

  public asTemplate(): Confirmation {
    this.id = 0;
    this.notations = [];
    this.person = null;
    this.father = null;
    this.mother = null;
    this.baptismId = 0;
    this.baptismLocation = null;
    this.baptismDate = null;
    this.sponsor = null;
    this.confirmationLocation = null;
    this.confirmationDate = null;
    this.minister = null;
    return this;
  } 
}

export class Marriage extends Sacrament {
  constructor() {
    super();
  }

  groom: Identity;
  groomFather: Identity;
  groomMother: Identity;
  groomBaptismId: number
  groomBaptismLocation: string;
  groomBaptismDate: Date;
  bride: Identity;
  brideFather: Identity;
  brideMother: Identity;
  brideBaptismId: number
  brideBaptismLocation: string;
  brideBaptismDate: Date;
  marriageLocation: string;
  marriageDate: Date;
  minister: Identity;
  witness1: Identity;
  witness2: Identity;
  
  identify(): string {
    return this.groom.name;
  }

  public asTemplate(): Marriage {
    this.id = 0;
    this.notations = [];
    this.groom = null;
    this.groomFather = null;
    this.groomMother = null;
    this.groomBaptismId = 0;
    this.groomBaptismLocation = null;
    this.groomBaptismDate = null;
    this.bride = null;
    this.brideFather = null;
    this.brideMother = null;
    this.brideBaptismId = 0;
    this.brideBaptismLocation = null;
    this.brideBaptismDate = null;
    this.marriageLocation = null;
    this.marriageDate = null;
    this.minister = null;
    this.witness1 = null;
    this.witness2 = null;
    return this;
  } 
}