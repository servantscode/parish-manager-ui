import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  weekdays: string[] = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  daysOfWeek(): Observable<string[]> {
    return of<string[]>(this.weekdays);
  }

}
