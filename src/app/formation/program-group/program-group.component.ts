import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { ProgramGroupService } from '../services/program-group.service';
import { ProgramGroupDialogComponent } from '../program-group-dialog/program-group-dialog.component';

@Component({
  selector: 'app-program-group',
  templateUrl: './program-group.component.html',
  styleUrls: ['./program-group.component.scss']
})
export class ProgramGroupComponent implements OnInit {

  ProgramGroupDialogComponent = ProgramGroupDialogComponent;

  constructor(public programGroupService: ProgramGroupService,
              private location: Location) { }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }
}
