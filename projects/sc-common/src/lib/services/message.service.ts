import { Injectable } from '@angular/core';

export class Alert {
  message: string;
  type: string;

  constructor(aMessage: string, aType: string) {
    this.message=aMessage;
    this.type=aType;
  }
}


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  alerts: Alert[] = [];

  add(message: string) {
    this.info(message);
  }

  info(message: string) {
    this.show(new Alert(message, "info"));
  }

  error(message: string) {
    this.show(new Alert(message, "danger"));
  }

  show(alert: Alert) {
    this.alerts.push(alert);
    setTimeout(() => this.close(alert), 5000);
  }

  clear() {
    this.alerts = [];
  }

  close(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert),1);
  }
}
