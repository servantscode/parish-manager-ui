import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { AvailabilityService } from '../services/availability.service';
import { Reservation } from '../reservation';
import { AvailabilityWindow } from '../availability-response';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.scss']
})
export class AvailabilityComponent implements OnInit, OnChanges {
  @Input() res: Reservation;

  isAvailable: boolean;
  availability: AvailabilityWindow[];

  constructor(private availabilityService: AvailabilityService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if(this.res == null)
      return;

   this.availabilityService.getAvailability(this.res)
     .subscribe(resp => {
       this.availability = resp.availability;
       this.isAvailable = resp.available;
     });
  }
}
