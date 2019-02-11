import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormBuilder, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap, map, switchMap, debounceTime } from 'rxjs/operators'

import { PaginatedService } from '../services/paginated.service';
import { Identifiable } from '../identifiable';

@Component({
  selector: 'app-identifiable-auto-complete',
  templateUrl: './identifiable-auto-complete.component.html',
  styleUrls: ['./identifiable-auto-complete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IdentifiableAutoCompleteComponent),
      multi: true
    }
  ]
})
export class IdentifiableAutoCompleteComponent<T extends Identifiable> implements ControlValueAccessor, OnInit {
  @Input() label = 'AutoSelect';
  @Input('value') _value:number = 0;

  @Input() autocompleteService: PaginatedService<T>

  filteredItems: Observable<T[]>;
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
    this._value = val;
    this.onChange(val);
    this.onTouched();
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.filteredItems = this.autocompleteForm.get('input').valueChanges
      .pipe(
        debounceTime(300),
        map(value => typeof value === 'string' ? value : value.name),
        switchMap(value => this.autocompleteService.getPage(0, 10, value)
            .pipe(map(resp => resp.results))
          )
      );
  }

  identifyItem(item?: any): string | undefined {
    return item ? typeof item === 'string' ? item : item.name : undefined;
  }

  selectItem(event: any): void {
    const item = event.option.value;
    this.selected = item;
    this.value = item.id;
  }

  //ControlValueAccesssor
  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) { 
    this.onTouched = fn;
  }

  writeValue(value) {
    if (value) {
      this.value = value;
    }
  }
}
