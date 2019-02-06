import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from '../sccommon/services/message.service';
import { BaseService } from '../sccommon/services/base.service';

import { Donation } from '../donation';
import { DonationPrediction } from '../donation-prediction';

const httpOptions = {
  headers: new HttpHeaders({
    'Accept': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class DonationService extends BaseService {
  private url = 'http://localhost:83/rest/donation'

  constructor(protected http: HttpClient,
              protected messageService: MessageService) {
    super(http, messageService);
  }

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

  createDonations(donations: Donation[]): Observable<Donation[]> {
    return this.http.post<Donation[]>(this.url + '/batch', donations, httpOptions).pipe(
        tap(donations => this.log(`Created ${donations.length} donations`)),
        catchError(this.handleError('createDonations', null))
      );
  }

  updateDonation(donation: Donation): Observable<Donation> {
    return this.http.put<Donation>(this.url, donation, httpOptions).pipe(
        tap(donation => this.log('Updated donation ' + donation.amount)),
        catchError(this.handleError('updateDonation', null))
      );
  }

  getDonationTypes(): Observable<string[]> {
    return this.http.get(this.url + '/types').pipe(
        catchError(this.handleError('getDonationTypes', null))
      );
  }

  getDonationPrediction(familyId: number = 0, envelopeNum: number = 0): Observable<DonationPrediction> {
    var options = '';
    if(envelopeNum > 0) {
      options = `envelopeNumber=${envelopeNum}`;
    } else {
      options = `familyId=${familyId}`;
    }

    return this.http.get(this.url + `/predict?${options}`).pipe(
        catchError(this.handleError('getDonationPrediction', null))
      );
  }
}
