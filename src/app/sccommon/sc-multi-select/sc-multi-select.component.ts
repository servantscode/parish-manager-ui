import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormBuilder, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, debounceTime, switchMap } from 'rxjs/operators'

import { PaginatedService } from '../services/paginated.service';
import { Autocompletable } from '../identifiable';
import { PaginatedResponse } from '../paginated.response';

import { doLater, deepEqual } from '../utils';

@Component({
  selector: 'app-sc-multi-select',
  templateUrl: './sc-multi-select.component.html',
  styleUrls: ['./sc-multi-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ScMultiSelectComponent),
      multi: true
    }
  ]
})
export class ScMultiSelectComponent<T extends Autocompletable> implements ControlValueAccessor, OnInit {
  @Input() label = 'MultiSelect';
  @Input() fieldSize = 'standard';

  @Input() autocompleteService: PaginatedService<T>;
  @Input() pathParams: any = null;

  items: T[];
  private selected: T[];
  private selectedIds: number[];

  onChange: any = () => { };
  onTouched: any = () => { };

  form = this.fb.group({
      input: ['']
    });
  
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.autocompleteService.getPage(0, -1, '', this.pathParams).subscribe(resp => {
        this.items = resp.results;
        if(this.selectedIds)
          this.selected = this.items.filter(item => this.selectedIds.includes(item.id));
        this.form.get('input').setValue(this.selected);
      });

    this.form.get('input').valueChanges.subscribe(newValue => {
        this.notifyObservers(newValue);
      });
  }

  notifyObservers(val: T[]) {
    if(deepEqual(val, this.selected))
      return;

    this.selected = val;
    this.selectedIds = val? val.map(v => v.id): [];
    this.onChange(this.selectedIds);
    this.onTouched();
  }

  displayValue(): string {
    const inputValue = this.form.get('input').value;
    return inputValue ? inputValue.slice(0,3).map(i => i.identify()) : '';
  }

  //ControlValueAccesssor
  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) { 
    this.onTouched = fn;
  }

  writeValue(value) {
    this.selectedIds = value;
    this.selected = this.items? this.items.filter(i => this.selectedIds.includes(i.id)): [];
    this.form.get('input').setValue(this.selected);
  }

  setDisabledState( isDisabled : boolean ) : void {
    for(let control in this.form.controls) {
      var field = this.form.get(control);
      isDisabled ? field.disable() : field.enable();
    }
  }
}
