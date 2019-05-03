import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormBuilder, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, debounceTime, switchMap } from 'rxjs/operators'

import { PaginatedService } from '../services/paginated.service';
import { Autocompletable } from '../identifiable';

@Component({
  selector: 'app-sc-auto-complete',
  templateUrl: './sc-auto-complete.component.html',
  styleUrls: ['./sc-auto-complete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ScAutoCompleteComponent),
      multi: true
    }
  ]
})
export class ScAutoCompleteComponent<T extends Autocompletable> implements ControlValueAccessor, OnInit {
  @Input() label = 'AutoSelect';
  @Input('value') _value;
  @Input() required = false;
  @Input() fieldSize = 'standard';

  @Input() selectIdentity = false;
  @Input() selectObject = false;
  @Input() autocompleteService: PaginatedService<T>
  @Input() pathParams: any = null;

  @Input() filter;

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
    return this.selectObject? 
        item: 
        this.selectIdentity? 
            item.identify(): 
            item.id;
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.filteredItems = this.autocompleteForm.get('input').valueChanges
      .pipe(
        debounceTime(300),
        map(value => value? typeof value === 'string' ? value : value.identify(): ""),
        switchMap(value => this.autocompleteService.getPage(0, 10, value, this.pathParams)
            .pipe(map(resp => (this.filter? this.filter(resp.results): resp.results)))
          )
      );
  }

  identifyItem(item?: any): string | undefined {
    return item ? typeof item === 'string' ? item : item.identify() : undefined;
  }

  selectItem(item: T): void {
    this.value = item;
  }

  resolveSelectedItem(rawValue) {
    if(this.selectIdentity) {
      //If all we need is the identity, just mock it to save the round trip...
      const mockItem =this.autocompleteService.getTemplate();
      mockItem.identifyAs(rawValue);
      this.autocompleteForm.get("input").setValue(mockItem);
      this.selected = mockItem;
    } else {
      //Otherwise, go get it from the server.
      this.autocompleteService.get(rawValue, this.pathParams).subscribe(item => {
            this.autocompleteForm.get("input").setValue(item);
            this.selected = item;
          });
    }
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
