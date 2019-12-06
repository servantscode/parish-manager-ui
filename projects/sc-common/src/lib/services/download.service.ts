import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor() { }

  downloadReport(reportInvocation:Observable<any>, filename:string) {
    reportInvocation.subscribe(data => this.downloadFile(data, filename, 'text/csv'));
  }

  downloadPdf(reportInvocation:Observable<any>, filename:string) {
    reportInvocation.subscribe(data => this.downloadFile(data, filename, 'application/pdf'));
  }

  downloadFile(data: any, filename:string, filetype:string = 'text/csv') {
    const blob: Blob = new Blob([data], {type: filetype});
    const objectUrl: string = URL.createObjectURL(blob);
    const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;

    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();        

    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);  
  }
}
