import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormBuilder, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, debounceTime, switchMap } from 'rxjs/operators'

import { PaginatedService } from 'sc-common';
import { Identifiable } from 'sc-common';

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
  @Input() required = false;
  @Input() fieldSize = 'standard';
  @Input() nullValue: string;
  @Input() filter;

  @Input() autocompleteService: PaginatedService<T>

  private selectedId: number;  
  private selected: T;
  items: T[];

  onChange: any = () => { };
  onTouched: any = () => { };

  form = this.fb.group({
      input: ['']
    });
  
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.autocompleteService.getPage(0, 200).subscribe(resp => {
        if(resp.totalResults > 200)
          alert("Too many results to show in dropdown");
        this.items = this.filter? this.filter(resp.results): resp.results;
        this.reconcileForm();
      });

    this.form.get('input').valueChanges.subscribe(val => this.notifyObservers(val));
  }

  notifyObservers(val: T) {
    if(val == this.selected)
      return;

    this.selected = val;
    this.selectedId = val? val.id: 0;
    this.onChange(this.selectedId);
    this.onTouched();
  }

  calculateLabel() {
    if(!this.selectedId && this.nullValue)
      return this.nullValue
    else
      return this.label;
  }

  reconcileForm() {
    if(this.items && this.selectedId) {
      const item = this.items.find(item => item.id === this.selectedId);
      this.selected=item;
      this.form.get("input").setValue(item, {emitEvent: false});
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
    this.selectedId = value;
    this.reconcileForm();
  }

  setDisabledState( isDisabled : boolean ) : void {
    for(let control in this.form.controls) {
      var field = this.form.get(control);
      isDisabled ? field.disable() : field.enable();
    }
  }
}
