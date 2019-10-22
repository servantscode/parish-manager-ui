import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PreferencesService } from '../services/preferences.service';

import { Preference, PreferenceSource } from '../preference';
import { deepEqual } from '../utils';

@Component({
  selector: 'sc-preference-form',
  templateUrl: './preference-form.component.html',
  styleUrls: ['./preference-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PreferenceFormComponent),
      multi: true
    }
  ]
})
export class PreferenceFormComponent implements OnInit {

  @Input() type: string;

  preferenceFields: Preference[];

  onChange: any = () => { };
  onTouched: any = () => { };

  isDisabled: boolean = false;
  currentValues: any = {};

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
            const control = this.fb.control(this.parseValue(pref));
            prefControls.push(control);
            if(this.isDisabled)
              control.disable();
          }
          
          this.reconcileForm();

          //Wait for form to be built before notifying changes
          this.preferencesForm.valueChanges.subscribe(() => this.notifyObservers(this.collectPreferences()));
        });
  }


  notifyObservers(val: any) {
    if(deepEqual(val, this.currentValues))
      return;

    this.currentValues = val;
    this.onChange(this.currentValues);
    this.onTouched();
  }


  preferenceControls(): FormArray {
    return <FormArray>this.preferencesForm.controls['preferences'];
  }

  private parseValue(prefField: Preference, value?: any) {
    var val = !value? prefField.defaultValue: value;
    if(val && prefField.type == 'BOOLEAN')
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


  reconcileForm() {
    if(this.currentValues && this.preferenceFields) {
      Object.keys(this.currentValues).forEach(pref => {
        const index = this.preferenceFields.findIndex(ap => ap.name == pref);
        var value = this.parseValue(this.preferenceFields[index], this.currentValues[pref]);
        this.preferenceControls().at(index).setValue(value, {'emitEvent': false});
      })
    }
  }

  //ControlValueAccesssor
  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) { 
    this.onTouched = fn;
  }

  writeValue(value: any) {
    this.currentValues = value;
    this.reconcileForm();
  }

  setDisabledState( isDisabled : boolean ) : void {
    this.isDisabled = isDisabled;
    for(let control in this.preferencesForm.controls) {
      var field = this.preferencesForm.get(control);
      isDisabled ? field.disable() : field.enable();
    }
  }
}
