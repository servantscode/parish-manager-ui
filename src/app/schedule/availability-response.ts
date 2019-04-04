import { Reservation } from './reservation';

export class AvailabilityResponse {
  availability: AvailabilityWindow[];
  resourceType: string;
  resourceId: number;
  available: boolean;
  reservations: Reservation[];
}

export class AvailabilityWindow {
  constructor(start: Date, end: Date) {
    this.startTime = start;
    this.endTime = end;
  }
  
  startTime: Date;
  endTime: Date;
}
