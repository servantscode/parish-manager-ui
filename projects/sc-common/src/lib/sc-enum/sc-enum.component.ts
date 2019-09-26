import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormBuilder, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, of } from 'rxjs';
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
  @Input() label = '';
  @Input() required = false;
  @Input() fieldSize = 'standard';
  @Input() nullValue: string;

  @Input() valueSource: () => Observable<string[]>;

  items: EnumValue[];
  filteredItems: Observable<EnumValue[]>;
  private selected: EnumValue;
  
  onChange: any = () => { };
  onTouched: any = () => { };

  form = this.fb.group({
      input: ['']
    });
  

  constructor(private fb: FormBuilder) { }

  ngOnInit() {

    this.valueSource().subscribe(values => {
        this.items = values? values.map(item => new EnumValue(item)): null;
        this.reconcileForm();

        if(this.items.length<=10) //If select mode, set change listener
          this.form.get('input').valueChanges.subscribe(val => this.notifyObservers(val));
        else //Else, set auto-complete listener
          this.filteredItems = this.form.get('input').valueChanges
            .pipe(
              debounceTime(300),
              map(value => value? typeof value === 'string' ? value : value.display: ""),
              switchMap(input => of(this.items).pipe(
                map(resp => resp? resp.filter(val => val.value.startsWith(input.toUpperCase().replace(/\s/, "_"))): null)
              ))
            );
      });
  }

  notifyObservers(val: EnumValue) {
    if(val == this.selected)
      return;

    this.selected = val;
    this.onChange(this.selected.value);
    this.onTouched();
  }

  calculateLabel() {
    if(!this.selected && this.nullValue)
      return this.nullValue
    else
      return this.label;
  }

  selectItem(item: EnumValue): void {
    this.notifyObservers(item);
  }

  displayName(item?: any): string | undefined {
    return item ? 
      typeof item === 'string' ? 
        item : 
        item.display : 
      undefined;
  }

  reconcileForm() {
    if(this.selected && this.items) {
      const item = this.items.find(i => i.value == this.selected.value);
      this.selected = item;
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
    this.selected = value? new EnumValue(value): null;
    this.reconcileForm();
  }

  setDisabledState( isDisabled : boolean ) : void {
    for(let control in this.form.controls) {
      var field = this.form.get(control);
      isDisabled ? field.disable() : field.enable();
    }
  }
}
