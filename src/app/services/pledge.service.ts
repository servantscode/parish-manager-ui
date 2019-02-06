import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from '../sccommon/services/message.service';
import { BaseService } from '../sccommon/services/base.service';

import { Pledge } from '../pledge';

const httpOptions = {
  headers: new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class PledgeService extends BaseService {
  private url = 'http://localhost:83/rest/pledge'

  constructor(protected http: HttpClient,
              protected messageService: MessageService) { 
    super(http, messageService);
  }

  getPledge(familyId: number): Observable<Pledge> {
    return this.http.get<Pledge>(this.url+`/family/${familyId}`).pipe(
        catchError(this.handleError('getPledge', null))
      );
  }

  createPledge(pledge: Pledge): Observable<Pledge> {
    return this.http.post<Pledge>(this.url, pledge, httpOptions).pipe(
        tap(pledge => this.log('Created pledge ' + pledge.pledgeAmount)),
        catchError(this.handleError('createPledge', null))
      );
  }

  updatePledge(pledge: Pledge): Observable<Pledge> {
    return this.http.put<Pledge>(this.url + `/${pledge.id}`, pledge, httpOptions).pipe(
        tap(pledge => this.log('Updated pledge ' + pledge.pledgeAmount)),
        catchError(this.handleError('updatePledge', null))
      );
  }

  getPledgeTypes(): Observable<string[]> {
    return this.http.get<string[]>(this.url+`/types`).pipe(
        catchError(this.handleError('getPledgeTypes', null))
      );
  }

  getPledgeFrequencies(): Observable<string[]> {
    return this.http.get<string[]>(this.url+`/freqs`).pipe(
        catchError(this.handleError('getPledgeFrequencies', null))
      );
  }
}
