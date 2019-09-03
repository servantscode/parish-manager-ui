import { Component, OnInit, OnChanges, SimpleChanges, Input, forwardRef } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup, AbstractControl, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators'

import { SCValidation } from '../../sccommon/validation';

import { PersonService } from '../../sccommon/services/person.service';

import { Person } from '../../sccommon/person';
import { deepEqual } from '../../sccommon/utils';

import { PhoneNumber } from '../../sccommon/person';

@Component({
  selector: 'app-person-phone-number',
  templateUrl: './person-phone-number.component.html',
  styleUrls: ['./person-phone-number.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PersonPhoneNumberComponent),
      multi: true
    }
  ]
})
export class PersonPhoneNumberComponent implements OnInit {
  public phoneNumberTypes = this.personService.getPhoneNumberTypes.bind(this.personService);

  form = this.fb.group({
      phoneNumbers: this.fb.array([])
    });

  //, Validators.pattern(SCValidation.PHONE)

  value: PhoneNumber[];

  @Input() disabled = false;
  changeListener: Subscription;
  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(private fb: FormBuilder,
              public personService: PersonService) { }

  ngOnInit() {
    this.enableUpdates();
  }

  enableUpdates() {
    if(this.changeListener)
      return;

    this.changeListener = this.form.valueChanges.subscribe(phoneNumbers => this.detectChanges(phoneNumbers.phoneNumbers));
  }

  diableUpdates() {
    if(this.changeListener) {
      this.changeListener.unsubscribe();
      this.changeListener = null;
    }
  }

  phoneNumberControls(): FormArray {
    return <FormArray>this.form.controls['phoneNumbers'];
  }

  private updateForm() {
    this.diableUpdates();
    // this.relationshipListeners.forEach(listener => listener.unsubscribe());
    // this.relationshipListeners = [];
    const relationships = this.phoneNumberControls();
    relationships.clear();

    if(this.value) {
      for(let number of this.value) {
        relationships.push(this.createRow());
      }
    }

    if(this.value)
      this.form.patchValue({"phoneNumbers": this.value});

    //One more for additional input
    relationships.push(this.createRow())

    this.enableUpdates();
  }

  private createRow() {
    return this.fb.group({
        phoneNumber: ["", Validators.required],
        type: ["", Validators.required],
        primary: false
    });
  }

  private detectChanges(val: PhoneNumber[]) {
    if(deepEqual(val, this.value))
      return;

    this.value = val;
    this.onChange(val);
    this.onTouched();
  }

  //ControlValueAccesssor
  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) { 
    this.onTouched = fn;
  }

  writeValue(value: PhoneNumber[]) {    
    this.value = value;
    this.updateForm();
  }

  setDisabledState( isDisabled : boolean ) : void {
    this.disabled = isDisabled;
    for(let control in this.form.controls) {
      var field = this.form.get(control);
      isDisabled ? field.disable() : field.enable();
    }
  }
}
