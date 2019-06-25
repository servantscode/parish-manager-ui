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

  public asTemplate(): Reservation {
    this.id = 0;
    this.resourceType = 'ROOM';
    this.resourceId = 0;
    this.resourceName = null;
    this.eventId = 0;
    this.eventTitle = '';
    this.reservingPersonId = 0;
    this.reserverName = '';
    this.startTime = new Date();
    this.endTime = new Date();
    return this;
  }
}
