import { Component, OnInit } from '@angular/core';

import { MassIntentionService } from '../services/mass-intention.service';

import { MassIntentionDialogComponent } from '../mass-intention-dialog/mass-intention-dialog.component';

@Component({
  selector: 'app-mass-intention',
  templateUrl: './mass-intention.component.html',
  styleUrls: ['./mass-intention.component.scss']
})
export class MassIntentionComponent implements OnInit {

  MassIntentionDialogComponent = MassIntentionDialogComponent;

  constructor(public massIntentionService: MassIntentionService) { }

  ngOnInit() {
  }

}
