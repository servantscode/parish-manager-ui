import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormBuilder, Validators, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, debounceTime, switchMap } from 'rxjs/operators'

import { SCValidation } from '../validation';

@Component({
  selector: 'app-sc-phone-number',
  templateUrl: './sc-phone-number.component.html',
  styleUrls: ['./sc-phone-number.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ScPhoneNumberComponent),
      multi: true
    }
  ]
})
export class ScPhoneNumberComponent implements OnInit {
  @Input() label = 'Phone Number';
  @Input('value') _value;
  @Input() required = false;
  onChange: any = () => { };
  onTouched: any = () => { };

  form = this.fb.group({
      input: ['', Validators.pattern(SCValidation.PHONE)]
    });
  
  get value() {
    return this._value;
  }

  set value(val) {
    if(this._value === val)
      return;

    this._value = val;
    const input = this.form.get("input").setValue(val);
    this.onChange(val);
    this.onTouched();
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

  formatPhoneNumber(): void {
    this.value = ScPhoneNumberComponent.formatPhone(this.form.get("input").value);
  }

  static formatPhone (tel): string {
    if (!tel) { return ''; }

    var value = tel.toString().trim().replace(/^\+/, '');
    value = value.replace(/[\D]/g, '');

    if (value.match(/[^0-9]/)) {
      return tel;
    }

    var country, city, number;

    switch (value.length) {
      case 4:
      case 5:
      case 6:
      case 7:
        return value.slice(0, 3) + '-' + value.slice(3);
        break;

      case 8: 
      case 9:
      case 10: // +1PPP####### -> C (PPP) ###-####
        country = 1;
        city = value.slice(0, 3);
        number = value.slice(3);
        break;

      case 11: // +CPPP####### -> CCC (PP) ###-####
        country = value[0];
        city = value.slice(1, 4);
        number = value.slice(4);
        break;

      case 12: // +CCCPP####### -> CCC (PP) ###-####
        country = value.slice(0, 3);
        city = value.slice(3, 5);
        number = value.slice(5);
        break;

      default:
        return value;
    }

    if (country == 1) {
      country = "";
    }

    number = number.slice(0, 3) + '-' + number.slice(3);

    return (country + " (" + city + ") " + number).trim();
  };

  //ControlValueAccesssor
  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) { 
    this.onTouched = fn;
  }

  writeValue(value) {
    if(value)
      this.value = value;
  }

  setDisabledState( isDisabled : boolean ) : void {
    for(let control in this.form.controls) {
      var field = this.form.get(control);
      isDisabled ? field.disable() : field.enable();
    }
  }
}
