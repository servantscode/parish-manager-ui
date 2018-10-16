export class Alert {
  message: string;
  type: string;

  constructor(aMessage: string, aType: string) {
    this.message=aMessage;
    this.type=aType;
  }
}
