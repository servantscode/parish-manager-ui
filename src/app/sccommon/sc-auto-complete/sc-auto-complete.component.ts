import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormBuilder, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, debounceTime, switchMap } from 'rxjs/operators'

import { PaginatedService } from '../services/paginated.service';
import { Autocompletable } from '../identifiable';
import { PaginatedResponse } from '../paginated.response';

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
  @Input() autocompleteService: PaginatedService<T>;
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
    return this.itemValue(this.selected);
  }

  set value(val) {
    alert("Don't set a value this way!");
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.enableAutocomplete();
  }

  identifyItem(item?: any): string | undefined {
    return item ? typeof item === 'string' ? item : item.identify() : undefined;
  }

  selectItem(item: T): void {
    this.selected = item;
    this.setInputValue(item);

    this.onChange(this.itemValue(item));
    this.onTouched();
  }

  private enableAutocomplete() {
    this.filteredItems = this.autocompleteForm.get('input').valueChanges
      .pipe(
        debounceTime(300),
        map(value => value? typeof value === 'string' ? value : value.identify(): ""),
        switchMap(value => this.loadOptions(value))
      );
  }

  private disableAutocomplete() {
    this.filteredItems = null;
  }

  private loadOptions(value: string): Observable<T[]> {
    return this.autocompleteService.getPage(0, 10, value, this.pathParams)
        .pipe(map(resp => (this.filter? this.filter(resp.results): resp.results)));
  }

  private itemValue(item: any) {
    return this.selectObject? 
        item: 
        this.selectIdentity? 
            item.identify(): 
            item.id;
  }

  private setInputValue(displayValue: any) {
    this.disableAutocomplete();
    this.autocompleteForm.get("input").setValue(displayValue);
    this.enableAutocomplete();    
  }

  private resolveSelectedItem(rawValue) {
    if(this.selectIdentity) {
      //If all we need is the identity, just mock it to save the round trip...
      const mockItem =this.autocompleteService.getTemplate();
      mockItem.identifyAs(rawValue);
      this.autocompleteForm.get("input").setValue(mockItem);
      this.selected = mockItem;
    } else {
      //Otherwise, go get it from the server.
      this.autocompleteService.get(rawValue, this.pathParams).subscribe(item => {
            this.setInputValue(item);
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
    this.selected = value;
    if((typeof value === 'string' && value !== "") || (typeof value === 'number' && value != 0))
      this.resolveSelectedItem(value);
    else 
      this.setInputValue(value);
  }

  setDisabledState( isDisabled : boolean ) : void {
    for(let control in this.autocompleteForm.controls) {
      var field = this.autocompleteForm.get(control);
      isDisabled ? field.disable() : field.enable();
    }
  }
}
