import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseContentType } from '@angular/http';
import { catchError, map, tap } from 'rxjs/operators';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { MessageService } from '../../sccommon/services/message.service';
import { BaseService } from '../../sccommon/services/base.service';

import { DonationReport } from '../../finance/donation-report';

import { MetricsResponse } from '../metrics-response';
import { PledgeStatus } from '../pledge-status';

@Injectable({
  providedIn: 'root'
})
export class MetricsService extends BaseService {
  private url:string;

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected apiService: ApiLocatorService) { 
    super(http, messageService);
    this.url = apiService.prefaceUrl("/rest/metrics");
  }

  getYearlyRegistrations(): Observable<MetricsResponse> {
    return this.http.get<MetricsResponse>(this.url+`/people/registration/year`).pipe(
        catchError(this.handleError('getYearlyRegistrations', null))
      );
  }

  getMonthlyRegistrations(): Observable<MetricsResponse> {
    return this.http.get<MetricsResponse>(this.url+`/people/registration/month`).pipe(
        catchError(this.handleError('getMonthlyRegistrations', null))
      );
  }

  getAgeDemographics(): Observable<MetricsResponse> {
    return this.http.get<MetricsResponse>(this.url+`/people/age`).pipe(
        catchError(this.handleError('getAgeDemographics', null))
      );
  }

  getRegistrationDemographics(): Observable<MetricsResponse> {
    return this.http.get<MetricsResponse>(this.url+`/people/membership`).pipe(
        catchError(this.handleError('getRegistrationDemographics', null))
      );
  }

  getFamilySizes(): Observable<MetricsResponse> {
    return this.http.get<MetricsResponse>(this.url+`/families/size`).pipe(
        catchError(this.handleError('getFamilySizes', null))
      );
  }

  getPledgeFulfillments(fundId = 0): Observable<PledgeStatus> {
    var url = this.url+`/pledges/status`;
    if(fundId > 0)
      url += `/fund/${fundId}`;
    return this.http.get<PledgeStatus>(url).pipe(
        catchError(this.handleError('getPledgeFulfillment', null))
      );
  }

  getMonthlyDonations(fundId = 0): Observable<DonationReport[]> {
    var url = this.url+`/pledges/monthly`;
    if(fundId > 0)
      url += `/fund/${fundId}`;
    return this.http.get<DonationReport[]>(url).pipe(
        catchError(this.handleError('getMonthlyDonations', null))
      );
  }

  getMonthlyDonationReport(fundId = 0): Observable<any> {
    var url = this.url+`/pledges/monthly`;
    if(fundId > 0)
      url += `/fund/${fundId}`;

    return this.http.get(url, BaseService.csvOptions).pipe(
        catchError(this.handleError('getMonthlyDonations', null))
      );
  }
}
