import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith, reduce } from 'rxjs/operators'

import { SCValidation } from 'sc-common';
import { Family, Person } from 'sc-common';
import { FamilyService } from 'sc-common';

import { deepEqual } from 'sc-common';

@Component({
  selector: 'app-family-form',
  templateUrl: './family-form.component.html',
  styleUrls: ['./family-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FamilyFormComponent),
      multi: true
    }
  ]
})
export class FamilyFormComponent implements OnInit {

  form = this.fb.group({
      id: '',
      surname: ['', Validators.required],
      homePhone: ['', Validators.pattern(SCValidation.PHONE)],
      envelopeNumber: ['', Validators.pattern(SCValidation.NUMBER)],
      address: [null, Validators.required],
      preferences: {}
    });

  value: Family;

  disabled = false;
  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(private fb: FormBuilder,
              public familyService: FamilyService) { }

  ngOnInit() {
      this.form.valueChanges.subscribe(family => {
        this.detectChanges(this.form.valid? family: null);
      });
  }

  assignEnvelopeNumber() {
    this.familyService.getNextEnvelope().subscribe(envelopeNum => this.form.get('envelopeNumber').setValue(envelopeNum));
  }

  private detectChanges(val: Family) {
    if(deepEqual(val, this.value))
      return;

    this.value = val;
    this.onChange(val);
    this.onTouched();
  }

  //ControlValueAccesssor
  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) { 
    this.onTouched = fn;
  }

  writeValue(value: Family) {
    if(!value)
      return;
    
    this.value = value;
    this.form.patchValue(value);
  }

  setDisabledState( isDisabled : boolean ) : void {
    this.disabled = isDisabled;
    for(let control in this.form.controls) {
      var field = this.form.get(control);
      isDisabled ? field.disable() : field.enable();
    }
  }
}