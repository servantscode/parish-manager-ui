import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { SacramentalGroupService } from '../services/sacramental-group.service';
import { SacramentalGroupDialogComponent } from '../sacramental-group-dialog/sacramental-group-dialog.component';

@Component({
  selector: 'app-sacramental-group',
  templateUrl: './sacramental-group.component.html',
  styleUrls: ['./sacramental-group.component.scss']
})
export class SacramentalGroupComponent implements OnInit {
  
  SacramentalGroupDialogComponent = SacramentalGroupDialogComponent;

  constructor(public sacramentalGroupService: SacramentalGroupService,
              private location: Location) { }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }
}
