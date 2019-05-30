import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ApiLocatorService } from './api-locator.service';
import { BaseService } from './base.service';
import { MessageService } from './message.service';


@Injectable({
  providedIn: 'root'
})
export class PhotoService extends BaseService {
  private url:string;

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected router: Router,
              protected apiService: ApiLocatorService) { 
    super(http, messageService, router);
    this.url = apiService.prefaceUrl('/rest/photo');
  }

  getImage(guid: string): Observable<Blob> {
    return this.http.get(this.url + `/${guid}`, { responseType: 'blob' }).pipe(
        catchError(this.handleError('get image', null))
      );;
  }

  uploadImage(fileToUpload: File): Observable<string> {
    return this.http.post<any>(this.url, fileToUpload, {headers: {"Content-Type": fileToUpload.type}}).pipe(
        map(resp => resp.guid),
        tap(guid => this.log('Image Stored')),
        catchError(this.handleError('uploadImage', null)));
  }
}
