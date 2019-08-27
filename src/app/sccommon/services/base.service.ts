import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { LoginService } from './login.service';
import { MessageService } from './message.service';

export class BaseService {

  protected httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  protected static csvOptions = {
      headers: new HttpHeaders({'Accept': 'text/plain'}),
      responseType: 'text' as 'text'
    };

  constructor(protected http: HttpClient,
              protected messageService: MessageService,
              protected loginService: LoginService) { }

  protected handleError<T> (operation = 'operation', result?: T, ignoredErrorCodes?: number[]) {
    return (error: any): Observable<T> => {
      if(error.status == 401)
        this.loginService.logout();

      if(!ignoredErrorCodes || ignoredErrorCodes.indexOf(error.status) == -1) {
        console.error(error);
        this.logError(`${operation} failed: ${error.message}`);
      }
      return of(result as T);
    };
  }

  protected log(message: string) {
    this.messageService.add(`${message}`);
  }

  protected logError(message: string) {
    this.messageService.error(`${message}`);
  }

  protected modifyUrl(url:string, vars:any) {
    if(!vars)
      return url;
  
    var resp = url;
    for(let key of Object.keys(vars)) {
      if(!vars[key])
        alert("Null value for pathParam: " + key);
      resp = resp.replace(':' + key + ':', vars[key]);
    }
    return resp;
  }
}
