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
  selected: EnumValue[];
  
  onChange: any = () => { };
  onTouched: any = () => { };

  form = this.fb.group({
      input: ['']
    });
  
  notifyObservers(input: EnumValue[]) {
    if(deepEqual(input, this.selected))
      return

    this.selected = input;
    this.onChange(this.selected.map(e => e.value));
    this.onTouched();
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.valueSource().subscribe(values => {
        this.items = values? values.map(item => new EnumValue(item)): [];
        this.reconcileForm();
      });

    this.form.get('input').valueChanges.subscribe(value => this.notifyObservers(value? value: []));
  }

  reconcileForm() {
    if(this.selected && this.items) {
      const selectedValues = this.selected.map(v => v.value);
      const selectedItems: EnumValue[] = this.items.filter(i => selectedValues.includes(i.value));
      this.selected = selectedItems;
    } 
    this.form.get('input').setValue(this.selected, {emitEvent:false});
  }

  //ControlValueAccesssor
  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) { 
    this.onTouched = fn;
  }

  writeValue(value) {
    this.selected = value? value: [];
    this.reconcileForm();
  }

  setDisabledState( isDisabled : boolean ) : void {
    for(let control in this.form.controls) {
      var field = this.form.get(control);
      isDisabled ? field.disable() : field.enable();
    }
  }
}
