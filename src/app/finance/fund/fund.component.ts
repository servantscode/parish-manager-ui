import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { FundService } from '../services/fund.service';
import { FundDialogComponent } from '../fund-dialog/fund-dialog.component';

@Component({
  selector: 'app-fund',
  templateUrl: './fund.component.html',
  styleUrls: ['./fund.component.scss']
})
export class FundComponent implements OnInit {

  FundDialogComponent = FundDialogComponent;

  constructor(public fundService: FundService,
              private location: Location) { }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }
}
