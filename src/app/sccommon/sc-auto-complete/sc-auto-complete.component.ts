import { Component, OnInit, Input, forwardRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, debounceTime, switchMap, startWith } from 'rxjs/operators'

import { PaginatedService } from '../services/paginated.service';
import { Autocompletable } from '../identifiable';
import { PaginatedResponse } from '../paginated.response';

import { doLater } from '../utils';

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
  @Input() type = 'standard';
  @Input() autoOpen = false;
  @Input() label = 'AutoSelect';
  @Input() required = false;
  @Input() fieldSize = 'standard';

  @Input() selectIdentity = false;
  @Input() selectObject = false;
  @Input() autocompleteService: PaginatedService<T>;
  @Input() pathParams: any = null;

  @Input() filter;

  @ViewChild('input', {static: false}) input:ElementRef;

  filteredItems: Observable<T[]>;
  private selected: T;

  onChange: any = () => { };
  onTouched: any = () => { };

  autocompleteForm = this.fb.group({
      input: ['']
    });
  
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    if(this.autoOpen) {
      this.filteredItems = this.autocompleteForm.get('input').valueChanges
        .pipe(startWith(''),
              debounceTime(200),
              map(value => value? typeof value === 'string' ? value : value.identify(): ""),
              switchMap(value => this.loadOptions(value))
           );
    } else {
      this.filteredItems = this.autocompleteForm.get('input').valueChanges
        .pipe(debounceTime(300),
              map(value => value? typeof value === 'string' ? value : value.identify(): ""),
              switchMap(value => this.loadOptions(value))
           );
    }
  }

  setFocus() {
    this.input.nativeElement.focus();
  }

  identifyItem(item?: any): string | undefined {
    return item ? typeof item === 'string' ? item : item.identify() : undefined;
  }

  selectItem(item: T): void {
    if(this.selected == item)
      return;

    this.selected = item;
    this.setInputValue(item);

    this.onChange(this.itemValue(item));
    this.onTouched();
  }

  verifyInput() {
    // Hate this! But putting the blur on the input to verify it eats the click selection on the drop down.
    // There is ongoing discussion about a force selection feature here: https://github.com/angular/components/issues/3334
    setTimeout(this.doVerifyInput.bind(this), 50);
  }

  doVerifyInput() {
    const rawValue = this.autocompleteForm.get('input').value;
    if(!rawValue) {
      this.selectItem(null);
    } else if(this.selected != rawValue) {
      this.autocompleteService.getPage(0, 1, rawValue, this.pathParams).subscribe(resp => {
          if(resp.totalResults == 1)
            this.selectItem(resp.results[0]);
          else
            this.setInputValue(this.selected);
        });
    }
  }

  private loadOptions(value: string): Observable<T[]> {
    return this.autocompleteService.getPage(0, 10, value, this.pathParams)
        .pipe(map(resp => (this.filter? this.filter(resp.results): resp.results)));
  }

  private itemValue(item: any) {
    return !item?
        null:
        this.selectObject? 
          item: 
          this.selectIdentity? 
              item.identify(): 
              item.id;
  }

  private setInputValue(displayValue: any) {
    this.autocompleteForm.get("input").setValue(displayValue, {emitEvent:false});
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
