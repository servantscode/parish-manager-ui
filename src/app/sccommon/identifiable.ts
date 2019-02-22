export abstract class Identifiable {
  id: number;

  abstract identify(): string;

  abstract asTemplate(): Identifiable;
}

export abstract class Autocompletable extends Identifiable {
  constructor() {
    super();
  }
  
  abstract identifyAs(identity: string): Autocompletable;
}