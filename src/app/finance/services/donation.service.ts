import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { ApiLocatorService } from '../../sccommon/services/api-locator.service';
import { LoginService } from '../../sccommon/services/login.service';
import { MessageService } from '../../sccommon/services/message.service';
import { PaginatedService } from '../../sccommon/services/paginated.service';
import { PaginatedResponse } from '../../sccommon/paginated.response';
import { Family } from '../../sccommon/family';

import { Donation } from '../donation';
import { DonationPrediction } from '../donation-prediction';


@Injectable({
  providedIn: 'root'
})
export class DonationService extends PaginatedService<Donation> {

  public selectedFamily:Family;

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

  getPage(start = 0, count = 10, search = ''): Observable<PaginatedResponse<Donation>> {
    if(!this.selectedFamily) 
      throw new Error("No selected family");

    return this.http.get<PaginatedResponse<Donation>>(this.url+`/family/${this.selectedFamily.id}?start=${start}&count=${count}&search=${encodeURI(search)}`).pipe(
        map(resp => this.mapResults(resp)),
        catchError(this.handleError('getFamilyContributions', null))
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
