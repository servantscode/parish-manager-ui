import { Component, OnInit } from '@angular/core';

import { PreferenceDialogComponent } from '../preference-dialog/preference-dialog.component';

import { PreferencesService } from '../../sccommon/services/preferences.service';

@Component({
  selector: 'app-preference-config',
  templateUrl: './preference-config.component.html',
  styleUrls: ['./preference-config.component.scss']
})
export class PreferenceConfigComponent implements OnInit {

  PreferenceDialogComponent = PreferenceDialogComponent;

  constructor(public preferencesService: PreferencesService) { }

  ngOnInit() {
  }

}
