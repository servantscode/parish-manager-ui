import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormBuilder, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, debounceTime, switchMap } from 'rxjs/operators'

import { PaginatedService } from '../services/paginated.service';
import { Identifiable } from '../identifiable';

@Component({
  selector: 'app-sc-select',
  templateUrl: './sc-select.component.html',
  styleUrls: ['./sc-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ScSelectComponent),
      multi: true
    }
  ]
})
export class ScSelectComponent<T extends Identifiable> implements ControlValueAccessor, OnInit {
  @Input() label = 'Select';
  @Input('value') _value;
  @Input() required = false;
  @Input() fieldSize = 'standard';

  @Input() selectObject = false;
  @Input() autocompleteService: PaginatedService<T>

  @Input() filter;

  private selected: T;

  onChange: any = () => { };
  onTouched: any = () => { };

  autocompleteForm = this.fb.group({
      input: ['']
    });
  
  get value() {
    return this._value;
  }

  set value(val) {
    var rawVal = val? (typeof val === 'string' || typeof val === 'number')? 
        val: 
        this.itemValue(val): 
      null;

    if((typeof val === 'string' && val !== "") || (typeof val === 'number' && val != 0)) { 
      this.resolveSelectedItem(rawVal);
    } else {
      this.selected = val;
      this.autocompleteForm.get("input").setValue(val);
    }

    this._value = rawVal;
    this.onChange(rawVal);
    this.onTouched();
  }

  itemValue(item: any) {
    return this.selectObject? item: item.id;
  }

  items = [];

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.autocompleteService.getPage(0, 200).subscribe(resp => {
        if(resp.totalResults > 200)
          alert("Too many results to show in dropdown");
        this.items = this.filter? this.filter(resp.results): resp.results;
        if(this.value) {
          const item = this.items.find(item => this.itemValue(item) === this.value);
          this.autocompleteForm.get("input").setValue(item);
        }
      });
  }

  identifyItem(item?: any): string | undefined {
    return item ? typeof item === 'string' ? item : item.identify() : undefined;
  }

  selectItem(item: T): void {
    this.value = item;
  }

  resolveSelectedItem(rawValue) {
    this.autocompleteService.get(rawValue).subscribe(item => {
        this.autocompleteForm.get("input").setValue(item);
        this.selected = item;
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
    if(value)
      this.value = value;
  }

  setDisabledState( isDisabled : boolean ) : void {
    for(let control in this.autocompleteForm.controls) {
      var field = this.autocompleteForm.get(control);
      isDisabled ? field.disable() : field.enable();
    }
  }
}
