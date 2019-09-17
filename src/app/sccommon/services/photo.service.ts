import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from 'sc-common';

import { ApiLocatorService } from 'sc-common';
import { BaseService } from 'sc-common';
import { LoginService } from 'sc-common';


@Injectable({
  providedIn: 'root'
})
export class PhotoService extends BaseService {
  private url:string;

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected loginService: LoginService,
              protected apiService: ApiLocatorService) { 
    super(http, messageService, loginService);
    this.url = apiService.prefaceUrl('/rest/photo');
  }

  getImage(guid: string): Observable<Blob> {
    return this.http.get(this.url + `/${guid}`, { responseType: 'blob' }).pipe(
        catchError(this.handleError('get image', null))
      );;
  }

  getPublicImage(guid: string): Observable<Blob> {
    return this.http.get(this.url + `/public/${guid}`, { responseType: 'blob' }).pipe(
        catchError(this.handleError('get image', null))
      );;
  }

  uploadImage(fileToUpload: File): Observable<string> {
    return this.http.post<any>(this.url, fileToUpload, {headers: {"Content-Type": fileToUpload.type}}).pipe(
        map(resp => resp.guid),
        tap(guid => this.log('Image Stored')),
        catchError(this.handleError('uploadImage', null)));
  }

  uploadPublicImage(fileToUpload: File): Observable<string> {
    return this.http.post<any>(this.url+"/public", fileToUpload, {headers: {"Content-Type": fileToUpload.type}}).pipe(
        map(resp => resp.guid),
        tap(guid => this.log('Image Stored')),
        catchError(this.handleError('uploadPublicImage', null)));
  }
}
