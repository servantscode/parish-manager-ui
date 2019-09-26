import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from 'sc-common';

import { ApiLocatorService } from 'sc-common';
import { LoginService } from 'sc-common';
import { PaginatedService, PaginatedResponse } from 'sc-common';
import { Family } from 'sc-common';

import { Donation } from '../donation';
import { DonationPrediction } from '../donation-prediction';


@Injectable({
  providedIn: 'root'
})
export class DonationService extends PaginatedService<Donation> {

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService,
              protected loginService: LoginService) {
    super(apiService.prefaceUrl("/rest/donation"), http, messageService, loginService);
  }

  public getPermissionType(): string {
    return "donation";
  }

  public getTemplate(): Donation {
    return new Donation().asTemplate();
  }


  public getPage(start = 0, count = 10, search = '', pathVars?: any): Observable<PaginatedResponse<Donation>> {
    const url = (pathVars && pathVars.familyId)? this.url+`/family/${pathVars.familyId}`: this.url;

    return this.http.get<PaginatedResponse<Donation>>(url+`?start=${start}&count=${count}&search=${encodeURI(search)}`).pipe(
        map(resp => this.mapResults(resp)),
        catchError(this.handleError('getPage', null))
      );
  }

  createDonations(donations: Donation[]): Observable<Donation[]> {
    return this.http.post<Donation[]>(this.url + '/batch', donations, this.httpOptions).pipe(
        tap(donations => this.log(`Created ${donations.length} donations`)),
        catchError(this.handleError('createDonations', null))
      );
  }

  getDonationTypes(): Observable<string[]> {
    return this.http.get(this.url + '/types').pipe(
        catchError(this.handleError('getDonationTypes', null))
      );
  }

  public getReport(search = ''): Observable<any> {
    return this.http.get(this.url + `/report?search=${encodeURI(search)}`, PaginatedService.csvOptions).pipe(
        catchError(this.handleError('ministryReport', null))
      );
  }

  getDonationPrediction(fundId: number, familyId: number = 0, envelopeNum: number = 0): Observable<DonationPrediction> {
    var options = '';
    if(envelopeNum > 0) {
      options = `envelopeNumber=${envelopeNum}`;
    } else {
      options = `familyId=${familyId}`;
    }

    options += `&fundId=${fundId}`;

    return this.http.get(this.url + `/predict?${options}`).pipe(
        catchError(this.handleError('getDonationPrediction', null, [404]))
      );
  }
}
