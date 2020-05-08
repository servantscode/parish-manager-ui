import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Catechist } from 'sc-common';

import { CatechistDialogComponent } from '../catechist-dialog/catechist-dialog.component';

import { CatechistService } from '../services/catechist.service';


@Component({
  selector: 'app-catechist',
  templateUrl: './catechist.component.html',
  styleUrls: ['./catechist.component.scss']
})
export class CatechistComponent implements OnInit {


  CatechistDialogComponent = CatechistDialogComponent;

  activeProgram: number;

  constructor(public catechistService: CatechistService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.activeProgram = +this.route.snapshot.paramMap.get('id');
  }
}
