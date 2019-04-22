import { Component, OnInit, Input } from '@angular/core';

import { BaptismService } from '../services/baptism.service';

import { Baptism } from '../sacrament';

@Component({
  selector: 'app-baptism-details',
  templateUrl: './baptism-details.component.html',
  styleUrls: ['./baptism-details.component.scss']
})
export class BaptismDetailsComponent implements OnInit {

  @Input() baptism: Baptism;

  constructor(public baptismService: BaptismService) { }

  ngOnInit() {
  }
}
