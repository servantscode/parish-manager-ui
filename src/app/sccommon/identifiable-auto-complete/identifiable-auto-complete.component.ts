import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormBuilder, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, debounceTime, switchMap } from 'rxjs/operators'

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
  @Input('value') _value;
  @Input() required = false;
  @Input() disabled = false;

  @Input() selectIdentity = false;
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
    if(!this.selected) {
      if(this.selectIdentity) {
        const mockItem =this.autocompleteService.getTemplate()
        mockItem.identifyAs(val);
        this.autocompleteForm.get("input").setValue(mockItem);
        this.selectItem(mockItem);
      }
      else {
        this.autocompleteService.get(val).subscribe(item => {
              this.autocompleteForm.get("input").setValue(item);
              this.selectItem(item);
            });
      }
    }
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    if(this.disabled) {
      this.autocompleteForm.get("input").disable();
    } else {
      this.filteredItems = this.autocompleteForm.get('input').valueChanges
        .pipe(
          debounceTime(300),
          map(value => typeof value === 'string' ? value : value.identify()),
          switchMap(value => this.autocompleteService.getPage(0, 10, value)
              .pipe(map(resp => resp.results))
            )
        );
    }
  }

  identifyItem(item?: any): string | undefined {
    return item ? typeof item === 'string' ? item : item.identify() : undefined;
  }

  selectItem(item: T): void {
    this.selected = item;
    this.value = this.selectIdentity? item.identify(): item.id;
    if(!this.value)
       alert('Could not set value from: ' + JSON.stringify(item));
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
