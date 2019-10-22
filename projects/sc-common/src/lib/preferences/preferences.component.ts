import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup, AbstractControl } from '@angular/forms';

import { PreferencesService } from '../services/preferences.service';

import { Preference, PreferenceSource } from '../preference';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {

  @Input() id: number;
  @Input() type: string;
  @Input() preferenceSource: PreferenceSource;

  changesReady = false;

  preferencesForm = this.fb.group({
      preferences: {}
    });

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    if(this.id)
      this.preferenceSource.getPreferences(this.id).subscribe(prefs => {
          this.preferencesForm.get('preferences').setValue(prefs);
        });
  
    this.preferencesForm.valueChanges.subscribe(() => this.changesReady = true);
  }

  save() {
    const prefs = this.preferencesForm.get('preferences').value;
    this.preferenceSource.updatePreferences(this.id, prefs).subscribe(() => this.changesReady = false);
  }
}
