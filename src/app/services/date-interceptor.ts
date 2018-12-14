import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from "rxjs/operators";


@Injectable()
export class DateInterceptor implements HttpInterceptor {
  // Migrated from AngularJS https://raw.githubusercontent.com/Ins87/angular-date-interceptor/master/src/angular-date-interceptor.js
  private iso8601 = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/;
  private shortDate = /^\d{4}-\d{2}-\d{2}/;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const body = event.body;
          this.convertToDate(body);
        }
      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
          }
        }
      })
    );
  }

  convertToDate(body) {
    if (body === null || body === undefined) {
      return body;
    }

    if (typeof body !== 'object') {
      return body;
    }

    for (const key of Object.keys(body)) {
      const value = body[key];
      if (this.isIso8601(value)) {
        body[key] = new Date(value);
      } else if (this.isShortDate(value)) {
        // Such HACK!! Much sorrow... 
        // Parsing a date without a time causes JavaScript to automatically drop hours due to timezone processing.
        // This hack ensures the date is actually preserved and not rolled back {timezone} hours.
        // If someone every figures out how to process dates w/o times that respects timezone, 
        // tell Greg that you fixed this and relieve him of his grief.
        const d = new Date(value);
        body[key] = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
      } else if (typeof value === 'object') {
        this.convertToDate(value);
      }
    }
  }

  isShortDate(value) {
    if (value === null || value === undefined) {
      return false;
    }

    return this.shortDate.test(value);
  }

  isIso8601(value) {
    if (value === null || value === undefined) {
      return false;
    }

    return this.iso8601.test(value);
  }
}
