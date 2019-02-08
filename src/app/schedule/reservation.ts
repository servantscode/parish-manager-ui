export class Reservation {
  id: number;
  resourceType: string;
  resourceId: number;
  eventId: number;
  reservingPersonId: number;
  startTime: Date;
  endTime: Date;

  static template(): Reservation {
    var template = new Reservation();
    template.id = 0;
    template.resourceType = 'ROOM';
    template.resourceId = 0;
    template.eventId = 0;
    template.reservingPersonId = 0;
    template.startTime = new Date();
    template.endTime = new Date();
    return template;
  }
}
