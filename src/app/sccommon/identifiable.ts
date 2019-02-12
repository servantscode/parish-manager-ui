export abstract class Identifiable {
  id: number;

  abstract identify(): string;
  abstract identifyAs(identity: string): Identifiable;

  abstract asTemplate(): Identifiable;
}