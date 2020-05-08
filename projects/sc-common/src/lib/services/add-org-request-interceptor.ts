import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';

export class AddOrgRequestInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request to add the new header

    const url = window.location.href
    const org: string = url.split("\/")[2].split("\.")[0].split(":")[0];

    const clonedRequest = req.clone({ headers: req.headers.set('x-sc-org', org) });

    // Pass the cloned request instead of the original request to the next handle
    return next.handle(clonedRequest);
  }
}
