export class Reservation {
  id: number;
  resourceType: string;
  resourceId: number;
  resourceName: string;
  eventId: number;
  eventTitle: string;
  reservingPersonId: number;
  reserverName: string;
  startTime: Date;
  endTime: Date;

  static template(): Reservation {
    var template = new Reservation();
    template.id = 0;
    template.resourceType = 'ROOM';
    template.resourceId = 0;
    template.resourceName = null;
    template.eventId = 0;
    template.eventTitle = '';
    template.reservingPersonId = 0;
    template.reserverName = '';
    template.startTime = new Date();
    template.endTime = new Date();
    return template;
  }
}
