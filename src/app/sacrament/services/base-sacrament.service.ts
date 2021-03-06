import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

import { MessageService } from 'sc-common';

import { LoginService } from 'sc-common';
import { PaginatedService } from 'sc-common';

import { Sacrament } from '../sacrament';

export abstract class BaseSacramentService<T extends Sacrament> extends PaginatedService<T> {

  constructor(protected url: string,
              protected http: HttpClient,
              protected messageService: MessageService,
              protected loginService: LoginService) {
    super(url, http, messageService, loginService);
  }

  getByPerson(personId: number): Observable<T> {
    return this.http.get<T>(this.url + `/person/${personId}`).pipe(
        map(resp => this.mapObject(resp)),
        catchError(this.handleError('getByPerson', null, [404]))
      );
  }

  addNotation(sacramentId: number, notation: string): Observable<void> {
    return this.http.post<void>(this.url + `/${sacramentId}/notation`, notation, this.httpOptions).pipe(
        catchError(this.handleError('addNotation', null))
      );
  }
}