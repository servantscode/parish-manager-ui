import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { BaptismService } from '../services/baptism.service';

import { Baptism } from '../sacrament';

@Component({
  selector: 'app-baptism',
  templateUrl: './baptism.component.html',
  styleUrls: ['./baptism.component.scss']
})
export class BaptismComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              public baptismService: BaptismService) { }

  baptism: Baptism;

  ngOnInit() {
    const personId = +this.route.snapshot.paramMap.get('id');

    this.baptismService.getByPerson(personId).subscribe(resp => this.baptism=resp);
  }
}
