import { Component, OnInit, Input } from '@angular/core';

import { Baptism } from '../sacrament';

@Component({
  selector: 'app-baptism-details',
  templateUrl: './baptism-details.component.html',
  styleUrls: ['./baptism-details.component.scss']
})
export class BaptismDetailsComponent implements OnInit {

  @Input() baptism: Baptism;

  constructor() { }

  ngOnInit() {}
}
