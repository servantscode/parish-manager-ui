import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { MessageService } from '../../sccommon/services/message.service';
import { PaginatedService } from '../../sccommon/services/paginated.service';
import { PaginatedResponse } from '../../sccommon/paginated.response';

import { Donation } from '../donation';
import { DonationPrediction } from '../donation-prediction';

import { Family } from '../../person/family';

const httpOptions = {
  headers: new HttpHeaders({
    'Accept': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class DonationService extends PaginatedService<Donation> {

  public selectedFamily:Family;

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService) {
    super(apiService.prefaceUrl("/rest/donation"), http, messageService);
  }

  public getPermissionType(): string {
    return "donation";
  }

  public getTemplate(): Donation {
    return new Donation().asTemplate();
  }

  getPage(start = 0, count = 10, search = ''): Observable<PaginatedResponse<Donation>> {
    if(!this.selectedFamily) 
      throw new Error("No selected family");

    return this.http.get<PaginatedResponse<Donation>>(this.url+`/family/${this.selectedFamily.id}?start=${start}&count=${count}&partial_name=${search}`).pipe(
        map(resp => this.mapResults(resp)),
        catchError(this.handleError('getFamilyContributions', null))
      );
  }

  createDonations(donations: Donation[]): Observable<Donation[]> {
    return this.http.post<Donation[]>(this.url + '/batch', donations, httpOptions).pipe(
        tap(donations => this.log(`Created ${donations.length} donations`)),
        catchError(this.handleError('createDonations', null))
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
