import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';

import { Donation } from '../donation';

const httpOptions = {
  headers: new HttpHeaders({
    'Accept': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  private url = 'http://localhost:83/rest/donation'

  constructor(private http: HttpClient,
              private messageService: MessageService) { }

  getFamilyContributions(familyId: number): Observable<Donation[]> {
    return this.http.get<Donation[]>(this.url+`/family/${familyId}`).pipe(
        catchError(this.handleError('getFamilyContributions', null))
      );
  }

  createDonation(donation: Donation): Observable<Donation> {
    return this.http.post<Donation>(this.url, donation, httpOptions).pipe(
        tap(donation => this.log('Created donation ' + donation.amount)),
        catchError(this.handleError('createDonation', null))
      );
  }

  updateDonation(donation: Donation): Observable<Donation> {
    return this.http.put<Donation>(this.url, donation, httpOptions).pipe(
        tap(donation => this.log('Updated donation ' + donation.amount)),
        catchError(this.handleError('updateDonation', null))
      );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.logError(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`${message}`);
  }

  private logError(message: string) {
    this.messageService.error(`FamilyService: ${message}`);
  }
}
