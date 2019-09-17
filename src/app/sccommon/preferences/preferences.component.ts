import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup, AbstractControl } from '@angular/forms';

import { PreferencesService } from 'sc-common';

import { Preference, PreferenceSource } from 'sc-common';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {

  @Input() id: number;
  @Input() type: string;
  @Input() preferenceSource: PreferenceSource;

  preferenceFields: Preference[];
  changesReady = false;

  preferencesForm = this.fb.group({
      preferences: this.fb.array([])
    });


  constructor(private preferencesService: PreferencesService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.preferencesService.getPage(0, 0, `objectType:${this.type}`)
      .subscribe(resp => {
          this.preferenceFields = resp.results;
          const prefControls = this.preferenceControls();
          for(let pref of this.preferenceFields) {
            prefControls.push(this.fb.control(this.parseValue(pref)));
          }
          this.populatePreferences();
        });

    this.preferencesForm.valueChanges.subscribe(() => this.changesReady = true);
  }

  preferenceControls(): FormArray {
    return <FormArray>this.preferencesForm.controls['preferences'];
  }

  save() {
    const prefs = this.collectPreferences();
    this.preferenceSource.updatePreferences(this.id, prefs).subscribe(() => this.changesReady = false);
  }

  private populatePreferences() {
    this.preferenceSource.getPreferences(this.id).subscribe(prefs => {
        Object.keys(prefs).forEach(pref => {
          const index = this.preferenceFields.findIndex(ap => ap.name == pref);
          var value = this.parseValue(this.preferenceFields[index], prefs[pref]);
          this.preferenceControls().at(index).setValue(value);
          this.changesReady = false;
        })
      });
  }

  private parseValue(prefField: Preference, value?: any) {
    var val = !value? prefField.defaultValue: value;
    if(prefField.type == 'BOOLEAN')
      val = JSON.parse(val);
    return val;
  }

  private collectPreferences(): any {
    var collectedPrefs = {};
    var prefFormValue = this.preferencesForm.get('preferences').value;
    var i=0;
    for(let pref of this.preferenceFields) {
      collectedPrefs[pref.name] = prefFormValue[i];
      i++;
    }
    return collectedPrefs;
  }
}
