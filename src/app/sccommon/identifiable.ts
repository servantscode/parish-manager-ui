export abstract class Identifiable {
  id: number;

  abstract identify(): string;
}