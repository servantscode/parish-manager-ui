import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormBuilder, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, debounceTime, switchMap } from 'rxjs/operators'

import { PersonService } from '../../sccommon/services/person.service';
import { Autocompletable } from '../../sccommon/identifiable';

import { Person } from '../../sccommon/person';

import { Identity } from '../../sccommon/identity';

@Component({
  selector: 'app-identity-picker',
  templateUrl: './identity-picker.component.html',
  styleUrls: ['./identity-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IdentityPickerComponent),
      multi: true
    }
  ]
})
export class IdentityPickerComponent implements OnInit {
  @Input() label = 'AutoSelect';
  @Input('value') _value = {name: '', id: 0};
  @Input() required = false;

  filteredItems: Observable<Person[]>;

  onChange: any = () => { };
  onTouched: any = () => { };

  autocompleteForm = this.fb.group({
      input: {name: '', id: 0}
    });
  
  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    this.onChange(val);
    this.onTouched();
  }

  getIdentity(item: any) {
    var identity = new Identity();

    if(!item) {
    } if(typeof item === 'string') {
      identity.name = item;
    } else {
      identity.name = item.name;
      identity.id = item.id;
    }
    return identity;
  }

  constructor(private fb: FormBuilder, 
              private personService: PersonService) { }

  ngOnInit() {
    this.filteredItems = this.autocompleteForm.get('input').valueChanges
      .pipe(
        debounceTime(300),
        map(value => value? 
                      typeof value === 'string' ? 
                        value : 
                        value.identify?
                          value.identify(): 
                          value.name:
                      ""),
        switchMap(value => this.personService.getPage(0, 10, value)
            .pipe(map(resp => resp.results))
          )
      );
  }

  identifyItem(item?: any): string | undefined {
    return item ? item.name : undefined;
  }

  selectItem(item: any): void {
    if(typeof item === 'string' && this._value && item == this._value.name)
        return;

    this.value = this.getIdentity(item);
  }

  //ControlValueAccesssor
  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) { 
    this.onTouched = fn;
  }

  writeValue(value) {
    if(value && value != "") {
      this.value = this.getIdentity(value);
      this.autocompleteForm.get('input').setValue(value);
    }
  }

  setDisabledState( isDisabled : boolean ) : void {
    for(let control in this.autocompleteForm.controls) {
      var field = this.autocompleteForm.get(control);
      isDisabled ? field.disable() : field.enable();
    }
  }
}