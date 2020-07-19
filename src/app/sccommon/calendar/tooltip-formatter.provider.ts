import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
import { format } from 'date-fns';

export class TooltipFormatter extends CalendarEventTitleFormatter {
  // you can override any of the methods defined in the parent class

  monthTooltip(event: any): string {
    var tooltip = "<strong>" + event.title + "</strong><br/>" + format(event.start, 'h:mm a');
    if(event.reservations)
      event.reservations.forEach(res => tooltip += "<br/>" + res.resourceName);
    if(event.additionalDetail)
      tooltip += "<br/><i>" + event.additionalDetail + "</i>";
    return tooltip;
  }

  weekTooltip(event: any): string {
    var tooltip = "<strong>" + event.title + "</strong>";
    if(event.reservations)
      event.reservations.forEach(res => tooltip += "<br/>" + res.resourceName);
    if(event.additionalDetail)
      tooltip += "<br/><i>" + event.additionalDetail + "</i>";
    return tooltip;
  }

  dayTooltip(event: any): string {
    var tooltip = "<strong>" + event.title + "</strong>";
    if(event.reservations)
      event.reservations.forEach(res => tooltip += "<br/>" + res.resourceName);
    if(event.additionalDetail)
      tooltip += "<br/><i>" + event.additionalDetail + "</i>";
    return tooltip;
  }
}