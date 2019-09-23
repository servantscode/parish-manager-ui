import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormBuilder, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, debounceTime, switchMap } from 'rxjs/operators'

import { deepEqual } from '../utils';
import { EnumValue } from '../enum-value';

@Component({
  selector: 'app-sc-multi-enum',
  templateUrl: './sc-multi-enum.component.html',
  styleUrls: ['./sc-multi-enum.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ScMultiEnumComponent),
      multi: true
    }
  ]
})
export class ScMultiEnumComponent implements ControlValueAccessor, OnInit {
  @Input() label = 'Enum';
  @Input() required = false;
  @Input() fieldSize = 'standard';

  @Input() valueSource: () => Observable<string[]>;

  items: EnumValue[];
  selected: string[];
  
  onChange: any = () => { };
  onTouched: any = () => { };

  form = this.fb.group({
      input: ['']
    });
  
  notifyObservers() {
    const newVal = this.form.get('input').value.map(e => e.value);
    if(deepEqual(newVal, this.selected))
      return

    this.selected = newVal;
    this.onChange(newVal);
    this.onTouched();
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.valueSource().subscribe(values => {
        this.items = values? values.map(item => new EnumValue(item)): null;
        const selectedItems: EnumValue[] = this.items.filter(i => this.selected.includes(i.value));
        this.form.get('input').setValue(selectedItems);
      });

    this.form.get('input').valueChanges.subscribe(value => {
        this.notifyObservers();
      });
  }

  //ControlValueAccesssor
  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) { 
    this.onTouched = fn;
  }

  writeValue(value) {
    this.selected = value;
    this.form.get('input').setValue(value? value.map(item => new EnumValue(item)): null);
  }

  setDisabledState( isDisabled : boolean ) : void {
    for(let control in this.form.controls) {
      var field = this.form.get(control);
      isDisabled ? field.disable() : field.enable();
    }
  }
}
