import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MessageService } from './message.service';

export class BaseService {

  constructor(protected http: HttpClient,
              protected messageService: MessageService) { }

  protected handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.logError(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  protected log(message: string) {
    this.messageService.add(`${message}`);
  }

  protected logError(message: string) {
    this.messageService.error(`${message}`);
  }
}