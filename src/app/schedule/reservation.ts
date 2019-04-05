export class Reservation {
  id: number;
  resourceType: string;
  resourceId: number;
  eventId: number;
  eventDescription: string;
  reservingPersonId: number;
  reserverName: string;
  startTime: Date;
  endTime: Date;

  static template(): Reservation {
    var template = new Reservation();
    template.id = 0;
    template.resourceType = 'ROOM';
    template.resourceId = 0;
    template.eventId = 0;
    template.eventDescription = '';
    template.reservingPersonId = 0;
    template.reserverName = '';
    template.startTime = new Date();
    template.endTime = new Date();
    return template;
  }
}
