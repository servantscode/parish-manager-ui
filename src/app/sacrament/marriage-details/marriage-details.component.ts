import { Component, OnInit, Input } from '@angular/core';

import { MarriageService } from '../services/marriage.service';

import { Marriage } from '../sacrament';

@Component({
  selector: 'app-marriage-details',
  templateUrl: './marriage-details.component.html',
  styleUrls: ['./marriage-details.component.scss']
})
export class MarriageDetailsComponent implements OnInit {

  @Input() marriage: Marriage;

  constructor(public marriageService: MarriageService) { }

  ngOnInit() {
  }
}
