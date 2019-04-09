import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormBuilder, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, debounceTime, switchMap } from 'rxjs/operators'

import { EnumValue } from '../enum-value';

@Component({
  selector: 'app-sc-enum',
  templateUrl: './sc-enum.component.html',
  styleUrls: ['./sc-enum.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ScEnumComponent),
      multi: true
    }
  ]
})
export class ScEnumComponent implements ControlValueAccessor, OnInit {
  @Input() label = 'Enum';
  @Input('value') _value;
  @Input() required = false;
  @Input() fieldSize = 'standard';

  @Input() valueSource: () => Observable<string[]>;

  filteredItems: Observable<EnumValue[]>;
  private selected: EnumValue;
  
  onChange: any = () => { };
  onTouched: any = () => { };

  autocompleteForm = this.fb.group({
      input: ['']
    });
  
  get value() {
    return this._value;
  }

  set value(val) {
    var rawVal = val? (typeof val === 'string')? val: val.value: null;
    var enumVal = val? (typeof val === 'string')? new EnumValue(val): val: null;

    this.selected = enumVal;
    this.autocompleteForm.get("input").setValue(enumVal);

    this._value = rawVal;
    this.onChange(rawVal);
    this.onTouched();
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.filteredItems = this.autocompleteForm.get('input').valueChanges
      .pipe(
        debounceTime(300),
        map(value => value? typeof value === 'string' ? value : value.display: ""),
        switchMap(value => this.valueSource().pipe(
          map(resp => resp? resp.filter(val => val.startsWith(value.toUpperCase().replace(/\s/, "_")))
                          .map(item => new EnumValue(item)): null)
        ))
      );
  }

  selectItem(item: EnumValue): void {
    this.value = item;
  }

  displayName(item?: any): string | undefined {
    return item ? 
      typeof item === 'string' ? 
        item : 
        item.display : 
      undefined;
  }

  //ControlValueAccesssor
  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) { 
    this.onTouched = fn;
  }

  writeValue(value) {
    this.value = value;
  }

  setDisabledState( isDisabled : boolean ) : void {
    for(let control in this.autocompleteForm.controls) {
      var field = this.autocompleteForm.get(control);
      isDisabled ? field.disable() : field.enable();
    }
  }
}
