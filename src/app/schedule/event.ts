import { Reservation } from './reservation';

export class Event {
  id: number;
  startTime: Date;
  endTime: Date;
  description: string;
  schedulerId: number;
  ministryName: string;
  ministryId: number;

  reservations: Reservation[] = [];
  recurrence: Recurrence;
}

export class Recurrence {
  id: number;
  cycle: string;
  frequency: number;
  endDate: Date;
  weeklyDays: string[];
}
