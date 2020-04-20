import { Component, OnInit, Input, forwardRef, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'

import { SCValidation } from '../validation';
import { Address } from '../address';
import { deepEqual } from '../utils';

@Component({
  selector: 'sc-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressComponent),
      multi: true
    }
  ]
})
export class AddressComponent implements OnInit, OnChanges {

  form = this.fb.group({
          street1: [''],
          city: [''],
          state: ['', [SCValidation.actualState()]],
          zip: ['', [Validators.pattern(/^\d{5}$/)]]
        })

  filteredOptions: Observable<string[]>;

  value: Address;

  disabled = false;
  onChange: any = () => { };
  onTouched: any = () => { };

  @Input() required = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.filteredOptions = this.form.get('state').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    this.form.valueChanges.subscribe(addr => {
        this.detectChanges((!this.required || this.form.valid)? addr: null);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.required) {
      this.form.get("street1").setValidators([Validators.required]);
      this.form.get("city").setValidators([Validators.required]);
      this.form.get("state").setValidators([SCValidation.actualState(), Validators.required]);
      this.form.get("zip").setValidators([Validators.pattern(/^\d{5}$/), Validators.required]);
    } else {
      this.form.get("street1").clearValidators();
      this.form.get("city").clearValidators();
      this.form.get("state").setValidators([SCValidation.actualState()]);
      this.form.get("zip").setValidators([Validators.pattern(/^\d{5}$/)]);
    }
  }

  private detectChanges(val: Address) {
    if(deepEqual(val, this.value))
      return;

    this.value = val;
    this.onChange(val);
    this.onTouched();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return SCValidation.STATES.filter(option => option.toLowerCase().startsWith(filterValue));
  }

  capitalizeState(): void {
    const stateField = this.form.get("state");
    stateField.setValue(stateField.value.toUpperCase());
  }

  //ControlValueAccesssor
  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) { 
    this.onTouched = fn;
  }

  writeValue(value: Address) {
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
