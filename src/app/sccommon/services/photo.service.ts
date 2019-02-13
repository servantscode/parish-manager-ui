import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { BaseService } from './base.service';
import { MessageService } from './message.service';


@Injectable({
  providedIn: 'root'
})
export class PhotoService extends BaseService {
  private url = "http://localhost:85/rest/photo";

  constructor(protected http: HttpClient,
              protected messageService: MessageService) { 
    super(http, messageService);
  }

  getImage(guid: string): Observable<Blob> {
    return this.http.get(this.url + `/${guid}`, { responseType: 'blob' }).pipe(
        catchError(this.handleError('get image', null))
      );;
  }
}
